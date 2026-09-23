export interface ExecutionLog {
  id: string;
  toolId: string;
  toolName: string;
  toolType: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
  commandPreview: string;
  durationMs?: number;
}
