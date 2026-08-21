const { TerminalSessionsTable, ClearanceNotice, SectionLabel, Select, Chip, TerminalGate, GapBanner } = window.NitensCockpitDesignSystem_16befb;

const RANK = { developer: 0, tech_lead: 1, admin: 2 };

// Elenco dei WORKER ATTIVI su tutti i progetti (agent, proxy, orchestratore):
// cosa sta girando adesso e chi lo possiede. Da qui si apre il terminale del worker.
// La clearance è per riga: admin vede tutto, gli altri vedono le proprie sessioni
// e quelle il cui ruolo richiesto è coperto dal loro.
function applyClearance(sessions, user, role) {
  return sessions.map(s => {
    const cleared = role === 'admin' || s.owner === user || RANK[role] >= RANK[s.required_role || 'developer'];
    return cleared ? { ...s, restricted: false } : { ...s, restricted: true };
  });
}

function TerminalsScreen({ data, role, onRole, focusSessionId }) {
  const all = Object.keys(data.sessions).flatMap(k => data.sessions[k]);
  const [projectFilter, setProjectFilter] = React.useState('all');
  const [onlyActive, setOnlyActive] = React.useState(true);
  const ACTIVE = ['agent_running', 'adversarial_in_progress'];
  const [sel, setSel] = React.useState(focusSessionId || null);
  React.useEffect(() => { if (focusSessionId) setSel(focusSessionId); }, [focusSessionId]);
  const rows = applyClearance(all, data.operator, role)
    .filter(s => projectFilter === 'all' || s.project === projectFilter)
    .filter(s => !onlyActive || s.restricted || ACTIVE.includes(s.status));
  const restricted = rows.filter(s => s.restricted).length;
  const current = rows.find(s => s.id === sel && !s.restricted);

  return (
    <div style={{ maxWidth:1152, margin:'0 auto', padding:'var(--space-6)', display:'flex', flexDirection:'column', gap:'var(--space-4)' }}>
      <header style={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:'var(--space-3)' }}>
        <div>
          <h1 style={{ margin:0, fontSize:'var(--text-xl)', fontWeight:700, color:'var(--color-accent)' }}>Worker attivi</h1>
          <p style={{ margin:'2px 0 0', fontSize:'var(--text-sm)', color:'var(--color-text-dim)' }}>Agent, proxy e orchestratore in esecuzione su tutti i progetti. Da qui si apre il terminale del worker.</p>
        </div>
        <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:'var(--space-2)' }}>
          <Chip>{rows.length + ' worker'}</Chip>
          <Chip color="var(--color-fsm-agent-running)">{rows.filter(s => !s.restricted && s.status === 'agent_running').length + ' in corso'}</Chip>
          {restricted > 0 && <Chip>{restricted + ' riservate'}</Chip>}
        </div>
      </header>

      <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:'var(--space-3)' }}>
        <span style={{ display:'flex', alignItems:'center', gap:6, fontSize:'var(--text-11)', color:'var(--color-text-dim)' }}>
          Progetto
          <Select size="sm" value={projectFilter} onChange={setProjectFilter}
            options={[{value:'all',label:'tutti i progetti'}, ...data.projects.map(p => ({ value:p.name, label:p.name }))]} />
        </span>
        <span style={{ display:'flex', alignItems:'center', gap:6, fontSize:'var(--text-11)', color:'var(--color-text-dim)' }}>
          Ruolo (demo clearance)
          <Select size="sm" value={role} onChange={onRole} options={data.roles.map(r => ({ value:r, label:r }))} />
        </span>
        <label style={{ display:'flex', alignItems:'center', gap:5, fontSize:'var(--text-11)', color:'var(--color-text-dim)', cursor:'pointer' }}>
          <input type="checkbox" checked={onlyActive} onChange={e => setOnlyActive(e.target.checked)} /> solo in esecuzione
        </label>
        {role === 'admin' && <span style={{ fontSize:'var(--text-11)', color:'var(--color-muted)' }}>admin: nessuna riga riservata</span>}
      </div>

      <section style={{ borderRadius:'var(--radius-lg)', border:'1px solid var(--color-border)', background:'var(--color-surface)', padding:'var(--space-4)' }}>
        <SectionLabel>{onlyActive ? 'Worker in esecuzione' : 'Tutti i worker e le sessioni aperte'}</SectionLabel>
        <TerminalSessionsTable sessions={rows} currentRole={role} selectedId={sel} onSelect={setSel} onOpen={setSel} />
      </section>

      <section>
        <SectionLabel>{current ? 'Terminale ' + current.agent_id + ' — ' + current.node_code : 'Nessun worker selezionato'}</SectionLabel>
        {current ? (
          <div style={{ borderRadius:'var(--radius-lg)', border:'1px solid var(--color-border)', background:'var(--color-bg)', minHeight:200, display:'flex', flexDirection:'column' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'var(--space-2)', borderBottom:'1px solid var(--color-border)', padding:'6px 10px', fontFamily:'var(--font-mono)', fontSize:'var(--text-10)', color:'var(--color-muted)' }}>
              {current.project + ' · ' + current.owner + ' · ' + current.duration}<span style={{ marginLeft:'auto' }}>ttyd / Teleport</span>
            </div>
            <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'var(--space-5)' }}>
              <p style={{ margin:0, maxWidth:440, textAlign:'center', fontSize:'var(--text-xs)', lineHeight:'var(--leading-relaxed)', color:'var(--color-text-dim)' }}>
                Riquadro vuoto per scelta: l'embed ttyd arriva da EPIC-NAP-4 → NAP-4.1bis, oggi <span style={{ color:'var(--color-fsm-human-pending)' }}>blocked</span>.
              </p>
            </div>
          </div>
        ) : (
          <ClearanceNotice>Seleziona un worker che il tuo ruolo copre per aprirne il terminale.</ClearanceNotice>
        )}
      </section>

      <TerminalGate available={false} dependencyStatus="blocked" followUpHref="#" />
      <GapBanner tone="neutral">Clearance e feed worker: modello dimostrativo. Il contratto reale (chi può aprire quale sessione) va fissato lato motore prima dell'implementazione.</GapBanner>
    </div>
  );
}
Object.assign(window, { TerminalsScreen });
