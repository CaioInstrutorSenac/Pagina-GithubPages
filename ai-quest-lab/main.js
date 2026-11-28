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
        'Mantenha a proposta de uma página e entregue, como peça adicional, um resumo para WhatsApp com as mesmas condições.'
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

  const levels = [
    {
      title: 'Explorador de IA', image: './assets/nivel-01.webp?v=50215e5496ab', block: 'Bloco 01',
      action: 'Escolha uma das seis demandas e envie o pedido como está. Guarde a resposta e registre uma qualidade ou um problema no Word.',
      link: '#/biblioteca?trilha=cego', label: 'Escolher uma demanda'
    },
    {
      title: 'Engenheiro de Prompts', image: './assets/nivel-02.webp?v=912ed36f1863', block: 'Bloco 02',
      action: 'Reescreva o mesmo pedido com contexto, tarefa, formato e restrições. Abra uma conversa nova na mesma ferramenta. Compare a primeira resposta com a anterior e justifique sua avaliação.',
      link: '#/prompt', label: 'Montar meu CTFR'
    },
    {
      title: 'Analista de IA', image: './assets/nivel-03.webp?v=b312da834049', block: 'Bloco 03',
      action: 'Escolha Gestão ou Comercial. Guarde o pedido inicial e faça três refinamentos na mesma conversa. Na Batalha, compare as primeiras respostas ao mesmo CTFR em duas ferramentas.',
      link: '#/biblioteca?trilha=a', label: 'Abrir as trilhas'
    },
    {
      title: 'Detetive Digital', image: './assets/nivel-04.webp?v=58a5d36255c2', block: 'Bloco 04',
      action: 'Investigue fontes, privacidade, vieses e autoria. Registre dois riscos e uma ação preventiva para sua rotina.',
      link: '#/referencias', label: 'Consultar as fontes'
    },
    {
      title: 'Guardiões da IA', image: './assets/nivel-05.webp?v=17807ff75617', block: 'Bloco 05',
      action: 'Anote os nomes da dupla no Word. Uma pessoa reescreve o pedido e a outra confere os riscos e a resposta. Testem apenas o prompt corrigido. Troquem de papel aos 13 min 30 s.',
      link: '#/prompt', label: 'Montar o prompt corrigido'
    },
    {
      title: 'Consultor de Inovação', image: './assets/nivel-06.webp?v=53fd312b8f27', block: 'Bloco 06',
      action: 'Após a ficha individual de saída, anote o problema da sua rotina que quer levar para a Aula 2. Salve e feche o caderno para a coleta pelo Net Monitor.',
      closing: 'Depois que o instrutor confirmar o recebimento, saia das contas e exclua apenas sua cópia da Área de Trabalho. Na Lixeira, remova só esse arquivo.'
    }
  ];

  function journey() {
    const cards = levels.map((level, i) => `<details class="sl-level" name="student-level">
      <summary><img class="sl-level-art" src="${level.image}" alt="" width="125" height="144" loading="lazy">
        <span class="sl-level-intro"><span class="sl-level-index">Nível 0${i + 1} · ${i === 5 ? 'Prévia da Aula 2' : 'Aula 1'}</span>
        <strong>${level.title}</strong><span class="sl-level-block">${level.block} no Word</span></span>
        <span class="sl-level-toggle">${icon('expand')}</span></summary>
      <div class="sl-level-body"><p>${level.action}</p>
        ${level.closing ? `<p><strong>Antes de sair.</strong> ${level.closing}</p>` : ''}
        ${level.link ? `<a href="${level.link}">${level.label}</a>` : ''}</div></details>`).join('');
    return `<section class="sl-journey" aria-labelledby="sl-journey-title"><div class="sl-journey-heading">
      <h2 id="sl-journey-title">Seu percurso no Caderno Digital</h2>
      <p>Abra um nível para consultar a atividade. Os cinco primeiros acontecem na Aula 1. O Bloco 06 prepara a oficina seguinte.</p></div>
      <div class="sl-levels">${cards}</div></section>`;
  }

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

  async function copyWithFeedback(button, value, region, currentValue) {
    if (!value) return;
    const copied = await copyText(value);
    if (!button.isConnected || (currentValue && currentValue() !== value)) return;
    if (copied) {
      region.textContent = 'Texto copiado.';
      if (currentValue) return;
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
          <div class="sl-tools"><h3>Abra sua ferramenta de IA</h3><p>Comece com uma ferramenta. A segunda entra na Batalha das IAs, no slide 21.</p><div>
            <a href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer">ChatGPT ${icon('external')}<span class="sl-sr">, abre em outra aba</span></a>
            <a href="https://gemini.google.com/" target="_blank" rel="noopener noreferrer">Gemini ${icon('external')}<span class="sl-sr">, abre em outra aba</span></a>
          </div></div>
          <details class="sl-practice"><summary>Como testar este prompt</summary><div>
            <p><strong>Demonstração do slide 16.</strong> Se faltar informação, peça três perguntas de esclarecimento antes da resposta.</p>
            <p><strong>Bloco 02.</strong> Teste o CTFR em uma conversa nova na mesma ferramenta. Compare as respostas, confira os fatos e registre o que mudou no Word.</p>
          </div></details>
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
    copy.addEventListener('click', () => copyWithFeedback(copy, composed(), feedback, composed));
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

  const criteria = ['Clareza da resposta', 'Respeito ao formato solicitado', 'Cumprimento das restrições', 'Adequação ao contexto', 'Utilidade prática no trabalho ou na rotina'];
  const comparisonTools = ['ChatGPT', 'Gemini'];
  const comparison = { scores: comparisonTools.map(() => Array(criteria.length).fill(0)), result: '' };

  function renderComparison(collection) {
    const choices = [...comparisonTools, 'Empate'];
    const totals = () => comparison.scores.map(column => column.every(Boolean) ? column.reduce((a, b) => a + b, 0) : null);
    const rows = criteria.map((name, r) => {
      const cells = comparisonTools.map((tool, c) => {
        const options = [0, 1, 2, 3, 4, 5].map(n => `<option value="${n}"${comparison.scores[c][r] === n ? ' selected' : ''}>${n || '—'}</option>`).join('');
        return `<td><select data-score="${c}-${r}" aria-label="${name}, ${tool}">${options}</select></td>`;
      }).join('');
      return `<tr><th scope="row">${name}</th>${cells}</tr>`;
    }).join('');
    collection.innerHTML = `<div class="sl-collection-intro"><h2 id="sl-collection-title">Batalha das IAs</h2>
      <p>Em uma conversa nova de cada ferramenta, cole o mesmo CTFR. Guarde a primeira resposta de cada uma. Se só houver uma ferramenta disponível, use a segunda resposta projetada pelo instrutor.</p></div>
      <div class="sl-battle"><div class="sl-score-panel"><table><caption>Notas de 1 a 5 por critério</caption>
        <thead><tr><th scope="col">Critério</th>${comparisonTools.map(tool => `<th scope="col">${tool}</th>`).join('')}</tr></thead><tbody>${rows}</tbody>
        <tfoot><tr><th scope="row">Total · 5 a 25</th><td data-total="0" aria-live="polite"></td><td data-total="1" aria-live="polite"></td></tr></tfoot></table></div>
        <aside class="sl-verdict"><fieldset><legend>Qual resposta atende melhor a esta tarefa?</legend>
          ${choices.map(choice => `<label><input type="radio" name="sl-choice" value="${choice}"${choice === comparison.result ? ' checked' : ''}> ${choice}</label>`).join('')}</fieldset>
          <p>Copie a comparação para o painel do Bloco 03, no Word. Justifique sua escolha ou o empate com um trecho e o critério que ele ilustra.</p>
          <div class="sl-score-actions"><button type="button" class="sl-btn sl-btn-light" id="sl-copy-comparison">${icon('copy')}Copiar comparação</button>
          <button type="button" class="sl-clear" id="sl-clear-comparison">Limpar notas</button></div>
          <div class="sl-feedback" role="status"></div></aside></div>`;
    const button = collection.querySelector('#sl-copy-comparison');
    const clear = collection.querySelector('#sl-clear-comparison');
    const feedback = collection.querySelector('.sl-feedback');
    function update() {
      const values = totals();
      collection.querySelectorAll('[data-total]').forEach((el, i) => {
        const count = comparison.scores[i].filter(Boolean).length;
        el.textContent = values[i] ?? (count ? `${count}/5 notas` : '—');
      });
      button.disabled = values.includes(null) || !comparison.result;
      clear.disabled = !comparison.result && !comparison.scores.some(column => column.some(Boolean));
      feedback.textContent = '';
    }
    collection.querySelectorAll('[data-score]').forEach(select => select.addEventListener('change', () => {
      const [column, row] = select.dataset.score.split('-').map(Number);
      comparison.scores[column][row] = Number(select.value);
      update();
    }));
    collection.querySelectorAll('[name="sl-choice"]').forEach(radio => radio.addEventListener('change', () => {
      comparison.result = radio.value;
      update();
    }));
    function resultText() {
      const [a, b] = totals();
      return [
        'Batalha das IAs — Bloco 03',
        ...criteria.map((name, i) => `${name}: ChatGPT ${comparison.scores[0][i]} | Gemini ${comparison.scores[1][i]}`),
        `Total: ChatGPT ${a} | Gemini ${b}`, 'Escolha para a tarefa: ' + comparison.result
      ].join('\n');
    }
    button.addEventListener('click', () => copyWithFeedback(button, resultText(), feedback, resultText));
    clear.addEventListener('click', () => {
      comparison.scores.forEach(column => column.fill(0));
      comparison.result = '';
      collection.querySelectorAll('[data-score]').forEach(select => { select.value = '0'; });
      collection.querySelectorAll('[name="sl-choice"]').forEach(radio => { radio.checked = false; });
      update();
      feedback.textContent = 'Notas e escolha limpas.';
      collection.querySelector('[data-score]').focus();
    });
    update();
  }

  function initialLibraryGroup() {
    const query = location.hash.startsWith('#/') ? location.hash.split('?')[1] : location.search;
    const group = new URLSearchParams(query).get('trilha');
    return ['a', 'b', 'batalha'].includes(group) ? group : 'cego';
  }

  function renderLibrary(root) {
    root.innerHTML = `<div class="sl-page"><header class="sl-heading"><h1>Biblioteca de Copiar Rápido</h1>
      <p>Escolha a demanda inicial, refine o pedido da sua trilha ou compare as respostas da Batalha.</p></header>
      <div class="sl-lib-filters" role="group" aria-label="Atividade"><button type="button" data-group="cego" aria-pressed="true">Desafio Prompt Cego</button><button type="button" data-group="a" aria-pressed="false">Trilha A · Gestão</button><button type="button" data-group="b" aria-pressed="false">Trilha B · Comercial</button><button type="button" data-group="batalha" aria-pressed="false">Batalha das IAs</button></div>
      <section id="sl-collection" aria-labelledby="sl-collection-title"></section></div>`;
    const collection = root.querySelector('#sl-collection');
    const groupButtons = [...root.querySelectorAll('[data-group]')];
    function show(group) {
      groupButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.group === group)));
      if (group === 'batalha') {
        renderComparison(collection);
        return;
      }
      const values = { report: reportText };
      let cards = '';
      let title = 'Desafio Prompt Cego';
      let guide = 'Slide 07 · Escolha uma demanda e envie o texto como está em uma ferramenta. Registre o pedido, a resposta e sua observação no Bloco 01 do Word.';
      if (group === 'cego') {
        cards = blindCards.map(([name, content, shape], i) => {
          values[i] = content;
          return libraryCard('Demanda ' + (i + 1), name, content, shape, i, i === 4);
        }).join('');
      } else {
        const track = tracks[group];
        title = track.title;
        guide = 'Slide 19 · Abra uma conversa nova e monte seu CTFR a partir da tarefa. Guarde a primeira versão. Slide 20 · Faça os três refinamentos nessa mesma conversa. Após cada rodada, confira o formato e as restrições e registre o que melhorou no Bloco 03.';
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
    show(initialLibraryGroup());
  }

  window.Student = {
    journey,
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
    {id:'08', slide:'08', name:'Desafio Prompt Cego', min:10, task:'Registre no Bloco 01 o primeiro prompt e uma qualidade ou um problema da resposta.'},
    {id:'18', slide:'18', name:'Antes e depois do CTFR', min:10, task:'Compare no Bloco 02 a mesma demanda, na mesma ferramenta, em conversa nova. Some os cinco critérios de cada resposta (5 a 25). Encerre a Ação Inicial no minuto 90.'},
    {id:'19', slide:'19', name:'Laboratório de reescrita', min:13, task:'No Nível 03 do Caderno Digital, escolha Gestão ou Comercial e comece a reescrita em conversa nova.'},
    {id:'20', slide:'20', name:'Rodadas de refinamento', min:12, task:'Use a mesma conversa nas três rodadas. Confira formato e restrições a cada resposta. Na trilha comercial, a versão para WhatsApp é uma entrega adicional à proposta original.'},
    {id:'21', slide:'21', name:'Batalha das IAs', min:6, task:'Em conversas novas, use o mesmo CTFR no ChatGPT e no Gemini. Avalie as duas respostas de 5 a 25 e justifique a escolha ou o empate.'},
    {id:'intervalo', slide:'22', name:'Intervalo', min:10, task:'Combine o horário de retorno. Confirme com a unidade se o intervalo integra as quatro horas.'},
    {id:'35', slide:'35', name:'Guardiões da IA', min:27, task:'No Bloco 05, registrem os nomes e os papéis. Por missão, entreguem quatro justificativas, o CTFR corrigido e a conferência humana. Testem na IA apenas o prompt corrigido.'},
    {id:'38', slide:'38', name:'Desafio individual de saída', min:5, task:'Na ficha de saída, escreva seu CTFR e dois cuidados para aplicá-lo. Salve o Word. O Bloco 06 vem no slide 39, antes da coleta via Net Monitor.'}
  ];

  const resources = [
    ['galeria','image','Humano ou IA?','Vote e revele a origem de cada exemplo.','02'],
    ['banco','text','Eu fui ao banco para…','Compare duas continuações com a turma.','12'],
    ['detetive','search','Detetive Digital','Investigue fontes, privacidade, vieses e autoria.','24–28'],
    ['guardioes','shield','Guardiões da IA','Ouça a dupla e revele o comentário da missão.','30–36'],
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
    let backgroundOverflow = '';
    function update() {
      const active = document.fullscreenElement === area || area.classList.contains('il-overlay');
      btn.querySelector('span').textContent = active ? 'Sair da tela cheia' : 'Tela cheia';
      btn.setAttribute('aria-pressed',String(active));
    }
    function exitOverlay() {
      if (area.classList.contains('il-overlay')) {
        document.body.style.overflow = backgroundOverflow;
        area.removeAttribute('role');
        area.removeAttribute('aria-modal');
        area.removeAttribute('aria-label');
        btn.focus({preventScroll:true});
      }
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
        catch {
          backgroundOverflow = document.body.style.overflow;
          document.body.style.overflow = 'hidden';
          area.classList.add('il-overlay');
          area.setAttribute('role','dialog');
          area.setAttribute('aria-modal','true');
          area.setAttribute('aria-label',area.querySelector('h1').textContent);
          btn.focus({preventScroll:true});
        }
      }
      update();
    };
    function handleKeys(e) {
      if (!area.classList.contains('il-overlay')) return;
      if (e.key === 'Escape') exitOverlay();
      if (e.key !== 'Tab') return;
      const stops = [...area.querySelectorAll('a[href],button:not(:disabled),summary')].filter(el => el.getClientRects().length);
      const edge = e.shiftKey ? stops[0] : stops[stops.length - 1];
      if (document.activeElement === edge) {
        e.preventDefault();
        (e.shiftKey ? stops[stops.length - 1] : stops[0]).focus();
      }
    }
    document.addEventListener('fullscreenchange',update);
    document.addEventListener('keydown',handleKeys);
    dispose.push(() => {
      document.removeEventListener('fullscreenchange',update);
      document.removeEventListener('keydown',handleKeys);
      if (document.fullscreenElement === area) document.exitFullscreen().catch(() => {});
      exitOverlay();
    });
  }

  function shell(title, slide, content, intro='') {
    return '<section class="il-page"><div class="il-tools">' + back + fullscreenButton() + '</div>' +
      '<header class="il-header"><div class="il-kicker">' + slide + '</div><h1>' + title + '</h1>' +
      (intro ? '<p>' + intro + '</p>' : '') + '</header>' + content + '</section>';
  }

  function activityShell(title, level, image, action, content) {
    return '<section class="il-page"><div class="il-tools">' + back + fullscreenButton() + '</div>' +
      '<header class="il-activity-banner"><div class="il-feature-copy"><div class="il-kicker">' + level + '</div><h1>' + title + '</h1>' + action +
      '</div><img src="' + image + '" alt=""></header>' + content + '</section>';
  }

  function landing(root) {
    const schedule = activities.map(a =>
      '<a class="il-schedule-row" href="#/timer/' + a.min + '?a=' + a.id + '"><span class="il-min"><b>' + a.min + '</b> min</span><span class="il-row-label"><strong>' + a.name + '</strong><small>' + (a.slide ? 'Slide ' + a.slide : 'Pausa da turma') + '</small></span>' + icon('chevron') + '</a>'
    ).join('');
    const modules = resources.map(([path, mark, title, desc, slide]) =>
      '<a class="il-resource" href="#/' + path + '"><span class="il-mark">' + icon(mark) + '</span><span class="il-row-label"><strong>' + title + '</strong><span>' + (slide ? 'Slide ' + slide + ' · ' : '') + desc + '</span></span>' + icon('chevron') + '</a>'
    ).join('');
    root.innerHTML = '<section class="il-page"><div class="il-hero"><div class="il-hero-content"><div class="il-kicker"><i></i> Projeção em sala</div><h1>Central do Instrutor</h1><p>Conduza a aula com cronômetros, dinâmicas e gabaritos para projetar.</p>' + fullscreenButton() + '</div><div class="il-clock-art" aria-hidden="true"><div class="il-dial"><i></i><b></b><em></em></div></div></div>' +
      '<div class="il-checkpoints" aria-label="Marcos da aula"><div><strong>0–90 min</strong><span>Ação Inicial · slides 01–18</span></div><div><strong>90–180 min</strong><span>Reflexão · slides 19–29</span></div><div><strong>180–240 min</strong><span>Ação Final · slides 30–40</span></div></div>' +
      '<div class="il-columns"><section><div class="il-section-head"><span class="il-section-icon">' + icon('clock') + '</span><h2>Cronômetros da aula</h2></div><div class="il-list">' + schedule + '</div></section>' +
      '<section><div class="il-section-head"><span class="il-section-icon">' + icon('layers') + '</span><h2>Dinâmicas e materiais</h2></div><div class="il-list">' + modules + '</div>' +
      '<details class="il-details il-lab-guide"><summary>Roteiro do laboratório e Net Monitor</summary><div><p><strong>Slide 05.</strong> Envie Caderno_Digital_Aluno_Aula_01_IA.docx para a Área de Trabalho pelo Net Monitor. Cada estudante salva sua cópia como Caderno_IA_SeuNome.docx. Demonstre Windows + Seta Esquerda no navegador e Windows + Seta Direita no Word.</p><p><strong>Slides 18 e 22.</strong> Encerre a Ação Inicial aos 90 min. Se houver atraso, compare com dois voluntários. O roteiro inclui o intervalo de 10 min no slide 22. Confirme com a unidade se a pausa integra as quatro horas.</p><p><strong>Slide 29.</strong> Proteja os 60 minutos finais. Se precisar, encurte o mini-teste de vieses do slide 27 com o exemplo pronto.</p><p><strong>Slides 38–40.</strong> Prepare a coleta no 38. Depois do Bloco 06 no 39, recolha Caderno_IA_*.docx pelo Net Monitor e confira cada entrega. No 40, peça logout das contas e exclusão somente da cópia pessoal recebida, inclusive na Lixeira. Reiniciar a estação não garante logout. O checklist de bolso está na <a href="#/biblioteca">Biblioteca</a>.</p></div></details></section></div></section>';
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
      (minutes === 27 ? '<p class="il-role-note">' + icon('group') + '<span data-role-note></span></p>' : '') + '</div>' +
      (activity ? '<aside class="il-timer-task"><h2>Caderno e condução</h2><p>' + activity.task + '</p>' +
        (activity.id === '35' ? '<p>Na primeira missão, A reescreve e B audita. Na segunda, invertam os papéis. Na terceira, trabalhem juntos. Com turma iniciante, completem duas missões e resolvam a terceira com a turma no slide 36.</p>' : '') + '</aside>' : ''));
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
      const note = [messages[state], swap ? 'Hora de inverter os papéis!' : last ? 'Último minuto' : ''].filter(Boolean).join(' · ') || 'Em andamento';
      if (status.textContent !== note) status.textContent = note;
      if (minutes === 27) {
        const role = box.querySelector('[data-role-note]');
        const cue = remaining > total / 2 ? 'A é engenheiro, B é auditor. Invertam aos 13min30s.' : 'Após a inversão, B é engenheiro e A é auditor. Façam a terceira missão juntos.';
        if (role.textContent !== cue) role.textContent = cue;
      }
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
    {letter:'A', src:'./assets/galeria-a.webp?v=39375bbb7fcb', alt:'Ceramista no ateliê, com peças e prateleiras ao fundo.', step:1, origin:'Gerada por IA'},
    {letter:'B', src:'./assets/galeria-b.webp?v=8d0d5baeb236', alt:'Banca de laranjas sob um toldo de feira.', step:2, origin:'Gerada por IA'},
    {letter:'C', src:'./assets/galeria-c.webp?v=52042e6112ae', alt:'Mãos modelando argila em um torno visto de cima.', step:3, origin:'Fotografia · Chandan Singh'},
    {letter:'D', src:'./assets/galeria-d.webp?v=4eb410d93c98', alt:'Laranjas verdes e amarelas vistas de perto.', step:3, origin:'Fotografia · Wilfredor'}
  ];
  const gallerySteps = [
    {button:'Revelar A', status:'Votação aberta'},
    {button:'Revelar B', status:'1 de 4 · A foi gerada por IA.'},
    {button:'Revelar C, D e E', status:'2 de 4 · B também foi gerada por IA.'},
    {button:'Revelar conclusão', status:'3 de 4 · C e D são fotografias. E foi escrito com IA.'},
    {button:'Concluído', status:'4 de 4 · Conclusão revelada.'}
  ];

  function gallery(root) {
    const tiles = galleryItems.map(item => `
      <figure class="il-gallery-tile" aria-label="Imagem ${item.letter}">
        <img src="${item.src}" alt="${item.alt}" width="1440" height="597">
        <figcaption><b class="il-gallery-letter">${item.letter}</b>
          <span class="il-gallery-origin" data-origin="${item.letter}" data-step="${item.step}" hidden>${item.origin}</span>
        </figcaption>
      </figure>`).join('');
    const votes = ['A','B','C','D','E'].map(letter => `
      <label>${letter === 'E' ? 'Texto' : 'Imagem'} ${letter}
        <select data-vote="${letter}">
          <option value="">Sem registro</option><option>Humano</option><option>IA</option><option>Não dá para saber</option>
        </select>
      </label>`).join('');
    root.innerHTML = `
      <section class="il-page il-gallery-page">
        <div class="il-tools">${back}${fullscreenButton()}</div>
        <div class="il-gallery-head">
          <header class="il-header"><div class="il-kicker">Slide 02</div><h1>Humano ou IA?</h1>
            <p>Vote em cada exemplo: humano, IA ou não dá para saber.</p>
          </header>
          <div class="il-gallery-controls">
            <button class="il-btn il-primary" type="button" data-reveal aria-controls="il-gallery-content">${icon('eye')}<span>Revelar A</span></button>
            <button class="il-btn il-outline" type="button" data-gallery-reset>${icon('reset')}Reiniciar</button>
            <span class="il-gallery-status" role="status" data-gallery-status>Votação aberta</span>
          </div>
        </div>
        <div id="il-gallery-content">
          <div class="il-gallery-wall">${tiles}</div>
          <div class="il-gallery-message"><b class="il-gallery-letter" aria-label="Texto E">E</b>
            <blockquote>“Olá! O modelo que você procurou voltou ao estoque. Quer que eu confirme as cores disponíveis antes de você vir à loja?”</blockquote>
            <span class="il-gallery-text-origin" data-origin="E" data-step="3" hidden>Texto de IA</span>
          </div>
          <p id="il-origins" class="il-gallery-conclusion" data-step="4" hidden>A aparência convincente de um conteúdo não comprova sua origem, autenticidade ou veracidade.</p>
        </div>
        <details class="il-gallery-votes" data-gallery-votes>
          <summary>Hipóteses da turma</summary>
          <p>Registre a hipótese mais votada por letra antes de revelar as origens.</p><div>${votes}</div>
        </details>
        <section class="il-gallery-credits" data-step="3" hidden aria-label="Créditos das fotografias">
          <h2>Créditos das fotografias</h2>
          <p><b>C</b> · Chandan Singh, <a href="https://commons.wikimedia.org/wiki/File:Potter_wheel_(4268605790).jpg" target="_blank" rel="noopener noreferrer" lang="en">Potter wheel</a> (2009). Recorte sob <a href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noopener noreferrer">CC BY 2.0</a>.</p>
          <p><b>D</b> · Wilfredor, <a href="https://commons.wikimedia.org/wiki/File:Oranges_of_Sa%C3%BAde_flea_market,_S%C3%A3o_Paulo,_Brazil.jpg" target="_blank" rel="noopener noreferrer" lang="en">Oranges of Saúde flea market, São Paulo, Brazil</a> (2017). Recorte sob <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</a>.</p>
        </section>
      </section>`;
    let step = 0;
    const reveal = root.querySelector('[data-reveal]');
    const reset = root.querySelector('[data-gallery-reset]');
    const votePanel = root.querySelector('[data-gallery-votes]');
    const choices = [...votePanel.querySelectorAll('select')];
    const answers = [...root.querySelectorAll('[data-step]')];
    const status = root.querySelector('[data-gallery-status]');
    function showStep() {
      answers.forEach(answer => { answer.hidden = Number(answer.dataset.step) > step; });
      choices.forEach(choice => { choice.disabled = step !== 0; });
      reveal.querySelector('span').textContent = gallerySteps[step].button;
      reveal.disabled = step === gallerySteps.length - 1;
      status.textContent = gallerySteps[step].status;
    }
    reveal.onclick = () => {
      if (step === 0) votePanel.open = false;
      if (step < gallerySteps.length - 1) step++;
      showStep();
      if (reveal.disabled) reset.focus({preventScroll:true});
    };
    reset.onclick = () => {
      step = 0;
      choices.forEach(choice => { choice.selectedIndex = 0; });
      votePanel.open = false;
      showStep();
      reveal.focus({preventScroll:true});
    };
  }

  function projectionControls() {
    return '<div class="il-projection-controls"><button type="button" class="il-btn il-primary" data-next></button><button type="button" class="il-btn il-outline" data-previous>Voltar uma etapa</button><span class="il-stage-status" role="status"></span></div>';
  }

  function wireProjection(panel, labels) {
    const next = panel.querySelector('[data-next]');
    const previous = panel.querySelector('[data-previous]');
    const status = panel.querySelector('[role="status"]');
    const staged = [...panel.querySelectorAll('[data-stage]')];
    staged.forEach((element, index) => {
      if (!element.id) element.id = panel.id + '-passo-' + index;
    });
    const ids = staged.map(element => element.id).join(' ');
    next.setAttribute('aria-controls', ids);
    previous.setAttribute('aria-controls', ids);
    let step = 0;
    function paint() {
      staged.forEach(element => {
        element.hidden = Number(element.dataset.stage) > step;
        if (element.hidden) element.querySelectorAll('details[open]').forEach(detail => { detail.open = false; });
      });
      panel.dataset.currentStep = step;
      previous.disabled = step === 0;
      next.textContent = step === labels.length ? 'Recomeçar' : labels[step];
      status.textContent = 'Etapa ' + step + ' de ' + labels.length;
    }
    next.onclick = () => { step = step === labels.length ? 0 : step + 1; paint(); };
    previous.onclick = () => { step = Math.max(0, step - 1); paint(); if (!step) next.focus(); };
    paint();
  }

  function bank(root) {
    const contexts = [
      {name:'FINANÇAS', endings:['sacar dinheiro','pagar uma conta','falar com o gerente']},
      {name:'PRAÇA', endings:['me sentar','descansar','conversar']}
    ];
    const cards = contexts.map((context, i) =>
      '<section class="il-context" data-stage="' + (i+1) + '" hidden><div class="il-kicker">Contexto ' + (i+1) + '</div><h2>' + context.name + '</h2><ul>' +
      context.endings.map((ending, j) => '<li>…' + ending + '<span class="il-bar" aria-hidden="true"><i style="width:' + [80,59,32][j] + '%"></i></span></li>').join('') +
      '</ul><small>Ilustração didática. As barras não representam probabilidades medidas.</small></section>').join('');
    root.innerHTML = '<section class="il-page"><div class="il-tools">' + back + fullscreenButton() + '</div><section class="il-bank" id="il-bank">' +
      '<div class="il-kicker">Slide 12 · 1. Sem contexto</div><h1>Eu fui ao banco para<span>...</span></h1>' + projectionControls() +
      '<div class="il-contexts">' + cards + '</div><div class="il-didactic-note" data-stage="3" hidden><strong>Nota didática</strong><p>O contexto muda as continuações plausíveis. As barras ilustram o exercício.</p></div></section></section>';
    wireProjection(root.querySelector('#il-bank'), ['Revelar contexto 1','Revelar contexto 2','Revelar nota didática']);
  }

  const suspects = [
    ['Instituto','Quem publicou?','Procure o órgão em canais institucionais. O instituto foi inventado para o exercício.'],
    ['2026','Onde está o relatório?','Localize a publicação original e confira sua data.'],
    ['78% em 30 dias','Como foi medido?','Busque a amostra, o período e a metodologia. A estatística foi inventada para a atividade.']
  ];
  const privacy = [
    ['A','Nome completo e CPF do cliente','Não enviar','Identificam a pessoa. Use um cenário inteiramente fictício.'],
    ['B','Tipo genérico de produto','Avaliar o contexto','Uma categoria genérica pode servir ao exercício. Confira se está associada a informações internas.'],
    ['C','Senha do sistema interno','Não enviar','Exclua credenciais de qualquer texto de exemplo.'],
    ['D','Quantidade genérica de itens','Avaliar o contexto','Prefira uma quantidade inventada e desvinculada de pedidos ou clientes reais.'],
    ['E','Número de cartão bancário','Não enviar','Remova dados financeiros antes de escrever o comando.'],
    ['F','Diagnóstico médico de funcionário','Não enviar','Informações de saúde são dados pessoais sensíveis.'],
    ['G','Tom de voz desejado para o e-mail','Avaliar o contexto','Um tom como “cordial” dispensa dados de clientes. Confira a política institucional.']
  ];

  function sourceLink(url, text) {
    return '<a class="il-link" href="' + url + '" target="_blank" rel="noreferrer">' + text + '</a>';
  }

  function documented(stage, title, copy, links) {
    return '<div class="il-documented" data-stage="' + stage + '" hidden><div class="il-kicker">' + icon('book') + ' Caso real documentado</div><h3>' + title + '</h3><p>' + copy + '</p><div class="il-source-links">' + links + '</div></div>';
  }

  function detector(root) {
    const clue = i => '<span class="il-suspect">' + ['Instituto Nacional de Produtividade Digital','2026','78%'][i] + '</span>';
    const hallucination = '<div class="il-kicker">Cenário didático fictício · Slide 25</div><h2>Que evidências sustentam essa afirmação?</h2><blockquote>“Segundo o ' + clue(0) + ', em seu relatório de ' + clue(1) + ', empresas que utilizam IA aumentam suas vendas em ' + clue(2) + ' nos primeiros 30 dias.”</blockquote>' +
      '<div class="il-evidence-grid" data-stage="1" hidden>' + suspects.map(([term, prompt, explanation]) => '<details class="il-details"><summary><small>' + term + '</small>' + prompt + '</summary><div><p>' + explanation + '</p></div></details>').join('') + '</div>' +
      documented(2,'Mata v. Avianca · 2023','Advogados citaram decisões judiciais inexistentes produzidas por IA. A corte federal dos EUA aplicou sanções em 22 de junho de 2023.',sourceLink('https://www.nhd.uscourts.gov/sites/default/files/pdf/Mata-v-Avianca-sanctions-order.PDF','Ler a decisão judicial (PDF)')) +
      '<div class="il-didactic-note" data-stage="3" hidden><strong>Regra do Detetive</strong><p>Não encontrar uma fonte em uma pesquisa rápida não permite validar a afirmação. Sem evidências suficientes, não a utilize como fato.</p></div>';

    const privacyPanel = '<div class="il-kicker">Privacidade e LGPD · Slide 26</div><h2>O que pode entrar em uma IA pública?</h2><p>Classifiquem os sete itens antes de revelar o gabarito.</p><ul class="il-ballot">' +
      privacy.map(([letter,name,risk,reason]) => '<li><b>' + letter + '</b><span>' + name + '</span><div data-stage="1" hidden><strong>' + risk + '</strong><span>' + reason + '</span></div></li>').join('') + '</ul>' +
      '<p class="il-reminder" data-stage="1" hidden>Remova dados e credenciais dos itens A, C, E e F. Para B, D e G, considere o contexto, a finalidade e a política institucional.</p>' +
      '<div class="il-didactic-note" data-stage="2" hidden><strong>Mascarar ≠ anonimizar</strong><p>Cargo, data e valores ainda podem identificar a pessoa chamada de “Cliente A”. O exemplo com CPF e salários é fictício.</p></div>' +
      documented(2,'Samsung · 2023','Após o envio de código interno ao ChatGPT, a empresa restringiu o uso de ferramentas de IA generativa em seus dispositivos.',sourceLink('https://techcrunch.com/2023/05/02/samsung-bans-use-of-generative-ai-tools-like-chatgpt-after-april-internal-data-leak/','Samsung · reportagem aberta') + sourceLink('https://news.bloomberglaw.com/tech-and-telecom-law/samsung-bans-staffs-ai-use-after-spotting-chatgpt-data-leak-2','Samsung · prévia Bloomberg') + sourceLink('https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm','LGPD · arts. 5º e 6º') + sourceLink('https://www.gov.br/anpd/pt-br','Portal da ANPD'));

    const bias = '<div class="il-kicker">Vieses · Slide 27</div><h2>Como um modelo pode reproduzir vieses?</h2><ol class="il-flow" data-stage="1" hidden>' +
      ['Dados históricos desiguais','Treinamento do modelo','Possível reprodução de vieses','Revisão humana'].map((label,i) => '<li style="--il-step:' + i + '"><b>' + (i+1) + '</b>' + label + '</li>').join('') + '</ol>' +
      documented(2,'Amazon · 2018','Uma ferramenta experimental de seleção penalizava referências a mulheres em currículos. A empresa abandonou o projeto.',sourceLink('https://www.theguardian.com/technology/2018/oct/10/amazon-hiring-ai-gender-bias-recruiting-engine','Ler a reportagem da Reuters')) +
      '<section class="il-didactic-note" data-stage="3" hidden><strong>Mini-investigação · 2 min</strong><p>“Descreva um dia de trabalho em liderança executiva e em enfermagem.” Que suposições apareceram? Uma única resposta neutra não explica a causa nem comprova ausência de vieses.</p><details class="il-details"><summary>Usar um exemplo pronto</summary><div><p>Exemplo fictício: “O executivo prepara a estratégia enquanto a enfermeira acolhe a família.” Que informação sustentaria a escolha do gênero? Reescrevam com responsabilidades e competências observáveis.</p></div></details></section>';
    const ethics = '<div class="il-kicker">Ética e autoria · Slide 28</div><h2>O que conferir antes de publicar?</h2><p>Pense em uma imagem que sua equipe quer usar num anúncio.</p><ol class="il-checks">' +
      '<li data-stage="1" hidden><strong>Direitos autorais e licenças</strong><span>Identifique as obras de terceiros e confira se a licença permite o uso pretendido.</span>' + sourceLink('https://www.planalto.gov.br/ccivil_03/leis/l9610.htm','Lei de Direitos Autorais') + '</li>' +
      '<li data-stage="2" hidden><strong>Revisão e responsabilidade</strong><span>Confira as informações e decida como indicar a participação da IA.</span>' + sourceLink('https://www.unesco.org/en/articles/guidance-generative-ai-education-and-research','Guia da UNESCO') + '</li>' +
      '<li data-stage="3" hidden><strong>Política institucional</strong><span>Verifique quais ferramentas, contas e tipos de informação a organização autoriza.</span></li></ol>';
    const topics = [
      ['Alucinações', hallucination, ['Destacar as pistas','Revelar o caso documentado','Revelar a regra do Detetive']],
      ['Privacidade', privacyPanel, ['Revelar a classificação','Revelar o caso e a base legal']],
      ['Vieses', bias, ['Revelar o fluxograma','Revelar o caso documentado','Abrir a mini-investigação']],
      ['Ética e autoria', ethics, ['Revelar o primeiro pilar','Revelar o segundo pilar','Revelar o terceiro pilar']]
    ];
    root.innerHTML = activityShell('Detetive Digital','Nível 04 · Slides 24 a 28','./assets/nivel-04.webp?v=58a5d36255c2',
      '<details class="il-details"><summary>Revelar o lema do Detetive</summary><div>Bem escrito não significa verdadeiro — e rápido não significa seguro.</div></details>',
      '<div class="il-choices" aria-label="Temas da investigação">' + topics.map(([topic], i) => '<button type="button" class="il-chip" aria-pressed="' + (i === 0) + '" aria-controls="il-topic-' + i + '" data-topic="' + i + '">' + topic + '</button>').join('') + '</div>' +
      topics.map(([,content], i) => '<section class="il-case il-panel" id="il-topic-' + i + '"' + (i ? ' hidden' : '') + '>' + content + projectionControls() + '</section>').join(''));
    const buttons = [...root.querySelectorAll('[data-topic]')];
    const panels = [...root.querySelectorAll('.il-panel')];
    topics.forEach((topic, i) => {
      const panel = panels[i];
      panel.querySelector('h2').after(panel.querySelector('.il-projection-controls'));
      wireProjection(panel, topic[2]);
    });
    buttons.forEach((button,i) => button.onclick = () => {
      buttons.forEach((other,j) => other.setAttribute('aria-pressed',String(i === j)));
      panels.forEach((panel,j) => {panel.hidden = i !== j;});
    });
  }

  const missions = [
    {title:'Vazamento de informações', theme:'Privacidade', diagnosis:'Remover identificadores e dados de saúde. Redigir uma mensagem cordial com foco na negociação e retirar a ameaça de negativação.',
      ctfr:['Você apoia o atendimento de uma empresa fictícia que quer conversar sobre um pagamento pendente.','Convide a pessoa a conhecer os canais de negociação.','Escreva uma mensagem curta de WhatsApp, com saudação e convite para conversar.','Use tom cordial. Omita nomes, valores, documentos e dados de saúde. Não faça ameaças nem prometa condições.'],
      verify:'Leia a mensagem como destinatário. Ela preserva a privacidade, convida à negociação e evita expor ou constranger alguém?'},
    {title:'Informação fantasma', theme:'Alucinação', diagnosis:'Informar os 12 meses da garantia do fabricante previstos na política simulada. Preservar os direitos legais e conferir cada condição. A resposta problemática inventou uma lei, garantia de três anos e troca em 24 horas.',
      ctfr:['Na loja fictícia, a política simulada prevê 12 meses de garantia do fabricante, sem prejuízo dos direitos legais do consumidor. A orientação deve encaminhar para canais oficiais de assistência.','Explique ao cliente como obter orientação sobre a garantia do notebook.','Escreva um e-mail breve, com assunto e até dois parágrafos.','Use apenas a política informada. Não invente leis, links, prazos de atendimento ou condições de troca. Peça informação se faltar um canal de contato.'],
      verify:'Compare cada prazo e condição com a política simulada. Antes de qualquer uso real, confirme a política vigente e o canal oficial.'},
    {title:'Algoritmo injusto', theme:'Viés e ética', diagnosis:'Retirar os filtros de gênero e idade. Descrever as competências da vaga em linguagem inclusiva: atendimento, trabalho em equipe e interesse por tecnologia.',
      ctfr:['Uma loja fictícia de eletrônicos busca uma pessoa para atendimento e vendas.','Redija um anúncio com atividades e competências de atendimento, trabalho em equipe e interesse por tecnologia.','Use título, breve descrição, lista de atividades e lista de requisitos.','Use linguagem inclusiva. Exclua filtros de gênero e idade e estereótipos. Não invente benefícios ou salário.'],
      verify:'Confira se cada requisito se relaciona a uma tarefa da vaga e se a linguagem acolhe candidaturas de perfis diversos.'}
  ];

  function guardians(root) {
    const cards = missions.map((m,i) => '<details class="il-mission"><summary><span class="il-mission-number">0' + (i+1) + '</span><span><small>Gabarito da missão 0' + (i+1) + ' · ' + m.theme + '</small><strong>' + m.title + '</strong></span>' + icon('chevron') + '</summary>' +
      '<div class="il-mission-body"><h2>O que corrigir</h2><p>' + m.diagnosis + '</p><details class="il-details"><summary>Revelar um prompt CTFR possível</summary><dl class="il-ctfr">' +
      ['Contexto','Tarefa','Formato','Restrições'].map((t,j) => '<div><dt>' + t + '</dt><dd>' + m.ctfr[j] + '</dd></div>').join('') + '</dl></details>' +
      '<details class="il-details"><summary>Revelar a conferência final</summary><div><p>' + m.verify + '</p></div></details></div></details>').join('');
    root.innerHTML = activityShell('Guardiões da IA','Nível 05 · Slides 30 a 36','./assets/nivel-05.webp?v=17807ff75617',
      '<a class="il-btn il-outline" href="#/timer/27?a=35">' + icon('clock') + 'Cronômetro da dupla · 27 min</a>',
      '<div class="il-section-head"><h2>O que sua dupla corrigiu?</h2></div><p class="il-mission-intro">No slide 36, ouça a solução e uma justificativa da dupla. Abra somente o gabarito da missão apresentada.</p><div class="il-missions">' + cards + '</div>' +
      '<details class="il-details il-lab-guide"><summary>Conduzir o trabalho em duplas</summary><div><p>Preencham os nomes no Bloco 05 do Word. Testem na IA somente o prompt corrigido com dados fictícios. Por missão, entreguem as quatro justificativas do checklist, a reescrita em CTFR e a conferência humana.</p><p>Justifiquem cada “Sim”, “Não” ou “Não se aplica”. Se faltar uma checagem necessária, registrem a pendência e retomem a verificação após o teste.</p><p>Aos 13min30s, anuncie: “Hora de inverter os papéis!” Para iniciantes, priorize duas missões e resolva a terceira com a turma antes da revelação.</p></div></details>');
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
    },
    {
      name: "Fotografias da galeria",
      items: [
        {
          title: "Potter wheel",
          source: "Chandan Singh · 2009",
          summary: "Fotografia da peça de barro no torno. A aula usa um recorte da imagem original.",
          link: "Consultar a fotografia e a autoria",
          url: "https://commons.wikimedia.org/wiki/File:Potter_wheel_(4268605790).jpg",
          license: ["CC BY 2.0", "https://creativecommons.org/licenses/by/2.0/"]
        },
        {
          title: "Oranges of Saúde flea market, São Paulo, Brazil",
          source: "Wilfredor · 2017",
          summary: "Fotografia de laranjas na feira da Saúde, em São Paulo. O recorte usado na aula mantém a licença da fotografia.",
          link: "Consultar a fotografia e a autoria",
          url: "https://commons.wikimedia.org/wiki/File:Oranges_of_Sa%C3%BAde_flea_market,_S%C3%A3o_Paulo,_Brazil.jpg",
          license: ["CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0/"]
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
        <p>Consulte as fontes dos estudos de caso, as orientações e os créditos das fotografias usadas na aula.</p>
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
                ${item.license ? `<a class="ref-license" href="${item.license[1]}" rel="noreferrer">Licença ${item.license[0]}</a>` : ""}
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
        <div class="cover-body"><p class="cover-meta"><span aria-hidden="true"></span>Senac Arapongas <i aria-hidden="true">/</i> Aula 01 · 4 horas</p>
          <h1 id="cover-title">Descomplicando a<br><em>Inteligência Artificial</em></h1>
          <p class="cover-intro">Como usar a IA no trabalho e na vida</p>
          <div class="cover-actions"><a class="cover-cta" href="#/prompt">${icon('prompt')} Abrir Prompt Lab</a>
          <a class="cover-library" href="#/biblioteca">${icon('book')} Biblioteca de comandos</a></div>
        </div>
      </section>
      <aside class="notebook"><span class="notebook-icon">${icon('paper')}</span>
        <div><strong>Caderno Digital no Word</strong><p>Abra o arquivo recebido pelo Net Monitor e salve sua cópia como <b>Caderno_IA_SeuNome.docx</b>.</p></div>
        <a href="./Checklist_Bolso_10_Criterios.pdf" download="Checklist_Bolso_10_Criterios.pdf">Baixar o checklist de bolso (PDF)</a>
      </aside>
      ${window.Student.journey()}`;
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
