'use client'
import { useState, useEffect, useRef, ReactNode, DragEvent } from 'react'

interface Widget {
  id: string
  label: string
  content: ReactNode
}

interface DraggableWidgetsProps {
  widgets: Widget[]
  storageKey?: string
}

export default function DraggableWidgets({ widgets, storageKey = 'widget-order' }: DraggableWidgetsProps) {
  const [order, setOrder] = useState<string[]>(() => widgets.map(w => w.id))
  const [dragId, setDragId] = useState<string | null>(null)
  const [dropIdx, setDropIdx] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Restore order from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed: string[] = JSON.parse(saved)
        const ids = new Set(widgets.map(w => w.id))
        if (parsed.length === ids.size && parsed.every(id => ids.has(id))) {
          setOrder(parsed)
        }
      }
    } catch {
      // ignore
    }
  }, [storageKey, widgets])

  // Save order to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(order))
    } catch {
      // ignore
    }
  }, [order, storageKey])

  const widgetMap = new Map(widgets.map(w => [w.id, w]))

  const ordered = order
    .map(id => widgetMap.get(id))
    .filter((w): w is Widget => w !== undefined)

  function handleDragStart(e: DragEvent<HTMLDivElement>, id: string) {
    setDragId(id)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', id)
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>, idx: number) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    const rect = e.currentTarget.getBoundingClientRect()
    const midY = rect.top + rect.height / 2
    const insertIdx = e.clientY < midY ? idx : idx + 1
    setDropIdx(insertIdx)
  }

  function handleContainerDragLeave(e: DragEvent<HTMLDivElement>) {
    if (containerRef.current && !containerRef.current.contains(e.relatedTarget as Node)) {
      setDropIdx(null)
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    if (dragId === null || dropIdx === null) return

    const fromIdx = order.indexOf(dragId)
    if (fromIdx === -1) return

    const newOrder = [...order]
    newOrder.splice(fromIdx, 1)
    const adjustedIdx = dropIdx > fromIdx ? dropIdx - 1 : dropIdx
    newOrder.splice(adjustedIdx, 0, dragId)

    setOrder(newOrder)
    setDragId(null)
    setDropIdx(null)
  }

  function handleDragEnd() {
    setDragId(null)
    setDropIdx(null)
  }

  return (
    <div
      ref={containerRef}
      onDragLeave={handleContainerDragLeave}
      onDragOver={e => e.preventDefault()}
      onDrop={handleDrop}
      className="dw-container"
    >
      {ordered.map((w, idx) => (
        <div key={w.id}>
          {dropIdx === idx && dragId !== w.id && (
            <div className="dw-drop-indicator" />
          )}
          <div
            className={`dw-widget${dragId === w.id ? ' dw-dragging' : ''}`}
            draggable={false}
            onDragOver={e => handleDragOver(e, idx)}
          >
            <div
              className="dw-handle"
              draggable
              onDragStart={e => handleDragStart(e, w.id)}
              onDragEnd={handleDragEnd}
              title={w.label}
            >
              &#x2807;
            </div>
            {w.content}
          </div>
          {idx === ordered.length - 1 && dropIdx === ordered.length && dragId !== w.id && (
            <div className="dw-drop-indicator" />
          )}
        </div>
      ))}

      <style>{`
        .dw-container {
          display: flex;
          flex-direction: column;
        }
        .dw-widget {
          position: relative;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }
        .dw-widget.dw-dragging {
          opacity: 0.5;
        }
        .dw-handle {
          position: absolute;
          top: 6px;
          right: 6px;
          cursor: grab;
          opacity: 0;
          transition: opacity 0.15s ease;
          z-index: 10;
          font-size: 18px;
          line-height: 1;
          padding: 2px 4px;
          border-radius: 4px;
          color: var(--tx3, #999);
          user-select: none;
        }
        .dw-handle:active {
          cursor: grabbing;
        }
        .dw-widget:hover .dw-handle {
          opacity: 1;
        }
        .dw-drop-indicator {
          height: 2px;
          background: var(--p, #FB8C00);
          border-radius: 1px;
          margin: 2px 0;
        }
      `}</style>
    </div>
  )
}
