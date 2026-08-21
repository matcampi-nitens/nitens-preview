const DS = window.NitensCockpitDesignSystem_16befb;
const { SectionLabel, GapBanner, ClearanceNotice, Chip } = DS;

// Amministrazione: sviluppatori e clearance. L'anagrafica vive in Authentik;
// qui si governa solo ciò che il motore possiede.
function AdminScreen({ data, role, memberships, onToggleMembership }) {
  const [people, setPeople] = React.useState(data.people);
  const [grants, setGrants] = React.useState(data.grants);
  const isAdmin = role === 'admin';

  const override = (p, newRole) => setPeople(ps => ps.map(x => x.id !== p.id ? x : (
    newRole === x.role_from_idp
      ? { ...x, effective_role:newRole, override:undefined }
      : { ...x, effective_role:newRole, override:{ role:newRole, until:'20/06 18:00', by:data.operator } }
  )));
  const endOverride = p => setPeople(ps => ps.map(x => x.id !== p.id ? x : ({ ...x, effective_role:x.role_from_idp, override:undefined })));
  const toggle = (cap, r) => setGrants(g => ({ ...g, [cap]: (g[cap] || []).includes(r) ? g[cap].filter(x => x !== r) : [...(g[cap] || []), r] }));

  return (
    <div style={{ maxWidth:1152, margin:'0 auto', padding:'var(--space-6)', display:'flex', flexDirection:'column', gap:'var(--space-4)' }}>
      <header style={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:'var(--space-3)' }}>
        <div>
          <h1 style={{ margin:0, fontSize:'var(--text-xl)', fontWeight:700, color:'var(--color-accent)' }}>Amministrazione</h1>
          <p style={{ margin:'2px 0 0', fontSize:'var(--text-sm)', color:'var(--color-text-dim)' }}>{isAdmin ? 'Sviluppatori, abilitazioni e clearance. Anagrafica e gruppi: Authentik.' : 'Le tue capacità per ruolo. Amministrazione riservata agli admin.'}</p>
        </div>
        <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:'var(--space-2)' }}>
          {isAdmin && <Chip>{people.length + ' persone'}</Chip>}
          {isAdmin && <Chip color="var(--color-fsm-human-pending)">{people.filter(p => p.override).length + ' override attivi'}</Chip>}
          {isAdmin && <Chip>{'progetti: ' + data.projects.length}</Chip>}
          <Chip>{'il tuo ruolo: ' + role}</Chip>
        </div>
      </header>

      {!isAdmin && (
        <ClearanceNotice requiredRole="admin" currentRole={role}>
          Anagrafica e abilitazioni sono visibili solo a un admin: email, gruppi e progetti dei colleghi non sono dati di cui hai bisogno per lavorare. Qui sotto resta la matrice delle capacità, così sai cosa può fare il tuo ruolo.
        </ClearanceNotice>
      )}

      {isAdmin && (DS.DeveloperRoster
        ? <DS.DeveloperRoster people={people} currentRole={role} onOverride={override} onEndOverride={endOverride} onAssign={() => {}} />
        : <GapBanner tone="neutral">DeveloperRoster non è ancora nel bundle compilato.</GapBanner>)}

      {isAdmin && (DS.ProjectAccess
        ? <DS.ProjectAccess people={people} projects={data.projects} memberships={memberships || data.memberships}
            currentRole={role} onToggle={onToggleMembership} />
        : <GapBanner tone="neutral">ProjectAccess non è ancora nel bundle compilato.</GapBanner>)}

      {DS.ClearanceMatrix
        ? <DS.ClearanceMatrix capabilities={data.capabilities} grants={grants} currentRole={role} onToggle={toggle} />
        : <GapBanner tone="neutral">ClearanceMatrix non è ancora nel bundle compilato.</GapBanner>}

      <section style={{ display: isAdmin ? 'block' : 'none' }}>
        <SectionLabel>Come si cambia un permesso</SectionLabel>
        <ol style={{ margin:0, paddingLeft:18, display:'flex', flexDirection:'column', gap:4, fontSize:'var(--text-xs)', lineHeight:'var(--leading-relaxed)', color:'var(--color-text-dim)' }}>
          <li>Permanente: si cambia il gruppo della persona in Authentik. Il cockpit rilegge il ruolo al login successivo.</li>
          <li>Temporaneo: override da questa pagina, con scadenza obbligatoria e traccia nel log eventi.</li>
          <li>Regola: si modifica la matrice, non la singola persona. Le righe con vincolo di sicurezza non sono modificabili da nessun ruolo.</li>
          <li>Accesso ai dati: lo decide l'abilitazione ai progetti, non il ruolo. Il ruolo decide cosa si può fare sui progetti già visibili. Un admin vede tutto per definizione.</li>
        </ol>
      </section>

      <GapBanner tone="neutral">Nessun endpoint definito: la lettura dell'anagrafica da Authentik, la persistenza degli override e la matrice di clearance vanno contrattualizzate lato motore prima dell'implementazione. Qui sono dati dimostrativi.</GapBanner>
    </div>
  );
}
Object.assign(window, { AdminScreen });
