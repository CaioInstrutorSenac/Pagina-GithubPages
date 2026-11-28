(() => {
  'use strict';

  const shapes = {
    context: '<circle cx="12" cy="8" r="3"/><path d="M5 20v-2a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6v2"/>',
    task: '<circle cx="11" cy="13" r="7"/><circle cx="11" cy="13" r="3"/><path d="m11 13 7-7m-1-3v4h4"/>',
    format: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11"/>',
    limits: '<path d="M12 3 4 6v5c0 5 3 8 8 10 5-2 8-5 8-10V6z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
    copy: '<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M15 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
    check: '<path d="m4 12 5 5L20 6"/>',
    external: '<path d="M13 4h7v7m0-7L10 14M10 5H5a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1v-5"/>',
    privacy: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3"/>',
    terminal: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m6 9 3 3-3 3m6 0h4"/>',
    expand: '<path d="m6 9 6 6 6-6"/>',
    doc: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8m-8 4h6"/>',
    sales: '<path d="m4 16 6-6 4 4 7-9m-6 0h6v6M3 21h18"/>',
    support: '<path d="M3 14v-3a9 9 0 0 1 18 0v3m0 1c0 4-3 6-6 6"/><rect x="2" y="10" width="5" height="8" rx="2"/><rect x="17" y="10" width="5" height="8" rx="2"/>',
    meeting: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18m-13 5h4"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m3 6 9 7 9-7"/>',
    chart: '<path d="M3 3v18h18M7 17v-4m5 4V7m5 10v-7"/>',
    travel: '<path d="m3 5 6-2 6 3 6-2v15l-6 2-6-3-6 2zM9 3v15m6-12v15"/>'
  };

  function icon(name) {
    return '<svg class="sl-icon" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + shapes[name] + '</svg>';
  }

  const fields = [
    { letter: 'C', label: 'Contexto', shape: 'context', hint: 'Quem está pedindo, para quem e em qual situação?', example: 'Tenho uma pequena loja de roupas…' },
    { letter: 'T', label: 'Tarefa', shape: 'task', hint: 'Qual ação você quer que a IA realize?', example: 'Crie uma mensagem convidando os clientes…' },
    { letter: 'F', label: 'Formato', shape: 'format', hint: 'Como a resposta deve ser apresentada?', example: 'Uma mensagem curta, com tom amigável…' },
    { letter: 'R', label: 'Restrições', shape: 'limits', hint: 'Quais limites a resposta deve respeitar?', example: 'Não invente preços, datas ou descontos…' }
  ];
  const examples = {
    profissional: [
      'Tenho uma pequena loja de roupas e quero divulgar uma promoção de verão.',
      'Crie uma mensagem convidando os clientes a conhecerem a promoção.',
      'Mensagem de WhatsApp com tom amigável e até 80 palavras.',
      'Não invente preços, descontos, datas ou condições de pagamento.'
    ],
    pessoal: [
      'Quero organizar meus estudos em casa e tenho 30 minutos livres nas noites de segunda a sexta.',
      'Monte um plano semanal para eu praticar conversação em espanhol.',
      'Use uma tabela com dia, atividade e duração. Escreva em português.',
      'Inclua apenas atividades gratuitas e limite cada sessão a 30 minutos.'
    ]
  };
  const extraInstruction = 'Caso faltem informações importantes para realizar a tarefa, faça perguntas antes de produzir a resposta. Não invente informações para preencher as lacunas.';
  const draft = { values: ['', '', '', ''], questions: false };

  const blindCards = [
    ['Comercial', 'Escreva uma proposta de vendas para um cliente corporativo.', 'sales'],
    ['Atendimento', 'Responda a uma reclamação de cliente insatisfeito com o atraso na entrega.', 'support'],
    ['Gestão/Rotina', 'Crie uma pauta de reunião de alinhamento semanal da equipe.', 'meeting'],
    ['Fornecedores', 'Elabore um e-mail cobrando um fornecedor em atraso.', 'mail'],
    ['Análise', 'Resuma o relatório de vendas mensal.', 'chart'],
    ['Vida Pessoal', 'Monte um roteiro de 3 dias de viagem e um controle simples de gastos.', 'travel']
  ];
  const tracks = {
    a: {
      title: 'Pauta de reunião', icon: 'meeting',
      start: 'Transforme “Crie uma pauta de reunião semanal” em uma tabela (Tema, Responsável, Duração), com limite de 30 minutos.',
      rounds: [
        'Organize os assuntos por ordem de prioridade.',
        'Acrescente uma coluna indicando o resultado esperado de cada assunto.',
        'Confira se a duração total não ultrapassa 30 minutos e mantenha o formato de tabela.'
      ]
    },
    b: {
      title: 'Proposta de vendas', icon: 'sales',
      start: 'Transforme “Escreva uma proposta de vendas” em proposta objetiva de 1 página, proibindo a IA de inventar preços ou prazos.',
      rounds: [
        'Destaque os três principais benefícios do serviço.',
        'Acrescente uma chamada para ação, sem inventar preços ou prazos.',
        'Crie uma versão resumida para WhatsApp, preservando as condições originais.'
      ]
    }
  };
  const salesRows = [
    ['Loja física', 16000, 18000],
    ['Loja virtual', 14000, 12000],
    ['Vendas corporativas', 10000, 15000]
  ];
  const money = value => 'R$ ' + value.toLocaleString('pt-BR');
  const allRows = [...salesRows, [
    'Total',
    salesRows.reduce((sum, row) => sum + row[1], 0),
    salesRows.reduce((sum, row) => sum + row[2], 0)
  ]];
  const reportTitle = 'Relatório de vendas | Outubro de 2025';
  const reportInfo = 'Cenário inteiramente fictício para o Desafio Prompt Cego. Receita mensal por canal de uma loja simulada.';
  const reportNote = 'Meta de receita de outubro: R$ 44.000. O relatório não informa as causas das variações entre os meses.';
  const reportText = [reportTitle, reportInfo, '', 'Canal | Setembro de 2025 | Outubro de 2025',
    ...allRows.map(row => row[0] + ' | ' + money(row[1]) + ' | ' + money(row[2])), '', reportNote].join('\n');

  async function copyText(value) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(value);
        return true;
      } catch { /* Tenta o método local usado por navegadores com acesso restrito. */ }
    }
    const previousFocus = document.activeElement;
    const buffer = document.createElement('textarea');
    buffer.value = value;
    buffer.readOnly = true;
    buffer.spellcheck = false;
    buffer.className = 'sl-clipboard-buffer';
    document.body.appendChild(buffer);
    buffer.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } catch { /* Oferece cópia manual. */ }
    buffer.remove();
    if (previousFocus && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
    return copied;
  }

  async function copyWithFeedback(button, value, region) {
    if (!value) return;
    const copied = await copyText(value);
    if (!button.isConnected) return;
    if (copied) {
      region.textContent = 'Texto copiado.';
      if (button._restoreTimer) clearTimeout(button._restoreTimer);
      if (!button.dataset.originalLabel) button.dataset.originalLabel = button.innerHTML;
      button.innerHTML = icon('check') + 'Copiado!';
      button._restoreTimer = setTimeout(() => { button.innerHTML = button.dataset.originalLabel; }, 1800);
    } else {
      region.replaceChildren();
      const label = document.createElement('label');
      label.textContent = 'O navegador bloqueou a cópia. Copie manualmente o texto selecionado.';
      const area = document.createElement('textarea');
      area.value = value;
      area.readOnly = true;
      area.spellcheck = false;
      area.className = 'sl-manual-copy';
      label.appendChild(area);
      region.appendChild(label);
      area.focus();
      area.select();
    }
  }

  function renderPrompt(root) {
    const fieldMarkup = fields.map((f, i) => `
      <div class="sl-field sl-field-${f.letter.toLowerCase()}">
        <label for="sl-field-${i}"><span class="sl-letter" aria-hidden="true">${f.letter}</span><span>${f.label}</span>${icon(f.shape)}</label>
        <p id="sl-hint-${i}">${f.hint}</p>
        <textarea id="sl-field-${i}" rows="2" aria-describedby="sl-hint-${i}" placeholder="${f.example}" data-field="${i}" spellcheck="false" autocorrect="off" autocomplete="off"></textarea>
      </div>`).join('');
    root.innerHTML = `<div class="sl-page">
      <header class="sl-heading"><h1>Prompt Lab</h1>
        <p>Monte seu comando em quatro partes e copie para a ferramenta de IA que escolheu.</p>
      </header>
      <aside class="sl-privacy" aria-label="Privacidade">${icon('privacy')}<div><strong>Antes de digitar</strong><p>Use dados fictícios. Nunca cole dados pessoais reais, senhas ou segredos corporativos. Seu texto fica neste navegador.</p></div></aside>
      <div class="sl-builder">
        <section class="sl-form-panel" aria-labelledby="sl-form-title">
          <div class="sl-form-top"><h2 id="sl-form-title">Construtor CTFR</h2>
            <div class="sl-example"><label for="sl-example" class="sl-sr">Tipo de exemplo</label><select id="sl-example"><option value="profissional">Profissional</option><option value="pessoal">Pessoal</option></select>
            <button class="sl-btn sl-btn-light" id="sl-load" type="button">Carregar exemplo</button></div>
          </div>
          <div class="sl-fields">${fieldMarkup}</div>
          <label class="sl-extra"><input type="checkbox" id="sl-questions"><span><strong>Pedir esclarecimentos antes da resposta</strong><small>${extraInstruction}</small></span></label>
          <div class="sl-form-foot"><button type="button" class="sl-clear" id="sl-clear">Limpar</button></div>
        </section>
        <aside class="sl-side" aria-labelledby="sl-preview-title">
          <div class="sl-preview-card">
            <div class="sl-preview-head">${icon('terminal')}<h2 id="sl-preview-title">Prévia do prompt</h2></div>
            <div class="sl-preview-body"><div class="sl-progress"><span id="sl-count" aria-live="polite" aria-atomic="true"></span><div aria-hidden="true" class="sl-bars"><i></i><i></i><i></i><i></i></div></div>
              <div class="sl-preview-output" id="sl-preview" role="region" aria-label="Texto montado" tabindex="0"></div>
              <button type="button" id="sl-copy" class="sl-btn sl-primary">${icon('copy')}Copiar prompt</button>
              <div id="sl-feedback" class="sl-feedback" role="status" aria-live="polite"></div>
            </div>
          </div>
          <div class="sl-tools"><h3>Abra sua ferramenta de IA</h3><div>
            <a href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer">ChatGPT ${icon('external')}<span class="sl-sr">, abre em outra aba</span></a>
            <a href="https://gemini.google.com/" target="_blank" rel="noopener noreferrer">Gemini ${icon('external')}<span class="sl-sr">, abre em outra aba</span></a>
          </div></div>
        </aside>
      </div>
    </div>`;
    const inputs = [...root.querySelectorAll('[data-field]')];
    const check = root.querySelector('#sl-questions');
    const preview = root.querySelector('#sl-preview');
    const copy = root.querySelector('#sl-copy');
    const feedback = root.querySelector('#sl-feedback');
    const count = root.querySelector('#sl-count');
    const bars = [...root.querySelectorAll('.sl-bars i')];
    function composed() {
      const parts = fields.flatMap((f, i) => draft.values[i].trim() ? [f.label + ': ' + draft.values[i].trim()] : []);
      if (draft.questions) parts.push(extraInstruction);
      return parts.join('\n\n');
    }
    function refresh() {
      const n = draft.values.filter(value => value.trim()).length;
      const status = n + '/4 campos preenchidos';
      if (count.textContent !== status) count.textContent = status;
      bars.forEach((bar, i) => bar.classList.toggle('sl-filled', i < n));
      const text = composed();
      preview.textContent = text || 'O prompt aparecerá aqui conforme você preencher os campos.';
      preview.classList.toggle('sl-preview-empty', !text);
      copy.disabled = !text;
      root.querySelector('#sl-clear').disabled = !(draft.questions || draft.values.some(value => value.length));
    }
    function loadInputs() {
      inputs.forEach((input, i) => { input.value = draft.values[i]; });
      check.checked = draft.questions;
      refresh();
    }
    inputs.forEach((input, i) => input.addEventListener('input', () => {
      draft.values[i] = input.value;
      feedback.textContent = '';
      refresh();
    }));
    check.addEventListener('change', () => {
      draft.questions = check.checked;
      feedback.textContent = '';
      refresh();
    });
    root.querySelector('#sl-load').addEventListener('click', () => {
      const example = root.querySelector('#sl-example').value;
      draft.values = [...examples[example]];
      loadInputs();
      feedback.textContent = 'Exemplo ' + example + ' carregado.';
    });
    root.querySelector('#sl-clear').addEventListener('click', () => {
      draft.values = ['', '', '', ''];
      draft.questions = false;
      loadInputs();
      feedback.textContent = 'Campos limpos.';
      inputs[0].focus();
    });
    copy.addEventListener('click', () => copyWithFeedback(copy, composed(), feedback));
    loadInputs();
  }

  function reportMarkup() {
    const rows = allRows.map((row, i) => `<tr${i === allRows.length - 1 ? ' class="sl-total"' : ''}><th scope="row">${row[0]}</th><td>${money(row[1])}</td><td>${money(row[2])}</td></tr>`).join('');
    return `<details class="sl-report"><summary>${icon('doc')} <span>Abrir relatório de vendas fictício</span> ${icon('expand')}</summary>
      <div class="sl-report-content"><h4>${reportTitle}</h4><p>${reportInfo}</p>
      <table><caption class="sl-sr">Receita mensal por canal em reais</caption><thead><tr><th scope="col">Canal</th><th scope="col">Set.</th><th scope="col">Out.</th></tr></thead><tbody>${rows}</tbody></table>
      <p>${reportNote}</p><button class="sl-btn sl-btn-light" type="button" data-copy="report">${icon('copy')}Copiar relatório</button></div></details>`;
  }

  function libraryCard(label, title, content, shape, copyId, report = false) {
    return `<article class="sl-library-card"><div class="sl-card-top"><span class="sl-card-icon">${icon(shape)}</span><span class="sl-card-label">${label}</span></div><h3>${title}</h3>
      <p class="sl-card-prompt">${content}</p>
      <div class="sl-card-foot"><button type="button" class="sl-btn sl-btn-light" data-copy="${copyId}" aria-label="Copiar: ${title}">${icon('copy')}Copiar</button></div>
      ${report ? reportMarkup() : ''}<div class="sl-feedback" role="status"></div></article>`;
  }

  function renderLibrary(root) {
    root.innerHTML = `<div class="sl-page"><header class="sl-heading"><h1>Biblioteca de Copiar Rápido</h1>
      <p>Escolha a atividade da aula e copie um comando por vez.</p></header>
      <div class="sl-lib-filters" role="group" aria-label="Atividade"><button type="button" data-group="cego" aria-pressed="true">Desafio Prompt Cego</button><button type="button" data-group="a" aria-pressed="false">Trilha A · Gestão</button><button type="button" data-group="b" aria-pressed="false">Trilha B · Comercial</button></div>
      <section id="sl-collection" aria-labelledby="sl-collection-title"></section></div>`;
    const collection = root.querySelector('#sl-collection');
    const groupButtons = [...root.querySelectorAll('[data-group]')];
    function show(group) {
      groupButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.group === group)));
      const values = { report: reportText };
      let cards = '';
      let title = 'Desafio Prompt Cego';
      let guide = 'Slide 07 · Escolha a demanda mais próxima da sua realidade.';
      if (group === 'cego') {
        cards = blindCards.map(([name, content, shape], i) => {
          values[i] = content;
          return libraryCard('Demanda ' + (i + 1), name, content, shape, i, i === 4);
        }).join('');
      } else {
        const track = tracks[group];
        title = track.title;
        guide = 'Slide 19 · Em uma conversa nova, construa seu comando inicial com CTFR. Slide 20 · Faça os três refinamentos na mesma conversa.';
        values.start = track.start;
        cards = libraryCard('Slide 19', 'Comando inicial', track.start, track.icon, 'start');
        cards += track.rounds.map((content, i) => {
          values[i] = content;
          return libraryCard('Slide 20', 'Refinamento ' + (i + 1), content, 'terminal', i);
        }).join('');
      }
      collection.innerHTML = `<div class="sl-collection-intro"><h2 id="sl-collection-title">${title}</h2><p>${guide}</p></div><div class="sl-card-grid">${cards}</div>`;
      collection.querySelectorAll('[data-copy]').forEach(button => {
        button.addEventListener('click', () => copyWithFeedback(button, values[button.dataset.copy], button.closest('article').querySelector('.sl-feedback')));
      });
    }
    groupButtons.forEach(button => button.addEventListener('click', () => show(button.dataset.group)));
    show('cego');
  }

  window.Student = {
    render(page, root) {
      if (page === 'prompt') renderPrompt(root);
      if (page === 'biblioteca') renderLibrary(root);
    }
  };
})();

