import React from 'react';

const VARIANTS = {
  accent: { background: 'var(--color-accent)', color: 'var(--color-bg)', border: '1px solid transparent', fontWeight: 700 },
  outline: { background: 'transparent', color: 'var(--color-text)', border: '1px solid var(--color-border)', fontWeight: 500 },
  ghost: { background: 'transparent', color: 'var(--color-text-dim)', border: '1px solid transparent', fontWeight: 500 },
  approve: { background: 'var(--color-fsm-approved)', color: 'var(--on-state)', border: '1px solid transparent', fontWeight: 600 },
  reject: { background: 'var(--color-fsm-rejected)', color: '#fff', border: '1px solid transparent', fontWeight: 600 },
};
const SIZES = {
  sm: { padding: '2px 8px', fontSize: 'var(--text-11)', borderRadius: 'var(--radius-sm)' },
  md: { padding: '6px 12px', fontSize: 'var(--text-13)', borderRadius: 'var(--radius-md)' },
  lg: { padding: '8px 16px', fontSize: 'var(--text-sm)', borderRadius: 'var(--radius-md)' },
  cta: { padding: '12px 24px', fontSize: 'var(--text-base)', borderRadius: 'var(--radius-lg)' },
};

export function Button({ variant = 'outline', size = 'md', disabled, loading, icon, children, onClick, title, style }) {
  const [hover, setHover] = React.useState(false);
  const v = VARIANTS[variant] || VARIANTS.outline;
  const isDim = disabled || loading;
  return (
    <button
      type="button" title={title} disabled={isDim} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', whiteSpace: 'nowrap',
        fontFamily: 'var(--font-sans)', cursor: isDim ? 'not-allowed' : 'pointer',
        opacity: isDim ? 'var(--disabled-opacity)' : (hover && !isDim && variant !== 'outline' && variant !== 'ghost' ? 0.9 : 1),
        borderColor: variant === 'outline' && hover && !isDim ? 'var(--color-accent)' : undefined,
        color: variant === 'ghost' && hover && !isDim ? 'var(--color-accent)' : undefined,
        ...v, ...SIZES[size] || SIZES.md, ...style,
      }}
    >
      {icon}{loading ? 'invio…' : children}
    </button>
  );
}
function Chip({ children, color, mono = false, title }) {
  return (
    <span
      title={title}
      style={{
        padding: '2px 8px', border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-pill)', fontSize: 'var(--text-xs)',
        color: color || 'var(--color-text-dim)', whiteSpace: 'nowrap',
        fontFamily: mono ? 'var(--font-mono)' : 'inherit',
      }}
    >{children}</span>
  );
}

const ICON_CACHE = {};
const ICON_BASE = 'https://unpkg.com/lucide-static@0.544.0/icons/';

function Icon({ name, size = 16, strokeWidth = 2, style, title }) {
  const [markup, setMarkup] = React.useState(ICON_CACHE[name] || null);
  React.useEffect(() => {
    if (ICON_CACHE[name]) { setMarkup(ICON_CACHE[name]); return; }
    let live = true;
    fetch(ICON_BASE + name + '.svg').then(r => r.text()).then(t => {
      ICON_CACHE[name] = t;
      if (live) setMarkup(t);
    }).catch(() => {});
    return () => { live = false; };
  }, [name]);
  const box = { display: 'inline-flex', width: size, height: size, flexShrink: 0, lineHeight: 0, ...style };
  if (!markup) return <span aria-hidden="true" style={box} />;
  const sized = markup
    .replace('width="24"', 'width="' + size + '"')
    .replace('height="24"', 'height="' + size + '"')
    .replace('stroke-width="2"', 'stroke-width="' + strokeWidth + '"');
  return <span title={title} style={box} dangerouslySetInnerHTML={{ __html: sized }} />;
}

function KpiTile({ value, label, color }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-0-5)',
      border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-2-5)', background: 'var(--color-surface)',
    }}>
      <span style={{ fontSize: 'var(--text-kpi)', fontWeight: 700, lineHeight: 1, color: color || 'var(--color-accent)' }}>{value}</span>
      <span style={{ fontSize: 'var(--text-10)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-label)', color: 'var(--color-muted)' }}>{label}</span>
    </div>
  );
}

function ProgressBar({ pct = 0, showValue = true }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
      <div style={{ height: '6px', flex: 1, overflow: 'hidden', borderRadius: 'var(--radius-pill)', background: 'var(--color-surface-2)' }}>
        <div style={{ height: '100%', width: pct + '%', borderRadius: 'var(--radius-pill)', background: 'var(--color-accent)' }} />
      </div>
      {showValue && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-dim)' }}>{pct}%</span>}
    </div>
  );
}

function SectionLabel({ children, size = 'sec', style }) {
  const isSec = size === 'sec';
  return (
    <div style={{
      fontSize: isSec ? 'var(--label-size)' : 'var(--text-10)',
      fontWeight: isSec ? 'var(--label-weight)' : 400,
      textTransform: 'uppercase', letterSpacing: 'var(--label-tracking)',
      color: isSec ? 'var(--color-text-dim)' : 'var(--color-muted)',
      marginBottom: isSec ? '8px' : '4px', ...style,
    }}>{children}</div>
  );
}

function Select({ value, onChange, options = [], size = 'md' }) {
  const sm = size === 'sm';
  return (
    <select
      value={value} onChange={e => onChange && onChange(e.target.value)}
      style={{
        borderRadius: sm ? 'var(--radius-sm)' : 'var(--radius-md)',
        border: '1px solid var(--color-border)', background: 'var(--color-surface-2)',
        padding: sm ? '2px 6px' : '4px 8px', outline: 'none',
        fontSize: sm ? 'var(--text-11)' : 'var(--text-sm)',
        fontWeight: sm ? 400 : 600, fontFamily: 'var(--font-sans)',
        color: sm ? 'var(--color-text)' : 'var(--color-accent)',
      }}
    >
      {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
    </select>
  );
}
const CELL_STATE = {
  accepted: { c: 'var(--color-fsm-approved)', i: '✓' },
  tollgate: { c: 'var(--color-fsm-human-pending)', i: '⚠' },
  iterating: { c: 'var(--color-fsm-agent-running)', i: '◐' },
  blocked: { c: 'var(--color-fsm-blocked)', i: '⛔' },
  pending: { c: 'var(--color-border)', i: '·' },
};

function StateCell({ state = 'pending', rollup = false, size = 20 }) {
  const s = CELL_STATE[state] || CELL_STATE.pending;
  return (
    <span
      title={state}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        height: size, width: size, borderRadius: 'var(--radius-sm)', fontSize: '11px',
        color: s.c, border: '1px solid ' + s.c, opacity: rollup ? 0.6 : 1,
      }}
    >{s.i}</span>
  );
}

const STATUSBADGE_COLORS = {
  draft: '--color-fsm-draft',
  ready: '--color-fsm-ready',
  agent_running: '--color-fsm-agent-running',
  maker_done: '--color-fsm-maker-done',
  adversarial_in_progress: '--color-fsm-adversarial',
  adversarial_done: '--color-fsm-adversarial',
  human_pending: '--color-fsm-human-pending',
  deadlock_human_pending: '--color-fsm-human-pending',
  merge_conflict: '--color-fsm-human-pending',
  approved: '--color-fsm-approved',
  children_pending_review: '--color-fsm-ready',
  done: '--color-fsm-done',
  rejected: '--color-fsm-rejected',
  blocked: '--color-fsm-blocked',
  failed_recoverable: '--color-fsm-rejected',
};

function statusColor(status) {
  return 'var(' + (STATUSBADGE_COLORS[status] || '--color-muted') + ')';
}

function StatusBadge({ status, title }) {
  const c = statusColor(status);
  return (
    <span
      title={title || status}
      style={{
        display: 'inline-block', padding: '1px 8px', border: '1px solid ' + c,
        borderRadius: 'var(--radius-pill)', fontSize: '11px',
        fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', color: c,
      }}
    >{status}</span>
  );
}

function TabBar({ tabs = [], active, onSelect, dense = false }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0,
      borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface)',
      padding: dense ? '3px 6px' : '4px 8px',
    }}>
      {tabs.map(t => {
        const on = t.id === active;
        return (
          <button key={t.id} type="button" onClick={() => onSelect && onSelect(t.id)} title={t.title || t.label}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: dense ? '3px 8px' : '4px 10px',
              borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', whiteSpace: 'nowrap',
              color: on ? 'var(--color-accent)' : 'var(--color-text-dim)',
              background: on ? 'var(--color-surface-2)' : 'transparent',
            }}>
            {t.icon && <Icon name={t.icon} size={13} />}
            {t.label}
            {t.badge != null && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 15, height: 15,
                borderRadius: 'var(--radius-pill)', padding: '0 4px', fontSize: 'var(--text-10)', fontWeight: 700,
                background: t.badgeColor || 'var(--color-fsm-human-pending)', color: 'var(--on-state)',
              }}>{t.badge}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function TextArea({ value, onChange, placeholder, rows = 2, disabled, style }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <textarea
      value={value} rows={rows} placeholder={placeholder} disabled={disabled}
      onChange={e => onChange && onChange(e.target.value)}
      onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
      style={{
        width: '100%', resize: 'vertical', padding: 'var(--space-2)',
        borderRadius: 'var(--radius-md)', outline: 'none',
        border: '1px solid ' + (focus ? 'var(--color-accent)' : 'var(--color-border)'),
        background: 'var(--color-surface-2)', color: 'var(--color-text)',
        fontFamily: 'var(--font-sans)', fontSize: 'var(--text-13)', ...style,
      }}
    />
  );
}

