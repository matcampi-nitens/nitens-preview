const DS = window.NitensCockpitDesignSystem_16befb;
const { KpiTile, SectionLabel, Button, Icon, Chip, GapBanner } = DS;

// Hub riorientato: non un riepilogo generico, ma la vista di avanzamento —
// tecnico vs commerciale vs impegno, a colpo d'occhio, per tutto il portafoglio.
// Ciò che resta qui e da nessun'altra parte: usage del motore, dimensioni
// avversariali, tool MCP.
const OUT_COLOR = { accepted:'var(--color-fsm-approved)', conflict:'var(--color-fsm-human-pending)', rejected:'var(--color-fsm-rejected)', pending:'var(--color-muted)' };
const SEV_COLOR = { critical:'var(--color-sev-critical)', high:'var(--color-sev-high)', medium:'var(--color-sev-medium)', low:'var(--color-sev-low)' };
const panel = { borderRadius:'var(--radius-lg)', border:'1px solid var(--color-border)', background:'var(--color-surface)', padding:'var(--space-4)' };
const hhmm = iso => iso ? iso.slice(11,16) : '';

function HubScreen({ data, onOpenCockpit, onOpenNode, onSelectProject, role }) {
  const s = data.hub.stats;
  const late = data.delivery.filter(r => (r.commitment?.slip_days ?? 0) > 0);

  return (
    <div style={{ maxWidth:1152, margin:'0 auto', padding:'var(--space-6)', display:'flex', flexDirection:'column', gap:'var(--space-4)' }}>
      <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:'var(--space-4)' }}>
        <div>
          <h1 style={{ margin:0, fontSize:'var(--text-xl)', fontWeight:700, color:'var(--color-accent)' }}>Avanzamento</h1>
          <p style={{ margin:'2px 0 0', fontSize:'var(--text-sm)', color:'var(--color-text-dim)' }}>
            {data.delivery.length + ' progetti · tecnico, commerciale e impegni affiancati'}
            <span style={{ marginLeft:6, fontSize:'var(--text-10)', color:'var(--color-muted)' }}>Dati dimostrativi (non reali)</span>
          </p>
        </div>
        <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:'var(--space-2)' }}>
          {late.length > 0 && <Chip color="var(--color-fsm-rejected)">{late.length + ' oltre l\'impegno'}</Chip>}
          <Button variant="accent" size="lg" icon={<Icon name="play" size={16} />} onClick={onOpenCockpit}>Apri Cockpit</Button>
        </div>
      </div>

      {DS.DeliveryOverview
        ? <DS.DeliveryOverview rows={data.delivery} commercialConnected={data.commercialConnected} currentRole={role} onSelect={onSelectProject} />
        : <GapBanner tone="neutral">DeliveryOverview non è ancora nel bundle compilato: ricarica dopo la prossima compilazione.</GapBanner>}

      <div style={{ display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:'var(--space-3)' }}>
        <KpiTile value={s.nodes_total} label="nodi" />
        <KpiTile value={s.tollgate_open} label="tollgate" color="var(--color-fsm-human-pending)" />
        <KpiTile value={s.sessions_active} label="worker" color="var(--color-fsm-agent-running)" />
        <KpiTile value={s.projects} label="progetti" />
        <KpiTile value={s.requirements} label="requisiti" />
        <KpiTile value={s.nodes_by_status.blocked} label="bloccati" color="var(--color-fsm-blocked)" />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'var(--space-4)' }}>
        <section style={panel}>
          <SectionLabel>Attività — ultime iterazioni</SectionLabel>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'var(--text-sm)' }}>
            <tbody>
              {s.recent_iterations.map((it,i) => (
                <tr key={i} onClick={() => onOpenNode(it.node_id)} style={{ cursor:'pointer', borderBottom:'1px solid var(--border-hairline-soft)' }}>
                  <td style={{ padding:'6px 8px 6px 0', fontFamily:'var(--font-mono)', fontSize:'var(--text-xs)', color:'var(--color-text-dim)' }}>{hhmm(it.at)}</td>
                  <td style={{ padding:'6px 8px 6px 0', fontFamily:'var(--font-mono)', fontSize:'var(--text-11)', color:'var(--color-text-dim)' }}>{it.node_code}</td>
                  <td style={{ padding:'6px 8px 6px 0' }}>{it.node_title}</td>
                  <td style={{ padding:'6px 8px 6px 0', fontSize:'var(--text-xs)', color:'var(--color-text-dim)' }}>{it.phase + ' #' + it.index}</td>
                  <td style={{ padding:'6px 0', fontSize:'var(--text-11)', color:OUT_COLOR[it.outcome] }}>{it.outcome}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'var(--space-4)', borderTop:'1px solid var(--color-border)', marginTop:'var(--space-3)', paddingTop:'var(--space-3)', fontSize:'var(--text-xs)', color:'var(--color-text-dim)' }}>
            <span>{s.usage.cycles + ' cicli · ' + s.usage.iterations + ' iterazioni'}</span>
            <span style={{ color:'var(--color-fsm-approved)' }}>{'✓ ' + s.usage.outcomes.accepted}</span>
            <span style={{ color:'var(--color-fsm-rejected)' }}>{'✗ ' + s.usage.outcomes.rejected}</span>
            <span style={{ color:'var(--color-fsm-human-pending)' }}>{'⚠ ' + s.usage.outcomes.conflict}</span>
            <span>{((s.usage.tokens_in + s.usage.tokens_out)/1000).toFixed(0) + 'k token'}</span>
          </div>
        </section>

        <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-4)' }}>
          <section style={panel}>
            <SectionLabel>{'Dimensioni avversariali (' + data.hub.dimensions.length + ')'}</SectionLabel>
            <ul style={{ margin:0, padding:0, listStyle:'none', display:'flex', flexDirection:'column', gap:4 }}>
              {data.hub.dimensions.map(dd => (
                <li key={dd.code} style={{ display:'flex', alignItems:'center', gap:'var(--space-2)', fontSize:'var(--text-xs)' }}>
                  <span style={{ borderRadius:'var(--radius-sm)', padding:'1px 6px', fontFamily:'var(--font-mono)', fontWeight:700, color:'var(--on-state)', background:SEV_COLOR[dd.severity] || 'var(--color-muted)' }}>{dd.code}</span>
                  <span style={{ color:'var(--color-text)' }}>{dd.label}</span>
                  <span style={{ marginLeft:'auto', fontSize:'var(--text-10)', color:'var(--color-muted)' }}>{dd.scope}</span>
                </li>
              ))}
            </ul>
          </section>
          <section style={panel}>
            <SectionLabel>{'Tool MCP NAEG (' + data.hub.tools.length + ')'}</SectionLabel>
            <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
              {data.hub.tools.map(t => (
                <div key={t.fqn} style={{ borderRadius:'var(--radius-sm)', background:'var(--color-surface-2)', padding:'4px 6px', fontSize:'var(--text-11)' }}>
                  <div style={{ fontFamily:'var(--font-mono)', color:'var(--color-text)' }}>{t.fqn}</div>
                  <div style={{ fontSize:'var(--text-10)', color:'var(--color-muted)' }}>{t.description}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <GapBanner tone="neutral">Il dato tecnico è calcolato sui nodi già caricati (AC-21, nessun endpoint nuovo). Il dato commerciale e gli impegni richiedono un'integrazione Odoo dedicata, fuori dallo scope del rework frontend: qui sono segnaposto etichettati per fonte.</GapBanner>
    </div>
  );
}
Object.assign(window, { HubScreen });
