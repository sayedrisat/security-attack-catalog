const shared = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };

export function Icon({ name, size = 20, className = '' }) {
  const paths = {
    recon: <><circle cx="12" cy="12" r="10" /><path d="m16.2 7.8-2 6.3-6.4 2 2-6.3z" /></>,
    config: <><path d="M4 7h16M4 17h16" /><circle cx="9" cy="7" r="2" /><circle cx="15" cy="17" r="2" /></>,
    auth: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></>,
    session: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
    authz: <><circle cx="8" cy="15" r="4" /><path d="m11 12 9-9 2 2-2 2-2-2-2 2 2 2-2 2-2-2-3 3" /></>,
    injection: <><path d="m4 5 6 6-6 6M12 19h8" /></>,
    client: <><rect x="2" y="4" width="20" height="15" rx="2" /><path d="M8 22h8M12 19v3" /></>,
    crypto: <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
    logic: <><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M8 7V5a4 4 0 0 1 8 0v2" /></>,
    infra: <><rect x="2" y="2" width="20" height="8" rx="2" /><rect x="2" y="14" width="20" height="8" rx="2" /><path d="M6 6h.01M6 18h.01" /></>,
    dos: <><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.1-2.1-.2-4.1 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.4-2.3 1-3a2.5 2.5 0 0 0 2.5 2.5z" /></>,
    cloud: <path d="M17.5 19H9a7 7 0 1 1 6.7-9h1.8a4.5 4.5 0 1 1 0 9Z" />,
    search: <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>,
    close: <><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6m0-6 6 6" /></>,
    copy: <><rect x="8" y="8" width="14" height="14" rx="2" /><path d="M4 16a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2" /></>,
    arrow: <path d="m9 18 6-6-6-6" />,
    up: <path d="m18 15-6-6-6 6" />,
    check: <path d="m4 12 5 5L20 6" />,
    monitor: <><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8m-4-4v4" /></>,
    sun: <><circle cx="12" cy="12" r="5" /><path d="M12 1v2m0 18v2M4.2 4.2l1.4 1.4m12.8 12.8 1.4 1.4M1 12h2m18 0h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" /></>,
    moon: <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />,
  };

  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" {...shared} aria-hidden="true">{paths[name] || paths.recon}</svg>;
}

export function BrandIcon({ network }) {
  if (network === 'github') {
    return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>;
  }
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 0H5C2.24 0 0 2.24 0 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5V5c0-2.76-2.24-5-5-5ZM8 19H5V8h3v11ZM6.5 6.73a1.76 1.76 0 1 1 0-3.52 1.76 1.76 0 0 1 0 3.52ZM20 19h-3v-5.6c0-3.37-4-3.12-4 0V19h-3V8h3v1.77c1.4-2.59 7-2.78 7 2.47V19Z" /></svg>;
}