function TextInput({ value, onChange, placeholder, mono = false, readOnly, type = 'text', style }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <input
      type={type} value={value} placeholder={placeholder} readOnly={readOnly}
      onChange={e => onChange && onChange(e.target.value)}
      onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
      style={{
        width: '100%', padding: '4px 8px', borderRadius: 'var(--radius-sm)', outline: 'none',
        border: '1px solid ' + (focus ? 'var(--color-accent)' : 'var(--color-border)'),
        background: 'var(--color-bg)', color: 'var(--color-text)',
        fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
        fontSize: mono ? 'var(--text-xs)' : 'var(--text-sm)', ...style,
      }}
    />
  );
}
function GapBanner({ children, tone = 'human' }) {
  const color = tone === 'neutral' ? 'var(--color-muted)' : 'var(--color-fsm-human-pending)';
  return (
    <div style={{
      display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-start',
      border: '1px solid ' + color, borderRadius: 'var(--radius-md)',
      background: tone === 'neutral' ? 'transparent' : 'var(--tint-human-pending)',
      padding: 'var(--space-2-5)', fontSize: 'var(--text-11)',
      lineHeight: 'var(--leading-relaxed)', color: 'var(--color-text-dim)',
    }}>
      <span style={{ color, flexShrink: 0 }}>{tone === 'neutral' ? '○' : '⚠'}</span>
      <span>{children}</span>
    </div>
  );
}

function ClearanceNotice({ requiredRole, currentRole, inline = false, children }) {
  const text = children || ('Riservato: richiede ruolo ' + requiredRole + (currentRole ? ' — il tuo è ' + currentRole : ''));
  if (inline) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-10)', fontFamily: 'var(--font-mono)', color: 'var(--color-muted)' }}>
        <Icon name="lock" size={11} />{text}
      </span>
    );
  }
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)',
      border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)',
      background: 'var(--color-surface-2)', padding: 'var(--space-2-5)',
      fontSize: 'var(--text-11)', lineHeight: 'var(--leading-relaxed)', color: 'var(--color-text-dim)',
    }}>
      <Icon name="lock" size={14} style={{ color: 'var(--color-muted)' }} />
      <span>{text}</span>
    </div>
  );
}

const PHASE_ICON = { accepted: '✓', iterating: '◐', tollgate: '⚠', pending: '○', blocked: '⛔' };
const PHASE_COLOR = {
  accepted: 'var(--color-fsm-approved)', iterating: 'var(--color-fsm-agent-running)',
  tollgate: 'var(--color-fsm-human-pending)', pending: 'var(--color-muted)', blocked: 'var(--color-fsm-blocked)',
};

function PhaseStepper({ phases = [], selected, onSelect }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'stretch', gap: '4px' }}>
      {phases.map(p => {
        const active = p.phase === selected;
        return (
          <button key={p.phase} type="button" onClick={() => onSelect && onSelect(p.phase)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
              flex: '1 1 78px', padding: 'var(--space-2)', cursor: 'pointer',
              borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)',
              border: '1px solid ' + (active ? PHASE_COLOR[p.derived_status] : 'var(--color-border)'),
              background: active ? 'var(--color-surface-2)' : 'transparent',
            }}>
            <span style={{ fontSize: 'var(--text-base)', color: PHASE_COLOR[p.derived_status] }}>{PHASE_ICON[p.derived_status]}</span>
            <span style={{ fontWeight: 500, color: 'var(--color-text)' }}>{p.label}</span>
          </button>
        );
      })}
    </div>
  );
}

const FINDING_SEV = {
  critical: { c: 'var(--color-sev-critical)', l: 'CRITICO' },
  high: { c: 'var(--color-sev-high)', l: 'ALTO' },
  medium: { c: 'var(--color-sev-medium)', l: 'MEDIO' },
  low: { c: 'var(--color-sev-low)', l: 'BASSO' },
  none: { c: 'var(--color-sev-none)', l: '—' },
  blocker: { c: 'var(--color-fsm-rejected)', l: 'BLOCKER' },
  major: { c: 'var(--color-fsm-human-pending)', l: 'MAJOR' },
  minor: { c: 'var(--color-fsm-ready)', l: 'MINOR' },
  nit: { c: 'var(--color-muted)', l: 'NIT' },
};

function FindingCard({ finding }) {
  const sev = FINDING_SEV[finding.severity] || FINDING_SEV.none;
  const title = finding.title || finding.category || finding.id;
  const evidence = finding.evidence_ref || finding.location;
  return (
    <div style={{
      borderRadius: 'var(--radius-md)', borderLeft: '2px solid ' + sev.c,
      background: 'var(--color-surface-2)', padding: '10px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <span style={{ borderRadius: 'var(--radius-sm)', padding: '2px 6px', fontSize: 'var(--text-10)', fontWeight: 700, background: sev.c, color: 'var(--on-state)' }}>{sev.l}</span>
        {title && <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text)' }}>{title}</span>}
      </div>
      <p style={{ margin: '4px 0 0', fontSize: 'var(--text-xs)', lineHeight: 'var(--leading-relaxed)', color: 'var(--color-text-dim)' }}>{finding.description}</p>
      {finding.suggestion && <p style={{ margin: '4px 0 0', fontSize: 'var(--text-xs)', lineHeight: 'var(--leading-relaxed)', color: 'var(--color-muted)' }}>{'💡 ' + finding.suggestion}</p>}
      {evidence && (
        <div style={{ marginTop: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px', borderRadius: 'var(--radius-sm)', background: 'var(--color-bg)', padding: '2px 6px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-10)', color: 'var(--color-muted)' }}>
          {'📍 ' + evidence}
        </div>
      )}
    </div>
  );
}
function TollgateDecision({
  operator, dwellRequired = 0, elapsed = 0, approvals = [], busy,
  error, loading, onDecide, gapNotice,
}) {
  const [justification, setJustification] = React.useState('');
  const [pending, setPending] = React.useState(null);
  const remaining = Math.max(0, dwellRequired - elapsed);
  const dwellReady = remaining === 0;
  const needsJust = pending === 'reject' || pending === 'override';
  const canSend = justification.trim().length >= 10;

  return (
    <section style={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', background: 'var(--color-surface-2)', padding: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2-5)' }}>
      <SectionLabel style={{ marginBottom: 0 }}>{'Decisione · lettura ' + elapsed + 's / dwell ' + dwellRequired + 's'}</SectionLabel>

      {approvals.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-3)', fontSize: 'var(--text-11)', color: 'var(--color-text-dim)' }}>
          {approvals.map((a, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: a.decision === 'approve' ? 'var(--color-fsm-approved)' : a.decision === 'reject' ? 'var(--color-fsm-rejected)' : 'var(--color-fsm-human-pending)' }}>
                {a.decision === 'approve' ? '✓' : a.decision === 'reject' ? '✗' : '⚡'}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{a.actor}</span>
              <span style={{ color: 'var(--color-muted)' }}>{a.at}</span>
            </span>
          ))}
        </div>
      )}

      <GapBanner>{gapNotice || 'Verifica hold non disponibile da questa UI: il motore applica comunque il proprio stato, ma il controllo hold/two-principal del path MCP non è replicato sul path HTTP (bug motore tracciato).'}</GapBanner>

      {loading ? (
        <div style={{ height: 60, borderRadius: 'var(--radius-md)', background: 'var(--color-surface)' }} />
      ) : (
        <>
          {needsJust && (
            <TextArea value={justification} onChange={setJustification}
              placeholder={'Motivazione obbligatoria per ' + (pending === 'reject' ? 'Rifiuta' : 'Override') + ' (min 10 caratteri)'} />
          )}
          {!dwellReady && (
            <p style={{ margin: 0, fontSize: 'var(--text-11)', color: 'var(--color-fsm-human-pending)' }}>
              {'⏱ Attendi ' + remaining + 's prima di poter decidere — tempo minimo di revisione.'}
            </p>
          )}
          {error && <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--color-fsm-rejected)' }}>{error}</p>}

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-2)' }}>
            {!needsJust ? (
              <>
                <Button variant="approve" size="lg" disabled={!dwellReady || busy} loading={busy}
                  onClick={() => onDecide && onDecide('approve')}>{'✓ Approva'}</Button>
                <Button variant="reject" size="lg" disabled={busy} onClick={() => setPending('reject')}>{'✗ Rifiuta'}</Button>
                <Button variant="outline" size="lg" disabled={busy} onClick={() => setPending('override')}>{'⚡ Override'}</Button>
              </>
            ) : (
              <>
                <Button variant={pending === 'reject' ? 'reject' : 'outline'} size="lg" disabled={!canSend || busy} loading={busy}
                  onClick={() => onDecide && onDecide(pending, justification.trim())}>
                  {pending === 'reject' ? 'Conferma rifiuto' : 'Conferma override'}
                </Button>
                <Button variant="ghost" size="lg" disabled={busy} onClick={() => { setPending(null); setJustification(''); }}>Annulla</Button>
              </>
            )}
            <span style={{ marginLeft: 'auto', fontSize: 'var(--text-11)', color: 'var(--color-text-dim)' }}>
              <span style={{ color: 'var(--color-fsm-approved)' }}>{'● '}</span>{operator || 'non autenticato'}
            </span>
          </div>
        </>
      )}
    </section>
  );
}

const LIVESESSIONS_KIND_ICON = { agent: 'bot', orchestrator: 'workflow' };

function LiveSessions({ sessions = [], project, selectedId, onSelect, notConnected }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
        <SectionLabel style={{ marginBottom: 0 }}>{'Worker live (' + sessions.length + ')'}</SectionLabel>
        {project && <span style={{ fontSize: 'var(--text-10)', color: 'var(--color-muted)' }}>{project}</span>}
      </div>

      {notConnected ? (
        <p style={{ margin: '10px 0 0', display: 'flex', gap: 6, fontSize: 'var(--text-11)', color: 'var(--color-text-dim)' }}>
          <span style={{ color: 'var(--color-muted)' }}>{'○'}</span>{notConnected}
        </p>
      ) : (
        <ul style={{ margin: '8px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column' }}>
          {sessions.map(s => {
            const active = s.id === selectedId;
            const running = s.status === 'agent_running' || s.status === 'adversarial_in_progress';
            return (
              <li key={s.id}>
                <button type="button" onClick={() => onSelect && onSelect(s.id)} style={{
                  width: '100%', textAlign: 'left', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2)',
                  border: 'none', borderLeft: '2px solid ' + (active ? 'var(--color-accent)' : 'transparent'),
                  borderBottom: '1px solid var(--border-hairline-soft)',
                  background: active ? 'var(--color-surface-2)' : 'transparent', fontFamily: 'var(--font-sans)',
                }}>
                  <Icon name={LIVESESSIONS_KIND_ICON[s.kind] || 'bot'} size={14} style={{ color: running ? 'var(--color-fsm-agent-running)' : 'var(--color-muted)' }} />
                  <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-11)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-dim)' }}>
                      {s.agent_id}<span style={{ color: 'var(--color-muted)' }}>{s.node_code}</span>
                    </span>
                    <span style={{ fontSize: 'var(--text-13)', color: active ? 'var(--color-accent)' : 'var(--color-text)' }}>{s.activity}</span>
                    <span style={{ fontSize: 'var(--text-10)', fontFamily: 'var(--font-mono)', color: 'var(--color-muted)' }}>
                      {s.phase + ' #' + s.iteration + ' · ' + s.model_id + ' · ' + s.duration}
                    </span>
                  </span>
                  <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <StatusBadge status={s.status} />
                  </span>
                </button>
              </li>
            );
          })}
          {sessions.length === 0 && <li style={{ padding: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>Nessun worker attivo su questo progetto.</li>}
        </ul>
      )}
    </div>
  );
}

