export type AppView = 'home' | 'linker' | 'commands';

export type ReadingStatus = 'unread' | 'reading' | 'completed';

export interface Bookmark {
  id: string;
  url: string;
  title: string;
  domain: string;
  description: string;
  faviconUrl: string;
  readingTimeMinutes: number;
  tags: string[];
  status: ReadingStatus;
  starred: boolean;
  createdAt: string;
  notes?: string;
  collection?: string;
}

export type NodeType = 'link' | 'tag' | 'collection';

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  color: string;
  val: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  subText?: string;
  linkId?: string;
  connections: string[];
}

export interface GraphEdge {
  source: string;
  target: string;
  label?: string;
}

export interface CommandMacro {
  id: string;
  name: string;
  description: string;
  shortcut?: string;
  category: 'System' | 'Data' | 'Graph' | 'Queue';
  action: string;
}
