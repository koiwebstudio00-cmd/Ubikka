import { useEffect, useState } from 'react';
const cache = new Map<string, { data: any; at: number }>();
const pending = new Map<string, Promise<any>>();
const initial = document.getElementById('initial-data');
if (initial?.textContent) {
  try { const value = JSON.parse(initial.textContent); if (value.url) cache.set(value.url, { data: value.data, at: Date.now() }); } catch { /* Load through API. */ }
}
function current(url: string) { const value = cache.get(url); return value && Date.now() - value.at < 30000 ? value.data : undefined; }
export function loadResource(url: string, force = false) {
  const data = current(url);
  if (!force && data !== undefined) return Promise.resolve(data);
  if (!pending.has(url)) {
    const request = fetch(url, { signal: AbortSignal.timeout(15000) }).then(async response => {
      if (response.status === 404) return { notFound: true };
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No pudimos cargar la información. Intentá nuevamente.');
      cache.set(url, { data: result, at: Date.now() }); return result;
    }).finally(() => pending.delete(url));
    pending.set(url, request);
  }
  return pending.get(url)!;
}
export function useResource(url: string) {
  const [retry, setRetry] = useState(0);
  const [state, setState] = useState(() => ({ url, data: cache.get(url)?.data, error: '' }));
  useEffect(() => {
    let active = true;
    setState({ url, data: cache.get(url)?.data, error: '' });
    loadResource(url, retry > 0).then(data => { if (active) setState({ url, data, error: '' }); })
      .catch(error => { if (active) setState({ url, data: cache.get(url)?.data, error: cache.has(url) ? '' : error.message }); });
    return () => { active = false; };
  }, [url, retry]);
  const stateForUrl = state.url === url ? state : { data: cache.get(url)?.data, error: '' };
  return { ...stateForUrl, loading: stateForUrl.data === undefined && !stateForUrl.error, retry: () => setRetry(n => n + 1) };
}
