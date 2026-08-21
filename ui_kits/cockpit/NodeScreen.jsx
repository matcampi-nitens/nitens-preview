const { StatusBadge, SectionLabel, FeedbackPanel, CommentThread, ReadOnlyPanel, HistoryDrawer } = window.NitensCockpitDesignSystem_16befb;

function NodeScreen({ data, comments, onComment, feedback, onFeedback, onToggleFeedback }) {
  const n = data.flow.node;
  return (
    <div style={{ display:'flex', height:'100%' }}>
      <div style={{ minWidth:0, flex:1, overflow:'auto', padding:'var(--space-5)' }}>
        <div style={{ maxWidth:760 }}>
          <div style={{ fontFamily:'var(--font-mono)', fontSize:'var(--text-xs)', color:'var(--color-text-dim)' }}>{n.code + ' · ' + n.seq_id}</div>
          <h1 style={{ margin:'2px 0 8px', fontSize:'var(--text-lg)', fontWeight:600, color:'var(--color-accent)' }}>{n.title}</h1>
          <div style={{ display:'flex', alignItems:'center', gap:'var(--space-2)', marginBottom:'var(--space-4)', fontSize:'var(--text-xs)', color:'var(--color-text-dim)' }}>
            <StatusBadge status={n.status} /> {'· ' + n.node_type + ' · ' + n.epic_title}
          </div>

          <SectionLabel>Timeline live (SSE)</SectionLabel>
          <ul style={{ margin:'0 0 var(--space-5)', padding:0, listStyle:'none', fontSize:'var(--text-xs)' }}>
            {data.events.map((e,i) => (
              <li key={i} style={{ display:'flex', gap:'var(--space-2)', borderBottom:'1px solid var(--border-hairline-soft)', padding:'4px 0' }}>
                <span style={{ fontFamily:'var(--font-mono)', color:'var(--color-muted)' }}>{e.created_at.slice(11,19)}</span>
                <span style={{ color:'var(--color-text)' }}>{e.event_type}</span>
                {e.to && <span style={{ color:'var(--color-text-dim)' }}>{'→ ' + e.to}</span>}
              </li>
            ))}
          </ul>

          <div style={{ marginBottom:'var(--space-5)' }}>
            <ReadOnlyPanel title="Stato PR" columns={[{key:'pr',label:'pr',mono:true},{key:'branch',label:'branch',mono:true},{key:'checks',label:'checks',align:'right'},{key:'state',label:'stato'}]}
              rows={data.prs} footnote="Solo informativo: nessun controllo di merge o deploy da questa UI." />
          </div>

          <FeedbackPanel items={feedback} onCreate={onFeedback} onToggle={onToggleFeedback} />
          <CommentThread comments={comments} onSubmit={onComment} />
        </div>
      </div>
      <HistoryDrawer inline nodeId={n.id} items={data.history} phases={['all','development','specification']} phaseFilter="all"
        gapNotice="Memoria orchestratore: non ancora esposta dal motore (gap dichiarato AC-23)."
        onClose={() => {}} />
    </div>
  );
}
Object.assign(window, { NodeScreen });
