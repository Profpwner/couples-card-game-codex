import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { submitPackViaProxy } from '../lib/proxyClient';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface Card {
  id: string;
  content: string;
}

const initialCards: Card[] = [
  { id: 'card-1', content: 'Card 1' },
  { id: 'card-2', content: 'Card 2' },
  { id: 'card-3', content: 'Card 3' },
];

export default function PackBuilder() {
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [showModal, setShowModal] = useState(false);
  const [newCardText, setNewCardText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const skipNextAutosaveRef = React.useRef(false);
  const [packId, setPackId] = useState('');
  const [status, setStatus] = useState<string>('');
  const [title, setTitle] = useState('');
  const { user } = useAuth?.() ?? { user: null } as any;
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Load cards for a given packId (optional, when user types an id)
  useEffect(() => {
    let didCancel = false;
    const load = async () => {
      if (!packId) return;
      try {
        const res = await fetch(`/api/creator/packs/${packId}/cards`, { credentials: 'include' });
        if (!res.ok) return;
        const data = await res.json();
        if (!didCancel && Array.isArray(data.cards)) {
          setCards(data.cards.map((c: string, i: number) => ({ id: `card-${i + 1}`, content: c })));
        }
      } catch {
        // ignore
      }
    };
    load();
    return () => {
      didCancel = true;
    };
  }, [packId]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(cards);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setCards(reordered);
    // Persist server-side ordering if a pack is selected
    if (packId) {
      (async () => {
        try {
          setIsSaving(true);
          setSaveError(null);
          // Build order mapping based on id positions (stable vs content)
          const oldIds = cards.map(c => c.id);
          const order = reordered.map(c => oldIds.indexOf(c.id));
          const res = await fetch(`/api/creator/packs/${packId}/cards/reorder`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ order }),
          });
          if (!res.ok) throw new Error('Reorder failed');
          // Avoid immediate autosave PUT after a successful reorder
          skipNextAutosaveRef.current = true;
          setStatus('Saved');
        } catch (e: any) {
          setSaveError(e.message || 'Reorder failed');
          setStatus(`Save failed: ${e.message || ''}`.trim());
        } finally {
          setIsSaving(false);
        }
      })();
    }
  };

  // Autosave with debounce when cards or packId change
  useEffect(() => {
    if (!packId) return;
    const timer = setTimeout(async () => {
      if (skipNextAutosaveRef.current) {
        skipNextAutosaveRef.current = false;
        return;
      }
      try {
        setIsSaving(true);
        setSaveError(null);
        const payload = { cards: cards.map(c => c.content) };
        const res = await fetch(`/api/creator/packs/${packId}/cards`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Autosave failed');
        setStatus('Saved');
      } catch (e: any) {
        setSaveError(e.message || 'Autosave failed');
        setStatus(`Save failed: ${e.message || ''}`.trim());
      } finally {
        setIsSaving(false);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [packId, JSON.stringify(cards)]);

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="pack-id-input">Pack ID:&nbsp;</label>
        <input id="pack-id-input" aria-label="Pack ID" value={packId} onChange={e => setPackId(e.target.value)} placeholder="e.g. p1" />
        <label htmlFor="pack-title-input" style={{ marginLeft: 12 }}>Title:&nbsp;</label>
        <input id="pack-title-input" aria-label="Pack title" value={title} onChange={e => setTitle(e.target.value)} placeholder="New pack title" />
        <button
          style={{ marginLeft: 8 }}
          onClick={async () => {
            try {
              setStatus('Submitting...');
              const res = await submitPackViaProxy(packId);
              setStatus(`Submitted (logId: ${res.logId || 'ok'})`);
            } catch (e: any) {
              setStatus(`Submit failed: ${e.message}`);
            }
          }}
          disabled={!packId}
        >
          Submit Pack
        </button>
        <button
          style={{ marginLeft: 8 }}
          onClick={async () => {
            try {
              setStatus('Creating...');
              const res = await fetch('/api/creator/packs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ creatorId: user?.userId, title }),
              });
              const data = await res.json();
              if (!res.ok) throw new Error(data.error || 'Create failed');
              setPackId(data.packId);
              setStatus('Created');
            } catch (e: any) {
              setStatus(`Create failed: ${e.message}`);
            }
          }}
          disabled={!title || !user?.userId}
        >
          Create Pack
        </button>
      </div>
      <button aria-label="Add Card" onClick={() => { setNewCardText(''); setShowModal(true); }}>Add Card</button>
      {showModal && (
        <div role="dialog" aria-modal="true" aria-labelledby="add-card-title" style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
          <p id="add-card-title">Add a new card</p>
          <input
            aria-label="New card text"
            placeholder="Type card text"
            value={newCardText}
            onChange={e => setNewCardText(e.target.value)}
            style={{ width: '100%', marginBottom: 8 }}
          />
          <div>
            <button aria-label="Confirm add card"
              onClick={() => {
                if (!newCardText.trim()) return;
                const content = newCardText.trim();
                const next: Card = { id: `card-${Date.now()}`, content };
                const index = cards.length;
                // Optimistic update
                setCards(prev => [...prev, next]);
                setShowModal(false);
                setNewCardText('');
                // If we have a packId, POST to server and skip autosave
                if (packId) {
                  (async () => {
                    try {
                      setIsSaving(true);
                      setSaveError(null);
                      const res = await fetch(`/api/creator/packs/${packId}/cards`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({ index, content }),
                      });
                      if (!res.ok) throw new Error('Add failed');
                      skipNextAutosaveRef.current = true;
                      setStatus('Saved');
                    } catch (e: any) {
                      setSaveError(e.message || 'Add failed');
                      setStatus(`Save failed: ${e.message || ''}`.trim());
                    } finally {
                      setIsSaving(false);
                    }
                  })();
                }
              }}
              disabled={!newCardText.trim()}
            >
              Add
            </button>
            <button aria-label="Close add card dialog" style={{ marginLeft: 8 }} onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="pack">
          {provided => (
            <ul {...provided.droppableProps} ref={provided.innerRef} style={{ listStyle: 'none', padding: 0 }}>
              {cards.map((card, index) => (
                <Draggable key={card.id} draggableId={card.id} index={index}>
                  {prov => (
                    <li
                      ref={prov.innerRef}
                      {...prov.draggableProps}
                      {...prov.dragHandleProps}
                      style={{
                        padding: '0.5rem',
                        margin: '0.5rem 0',
                        background: '#f0f0f0',
                        ...prov.draggableProps.style,
                      }}
                    >
                      {editingId === card.id ? (
                        <div>
                          <input
                            aria-label="Edit card text"
                            value={editingText}
                            onChange={e => setEditingText(e.target.value)}
                            style={{ width: '70%' }}
                          />
                          <button
                            style={{ marginLeft: 8 }}
                            onClick={() => {
                              const idx = cards.findIndex(c => c.id === card.id);
                              if (idx >= 0) {
                                // Optimistic update
                                setCards(prev => prev.map(c => (c.id === card.id ? { ...c, content: editingText } : c)));
                                // Partial PATCH to backend
                                (async () => {
                                  try {
                                    setIsSaving(true);
                                    setSaveError(null);
                                    const res = await fetch(`/api/creator/packs/${packId}/cards`, {
                                      method: 'PATCH',
                                      headers: { 'Content-Type': 'application/json' },
                                      credentials: 'include',
                                      body: JSON.stringify({ index: idx, content: editingText }),
                                    });
                                    if (!res.ok) throw new Error('Patch failed');
                                    // Avoid immediate autosave PUT
                                    skipNextAutosaveRef.current = true;
                                    setStatus('Saved');
                                  } catch (e: any) {
                                    setSaveError(e.message || 'Patch failed');
                                    setStatus(`Save failed: ${e.message || ''}`.trim());
                                  } finally {
                                    setIsSaving(false);
                                  }
                                })();
                              }
                              setEditingId(null);
                              setEditingText('');
                            }}
                            disabled={!editingText.trim()}
                          >
                            Apply
                          </button>
                          <button style={{ marginLeft: 8 }} onClick={() => { setEditingId(null); setEditingText(''); }}>Cancel</button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span>{card.content}</span>
                          <span>
                            <button
                              onClick={() => { setEditingId(card.id); setEditingText(card.content); }}
                            >
                              Edit
                            </button>
                            <button
                              style={{ marginLeft: 8 }}
                              onClick={() => {
                                const idx = cards.findIndex(c => c.id === card.id);
                                if (idx >= 0) {
                                  // Optimistic remove
                                  setCards(prev => prev.filter(c => c.id !== card.id));
                                  if (packId) {
                                    (async () => {
                                      try {
                                        setIsSaving(true);
                                        setSaveError(null);
                                        const url = `/api/creator/packs/${packId}/cards?index=${idx}`;
                                        const res = await fetch(url, { method: 'DELETE', credentials: 'include' });
                                        if (!res.ok) throw new Error('Delete failed');
                                        skipNextAutosaveRef.current = true;
                                        setStatus('Saved');
                                      } catch (e: any) {
                                        setSaveError(e.message || 'Delete failed');
                                        setStatus(`Save failed: ${e.message || ''}`.trim());
                                      } finally {
                                        setIsSaving(false);
                                      }
                                    })();
                                  }
                                }
                              }}
                            >
                              Delete
                            </button>
                          </span>
                        </div>
                      )}
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      <div style={{ marginTop: 12 }}>
        <button
          onClick={async () => {
            if (!packId) return;
            try {
              setStatus('Saving...');
              const payload = { cards: cards.map(c => c.content) };
              const res = await fetch(`/api/creator/packs/${packId}/cards`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload),
              });
              if (!res.ok) throw new Error('Save failed');
              setStatus('Saved');
              setSaveError(null);
            } catch (e: any) {
              setStatus(`Save failed: ${e.message}`);
              setSaveError(e.message || 'Save failed');
            }
          }}
          disabled={!packId}
        >
          Save
        </button>
        {isSaving && <span style={{ marginLeft: 8, color: '#888' }}>Saving...</span>}
        {saveError && <span style={{ marginLeft: 8, color: 'crimson' }}>Error: {saveError}</span>}
      </div>
      {status && <p role="status" aria-live="polite" style={{ marginTop: 12, color: '#555' }}>{status}</p>}
    </div>
  );
}
