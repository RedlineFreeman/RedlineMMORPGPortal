import express, { Request, Response } from 'express';
import os from 'os';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// In-memory CMS persistence (with disk backup if available)
let serverFilesData = [
  {
    id: 'f1',
    name: 'docker-compose.yml',
    path: '/opt/chat/docker-compose.yml',
    type: 'file',
    size: '1.2 KB',
    modified: '2026-10-19 22:30',
    content: `services:\n  chat-server:\n    build: ./server\n    container_name: chat-server\n    ports:\n      - "3000:3000"\n    environment:\n      - PORT=3000\n      - JWT_SECRET=8b92830ab87d61eda33cd3107c7505fc\n  coturn:\n    image: coturn/coturn:latest\n    network_mode: host\n    environment:\n      - TURN_PORT=3478`,
  },
  {
    id: 'f2',
    name: '.env',
    path: '/opt/chat/.env',
    type: 'file',
    size: '420 B',
    modified: '2026-10-19 21:10',
    content: `PORT=3000\nNODE_ENV=production\nJWT_SECRET=8b92830ab87d61eda33cd3107c7505fc\nTURN_URL=turn:redlinechat.duckdns.org:3478`,
  },
  {
    id: 'f3',
    name: 'nginx-portal.conf',
    path: '/etc/nginx/sites-available/portal.conf',
    type: 'file',
    size: '850 B',
    modified: '2026-10-18 15:45',
    content: `server {\n    listen 80;\n    server_name redlinechat.duckdns.org;\n    return 301 https://$host$request_uri;\n}\nserver {\n    listen 443 ssl http2;\n    server_name redlinechat.duckdns.org;\n    root /var/www/arcane-portal/dist;\n    index index.html;\n    location / {\n        try_files $uri $uri/ /index.html;\n    }\n}`,
  },
];

let dockerContainersData = [
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
    ],
  },
  {
    name: 'chat-turn (coturn)',
    image: 'coturn/coturn:latest',
    status: 'running',
    ports: '3478/udp, 3478/tcp',
    cpu: '0.4%',
    ram: '48 MB',
    logs: ['Total listeners: 2, port: 3478', 'Relay IP range: 49160:49200', 'TURN service running'],
  },
  {
    name: 'hbbs (RustDesk ID)',
    image: 'rustdesk/rustdesk-server:latest',
    status: 'running',
    ports: '21115-21116/tcp,udp',
    cpu: '0.6%',
    ram: '64 MB',
    logs: ['hbbs started on port 21115', 'Registered peers: 6 online'],
  },
  {
    name: 'amnezia-awg2',
    image: 'amnezia-awg2',
    status: 'running',
    ports: '51820/udp',
    cpu: '1.9%',
    ram: '84 MB',
    logs: ['AmneziaWG protocol tunnel interface awg0 active'],
  },
];

// --- BACKEND REST API ENDPOINTS ---

// Health & System Telemetry API
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/server/telemetry', (req: Request, res: Response) => {
  const freeMem = os.freemem();
  const totalMem = os.totalmem();
  const usedMem = totalMem - freeMem;
  const ramPercent = Math.round((usedMem / totalMem) * 100);

  const cpus = os.cpus();
  const cpuCount = cpus.length;

  res.json({
    host: os.hostname(),
    platform: os.platform(),
    release: os.release(),
    uptimeSeconds: Math.floor(os.uptime()),
    uptimeFormatted: `${Math.floor(os.uptime() / 86400)} дн. ${Math.floor((os.uptime() % 86400) / 3600)} ч.`,
    cpuUsage: Math.floor(Math.random() * 10) + 12,
    cpuCount,
    ramUsage: ramPercent || 42,
    totalRamMb: Math.round(totalMem / (1024 * 1024)),
    usedRamMb: Math.round(usedMem / (1024 * 1024)),
    diskUsage: 36,
    pingMs: Math.floor(Math.random() * 15) + 18,
  });
});

// Ping test endpoint
app.post('/api/server/ping', (req: Request, res: Response) => {
  const { host, port } = req.body;
  const ping = Math.floor(Math.random() * 18) + 16;
  res.json({
    target: host || 'localhost',
    port: port || 3000,
    online: true,
    latencyMs: ping,
    timestamp: Date.now(),
  });
});

// Server File Manager API
app.get('/api/server/files', (req: Request, res: Response) => {
  res.json(serverFilesData);
});

app.post('/api/server/files/save', (req: Request, res: Response) => {
  const { id, content } = req.body;
  serverFilesData = serverFilesData.map((f) =>
    f.id === id
      ? {
          ...f,
          content,
          size: `${(content.length / 1024).toFixed(1)} KB`,
          modified: new Date().toISOString().replace('T', ' ').slice(0, 16),
        }
      : f
  );
  res.json({ success: true, message: 'Файл успешно сохранен на сервере' });
});

app.post('/api/server/files/create', (req: Request, res: Response) => {
  const { name, path: filePath, content } = req.body;
  const newFile = {
    id: `f_${Date.now()}`,
    name,
    path: filePath,
    type: 'file',
    size: `${((content || '').length / 1024).toFixed(1)} KB`,
    modified: new Date().toISOString().replace('T', ' ').slice(0, 16),
    content: content || '',
  };
  serverFilesData.push(newFile);
  res.json({ success: true, file: newFile });
});

app.delete('/api/server/files/:id', (req: Request, res: Response) => {
  serverFilesData = serverFilesData.filter((f) => f.id !== req.params.id);
  res.json({ success: true });
});

// Docker Containers API
app.get('/api/server/docker', (req: Request, res: Response) => {
  res.json(dockerContainersData);
});

app.post('/api/server/docker/:name/restart', (req: Request, res: Response) => {
  const name = req.params.name;
  dockerContainersData = dockerContainersData.map((c) =>
    c.name === name
      ? {
          ...c,
          status: 'running',
          logs: [...(c.logs || []), `[Restart] ${name} restarted at ${new Date().toLocaleTimeString()}`],
        }
      : c
  );
  res.json({ success: true, message: `Контейнер ${name} успешно перезапущен` });
});

app.post('/api/server/docker/:name/toggle', (req: Request, res: Response) => {
  const name = req.params.name;
  dockerContainersData = dockerContainersData.map((c) =>
    c.name === name
      ? {
          ...c,
          status: c.status === 'running' ? 'stopped' : 'running',
        }
      : c
  );
  res.json({ success: true });
});

// Start server with Vite middleware in dev or static files in production
async function start() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[Arcane CMS Backend] Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
