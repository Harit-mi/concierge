import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';
import { recordAuditLog } from '@/lib/audit';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const sessionUser = await getSession();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');
    const requestId = searchParams.get('requestId');

    let query = `
      SELECT d.*, u.name as uploaderName
      FROM documents d
      JOIN users u ON d.uploaded_by_user_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (orderId) {
      query += ' AND d.order_id = ?';
      params.push(orderId);
    }
    if (requestId) {
      query += ' AND d.request_id = ?';
      params.push(requestId);
    }

    // Role-based document confidentiality check
    if (sessionUser.role === 'CUSTOMER') {
      query += ' AND d.is_confidential_operator_only = 0';
      // Verify ownership
      query += ` AND (
        d.request_id IN (SELECT id FROM product_requests WHERE customer_id = ?)
        OR d.order_id IN (SELECT id FROM orders WHERE customer_id = ?)
      )`;
      params.push(sessionUser.id, sessionUser.id);
    }

    query += ' ORDER BY d.created_at DESC';

    const documents = db.prepare(query).all(...params);
    return NextResponse.json({ documents });
  } catch (err: any) {
    console.error('Fetch documents error:', err);
    return NextResponse.json({ error: 'Failed to retrieve documents.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getSession();
    if (!sessionUser || sessionUser.role === 'CUSTOMER') {
      return NextResponse.json({ error: 'Only operators can register official order documents.' }, { status: 403 });
    }

    const body = await req.json();
    const { requestId, orderId, documentType, title, filePath, mimeType = 'application/pdf', isConfidentialOperatorOnly = false } = body;

    if (!title || !documentType || !filePath) {
      return NextResponse.json({ error: 'Missing required document parameters.' }, { status: 400 });
    }

    const docId = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO documents (
        id, request_id, order_id, uploaded_by_user_id, document_type,
        title, file_path, mime_type, is_confidential_operator_only, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      docId,
      requestId || null,
      orderId || null,
      sessionUser.id,
      documentType,
      title,
      filePath,
      mimeType,
      isConfidentialOperatorOnly ? 1 : 0,
      now
    );

    recordAuditLog(sessionUser.id, 'DOCUMENT_REGISTERED', 'documents', docId, {
      title,
      documentType,
      orderId,
      isConfidential: isConfidentialOperatorOnly,
    });

    return NextResponse.json({ success: true, docId, message: 'Document archived in secure vault.' });
  } catch (err: any) {
    console.error('Document upload error:', err);
    return NextResponse.json({ error: 'Failed to record document.' }, { status: 500 });
  }
}
