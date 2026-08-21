const DS = window.NitensCockpitDesignSystem_16befb;
const { SectionLabel, ProgressBar, Chip, GapBanner, ReadOnlyPanel } = DS;

// Planner: SOLO dati tecnici AEG (tasks del planning_artifact, milestone,
// percorso critico, capacità). L'eventuale data commerciale HARD resta un
// marcatore distinto, mai fusa nella stima.
function PlannerScreen({ data }) {
  const p = data.plan;
  const [sel, setSel] = React.useState('T-06');
  const [showHard, setShowHard] = React.useState(false);
  const task = p.tasks.find(t => t.id === sel);
  const gates = p.tasks.filter(t => t.assignee_type === 'human_gate');

  return (
    <div style={{ maxWidth:1152, margin:'0 auto', padding:'var(--space-6)', display:'flex', flexDirection:'column', gap:'var(--space-4)' }}>
      <header style={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:'var(--space-3)' }}>
        <div>
          <h1 style={{ margin:0, fontSize:'var(--text-xl)', fontWeight:700, color:'var(--color-accent)' }}>Planner</h1>
          <p style={{ margin:'2px 0 0', fontSize:'var(--text-sm)', color:'var(--color-text-dim)' }}>{'planning_artifact di ' + p.node_code + ' — ' + p.tasks.length + ' task, ' + p.milestones.length + ' milestone'}</p>
        </div>
        <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:'var(--space-2)' }}>
          <Chip>{p.tasks.reduce((a,t) => a + t.effort_days, 0) + ' giorni-uomo'}</Chip>
          <Chip color="var(--color-fsm-human-pending)">{gates.length + ' gate umani'}</Chip>
          <Chip color="var(--color-accent)">{p.critical_path.length + ' su percorso critico'}</Chip>
        </div>
      </header>

      <label style={{ display:'flex', alignItems:'center', gap:6, fontSize:'var(--text-11)', color:'var(--color-text-dim)', cursor:'pointer' }}>
        <input type="checkbox" checked={showHard} onChange={e => setShowHard(e.target.checked)} />
        sovrapponi le date HARD commerciali (fonte Odoo, sistema distinto)
      </label>

      <section style={{ borderRadius:'var(--radius-lg)', border:'1px solid var(--color-border)', background:'var(--color-surface)' }}>
        {DS.GanttView
          ? <DS.GanttView tasks={p.tasks} milestones={p.milestones} days={p.days} startLabel={p.start_label}
              criticalPath={p.critical_path} selected={sel} onSelect={setSel} hardDates={showHard ? p.hard_dates : []} />
          : <div style={{ padding:16 }}><GapBanner tone="neutral">GanttView non è ancora nel bundle compilato: ricarica dopo la prossima compilazione.</GapBanner></div>}
      </section>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--space-4)', alignItems:'start' }}>
        <section style={{ borderRadius:'var(--radius-lg)', border:'1px solid var(--color-border)', background:'var(--color-surface)', padding:'var(--space-4)' }}>
          <SectionLabel>{task ? 'Task ' + task.id : 'Nessun task selezionato'}</SectionLabel>
          {task && (
            <div style={{ display:'flex', flexDirection:'column', gap:6, fontSize:'var(--text-xs)', color:'var(--color-text-dim)' }}>
              <span style={{ fontSize:'var(--text-13)', color:'var(--color-text)' }}>{task.title}</span>
              <span style={{ fontFamily:'var(--font-mono)' }}>{'tipo ' + task.type + ' · ' + task.effort_days + 'g · giorno ' + task.start + '→' + (task.start + task.effort_days)}</span>
              <span>{'dipende da: ' + ((task.dependencies || []).join(', ') || '—')}</span>
              <span>{'assegnatario: ' + (task.assignee_type === 'human_gate' ? 'gate umano' : 'agente')}</span>
              {task.blocked_on_external && <span style={{ color:'var(--color-fsm-human-pending)' }}>bloccato da una dipendenza esterna al piano</span>}
              {p.critical_path.includes(task.id) && <span style={{ color:'var(--color-accent)' }}>sul percorso critico: ogni giorno di ritardo sposta la fine</span>}
            </div>
          )}
        </section>

        <section style={{ borderRadius:'var(--radius-lg)', border:'1px solid var(--color-border)', background:'var(--color-surface)', padding:'var(--space-4)' }}>
          <SectionLabel>Carico (aeg_capacity_get)</SectionLabel>
          <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-2)' }}>
            {p.capacity.map(c => (
              <div key={c.who}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'var(--text-11)', color:'var(--color-text-dim)' }}>
                  <span style={{ fontFamily:'var(--font-mono)' }}>{c.who}</span><span>{c.load_pct + '%'}</span>
                </div>
                <ProgressBar pct={c.load_pct} showValue={false} />
              </div>
            ))}
          </div>
        </section>
      </div>

      <ReadOnlyPanel title="Milestone" columns={[{key:'id',label:'id',mono:true},{key:'title',label:'titolo'},{key:'day',label:'giorno',align:'right'},{key:'count',label:'task',align:'right'}]}
        rows={p.milestones.map(m => ({ id:m.id, title:m.title, day:m.day, count:m.items.length }))} />

      <GapBanner tone="neutral">Il planning artifact del nodo padre è dichiarato STALE nel brief (precede AC-17..24) e va rifatto prima della fase di sviluppo: questi task sono dimostrativi. L'integrazione delle date commerciali (Odoo) è un lavoro separato, fuori dallo scope del rework frontend.</GapBanner>
    </div>
  );
}
Object.assign(window, { PlannerScreen });