;
(() => {
  'use strict';

  const shapes = {
    clock: '<circle cx="12" cy="13.5" r="8"/><path d="M12 9v5l3 2M10 2h4M12 2v3M18.5 6l1.5-1.5"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.4"/><path d="m4 18 5-5 3 3 3-4 5 6"/>',
    text: '<path d="M5 6h14M5 11h10M5 16h7"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    shield: '<path d="m12 3 8 3v6c0 5-5 8-8 10-3-2-8-5-8-10V6z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
    book: '<path d="M3 4c4-1 6 0 9 2 3-2 5-3 9-2v15c-4-1-7 0-9 2-3-2-6-3-9-2zM12 6v15"/>',
    arrow: '<path d="M4 12h15m-5-5 5 5-5 5"/>',
    back: '<path d="M20 12H5m5-5-5 5 5 5"/>',
    expand: '<path d="M9 3H3v6m12-6h6v6M3 15v6h6m12-6v6h-6"/>',
    play: '<path d="m7 4 13 8-13 8z"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    reset: '<path d="M3 10a9 9 0 1 1 1 8M3 4v6h6"/>',
    layers: '<path d="m3 7 9-5 9 5-9 5zM3 12l9 5 9-5M3 17l9 5 9-5"/>',
    mail: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    check: '<path d="m4 12 5 5L20 6"/>',
    chevron: '<path d="m9 5 7 7-7 7"/>',
    group: '<circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2m0-15a3 3 0 0 1 0 6m3 3a5 5 0 0 1 3 4v2"/>'
  };

  function icon(name) {
    return '<svg class="il-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + shapes[name] + '</svg>';
  }

  const activities = [
    {id:'08', slide:'08', name:'Desafio Prompt Cego', min:10},
    {id:'18', slide:'18', name:'Antes e depois do CTFR', min:10},
    {id:'19', slide:'19', name:'Laboratório de reescrita', min:13},
    {id:'20', slide:'20', name:'Rodadas de refinamento', min:12},
    {id:'21', slide:'21', name:'Batalha das IAs', min:6},
    {id:'intervalo', slide:'', name:'Intervalo', min:10},
    {id:'35', slide:'35', name:'Guardiões da IA', min:27},
    {id:'38', slide:'38', name:'Desafio individual de saída', min:5}
  ];

  const resources = [
    ['galeria','image','Humano ou IA?','Vote e revele a origem de cada exemplo.','02'],
    ['banco','text','Eu fui ao banco para…','Explore como o contexto muda a próxima palavra.','12'],
    ['detetive','search','Detetive Digital','Investigue fontes, privacidade, vieses e autoria.','25–28'],
    ['guardioes','shield','Guardiões da IA','Revele os gabaritos comentados das missões.','36'],
    ['referencias','book','Referências verificadas','Consulte as fontes usadas na aula.','']
  ];

  let dispose = [];
  function cleanup() {
    for (const release of dispose.splice(0)) release();
  }

  const back = '<a class="il-back" href="#/instrutor">' + icon('back') + 'Central do Instrutor</a>';
  function fullscreenButton() {
    return '<button class="il-btn il-outline il-fs" type="button" data-full>' + icon('expand') + '<span>Tela cheia</span></button>';
  }

  function wireFullscreen(root) {
    const area = root.querySelector('.il-page');
    const btn = area.querySelector('[data-full]');
    if (!btn) return;
    function update() {
      const active = document.fullscreenElement === area || area.classList.contains('il-overlay');
      btn.querySelector('span').textContent = active ? 'Sair da tela cheia' : 'Tela cheia';
      btn.setAttribute('aria-pressed',String(active));
    }
    function exitOverlay() {
      area.classList.remove('il-overlay');
      update();
    }
    btn.onclick = async () => {
      if (document.fullscreenElement === area) {
        await document.exitFullscreen().catch(() => {});
      } else if (area.classList.contains('il-overlay')) {
        exitOverlay();
      } else {
        try { await area.requestFullscreen(); }
        catch { area.classList.add('il-overlay'); }
      }
      update();
    };
    function handleEscape(e) {
      if (e.key === 'Escape' && area.classList.contains('il-overlay')) exitOverlay();
    }
    document.addEventListener('fullscreenchange',update);
    document.addEventListener('keydown',handleEscape);
    dispose.push(() => {
      document.removeEventListener('fullscreenchange',update);
      document.removeEventListener('keydown',handleEscape);
      if (document.fullscreenElement === area) document.exitFullscreen().catch(() => {});
      exitOverlay();
    });
  }

  function shell(title, slide, content, intro='') {
    return '<section class="il-page"><div class="il-tools">' + back + fullscreenButton() + '</div>' +
      '<header class="il-header"><div class="il-kicker">' + slide + '</div><h1>' + title + '</h1>' +
      (intro ? '<p>' + intro + '</p>' : '') + '</header>' + content + '</section>';
  }

  function landing(root) {
    const schedule = activities.map(a =>
      '<a class="il-schedule-row" href="#/timer/' + a.min + '?a=' + a.id + '"><span class="il-min"><b>' + a.min + '</b> min</span><span class="il-row-label"><strong>' + a.name + '</strong><small>' + (a.slide ? 'Slide ' + a.slide : 'Pausa da turma') + '</small></span>' + icon('chevron') + '</a>'
    ).join('');
    const modules = resources.map(([path, mark, title, desc, slide]) =>
      '<a class="il-resource" href="#/' + path + '"><span class="il-mark">' + icon(mark) + '</span><span class="il-row-label"><strong>' + title + '</strong><span>' + desc + '</span></span>' + icon('chevron') + '</a>'
    ).join('');
    root.innerHTML = '<section class="il-page"><div class="il-hero"><div class="il-hero-content"><div class="il-kicker"><i></i> Projeção em sala</div><h1>Central do Instrutor</h1><p>Conduza a aula com cronômetros, dinâmicas e gabaritos para projetar.</p>' + fullscreenButton() + '</div><div class="il-clock-art" aria-hidden="true"><div class="il-dial"><i></i><b></b><em></em></div></div></div>' +
      '<div class="il-columns"><section><div class="il-section-head"><span class="il-section-icon">' + icon('clock') + '</span><h2>Cronograma da aula</h2></div><div class="il-list">' + schedule + '</div></section>' +
      '<section><div class="il-section-head"><span class="il-section-icon">' + icon('layers') + '</span><h2>Dinâmicas e materiais</h2></div><div class="il-list">' + modules + '</div></section></div></section>';
  }

  function timer(root, minutes, id) {
    const activity = activities.find(a => a.id === id && a.min === minutes);
    const title = activity ? activity.name : 'Cronômetro de ' + minutes + ' minutos';
    const caption = activity?.slide ? 'Slide ' + activity.slide : activity ? 'Pausa da turma' : 'Cronômetro de sala';
    root.innerHTML = shell(title, caption,
      '<div class="il-timer"><div class="il-timer-status" data-status role="status">Pronto para começar</div>' +
      '<div class="il-digits" role="timer" aria-label="Tempo restante" aria-live="off"></div>' +
      '<div class="il-meter" aria-hidden="true"><i></i></div><div class="il-timer-controls">' +
      '<button class="il-btn il-primary" type="button" data-toggle></button><button class="il-btn il-outline" data-reset type="button">' + icon('reset') + 'Reiniciar</button></div>' +
      (minutes === 27 ? '<p class="il-role-note">' + icon('group') + 'Troca de papéis aos 13min30s.</p>' : '') + '</div>');
    const total = minutes * 60000;
    const box = root.querySelector('.il-timer');
    const digits = box.querySelector('.il-digits');
    const status = box.querySelector('[data-status]');
    const toggle = box.querySelector('[data-toggle]');
    const fill = box.querySelector('.il-meter i');
    let remaining = total;
    let deadline = 0;
    let state = 'ready';
    let interval = 0;
    function stopTicks() { clearInterval(interval); interval = 0; }
    function show() {
      if (state === 'running') remaining = Math.max(0,deadline - Date.now());
      if (state === 'running' && remaining === 0) {
        state = 'done';
        stopTicks();
      }
      const seconds = Math.ceil(remaining / 1000);
      const value = String(Math.floor(seconds / 60)).padStart(2,'0') + ':' + String(seconds % 60).padStart(2,'0');
      if (digits.textContent !== value) digits.textContent = value;
      const last = remaining > 0 && remaining <= 60000;
      const swap = minutes === 27 && remaining <= total / 2 && remaining > total / 2 - 30000;
      box.classList.toggle('il-last',last);
      box.classList.toggle('il-swap',swap);
      fill.style.width = (remaining / total * 100) + '%';
      const messages = {ready:'Pronto para começar', paused:'Pausado', done:'Tempo encerrado'};
      const note = [messages[state], swap ? 'Troquem os papéis de engenheiro e auditor' : last ? 'Último minuto' : ''].filter(Boolean).join(' · ') || 'Em andamento';
      if (status.textContent !== note) status.textContent = note;
      const label = state === 'running' ? 'Pausar' : state === 'paused' ? 'Continuar' : 'Iniciar';
      if (toggle.dataset.label !== label) {
        toggle.innerHTML = icon(state === 'running' ? 'pause' : 'play') + label;
        toggle.dataset.label = label;
      }
    }
    toggle.onclick = () => {
      if (state === 'running') {
        show();
        if (state === 'running') state = 'paused';
        stopTicks();
      } else {
        if (state === 'done') remaining = total;
        deadline = Date.now() + remaining;
        state = 'running';
        interval = setInterval(show,200);
      }
      show();
    };
    box.querySelector('[data-reset]').onclick = () => {
      stopTicks(); state = 'ready'; remaining = total; show();
    };
    dispose.push(stopTicks);
    show();
  }

  const galleryItems = [
    {label:'Imagem A', src:'./assets/galeria-a.webp', alt:'Artesã ceramista trabalhando em seu ateliê.'},
    {label:'Imagem B', src:'./assets/galeria-b.webp', alt:'Banca de laranjas em uma feira.'},
    {label:'Mensagem comercial', text:'Olá! O modelo que você procurou voltou ao estoque. Quer que eu confirme as cores disponíveis antes de você vir à loja?'}
  ];

  function gallery(root) {
    root.innerHTML = shell('Humano ou IA?', 'Slide 02',
      '<div class="il-choices" aria-label="Escolha do exemplo">' + galleryItems.map((o,i) => '<button type="button" class="il-chip" data-example="' + i + '" aria-pressed="' + (i === 0) + '">' + o.label + '</button>').join('') + '</div>' +
      '<div class="il-gallery"><div class="il-visual" aria-live="polite"></div><section class="il-vote"><div class="il-kicker">Votação da turma</div><h2>Qual é a sua hipótese?</h2><p>Peça um voto por pessoa, por mãos levantadas. Selecione a hipótese mais votada.</p><div class="il-vote-options">' +
      ['Produzido por humano','Gerado por IA','Não é possível determinar apenas observando'].map((v,i) => '<button type="button" data-vote="' + i + '" aria-pressed="false"><span class="il-radio"></span>' + v + '</button>').join('') + '</div><button type="button" class="il-btn il-primary" data-reveal aria-expanded="false" aria-controls="il-origins">' + icon('eye') + 'Revelar origens</button></section></div>' +
      '<div id="il-origins" class="il-answer" hidden><h2>As duas imagens foram geradas por IA.</h2><p>O slide original reservava espaço para dois exemplos. A ceramista e a banca de laranjas foram geradas por IA para esta versão da dinâmica. A mensagem comercial é um exemplo fictício escrito com IA para a aula.</p><strong>A aparência convincente de um conteúdo não comprova sua origem, autenticidade ou veracidade.</strong></div>');
    let current = 0;
    const votes = [null,null,null];
    const visual = root.querySelector('.il-visual');
    const select = [...root.querySelectorAll('[data-example]')];
    const buttons = [...root.querySelectorAll('[data-vote]')];
    const reveal = root.querySelector('[data-reveal]');
    function paint() {
      const item = galleryItems[current];
      visual.innerHTML = item.src ? '<img src="' + item.src + '" alt="' + item.alt + '">' :
        '<div class="il-message">' + icon('mail') + '<blockquote>“' + item.text + '”</blockquote></div>';
      select.forEach((b,i) => b.setAttribute('aria-pressed',String(i === current)));
      buttons.forEach((b,i) => b.setAttribute('aria-pressed',String(votes[current] === i)));
    }
    select.forEach((b,i) => b.onclick = () => { current = i; paint(); });
    buttons.forEach((b,i) => b.onclick = () => { votes[current] = i; buttons.forEach((e,j) => e.setAttribute('aria-pressed',String(i === j))); });
    reveal.onclick = () => {
      const answer = root.querySelector('#il-origins');
      answer.hidden = !answer.hidden;
      reveal.setAttribute('aria-expanded',String(!answer.hidden));
      reveal.innerHTML = icon('eye') + (answer.hidden ? 'Revelar origens' : 'Ocultar origens');
      if (!answer.hidden) answer.scrollIntoView({block:'nearest'});
    };
    paint();
  }

  function bank(root) {
    const contexts = [
      {name:'FINANÇAS', endings:['sacar dinheiro','pagar uma conta','falar com o gerente']},
      {name:'PRAÇA', endings:['me sentar','descansar','conversar']}
    ];
    root.innerHTML = '<section class="il-page"><div class="il-tools">' + back + fullscreenButton() + '</div><section class="il-bank"><h1>Eu fui ao banco para<span>...</span></h1><div class="il-bank-controls">' +
      contexts.map((x,i) => '<button class="il-btn il-outline" type="button" aria-expanded="false" aria-controls="il-context-' + i + '" data-context="' + i + '">Revelar contexto ' + (i+1) + '</button>').join('') +
      '</div><div class="il-contexts">' + contexts.map((x,i) => '<section class="il-context" id="il-context-' + i + '" hidden><div class="il-kicker">Contexto ' + (i+1) + '</div><h2>' + x.name + '</h2><ul>' +
        x.endings.map((e,j) => '<li>…' + e + '<span class="il-bar" aria-hidden="true"><i style="width:' + [80,59,32][j] + '%"></i></span></li>').join('') + '</ul><small>ilustração didática (não são probabilidades reais)</small></section>').join('') + '</div></section></section>';
    root.querySelectorAll('[data-context]').forEach((b,i) => {
      b.onclick = () => {
        const panel = root.querySelector('#il-context-' + i);
        panel.hidden = !panel.hidden;
        b.setAttribute('aria-expanded',String(!panel.hidden));
        b.textContent = (panel.hidden ? 'Revelar' : 'Ocultar') + ' contexto ' + (i+1);
      };
    });
  }

  const suspects = [
    ['Instituto Nacional de Produtividade Digital','Instituto fictício','Procure o órgão em registros e canais institucionais. Neste exercício, o nome foi inventado.'],
    ['2026','Data do relatório','Localize a publicação original e confira sua data. Um ano citado sozinho não comprova que o relatório existe.'],
    ['78%','Percentual sem evidência','Busque a amostra, o período, a metodologia e o indicador medido. O percentual e o resultado foram inventados para a atividade.']
  ];
  const privacy = [
    ['A','Nome completo e CPF do cliente','Proteger','Identificam a pessoa. Substitua todo o cenário por dados fictícios.'],
    ['B','Tipo genérico de produto','Pode usar no exercício','Uma categoria genérica, como “caderno”, pode ser usada sem identificar cliente ou informação interna.'],
    ['C','Senha do sistema interno','Proteger','Credenciais permitem acesso ao sistema. Exclua a senha de qualquer texto de exemplo.'],
    ['D','Quantidade genérica de itens','Pode usar no exercício','Uma quantidade inventada, como três itens, atende à atividade. Evite associá-la a pedidos ou clientes reais.'],
    ['E','Número de cartão bancário','Proteger','Dados financeiros expõem a pessoa a fraude. Remova o número antes de escrever.'],
    ['F','Diagnóstico médico de um funcionário','Proteger','Dados de saúde são dados pessoais sensíveis. Use um cenário fictício sem diagnóstico identificável.'],
    ['G','Tom de voz desejado para o e-mail','Pode usar no exercício','“Cordial e objetivo” orienta a escrita e dispensa qualquer dado de cliente.']
  ];

  function detector(root) {
    const clue = i => '<button type="button" class="il-clue" data-toggle-answer="il-proof-' + i + '" aria-controls="il-proof-' + i + '" aria-expanded="false">' + suspects[i][0] + '</button>';
    const hallucination = '<div class="il-case"><div class="il-kicker">Cenário Didático Fictício</div><h2>O que precisa de validação?</h2><p>Selecione as pistas na afirmação.</p><blockquote>“Segundo o ' + clue(0) + ', em seu relatório de ' + clue(1) + ', empresas que utilizam IA aumentam suas vendas em ' + clue(2) + ' nos primeiros 30 dias.”</blockquote>' +
      suspects.map((x,i) => '<div id="il-proof-' + i + '" class="il-explain" hidden><strong>' + x[1] + '</strong><p>' + x[2] + '</p></div>').join('') + '</div>' +
      '<div class="il-documented"><div class="il-kicker">' + icon('book') + ' Caso Real Documentado</div><h3>Mata v. Avianca, Inc. · 2023</h3><p>Advogados apresentaram decisões judiciais inexistentes citadas por uma IA. Em 22 de junho de 2023, a Justiça federal dos EUA aplicou sanções.</p><a href="#/referencias">Consultar a decisão judicial ' + icon('arrow') + '</a></div>';
    const privacyPanel = '<div class="il-case"><div class="il-kicker">Privacidade e LGPD</div><h2>O que pode entrar em uma IA pública?</h2><p>Discuta cada item com a turma. Selecione-o para revelar o gabarito.</p><div class="il-privacy">' +
      privacy.map(([letter,label,risk,reason]) => '<div><button type="button" class="il-data" data-toggle-answer="il-data-' + letter + '" aria-expanded="false" aria-controls="il-data-' + letter + '"><b>[' + letter + ']</b>' + label + icon('chevron') + '</button><div class="il-explain" id="il-data-' + letter + '" hidden><strong>' + risk + '</strong><p>' + reason + '</p></div></div>').join('') +
      '</div><p class="il-reminder"><strong>Mesmo com outro nome, uma pessoa pode ser reconhecida</strong> por combinações de cargo, data, empresa e valores. Use dados inteiramente fictícios.</p></div>' +
      '<div class="il-documented"><div class="il-kicker">' + icon('book') + ' Caso Real Documentado</div><h3>Samsung · 2023</h3><p>A empresa restringiu o uso de ferramentas de IA generativa após o envio de código interno a um serviço externo.</p><a href="#/referencias">Consultar fontes e LGPD ' + icon('arrow') + '</a></div>';
    const bias = '<div class="il-case"><div class="il-kicker">Vieses</div><h2>De onde vêm os estereótipos?</h2><p>Peça à IA que descreva um dia típico de quem trabalha em liderança executiva e em enfermagem, sem indicar gênero ou idade. Que suposições aparecem?</p><ol class="il-flow">' +
      ['Dados históricos desiguais','Treinamento do modelo','Risco de decisão enviesada','Revisão humana'].map((s,i) => '<li style="--il-step:' + i + '"><b>' + (i+1) + '</b>' + s + '</li>').join('') +
      '</ol><details class="il-details"><summary>Se a resposta ao vivo vier neutra</summary><div><strong>Dois exemplos fictícios para a discussão</strong><p>“O executivo prepara a estratégia enquanto a enfermeira acolhe a família.” A frase atribui gênero a cada profissão sem informação que sustente a escolha.</p><p>“A pessoa mais jovem deve cuidar de toda a tecnologia.” Que competência foi presumida pela idade? Peça uma reescrita com responsabilidades e habilidades observáveis.</p></div></details></div>' +
      '<div class="il-documented"><div class="il-kicker">' + icon('book') + ' Caso Real Documentado</div><h3>Amazon · 2018</h3><p>Uma ferramenta experimental de recrutamento reproduziu padrões de currículos históricos e penalizou referências a mulheres. A empresa abandonou o projeto.</p><a href="#/referencias">Consultar a reportagem da Reuters ' + icon('arrow') + '</a></div>';
    const ethics = '<div class="il-case"><div class="il-kicker">Ética e autoria</div><h2>Antes de publicar</h2><ol class="il-checks"><li><strong>Confira a licença.</strong><span>Identifique as obras de terceiros e verifique as permissões para o uso pretendido, inclusive comercial.</span></li><li><strong>Faça a revisão humana.</strong><span>Confira dados, citações e possíveis vieses. Decida como informar a participação da IA.</span></li><li><strong>Consulte a política da organização.</strong><span>Confirme quais ferramentas e ambientes a instituição autoriza para a tarefa.</span></li></ol><a class="il-link" href="#/referencias">Consultar a Lei de Direitos Autorais e o guia da UNESCO ' + icon('arrow') + '</a></div>';
    const panels = [hallucination,privacyPanel,bias,ethics];
    const labels = ['Alucinações','Privacidade','Vieses','Ética e autoria'];
    root.innerHTML = shell('Detetive Digital','Slides 25 a 28',
      '<div class="il-choices" aria-label="Temas da investigação">' + labels.map((l,i) => '<button type="button" class="il-chip" aria-pressed="' + (i === 0) + '" aria-controls="il-topic-' + i + '" data-topic="' + i + '">' + l + '</button>').join('') + '</div>' +
      panels.map((p,i) => '<section class="il-panel" id="il-topic-' + i + '"' + (i?' hidden':'') + '>' + p + '</section>').join(''));
    const topics = [...root.querySelectorAll('[data-topic]')];
    const sections = [...root.querySelectorAll('.il-panel')];
    topics.forEach((b,i) => b.onclick = () => {
      topics.forEach((item,j) => item.setAttribute('aria-pressed',String(i === j)));
      sections.forEach((s,j) => s.hidden = i !== j);
    });
    root.querySelectorAll('[data-toggle-answer]').forEach(b => b.onclick = () => {
      const answer = root.querySelector('#' + b.dataset.toggleAnswer);
      answer.hidden = !answer.hidden;
      b.setAttribute('aria-expanded',String(!answer.hidden));
    });
  }

  const missions = [
    {title:'Vazamento de informações', theme:'Privacidade', diagnosis:'O pedido mistura identificadores de cliente, informação de saúde e ameaça de negativação. Remova os dados e a ameaça. A negociação deve usar tom respeitoso.',
      ctfr:['Você apoia o atendimento de uma empresa fictícia que quer conversar sobre um pagamento pendente.','Convide a pessoa a conhecer os canais de negociação.','Escreva uma mensagem curta de WhatsApp, com saudação e convite para conversar.','Use tom cordial. Omita nomes, valores, documentos e dados de saúde. Não faça ameaças nem prometa condições.'],
      verify:'Leia a mensagem como destinatário. Ela preserva a privacidade, convida à negociação e evita expor ou constranger alguém?'},
    {title:'Informação fantasma', theme:'Alucinação', diagnosis:'A resposta inventou lei, garantia de três anos e troca em até 24 horas. O prompt inicial não fornecia política comercial nem limitava as promessas.',
      ctfr:['Na loja fictícia, a política simulada prevê 12 meses de garantia do fabricante, sem prejuízo dos direitos legais do consumidor. A orientação deve encaminhar para canais oficiais de assistência.','Explique ao cliente como obter orientação sobre a garantia do notebook.','Escreva um e-mail breve, com assunto e até dois parágrafos.','Use apenas a política informada. Não invente leis, links, prazos de atendimento ou condições de troca. Peça informação se faltar um canal de contato.'],
      verify:'Compare cada prazo e condição com a política simulada. Antes de qualquer uso real, confirme a política vigente e o canal oficial.'},
    {title:'Algoritmo injusto', theme:'Viés e ética', diagnosis:'O anúncio associa tecnologia a homens jovens e restringe as candidaturas por gênero e idade. Avalie as competências necessárias para as atividades da vaga.',
      ctfr:['Uma loja fictícia de eletrônicos busca uma pessoa para atendimento e vendas.','Redija um anúncio com atividades e competências de atendimento, trabalho em equipe e interesse por tecnologia.','Use título, breve descrição, lista de atividades e lista de requisitos.','Use linguagem inclusiva. Exclua filtros de gênero e idade e estereótipos. Não invente benefícios ou salário.'],
      verify:'Confira se cada requisito se relaciona a uma tarefa da vaga e se a linguagem acolhe candidaturas de perfis diversos.'}
  ];

  function guardians(root) {
    const cards = missions.map((m,i) => '<details class="il-mission"><summary><span class="il-mission-number">0' + (i+1) + '</span><span><small>Missão 0' + (i+1) + ' · ' + m.theme + '</small><strong>' + m.title + '</strong></span>' + icon('chevron') + '</summary>' +
      '<div class="il-mission-body"><h2>O que corrigir</h2><p>' + m.diagnosis + '</p><details class="il-details"><summary>Revelar um prompt CTFR possível</summary><dl class="il-ctfr">' +
      ['Contexto','Tarefa','Formato','Restrições'].map((t,j) => '<div><dt>' + t + '</dt><dd>' + m.ctfr[j] + '</dd></div>').join('') + '</dl></details>' +
      '<details class="il-details"><summary>Revelar a conferência final</summary><div><p>' + m.verify + '</p></div></details></div></details>').join('');
    root.innerHTML = shell('Guardiões da IA','Slide 36','<div class="il-missions">' + cards + '</div><p class="il-footnote">A Central organiza a projeção. Qualquer pessoa com o endereço pode abrir os gabaritos.</p>',
      'Ouça a solução da dupla antes de abrir cada missão. Revele o comentário, o exemplo de prompt e a conferência no ritmo da turma.');
  }

  function render(page,root) {
    cleanup();
    const [path,query=''] = page.split('?');
    if (path === 'instrutor') landing(root);
    else if (path === 'galeria') gallery(root);
    else if (path === 'banco') bank(root);
    else if (path === 'detetive') detector(root);
    else if (path === 'guardioes') guardians(root);
    else if (/^timer\/(5|6|10|12|13|27)$/.test(path)) {
      timer(root,Number(path.split('/')[1]),new URLSearchParams(query).get('a'));
    } else {
      root.innerHTML = shell('Atividade não encontrada','Central do Instrutor','<p>Volte ao cronograma para escolher uma atividade.</p>');
    }
    wireFullscreen(root);
  }

  window.Instructor = { render, cleanup };
})();

