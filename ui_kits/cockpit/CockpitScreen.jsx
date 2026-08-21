const { ProjectBoard, HistoryDrawer, PhaseStepper, StatusBadge, SectionLabel, FindingCard, MakerOutput, TollgateDecision, TabBar, LiveSessions, TerminalGate, GitPanel, PipelinePanel, KvPanel, GapBanner } = window.NitensCockpitDesignSystem_16befb;
const DS = window.NitensCockpitDesignSystem_16befb;

const OUT_COLOR = { accepted:'var(--color-fsm-approved)', conflict:'var(--color-fsm-human-pending)', rejected:'var(--color-fsm-rejected)', pending:'var(--color-muted)' };

// Terminale integrato di una sessione (orchestratore o proxy) dentro il cockpit:
// l'embed arriva da NAP-4.1bis, oggi blocked, quindi il riquadro resta vuoto col motivo.
function SessionPane({ data, kind, projectId, focusSessionId }) {
  const sessions = (data.sessions[projectId] || []).filter(s => s.kind === kind);
  const [sel, setSel] = React.useState(focusSessionId || (sessions[0] && sessions[0].id));
  React.useEffect(() => { if (focusSessionId) setSel(focusSessionId); }, [focusSessionId]);
  const cur = sessions.find(s => s.id === sel) || sessions[0];
  return (
    <div style={{ display:'flex', height:'100%', minHeight:0 }}>
      <div style={{ flexShrink:0, width:300, overflow:'auto', borderRight:'1px solid var(--color-border)', padding:'var(--space-3)' }}>
        <LiveSessions sessions={sessions} selectedId={cur && cur.id} onSelect={setSel}
          notConnected={sessions.length ? undefined : 'Nessun worker ' + (kind === 'orchestrator' ? 'orchestratore' : 'agent') + ' aperto su questo progetto.'} />
      </div>
      <div style={{ minWidth:0, flex:1, overflow:'auto', padding:'var(--space-4)', display:'flex', flexDirection:'column', gap:'var(--space-3)' }}>
        <TerminalGate available={false} dependencyStatus="blocked" followUpHref="#" />
        <div style={{ flex:1, minHeight:200, borderRadius:'var(--radius-lg)', border:'1px solid var(--color-border)', background:'var(--color-bg)', display:'flex', flexDirection:'column' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'var(--space-2)', borderBottom:'1px solid var(--color-border)', padding:'6px 10px', fontFamily:'var(--font-mono)', fontSize:'var(--text-10)', color:'var(--color-muted)' }}>
            {cur ? cur.agent_id + ' · ' + cur.node_code + ' · ' + cur.duration : '—'}<span style={{ marginLeft:'auto' }}>ttyd / Teleport</span>
          </div>
          <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'var(--space-4)' }}>
            <p style={{ margin:0, maxWidth:400, textAlign:'center', fontSize:'var(--text-xs)', lineHeight:'var(--leading-relaxed)', color:'var(--color-text-dim)' }}>
              Terminale {kind === 'orchestrator' ? 'orchestratore' : 'agent'}: embed non disponibile finché NAP-4.1bis è <span style={{ color:'var(--color-fsm-human-pending)' }}>blocked</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stato dello sviluppo: git, CI/CD, acquisizione e flusso KV del nodo selezionato.
function DevPane({ data, role }) {
  return (
    <div style={{ height:'100%', overflow:'auto', padding:'var(--space-4)', display:'flex', flexDirection:'column', gap:'var(--space-4)' }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--space-4)', alignItems:'start' }}>
        <GitPanel git={data.git} onCopy={() => {}} onOpenPr={() => {}} onRefresh={() => {}} />
        <PipelinePanel runs={data.pipelines} />
      </div>
      {DS.ScrapingPanel && <DS.ScrapingPanel sources={data.scraping} />}
      <KvPanel entries={data.kv} currentRole={role} writeRole="tech_lead" />
      <GapBanner tone="neutral">Git, CI/CD e KV: nessun endpoint definito nella spec corrente — questi pannelli mostrano dati dimostrativi e vanno contrattualizzati prima dell'implementazione.</GapBanner>
    </div>
  );
}

