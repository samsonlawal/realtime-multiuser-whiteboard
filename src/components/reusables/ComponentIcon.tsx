import React from 'react';

/**
 * ComponentIcon:
 * Pure SVG vector renderer for system architecture primitives.
 * Tuned with 1.35px stroke width and geometric precision to render razor-sharp
 * without blurriness, subpixel halos, or line collision on high-DPI screens.
 *
 * Props:
 *  - type: string (e.g. 'postgres', 'redis', 'kafka', 'server', 'worker')
 *  - size: number (default 18px)
 *  - color?: string (optional specific color override, defaults to currentColor)
 */

interface ComponentIconProps {
  type: string;
  size?: number;
  color?: string;
  className?: string;
}

export default function ComponentIcon({ type, size = 18, color, className = '' }: ComponentIconProps) {
  const strokeColor = color || 'currentColor';
  const fillColor = color || 'currentColor';

  const p = {
    xmlns: 'http://www.w3.org/2000/svg',
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: strokeColor,
    strokeWidth: '1.35',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    shapeRendering: 'geometricPrecision' as const,
    className,
  };

  switch (type) {
    // ─── 1. Compute & Servers ───
    case 'server':
    case 'backend_server':
      return (
        <svg {...p}>
          <rect x="3" y="3" width="18" height="8" rx="2" />
          <rect x="3" y="13" width="18" height="8" rx="2" />
          <circle cx="7" cy="7" r="1.2" fill={fillColor} stroke="none" />
          <circle cx="10.5" cy="7" r="1.2" fill={fillColor} stroke="none" />
          <circle cx="7" cy="17" r="1.2" fill={fillColor} stroke="none" />
          <circle cx="10.5" cy="17" r="1.2" fill={fillColor} stroke="none" />
          <line x1="15" y1="7" x2="18" y2="7" />
          <line x1="15" y1="17" x2="18" y2="17" />
        </svg>
      );

    case 'worker':
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1l2.1-2.1M17 7l2.1-2.1" />
        </svg>
      );

    case 'cron':
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" />
          <polyline points="12 6.5 12 12 15.5 14" />
        </svg>
      );

    case 'client':
      return (
        <svg {...p}>
          <rect x="2.5" y="3.5" width="19" height="13" rx="2" />
          <line x1="8" y1="20.5" x2="16" y2="20.5" />
          <line x1="12" y1="16.5" x2="12" y2="20.5" />
        </svg>
      );

    case 'mobile':
      return (
        <svg {...p}>
          <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
          <line x1="11" y1="18" x2="13" y2="18" />
        </svg>
      );

    case 'gateway':
      return (
        <svg {...p}>
          <rect x="3.5" y="3.5" width="17" height="4.5" rx="1.5" />
          <rect x="3.5" y="16" width="17" height="4.5" rx="1.5" />
          <line x1="8" y1="8" x2="8" y2="16" />
          <line x1="16" y1="8" x2="16" y2="16" />
          <path d="M12 10.5l-2 2h4l-2 2" />
        </svg>
      );

    case 'microservice':
      return (
        <svg {...p}>
          <rect x="3" y="3" width="6.5" height="6.5" rx="1.5" />
          <rect x="14.5" y="3" width="6.5" height="6.5" rx="1.5" />
          <rect x="3" y="14.5" width="6.5" height="6.5" rx="1.5" />
          <rect x="14.5" y="14.5" width="6.5" height="6.5" rx="1.5" />
          <line x1="9.5" y1="6.25" x2="14.5" y2="6.25" />
          <line x1="6.25" y1="9.5" x2="6.25" y2="14.5" />
          <line x1="17.75" y1="9.5" x2="17.75" y2="14.5" />
          <line x1="9.5" y1="17.75" x2="14.5" y2="17.75" />
        </svg>
      );

    case 'serverless':
      return (
        <svg {...p}>
          <polygon points="13 2 3 13.5 12 13.5 11 22 21 10.5 12 10.5 13 2" />
        </svg>
      );

    case 'k8s':
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="3" />
          <line x1="12" y1="3" x2="12" y2="9" />
          <line x1="12" y1="15" x2="12" y2="21" />
          <line x1="4.2" y1="7.5" x2="9.4" y2="10.5" />
          <line x1="14.6" y1="13.5" x2="19.8" y2="16.5" />
          <line x1="4.2" y1="16.5" x2="9.4" y2="13.5" />
          <line x1="14.6" y1="10.5" x2="19.8" y2="7.5" />
        </svg>
      );

    case 'docker':
      return (
        <svg {...p}>
          <path d="M2 13.5c0 3.8 3.2 6.5 8 6.5 6.5 0 9.5-3.5 10.5-6.5.6-1.5 2-2 3-2-1-2-3-2.5-4-2.5-.5-1.5-2-2-4-2h-3.5v4H2z" />
          {/* Filled crisp cargo containers */}
          <rect x="5.5" y="8" width="2.2" height="2" fill={fillColor} stroke="none" rx="0.3" />
          <rect x="8.7" y="8" width="2.2" height="2" fill={fillColor} stroke="none" rx="0.3" />
          <rect x="11.9" y="8" width="2.2" height="2" fill={fillColor} stroke="none" rx="0.3" />
          <rect x="8.7" y="5.2" width="2.2" height="2" fill={fillColor} stroke="none" rx="0.3" />
          <rect x="11.9" y="5.2" width="2.2" height="2" fill={fillColor} stroke="none" rx="0.3" />
        </svg>
      );

    // ─── 2. Databases & Storage ───
    case 'postgres':
      return (
        <svg {...p}>
          <ellipse cx="12" cy="6" rx="8" ry="3" />
          <path d="M4 6v8c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
          <path d="M4 10c0 1.66 3.58 3 8 3s8-1.34 8-3" />
          <path d="M9 13.5c-1.5 1.5-1 4.5.5 5.5M15 13.5c1.5 1.5 1 4.5-.5 5.5" />
        </svg>
      );

    case 'mysql':
      return (
        <svg {...p}>
          <ellipse cx="12" cy="5.5" rx="8" ry="2.5" />
          <path d="M4 5.5v13c0 1.38 3.58 2.5 8 2.5s8-1.12 8-2.5V5.5" />
          <path d="M4 12c0 1.38 3.58 2.5 8 2.5s8-1.12 8-2.5" />
          <path d="M15.5 8.5c-2.5-1.5-6 .5-5 4 1 3.5 4.5 4.5 6 2" />
        </svg>
      );

    case 'mongodb':
      return (
        <svg {...p}>
          <path d="M12 2.5C8 6.5 6.5 10 6.5 14a5.5 5.5 0 0 0 11 0c0-4-1.5-7.5-5.5-11.5z" />
          <line x1="12" y1="2.5" x2="12" y2="21.5" />
        </svg>
      );

    case 'dynamodb':
      return (
        <svg {...p}>
          <path d="M12 2.5l7.5 4.2v10.6L12 21.5l-7.5-4.2V6.7L12 2.5z" />
          <path d="M12 21.5V11M19.5 6.7l-7.5 4.3-7.5-4.3" />
        </svg>
      );

    case 'redis':
      return (
        <svg {...p}>
          <path d="M12 2.5L3.5 6.8l8.5 4.4 8.5-4.4L12 2.5z" />
          <path d="M3.5 11.5l8.5 4.4 8.5-4.4" />
          <path d="M3.5 16.2l8.5 4.4 8.5-4.4" />
        </svg>
      );

    case 'memcached':
      return (
        <svg {...p}>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <line x1="8" y1="9" x2="16" y2="9" />
          <line x1="8" y1="12" x2="16" y2="12" />
          <line x1="8" y1="15" x2="13" y2="15" />
        </svg>
      );

    case 'replica':
      return (
        <svg {...p}>
          <ellipse cx="8" cy="5.5" rx="5" ry="2" />
          <path d="M3 5.5v5c0 1.1 2.2 2 5 2s5-.9 5-2v-5" />
          <ellipse cx="16" cy="13.5" rx="5" ry="2" />
          <path d="M11 13.5v5c0 1.1 2.2 2 5 2s5-.9 5-2v-5" />
          <path d="M10 8.5l3 3m0 0l-3 3" />
        </svg>
      );

    case 'pooler':
      return (
        <svg {...p}>
          <polygon points="3.5 3.5 20.5 3.5 14 11.5 14 19.5 10 21.5 10 11.5 3.5 3.5" />
        </svg>
      );

    case 'storage':
      return (
        <svg {...p}>
          <path d="M4 5.5h16l-2 14.5H6L4 5.5z" />
          <ellipse cx="12" cy="5.5" rx="8" ry="2.5" />
          <path d="M8.5 10.5c2 .8 5 .8 7 0" />
        </svg>
      );

    case 'search':
      return (
        <svg {...p}>
          <circle cx="11" cy="11" r="6.5" />
          <line x1="16" y1="16" x2="21" y2="21" />
          <line x1="11" y1="8" x2="11" y2="14" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      );

    // ─── 3. Messaging & Queues ───
    case 'kafka':
      return (
        <svg {...p}>
          <circle cx="6" cy="12" r="2.8" />
          <circle cx="18" cy="6" r="2.8" />
          <circle cx="18" cy="18" r="2.8" />
          <line x1="8.8" y1="12" x2="15.2" y2="12" />
          <line x1="8.4" y1="10.8" x2="15.6" y2="7.2" />
          <line x1="8.4" y1="13.2" x2="15.6" y2="16.8" />
        </svg>
      );

    case 'rabbitmq':
      return (
        <svg {...p}>
          <path d="M6 18a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2H6v-2z" />
          <path d="M8.5 14V5a1.8 1.8 0 0 1 3.5 0v9M12 14V3.5a1.8 1.8 0 0 1 3.5 0v10.5" />
          <circle cx="10" cy="17" r="1.1" fill={fillColor} stroke="none" />
        </svg>
      );

    case 'queue':
      return (
        <svg {...p}>
          <rect x="3" y="4" width="18" height="4" rx="1" />
          <rect x="3" y="10" width="18" height="4" rx="1" />
          <rect x="3" y="16" width="18" height="4" rx="1" />
          <circle cx="6.5" cy="6" r="0.9" fill={fillColor} stroke="none" />
          <circle cx="6.5" cy="12" r="0.9" fill={fillColor} stroke="none" />
          <circle cx="6.5" cy="18" r="0.9" fill={fillColor} stroke="none" />
          <line x1="11" y1="6" x2="18" y2="6" />
          <line x1="11" y1="12" x2="18" y2="12" />
          <line x1="11" y1="18" x2="18" y2="18" />
        </svg>
      );

    case 'pubsub':
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="2.8" />
          <path d="M17.8 6.2a8.2 8.2 0 0 1 0 11.6M6.2 6.2a8.2 8.2 0 0 0 0 11.6" />
          <path d="M15.2 8.8a4.5 4.5 0 0 1 0 6.4M8.8 8.8a4.5 4.5 0 0 0 0 6.4" />
        </svg>
      );

    case 'websocket':
      return (
        <svg {...p}>
          <path d="m7 9 5-6 5 6" />
          <path d="m17 15-5 6-5-6" />
          <line x1="12" y1="3" x2="12" y2="21" />
        </svg>
      );

    // ─── 4. Networking & Traffic ───
    case 'loadbalancer':
      return (
        <svg {...p}>
          <circle cx="12" cy="5" r="2.2" />
          <circle cx="5" cy="19" r="2.2" />
          <circle cx="12" cy="19" r="2.2" />
          <circle cx="19" cy="19" r="2.2" />
          <path d="M12 7.2v4.5M12 11.7L5 16.8M12 11.7v5.1M12 11.7l7 5.1" />
        </svg>
      );

    case 'reverseproxy':
      return (
        <svg {...p}>
          <polygon points="12 2.5 19.5 6.8 19.5 17.2 12 21.5 4.5 17.2 4.5 6.8 12 2.5" />
          <path d="M8.5 8.5v7l7-7v7" />
        </svg>
      );

    case 'cdn':
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="8.5" />
          <line x1="3.5" y1="12" x2="20.5" y2="12" />
          <path d="M12 3.5a13 13 0 0 1 3.8 8.5 13 13 0 0 1-3.8 8.5 13 13 0 0 1-3.8-8.5 13 13 0 0 1 3.8-8.5z" />
        </svg>
      );

    case 'dns':
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="2.5" />
          <circle cx="5" cy="19" r="2" />
          <circle cx="19" cy="19" r="2" />
          <circle cx="12" cy="4.5" r="2" />
          <line x1="12" y1="6.5" x2="12" y2="9.5" />
          <line x1="10" y1="13.5" x2="6.5" y2="17.2" />
          <line x1="14" y1="13.5" x2="17.5" y2="17.2" />
        </svg>
      );

    case 'proxy':
      return (
        <svg {...p}>
          <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
          <line x1="7.5" y1="12" x2="16.5" y2="12" />
          <polyline points="13 8.5 16.5 12 13 15.5" />
        </svg>
      );

    // ─── 5. Observability ───
    case 'prometheus':
      return (
        <svg {...p}>
          <path d="M12 2.5c2 3.8 5.8 6.8 5.8 11.5a5.8 5.8 0 0 1-11.6 0c0-2.8 1.4-5.5 3.3-7.5.5 1.8 1.5 2.8 2.5 2.8 0-1.8 0-4.8 0-6.8z" />
          <line x1="8.5" y1="21.5" x2="15.5" y2="21.5" />
        </svg>
      );

    case 'grafana':
      return (
        <svg {...p}>
          <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
          <line x1="7.5" y1="15.5" x2="7.5" y2="12" />
          <line x1="12" y1="15.5" x2="12" y2="8" />
          <line x1="16.5" y1="15.5" x2="16.5" y2="10.5" />
        </svg>
      );

    case 'logs':
      return (
        <svg {...p}>
          <path d="M14 2.5H6.5a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2.5 14 8 19.5 8" />
          <line x1="8" y1="13" x2="16" y2="13" />
          <line x1="8" y1="16.5" x2="13.5" y2="16.5" />
        </svg>
      );

    case 'tracing':
      return (
        <svg {...p}>
          <line x1="3.5" y1="6" x2="11" y2="6" />
          <line x1="7" y1="12" x2="18.5" y2="12" />
          <line x1="5" y1="18" x2="14" y2="18" />
          <circle cx="3.5" cy="6" r="1.3" fill={fillColor} stroke="none" />
          <circle cx="18.5" cy="12" r="1.3" fill={fillColor} stroke="none" />
          <circle cx="14" cy="18" r="1.3" fill={fillColor} stroke="none" />
        </svg>
      );

    // ─── 6. Security & Auth ───
    case 'auth':
    case 'auth_server':
      return (
        <svg {...p}>
          <rect x="4.5" y="3.5" width="15" height="17" rx="2" />
          <circle cx="12" cy="9" r="2.2" />
          <path d="M8.5 15.5c0-1.8 1.6-2.8 3.5-2.8s3.5 1 3.5 2.8" />
        </svg>
      );

    case 'iam':
      return (
        <svg {...p}>
          <circle cx="9" cy="8" r="3.5" />
          <path d="M3.5 19.5c0-3 2.5-5.5 5.5-5.5s5.5 2.5 5.5 5.5" />
          <circle cx="17.5" cy="9.5" r="2" />
          <path d="M17.5 11.5v4.5l1.8 1" />
        </svg>
      );

    case 'firewall':
      return (
        <svg {...p}>
          <path d="M12 21.5s7.5-3.8 7.5-9.5V5.2L12 2.5 4.5 5.2V12c0 5.7 7.5 9.5 7.5 9.5z" />
          <rect x="9.5" y="11" width="5" height="4.5" rx="1" />
          <path d="M10.5 11V9.5a1.5 1.5 0 0 1 3 0V11" />
        </svg>
      );

    case 'vault':
      return (
        <svg {...p}>
          <rect x="3.5" y="10.5" width="17" height="11" rx="2" />
          <path d="M7.5 10.5V7a4.5 4.5 0 0 1 9 0v3.5" />
          <circle cx="12" cy="15.5" r="1.3" fill={fillColor} stroke="none" />
        </svg>
      );

    // ─── 7. Third-Party APIs ───
    case 'payment':
      return (
        <svg {...p}>
          <rect x="2.5" y="5.5" width="19" height="13" rx="2" />
          <line x1="2.5" y1="10" x2="21.5" y2="10" />
          <rect x="5.5" y="13" width="3.5" height="2.5" rx="0.5" fill={fillColor} stroke="none" />
        </svg>
      );

    case 'notification':
      return (
        <svg {...p}>
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.7 20.5a2 2 0 0 1-3.4 0" />
        </svg>
      );

    case 'ai':
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="2.8" />
          <circle cx="12" cy="5" r="1.8" />
          <circle cx="18" cy="8.5" r="1.8" />
          <circle cx="18" cy="15.5" r="1.8" />
          <circle cx="12" cy="19" r="1.8" />
          <circle cx="6" cy="15.5" r="1.8" />
          <circle cx="6" cy="8.5" r="1.8" />
          <line x1="12" y1="6.8" x2="12" y2="9.2" />
          <line x1="16.5" y1="9.4" x2="14.4" y2="10.6" />
          <line x1="16.5" y1="14.6" x2="14.4" y2="13.4" />
          <line x1="12" y1="17.2" x2="12" y2="14.8" />
          <line x1="7.5" y1="14.6" x2="9.6" y2="13.4" />
          <line x1="7.5" y1="9.4" x2="9.6" y2="10.6" />
        </svg>
      );

    default:
      return (
        <svg {...p}>
          <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
          <line x1="9" y1="12" x2="15" y2="12" />
          <line x1="12" y1="9" x2="12" y2="15" />
        </svg>
      );
  }
}
