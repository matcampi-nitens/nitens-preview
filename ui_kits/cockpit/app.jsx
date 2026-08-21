const DS = window.NitensCockpitDesignSystem_16befb;
const { TopHeader, NavSidebar, ViewTabs, GapBanner, NotificationsMenu } = DS;

// Nessuna schermata deve poter azzerare la shell: se un componente manca o
// lancia, la vista mostra il motivo e la navigazione resta usabile.
class ScreenBoundary extends React.Component {
  constructor(p) { super(p); this.state = { err: null }; }
  static getDerivedStateFromError(err) { return { err }; }
  componentDidUpdate(prev) { if (prev.viewKey !== this.props.viewKey && this.state.err) this.setState({ err: null }); }
  render() {
    if (!this.state.err) return this.props.children;
    return (
      <div style={{ padding: 24, maxWidth: 640 }}>
        <GapBanner tone="neutral">
          {'Questa vista non è disponibile: ' + (this.state.err.message || 'errore di rendering') + '. Le altre viste restano usabili.'}
        </GapBanner>
      </div>
    );
  }
}

function App() {
  const data = window.CockpitData;
  const [view, setView] = React.useState(() => new URLSearchParams(location.search).get('view') || 'flow');
  const [elapsed, setElapsed] = React.useState(12);
  const [busy, setBusy] = React.useState(false);
  const [decideError, setDecideError] = React.useState('');
  const [toast, setToast] = React.useState(null);
  const [queueLeft, setQueueLeft] = React.useState(data.queue.length);
  const [comments, setComments] = React.useState(data.comments);
  const [feedback, setFeedback] = React.useState(data.feedback);
  const [views, setViews] = React.useState([{ id:'v1', label:'Vista 1' }]);
  const [activeView, setActiveView] = React.useState('v1');
  const [split, setSplit] = React.useState(null);
  const [role, setRole] = React.useState(data.role);
  // Accesso: identità da Authentik (OIDC). Senza sessione la UI non mostra dati.
  const [session, setSession] = React.useState({ logged: true, expired: false });
  const [memberships, setMemberships] = React.useState(data.memberships);
  const [navCollapsed, setNavCollapsed] = React.useState(false);
  const [theme, setTheme] = React.useState(() => localStorage.getItem('naeg.theme') || 'dark');
  React.useEffect(() => {
    // Applicato su <html> E su <body>: alcuni renderer (export, screenshot) clonano
    // il body senza l'attributo del documento.
    for (const el of [document.documentElement, document.body]) {
      if (theme === 'light') el.dataset.theme = 'light';
      else delete el.dataset.theme;
    }
    localStorage.setItem('naeg.theme', theme);
  }, [theme]);
  const [bellOpen, setBellOpen] = React.useState(false);
  const [focusSession, setFocusSession] = React.useState(null);
  const [cockpitPane, setCockpitPane] = React.useState('review');

  React.useEffect(() => { const t = setInterval(() => setElapsed(e => e + 1), 1000); return () => clearInterval(t); }, []);

  function onDecide(decision, justification) {
    setDecideError('');
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      if (decision === 'approve' && elapsed < data.flow.tollgate.dwell_time_min) {
        setDecideError('Attendi ancora ' + (data.flow.tollgate.dwell_time_min - elapsed) + 's prima di poter approvare.');
        return;
      }
      setToast({ decision, id: 'apr_' + Math.random().toString(36).slice(2,8), justification });
      setQueueLeft(n => Math.max(0, n - 1));
      setTimeout(() => setToast(null), 4200);
    }, 700);
  }
  const addComment = body => setComments(c => [{ id:'l'+c.length, author:data.operator.split('@')[0], created_at:new Date().toISOString().slice(0,19), body, pending:true }, ...c]);
  const addFeedback = body => setFeedback(f => [{ id:'l'+f.length, body, status:'open' }, ...f]);
  const toggleFeedback = it => setFeedback(f => f.map(x => x.id === it.id ? { ...x, status: x.status === 'open' ? 'resolved' : 'open' } : x));

  // I progetti visibili sono quelli abilitati alla persona: admin vede tutto.
  // Ogni vista consuma SOLO questa lista, mai data.projects direttamente.
  const allowedIds = role === 'admin' ? data.projects.map(p => p.id) : (memberships[data.currentPersonId] || []);
  const scoped = React.useMemo(() => {
    const projects = data.projects.filter(p => allowedIds.includes(p.id));
    const names = projects.map(p => p.name);
    const trees = {}; projects.forEach(p => { trees[p.id] = data.trees[p.id]; });
    const sessions = {}; projects.forEach(p => { sessions[p.id] = data.sessions[p.id] || []; });
    return {
      ...data, projects, trees, sessions,
      delivery: data.delivery.filter(r => allowedIds.includes(r.id)),
      queue: data.queue.filter(q => names.includes(q.project)),
      notifications: data.notifications.filter(n => names.includes(n.project)),
      memberships,
    };
  }, [allowedIds.join(','), memberships]);

  const noAccess = scoped.projects.length === 0;

  const screens = {
    hub: <HubScreen data={scoped} role={role} onOpenCockpit={() => setView('flow')} onOpenNode={() => setView('node')}
      onSelectProject={() => setView('flow')} />,
    flow: <CockpitScreen data={scoped} elapsed={elapsed} onDecide={onDecide} decideError={decideError} busy={busy}
      focusSessionId={focusSession} initialPane={cockpitPane} role={role} />,
    tollgate: <TollgateScreen data={scoped} elapsed={elapsed} onDecide={onDecide} decideError={decideError} busy={busy} comments={comments} onComment={addComment} />,
    node: <NodeScreen data={scoped} comments={comments} onComment={addComment} feedback={feedback} onFeedback={addFeedback} onToggleFeedback={toggleFeedback} />,
    planner: <PlannerScreen data={scoped} />,
    terminals: <TerminalsScreen data={scoped} role={role} onRole={setRole} focusSessionId={focusSession} />,
    admin: <AdminScreen data={data} role={role} memberships={memberships} onToggleMembership={(personId, projectId) =>
      setMemberships(m => ({ ...m, [personId]: (m[personId] || []).includes(projectId) ? m[personId].filter(x => x !== projectId) : [...(m[personId] || []), projectId] }))} />,
    settings: <SettingsScreen data={data} />,
  };

  const nav = [
    { id:'hub', label:'Avanzamento', icon:'layout-list' },
    { id:'flow', label:'Cockpit', icon:'git-branch' },
    { id:'tollgate', label:'Coda tollgate', icon:'inbox' },
    { id:'node', label:'Nodo', icon:'file-text' },
    { id:'planner', label:'Planner', icon:'chart-gantt' },
    { id:'terminals', label:'Worker attivi', icon:'activity' },
    { id:'admin', label:'Amministrazione', icon:'shield-user' },
    { id:'settings', label:'Impostazioni', icon:'settings' },
  ];

  const [reportOpen, setReportOpen] = React.useState(false);

  if (!session.logged) {
    return DS.LoginGate ? (
      <DS.LoginGate logoSrc={'../../assets/brand/logo/nitens-symbol-' + (theme === 'light' ? 'black' : 'white') + '.svg'}
        idp="Authentik · idp.nitens.ai" returnTo={'/#/' + view} expired={session.expired}
        onLogin={() => setSession({ logged:true, expired:false })}
        onManualToken={() => setSession({ logged:true, expired:false })} />
    ) : (
      <div style={{ padding:24 }}><GapBanner tone="neutral">LoginGate non è ancora nel bundle compilato.</GapBanner></div>
    );
  }

  return (
    <div style={{ display:'flex', height:'100%', flexDirection:'column' }}>
      <TopHeader logoSrc={'../../assets/brand/logo/nitens-symbol-' + (theme === 'light' ? 'black' : 'white') + '.svg'} pendingCount={queueLeft}
        operator={data.operator} role={role} onBell={() => setBellOpen(v => !v)}
        onReport={() => setReportOpen(v => !v)} onLogout={() => setSession({ logged:false, expired:false })}
        theme={theme} onTheme={setTheme} />

      {session.expired && DS.SessionBanner && (
        <DS.SessionBanner onAction={() => setSession({ logged:false, expired:true })} />
      )}

      {bellOpen && (
        <div style={{ position:'fixed', right:16, top:56, zIndex:40 }}>
          <NotificationsMenu items={scoped.notifications} onClose={() => setBellOpen(false)}
            onOpenTollgate={() => { setBellOpen(false); setView('tollgate'); }}
            onOpenSession={n => {
              setBellOpen(false);
              setFocusSession(n.session_id);
              const kind = (Object.values(data.sessions).flat().find(s => s.id === n.session_id) || {}).kind;
              setCockpitPane(kind === 'orchestrator' ? 'orchestrator' : kind === 'agent' ? 'agent' : 'review');
              setView(kind ? 'flow' : 'terminals');
            }} />
        </div>
      )}

      {reportOpen && (
        <div style={{ padding:'8px 16px', borderBottom:'1px solid var(--color-border)' }}>
          <button type="button" onClick={() => setSession({ logged:true, expired:true })}
            style={{ marginBottom:8, background:'transparent', border:'1px solid var(--color-border)', borderRadius:'var(--radius-sm)', padding:'2px 8px', fontFamily:'var(--font-sans)', fontSize:'var(--text-10)', color:'var(--color-text-dim)', cursor:'pointer' }}>
            demo: simula sessione scaduta
          </button>
          <GapBanner tone="neutral">Segnalazione al Feedback Hub: scaffold visivo. L'SDK client FBH-RD (story dba77b42) non è ancora sviluppato, quindi da qui non parte nessun dato.</GapBanner>
        </div>
      )}

      <div style={{ display:'flex', minHeight:0, flex:1 }}>
        <NavSidebar items={nav} active={view} onSelect={setView}
          collapsed={navCollapsed} onToggleCollapse={() => setNavCollapsed(v => !v)} />
        <div className="rz-x"></div>
        <main style={{ minWidth:0, flex:1, display:'flex', flexDirection:'column', overflow:'hidden', background:'var(--color-bg)' }}>
          {view === 'flow' && (
            <ViewTabs views={views} activeId={activeView} splitIds={split}
              onSelect={setActiveView} onAdd={() => { const id = 'v'+(views.length+1); setViews(v => [...v, { id, label:'Vista '+(v.length+1) }]); setActiveView(id); }}
              onClose={id => { setViews(v => v.filter(x => x.id !== id)); setSplit(null); }}
              onToggleSplit={() => setSplit(s => s ? null : views.slice(0,2).map(v => v.id))} />
          )}
          <div style={{ minHeight:0, flex:1, overflow:'auto' }}>
            <ScreenBoundary viewKey={view}>
              {noAccess && view !== 'admin' && view !== 'settings'
                ? <div style={{ padding:24, maxWidth:640 }}>
                    <GapBanner tone="neutral">Nessun progetto abilitato per te. Un admin deve abilitarti dalla pagina Amministrazione: fino a quel momento questa interfaccia non ha dati da mostrarti.</GapBanner>
                  </div>
                : (screens[view] || screens.hub)}
            </ScreenBoundary>
          </div>
        </main>
      </div>

      {toast && (
        <div style={{ position:'fixed', right:20, bottom:20, maxWidth:360, borderRadius:'var(--radius-md)',
          border:'1px solid ' + (toast.decision === 'approve' ? 'var(--color-fsm-approved)' : toast.decision === 'reject' ? 'var(--color-fsm-rejected)' : 'var(--color-fsm-human-pending)'),
          background:'var(--color-surface)', padding:'10px 12px', fontSize:'var(--text-xs)', color:'var(--color-text)' }}>
          <div style={{ fontWeight:600 }}>{'Decisione registrata: ' + toast.decision}</div>
          <div style={{ fontFamily:'var(--font-mono)', fontSize:'var(--text-10)', color:'var(--color-text-dim)' }}>{'approval_id ' + toast.id + ' · node_status aggiornato senza reload'}</div>
          {toast.justification && <div style={{ marginTop:4, color:'var(--color-text-dim)' }}>{'motivazione: ' + toast.justification}</div>}
        </div>
      )}
    </div>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
