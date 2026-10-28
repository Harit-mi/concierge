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
    const conversationId = searchParams.get('conversationId');
    const requestId = searchParams.get('requestId');

    let conv = null;
    if (conversationId) {
      conv = db.prepare('SELECT * FROM conversations WHERE id = ?').get(conversationId) as any;
    } else if (requestId) {
      conv = db.prepare('SELECT * FROM conversations WHERE request_id = ?').get(requestId) as any;
    } else if (sessionUser.role === 'CUSTOMER') {
      // Find latest conversation for this customer
      conv = db.prepare('SELECT * FROM conversations WHERE customer_id = ? ORDER BY last_message_at DESC LIMIT 1').get(sessionUser.id) as any;
    }

    if (!conv) {
      // Return empty messages or all conversations if operator
      if (sessionUser.role !== 'CUSTOMER') {
        const allConversations = db.prepare(`
          SELECT c.*, r.product_name, r.reference_number, u.name as customerName
          FROM conversations c
          JOIN product_requests r ON c.request_id = r.id
          JOIN users u ON c.customer_id = u.id
          ORDER BY c.last_message_at DESC
        `).all();
        return NextResponse.json({ conversations: allConversations, messages: [] });
      }
      return NextResponse.json({ conversation: null, messages: [] });
    }

    // Role ownership check
    if (sessionUser.role === 'CUSTOMER' && conv.customer_id !== sessionUser.id) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    let msgQuery = `
      SELECT m.*, u.name as senderName, u.role as senderRole
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.conversation_id = ?
    `;

    // Filter out internal notes for customers
    if (sessionUser.role === 'CUSTOMER') {
      msgQuery += ' AND m.is_internal_note = 0';
    }

    msgQuery += ' ORDER BY m.created_at ASC';

    const messages = db.prepare(msgQuery).all(conv.id);

    return NextResponse.json({
      conversation: conv,
      messages,
    });
  } catch (err: any) {
    console.error('Fetch messages error:', err);
    return NextResponse.json({ error: 'Failed to retrieve messages.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getSession();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const { conversationId, requestId, messageText, isInternalNote = false } = body;

    if (!messageText || !messageText.trim()) {
      return NextResponse.json({ error: 'Message text cannot be empty.' }, { status: 400 });
    }

    let conv = null;
    if (conversationId) {
      conv = db.prepare('SELECT * FROM conversations WHERE id = ?').get(conversationId) as any;
    } else if (requestId) {
      conv = db.prepare('SELECT * FROM conversations WHERE request_id = ?').get(requestId) as any;
      if (!conv) {
        // Auto create conversation
        const newConvId = `conv-${requestId}`;
        const reqRecord = db.prepare('SELECT customer_id FROM product_requests WHERE id = ?').get(requestId) as any;
        const now = new Date().toISOString();
        db.prepare('INSERT INTO conversations (id, request_id, customer_id, last_message_at, created_at) VALUES (?, ?, ?, ?, ?)')
          .run(newConvId, requestId, reqRecord?.customer_id || sessionUser.id, now, now);
        conv = { id: newConvId, customer_id: reqRecord?.customer_id || sessionUser.id };
      }
    }

    if (!conv) {
      return NextResponse.json({ error: 'Conversation not found.' }, { status: 404 });
    }

    // Role check: Only operators can write internal notes
    const actualIsInternal = sessionUser.role === 'CUSTOMER' ? 0 : (isInternalNote ? 1 : 0);

    const now = new Date().toISOString();
    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    db.prepare(`
      INSERT INTO messages (id, conversation_id, sender_id, message_text, is_internal_note, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(messageId, conv.id, sessionUser.id, messageText.trim(), actualIsInternal, now);

    db.prepare('UPDATE conversations SET last_message_at = ? WHERE id = ?').run(now, conv.id);

    return NextResponse.json({
      success: true,
      message: {
        id: messageId,
        conversationId: conv.id,
        senderId: sessionUser.id,
        senderName: sessionUser.name,
        senderRole: sessionUser.role,
        messageText: messageText.trim(),
        isInternalNote: actualIsInternal,
        createdAt: now,
      },
    });
  } catch (err: any) {
    console.error('Send message error:', err);
    return NextResponse.json({ error: 'Failed to dispatch message.' }, { status: 500 });
  }
}
