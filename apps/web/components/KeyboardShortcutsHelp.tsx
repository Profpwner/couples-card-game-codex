import React from 'react';

export default function KeyboardShortcutsHelp({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  if (!visible) return null;
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="kbd-help-title"
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#fff', color: '#111', padding: 16, width: 420, maxWidth: '90%', borderRadius: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 id="kbd-help-title" style={{ margin: 0 }}>Keyboard Shortcuts</h3>
          <button aria-label="Close shortcuts help" onClick={onClose}>
            ✕
          </button>
        </div>
        <ul style={{ marginTop: 12 }}>
          <li><code>/</code> — Focus search input (where available)</li>
          <li><code>Alt</code> + <code>Shift</code> + <code>N</code> — Focus primary navigation</li>
          <li><code>Tab</code> — Navigate interactive elements</li>
          <li><code>Enter</code>/<code>Space</code> — Activate focused item</li>
        </ul>
      </div>
    </div>
  );
}

