import type { ComponentPrimitive } from '../types/whiteboard';

/**
 * COMPONENT_LIBRARY
 * System design architecture primitives categorized across 7 core infrastructure domains.
 * Each primitive contains:
 *  - id: unique string identifier
 *  - label: display name
 *  - category: architectural classification
 *  - icon: icon key mapped in ComponentIcon
 *  - color: canonical brand accent hex code
 */

export const COMPONENT_CATEGORIES = [
  'Compute',
  'Databases & Storage',
  'Messaging & Queues',
  'Networking & Traffic',
  'Observability',
  'Security & Auth',
  'Third-Party APIs',
] as const;

export const COMPONENT_LIBRARY: ComponentPrimitive[] = [
  // ─── 1. COMPUTE ───────────────────────────────────────────
  { id: 'backend_server', label: 'BE Server', category: 'Compute', icon: 'server', color: '#10B981' },
  { id: 'microservice',   label: 'Microservice',             category: 'Compute', icon: 'microservice', color: '#3B82F6' },
  { id: 'worker',         label: 'Background Worker',        category: 'Compute', icon: 'worker', color: '#F59E0B' },
  { id: 'cron',           label: 'Cron / Scheduled Job',     category: 'Compute', icon: 'cron', color: '#8B5CF6' },
  { id: 'serverless',     label: 'Serverless / Lambda',      category: 'Compute', icon: 'serverless', color: '#F97316' },
  { id: 'api_gateway',    label: 'API Gateway',              category: 'Compute', icon: 'gateway', color: '#EC4899' },
  { id: 'k8s_pod',        label: 'Kubernetes Pod',           category: 'Compute', icon: 'k8s', color: '#326CE5' },
  { id: 'docker',         label: 'Docker Container',         category: 'Compute', icon: 'docker', color: '#2496ED' },
  { id: 'client_web',     label: 'Web Client',               category: 'Compute', icon: 'client', color: '#60A5FA' },
  { id: 'client_mobile',  label: 'Mobile App',               category: 'Compute', icon: 'mobile', color: '#A78BFA' },

  // ─── 2. DATABASES & STORAGE ───────────────────────────────
  { id: 'postgres',       label: 'PostgreSQL',               category: 'Databases & Storage', icon: 'postgres', color: '#336791' },
  { id: 'mysql',          label: 'MySQL',                    category: 'Databases & Storage', icon: 'mysql', color: '#00758F' },
  { id: 'mongodb',        label: 'MongoDB',       category: 'Databases & Storage', icon: 'mongodb', color: '#47A248' },
  { id: 'dynamodb',       label: 'DynamoDB',         category: 'Databases & Storage', icon: 'dynamodb', color: '#4053D6' },
  { id: 'redis',          label: 'Redis Cache',              category: 'Databases & Storage', icon: 'redis', color: '#DC382D' },
  { id: 'memcached',      label: 'Memcached',                category: 'Databases & Storage', icon: 'memcached', color: '#0284C7' },
  { id: 'db_replica',     label: 'Read Replica',          category: 'Databases & Storage', icon: 'replica', color: '#06B6D4' },
  { id: 'pooler',         label: 'Connection Pooler (PgBouncer)', category: 'Databases & Storage', icon: 'pooler', color: '#F43F5E' },
  { id: 's3',             label: 'S3 / Blob Storage',        category: 'Databases & Storage', icon: 'storage', color: '#569A31' },
  { id: 'elasticsearch',  label: 'Elasticsearch',            category: 'Databases & Storage', icon: 'search', color: '#005571' },

  // ─── 3. MESSAGING & QUEUES ────────────────────────────────
  { id: 'kafka',          label: 'Apache Kafka',             category: 'Messaging & Queues', icon: 'kafka', color: '#E05D44' },
  { id: 'rabbitmq',       label: 'RabbitMQ',                 category: 'Messaging & Queues', icon: 'rabbitmq', color: '#FF6600' },
  { id: 'sqs',            label: 'Task Queue (SQS)',         category: 'Messaging & Queues', icon: 'queue', color: '#CC2264' },
  { id: 'pubsub',         label: 'Pub / Sub Topic',          category: 'Messaging & Queues', icon: 'pubsub', color: '#34A853' },
  { id: 'websocket',      label: 'WebSocket Server',         category: 'Messaging & Queues', icon: 'websocket', color: '#0EA5E9' },

  // ─── 4. NETWORKING & TRAFFIC ──────────────────────────────
  { id: 'loadbalancer',   label: 'Load Balancer',      category: 'Networking & Traffic', icon: 'loadbalancer', color: '#8B5CF6' },
  { id: 'reverse_proxy',  label: 'NGINX / Reverse Proxy',    category: 'Networking & Traffic', icon: 'reverseproxy', color: '#009639' },
  { id: 'cdn',            label: 'CDN (Cloudflare)',         category: 'Networking & Traffic', icon: 'cdn', color: '#F38020' },
  { id: 'dns',            label: 'DNS (Route 53)',           category: 'Networking & Traffic', icon: 'dns', color: '#EAB308' },
  { id: 'forward_proxy',  label: 'Forward Proxy / NAT',      category: 'Networking & Traffic', icon: 'proxy', color: '#14B8A6' },

  // ─── 5. OBSERVABILITY ─────────────────────────────────────
  { id: 'prometheus',     label: 'Prometheus (Metrics)',     category: 'Observability', icon: 'prometheus', color: '#E6522C' },
  { id: 'grafana',        label: 'Grafana Dashboard',        category: 'Observability', icon: 'grafana', color: '#F46800' },
  { id: 'logs',           label: 'Log Aggregator (ELK)',     category: 'Observability', icon: 'logs', color: '#00BFB3' },
  { id: 'tracing',        label: 'Distributed Tracing (Jaeger)', category: 'Observability', icon: 'tracing', color: '#60A5FA' },

  // ─── 6. SECURITY & AUTH ───────────────────────────────────
  { id: 'auth_server',    label: 'Auth / IDP (OAuth2/OIDC)', category: 'Security & Auth', icon: 'auth', color: '#E11D48' },
  { id: 'iam',            label: 'IAM / RBAC Engine',        category: 'Security & Auth', icon: 'iam', color: '#6366F1' },
  { id: 'firewall',       label: 'WAF / Firewall',           category: 'Security & Auth', icon: 'firewall', color: '#EF4444' },
  { id: 'vault',          label: 'Secrets Vault (HashiCorp)',category: 'Security & Auth', icon: 'vault', color: '#FFDE59' },

  // ─── 7. THIRD-PARTY APIS ──────────────────────────────────
  { id: 'stripe',         label: 'Payment (Stripe)',         category: 'Third-Party APIs', icon: 'payment', color: '#635BFF' },
  { id: 'notifications',  label: 'Email / SMS (Twilio)',     category: 'Third-Party APIs', icon: 'notification', color: '#F22F46' },
  { id: 'ai_service',     label: 'AI / LLM API (OpenAI)',    category: 'Third-Party APIs', icon: 'ai', color: '#10A37F' },
];
