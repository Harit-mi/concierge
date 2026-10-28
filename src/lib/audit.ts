import db from './db';
import { randomUUID } from 'crypto';

export function recordAuditLog(
  actorUserId: string,
  actionType: string,
  resourceType: string,
  resourceId: string,
  metadata?: Record<string, any>
): void {
  try {
    const id = `aud-${Date.now()}-${randomUUID().substring(0, 8)}`;
    const metadataJson = metadata ? JSON.stringify(metadata) : null;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO audit_logs (id, actor_user_id, action_type, resource_type, resource_id, metadata_json, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, actorUserId, actionType, resourceType, resourceId, metadataJson, now);
  } catch (err) {
    console.error('Failed to write audit log:', err);
  }
}
