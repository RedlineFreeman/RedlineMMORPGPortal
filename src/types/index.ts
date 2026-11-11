export type Season = 'winter' | 'spring' | 'summer' | 'autumn';

export type GameTitle =
  | 'Lineage 2'
  | 'World of Warcraft'
  | 'Path of Exile 2'
  | 'Guild Wars 2'
  | 'Black Desert';

export type ArticleCategory =
  | 'builds'
  | 'raids'
  | 'lore'
  | 'economy'
  | 'meta';

export interface StatHighlight {
  label: string;
  value: string;
  tier?: 'S' | 'A' | 'B' | 'Legendary';
}

export interface LootItem {
  name: string;
  dropRate: string;
  rarity: 'legendary' | 'epic' | 'rare' | 'magic';
  source: string;
}

export interface ArticleSection {
  title: string;
  text: string;
  tipBox?: string;
  lootTable?: LootItem[];
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  date: string;
  likes: number;
}

export interface Article {
  id: string;
  title: string;
  subtitle: string;
  game: GameTitle;
  category: ArticleCategory;
  coverImage: string;
  authorName: string;
  authorAvatar: string;
  authorTitle: string;
  date: string;
  readTime: string;
  views: number;
  likes: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  tags: string[];
  statHighlights?: StatHighlight[];
  sections: ArticleSection[];
  conclusion?: string;
  comments: Comment[];
}

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  avatar: string;
  title: string;
  createdAt: string;
}

export interface ServerConfig {
  host: string;
  port: number;
  protocol: 'https' | 'http';
  apiKey: string;
  serverName: string;
  autoPing: boolean;
  status: 'connected' | 'unreachable' | 'checking';
  lastPingMs: number;
  uptime: string;
  cpuUsage: number;
  ramUsage: number;
  diskUsage: number;
}

export interface ServerFile {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'directory';
  size: string;
  modified: string;
  extension?: string;
  content?: string;
}

export interface DockerService {
  name: string;
  image: string;
  status: 'running' | 'stopped' | 'restarting';
  ports: string;
  cpu: string;
  ram: string;
  logs?: string[];
}

export type ViewMode = 'catalog' | 'reader' | 'editor' | 'bookmarks' | 'admin';
