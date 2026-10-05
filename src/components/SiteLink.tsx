import type { ComponentProps } from 'react';
import { Link } from 'react-router-dom';
export function SiteLink({ href = '', ...props }: ComponentProps<'a'>) {
  return href.startsWith('/') || href.startsWith('#') ? <Link to={href} {...props} /> : <a href={href} {...props} />;
}
