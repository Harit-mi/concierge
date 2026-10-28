'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  IconFileText,
  IconDownload,
  IconLock,
  IconShield,
  IconSearch,
  IconFilter,
} from '@/components/icons/FlaticonIcons';

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/documents');
        if (res.ok) {
          const data = await res.json();
          setDocuments(data.documents || []);
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
          Private Document & Provenance Vault
        </h1>
        <p className="text-xs text-titanium-400 mt-1 font-sans">
          Restricted repository for quotes, wholesale partner invoices, customer receipts, and carrier dispatch manifests.
        </p>
      </div>

      <div className="stealth-card rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs font-mono text-titanium-500">Loading document registry...</div>
        ) : documents.length === 0 ? (
          <div className="p-16 text-center text-xs font-mono text-titanium-400">No documents registered.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-carbon-900 border-b border-white/10 text-titanium-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">Document Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Associated Order</th>
                  <th className="px-6 py-4">Security Clearance</th>
                  <th className="px-6 py-4">Archived By</th>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-titanium-300">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-carbon-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <IconFileText className="w-4 h-4 text-bronze-400" />
                        <span className="font-semibold text-white font-sans">{doc.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-carbon-800 border border-white/5 text-titanium-300 px-2 py-0.5 rounded text-[10px]">
                        {doc.document_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-titanium-200">
                      {doc.order_id ? (
                        <Link href={`/admin/orders/${doc.order_id}`} className="hover:underline text-bronze-300 font-semibold hover:text-bronze-200">
                          Order #{doc.order_id.substring(0, 12)}
                        </Link>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {doc.is_confidential_operator_only ? (
                        <span className="inline-flex items-center gap-1.5 text-[10px] text-rose-300 bg-rose-500/10 border border-rose-500/30 px-2.5 py-0.5 rounded font-mono font-bold">
                          <IconLock className="w-3 h-3 text-rose-400" />
                          <span>Confidential Staff</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[10px] text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded font-mono font-bold">
                          <IconShield className="w-3 h-3 text-emerald-400" />
                          <span>Client Visible</span>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-titanium-300 font-sans">
                      {doc.uploaderName}
                    </td>
                    <td className="px-6 py-4 text-titanium-500 text-[11px]">
                      {new Date(doc.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <a
                        href={doc.file_path}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 bg-carbon-800 border border-white/10 px-3 py-1.5 rounded text-titanium-200 hover:border-bronze-500/40 hover:text-white font-mono text-[11px] transition-colors"
                      >
                        <IconDownload className="w-3 h-3 text-bronze-400" />
                        <span>Download</span>
                      </a>
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
