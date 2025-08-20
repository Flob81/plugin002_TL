import React, { useEffect, useState } from 'react';
import { view } from '@forge/bridge';

export default function App() {
  const [ext, setExt] = useState(null);

  useEffect(() => {
    view.getContext().then(({ extension }) => setExt(extension));
  }, []);

  if (!ext) return <>Loading…</>;

  const v = (ext.fieldValue ?? 'none');
  const cfg = ext.configuration || {};
  const mapEmoji = {
    none: '⚪️⚪️⚪️',
    red: '🔴⚪️⚪️',
    yellow: '⚪️🟡⚪️',
    green: '⚪️⚪️🟢'
  };
  const mapLabel = {
    none: cfg.noneLabel || '',
    red: cfg.redLabel || '',
    yellow: cfg.yellowLabel || '',
    green: cfg.greenLabel || ''
  };

  // reine Anzeige (keine Buttons)
  return (
    <div style={{ padding: ext.renderContext === 'issue-view' ? '8px 0' : 0, display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 18, lineHeight: 1 }}>{mapEmoji[v] || mapEmoji.none}</span>
      <span style={{ fontSize: 14, lineHeight: 1.2 }}>{mapLabel[v]}</span>
    </div>
  );
}
