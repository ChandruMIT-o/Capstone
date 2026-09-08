import type { CommandItem } from '../types';

const COMMANDS_STORAGE_KEY = 'quantum_desk_commands_v1';

export const INITIAL_COMMANDS: CommandItem[] = [
  {
    id: 'cmd-1',
    title: 'Create & Switch Feature Branch',
    command: 'git checkout -b {{branch_name}}',
    description: 'Creates a clean new git branch and checks it out immediately.',
    category: 'Git',
    shellType: 'zsh',
    variables: ['branch_name'],
    tags: ['Git', 'Workflow', 'Branch'],
    useCount: 24,
    starred: true,
    createdAt: '2026-08-30T10:00:00.000Z',
  },
  {
    id: 'cmd-2',
    title: 'Vite Local Dev Server with Host',
    command: 'npm run dev -- --host --port {{port}}',
    description: 'Launches Vite development server exposed to local network.',
    category: 'Node/npm',
    shellType: 'powershell',
    defaultCwd: 'd:/DEV/Personal/Capstone',
    variables: ['port'],
    tags: ['Node', 'Vite', 'Dev'],
    useCount: 42,
    starred: true,
    createdAt: '2026-08-31T12:00:00.000Z',
  },
  {
    id: 'cmd-3',
    title: 'Docker Compose Up Detached',
    command: 'docker compose up -d --build',
    description: 'Builds and launches containers in background mode.',
    category: 'Docker',
    shellType: 'bash',
    tags: ['Docker', 'Compose', 'Containers'],
    useCount: 19,
    starred: true,
    createdAt: '2026-09-01T09:00:00.000Z',
  },
  {
    id: 'cmd-4',
    title: 'Kill Running Process on Network Port',
    command: 'npx kill-port {{port}}',
    description: 'Force terminates any process occupying the specified TCP port.',
    category: 'System',
    shellType: 'bash',
    variables: ['port'],
    tags: ['Network', 'Port', 'Debug'],
    useCount: 31,
    starred: false,
    createdAt: '2026-09-02T14:30:00.000Z',
  },
  {
    id: 'cmd-5',
    title: 'Prune All Stopped Docker Containers & Volumes',
    command: 'docker system prune -a --volumes -f',
    description: 'Frees up disk space by removing unused containers, networks, and images.',
    category: 'Docker',
    shellType: 'bash',
    tags: ['Docker', 'Cleanup', 'Maintenance'],
    useCount: 11,
    starred: false,
    createdAt: '2026-09-03T11:00:00.000Z',
  },
  {
    id: 'cmd-6',
    title: 'Git Interactive Rebase Last N Commits',
    command: 'git rebase -i HEAD~{{commit_count}}',
    description: 'Squashes, rewords, or reorganizes recent local commits.',
    category: 'Git',
    shellType: 'zsh',
    variables: ['commit_count'],
    tags: ['Git', 'Rebase', 'Clean'],
    useCount: 16,
    starred: false,
    createdAt: '2026-09-04T15:20:00.000Z',
  },
  {
    id: 'cmd-7',
    title: 'Tail Live Kubernetes Pod Logs',
    command: 'kubectl logs -f {{pod_name}} -n {{namespace}}',
    description: 'Streams live log output from a specified K8s pod.',
    category: 'Kubernetes',
    shellType: 'bash',
    variables: ['pod_name', 'namespace'],
    tags: ['K8s', 'Logs', 'Cluster'],
    useCount: 8,
    starred: true,
    createdAt: '2026-09-05T08:45:00.000Z',
  },
  {
    id: 'cmd-8',
    title: 'PostgreSQL Database Backup Dump',
    command: 'pg_dump -U postgres -d {{db_name}} > {{output_file}}.sql',
    description: 'Exports full schema and data of a Postgres database into a SQL script.',
    category: 'Database',
    shellType: 'bash',
    variables: ['db_name', 'output_file'],
    tags: ['Postgres', 'Database', 'Backup'],
    useCount: 7,
    starred: false,
    createdAt: '2026-09-06T10:15:00.000Z',
  },
];

export function getStoredCommands(): CommandItem[] {
  try {
    const raw = localStorage.getItem(COMMANDS_STORAGE_KEY);
    if (raw === null) return INITIAL_COMMANDS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_COMMANDS;
  } catch {
    return INITIAL_COMMANDS;
  }
}

export function saveCommands(commands: CommandItem[]): void {
  try {
    localStorage.setItem(COMMANDS_STORAGE_KEY, JSON.stringify(commands));
  } catch (err) {
    console.error('Failed to save commands to localStorage', err);
  }

  fetch('/api/commands', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commands, null, 2),
  }).catch((err) => {
    console.warn('Server JSON commands sync skipped or unavailable:', err);
  });
}

// Utility helper to extract {{var}} placeholders from command strings automatically
export function extractCommandVariables(cmdString: string): string[] {
  const matches = cmdString.match(/\{\{([^}]+)\}\}/g);
  if (!matches) return [];
  const unique = new Set(matches.map((m) => m.replace(/\{\{|\}\}/g, '').trim()));
  return Array.from(unique);
}

// Universal robust copy to clipboard helper with fallback for iframe / HTTP / restricted environments
export async function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('navigator.clipboard.writeText failed, using fallback:', err);
    }
  }
  return fallbackCopyTextToClipboard(text);
}

function fallbackCopyTextToClipboard(text: string): boolean {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Fallback copy failed:', err);
    return false;
  }
}

