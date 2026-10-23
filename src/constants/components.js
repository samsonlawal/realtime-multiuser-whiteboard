/**
 * COMPONENT_LIBRARY
 * System design architecture primitives categorized across 7 core infrastructure domains.
 * Exported as a standalone constant so both the LeftSidebar picker and the Canvas
 * rendering engine can share the same canonical entity definitions.
 */

export const COMPONENT_CATEGORIES = [
  'Compute',
  'Databases & Storage',
  'Messaging & Queues',
  'Networking & Traffic',
  'Observability',
  'Security & Auth',
  'Third-Party APIs',
];

export const COMPONENT_LIBRARY = [
  // ─── 1. COMPUTE ───────────────────────────────────────────
  { id: 'client_web',    label: 'Web Client',          category: 'Compute', icon: 'client' },
  { id: 'client_mobile', label: 'Mobile App',          category: 'Compute', icon: 'mobile' },
  { id: 'api_gateway',   label: 'API Gateway',         category: 'Compute', icon: 'gateway' },
  { id: 'microservice',  label: 'Microservice',        category: 'Compute', icon: 'microservice' },
  { id: 'serverless',    label: 'Serverless / Lambda', category: 'Compute', icon: 'serverless' },
  { id: 'k8s_pod',       label: 'Kubernetes Pod',      category: 'Compute', icon: 'k8s' },
  { id: 'docker',        label: 'Docker Container',    category: 'Compute', icon: 'docker' },

  // ─── 2. DATABASES & STORAGE ───────────────────────────────
  { id: 'postgres',      label: 'PostgreSQL',          category: 'Databases & Storage', icon: 'postgres' },
  { id: 'mysql',         label: 'MySQL',               category: 'Databases & Storage', icon: 'mysql' },
  { id: 'mongodb',       label: 'MongoDB (Document)',  category: 'Databases & Storage', icon: 'mongodb' },
  { id: 'dynamodb',      label: 'DynamoDB / NoSQL',    category: 'Databases & Storage', icon: 'dynamodb' },
  { id: 'redis',         label: 'Redis Cache',         category: 'Databases & Storage', icon: 'redis' },
  { id: 'memcached',     label: 'Memcached',           category: 'Databases & Storage', icon: 'memcached' },
  { id: 's3',            label: 'S3 / Blob Storage',   category: 'Databases & Storage', icon: 'storage' },
  { id: 'elasticsearch', label: 'Elasticsearch',       category: 'Databases & Storage', icon: 'search' },

  // ─── 3. MESSAGING & QUEUES ────────────────────────────────
  { id: 'kafka',         label: 'Apache Kafka',        category: 'Messaging & Queues', icon: 'kafka' },
  { id: 'rabbitmq',      label: 'RabbitMQ',            category: 'Messaging & Queues', icon: 'rabbitmq' },
  { id: 'sqs',           label: 'Task Queue (SQS)',    category: 'Messaging & Queues', icon: 'queue' },
  { id: 'pubsub',        label: 'Pub / Sub Topic',     category: 'Messaging & Queues', icon: 'pubsub' },
  { id: 'websocket',     label: 'WebSocket Server',    category: 'Messaging & Queues', icon: 'websocket' },

  // ─── 4. NETWORKING & TRAFFIC ──────────────────────────────
  { id: 'loadbalancer',  label: 'Load Balancer (ALB)', category: 'Networking & Traffic', icon: 'loadbalancer' },
  { id: 'reverse_proxy', label: 'NGINX / Reverse Proxy',category: 'Networking & Traffic', icon: 'reverseproxy' },
  { id: 'cdn',           label: 'CDN (Cloudflare)',    category: 'Networking & Traffic', icon: 'cdn' },
  { id: 'dns',           label: 'DNS (Route 53)',      category: 'Networking & Traffic', icon: 'dns' },

  // ─── 5. OBSERVABILITY ─────────────────────────────────────
  { id: 'prometheus',    label: 'Prometheus (Metrics)',category: 'Observability', icon: 'prometheus' },
  { id: 'grafana',       label: 'Grafana Dashboard',   category: 'Observability', icon: 'grafana' },
  { id: 'logs',          label: 'Log Aggregator (ELK)',category: 'Observability', icon: 'logs' },
  { id: 'tracing',       label: 'Distributed Tracing', category: 'Observability', icon: 'tracing' },

  // ─── 6. SECURITY & AUTH ───────────────────────────────────
  { id: 'iam',           label: 'IAM / Auth (OAuth2)', category: 'Security & Auth', icon: 'iam' },
  { id: 'firewall',      label: 'WAF / Firewall',      category: 'Security & Auth', icon: 'firewall' },
  { id: 'vault',         label: 'Secrets Vault',       category: 'Security & Auth', icon: 'vault' },

  // ─── 7. THIRD-PARTY APIS ──────────────────────────────────
  { id: 'stripe',        label: 'Payment (Stripe)',    category: 'Third-Party APIs', icon: 'payment' },
  { id: 'notifications', label: 'Email / SMS Service', category: 'Third-Party APIs', icon: 'notification' },
  { id: 'ai_service',    label: 'AI / LLM API',        category: 'Third-Party APIs', icon: 'ai' },
];