function TerminalGate({ available, dependency = 'EPIC-NAP-4 → NAP-4.1bis', dependencyStatus = 'blocked', onOpen, followUpHref }) {
  const color = available ? 'var(--color-fsm-approved)' : 'var(--color-fsm-human-pending)';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
      border: '1px solid ' + (available ? 'var(--color-border)' : color),
      borderRadius: 'var(--radius-md)', background: available ? 'var(--color-surface-2)' : 'var(--tint-human-pending)',
      padding: 'var(--space-2-5)',
    }}>
      <Icon name="terminal" size={16} style={{ color }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontSize: 'var(--text-13)', color: 'var(--color-text)' }}>Terminale integrato</span>
        <span style={{ fontSize: 'var(--text-10)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-dim)' }}>
          {dependency + ' · ' + dependencyStatus}
        </span>
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        {available ? (
          <button type="button" onClick={onOpen} style={{ border: '1px solid var(--color-accent)', background: 'transparent', borderRadius: 'var(--radius-md)', padding: '4px 10px', fontSize: 'var(--text-xs)', color: 'var(--color-accent)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Apri</button>
        ) : (
          <>
            <span style={{ fontSize: 'var(--text-11)', color }}>non disponibile</span>
            {followUpHref && <a href={followUpHref} style={{ fontSize: 'var(--text-11)' }}>segui la dipendenza</a>}
          </>
        )}
      </div>
    </div>
  );
}

const GITPANEL_row = { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)' };

function GitPanel({ git, onCopy, onOpenDiff, onOpenPr, onRefresh, notConnected }) {
  if (notConnected) {
    return (
      <section style={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', background: 'var(--color-surface)', padding: 'var(--space-4)' }}>
        <SectionLabel>Git</SectionLabel>
        <p style={{ margin: 0, display: 'flex', gap: 6, fontSize: 'var(--text-11)', color: 'var(--color-text-dim)' }}>
          <span style={{ color: 'var(--color-muted)' }}>{'○'}</span>{notConnected}
        </p>
      </section>
    );
  }
  return (
    <section style={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', background: 'var(--color-surface)', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2-5)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
        <SectionLabel style={{ marginBottom: 0 }}>Git</SectionLabel>
        <span style={{ fontSize: 'var(--text-10)', color: 'var(--color-muted)' }}>merge e deploy non si comandano da qui</span>
        <span style={{ marginLeft: 'auto' }}><Button variant="ghost" size="sm" icon={<Icon name="refresh-cw" size={12} />} onClick={onRefresh}>Rileggi</Button></span>
      </div>

      <div style={GITPANEL_row}>
        <Icon name="git-branch" size={14} style={{ color: 'var(--color-muted)' }} />
        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text)' }}>{git.branch}</span>
        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-muted)' }}>{'@' + String(git.commit_sha).slice(0, 7)}</span>
        <Button variant="outline" size="sm" onClick={() => onCopy && onCopy(git.branch)}>Copia</Button>
      </div>

      <div style={{ ...GITPANEL_row, color: 'var(--color-text-dim)' }}>
        <span style={{ fontFamily: 'var(--font-mono)' }}>{'↑' + git.ahead + ' ↓' + git.behind}</span>
        <span>{'rispetto a ' + git.base}</span>
        {git.dirty
          ? <span style={{ color: 'var(--color-fsm-human-pending)' }}>working tree sporco</span>
          : <span style={{ color: 'var(--color-fsm-approved)' }}>working tree pulito</span>}
      </div>

      {git.files?.length > 0 && (
        <div>
          <SectionLabel size="lbl">{'file toccati (' + git.files.length + ')'}</SectionLabel>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {git.files.map(fl => (
              <li key={fl.path} style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-11)', color: 'var(--color-text-dim)' }}>
                <span style={{ color: fl.status === 'A' ? 'var(--color-fsm-approved)' : fl.status === 'D' ? 'var(--color-fsm-rejected)' : 'var(--color-muted)' }}>{fl.status}</span>
                <span>{fl.path}</span>
                <span style={{ marginLeft: 'auto', color: 'var(--color-muted)' }}>{'+' + fl.added + ' −' + fl.removed}</span>
                <button type="button" onClick={() => onOpenDiff && onOpenDiff(fl)} style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-10)', color: 'var(--color-accent-dim)', textDecoration: 'underline' }}>diff</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {git.pr && (
        <div style={{ ...GITPANEL_row, borderTop: '1px solid var(--border-hairline-soft)', paddingTop: 'var(--space-2)' }}>
          <Icon name="git-pull-request" size={14} style={{ color: 'var(--color-muted)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text)' }}>{git.pr.id}</span>
          <span style={{ color: git.pr.state === 'merged' ? 'var(--color-fsm-done)' : git.pr.state === 'open' ? 'var(--color-fsm-ready)' : 'var(--color-muted)' }}>{git.pr.state}</span>
          <span style={{ color: 'var(--color-text-dim)' }}>{git.pr.checks + ' check'}</span>
          <Button variant="outline" size="sm" onClick={() => onOpenPr && onOpenPr(git.pr)}>Apri sulla forge</Button>
        </div>
      )}
    </section>
  );
}

const PIPELINE_STAGE_COLOR = {
  passed: 'var(--color-fsm-approved)', running: 'var(--color-fsm-agent-running)',
  failed: 'var(--color-fsm-rejected)', pending: 'var(--color-muted)', skipped: 'var(--color-border)',
};
const PIPELINE_STAGE_GLYPH = { passed: '✓', running: '◐', failed: '✗', pending: '·', skipped: '–' };

function PipelinePanel({ runs = [], notConnected }) {
  return (
    <section style={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', background: 'var(--color-surface)', padding: 'var(--space-4)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
        <SectionLabel style={{ marginBottom: 0 }}>CI / CD</SectionLabel>
        <span style={{ fontSize: 'var(--text-10)', color: 'var(--color-muted)' }}>sola lettura</span>
      </div>

      {notConnected ? (
        <p style={{ margin: '10px 0 0', display: 'flex', gap: 6, fontSize: 'var(--text-11)', color: 'var(--color-text-dim)' }}>
          <span style={{ color: 'var(--color-muted)' }}>{'○'}</span>{notConnected}
        </p>
      ) : (
        <ul style={{ margin: '10px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {runs.map(r => (
            <li key={r.id} style={{ borderTop: '1px solid var(--border-hairline-soft)', paddingTop: 'var(--space-2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-11)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text)' }}>{r.id}</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-muted)' }}>{r.branch + ' @' + String(r.commit_sha).slice(0, 7)}</span>
                <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', color: 'var(--color-text-dim)' }}>{r.duration}</span>
                <span style={{ color: PIPELINE_STAGE_COLOR[r.status] || 'var(--color-muted)' }}>{r.status}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                {r.stages.map(s => (
                  <span key={s.name} title={s.name + ' · ' + s.status + (s.duration ? ' · ' + s.duration : '')}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4, borderRadius: 'var(--radius-sm)',
                      border: '1px solid ' + (PIPELINE_STAGE_COLOR[s.status] || 'var(--color-border)'),
                      padding: '1px 6px', fontSize: 'var(--text-10)', fontFamily: 'var(--font-mono)',
                      color: PIPELINE_STAGE_COLOR[s.status] || 'var(--color-muted)',
                    }}>
                    {PIPELINE_STAGE_GLYPH[s.status]}{s.name}
                  </span>
                ))}
                {r.log_url && <a href={r.log_url} style={{ fontSize: 'var(--text-10)', alignSelf: 'center' }}>log</a>}
              </div>
            </li>
          ))}
          {runs.length === 0 && <li style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>Nessuna pipeline per questo nodo.</li>}
        </ul>
      )}
    </section>
  );
}

