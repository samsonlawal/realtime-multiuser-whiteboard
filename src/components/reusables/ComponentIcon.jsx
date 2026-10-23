/**
 * ComponentIcon:
 * A pure, deterministic SVG icon renderer for system architecture primitives.
 *
 * Props:
 *  - type: string (e.g. 'postgres', 'kafka', 'redis', 'gateway')
 *  - size: number (default 16px)
 *
 * Location:
 * Placed in `components/reusables/` because it is shared by:
 * 1. The LeftSidebar & ComponentPickerModal (catalog search and preview)
 * 2. The Canvas Node renderer (drawing the dropped component cards in Milestone 2/3)
 */
export default function ComponentIcon({ type, size = 16 }) {
  const p = {
    xmlns: 'http://www.w3.org/2000/svg',
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.7',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };

  switch (type) {
    // ─── Compute ───
    case 'client':
      return <svg {...p}><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>;
    case 'mobile':
      return <svg {...p}><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M12 18h.01" /></svg>;
    case 'gateway':
      return <svg {...p}><path d="M2 12h20M12 2v20" /><circle cx="12" cy="12" r="4" /></svg>;
    case 'microservice':
      return <svg {...p}><rect x="2" y="2" width="8" height="8" rx="1.5" /><rect x="14" y="2" width="8" height="8" rx="1.5" /><rect x="2" y="14" width="8" height="8" rx="1.5" /><rect x="14" y="14" width="8" height="8" rx="1.5" /></svg>;
    case 'serverless':
      return <svg {...p}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>;
    case 'k8s':
      return <svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 3v6M12 15v6M3 12h6M15 12h6M5.6 5.6l4.3 4.3M14.1 14.1l4.3 4.3M18.4 5.6l-4.3 4.3M9.9 14.1l-4.3 4.3" /></svg>;
    case 'docker':
      return <svg {...p}><path d="M4 14h16c0 4-3 6-8 6s-8-2-8-6z" /><rect x="6" y="10" width="3" height="3" /><rect x="11" y="10" width="3" height="3" /><rect x="11" y="6" width="3" height="3" /><rect x="16" y="10" width="3" height="3" /></svg>;

    // ─── Databases & Storage ───
    case 'postgres':
      return <svg {...p}><ellipse cx="12" cy="6" rx="8" ry="3" /><path d="M4 6v8c0 1.66 3.58 3 8 3s8-1.34 8-3V6" /><path d="M4 10c0 1.66 3.58 3 8 3s8-1.34 8-3" /><path d="M10 14v4M14 14v4" /></svg>;
    case 'mysql':
      return <svg {...p}><ellipse cx="12" cy="5" rx="8" ry="2.5" /><path d="M4 5v14c0 1.38 3.58 2.5 8 2.5s8-1.12 8-2.5V5" /><path d="M4 12c0 1.38 3.58 2.5 8 2.5s8-1.12 8-2.5" /><circle cx="12" cy="12" r="1.5" /></svg>;
    case 'mongodb':
      return <svg {...p}><path d="M12 2C9 6 6 9.5 6 14a6 6 0 0 0 12 0c0-4.5-3-8-6-12z" /><path d="M12 2v20" /></svg>;
    case 'dynamodb':
      return <svg {...p}><path d="M4 6l8-4 8 4v12l-8 4-8-4V6z" /><path d="M4 6l8 4 8-4M12 10v12" /><path d="M8 8l8 4" /></svg>;
    case 'redis':
      return <svg {...p}><path d="M12 2L3 7l9 5 9-5-9-5z" /><path d="M3 12l9 5 9-5" /><path d="M3 17l9 5 9-5" /></svg>;
    case 'memcached':
      return <svg {...p}><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 9h6M9 12h6M9 15h3" /><path d="M1 9h3M1 15h3M20 9h3M20 15h3" /></svg>;
    case 'storage':
      return <svg {...p}><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><circle cx="10" cy="14" r="2" /></svg>;
    case 'search':
      return <svg {...p}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" /><path d="M11 8v6M8 11h6" /></svg>;

    // ─── Messaging & Queues ───
    case 'kafka':
      return <svg {...p}><circle cx="5" cy="12" r="3" /><circle cx="19" cy="6" r="3" /><circle cx="19" cy="18" r="3" /><path d="M8 12h8M16.5 7.5L8 12l8.5 4.5" /></svg>;
    case 'rabbitmq':
      return <svg {...p}><path d="M10 20H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-5" /><circle cx="12" cy="15" r="2" /><path d="M7 11V4a2 2 0 0 1 4 0v7M13 11V4a2 2 0 0 1 4 0v7" /></svg>;
    case 'queue':
      return <svg {...p}><rect x="3" y="4" width="18" height="4" rx="1" /><rect x="3" y="10" width="18" height="4" rx="1" /><rect x="3" y="16" width="18" height="4" rx="1" /><path d="M7 6h.01M7 12h.01M7 18h.01" /></svg>;
    case 'pubsub':
      return <svg {...p}><circle cx="12" cy="12" r="3" /><path d="M18.36 5.64a9 9 0 0 1 0 12.72M5.64 5.64a9 9 0 0 0 0 12.72" /><path d="M15.54 8.46a5 5 0 0 1 0 7.08M8.46 8.46a5 5 0 0 0 0 7.08" /></svg>;
    case 'websocket':
      return <svg {...p}><path d="m7 10 5-6 5 6" /><path d="m17 14-5 6-5-6" /><path d="M12 4v16" /></svg>;

    // ─── Networking & Traffic ───
    case 'loadbalancer':
      return <svg {...p}><path d="M12 3v6M12 15v6" /><path d="M3 15h18" /><path d="M3 15l4-4M3 15l4 4M21 15l-4-4M21 15l4 4" /><circle cx="12" cy="12" r="3" /></svg>;
    case 'reverseproxy':
      return <svg {...p}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 10h10M13 6l4 4-4 4M17 14H7M11 18l-4-4 4-4" /></svg>;
    case 'cdn':
      return <svg {...p}><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>;
    case 'dns':
      return <svg {...p}><circle cx="12" cy="12" r="3" /><circle cx="5" cy="19" r="2" /><circle cx="19" cy="19" r="2" /><circle cx="12" cy="4" r="2" /><path d="M12 6v3M10 13l-4 4M14 13l4 4" /></svg>;

    // ─── Observability ───
    case 'prometheus':
      return <svg {...p}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /><circle cx="12" cy="12" r="4" /></svg>;
    case 'grafana':
      return <svg {...p}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M7 16v-4M12 16V8M17 16v-6" /></svg>;
    case 'logs':
      return <svg {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></svg>;
    case 'tracing':
      return <svg {...p}><path d="M3 6h8M7 12h12M5 18h9" /><circle cx="3" cy="6" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="14" cy="18" r="1" /></svg>;

    // ─── Security & Auth ───
    case 'iam':
      return <svg {...p}><circle cx="9" cy="8" r="4" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><circle cx="18" cy="9" r="2" /><path d="M18 11v6l2 1" /></svg>;
    case 'firewall':
      return <svg {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M8 10h8M8 14h8" /></svg>;
    case 'vault':
      return <svg {...p}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /><circle cx="12" cy="16" r="1" /></svg>;

    // ─── Third-Party APIs ───
    case 'payment':
      return <svg {...p}><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20M6 15h4" /></svg>;
    case 'notification':
      return <svg {...p}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>;
    case 'ai':
      return <svg {...p}><path d="m12 3 1.9 4.8L19 9.7l-4 3.5 1.2 5.1-4.2-2.7-4.2 2.7 1.2-5.1-4-3.5 5.1-1.9z" /></svg>;

    default:
      return <svg {...p}><rect x="3" y="3" width="18" height="18" rx="2" /></svg>;
  }
}
