const DS = window.NitensCockpitDesignSystem_16befb;
const { TollgateQueue, TollgateDecision, StatusBadge, SectionLabel, MakerOutput, FindingCard, CommentThread, GapBanner } = DS;

// output-viewer con approvazione inline (AC-20): la decisione vive in fondo alla
// vista di lettura, non in una pagina separata.
function TollgateScreen({ data, elapsed, onDecide, decideError, busy, comments, onComment }) {
  const [sel, setSel] = React.useState('n-otp');
  const [checked, setChecked] = React.useState([]);
  const [bulkBusy, setBulkBusy] = React.useState(false);
  const [bulkResults, setBulkResults] = React.useState(null);
  // La selezione multipla richiede sia il componente di firma in blocco sia la
  // versione di TollgateQueue che espone le checkbox.
  const bulkAvailable = !!DS.BulkDecisionBar;
  const checkedItems = data.queue.filter(q => checked.includes(q.node_id))
    .map(q => ({ node_id:q.node_id, code:q.code, dwell_ready:q.dwell_ready !== false }));

  // Esecuzione sequenziale con esito per nodo: un 409 rimanda QUEL nodo a una
  // decisione individuale, non fa fallire l'intero blocco.
  function runBatch(decision, justification, ready) {
    setBulkBusy(true);
    setBulkResults(null);
    setTimeout(() => {
      setBulkResults(ready.map((r, i) => i === ready.length - 1 && ready.length > 1
        ? { code:r.code, ok:false, message:'cambiato nel frattempo (409) — ridecidi singolarmente' }
        : { code:r.code, ok:true, message:decision === 'approve' ? 'approvato' : 'rifiutato' }));
      setChecked([]);
      setBulkBusy(false);
    }, 900);
  }
  const item = data.queue.find(q => q.node_id === sel) || data.queue[0];
  const flow = data.flow;
  const devRun = flow.phases.find(p => p.phase === 'development').runs[0];
  const lastIter = devRun.iterations[devRun.iterations.length - 1];
  const specIter = flow.phases.find(p => p.phase === 'specification').runs[0].iterations[0];
  const reqIter = flow.phases.find(p => p.phase === 'requirements').runs[0].iterations[0];
  const findings = (lastIter.adversarial.findings || []).filter(f => f.severity !== 'none');

  return (
    <div style={{ display:'flex', height:'100%' }}>
      <section style={{ flexShrink:0, width:400, overflow:'auto', borderRight:'1px solid var(--color-border)', background:'var(--color-surface)', padding:'var(--space-4)' }}>
        <TollgateQueue items={data.queue} selectedId={sel} onSelect={setSel} mock selectable={bulkAvailable}
          checkedIds={checked} onToggleCheck={id => setChecked(c => c.includes(id) ? c.filter(x => x !== id) : [...c, id])}
          onToggleAll={all => setChecked(all ? data.queue.map(q => q.node_id) : [])} />

        {/* L'assenza di una funzione si spiega sempre: mai un controllo che
            semplicemente non c'è. */}
        {!bulkAvailable && (
          <div style={{ marginTop:'var(--space-3)' }}>
            <GapBanner tone="neutral">Selezione multipla non disponibile in questa build: il componente di firma in blocco non è ancora nel bundle compilato. Le decisioni singole funzionano.</GapBanner>
          </div>
        )}

        {bulkAvailable && checkedItems.length > 0 && (
          <div style={{ marginTop:'var(--space-3)' }}>
            <DS.BulkDecisionBar items={checkedItems} operator={data.operator} busy={bulkBusy} results={bulkResults}
              onDecide={runBatch} onClear={() => { setChecked([]); setBulkResults(null); }} />
          </div>
        )}
        {bulkResults && checkedItems.length === 0 && bulkAvailable && (
          <div style={{ marginTop:'var(--space-3)', display:'flex', flexDirection:'column', gap:4 }}>
            <SectionLabel style={{ marginBottom:0 }}>Esito firma multipla</SectionLabel>
            {bulkResults.map(r => (
              <div key={r.code} style={{ display:'flex', gap:'var(--space-2)', fontSize:'var(--text-11)' }}>
                <span style={{ color:r.ok ? 'var(--color-fsm-approved)' : 'var(--color-fsm-human-pending)' }}>{r.ok ? '✓' : '↻'}</span>
                <span style={{ fontFamily:'var(--font-mono)', color:'var(--color-text-dim)' }}>{r.code}</span>
                <span style={{ color:r.ok ? 'var(--color-text-dim)' : 'var(--color-fsm-human-pending)' }}>{r.message}</span>
              </div>
            ))}
          </div>
        )}
      </section>
      <div className="rz-x"></div>
      <div style={{ minWidth:0, flex:1, overflow:'auto', padding:'var(--space-5)' }}>
        <div style={{ maxWidth:840, margin:'0 auto', display:'flex', flexDirection:'column', gap:'var(--space-5)' }}>
          <header>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:'var(--text-xs)', color:'var(--color-text-dim)' }}>{item.code + ' · ' + item.project}</div>
            <h1 style={{ margin:'2px 0 6px', fontSize:'var(--text-lg)', fontWeight:600, color:'var(--color-accent)' }}>{item.title}</h1>
            <div style={{ display:'flex', alignItems:'center', gap:'var(--space-2)', fontSize:'var(--text-xs)', color:'var(--color-text-dim)' }}>
              <StatusBadge status={item.status} /> {'fase ' + item.phase + ' · ' + item.waiting_label}
            </div>
          </header>

          <section>
            <SectionLabel>{'Rilievi avversariali aperti (' + findings.length + ')'}</SectionLabel>
            <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-2)' }}>
              {findings.map((fd,i) => <FindingCard key={i} finding={fd} />)}
            </div>
          </section>

          <section>
            <SectionLabel>Output di fase — sviluppo</SectionLabel>
            <div style={{ borderRadius:'var(--radius-md)', border:'1px solid var(--color-border)', background:'var(--color-surface-2)', padding:'var(--space-3)' }}>
              <MakerOutput data={lastIter.maker_output} />
            </div>
          </section>

          <section style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--space-4)' }}>
            <div>
              <SectionLabel>Requisito accettato</SectionLabel>
              <div style={{ borderRadius:'var(--radius-md)', border:'1px solid var(--color-border)', background:'var(--color-surface-2)', padding:'var(--space-3)' }}>
                <MakerOutput data={reqIter.maker_output} />
              </div>
            </div>
            <div>
              <SectionLabel>Specifica accettata</SectionLabel>
              <div style={{ borderRadius:'var(--radius-md)', border:'1px solid var(--color-border)', background:'var(--color-surface-2)', padding:'var(--space-3)' }}>
                <MakerOutput data={specIter.maker_output} />
              </div>
            </div>
          </section>

          <TollgateDecision operator={data.operator} dwellRequired={flow.tollgate.dwell_time_min} elapsed={elapsed}
            approvals={flow.tollgate.approvals} onDecide={onDecide} error={decideError} busy={busy} />

          <CommentThread comments={comments} onSubmit={onComment} typing={['l.rossi']} />
        </div>
      </div>
    </div>
  );
}
Object.assign(window, { TollgateScreen });