function FlowPane({ data, elapsed, onDecide, decideError, busy }) {
  const flow = data.flow;
  const [phaseKey, setPhaseKey] = React.useState('development');
  const phase = flow.phases.find(p => p.phase === phaseKey);
  const run = phase.runs[phase.runs.length - 1] || null;
  const [iterIdx, setIterIdx] = React.useState(null);
  const iter = run ? (run.iterations[iterIdx == null ? run.iterations.length - 1 : iterIdx]) : null;
  const findings = ((iter && iter.adversarial.findings) || []).filter(f => f.severity !== 'none');
  const isTollgate = phase.derived_status === 'tollgate';

  return (
    <div style={{ display:'flex', height:'100%' }}>
      <section style={{ flexShrink:0, width:'var(--flow-left-default)', overflow:'auto', borderRight:'1px solid var(--color-border)', padding:'var(--space-4)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'var(--space-2)', fontFamily:'var(--font-mono)', fontSize:'var(--text-xs)', color:'var(--color-text-dim)' }}>
          {flow.node.code} <span>{'· ' + flow.node.seq_id}</span>
          <span style={{ fontSize:'var(--text-10)', color:'var(--color-muted)' }}>○ mock</span>
        </div>
        <h1 style={{ margin:'2px 0 0', fontSize:'var(--text-base)', fontWeight:600, color:'var(--color-accent)' }}>{flow.node.title}</h1>
        <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:'var(--space-2)', margin:'var(--space-2) 0 var(--space-5)', fontSize:'var(--text-xs)', color:'var(--color-text-dim)' }}>
          <StatusBadge status={flow.node.status} />
          <span style={{ color:'var(--color-muted)' }}>{'dep: ' + flow.node.deps.join(', ')}</span>
        </div>

        <div style={{ marginBottom:'var(--space-5)' }}>
          <PhaseStepper phases={flow.phases} selected={phaseKey} onSelect={k => { setPhaseKey(k); setIterIdx(null); }} />
        </div>

        <SectionLabel>{'Loop di sviluppo — ' + phase.label}</SectionLabel>
        {!run && <p style={{ margin:0, fontSize:'var(--text-sm)', color:'var(--color-muted)' }}>Fase non ancora avviata.</p>}
        {run && (
          <div style={{ borderRadius:'var(--radius-lg)', border:'1px solid var(--color-border)', background:'var(--color-surface)', padding:'var(--space-3)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'var(--space-2)', marginBottom:'var(--space-2)', fontSize:'var(--text-xs)' }}>
              <span style={{ fontFamily:'var(--font-mono)', color:'var(--color-text-dim)' }}>run</span>
              <StatusBadge status={run.status} />
              <span style={{ color:'var(--color-muted)' }}>{run.iterations.length + '/' + run.max_iterations + ' iter'}</span>
            </div>
            <ol style={{ margin:0, padding:0, listStyle:'none', display:'flex', flexDirection:'column', gap:4 }}>
              {run.iterations.map((it,i) => (
                <li key={it.index} onClick={() => setIterIdx(i)} style={{
                  display:'flex', alignItems:'center', gap:'var(--space-3)', cursor:'pointer',
                  borderRadius:'var(--radius-md)', padding:'6px 8px', fontSize:'var(--text-sm)',
                  background: it === iter ? 'var(--color-surface-2)' : 'transparent' }}>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:'var(--text-xs)', color:'var(--color-text-dim)' }}>{'#' + it.index}</span>
                  <span style={{ fontSize:'var(--text-11)', color:OUT_COLOR[it.outcome] }}>{it.outcome}</span>
                  <span style={{ fontSize:'var(--text-xs)', color:'var(--color-muted)' }}>{it.adversarial.observation_count + ' oss.'}</span>
                </li>
              ))}
            </ol>
            {run.conflict_summary && (
              <pre style={{ margin:'var(--space-2) 0 0', whiteSpace:'pre-wrap', borderRadius:'var(--radius-sm)', background:'var(--color-bg)', padding:'var(--space-2)', fontFamily:'var(--font-mono)', fontSize:'var(--text-11)', lineHeight:'var(--leading-relaxed)', color:'var(--color-text-dim)' }}>{run.conflict_summary}</pre>
            )}
          </div>
        )}
      </section>

      <div className="rz-x"></div>

      <aside style={{ minWidth:0, flex:1, overflow:'auto', background:'var(--color-surface)' }}>
        {isTollgate && (
          <div style={{ borderBottom:'1px solid var(--color-border)', padding:'var(--space-3)', background:'var(--tint-human-pending)' }}>
            <div style={{ fontSize:'var(--text-sm)', fontWeight:600, color:'var(--color-fsm-human-pending)' }}>{'⚠ DA RIVEDERE — ' + phase.label}</div>
            <div style={{ fontSize:'var(--text-xs)', color:'var(--color-text-dim)' }}>{"Loop salito all'umano dopo " + run.iteration_count + ' iterazioni'}</div>
          </div>
        )}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px 24px', padding:'var(--space-5)' }}>
          <section style={{ gridRow: isTollgate ? 'span 2' : 'auto' }}>
            <SectionLabel>{'Rilievi avversariali (' + findings.length + ')'}</SectionLabel>
            <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-2)' }}>
              {findings.map((fd,i) => <FindingCard key={i} finding={fd} />)}
              {findings.length === 0 && <p style={{ margin:0, fontSize:'var(--text-xs)', color:'var(--color-fsm-approved)' }}>Nessun rilievo ✓</p>}
            </div>
          </section>
          <section>
            <SectionLabel>Proposta del maker</SectionLabel>
            <div style={{ borderRadius:'var(--radius-md)', border:'1px solid var(--color-border)', background:'var(--color-surface-2)', padding:10 }}>
              <MakerOutput data={iter && iter.maker_output} />
            </div>
          </section>
          <section>
            <SectionLabel>{'Copertura requisiti — ' + flow.coverage.req_fulfillment_pct + '%'}</SectionLabel>
            <ul style={{ margin:0, padding:0, listStyle:'none', display:'flex', flexDirection:'column', gap:4 }}>
              {flow.coverage.items.map(c => (
                <li key={c.code} style={{ display:'flex', justifyContent:'space-between', borderRadius:'var(--radius-sm)', background:'var(--color-surface-2)', padding:'4px 8px', fontSize:'var(--text-xs)' }}>
                  <span style={{ fontFamily:'var(--font-mono)', color:'var(--color-text-dim)' }}>{c.code}</span>
                  <span style={{ color: String(c.status).includes('fulfilled') ? 'var(--color-fsm-approved)' : c.status === 'pending' ? 'var(--color-muted)' : 'var(--color-fsm-agent-running)' }}>{c.status}</span>
                </li>
              ))}
            </ul>
            <div style={{ marginTop:'var(--space-3)', fontSize:'var(--text-xs)', color:'var(--color-text-dim)' }}>
              <SectionLabel>Contesto</SectionLabel>
              {flow.session_summary.agent_id + ' · ' + flow.session_summary.model_id + ' · $' + flow.session_summary.cost_usd}
            </div>
          </section>
          {isTollgate && (
            <section style={{ gridColumn:'1 / -1' }}>
              <TollgateDecision operator={data.operator} dwellRequired={flow.tollgate.dwell_time_min} elapsed={elapsed}
                approvals={flow.tollgate.approvals} onDecide={onDecide} error={decideError} busy={busy} />
            </section>
          )}
        </div>
      </aside>
    </div>
  );
}