function KvPanel({ entries = [], currentRole, writeRole = 'tech_lead', onReveal, onEdit, notConnected }) {
  const canWrite = currentRole === 'admin' || currentRole === writeRole;
  return (
    <section style={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', background: 'var(--color-surface)', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2-5)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
        <SectionLabel style={{ marginBottom: 0 }}>Flusso KV</SectionLabel>
        <span style={{ fontSize: 'var(--text-10)', color: 'var(--color-muted)' }}>configurazione letta dagli agenti</span>
      </div>

      {notConnected ? (
        <p style={{ margin: 0, display: 'flex', gap: 6, fontSize: 'var(--text-11)', color: 'var(--color-text-dim)' }}>
          <span style={{ color: 'var(--color-muted)' }}>{'○'}</span>{notConnected}
        </p>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {entries.map(e => (
                <tr key={e.key} style={{ borderTop: '1px solid var(--border-hairline-soft)' }}>
                  <td style={{ padding: '6px 8px 6px 0', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-11)', color: 'var(--color-text)' }}>{e.key}</td>
                  <td style={{ padding: '6px 8px 6px 0', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-11)', color: e.secret ? 'var(--color-muted)' : 'var(--color-text-dim)' }}>
                    {e.secret ? '••••••••' : e.value}
                  </td>
                  <td style={{ padding: '6px 8px 6px 0', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-10)', color: 'var(--color-muted)' }}>{'v' + e.version + ' · ' + e.updated_at}</td>
                  <td style={{ padding: '6px 0', textAlign: 'right' }}>
                    {e.secret && (canWrite
                      ? <Button variant="ghost" size="sm" onClick={() => onReveal && onReveal(e)}>Mostra</Button>
                      : <ClearanceNotice inline requiredRole={writeRole} currentRole={currentRole} />)}
                    {!e.secret && canWrite && <Button variant="outline" size="sm" onClick={() => onEdit && onEdit(e)}>Modifica</Button>}
                  </td>
                </tr>
              ))}
              {entries.length === 0 && <tr><td colSpan={4} style={{ padding: '8px 0', fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>Nessuna chiave per questo nodo.</td></tr>}
            </tbody>
          </table>
          {!canWrite && <ClearanceNotice requiredRole={writeRole} currentRole={currentRole}>{'Scrittura KV riservata al ruolo ' + writeRole + ' o superiore: da qui puoi solo leggere.'}</ClearanceNotice>}
        </>
      )}
    </section>
  );
}
function NotificationsMenu({ items = [], onOpenSession, onOpenTollgate, onClose }) {
  return (
    <div style={{
      width: 380, borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)',
      background: 'var(--color-surface)', boxShadow: 'var(--shadow-drawer)', overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', borderBottom: '1px solid var(--color-border)', padding: '8px 12px' }}>
        <SectionLabel style={{ marginBottom: 0 }}>{'Tollgate in attesa (' + items.length + ')'}</SectionLabel>
        <button type="button" onClick={onClose} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', display: 'flex' }}>
          <Icon name="x" size={13} />
        </button>
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', maxHeight: 320, overflow: 'auto' }}>
        {items.map(n => (
          <li key={n.id} style={{ borderBottom: '1px solid var(--border-hairline-soft)', padding: 'var(--space-2-5)', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-10)', color: 'var(--color-text-dim)' }}>
              {n.node_code}
              <span style={{ marginLeft: 'auto', color: 'var(--color-fsm-human-pending)' }}>{n.waiting_label}</span>
            </div>
            <div style={{ fontSize: 'var(--text-13)', color: 'var(--color-text)' }}>{n.title}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-10)', color: 'var(--color-muted)' }}>
              <StatusBadge status={n.status} />{n.project}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 2 }}>
              {n.session_id ? (
                <button type="button" onClick={() => onOpenSession && onOpenSession(n)}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, border: '1px solid var(--color-border)', background: 'transparent', borderRadius: 'var(--radius-md)', padding: '3px 8px', fontSize: 'var(--text-11)', color: 'var(--color-text)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                  <Icon name="terminal" size={12} />{'Sessione ' + n.session_label}
                </button>
              ) : (
                <span style={{ fontSize: 'var(--text-10)', color: 'var(--color-muted)' }}>nessuna sessione aperta collegata</span>
              )}
              <button type="button" onClick={() => onOpenTollgate && onOpenTollgate(n)}
                style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', fontSize: 'var(--text-11)', color: 'var(--color-accent-dim)', textDecoration: 'underline', fontFamily: 'var(--font-sans)' }}>
                Vai al tollgate
              </button>
            </div>
          </li>
        ))}
        {items.length === 0 && <li style={{ padding: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>Nessun tollgate in attesa.</li>}
      </ul>
    </div>
  );
}

function FeedbackPanel({ items = [], onCreate, onToggle }) {
  const [body, setBody] = React.useState('');
  const MARK = {
    resolved: { c: 'var(--color-fsm-approved)', i: '✓' },
    open: { c: 'var(--color-fsm-human-pending)', i: '⚠' },
  };
  return (
    <div>
      <SectionLabel>Feedback</SectionLabel>
      <form onSubmit={e => { e.preventDefault(); if (body.trim()) { onCreate && onCreate(body.trim()); setBody(''); } }}
        style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
        <TextArea value={body} onChange={setBody} placeholder="Scrivi un feedback…" />
        <Button variant="outline" size="md" disabled={!body.trim()} style={{ alignSelf: 'flex-start' }}
          onClick={() => { if (body.trim()) { onCreate && onCreate(body.trim()); setBody(''); } }}>Invia</Button>
      </form>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: 'var(--text-xs)' }}>
        {items.map(it => {
          const m = MARK[it.status] || MARK.open;
          return (
            <li key={it.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)', borderBottom: '1px solid var(--border-hairline-soft)', padding: '4px 0' }}>
              <span title={it.status} style={{ marginTop: '2px', fontFamily: 'var(--font-mono)', color: m.c }}>{m.i}</span>
              <span style={{ flex: 1, whiteSpace: 'pre-wrap', color: 'var(--color-text)' }}>{it.body}</span>
              <Button variant="outline" size="sm" onClick={() => onToggle && onToggle(it)}>{it.status === 'open' ? 'Risolvi' : 'Riapri'}</Button>
            </li>
          );
        })}
        {items.length === 0 && <li style={{ padding: '4px 0', color: 'var(--color-muted)' }}>Nessun feedback ancora.</li>}
      </ul>
    </div>
  );
}

function CommentThread({ comments = [], hasNew, typing = [], onSubmit, onRefresh, onPermalink }) {
  const [draft, setDraft] = React.useState('');
  const sorted = [...comments].sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  return (
    <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
        <SectionLabel style={{ marginBottom: 0 }}>Commenti</SectionLabel>
        {hasNew && (
          <button type="button" onClick={onRefresh} style={{ border: '1px solid var(--color-accent)', color: 'var(--color-accent)', background: 'transparent', borderRadius: 'var(--radius-pill)', padding: '1px 8px', fontSize: 'var(--text-11)', cursor: 'pointer' }}>
            nuovi commenti · aggiorna
          </button>
        )}
      </div>

      <ul style={{ margin: '0 0 var(--space-3)', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {sorted.map(c => (
          <li key={c.id} style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--color-text-dim)' }}>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{c.author}</span>
              <span>{String(c.created_at).slice(0, 19).replace('T', ' ')}</span>
            </div>
            <p style={{ margin: '4px 0 0', whiteSpace: 'pre-wrap', fontSize: 'var(--text-13)', color: 'var(--color-text)', opacity: c.pending ? 0.5 : 1 }}>{c.body}</p>
            <button type="button" onClick={() => onPermalink && onPermalink(c.id)} style={{ marginTop: '4px', fontSize: 'var(--text-11)', background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', textDecoration: 'underline', color: 'var(--color-accent-dim)' }}>permalink</button>
          </li>
        ))}
        {sorted.length === 0 && <li style={{ padding: '8px 0', fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>Nessun commento ancora.</li>}
      </ul>

      {typing.length > 0 && (
        <p style={{ margin: '0 0 var(--space-2)', fontSize: 'var(--text-11)', color: 'var(--color-muted)' }}>
          {typing.join(', ') + (typing.length > 1 ? ' stanno scrivendo…' : ' sta scrivendo…')}
        </p>
      )}

      <form onSubmit={e => { e.preventDefault(); if (draft.trim()) { onSubmit && onSubmit(draft.trim()); setDraft(''); } }}
        style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-start' }}>
        <TextArea value={draft} onChange={setDraft} placeholder="Scrivi un commento…" />
        <Button variant="outline" size="md" disabled={!draft.trim()} style={{ borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }}
          onClick={() => { if (draft.trim()) { onSubmit && onSubmit(draft.trim()); setDraft(''); } }}>invia</Button>
      </form>
    </div>
  );
}

function ReadOnlyPanel({ title, rows = [], columns = [], notConnected, footnote }) {
  return (
    <section style={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', background: 'var(--color-surface)', padding: 'var(--space-4)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
        <SectionLabel style={{ marginBottom: 0 }}>{title}</SectionLabel>
        <span style={{ fontSize: 'var(--text-10)', color: 'var(--color-muted)' }}>sola lettura</span>
      </div>

      {notConnected ? (
        <p style={{ margin: '10px 0 0', display: 'flex', gap: 6, fontSize: 'var(--text-11)', color: 'var(--color-text-dim)' }}>
          <span style={{ color: 'var(--color-muted)' }}>{'○'}</span>{notConnected}
        </p>
      ) : (
        <table style={{ width: '100%', marginTop: '10px', borderCollapse: 'collapse', fontSize: 'var(--text-11)' }}>
          <thead>
            <tr>
              {columns.map(c => (
                <th key={c.key} style={{ textAlign: c.align || 'left', padding: '0 8px 6px 0', fontWeight: 500, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-label)', fontSize: 'var(--text-10)' }}>{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} style={{ borderTop: '1px solid var(--border-hairline-soft)' }}>
                {columns.map(c => (
                  <td key={c.key} style={{ textAlign: c.align || 'left', padding: '6px 8px 6px 0', color: c.color ? c.color(r) : 'var(--color-text-dim)', fontFamily: c.mono ? 'var(--font-mono)' : 'inherit' }}>{r[c.key]}</td>
                ))}
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={columns.length} style={{ padding: '8px 0', color: 'var(--color-muted)' }}>Nessun dato.</td></tr>}
          </tbody>
        </table>
      )}

      {footnote && <p style={{ margin: '10px 0 0', fontSize: 'var(--text-10)', color: 'var(--color-muted)' }}>{footnote}</p>}
    </section>
  );
}

const TST_KIND_ICON = { agent: 'bot', orchestrator: 'workflow' };
const TST_th = { padding: '0 10px 6px 0', textAlign: 'left', fontWeight: 500, fontSize: 'var(--text-10)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-label)', color: 'var(--color-muted)' };
const TST_td = { padding: '8px 10px 8px 0', fontSize: 'var(--text-xs)', color: 'var(--color-text-dim)', verticalAlign: 'top' };

function TerminalSessionsTable({ sessions = [], currentRole, selectedId, onSelect, onOpen }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={TST_th}>sessione</th><th style={TST_th}>progetto</th><th style={TST_th}>nodo</th>
          <th style={TST_th}>fase</th><th style={TST_th}>operatore</th><th style={TST_th}>stato</th><th style={{ ...TST_th, textAlign: 'right' }}>durata</th><th style={TST_th}></th>
        </tr>
      </thead>
      <tbody>
        {sessions.map(s => {
          const active = s.id === selectedId;
          return (
            <tr key={s.id} onClick={() => !s.restricted && onSelect && onSelect(s.id)}
              style={{ borderTop: '1px solid var(--border-hairline-soft)', cursor: s.restricted ? 'default' : 'pointer', background: active ? 'var(--color-surface-2)' : 'transparent' }}>
              <td style={TST_td}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon name={TST_KIND_ICON[s.kind] || 'bot'} size={13} style={{ color: s.status === 'agent_running' ? 'var(--color-fsm-agent-running)' : 'var(--color-muted)' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text)' }}>{s.agent_id}</span>
                  <span style={{ fontSize: 'var(--text-10)', color: 'var(--color-muted)' }}>{s.kind}</span>
                </span>
                {!s.restricted && s.activity && <div style={{ marginTop: 2, color: 'var(--color-text-dim)' }}>{s.activity}</div>}
              </td>
              <td style={TST_td}>{s.project}</td>
              <td style={{ ...TST_td, fontFamily: 'var(--font-mono)' }}>{s.node_code}</td>
              <td style={{ ...TST_td, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-10)' }}>{s.restricted ? '—' : (s.phase ? s.phase + ' #' + (s.iteration ?? 0) : '—')}</td>
              <td style={TST_td}>{s.restricted ? <ClearanceNotice inline requiredRole={s.required_role} currentRole={currentRole} /> : s.owner}</td>
              <td style={TST_td}>{s.restricted ? <span style={{ color: 'var(--color-muted)' }}>—</span> : <StatusBadge status={s.status} />}</td>
              <td style={{ ...TST_td, textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{s.restricted ? '—' : s.duration}</td>
              <td style={{ ...TST_td, textAlign: 'right' }}>
                {s.restricted
                  ? <span style={{ fontSize: 'var(--text-10)', color: 'var(--color-muted)' }}>{'riservata'}</span>
                  : <Button variant="outline" size="sm" onClick={() => onOpen && onOpen(s.id)}>Apri</Button>}
              </td>
            </tr>
          );
        })}
        {sessions.length === 0 && <tr><td colSpan={8} style={{ ...TST_td, color: 'var(--color-muted)' }}>Nessuna sessione aperta.</td></tr>}
      </tbody>
    </table>
  );
}

function TollgateQueue({ items = [], selectedId, onSelect, mock = false, selectable = false, checkedIds = [], onToggleCheck, onToggleAll }) {
  const sorted = [...items].sort((a, b) => (a.waiting_since < b.waiting_since ? -1 : 1));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
        <SectionLabel style={{ marginBottom: 0 }}>{'In attesa di me (' + items.length + ')'}</SectionLabel>
        {mock && <span style={{ fontSize: 'var(--text-10)', color: 'var(--color-muted)' }}>{'○ dati di esempio — endpoint aggregato non ancora disponibile'}</span>}
        {selectable && (
          <label style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, fontSize: 'var(--text-10)', color: 'var(--color-text-dim)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            <input type="checkbox" checked={checkedIds.length === items.length && items.length > 0} onChange={e => onToggleAll && onToggleAll(e.target.checked)} />
            seleziona tutti
          </label>
        )}
      </div>
      <ul style={{ margin: '8px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column' }}>
        {sorted.map(it => {
          const active = it.node_id === selectedId;
          const checked = checkedIds.includes(it.node_id);
          return (
            <li key={it.node_id} style={{ display: 'flex', alignItems: 'flex-start' }}>
              {selectable && (
                <label style={{ display: 'flex', alignItems: 'center', padding: '12px 6px 0 2px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={checked} onChange={() => onToggleCheck && onToggleCheck(it.node_id)} />
                </label>
              )}
              <button type="button" onClick={() => onSelect && onSelect(it.node_id)}
                style={{
                  width: '100%', textAlign: 'left', cursor: 'pointer', display: 'flex',
                  flexDirection: 'column', gap: '4px', padding: 'var(--space-2)',
                  border: 'none', borderLeft: '2px solid ' + (active ? 'var(--color-fsm-human-pending)' : 'transparent'),
                  borderBottom: '1px solid var(--border-hairline-soft)',
                  background: active ? 'var(--color-surface-2)' : 'transparent',
                  fontFamily: 'var(--font-sans)',
                }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-11)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-dim)' }}>
                  {it.code}
                  <span style={{ marginLeft: 'auto', color: 'var(--color-fsm-human-pending)' }}>{it.waiting_label}</span>
                </span>
                <span style={{ fontSize: 'var(--text-13)', color: active ? 'var(--color-accent)' : 'var(--color-text)' }}>{it.title}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-10)', color: 'var(--color-muted)' }}>
                  <StatusBadge status={it.status} />
                  {it.phase}
                  <span>{'· ' + it.project}</span>
                  {selectable && it.dwell_ready === false && <span style={{ color: 'var(--color-fsm-human-pending)' }}>{'⏱ in revisione'}</span>}
                </span>
              </button>
            </li>
          );
        })}
        {sorted.length === 0 && <li style={{ padding: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>Nessun tollgate in attesa.</li>}
      </ul>
    </div>
  );
}
const MAKEROUTPUT_KNOWN = ['overview','implementation_summary','summary','branch','commit_sha','files_changed',
  'components','interfaces','constraints','acceptance_criteria','agent_guardrail','tasks',
  'milestones','items','title','description','risks','definition_of_done','observations','recommendation'];

function detectKind(d = {}) {
  if (Array.isArray(d.observations) && (d.recommendation !== undefined || d.summary !== undefined)) return 'adversarial';
  if (Array.isArray(d.acceptance_criteria) && (d.risks !== undefined || d.definition_of_done !== undefined) && !Array.isArray(d.components)) return 'requirements';
  if (typeof d.overview === 'string' && Array.isArray(d.components)) return 'specification';
  return 'generic';
}

const MO_dim = { fontSize: 'var(--text-xs)', color: 'var(--color-text-dim)' };

function parseAC(s) {
  const text = typeof s === 'string' ? s : JSON.stringify(s);
  const m1 = text.match(/^((?:S-)?AC-\d+)\s*([^:]*):\s*([\s\S]*)$/);
  const id = m1 ? m1[1] : null;
  const title = m1 ? m1[2].trim() : '';
  let body = m1 ? m1[3] : text;
  let check = null;
  const m2 = body.match(/[—-]\s*falsificabile:\s*([\s\S]*)$/i);
  if (m2) { check = m2[1].trim(); body = body.slice(0, m2.index).trim(); }
  return { id, title, body, check };
}

function AcList({ items }) {
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {items.map((raw, i) => {
        const ac = parseAC(raw);
        return (
          <li key={i} style={{ borderLeft: '1px solid var(--color-border)', paddingLeft: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
              {ac.id && <span style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', padding: '0 5px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-10)', color: 'var(--color-text-dim)' }}>{ac.id}</span>}
              {ac.title && <span style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--color-text)' }}>{ac.title}</span>}
            </div>
            <div style={{ marginTop: 2, ...MO_dim }}>{ac.body}</div>
            {ac.check && (
              <div style={{ marginTop: 2, display: 'flex', gap: 5, fontSize: 'var(--text-10)', color: 'var(--color-muted)' }}>
                <span style={{ textTransform: 'uppercase', letterSpacing: 'var(--tracking-label)' }}>come si verifica</span>
                <span>{ac.check}</span>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function Checklist({ value }) {
  const lines = (Array.isArray(value) ? value : String(value).split('\n'))
    .map(s => String(s).replace(/^[-*☑✓]\s*/, '').trim()).filter(Boolean);
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '2px' }}>
      {lines.map((l, i) => (
        <li key={i} style={{ display: 'flex', gap: '6px', ...MO_dim }}><span style={{ color: 'var(--color-muted)' }}>{'☑'}</span><span>{l}</span></li>
      ))}
    </ul>
  );
}

const MO_MARKERS = ['VERIFICA TECNICA', 'GAP CONFERMATO', 'MITIGAZIONE', 'GAP DICHIARATO', 'RICONFERMATO ESISTENTE'];
const MO_PREFIXES = ['INVARIATO', 'AGGIORNATO', 'NUOVO'];
function Marked({ text }) {
  const re = new RegExp('(' + MO_MARKERS.join('|') + ')', 'g');
  const parts = String(text).split(re);
  return <>{parts.map((p, i) => MO_MARKERS.includes(p)
    ? <span key={i} style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-fsm-human-pending)', padding: '0 4px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-10)', color: 'var(--color-fsm-human-pending)' }}>{p}</span>
    : <React.Fragment key={i}>{p}</React.Fragment>)}</>;
}

function ConstraintList({ items }) {
  const groups = {};
  items.forEach(raw => {
    const s = typeof raw === 'string' ? raw : (raw.name || JSON.stringify(raw));
    const p = MO_PREFIXES.find(x => s.toUpperCase().startsWith(x)) || 'ALTRI';
    (groups[p] = groups[p] || []).push(s.replace(new RegExp('^' + p + ':?\\s*', 'i'), ''));
  });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {Object.keys(groups).map(g => (
        <div key={g}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-10)', letterSpacing: 'var(--tracking-label)', color: g === 'NUOVO' ? 'var(--color-fsm-ready)' : g === 'AGGIORNATO' ? 'var(--color-fsm-agent-running)' : 'var(--color-muted)' }}>{g}</span>
          <ul style={{ margin: '2px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {groups[g].map((s, i) => <li key={i} style={{ display: 'flex', gap: 6, ...MO_dim }}><span style={{ color: 'var(--color-muted)' }}>{'•'}</span><span>{s}</span></li>)}
          </ul>
        </div>
      ))}
    </div>
  );
}
const MO_List = ({ items, glyph }) => (
  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '2px' }}>
    {items.map((it, i) => (
      <li key={i} style={{ display: 'flex', gap: '6px', ...MO_dim }}>
        <span style={{ color: 'var(--color-muted)' }}>{glyph}</span>
        <span>{typeof it === 'string' ? it : (it.name || it.title || it.text || JSON.stringify(it))}</span>
      </li>
    ))}
  </ul>
);

function Guardrail({ guardrail }) {
  return (
    <div style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'var(--color-bg)', padding: 'var(--space-2)' }}>
      <SectionLabel size="lbl">{'🛡 agent guardrail'}</SectionLabel>
      {Object.entries(guardrail).map(([k, v]) => (
        <div key={k} style={{ marginBottom: '2px', fontSize: 'var(--text-xs)' }}>
          <span style={{ color: 'var(--color-muted)' }}>{k}:</span>
          <span style={{ color: 'var(--color-text-dim)' }}>{' ' + (Array.isArray(v) ? v.join(', ') : v)}</span>
        </div>
      ))}
    </div>
  );
}

function MakerOutput({ data }) {
  if (!data) return <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>nessun output</p>;
  const kind = detectKind(data);
  const extra = Object.fromEntries(Object.entries(data).filter(([k]) => !MAKEROUTPUT_KNOWN.includes(k)));
  const wrap = { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' };

  return (
    <div style={wrap}>
      {kind === 'requirements' && (<>
        {data.title && <p style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text)' }}>{data.title}</p>}
        {data.description && <p style={{ margin: 0, lineHeight: 'var(--leading-relaxed)', ...MO_dim }}>{data.description}</p>}
        {data.acceptance_criteria?.length > 0 && <div><SectionLabel size="lbl">{'acceptance criteria (' + data.acceptance_criteria.length + ')'}</SectionLabel><AcList items={data.acceptance_criteria} /></div>}
        {data.risks?.length > 0 && <div><SectionLabel size="lbl">risks</SectionLabel><MO_List items={data.risks.map(r => typeof r === 'string' ? r : (r.mitigation ? (r.risk || r.description) + ' — mitigazione: ' + r.mitigation : (r.risk || r.description)))} glyph={'⚠'} /></div>}
        {data.definition_of_done && (Array.isArray(data.definition_of_done) ? data.definition_of_done.length > 0 : true) && <div><SectionLabel size="lbl">definition of done</SectionLabel><Checklist value={data.definition_of_done} /></div>}
      </>)}

      {kind === 'specification' && (<>
        <p style={{ margin: 0, lineHeight: 'var(--leading-relaxed)', fontSize: 'var(--text-xs)', color: 'var(--color-text)' }}><Marked text={data.overview} /></p>
        {data.components?.length > 0 && (
          <div><SectionLabel size="lbl">components</SectionLabel>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {data.components.map((c, i) => {
                const name = typeof c === 'string' ? c : (c.name || c.title || '(senza nome)');
                const desc = typeof c === 'string' ? '' : (c.description || '');
                const t = c.type;
                const tColor = t === 'new_module' || t === 'new_frontend_component' ? 'var(--color-fsm-ready)'
                  : t === 'extend_existing' ? 'var(--color-fsm-agent-running)' : 'var(--color-muted)';
                return <li key={i} style={MO_dim}>
                  <span style={{ fontWeight: 500, color: 'var(--color-text)' }}>{name}</span>
                  {t && <span style={{ marginLeft: 6, borderRadius: 'var(--radius-sm)', border: '1px solid ' + tColor, padding: '0 4px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-10)', color: tColor }}>{t}</span>}
                  {desc && <span>{' — ' + desc}</span>}
                </li>;
              })}
            </ul>
          </div>
        )}
        {Array.isArray(data.interfaces) && data.interfaces.length > 0 && (
          <div><SectionLabel size="lbl">interfaces</SectionLabel>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {data.interfaces.map((it, i) => {
                const nm = typeof it === 'string' ? it : (it.name || JSON.stringify(it));
                return <li key={i} style={{ display: 'flex', gap: 6, ...MO_dim }}><span style={{ color: 'var(--color-muted)' }}>{'•'}</span>
                  <span><span style={{ fontFamily: 'var(--font-mono)' }}><Marked text={nm} /></span>{it.contract && <span>{' — ' + it.contract}</span>}</span></li>;
              })}
            </ul>
          </div>
        )}
        {Array.isArray(data.constraints) && data.constraints.length > 0 && (
          <div><SectionLabel size="lbl">constraints</SectionLabel><ConstraintList items={data.constraints} /></div>
        )}
        {Array.isArray(data.acceptance_criteria) && data.acceptance_criteria.length > 0 && (
          <div><SectionLabel size="lbl">{'acceptance criteria (' + data.acceptance_criteria.length + ')'}</SectionLabel><AcList items={data.acceptance_criteria} /></div>
        )}
        {data.agent_guardrail && <Guardrail guardrail={data.agent_guardrail} />}
      </>)}

      {kind === 'adversarial' && (<>
        {data.summary && <p style={{ margin: 0, lineHeight: 'var(--leading-relaxed)', fontSize: 'var(--text-xs)', color: 'var(--color-text)' }}>{data.summary}</p>}
        {data.recommendation && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <SectionLabel size="lbl" style={{ marginBottom: 0 }}>recommendation</SectionLabel>
            <span style={{ borderRadius: 'var(--radius-sm)', padding: '2px 6px', fontSize: 'var(--text-10)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--on-state)', background: data.recommendation === 'accept' ? 'var(--color-fsm-approved)' : data.recommendation === 'reject' ? 'var(--color-fsm-rejected)' : 'var(--color-muted)' }}>{data.recommendation}</span>
          </div>
        )}
        {data.observations?.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <SectionLabel size="lbl">{'observations (' + data.observations.length + ')'}</SectionLabel>
            {data.observations.map((o, i) => <FindingCard key={o.id || i} finding={o} />)}
          </div>
        )}
      </>)}

      {kind === 'generic' && (<>
        {(data.implementation_summary || data.overview || data.summary) && (
          <p style={{ margin: 0, lineHeight: 'var(--leading-relaxed)', fontSize: 'var(--text-xs)', color: 'var(--color-text)' }}>{data.implementation_summary || data.overview || data.summary}</p>
        )}
        {data.branch && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)' }}>
            <SectionLabel size="lbl" style={{ marginBottom: 0 }}>branch</SectionLabel>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text)' }}>{'⎇ ' + data.branch}</span>
            {data.commit_sha && <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-muted)' }}>{'@' + String(data.commit_sha).slice(0, 7)}</span>}
          </div>
        )}
        {data.files_changed?.length > 0 && (
          <div><SectionLabel size="lbl">{'file modificati (' + data.files_changed.length + ')'}</SectionLabel>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {data.files_changed.map(fp => (
                <li key={fp} style={{ display: 'flex', gap: '6px', fontFamily: 'var(--font-mono)', ...MO_dim }}><span style={{ color: 'var(--color-muted)' }}>{'±'}</span>{fp}</li>
              ))}
            </ul>
          </div>
        )}
        {['components','interfaces','constraints','acceptance_criteria','tasks','milestones','items'].map(k => Array.isArray(data[k]) && data[k].length > 0 ? (
          <div key={k}><SectionLabel size="lbl">{k.replace('_', ' ')}</SectionLabel><MO_List items={data[k]} glyph={'•'} /></div>
        ) : null)}
        {data.agent_guardrail && <Guardrail guardrail={data.agent_guardrail} />}
      </>)}

      {Object.keys(extra).length > 0 && (
        <details style={{ color: 'var(--color-text-dim)' }}>
          <summary style={{ cursor: 'pointer', fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>altri campi</summary>
          <pre style={{ marginTop: '4px', whiteSpace: 'pre-wrap', borderRadius: 'var(--radius-sm)', background: 'var(--color-bg)', padding: 'var(--space-2)', fontSize: 'var(--text-10)', fontFamily: 'var(--font-mono)' }}>{JSON.stringify(extra, null, 2)}</pre>
        </details>
      )}
    </div>
  );
}
const PHASE_COLS = [
  { key: 'requirements', label: 'Req' },
  { key: 'specification', label: 'Spec' },
  { key: 'development', label: 'Dev' },
  { key: 'test_design', label: 'T.Des' },
  { key: 'test_execution', label: 'Test' },
  { key: 'deployment', label: 'Dep' },
];
const PB_LEVEL_ICON = { epic: '◆', story: '▪', task: '·' };
const PB_ROLLUP_PRIO = ['tollgate', 'blocked', 'iterating', 'pending', 'accepted'];
const PB_CELL_FILTERS = [
  { value: 'all', label: '—' },
  { value: 'accepted', label: '✓' },
  { value: 'tollgate', label: '⚠' },
  { value: 'iterating', label: '◐' },
  { value: 'blocked', label: '⛔' },
  { value: 'pending', label: '·' },
];

function rollupCells(node) {
  if (node.cells) return node.cells;
  const tasks = [];
  const collect = n => { if (n.cells) tasks.push(n); (n.children || []).forEach(collect); };
  collect(node);
  const out = {};
  for (const c of PHASE_COLS) {
    const states = tasks.map(t => t.cells[c.key]);
    out[c.key] = PB_ROLLUP_PRIO.find(p => states.includes(p)) || 'pending';
  }
  return out;
}

const pbDepsText = node => (node.deps || []).join(' ');

function filterTree(roots = [], filters = {}) {
  const name = (filters.name || '').trim().toLowerCase();
  const deps = (filters.deps || '').trim().toLowerCase();
  const planned = (filters.planned || '').trim().toLowerCase();
  const cells = filters.cells || {};
  const activeCells = Object.keys(cells).filter(k => cells[k] && cells[k] !== 'all');
  if (!name && !deps && !planned && !activeCells.length) return roots;

  const matches = n => {
    const hay = (n.title + ' ' + n.code + ' ' + (n.description || '')).toLowerCase();
    if (name && !hay.includes(name)) return false;
    if (deps && !pbDepsText(n).toLowerCase().includes(deps)) return false;
    if (planned && !((n.sprint || '') + ' ' + (n.planned || '')).toLowerCase().includes(planned)) return false;
    const c = rollupCells(n);
    return activeCells.every(k => c[k] === cells[k]);
  };
  const keep = n => {
    const kids = (n.children || []).map(keep).filter(Boolean);
    if (kids.length) return { ...n, children: kids };
    return matches(n) ? { ...n, children: undefined } : null;
  };
  return roots.map(keep).filter(Boolean);
}

function flattenTree(roots = [], expanded = new Set()) {
  const rows = [];
  const walk = (ns, depth) => ns.forEach(n => {
    const hasChildren = !!(n.children && n.children.length);
    const isOpen = expanded.has(n.id);
    rows.push({ node: n, depth, hasChildren, expanded: isOpen });
    if (hasChildren && isOpen) walk(n.children, depth + 1);
  });
  walk(roots, 0);
  return rows;
}

const PB_th = { position: 'sticky', top: 0, zIndex: 10, background: 'var(--color-bg)', padding: '6px 8px', fontWeight: 500, fontSize: 'var(--text-xs)', color: 'var(--color-text-dim)' };
const PB_thFilter = { position: 'sticky', top: 26, zIndex: 10, background: 'var(--color-bg)', padding: '0 8px 6px', borderBottom: '1px solid var(--color-border)' };

function PB_FilterInput({ value, onChange, placeholder }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <input value={value || ''} placeholder={placeholder}
      onChange={e => onChange(e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
      style={{
        width: '100%', padding: '2px 6px', borderRadius: 'var(--radius-sm)', outline: 'none',
        border: '1px solid ' + (focus ? 'var(--color-accent)' : 'var(--color-border)'),
        background: 'var(--color-surface-2)', color: 'var(--color-text)',
        fontFamily: 'var(--font-sans)', fontSize: 'var(--text-11)',
      }} />
  );
}

function ProjectBoard({ projects = [], projectId, onProject, tree = [], expanded, onToggle, selected, onSelect, onHistory, epicId, onEpic }) {
  const proj = projects.find(p => p.id === projectId) || projects[0];
  const epics = tree.filter(n => n.level === 'epic');
  const epic = epicId ? epics.find(e => e.id === epicId) : null;
  const scopedTree = epic ? (epic.children || []) : tree;
  const [filters, setFilters] = React.useState({ name: '', deps: '', planned: '', cells: {} });
  const setF = (k, v) => setFilters(f => ({ ...f, [k]: v }));
  const setCell = (k, v) => setFilters(f => ({ ...f, cells: { ...f.cells, [k]: v } }));
  const filtering = !!(filters.name || filters.deps || filters.planned || Object.values(filters.cells).some(v => v && v !== 'all'));
  const filtered = filterTree(scopedTree, filters);
  const allIds = new Set();
  (function walk(ns) { ns.forEach(n => { allIds.add(n.id); if (n.children) walk(n.children); }); })(filtered);
  const rows = flattenTree(filtered, filtering ? allIds : (expanded || new Set()));

  return (
    <div style={{ position: 'relative', display: 'flex', height: '100%', flexDirection: 'column', padding: 'var(--space-4)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
        <Select value={projectId} onChange={v => { onProject && onProject(v); onEpic && onEpic(''); }} options={projects.map(p => ({ value: p.id, label: p.name }))} />
        {epics.length > 0 && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>
            {'▸'}
            <Select size="sm" value={epicId || ''} onChange={v => onEpic && onEpic(v)}
              options={[{ value: '', label: 'tutti gli epic (' + epics.length + ')' }, ...epics.map(e => ({ value: e.id, label: e.code + ' — ' + e.title }))]} />
          </span>
        )}
        {epic && (
          <button type="button" onClick={() => onEpic && onEpic('')}
            style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-11)', color: 'var(--color-accent-dim)', textDecoration: 'underline' }}>
            {'↑ torna al progetto'}
          </button>
        )}
        {proj && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-dim)' }}>{proj.sprint + ' · target ' + proj.target_date}</span>}
        {proj && (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Chip>{proj.kpi.nodes + ' nodi'}</Chip>
            <Chip color="var(--color-fsm-human-pending)">{'⚠ ' + proj.kpi.tollgate_open}</Chip>
            <Chip color="var(--color-fsm-blocked)">{'⛔ ' + proj.kpi.blocked}</Chip>
            <Chip color="var(--color-fsm-approved)">{'✓ ' + proj.kpi.done}</Chip>
          </div>
        )}
      </div>

      {proj && <div style={{ marginBottom: 'var(--space-3)' }}><ProgressBar pct={proj.progress_pct} /></div>}

      <div style={{ minHeight: 0, flex: 1, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-xs)' }}>
          <thead>
            <tr>
              <th style={{ ...PB_th, textAlign: 'left', paddingLeft: 0 }}>{epic ? 'Story / Task — ' + epic.code : 'Epic / Story / Task'}</th>
              {PHASE_COLS.map(c => <th key={c.key} style={{ ...PB_th, textAlign: 'center' }}>{c.label}</th>)}
              <th style={{ ...PB_th, textAlign: 'left' }}>Dipendenze</th>
              <th style={{ ...PB_th, textAlign: 'left' }}>Pianificato</th>
            </tr>
            <tr>
              <td style={{ ...PB_thFilter, paddingLeft: 0, minWidth: 220 }}>
                <PB_FilterInput value={filters.name} onChange={v => setF('name', v)} placeholder="nome, codice o descrizione…" />
              </td>
              {PHASE_COLS.map(c => (
                <td key={c.key} style={{ ...PB_thFilter, textAlign: 'center' }}>
                  <Select size="sm" value={filters.cells[c.key] || 'all'} onChange={v => setCell(c.key, v)} options={PB_CELL_FILTERS} />
                </td>
              ))}
              <td style={{ ...PB_thFilter, minWidth: 130 }}>
                <PB_FilterInput value={filters.deps} onChange={v => setF('deps', v)} placeholder="dipendenza…" />
              </td>
              <td style={{ ...PB_thFilter, minWidth: 110 }}>
                <PB_FilterInput value={filters.planned} onChange={v => setF('planned', v)} placeholder="sprint o data…" />
              </td>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => {
              const cells = rollupCells(r.node);
              const active = r.node.id === selected;
              return (
                <tr key={r.node.id} onClick={() => onSelect && onSelect(r.node.id)}
                  style={{ cursor: 'pointer', borderTop: '1px solid var(--border-hairline-soft)', background: active ? 'var(--color-surface-2)' : 'transparent' }}>
                  <td style={{ padding: '6px 12px 6px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingLeft: r.depth * 16 }}>
                      <span onClick={e => { e.stopPropagation(); r.hasChildren && onToggle && onToggle(r.node.id); }}
                        style={{ width: 12, color: 'var(--color-muted)' }}>{r.hasChildren ? (r.expanded ? '▾' : '▸') : ''}</span>
                      <span style={{ color: 'var(--color-muted)' }}>{PB_LEVEL_ICON[r.node.level]}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-11)', color: 'var(--color-text-dim)' }}>{r.node.code}</span>
                      <span style={{ fontWeight: r.node.level === 'epic' ? 600 : 400, color: r.node.level === 'epic' ? 'var(--color-accent)' : 'var(--color-text)' }}>{r.node.title}</span>
                      <span title="History" onClick={e => { e.stopPropagation(); onHistory && onHistory(r.node.id); }}
                        style={{ color: 'var(--color-muted)', display: 'flex', cursor: 'pointer' }}><Icon name="history" size={12} /></span>
                    </div>
                  </td>
                  {PHASE_COLS.map(c => (
                    <td key={c.key} style={{ padding: '6px 8px', textAlign: 'center' }}>
                      <StateCell state={cells[c.key]} rollup={r.node.level !== 'task'} />
                    </td>
                  ))}
                  <td style={{ padding: '6px 8px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-10)', color: 'var(--color-text-dim)' }}>
                    {(r.node.deps || []).length
                      ? r.node.deps.join(', ')
                      : <span style={{ color: 'var(--color-muted)' }}>—</span>}
                  </td>
                  <td style={{ padding: '6px 8px', color: 'var(--color-text-dim)' }}>
                    {r.node.planned && <span>{(r.node.sprint || '') + ' ' + r.node.planned}</span>}
                    {r.node.slip && <span title="slip" style={{ marginLeft: 4, color: 'var(--color-fsm-rejected)' }}>{'⚑'}</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: '4px', display: 'flex', gap: 'var(--space-2)', fontSize: 'var(--text-10)', color: 'var(--color-muted)' }}>
        {filtering && (
          <span style={{ display: 'flex', gap: 6, color: 'var(--color-text-dim)' }}>
            {rows.length + ' righe filtrate'}
            <button type="button" onClick={() => setFilters({ name: '', deps: '', planned: '', cells: {} })}
              style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', fontSize: 'var(--text-10)', color: 'var(--color-accent-dim)', textDecoration: 'underline', fontFamily: 'var(--font-sans)' }}>azzera</button>
          </span>
        )}
        {'✓ accettata · ⚠ tollgate · ◐ in loop · ⛔ bloccata · · da fare — epic/story = rollup dei figli'}
      </div>
    </div>
  );
}

function HistoryDrawer({ nodeId, items = [], phases = ['all'], phaseFilter = 'all', onPhaseFilter, onClose, gapNotice, inline = false, error }) {
  const HD_STATUS_TO_CELL = {
    accepted: 'accepted', conflict: 'blocked', aborted: 'blocked',
    human_pending: 'tollgate', maker_running: 'iterating', adversarial_running: 'iterating', pending: 'pending',
  };
  const frame = inline
    ? { position: 'relative', flexShrink: 0, width: 'var(--drawer-width)', height: '100%' }
    : { position: 'absolute', right: 0, top: 0, zIndex: 20, height: '100%', width: 'var(--drawer-width)', boxShadow: 'var(--shadow-drawer)' };
  return (
    <aside style={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--color-border)', background: 'var(--color-surface)', ...frame }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', borderBottom: '1px solid var(--color-border)', padding: '8px 12px' }}>
        <Icon name="history" size={14} style={{ color: 'var(--color-muted)' }} />
        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text)' }}>History nodo</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-10)', color: 'var(--color-text-dim)' }}>{nodeId}</span>
        <button type="button" onClick={onClose} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', display: 'flex' }}>
          <Icon name="x" size={14} />
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', borderBottom: '1px solid var(--color-border)', padding: '6px 12px', fontSize: 'var(--text-11)' }}>
        <span style={{ color: 'var(--color-text-dim)' }}>Fase:</span>
        <Select size="sm" value={phaseFilter} onChange={onPhaseFilter} options={phases} />
      </div>

      <div style={{ minHeight: 0, flex: 1, overflow: 'auto', padding: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {error && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-fsm-rejected)' }}>{error}</div>}
        {items.length === 0 && !error && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-dim)' }}>Nessuna history disponibile per questo nodo.</div>}
        {items.map((item, i) => (
          <div key={i} style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline-soft)', padding: 'var(--space-2)', fontSize: 'var(--text-11)' }}>
            {item.kind === 'cycle_run' ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <StateCell state={HD_STATUS_TO_CELL[item.status] || 'pending'} size={16} />
                  <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{item.phase}</span>
                  <span style={{ color: 'var(--color-text-dim)' }}>{item.status}</span>
                  <span style={{ marginLeft: 'auto', color: 'var(--color-text-dim)' }}>{'it. ' + item.iteration_count + '/' + item.max_iterations}</span>
                </div>
                <div style={{ marginTop: '2px', color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)' }}>{item.ts}</div>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-accent)' }}>{item.author_role}</span>
                  <span style={{ color: 'var(--color-text-dim)' }}>{item.entry_type}</span>
                  {item.pinned && <span style={{ color: 'var(--color-fsm-human-pending)' }}>pinned</span>}
                </div>
                <div style={{ marginTop: '2px', fontWeight: 500, color: 'var(--color-text)' }}>{item.title}</div>
                <div style={{ marginTop: '2px', color: 'var(--color-text-dim)' }}>{item.body}</div>
              </>
            )}
          </div>
        ))}
        {gapNotice && (
          <div style={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--color-muted)', padding: 'var(--space-2)', fontSize: 'var(--text-11)', color: 'var(--color-text-dim)' }}>
            <span style={{ color: 'var(--color-muted)' }}>{'○ '}</span>{gapNotice}
          </div>
        )}
      </div>
    </aside>
  );
}
function ThemeToggle({ theme = 'dark', onChange }) {
  const opts = [
    { id: 'dark', icon: 'moon', title: 'Tema scuro' },
    { id: 'light', icon: 'sun', title: 'Tema chiaro' },
  ];
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 2, border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 2 }}>
      {opts.map(o => {
        const on = o.id === theme;
        return (
          <button key={o.id} type="button" title={o.title} onClick={() => onChange && onChange(o.id)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 22, height: 20, border: 'none', cursor: 'pointer',
              borderRadius: 'var(--radius-sm)',
              background: on ? 'var(--color-surface-2)' : 'transparent',
              color: on ? 'var(--color-accent)' : 'var(--color-muted)',
            }}>
            <Icon name={o.icon} size={13} />
          </button>
        );
      })}
    </div>
  );
}

function TopHeader({ logoSrc, product = 'NAEG', subtitle = 'Nitens Agent Execution Graph', pendingCount = 0, operator, role, onLogin, onLogout, onReport, onBell, theme, onTheme }) {
  return (
    <header style={{
      display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
      borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface)',
      padding: '0 var(--space-4)', height: 'var(--spacing-topnav)', flexShrink: 0,
    }}>
      {logoSrc
        ? <img src={logoSrc} alt="Nitens" style={{ height: 24, width: 24, display: 'block' }} />
        : <span style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-accent)' }}>NITENS</span>}
      <span style={{ fontSize: 'var(--text-lg)', fontWeight: 700, letterSpacing: 'var(--tracking-tight)', color: 'var(--color-accent)' }}>{product}</span>
      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>{subtitle}</span>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        {onReport && (
          <button type="button" onClick={onReport} title="Segnala un problema (scaffold — SDK non ancora disponibile)"
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '3px 8px', fontSize: 'var(--text-11)', color: 'var(--color-text-dim)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
            <Icon name="message-square-warning" size={13} /> Segnala
          </button>
        )}
        <button type="button" onClick={onBell} title="Tollgate in attesa"
          style={{ position: 'relative', display: 'flex', alignItems: 'center', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-dim)' }}>
          <Icon name="bell" size={18} />
          {pendingCount > 0 && (
            <span style={{
              position: 'absolute', right: -8, top: -8, display: 'flex', height: 16, minWidth: 16,
              alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-pill)',
              background: 'var(--color-fsm-human-pending)', padding: '0 4px',
              fontSize: 'var(--text-10)', fontWeight: 700, color: 'var(--on-state)',
            }}>{pendingCount}</span>
          )}
        </button>
        {operator ? (
          <>
            <span title={operator} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-xs)', color: 'var(--color-text-dim)', whiteSpace: 'nowrap' }}>
              <span style={{ color: 'var(--color-fsm-approved)' }}>{'●'}</span>
              {operator}{role && <span style={{ color: 'var(--color-muted)' }}>{' · ' + role}</span>}
            </span>
            <Button variant="outline" size="sm" onClick={onLogout} title="Esci (termina la sessione)">Esci</Button>
          </>
        ) : (
          <Button variant="accent" size="md" onClick={onLogin} title="Accedi con OIDC (idp.nitens.ai)">Accedi</Button>
        )}
        {onTheme && <ThemeToggle theme={theme} onChange={onTheme} />}
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', lineHeight: 1, color: 'var(--color-accent)' }}>{'◆'}</span>
      </div>
    </header>
  );
}

const NAV_ITEMS = [
  { id: 'hub', label: 'Hub', icon: 'layout-list' },
  { id: 'flow', label: 'Cockpit', icon: 'git-branch' },
  { id: 'planner', label: 'Planner', icon: 'chart-gantt', comingSoon: 'In arrivo' },
  { id: 'terminal', label: 'Terminale', icon: 'terminal', comingSoon: 'Dipendenza NAP-4.1bis non sbloccata' },
  { id: 'settings', label: 'Impostazioni', icon: 'settings' },
];

function NavSidebar({ items = NAV_ITEMS, active, onSelect, width = 220, collapsed = false, onToggleCollapse }) {
  const w = collapsed ? 52 : width;
  return (
    <nav style={{
      display: 'flex', flexShrink: 0, flexDirection: 'column', gap: '4px',
      borderRight: '1px solid var(--color-border)', background: 'var(--color-sidebar)',
      padding: 'var(--space-2)', width: w,
    }}>
      {onToggleCollapse && (
        <button type="button" onClick={onToggleCollapse} title={collapsed ? 'Espandi menu' : 'Comprimi menu'}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start',
            gap: 'var(--space-2)', padding: '6px 10px', marginBottom: '2px', borderRadius: 'var(--radius-md)',
            border: 'none', background: 'transparent', cursor: 'pointer',
            fontFamily: 'var(--font-sans)', fontSize: 'var(--text-11)', color: 'var(--color-muted)',
          }}>
          <Icon name={collapsed ? 'panel-left-open' : 'panel-left-close'} size={15} />
          {!collapsed && 'Comprimi'}
        </button>
      )}
      {items.map(it => {
        const isActive = it.id === active;
        return (
          <button key={it.id} type="button" title={it.comingSoon || it.label}
            onClick={() => !it.comingSoon && onSelect && onSelect(it.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
              justifyContent: collapsed ? 'center' : 'flex-start',
              padding: '8px 10px', borderRadius: 'var(--radius-md)', border: 'none',
              fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', textAlign: 'left',
              cursor: it.comingSoon ? 'default' : 'pointer',
              opacity: it.comingSoon ? 'var(--coming-soon-opacity)' : 1,
              color: isActive ? 'var(--color-accent)' : 'var(--color-text-dim)',
              background: isActive ? 'var(--color-surface-2)' : 'transparent',
            }}>
            <Icon name={it.icon} size={16} />{!collapsed && it.label}
          </button>
        );
      })}
    </nav>
  );
}

function ViewTabs({ views = [], activeId, splitIds, onSelect, onClose, onAdd, onToggleSplit }) {
  const isSplit = !!splitIds;
  const visible = id => isSplit ? splitIds.includes(id) : id === activeId;
  const tab = active => ({
    display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px',
    borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer',
    fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)',
    color: active ? 'var(--color-accent)' : 'var(--color-text-dim)',
    background: active ? 'var(--color-surface-2)' : 'transparent',
  });
  return (
    <div style={{ display: 'flex', flexShrink: 0, alignItems: 'center', gap: '4px', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface)', padding: '4px 8px' }}>
      {views.map(v => (
        <button key={v.id} type="button" style={tab(visible(v.id))} onClick={() => onSelect && onSelect(v.id)}>
          <span>{v.label}</span>
          {views.length > 1 && (
            <span onClick={e => { e.stopPropagation(); onClose && onClose(v.id); }} style={{ opacity: 0.6, display: 'flex' }}><Icon name="x" size={12} /></span>
          )}
        </button>
      ))}
      <button type="button" title="Nuova vista" style={tab(false)} onClick={onAdd}><Icon name="plus" size={14} /></button>
      {views.length > 1 && (
        <button type="button" title="Split affiancato" style={{ ...tab(isSplit), marginLeft: 'auto' }} onClick={onToggleSplit}><Icon name="columns-2" size={14} /></button>
      )}
    </div>
  );
}

window.NitensCockpitDesignSystem_16befb = {
  Button, Chip, Icon, KpiTile, ProgressBar, SectionLabel, Select, StateCell, StatusBadge, TabBar, TextArea, TextInput,
  GapBanner, ClearanceNotice, PhaseStepper, FindingCard,
  TollgateDecision, LiveSessions, TerminalGate, GitPanel, PipelinePanel, KvPanel,
  NotificationsMenu, FeedbackPanel, CommentThread, ReadOnlyPanel, TerminalSessionsTable, TollgateQueue,
  MakerOutput, ProjectBoard, HistoryDrawer,
  ThemeToggle, TopHeader, NavSidebar, ViewTabs,
};
