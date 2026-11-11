import { User, ServerConfig, ServerFile, DockerService } from '../types';
import chroniclerAvatar from '../assets/images/author_chronicler_1792514646307.jpg';

export const DEFAULT_ADMIN: User = {
  id: 'usr_admin',
  username: 'Станислав (Администратор)',
  email: 'admin@arcane.ru',
  role: 'admin',
  avatar: chroniclerAvatar,
  title: 'Верховный Хранитель Портала & Root',
  createdAt: '2026-10-01',
};

export const INITIAL_SERVER_CONFIG: ServerConfig = {
  host: 'redlinechat.duckdns.org',
  port: 3000,
  protocol: 'https',
  apiKey: 'ak_sec_8b92830ab87d61eda33cd3107c7505fc',
  serverName: 'VPS v1027284 (Основной кластер)',
  autoPing: true,
  status: 'connected',
  lastPingMs: 24,
  uptime: '18 дней 14 часов',
  cpuUsage: 14,
  ramUsage: 42,
  diskUsage: 36,
};

export const INITIAL_SERVER_FILES: ServerFile[] = [
  {
    id: 'f1',
    name: 'docker-compose.yml',
    path: '/opt/chat/docker-compose.yml',
    type: 'file',
    size: '1.2 KB',
    modified: '2026-10-19 22:30',
    extension: 'yml',
    content: `services:
  chat-server:
    build: ./server
    container_name: chat-server
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - JWT_SECRET=8b92830ab87d61eda33cd3107c7505fc59ebd6fdedc9ace37fd8d2dd2c5703c4
      - TOKEN_TTL=30d
      - CLIENT_ORIGIN=*
      - MAX_FILE_SIZE=2097152000
      - TURN_URL=turn:redlinechat.duckdns.org:3478
      - TURN_USER=chat
      - TURN_PASS=85417c66d766f43a23ac3b38
    volumes:
      - chat-data:/app/data
      - chat-uploads:/app/uploads

  coturn:
    image: coturn/coturn:latest
    container_name: chat-turn
    restart: unless-stopped
    network_mode: host
    environment:
      - TURN_USER=chat:85417c66d766f43a23ac3b38
      - TURN_REALM=chat.example.com
      - TURN_PORT=3478
      - TURN_MIN_PORT=49160
      - TURN_MAX_PORT=49200
      - TURN_EXTRA=--fingerprint --lt-cred-mech --no-tls --no-dtls --log-file=stdout

volumes:
  chat-data:
  chat-uploads:`,
  },
  {
    id: 'f2',
    name: '.env',
    path: '/opt/chat/.env',
    type: 'file',
    size: '420 B',
    modified: '2026-10-19 21:10',
    extension: 'env',
    content: `PORT=3000
NODE_ENV=production
JWT_SECRET=8b92830ab87d61eda33cd3107c7505fc
DATA_DIR=/app/data
UPLOAD_DIR=/app/uploads
TURN_URL=turn:redlinechat.duckdns.org:3478`,
  },
  {
    id: 'f3',
    name: 'nginx-portal.conf',
    path: '/etc/nginx/sites-available/portal.conf',
    type: 'file',
    size: '850 B',
    modified: '2026-10-18 15:45',
    extension: 'conf',
    content: `server {
    listen 80;
    server_name redlinechat.duckdns.org;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name redlinechat.duckdns.org;

    ssl_certificate /etc/letsencrypt/live/redlinechat.duckdns.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/redlinechat.duckdns.org/privkey.pem;

    root /var/www/arcane-portal/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}`,
  },
  {
    id: 'f4',
    name: 'turnserver.conf',
    path: '/etc/coturn/turnserver.conf',
    type: 'file',
    size: '620 B',
    modified: '2026-10-15 11:00',
    extension: 'conf',
    content: `listening-port=3478
fingerprint
lt-cred-mech
realm=redlinechat.duckdns.org
user=chat:85417c66d766f43a23ac3b38
min-port=49160
max-port=49200
no-tls
no-dtls
log-file=stdout`,
  },
];

export const INITIAL_DOCKER_SERVICES: DockerService[] = [
  {
    name: 'chat-server',
    image: 'chat-chat-server',
    status: 'running',
    ports: '3000:3000/tcp',
    cpu: '1.4%',
    ram: '148 MB',
    logs: [
      '[Server] Express HTTP listening on port 3000',
      '[Database] SQLite db connected successfully at /app/data/chat.db',
      '[Socket.IO] Realtime signaling websocket engine initialized',
      '[Auth] Token verifier ready (TTL: 30d)',
      '[Health] Ready for inbound traffic',
    ],
  },
  {
    name: 'chat-turn (coturn)',
    image: 'coturn/coturn:latest',
    status: 'running',
    ports: '3478/udp, 3478/tcp',
    cpu: '0.4%',
    ram: '48 MB',
    logs: [
      'RFC 3489/5389/5766/5780/6062/6156 STUN/TURN server',
      'IPv4. IPv6 is disabled',
      'Total listeners: 2, port: 3478',
      'Relay IP range: 49160:49200',
      'TURN listener service running',
    ],
  },
  {
    name: 'hbbs (RustDesk ID)',
    image: 'rustdesk/rustdesk-server:latest',
    status: 'running',
    ports: '21115-21116/tcp,udp',
    cpu: '0.6%',
    ram: '64 MB',
    logs: [
      'hbbs started on port 21115',
      'NAT type detection active',
      'Registered peers: 6 online',
    ],
  },
  {
    name: 'hbbr (RustDesk Relay)',
    image: 'rustdesk/rustdesk-server:latest',
    status: 'running',
    ports: '21117/tcp',
    cpu: '0.3%',
    ram: '52 MB',
    logs: [
      'hbbr relay service ready on port 21117',
      'Data tunneling encryption enabled',
    ],
  },
  {
    name: 'amnezia-awg2',
    image: 'amnezia-awg2',
    status: 'running',
    ports: '51820/udp',
    cpu: '1.9%',
    ram: '84 MB',
    logs: [
      'AmneziaWG protocol tunnel interface awg0 active',
      'Handshake packets obfuscation enabled',
      'Active peers: 4',
    ],
  },
];
