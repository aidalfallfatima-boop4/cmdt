import { useEffect, useRef, useState } from 'react'
import { Send, Sparkles, Info } from 'lucide-react'
import { askCopilot, userMessage, WELCOME, SUGGESTED_QUESTIONS } from '../services/ai/copilot'
import { HBars } from './charts'
import type { ChatBlock, ChatMessage } from '../types'

function Blocks({ blocks }: { blocks?: ChatBlock[] }) {
  if (!blocks) return null
  return (
    <div className="mt-2 space-y-3">
      {blocks.map((b, i) => {
        if (b.type === 'text') return <p key={i} className="text-sm leading-relaxed text-ink-muted">{b.text}</p>
        if (b.type === 'note')
          return (
            <p key={i} className="flex items-start gap-2 rounded-md bg-warnbg/70 px-3 py-2 text-xs text-warn">
              <Info size={13} className="mt-0.5 shrink-0" />
              {b.text}
            </p>
          )
        if (b.type === 'list')
          return (
            <ul key={i} className="space-y-1.5">
              {b.items?.map((it, k) => (
                <li key={k} className="flex gap-2 text-sm text-ink-muted">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf" />
                  {it}
                </li>
              ))}
            </ul>
          )
        if (b.type === 'kpis')
          return (
            <div key={i} className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {b.kpis?.map((k, j) => (
                <div key={j} className="rounded-md border border-line bg-canvas/60 p-2.5">
                  <p className="stat-label">{k.label}</p>
                  <p className="mt-1 text-sm font-semibold tabular-nums text-ink">{k.value}</p>
                  {k.delta && (
                    <p className={`text-xs font-semibold ${k.tone === 'pos' ? 'text-pos' : k.tone === 'neg' ? 'text-neg' : 'text-ink-faint'}`}>
                      {k.delta}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )
        if (b.type === 'bars')
          return <HBars key={i} data={(b.bars ?? []).map((x) => ({ label: x.label, value: x.value, hint: x.hint }))} />
        return null
      })}
    </div>
  )
}

function Bubble({ m }: { m: ChatMessage }) {
  const isUser = m.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser ? 'bg-navy-900 text-white' : 'border border-line bg-surface'
        }`}
      >
        <p className={`text-sm ${isUser ? 'text-white' : 'font-medium text-ink'}`}>{m.content}</p>
        {!isUser && <Blocks blocks={m.blocks} />}
      </div>
    </div>
  )
}

export function AIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME])
  const [input, setInput] = useState('')
  const [pending, setPending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, pending])

  const submit = (text: string) => {
    const q = text.trim()
    if (!q || pending) return
    setMessages((m) => [...m, userMessage(q)])
    setInput('')
    setPending(true)
    setTimeout(() => {
      setMessages((m) => [...m, askCopilot(q)])
      setPending(false)
    }, 620)
  }

  return (
    <div className="card flex h-[640px] flex-col">
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="relative flex h-2.5 w-2.5">
          <span className="pulse-dot absolute inline-flex h-full w-full rounded-full bg-leaf" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-leaf" />
        </span>
        <div>
          <p className="text-sm font-semibold text-ink">CMDT AI Copilot</p>
          <p className="text-[11px] text-ink-muted">Assistant d'analyse décisionnelle</p>
        </div>
        <Sparkles size={15} className="ml-auto text-leaf" />
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((m) => (
          <Bubble key={m.id} m={m} />
        ))}
        {pending && (
          <div className="flex justify-start">
            <div className="rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-ink-faint">
              <span className="inline-flex gap-1">
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-ink-faint" />
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-ink-faint" style={{ animationDelay: '200ms' }} />
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-ink-faint" style={{ animationDelay: '400ms' }} />
              </span>
            </div>
          </div>
        )}
      </div>

      {messages.length <= 2 && (
        <div className="flex flex-wrap gap-2 border-t border-line px-4 py-3">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => submit(q)}
              className="rounded-full border border-line bg-canvas/70 px-3 py-1.5 text-xs text-ink-muted hover:border-leaf hover:text-ink"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <form
        className="flex items-end gap-2 border-t border-line p-3"
        onSubmit={(e) => {
          e.preventDefault()
          submit(input)
        }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              submit(input)
            }
          }}
          rows={1}
          placeholder="Interroger les données de la filière cotonnière…"
          className="max-h-28 flex-1 resize-none rounded-md border border-line bg-surface px-3 py-2 text-sm focus:border-leaf"
        />
        <button type="submit" className="btn-primary" disabled={pending || !input.trim()}>
          <Send size={15} />
        </button>
      </form>
    </div>
  )
}