;
(() => {
  const groups = [
    {
      name: "Casos documentados",
      items: [
        {
          title: "Mata v. Avianca, Inc.",
          source: "Justiça Federal dos EUA · 22 jun. 2023 · PDF em inglês",
          summary: "O juiz descreve como os advogados apresentaram decisões judiciais inexistentes e explica as sanções aplicadas. Veja as páginas 1 e 34 do documento 54.",
          link: "Ler a decisão judicial",
          url: "https://www.nhd.uscourts.gov/sites/default/files/pdf/Mata-v-Avianca-sanctions-order.PDF"
        },
        {
          title: "Samsung e o envio de código interno",
          source: "Bloomberg News · 2 maio 2023 · Em inglês",
          summary: "Mark Gurman relata o envio de código interno ao ChatGPT e as medidas comunicadas pela Samsung. A Bloomberg Law libera os primeiros parágrafos e exige assinatura para a íntegra.",
          link: "Ler a prévia da Bloomberg",
          url: "https://news.bloomberglaw.com/tech-and-telecom-law/samsung-bans-staffs-ai-use-after-spotting-chatgpt-data-leak-2"
        },
        {
          title: "A resposta da Samsung",
          source: "TechCrunch · 2 maio 2023 · Em inglês",
          summary: "Na cobertura aberta do mesmo episódio, um porta-voz confirma à jornalista Kate Park a restrição temporária ao uso de IA generativa em dispositivos da empresa.",
          link: "Ler a reportagem aberta",
          url: "https://techcrunch.com/2023/05/02/samsung-bans-use-of-generative-ai-tools-like-chatgpt-after-april-internal-data-leak/"
        },
        {
          title: "Viés na triagem de currículos da Amazon",
          source: "Reuters · 10 out. 2018 · Em inglês",
          summary: "A investigação descreve como um sistema experimental aprendeu padrões de currículos enviados predominantemente por homens. O The Guardian publica a reportagem com crédito à Reuters.",
          link: "Ler a reportagem da Reuters",
          url: "https://www.theguardian.com/technology/2018/oct/10/amazon-hiring-ai-gender-bias-recruiting-engine"
        }
      ]
    },
    {
      name: "Leis e orientações",
      items: [
        {
          title: "Lei Geral de Proteção de Dados Pessoais",
          source: "Planalto · Lei nº 13.709, de 14 ago. 2018",
          summary: "O artigo 5º define dado pessoal e dado pessoal sensível. O artigo 6º apresenta princípios como finalidade, necessidade e segurança.",
          link: "Consultar a LGPD",
          url: "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm"
        },
        {
          title: "Agência Nacional de Proteção de Dados",
          source: "ANPD · Portal institucional",
          summary: "Consulte os materiais educativos e os canais de atendimento da agência brasileira responsável pela proteção de dados pessoais.",
          link: "Visitar a ANPD",
          url: "https://www.gov.br/anpd/pt-br"
        },
        {
          title: "Lei de Direitos Autorais",
          source: "Planalto · Lei nº 9.610, de 19 fev. 1998",
          summary: "O artigo 7º apresenta exemplos de obras protegidas. Os artigos 29 e 46 tratam da autorização para uso e das limitações aos direitos autorais.",
          link: "Consultar a lei",
          url: "https://www.planalto.gov.br/ccivil_03/leis/l9610.htm"
        },
        {
          title: "Guidance for generative AI in education and research",
          source: "UNESCO · 7 set. 2023",
          summary: "O guia de Fengchun Miao e Wayne Holmes discute privacidade, supervisão humana e uso pedagógico da IA. Na página da UNESCO, selecione “Portuguese” para ler a tradução.",
          link: "Acessar o guia da UNESCO",
          url: "https://www.unesco.org/en/articles/guidance-generative-ai-education-and-research"
        }
      ]
    }
  ];

  function render(page, root) {
    const panel = document.createElement("div");
    panel.className = "ref-page";
    panel.innerHTML = `
      <header class="ref-header">
        <h1>Referências verificadas</h1>
        <p>Consulte as fontes dos casos e as orientações usadas na aula. Links conferidos em 27 de novembro de 2026.</p>
      </header>
      ${groups.map((group) => `
        <section class="ref-group">
          <h2>${group.name}</h2>
          <ul class="ref-list">
            ${group.items.map((item) => `
              <li class="ref-item">
                <span class="ref-source">${item.source}</span>
                <h3>${item.title}</h3>
                <p>${item.summary}</p>
                <a class="ref-link" href="${item.url}" rel="noreferrer">${item.link} <span aria-hidden="true">↗</span></a>
              </li>
            `).join("")}
          </ul>
        </section>
      `).join("")}`;
    root.replaceChildren(panel);
  }

  window.References = { render };
})();

