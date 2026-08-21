// Dati dimostrativi (non reali) — struttura e valori ripresi da cockpit-v2 src/mock.ts.
const C = (r,s,d,td,te,dp) => ({requirements:r,specification:s,development:d,test_design:td,test_execution:te,deployment:dp});

window.CockpitData = {
  operator: 'm.campi@nitens.ai',
  role: 'developer',
  projects: [
    { id:'apam', name:'APAM — Agentic PAM', code:'E04', sprint:'Sprint 3', target_date:'2026-06-30', progress_pct:46, kpi:{nodes:11,tollgate_open:2,blocked:2,done:1} },
    { id:'fleet', name:'Fleet Control', code:'E07', sprint:'Sprint 1', target_date:'2026-07-15', progress_pct:22, kpi:{nodes:3,tollgate_open:0,blocked:0,done:0} },
    { id:'pronex', name:'ProNex AEC', code:'E09', sprint:'Backlog', target_date:'2026-08-01', progress_pct:5, kpi:{nodes:2,tollgate_open:0,blocked:0,done:0} },
  ],
  trees: {
    apam: [{ id:'e04', code:'E04', title:'APAM — Agentic PAM', level:'epic', status:'agent_running', children:[
      { id:'s03', code:'E04.S03', title:'Autenticazione OTP', level:'story', status:'human_pending', children:[
        { id:'n-store', seq_id:'N260018', code:'E04.S03.T01', title:'Storage segreti TOTP', level:'task', status:'children_pending_review', description:'Vault dei segreti TOTP con cifratura a riposo.', deps:['N260018'], cells:C('accepted','accepted','accepted','accepted','accepted','pending'), sprint:'S3', planned:'06-10→06-16' },
        { id:'n-otp', seq_id:'N260042', code:'E04.S03.T02', title:'Autenticazione OTP per-progetto', level:'task', status:'human_pending', description:'Verifica TOTP scoped per progetto, con rate-limit.', deps:['N260018','N260021'], cells:C('accepted','accepted','tollgate','pending','pending','pending'), sprint:'S3', planned:'06-12→06-20', slip:true },
        { id:'n-rot', seq_id:'N260051', code:'E04.S03.T03', title:'Rotazione segreti', level:'task', status:'agent_running', description:'Strategia di rotazione del secret con audit.', deps:['N260042'], cells:C('accepted','iterating','pending','pending','pending','pending'), sprint:'S3', planned:'06-16→06-24' },
      ]},
      { id:'s04', code:'E04.S04', title:'UI & Audit', level:'story', status:'ready', deps:['E04.S03'], children:[
        { id:'n-ui', seq_id:'N260060', code:'E04.S04.T01', title:'UI login OTP', level:'task', status:'ready', description:'Schermata di login con inserimento OTP.', deps:['N260042'], cells:C('iterating','pending','pending','pending','pending','pending'), sprint:'S4', planned:'06-20→06-28' },
        { id:'n-audit', seq_id:'N260055', code:'E04.S04.T02', title:'Audit log accessi', level:'task', status:'blocked', description:'Log immutabile degli accessi con hash-chain.', deps:['N260060'], cells:C('blocked','pending','pending','pending','pending','pending'), sprint:'S4', planned:'06-22→06-30', slip:true },
      ]},
      { id:'s01', code:'E04.S01', title:'Provisioning agente', level:'story', status:'done', children:[
        { id:'n-prov', seq_id:'N260009', code:'E04.S01.T01', title:'Provisioning base', level:'task', status:'done', description:'Provisioning agente su progetto nuovo.', deps:[], cells:C('accepted','accepted','accepted','accepted','accepted','accepted'), sprint:'S2', planned:'06-02→06-09' },
      ]},
    ]},
    { id:'e05', code:'E05', title:'Osservabilità APAM', level:'epic', status:'agent_running', deps:['E04'], children:[
      { id:'e05s1', code:'E05.S01', title:'Metriche e tracing', level:'story', status:'agent_running', deps:['E04.S03'], children:[
        { id:'e05t1', seq_id:'N260071', code:'E05.S01.T01', title:'Esportatore OTLP', level:'task', status:'agent_running', description:'Traces e metriche verso il collector.', deps:['N260042'], cells:C('accepted','iterating','pending','pending','pending','pending'), sprint:'S4', planned:'06-22→06-30' },
        { id:'e05t2', seq_id:'N260072', code:'E05.S01.T02', title:'Dashboard latenza OTP', level:'task', status:'ready', description:'Pannello latenza verifica OTP.', deps:['N260071'], cells:C('iterating','pending','pending','pending','pending','pending'), sprint:'S5', planned:'07-01→07-06' },
      ]},
      { id:'e05s2', code:'E05.S02', title:'Allerta e soglie', level:'story', status:'draft', deps:['E05.S01'], children:[
        { id:'e05t3', seq_id:'N260080', code:'E05.S02.T01', title:'Soglie su errori OTP', level:'task', status:'draft', description:'Allerta su tasso di errore verifica.', deps:['N260072'], cells:C('pending','pending','pending','pending','pending','pending'), sprint:'Backlog', planned:'—' },
      ]},
    ]},
    { id:'e06', code:'E06', title:'Hardening & audit', level:'epic', status:'human_pending', deps:['E04'], children:[
      { id:'e06s1', code:'E06.S01', title:'Hash-chain eventi', level:'story', status:'human_pending', deps:['E04.S04'], children:[
        { id:'e06t1', seq_id:'N260091', code:'E06.S01.T01', title:'Catena hash append-only', level:'task', status:'human_pending', description:'Eventi con hash-chain verificabile.', deps:['N260055'], cells:C('accepted','accepted','tollgate','pending','pending','pending'), sprint:'S4', planned:'06-20→06-27', slip:true },
        { id:'e06t2', seq_id:'N260092', code:'E06.S01.T02', title:'Tool di verifica catena', level:'task', status:'blocked', description:'CLI di verifica integrità.', deps:['N260091'], cells:C('accepted','blocked','pending','pending','pending','pending'), sprint:'S5', planned:'06-28→07-04' },
      ]},
    ]}],
    fleet: [{ id:'e07', code:'E07', title:'Fleet Control', level:'epic', status:'agent_running', children:[
      { id:'f-s1', code:'E07.S01', title:'Accesso remoto tsh', level:'story', status:'agent_running', children:[
        { id:'f-t1', code:'E07.S01.T01', title:'SPIKE tsh SSH', level:'task', status:'agent_running', description:'Prova di connessione tsh via Teleport.', deps:['NAP-4.1bis (bloccante)'], cells:C('accepted','iterating','pending','pending','pending','pending'), sprint:'S1', planned:'07-01→07-08' },
        { id:'f-t2', code:'E07.S01.T02', title:'Service portal req', level:'task', status:'ready', description:'Requisiti del portale di servizio.', deps:[], cells:C('iterating','pending','pending','pending','pending','pending'), sprint:'S1', planned:'07-05→07-12' },
      ]},
    ]}],
    pronex: [{ id:'e09', code:'E09', title:'ProNex AEC', level:'epic', status:'draft', children:[
      { id:'p-s1', code:'E09.S01', title:'Copilot OOS-8', level:'story', status:'draft', children:[
        { id:'p-t1', code:'E09.S01.T01', title:'Spec copilot', level:'task', status:'draft', description:'Specifica del copilot OOS-8.', deps:[], cells:C('pending','pending','pending','pending','pending','pending'), sprint:'Backlog', planned:'—' },
      ]},
    ]}],
  },
  flow: {
    node: { id:'n-otp', seq_id:'N260042', code:'E04.S03.T02', seq_id:'N260042', node_type:'task', title:'Autenticazione OTP per-progetto (APAM)', status:'human_pending', epic_title:'APAM — Agentic PAM', deps:['N260018 (vault TOTP)','N260021 (IdP)'] },
    phases: [
      { phase:'requirements', label:'Requisiti', derived_status:'accepted', runs:[{run_id:'r1',status:'accepted',iteration_count:1,max_iterations:3,iterations:[{index:0,outcome:'accepted',adversarial:{observation_count:0,severity_max:'none'},maker_output:{title:'Requisiti OTP per-progetto',description:'Autenticazione a fattore singolo TOTP, scoped per progetto.',acceptance_criteria:['AC-01 Segreto per progetto: ogni progetto ha un segreto TOTP distinto — falsificabile: due progetti non condividono mai lo stesso secret.','AC-02 Nessun secret nei log: nessun livello di log contiene il secret — falsificabile: grep sui log di test.'],risks:[{risk:'Brute force sulla verifica',mitigation:'rate-limit per identità e IP'}],definition_of_done:['Test di rotazione verdi','Audit log popolato']}}]}] },
      { phase:'specification', label:'Specifica', derived_status:'accepted', runs:[{run_id:'r2',status:'accepted',iteration_count:2,max_iterations:3,iterations:[
        {index:0,outcome:'rejected',adversarial:{observation_count:2,severity_max:'medium',findings:[{severity:'medium',title:'agent_guardrail incompleto',description:'network_allowlist mancante per il provider TOTP.',evidence_ref:'spec §3'}]},maker_output:{overview:'Estensione del modulo auth con verifica TOTP per-progetto. VERIFICA TECNICA: pyotp già in dipendenza.',components:[{name:'auth.otp',type:'extend_existing',description:'verifica e rotazione del secret'},{name:'auth.audit',type:'new_module',description:'log delle verifiche'}],interfaces:[{name:'POST /api/v1/auth/otp/verify (RICONFERMATO ESISTENTE)'}],constraints:['INVARIATO: nessun secret in chiaro a riposo','NUOVO: rate-limit 5/min per identità'],acceptance_criteria:['S-AC-01 rotazione verificabile da audit log'],agent_guardrail:{tool_whitelist:['aeg.phase.start','aeg.req.create'],filesystem_scope:['auth/'],forbidden_actions:['network egress non in allowlist'],network_allowlist:['idp.nitens.ai']}}},
        {index:1,outcome:'accepted',adversarial:{observation_count:0,severity_max:'none'},maker_output:{overview:'Rework accettato: network_allowlist esplicitata.',components:[{name:'auth.otp',type:'extend_existing',description:'verifica e rotazione del secret'}],constraints:['AGGIORNATO: network_allowlist dichiarata']}},
      ]}] },
      { phase:'development', label:'Sviluppo', derived_status:'tollgate', runs:[{run_id:'r3',status:'conflict',iteration_count:3,max_iterations:3,
        conflict_summary:"Maker e Avversariale non convergono dopo 3 iterazioni sul punto della rotazione segreti TOTP:\n- Maker propone rotazione lazy on-read.\n- Avversariale richiede rotazione attiva con audit (SEC).\nEscalation all'umano: decidere il trade-off sicurezza/complessità.",
        iterations:[
          {index:0,outcome:'rejected',adversarial:{observation_count:3,severity_max:'high',findings:[{severity:'high',title:'Segreto TOTP loggato',description:'Il secret appare nei log a livello DEBUG.',evidence_ref:'auth/otp.py:88'},{severity:'medium',title:'Nessun rate-limit',description:'Verifica OTP senza throttling → brute force.',evidence_ref:'auth/otp.py:120'}]},maker_output:{branch:'aeg/apam/dev/otp',commit_sha:'a91f3c8d41',files_changed:['auth/otp.py','auth/models.py'],implementation_summary:'Implementata verifica OTP base con pyotp.'}},
          {index:1,outcome:'rejected',adversarial:{observation_count:1,severity_max:'high',findings:[{severity:'high',title:'Rotazione segreti assente',description:'Nessuna strategia di rotazione del secret TOTP.',evidence_ref:'auth/otp.py'}]},maker_output:{branch:'aeg/apam/dev/otp',commit_sha:'b04ee12ac9',files_changed:['auth/otp.py'],implementation_summary:'Aggiunto rate-limit + rimosso log del secret.'}},
          {index:2,outcome:'conflict',adversarial:{observation_count:1,severity_max:'high',findings:[{severity:'high',title:'Disaccordo su strategia rotazione',description:'Lazy vs attiva — richiede decisione umana.',evidence_ref:'debate'}]},maker_output:{branch:'aeg/apam/dev/otp',commit_sha:'c7712fe003',files_changed:['auth/otp.py'],implementation_summary:'Proposta rotazione lazy on-read.'}},
        ]}] },
      { phase:'test_design', label:'Prog. test', derived_status:'pending', runs:[] },
      { phase:'test_execution', label:'Testing', derived_status:'pending', runs:[] },
      { phase:'deployment', label:'Deploy', derived_status:'pending', runs:[] },
    ],
    coverage: { req_fulfillment_pct:66, items:[{code:'REQ-APAM-3.1',status:'spec_fulfilled'},{code:'REQ-APAM-3.2',status:'spec_partial'},{code:'REQ-APAM-7.4',status:'pending'}] },
    tollgate: { phase:'development', dwell_time_min:40, approval_version:1, approvals:[{decision:'reject',actor:'l.rossi',at:'18/06 06:12'}], human_pending_at:'2026-06-18T06:30:00Z' },
    session_summary: { agent_id:'AGT-01', model_id:'claude-opus-4-8', cost_usd:0.42, duration_sec:320 },
  },
  queue: [
    { node_id:'n-otp', code:'E04.S03.T02', title:'Autenticazione OTP per-progetto', status:'human_pending', phase:'development', project:'APAM — Agentic PAM', waiting_since:'2026-06-18T06:30:00Z', waiting_label:'in attesa 3h 12m', dwell_ready:true },
    { node_id:'f-t1', code:'E07.S01.T01', title:'SPIKE tsh SSH', status:'merge_conflict', phase:'specification', project:'Fleet Control', waiting_since:'2026-06-18T08:55:00Z', waiting_label:'in attesa 47m', dwell_ready:true },
    { node_id:'n-audit', code:'E04.S04.T02', title:'Audit log accessi', status:'deadlock_human_pending', phase:'requirements', project:'APAM — Agentic PAM', waiting_since:'2026-06-18T09:20:00Z', waiting_label:'in attesa 22m', dwell_ready:false },
  ],
  hub: {
    stats: { nodes_total:6, tollgate_open:1, sessions_active:1, projects:3, requirements:12, nodes_by_status:{blocked:1},
      usage:{tokens_in:120000,tokens_out:45000,cycles:8,iterations:14,outcomes:{accepted:6,rejected:5,conflict:3}},
      recent_iterations:[
        {node_code:'E04.S03.T02',node_title:'Autenticazione OTP',node_id:'n-otp',phase:'development',index:2,outcome:'conflict',at:'2026-06-18T06:30:00Z'},
        {node_code:'E04.S03.T03',node_title:'Rotazione segreti',node_id:'n-rot',phase:'specification',index:0,outcome:'rejected',at:'2026-06-18T06:10:00Z'},
        {node_code:'E04.S03.T01',node_title:'Storage segreti TOTP',node_id:'n-store',phase:'test_execution',index:0,outcome:'accepted',at:'2026-06-18T05:50:00Z'},
      ] },
    dimensions: [
      {code:'SEC',label:'Security',scope:'universal',severity:'critical'},
      {code:'GDPR',label:'Privacy / GDPR',scope:'universal',severity:'high'},
      {code:'CON',label:'Consistency',scope:'universal',severity:'medium'},
      {code:'API',label:'API contract',scope:'universal',severity:'high'},
      {code:'OPS',label:'Operability',scope:'universal',severity:'medium'},
      {code:'SCA',label:'Scalability',scope:'universal',severity:'medium'},
      {code:'NAEG',label:'NAEG readiness',scope:'naeg',severity:'high'},
    ],
    tools: [
      {fqn:'aeg.phase.start',scope:'aeg.node.write',description:'Avvia una fase del ciclo'},
      {fqn:'aeg.phase.adversarial_submit',scope:'aeg.review.write',description:'Sottometti review avversariale'},
      {fqn:'aeg.req.create',scope:'aeg.req.write',description:'Crea requisito (draft)'},
      {fqn:'aeg.audit.verify_chain',scope:'aeg.audit.read',description:'Verifica hash-chain eventi'},
    ],
  },
  history: [
    { kind:'cycle_run', ts:'2026-06-18T06:30:00Z', phase:'development', status:'conflict', iteration_count:3, max_iterations:3 },
    { kind:'story', ts:'2026-06-18T06:12:00Z', author_role:'human:tech_lead', entry_type:'decision', title:'Rifiutata iterazione #1', body:'Serve strategia di rotazione esplicita, non lazy.' },
    { kind:'cycle_run', ts:'2026-06-17T18:04:00Z', phase:'specification', status:'accepted', iteration_count:2, max_iterations:3 },
    { kind:'story', ts:'2026-06-17T17:40:00Z', author_role:'agent:maker', entry_type:'note', title:'network_allowlist esplicitata', body:'Aggiunto idp.nitens.ai al guardrail.', pinned:true },
  ],
  events: [
    { created_at:'2026-06-18T09:42:11Z', event_type:'status_transition', to:'human_pending' },
    { created_at:'2026-06-18T09:41:02Z', event_type:'adversarial_submitted' },
    { created_at:'2026-06-18T09:38:55Z', event_type:'maker_output_written' },
    { created_at:'2026-06-18T09:20:31Z', event_type:'phase_started' },
  ],
  comments: [
    { id:'c1', author:'m.campi', created_at:'2026-06-18T07:02:11', body:'Rotazione lazy accettabile solo se l\'audit registra ogni read.' },
    { id:'c2', author:'l.rossi', created_at:'2026-06-18T06:44:00', body:'Concordo. SEC chiede evidenza nel log.' },
  ],
  feedback: [
    { id:'f1', body:'Il countdown dwell non è visibile su schermo stretto.', status:'open' },
    { id:'f2', body:'Permalink dal commento funziona.', status:'resolved' },
  ],
  tokens: [
    { id:'t1', name:'laptop-personale', scopes:['aeg.node.read','aeg.review.write'], expires_at:'2026-11-14', created_at:'2026-08-16', last_used_at:'2026-08-21' },
    { id:'t2', name:'ci-runner', scopes:['aeg.audit.read'], expires_at:null, created_at:'2026-05-02', last_used_at:'2026-08-20' },
  ],
  sessions: {
    apam: [
      { id:'s1', owner:'m.campi@nitens.ai', required_role:'developer', project:'APAM — Agentic PAM', kind:'agent', agent_id:'AGT-01', node_code:'E04.S03.T03', activity:'Rework specifica rotazione segreti', phase:'specification', iteration:1, model_id:'claude-opus-4-8', duration:'4m 12s', status:'agent_running' },
      { id:'s2', owner:'l.rossi@nitens.ai', required_role:'tech_lead', project:'APAM — Agentic PAM', kind:'agent', agent_id:'AGT-04', node_code:'E04.S04.T01', activity:'Stesura requisiti UI login OTP', phase:'requirements', iteration:0, model_id:'claude-sonnet-4-8', duration:'1m 38s', status:'agent_running' },
      { id:'s3', owner:'orchestratore (servizio)', required_role:'tech_lead', project:'APAM — Agentic PAM', kind:'orchestrator', agent_id:'ORC-00', node_code:'E04', activity:'Attesa decisione umana su E04.S03.T02', phase:'development', iteration:2, model_id:'—', duration:'3h 12m', status:'human_pending' },
      { id:'s4', owner:'m.campi@nitens.ai', required_role:'developer', project:'APAM — Agentic PAM', kind:'orchestrator', agent_id:'SHP-01', node_code:'E04.S03.T01', activity:'Shepherd: esecuzione suite test storage TOTP', phase:'test_execution', iteration:0, model_id:'—', duration:'22s', status:'adversarial_in_progress' },
    ],
    fleet: [
      { id:'s5', owner:'g.bianchi@nitens.ai', required_role:'admin', project:'Fleet Control', kind:'agent', agent_id:'AGT-07', node_code:'E07.S01.T01', activity:'SPIKE connessione tsh', phase:'specification', iteration:0, model_id:'claude-sonnet-4-8', duration:'9m 04s', status:'agent_running' },
    ],
    pronex: [],
  },
  // Clearance: developer vede le proprie sessioni e quelle che richiedono developer;
  // tech_lead vede anche tech_lead; admin vede tutto.
  roles: ['developer', 'tech_lead', 'admin'],
  // Un tollgate nasce da un run, e il run gira in una sessione: la notifica
  // porta alla sessione aperta in cui il tollgate è emerso.
  notifications: [
    { id:'n1', node_id:'n-otp', node_code:'E04.S03.T02', title:'Autenticazione OTP per-progetto', status:'human_pending', project:'APAM — Agentic PAM', waiting_label:'in attesa 3h 12m', session_id:'s3', session_label:'ORC-00 (orchestratore)' },
    { id:'n2', node_id:'f-t1', node_code:'E07.S01.T01', title:'SPIKE tsh SSH', status:'merge_conflict', project:'Fleet Control', waiting_label:'in attesa 47m', session_id:'s5', session_label:'AGT-07' },
    { id:'n3', node_id:'n-audit', node_code:'E04.S04.T02', title:'Audit log accessi', status:'deadlock_human_pending', project:'APAM — Agentic PAM', waiting_label:'in attesa 22m' },
  ],
  // Tre letture dello stesso portafoglio, tenute separate per fonte.
  // La parte commerciale è dichiarata NON collegata: nessun numero inventato.
  commercialConnected: false,
  delivery: [
    { id:'apam', name:'APAM — Agentic PAM', sprint:'Sprint 3 · target 2026-06-30',
      tech:{ pct:46, done:1, tollgate:2, blocked:2, total:11, forecast_label:'18 (02-07)' },
      commercial:{ invoiced_pct:35, invoiced_label:'€ 42k fatturati', value_label:'€ 120k' },
      commitment:{ date:'2026-06-30', label:'Consegna APAM (Deal D-1042)', slip_days:2 } },
    { id:'fleet', name:'Fleet Control', sprint:'Sprint 1 · target 2026-07-15',
      tech:{ pct:22, done:0, tollgate:1, blocked:0, total:3, forecast_label:'12 (12-07)' },
      commercial:{ invoiced_pct:10, invoiced_label:'€ 8k fatturati', value_label:'€ 80k' },
      commitment:{ date:'2026-07-15', label:'Pilota Fleet (Deal D-1051)', slip_days:-3 } },
    { id:'pronex', name:'ProNex AEC', sprint:'Backlog · target 2026-08-01',
      tech:{ pct:5, done:0, tollgate:0, blocked:0, total:2, forecast_label:'n/d' },
      commercial:null, commitment:null },
  ],
  plan: {
    node_code:'E04.S03', start_label:'Sprint 3 · giorno 0 = 10-06', days:20,
    critical_path:['T-02','T-04','T-06','T-07'],
    tasks:[
      { id:'T-01', type:'I', title:'Schema storage segreti', start:0, effort_days:2, dependencies:[], assignee_type:'agent' },
      { id:'T-02', type:'A', title:'Verifica TOTP per-progetto', start:2, effort_days:4, dependencies:['T-01'], assignee_type:'agent' },
      { id:'T-03', type:'A', title:'Rate-limit e log sanitizzati', start:5, effort_days:2, dependencies:['T-02'], assignee_type:'agent' },
      { id:'T-04', type:'V', title:'Verifica avversariale sviluppo', start:6, effort_days:3, dependencies:['T-02'], assignee_type:'agent' },
      { id:'T-05', type:'A', title:'Rotazione segreti', start:9, effort_days:4, dependencies:['T-03'], assignee_type:'agent', blocked_on_external:true },
      { id:'T-06', type:'H', title:'Tollgate sviluppo', start:9, effort_days:1, dependencies:['T-04'], assignee_type:'human_gate' },
      { id:'T-07', type:'V', title:'Esecuzione test', start:11, effort_days:3, dependencies:['T-06'], assignee_type:'agent' },
      { id:'T-08', type:'H', title:'Tollgate deploy', start:15, effort_days:1, dependencies:['T-07'], assignee_type:'human_gate' },
    ],
    milestones:[
      { id:'M1', title:'Verifica OTP funzionante', day:6, items:['T-01','T-02','T-03'] },
      { id:'M2', title:'Sviluppo accettato', day:11, items:['T-04','T-06'] },
      { id:'M3', title:'Pronto per deploy', day:16, items:['T-07','T-08'] },
    ],
    hard_dates:[{ label:'Consegna cliente APAM (Deal, Odoo)', day:18 }],
    capacity:[
      { who:'AGT-01', load_pct:88 },
      { who:'AGT-04', load_pct:42 },
      { who:'operatori umani', load_pct:15 },
    ],
  },
  // Abilitazione ai progetti: è questa a decidere quali dati una persona vede.
  // L'admin non ha righe da spuntare: raggiunge tutto per definizione.
  memberships: {
    p1:['apam','fleet'],
    p2:['apam'],
    p3:['apam','fleet','pronex'],
    p4:['pronex'],
    p5:[],
  },
  currentPersonId: 'p1',
  people: [
    { id:'p1', name:'Matteo Campi', email:'m.campi@nitens.ai', idp_groups:['nitens-dev','nitens-techlead'], role_from_idp:'tech_lead', effective_role:'tech_lead', projects:['APAM — Agentic PAM','Fleet Control'], last_seen:'18/06 09:41' },
    { id:'p2', name:'Laura Rossi', email:'l.rossi@nitens.ai', idp_groups:['nitens-dev'], role_from_idp:'developer', effective_role:'tech_lead', override:{ role:'tech_lead', until:'20/06 18:00', by:'g.bianchi@nitens.ai' }, projects:['APAM — Agentic PAM'], last_seen:'18/06 09:12' },
    { id:'p3', name:'Giulio Bianchi', email:'g.bianchi@nitens.ai', idp_groups:['nitens-dev','nitens-admin'], role_from_idp:'admin', effective_role:'admin', projects:['APAM — Agentic PAM','Fleet Control','ProNex AEC'], last_seen:'18/06 08:55' },
    { id:'p4', name:'Sara Neri', email:'s.neri@nitens.ai', idp_groups:['nitens-dev'], role_from_idp:'developer', effective_role:'developer', projects:['ProNex AEC'], last_seen:'12/06 17:20' },
    { id:'p5', name:'Marco Verdi', email:'m.verdi@nitens.ai', idp_groups:[], role_from_idp:'developer', effective_role:'developer', projects:[], last_seen:'02/05 10:04', suspended:true },
  ],
  capabilities: [
    { id:'view_own', label:'Vedere i propri worker e sessioni' },
    { id:'view_all', label:'Vedere i worker di altri operatori', note:'le righe non coperte restano visibili ma redatte' },
    { id:'open_term', label:'Aprire il terminale di una sessione' },
    { id:'sign_tollgate', label:'Firmare un tollgate (approva / rifiuta)', note:'mai un agente: vincolo di sicurezza', locked_roles:['developer'] },
    { id:'override_tollgate', label:'Override di un tollgate', note:'bypassa il flusso normale, sempre nodo per nodo' },
    { id:'bulk_sign', label:'Firma multipla di tollgate' },
    { id:'kv_read', label:'Leggere le chiavi KV non segrete' },
    { id:'kv_reveal', label:'Rivelare un valore KV segreto', note:'ogni rivelazione va in audit' },
    { id:'kv_write', label:'Scrivere una chiave KV' },
    { id:'revoke_token', label:'Revocare un token MCP di un altro operatore' },
    { id:'manage_clearance', label:'Gestire la clearance altrui', note:'solo admin: nessuno si eleva da sé', locked_roles:['developer','tech_lead'] },
  ],
  grants: {
    view_own:['developer','tech_lead','admin'],
    view_all:['tech_lead','admin'],
    open_term:['developer','tech_lead','admin'],
    sign_tollgate:['tech_lead','admin'],
    override_tollgate:['admin'],
    bulk_sign:['tech_lead','admin'],
    kv_read:['developer','tech_lead','admin'],
    kv_reveal:['tech_lead','admin'],
    kv_write:['tech_lead','admin'],
    revoke_token:['admin'],
    manage_clearance:['admin'],
  },
  agentMessages: [
    { id:'m1', from:'orchestrator', to:'maker', phase:'development', iteration:0, at:'18/06 05:41', tokens:820, body:'Fase sviluppo avviata su E04.S03.T02. Guardrail: filesystem_scope auth/, network_allowlist idp.nitens.ai. Implementa la verifica TOTP per-progetto secondo la specifica accettata.' },
    { id:'m2', from:'maker', to:'adversarial', phase:'development', iteration:0, at:'18/06 05:58', tokens:4120, artifact_ref:'aeg/apam/dev/otp @a91f3c8', body:'Implementata verifica OTP con pyotp. Secret letto dal vault per progetto. Aggiunti test unitari sul path di verifica.' },
    { id:'m3', from:'adversarial', to:'maker', phase:'development', iteration:0, at:'18/06 06:04', tokens:2380, artifact_ref:'auth/otp.py:88', body:'Rifiutata. SEC: il secret compare nei log a livello DEBUG. SEC: verifica OTP senza throttling, esposta a brute force. Due rilievi bloccanti su tre osservazioni.' },
    { id:'m4', from:'maker', to:'adversarial', phase:'development', iteration:1, at:'18/06 06:12', tokens:3010, artifact_ref:'aeg/apam/dev/otp @b04ee12', body:'Rimosso il log del secret, aggiunto rate-limit 5/min per identità e IP.' },
    { id:'m5', from:'adversarial', to:'maker', phase:'development', iteration:1, at:'18/06 06:19', tokens:1740, body:'Rifiutata. Manca una strategia di rotazione del secret TOTP: senza rotazione il rilievo SEC resta aperto.' },
    { id:'m6', from:'maker', to:'adversarial', phase:'development', iteration:2, at:'18/06 06:26', tokens:2650, body:'Propongo rotazione lazy on-read: il secret viene rigenerato al primo accesso dopo la scadenza. Complessità contenuta, nessun job schedulato.' },
    { id:'m7', from:'adversarial', to:'orchestrator', phase:'development', iteration:2, at:'18/06 06:29', tokens:1980, body:'Non convergiamo. Richiedo rotazione attiva con audit: lazy on-read lascia finestre di validità non tracciate. Terza iterazione su tre: escalation.' },
    { id:'m8', from:'orchestrator', to:'human', phase:'development', iteration:2, at:'18/06 06:30', body:'Loop esaurito dopo 3 iterazioni. Decisione umana richiesta sul trade-off sicurezza/complessità nella rotazione dei segreti.' },
  ],
  agentEvents: [
    { id:'e1', at:'18/06 06:30:12', event_type:'status_transition', actor:'ORC-00', node_code:'E04.S03.T02', summary:'agent_running → human_pending', payload:{ from:'agent_running', to:'human_pending', reason:'max_iterations_reached' } },
    { id:'e2', at:'18/06 06:29:48', event_type:'adversarial_submitted', actor:'AGT-02', node_code:'E04.S03.T02', summary:'esito conflict, 1 osservazione, severità high', payload:{ outcome:'conflict', observation_count:1, severity_max:'high' } },
    { id:'e3', at:'18/06 06:26:03', event_type:'maker_output_written', actor:'AGT-01', node_code:'E04.S03.T02', summary:'branch aeg/apam/dev/otp @c7712fe, 1 file', payload:{ branch:'aeg/apam/dev/otp', commit_sha:'c7712fe0031a4', files_changed:['auth/otp.py'] } },
    { id:'e4', at:'18/06 06:19:31', event_type:'iteration_closed', actor:'ORC-00', node_code:'E04.S03.T02', summary:'iterazione #1 chiusa: rejected', payload:{ index:1, outcome:'rejected' } },
    { id:'e5', at:'18/06 06:12:07', event_type:'guardrail_check', actor:'ORC-00', node_code:'E04.S03.T02', summary:'nessuna violazione: scope auth/, egress consentito a idp.nitens.ai', payload:{ violations:[] } },
    { id:'e6', at:'18/06 05:41:00', event_type:'phase_started', actor:'ORC-00', node_code:'E04.S03.T02', summary:'fase development, max 3 iterazioni', payload:{ phase:'development', max_iterations:3 } },
    { id:'e7', at:'18/06 05:40:52', event_type:'kv_read', actor:'AGT-01', node_code:'E04.S03.T02', summary:'lette 4 chiavi apam/otp/*', payload:{ keys:['apam/otp/issuer','apam/otp/window_sec','apam/otp/rate_limit','apam/otp/totp_secret'] } },
  ],
  scraping: [
    { id:'sc1', name:'repo/aeg-core', kind:'repo', items:1284, kv_keys:37, last_run:'18/06 04:10', state:'ok' },
    { id:'sc2', name:'docs/apam-spec', kind:'docs', items:96, kv_keys:12, last_run:'17/06 22:05', state:'ok' },
    { id:'sc3', name:'forge/pr-comments', kind:'api', items:41, kv_keys:0, last_run:'16/06 09:30', state:'stale' },
    { id:'sc4', name:'idp.nitens.ai/schemas', kind:'api', items:0, kv_keys:0, last_run:'18/06 04:12', state:'failed', error:'401 dal provider: credenziale di lettura scaduta' },
  ],
  git: {
    branch:'aeg/apam/dev/otp', commit_sha:'c7712fe0031a4', base:'main', ahead:7, behind:2, dirty:true,
    files:[
      { path:'auth/otp.py', status:'M', added:184, removed:22 },
      { path:'auth/models.py', status:'M', added:31, removed:4 },
      { path:'auth/audit.py', status:'A', added:96, removed:0 },
      { path:'auth/legacy_otp.py', status:'D', added:0, removed:118 },
    ],
    pr:{ id:'#412', state:'open', checks:'2/3' },
  },
  pipelines: [
    { id:'ci-2841', branch:'aeg/apam/dev/otp', commit_sha:'c7712fe0031a4', status:'failed', duration:'6m 41s', log_url:'#',
      stages:[{name:'build',status:'passed',duration:'1m 12s'},{name:'unit',status:'passed',duration:'2m 03s'},{name:'integration',status:'failed',duration:'3m 26s'},{name:'deploy-staging',status:'skipped'}] },
    { id:'ci-2839', branch:'aeg/apam/dev/otp', commit_sha:'b04ee12ac9f', status:'passed', duration:'5m 58s', log_url:'#',
      stages:[{name:'build',status:'passed'},{name:'unit',status:'passed'},{name:'integration',status:'passed'},{name:'deploy-staging',status:'passed'}] },
    { id:'ci-2846', branch:'main', commit_sha:'9f1c02aab31', status:'running', duration:'1m 04s',
      stages:[{name:'build',status:'passed'},{name:'unit',status:'running'},{name:'integration',status:'pending'},{name:'deploy-staging',status:'pending'}] },
  ],
  kv: [
    { key:'apam/otp/issuer', value:'nitens.ai', version:3, updated_at:'2026-06-17 18:04' },
    { key:'apam/otp/window_sec', value:'30', version:1, updated_at:'2026-06-12 09:22' },
    { key:'apam/otp/rate_limit', value:'5/min', version:2, updated_at:'2026-06-18 06:41' },
    { key:'apam/otp/totp_secret', secret:true, version:5, updated_at:'2026-06-18 06:44' },
    { key:'apam/idp/client_secret', secret:true, version:2, updated_at:'2026-05-30 11:07' },
  ],
  prs: [
    { pr:'#412', branch:'aeg/apam/dev/otp', state:'open', checks:'2/3' },
    { pr:'#409', branch:'aeg/apam/spec/otp', state:'merged', checks:'3/3' },
  ],
};
