import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { MessageCircle, X, Send } from 'lucide-react';
import { supabase, WORKSPACE_ID } from '../lib/supabase';

function getVisitorId() {
  let id = localStorage.getItem('dorinda_visitor_id');
  if (!id) {
    id = (crypto.randomUUID && crypto.randomUUID()) || 'v-' + Date.now() + '-' + Math.random().toString(36).slice(2);
    localStorage.setItem('dorinda_visitor_id', id);
  }
  return id;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false); // enviando ou aguardando resposta
  const [error, setError] = useState(null);

  const visitorIdRef = useRef(null);
  const conversationIdRef = useRef(localStorage.getItem('dorinda_conversation_id') || null);
  const lastSeenIdRef = useRef(0);
  const loadedRef = useRef(false);
  const pollRef = useRef(null);
  const panelRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    visitorIdRef.current = getVisitorId();
    return () => clearInterval(pollRef.current);
  }, []);

  // abre o widget com contexto via evento global (botão "Falar com a Dorinda" na página do imóvel)
  useEffect(() => {
    function onOpen(e) {
      setOpen(true);
      const msg = e.detail && e.detail.message;
      if (msg) setInput(msg);
    }
    window.addEventListener('dorinda:open', onOpen);
    return () => window.removeEventListener('dorinda:open', onOpen);
  }, []);

  // entrada cinematográfica do painel
  useEffect(() => {
    if (open && panelRef.current) {
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: 24, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' }
      );
    }
  }, [open]);

  // carrega histórico ao abrir (se já existe conversa)
  useEffect(() => {
    if (!open || loadedRef.current || !conversationIdRef.current) return;
    loadedRef.current = true;
    (async () => {
      const { data, error: err } = await supabase
        .from('chat_messages')
        .select('id,sender_type,sender_name,content')
        .eq('conversation_id', conversationIdRef.current)
        .order('id', { ascending: true });
      if (!err && data && data.length) {
        setMessages(
          data.map((r) => ({
            key: 'db-' + r.id,
            role: r.sender_type === 'visitor' ? 'visitor' : 'ai',
            name: r.sender_name,
            content: r.content,
          }))
        );
        lastSeenIdRef.current = data[data.length - 1].id;
      }
    })();
  }, [open]);

  // auto-scroll
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, busy]);

  async function ensureConversation() {
    if (conversationIdRef.current) return conversationIdRef.current;
    const { data, error: err } = await supabase
      .from('chat_conversations')
      .insert({
        workspace_id: WORKSPACE_ID,
        visitor_id: visitorIdRef.current,
        visitor_name: 'Visitante do site',
        source: 'chat_widget',
        status: 'ai_mode',
      })
      .select('id')
      .single();
    if (err) throw err;
    conversationIdRef.current = data.id;
    localStorage.setItem('dorinda_conversation_id', data.id);
    return data.id;
  }

  function startPolling(convId) {
    clearInterval(pollRef.current);
    const startedAt = Date.now();
    pollRef.current = setInterval(async () => {
      const { data, error: err } = await supabase
        .from('chat_messages')
        .select('id,sender_type,sender_name,content')
        .eq('conversation_id', convId)
        .gt('id', lastSeenIdRef.current)
        .order('id', { ascending: true });
      if (!err && data && data.length) {
        const ai = data.filter((r) => r.sender_type !== 'visitor');
        if (ai.length) {
          setMessages((m) => [
            ...m,
            ...ai.map((r) => ({ key: 'db-' + r.id, role: 'ai', name: r.sender_name || 'Dorinda', content: r.content })),
          ]);
          lastSeenIdRef.current = data[data.length - 1].id;
          setBusy(false);
          clearInterval(pollRef.current);
          return;
        }
        lastSeenIdRef.current = data[data.length - 1].id;
      }
      if (Date.now() - startedAt > 60000) {
        clearInterval(pollRef.current);
        setBusy(false);
        setError('A Dorinda está demorando pra responder. Tenta de novo em instantes.');
      }
    }, 2500);
  }

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    setInput('');
    setError(null);
    setMessages((m) => [...m, { key: 'local-' + Date.now(), role: 'visitor', content: text }]);
    setBusy(true);
    try {
      const convId = await ensureConversation();
      const { data, error: err } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: convId,
          workspace_id: WORKSPACE_ID,
          sender_type: 'visitor',
          sender_name: 'Visitante',
          content: text,
        })
        .select('id')
        .single();
      if (err) throw err;
      lastSeenIdRef.current = Math.max(lastSeenIdRef.current, data.id);
      startPolling(convId);
    } catch (e) {
      setBusy(false);
      setError('Não consegui enviar agora. Tenta de novo?');
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  // sem Supabase configurado (env ausente) o widget se desativa — não derruba o site
  if (!supabase || !WORKSPACE_ID) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end font-sans">
      {open && (
        <div
          ref={panelRef}
          className="pill-container mb-4 flex h-[min(520px,calc(100dvh-7rem))] w-[min(380px,calc(100vw-3rem))] flex-col overflow-hidden rounded-3xl shadow-2xl"
          style={{ backgroundColor: 'rgba(13,13,18,0.72)' }}
        >
          {/* header */}
          <div className="flex items-center justify-between border-b border-ivory/10 px-5 py-4">
            <div className="flex flex-col">
              <span className="font-drama text-xl leading-none text-ivory">Dorinda</span>
              <span className="font-data mt-1 text-champagne">Atendimento · Leandro Alonso</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Fechar chat"
              className="rounded-full p-1.5 text-ivory/60 transition hover:bg-ivory/10 hover:text-ivory"
            >
              <X size={18} />
            </button>
          </div>

          {/* mensagens */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m) => (
              <div key={m.key} className={m.role === 'visitor' ? 'flex justify-end' : 'flex justify-start'}>
                <div
                  className={
                    'max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ' +
                    (m.role === 'visitor'
                      ? 'bg-champagne font-medium text-obsidian'
                      : 'bg-ivory/10 text-ivory/90')
                  }
                >
                  {m.content}
                </div>
              </div>
            ))}
            {busy && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl bg-ivory/10 px-4 py-3">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-champagne [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-champagne [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-champagne" />
                </div>
              </div>
            )}
            {error && <p className="px-1 text-xs text-red-300/80">{error}</p>}
          </div>

          {/* input */}
          <div className="border-t border-ivory/10 p-3">
            <div className="flex items-end gap-2 rounded-2xl border border-ivory/15 bg-obsidian/40 px-3 py-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                disabled={busy}
                rows={1}
                placeholder={busy ? 'Aguardando resposta…' : 'Escreva sua mensagem…'}
                className="max-h-24 flex-1 resize-none bg-transparent text-sm text-ivory placeholder:text-ivory/40 focus:outline-none disabled:opacity-50"
              />
              <button
                onClick={send}
                disabled={busy || !input.trim()}
                aria-label="Enviar"
                className="btn-magnetic shrink-0 rounded-xl bg-champagne p-2 text-obsidian disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* bolha */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Fechar chat' : 'Abrir chat'}
        className="btn-magnetic flex h-14 w-14 items-center justify-center rounded-full bg-champagne text-obsidian shadow-2xl ring-1 ring-ivory/20"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}
