export async function lokation(path: string, env: NodeJS.ProcessEnv, options: RequestInit = {}) {
  if (!env.LOKATION_API_URL || !env.LOKATION_API_KEY) throw new Error('Missing configuration');
  return fetch(`${env.LOKATION_API_URL.replace(/\/$/, '')}/v1/${path}`, {
    ...options, headers: { 'X-Api-Key': env.LOKATION_API_KEY, ...options.headers }, signal: AbortSignal.timeout(10000),
  });
}
