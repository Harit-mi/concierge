'use client';

import React, { useEffect, useState } from 'react';
import { IconHistory, IconShield, IconUser } from '@/components/icons/FlaticonIcons';

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/audit-logs');
        if (res.ok) {
          const data = await res.json();
          setLogs(data.logs || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6 text-titanium-200">
      <div className="border-b border-white/5 pb-5">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Immutable System Audit Trail
        </h1>
        <p className="text-xs text-titanium-400 mt-1 font-sans">
          Chronological, tamper-evident record of all critical state transitions, quote publications, payments, and document accesses.
        </p>
      </div>

      <div className="stealth-card rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs font-mono text-titanium-500">Loading audit ledger...</div>
        ) : logs.length === 0 ? (
          <div className="p-16 text-center text-xs font-mono text-titanium-400">No audit events recorded.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-carbon-900 border-b border-white/10 text-titanium-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Actor</th>
                  <th className="px-6 py-4">Action Event</th>
                  <th className="px-6 py-4">Target Resource</th>
                  <th className="px-6 py-4">Diff / Metadata Payload</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-titanium-300">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-carbon-800/40 transition-colors">
                    <td className="px-6 py-4 text-titanium-500 text-[11px] whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-sans">
                      <div className="font-semibold text-white">{log.actorName}</div>
                      <div className="text-[10px] text-titanium-400 font-mono">{log.actorRole}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-carbon-800 border border-white/10 text-bronze-300 px-2 py-0.5 rounded font-bold text-[11px]">
                        {log.action_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-titanium-300">
                      <span className="text-titanium-500 font-normal">{log.resource_type}: </span>
                      <span className="font-semibold text-white">{log.resource_id}</span>
                    </td>
                    <td className="px-6 py-4 text-[10px] text-titanium-400 max-w-xs truncate font-mono">
                      {log.metadata_json || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
