const { SectionLabel, Button, TextInput, Chip } = window.NitensCockpitDesignSystem_16befb;

const SCOPES = ['aeg.node.read','aeg.node.write','aeg.review.write','aeg.req.write','aeg.audit.read'];

function SettingsScreen({ data }) {
  const [name, setName] = React.useState('');
  const [picked, setPicked] = React.useState(['aeg.node.read']);
  const [days, setDays] = React.useState('90');
  const [created, setCreated] = React.useState(null);
  const [tokens, setTokens] = React.useState(data.tokens);
  const toggle = s => setPicked(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
  const create = () => {
    if (!name.trim() || !picked.length) return;
    setCreated('naeg_mcp_' + Math.random().toString(36).slice(2,10) + '.' + Math.random().toString(36).slice(2,18));
    setTokens(t => [{ id:'n'+t.length, name:name.trim(), scopes:[...picked], expires_at:days ? '2026-11-19' : null, created_at:'2026-08-21', last_used_at:null }, ...t]);
    setName('');
  };

  return (
    <div style={{ maxWidth:768, margin:'0 auto', padding:'var(--space-6)' }}>
      <h1 style={{ margin:'0 0 var(--space-4)', fontSize:'var(--text-xl)', fontWeight:700, color:'var(--color-text)' }}>Impostazioni — Token MCP</h1>
      <p style={{ margin:'0 0 var(--space-6)', fontSize:'var(--text-sm)', color:'var(--color-text-dim)' }}>
        Crea e gestisci i tuoi token personali per l'accesso MCP. Il valore del token viene mostrato una sola volta al momento della creazione: non è recuperabile in seguito.
      </p>

      <section style={{ marginBottom:'var(--space-6)', borderRadius:'var(--radius-sm)', border:'1px solid var(--color-border)', background:'var(--color-surface)', padding:'var(--space-4)' }}>
        <SectionLabel>Nuovo token</SectionLabel>

        {created && (
          <div style={{ marginBottom:'var(--space-4)', borderRadius:'var(--radius-sm)', border:'1px solid var(--color-fsm-approved)', background:'var(--color-surface-2)', padding:'var(--space-3)' }}>
            <p style={{ margin:'0 0 var(--space-2)', fontSize:'var(--text-xs)', fontWeight:600, color:'var(--color-fsm-approved)' }}>Token creato — copialo ora, non sarà più visibile in seguito.</p>
            <div style={{ display:'flex', alignItems:'center', gap:'var(--space-2)' }}>
              <TextInput value={created} readOnly mono />
              <Button variant="outline" size="sm">Copia</Button>
            </div>
            <div style={{ marginTop:'var(--space-2)' }}><Button variant="outline" size="sm" onClick={() => setCreated(null)}>Fatto</Button></div>
          </div>
        )}

        <div style={{ marginBottom:'var(--space-3)' }}>
          <SectionLabel size="lbl">Nome</SectionLabel>
          <TextInput value={name} onChange={setName} placeholder="es. laptop-personale" />
        </div>

        <div style={{ marginBottom:'var(--space-3)' }}>
          <SectionLabel size="lbl">Scope (almeno uno)</SectionLabel>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'var(--space-2)' }}>
            {SCOPES.map(s => (
              <label key={s} style={{ display:'flex', alignItems:'center', gap:4, borderRadius:'var(--radius-sm)', border:'1px solid ' + (picked.includes(s) ? 'var(--color-accent)' : 'var(--color-border)'), padding:'4px 8px', fontSize:'var(--text-xs)', fontFamily:'var(--font-mono)', color:'var(--color-text-dim)', cursor:'pointer' }}>
                <input type="checkbox" checked={picked.includes(s)} onChange={() => toggle(s)} />{s}
              </label>
            ))}
          </div>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:'var(--space-3)', marginBottom:'var(--space-3)', fontSize:'var(--text-xs)', color:'var(--color-text-dim)' }}>
          <label style={{ display:'flex', alignItems:'center', gap:4 }}><input type="checkbox" checked={!days} onChange={e => setDays(e.target.checked ? '' : '90')} /> Non scade mai</label>
          {days !== '' && <label style={{ display:'flex', alignItems:'center', gap:6 }}>Scadenza (giorni)<span style={{ width:80 }}><TextInput value={days} onChange={setDays} /></span></label>}
        </div>

        <Button variant="outline" size="md" disabled={!name.trim() || !picked.length}
          style={{ borderColor:'var(--color-accent)', color:'var(--color-accent)' }} onClick={create}>Crea token</Button>
      </section>

      <section>
        <SectionLabel>Token attivi</SectionLabel>
        <table style={{ width:'100%', borderCollapse:'collapse', textAlign:'left', fontSize:'var(--text-xs)' }}>
          <thead>
            <tr style={{ borderBottom:'1px solid var(--color-border)', color:'var(--color-text-dim)' }}>
              {['Nome','Scope','Scadenza','Creato','Ultimo uso',''].map(h => <th key={h} style={{ padding:'4px 8px 4px 0', fontWeight:500 }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {tokens.map(t => (
              <tr key={t.id} style={{ borderBottom:'1px solid var(--color-border)' }}>
                <td style={{ padding:'6px 8px 6px 0', color:'var(--color-text)' }}>{t.name}</td>
                <td style={{ padding:'6px 8px 6px 0' }}><div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>{t.scopes.map(s => <Chip key={s} mono>{s}</Chip>)}</div></td>
                <td style={{ padding:'6px 8px 6px 0', color:'var(--color-text-dim)' }}>{t.expires_at || 'mai'}</td>
                <td style={{ padding:'6px 8px 6px 0', color:'var(--color-text-dim)' }}>{t.created_at}</td>
                <td style={{ padding:'6px 8px 6px 0', color:'var(--color-text-dim)' }}>{t.last_used_at || '—'}</td>
                <td style={{ padding:'6px 0' }}><Button variant="outline" size="sm" onClick={() => setTokens(ts => ts.filter(x => x.id !== t.id))}>Revoca</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
Object.assign(window, { SettingsScreen });