// Appiattisce l'albero in nodi DAG: gerarchia (children_ids) + dipendenze
// dichiarate (dep_ids), risolte per codice o per id.
function toDag(tree = [], epicId) {
  const roots = epicId ? (tree.find(e => e.id === epicId) ? [tree.find(e => e.id === epicId)] : tree) : tree;
  const flat = [];
  (function walk(ns) { ns.forEach(n => { flat.push(n); if (n.children) walk(n.children); }); })(roots);
  const byRef = {};
  flat.forEach(n => { byRef[n.code] = n.id; if (n.seq_id) byRef[n.seq_id] = n.id; });
  return flat.map(n => ({
    id: n.id, code: n.code, title: n.title, level: n.level, status: n.status, cells: n.cells,
    children_ids: (n.children || []).map(c => c.id),
    dep_ids: (n.deps || []).map(dep => byRef[String(dep).split(' ')[0]]).filter(Boolean),
  }));
}

function CockpitScreen({ data, elapsed, onDecide, decideError, busy, focusSessionId, initialPane, role }) {
  const [projectId, setProjectId] = React.useState('apam');
  const [expanded, setExpanded] = React.useState(new Set(['e04','s03','s04','s01','e07','f-s1','e09','p-s1']));
  const [selected, setSelected] = React.useState('n-otp');
  const [historyId, setHistoryId] = React.useState(null);
  const [epicId, setEpicId] = React.useState('');
  const [boardMode, setBoardMode] = React.useState('table');
  const [eventType, setEventType] = React.useState('all');
  const [pane, setPane] = React.useState(initialPane || 'review');
  React.useEffect(() => { if (initialPane) setPane(initialPane); }, [initialPane]);
  const pendingHere = data.notifications.filter(n => n.project === (data.projects.find(p => p.id === projectId) || {}).name).length;
  const toggle = id => setExpanded(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  return (
    <div style={{ display:'flex', height:'100%', flexDirection:'column' }}>
      <div style={{ position:'relative', flexShrink:0, height:'var(--board-top-default)', overflow:'hidden', background:'var(--color-surface)', display:'flex', flexDirection:'column' }}>
        <TabBar dense active={boardMode} onSelect={setBoardMode} tabs={[
          { id:'table', label:'Tabella', icon:'table-2' },
          { id:'dag', label:'DAG', icon:'git-fork' },
        ]} />
        {boardMode === 'table' ? (
        <ProjectBoard projects={data.projects} projectId={projectId} onProject={setProjectId}
          tree={data.trees[projectId]} expanded={expanded} onToggle={toggle}
          selected={selected} onSelect={setSelected} onHistory={setHistoryId}
          epicId={epicId} onEpic={setEpicId} />
        ) : (
          DS.DagView
            ? <DS.DagView nodes={toDag(data.trees[projectId], epicId)} selected={selected} onSelect={setSelected} focusPhase="development" />
            : <div style={{ padding:16 }}><GapBanner tone="neutral">DagView non è ancora nel bundle compilato.</GapBanner></div>
        )}
        {historyId && (
          <HistoryDrawer nodeId={historyId} items={data.history} phases={['all','development','specification']}
            phaseFilter="all" onClose={() => setHistoryId(null)}
            gapNotice="Memoria orchestratore: non ancora esposta dal motore (gap dichiarato AC-23)." />
        )}
      </div>
      <div className="rz-y" style={{ borderTop:'1px solid var(--color-border)', borderBottom:'1px solid var(--color-border)' }}></div>
      <div style={{ minHeight:0, flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <TabBar dense active={pane} onSelect={setPane} tabs={[
          { id:'review', label:'Revisione', icon:'clipboard-check', badge: pendingHere || undefined },
          { id:'orchestrator', label:'Terminale orchestratore', icon:'workflow' },
          { id:'talk', label:'Comunicazione agenti', icon:'messages-square' },
          { id:'events', label:'Log eventi', icon:'scroll-text' },
          { id:'dev', label:'Git, CI/CD & KV', icon:'git-pull-request', badge: data.pipelines.some(p => p.status === 'failed') ? '!' : undefined, badgeColor:'var(--color-fsm-rejected)' },
          { id:'agent', label:'Worker agent', icon:'bot', badge: (data.sessions[projectId] || []).filter(s => s.kind === 'agent' && s.status === 'agent_running').length || undefined, badgeColor:'var(--color-fsm-agent-running)' },
        ]} />
        <div style={{ minHeight:0, flex:1, overflow:'hidden' }}>
          {pane === 'review'
            ? <FlowPane data={data} elapsed={elapsed} onDecide={onDecide} decideError={decideError} busy={busy} />
            : pane === 'dev'
              ? <DevPane data={data} role={role} />
              : pane === 'talk'
                ? (DS.AgentConversation
                    ? <DS.AgentConversation messages={data.agentMessages} runs={['r3','r2','r1']} runFilter="r3" onRunFilter={() => {}} />
                    : <div style={{ padding:16 }}><GapBanner tone="neutral">AgentConversation non è ancora nel bundle compilato.</GapBanner></div>)
                : pane === 'events'
                  ? (DS.EventLog
                      ? <DS.EventLog events={data.agentEvents} chainVerified
                          types={Array.from(new Set(data.agentEvents.map(e => e.event_type)))}
                          typeFilter={eventType} onTypeFilter={setEventType} />
                      : <div style={{ padding:16 }}><GapBanner tone="neutral">EventLog non è ancora nel bundle compilato.</GapBanner></div>)
                  : <SessionPane data={data} kind={pane} projectId={projectId} focusSessionId={focusSessionId} />}
        </div>
      </div>
    </div>
  );
}
Object.assign(window, { CockpitScreen });