;
(() => {
  'use strict';
  const paths = {
    cap:'<path d="m2 9 10-5 10 5-10 5zM6 11v5c4 3 8 3 12 0v-5m4-2v6"/>',
    board:'<path d="M3 5h18v12H3zM8 21l4-4 4 4M12 3v2"/>',
    prompt:'<path d="M3 4h18v13h-9l-5 4v-4H3zM7 9l2 2-2 2m5 0h4"/>',
    book:'<path d="M3 4.5C6 4 9 4.5 12 6c3-1.5 6-2 9-1.5V19c-3-.5-6 0-9 1.5-3-1.5-6-2-9-1.5zM12 6v14"/>',
    paper:'<path d="M4 20h15M6 15l-.5 3.5L9 18l11-11-3-3zM15 6l3 3"/>',
    brief:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V4h8v3m-13 6c6 3 12 3 18 0m-9 0v3"/>'
  };
  function icon(name) {
    return '<svg class="site-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+paths[name]+'</svg>';
  }
  document.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon));
  const view=document.getElementById('view');
  const main=document.getElementById('conteudo');
  const crumbs=document.getElementById('breadcrumb');
  const titles={aluno:'Área do Aluno',prompt:'Prompt Lab',biblioteca:'Biblioteca de Copiar Rápido',instrutor:'Central do Instrutor',galeria:'Humano ou IA?',banco:'Eu fui ao banco para…',detetive:'Detetive Digital',guardioes:'Guardiões da IA',referencias:'Referências verificadas'};
  function home() {
    view.innerHTML=`
      <section class="cover" aria-labelledby="cover-title">
        <div class="cover-art" aria-hidden="true"></div>
        <div class="cover-body"><p class="cover-meta"><span aria-hidden="true"></span>Senac Arapongas <i aria-hidden="true">/</i> Aula 01</p>
          <h1 id="cover-title">Descomplicando a<br><em>Inteligência Artificial</em></h1>
          <p class="cover-intro">Sua jornada de descoberta, construção e uso responsável da IA.</p>
          <a class="cover-cta" href="#/prompt">${icon('prompt')} Abrir Prompt Lab</a>
        </div>
      </section>
      <section class="module-section" aria-labelledby="modules-title">
        <div class="module-heading"><span class="section-kicker"><i></i> Apoio opcional</span><h2 id="modules-title">Área do Aluno</h2></div>
        <div class="home-cards">
          <a class="home-card" href="#/prompt"><div class="card-top"><span class="feature-icon">${icon('prompt')}</span><div class="ctfr-motif" aria-hidden="true"><b>C</b><b>T</b><b>F</b><b>R</b></div></div>
            <h3>Prompt Lab</h3><p>Monte seu comando com contexto, tarefa, formato e restrições.</p><span class="card-action">Montar um prompt</span></a>
          <a class="home-card library-card" href="#/biblioteca"><div class="card-top"><span class="feature-icon">${icon('book')}</span><div class="library-motif" aria-hidden="true"><i></i><i></i><i></i></div></div>
            <h3>Biblioteca de Copiar Rápido</h3><p>Copie as demandas do desafio e os comandos de refinamento de cada trilha.</p><span class="card-action">Explorar a biblioteca</span></a>
        </div>
      </section>
      <aside class="paper-note">${icon('paper')}<p><strong>Seu registro é no papel.</strong> Use o material impresso para o Diário de Bordo, a Batalha das IAs e as fichas dos Guardiões.</p></aside>`;
  }
  function render(focus) {
    if (typeof window.Instructor?.cleanup==='function') window.Instructor.cleanup();
    const route=location.hash.startsWith('#/') ? location.hash.slice(2) : document.documentElement.dataset.entry+location.search;
    const page=route.split('?')[0].replace(/\/$/,'') || 'aluno';
    const timer=/^timer\/(5|6|10|12|13|27)$/.test(page);
    const known=timer || Object.hasOwn(titles,page);
    const title=titles[page] || (timer ? 'Cronômetro de '+page.split('/')[1]+' min' : 'Página não encontrada');
    const area=['aluno','prompt','biblioteca'].includes(page) ? 'aluno' : (known ? 'instrutor' : '');
    document.querySelectorAll('[data-area]').forEach(el=>{
      if (el.dataset.area===area) el.setAttribute('aria-current',page===area?'page':'location');
      else el.removeAttribute('aria-current');
    });
    document.body.dataset.page=page.split('/')[0];
    document.title=(page==='aluno'?'AI QUEST LAB — Descomplicando a Inteligência Artificial':title+' · AI Quest Lab');
    crumbs.replaceChildren();
    if (['prompt','biblioteca','referencias'].includes(page)) {
      crumbs.innerHTML='<nav aria-label="Caminho da página" class="crumbs"><a href="#/'+area+'">'+titles[area]+'</a><span aria-hidden="true">/</span><span>'+title+'</span></nav>';
    }
    view.replaceChildren();
    if (page==='aluno') home();
    else if (page==='prompt'||page==='biblioteca') window.Student.render(page,view);
    else if (page==='referencias') window.References.render(page,view);
    else if (known) window.Instructor.render(route,view);
    else view.innerHTML='<h1>Página não encontrada</h1><a href="#/aluno">Voltar à Área do Aluno</a>';
    if (focus) {main.focus({preventScroll:true});window.scrollTo(0,0);}
  }
  document.querySelector('.skip').addEventListener('click',event=>{event.preventDefault();main.focus();main.scrollIntoView();});
  document.addEventListener('click',event=>{
    const link=event.target.closest?.('a[href^="#/"]');
    if (!link || event.defaultPrevented || event.button!==0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const next=link.getAttribute('href');
    if (location.hash!==next) location.hash=next;
    else main.focus();
  });
  window.addEventListener('hashchange',()=>render(true));
  render(false);
})();
