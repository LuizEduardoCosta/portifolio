(() => {
  'use strict';
  const D = window.PORTFOLIO;
  const desktop = document.getElementById('desktop');
  const desktopIcons = document.querySelector('.desktop-icons');
  const layer = document.getElementById('window-layer');
  const template = document.getElementById('window-template');
  const taskbarWindows = document.getElementById('taskbar-windows');
  const startButton = document.getElementById('start-button');
  const startMenu = document.getElementById('start-menu');
  const startResults = document.getElementById('start-results');
  const startSearch = document.getElementById('start-search');
  const clock = document.getElementById('clock');

  const windowDefs = {
    welcome: { title: 'Bem-vindo', icon: '🪟', render: renderWelcome },
    about: { title: 'Sobre Luiz Eduardo', icon: '👤', render: renderAbout },
    projects: { title: 'Projetos', icon: '📁', render: renderProjects },
    experience: { title: 'Experiência profissional', icon: '💼', render: renderExperience },
    education: { title: 'Formação acadêmica', icon: '🎓', render: renderEducation },
    certifications: { title: 'Cursos e formação complementar', icon: '🏅', render: renderCertifications },
    skills: { title: 'Competências', icon: '📊', render: renderSkills },
    creative: { title: 'Produção criativa', icon: '🖋️', render: renderCreative },
    media: { title: 'Media Player Classic — Luiz Eduardo OS', icon: '🎵', render: renderMediaPlayer },
    lattes: { title: 'Currículo Lattes — Luiz Eduardo de Carvalho Costa', icon: '📄', render: renderLattes },
    linkedin: { title: 'LinkedIn — Luiz Eduardo de Carvalho Costa', icon: 'in', render: renderLinkedIn }
  };

  const openWindows = new Map();
  let topZ = 30;
  let cascade = 0;

  function escapeHTML(v='') {
    return String(v).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]));
  }

  function badge(status) {
    const cls = status.toLowerCase().includes('andamento') ? 'badge live' : 'badge';
    return `<span class="${cls}">${escapeHTML(status)}</span>`;
  }

  const institutionBrands = [
    { match: 'universidade catolica de brasilia ucb/df', short: 'UCB', brandClass: 'brand-ucb', logoUrl: 'https://ucb.catolica.edu.br/hubfs/SITE/logo__catolica--footer.svg', url: 'https://ucb.catolica.edu.br/', alt: 'Logomarca oficial da Universidade Católica de Brasília' },
    { match: 'ucb/df', short: 'UCB', brandClass: 'brand-ucb', logoUrl: 'https://ucb.catolica.edu.br/hubfs/SITE/logo__catolica--footer.svg', url: 'https://ucb.catolica.edu.br/', alt: 'Logomarca oficial da Universidade Católica de Brasília' },
    { match: 'enap', short: 'ENAP', brandClass: 'brand-enap', logoUrl: 'https://www.enap.gov.br/media/original_images/enap_lJB8d6s.svg', url: 'https://www.enap.gov.br/', alt: 'Logomarca oficial da Escola Nacional de Administração Pública — ENAP' },
    { match: 'pucrs', short: 'PUCRS', brandClass: 'brand-pucrs', logoUrl: 'https://biblioteca.pucrs.br/wp-content/uploads/2024/04/logo-pucrs.png', url: 'https://portal.pucrs.br/', alt: 'Logomarca oficial da Pontifícia Universidade Católica do Rio Grande do Sul — PUCRS' },
    { match: 'instituto monte horebe', short: 'IMH', brandClass: 'brand-monte', logoUrl: 'https://institutomontehorebe.com.br/wp-content/uploads/2019/12/logo-1.png', url: 'https://institutomontehorebe.com.br/', alt: 'Logomarca oficial do Instituto Monte Horebe' },
    { match: 'ministerio do planejamento', short: 'MPO', brandClass: 'brand-govbr', logoUrl: 'https://www.enap.gov.br/static/enap_designsystem/icons/logo-white.png', url: 'https://www.gov.br/planejamento/pt-br', alt: 'Identidade visual oficial Gov.br — Governo Federal' }
  ];

  function normalizeText(v='') {
    return String(v).normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[—–-]/g,' ').replace(/\s+/g,' ').trim().toLowerCase();
  }

  function acronymizeInstitution(v='') {
    const stop = new Set(['de','da','do','das','dos','e','em','para','the']);
    const tokens = String(v).replace(/[—–-].*$/,'').split(/\s+/).map(t => t.replace(/[^A-Za-zÀ-ÿ0-9]/g,'')).filter(Boolean);
    const picked = tokens.filter(t => !stop.has(t.toLowerCase()));
    return (picked.slice(0,4).map(t => t[0].toUpperCase()).join('') || 'LOGO').slice(0,5);
  }

  function getInstitutionBrand(name='') {
    const key = normalizeText(name);
    return institutionBrands.find(brand => key.includes(brand.match)) || null;
  }

  function renderInstitutionName(name='') {
    const brand = getInstitutionBrand(name);
    const label = escapeHTML(name);
    if (brand?.url) return `<a class="institution-link" href="${escapeHTML(brand.url)}" target="_blank" rel="noopener noreferrer">${label}</a>`;
    return label;
  }

  function renderInstitutionLogo(name='') {
    const brand = getInstitutionBrand(name);
    const fallback = escapeHTML((brand && brand.short) || acronymizeInstitution(name));
    if (!brand?.logoUrl) return `<div class="institution-logo" aria-hidden="true"><span class="institution-fallback">${fallback}</span></div>`;
    return `<div class="institution-logo ${escapeHTML(brand.brandClass || '')}" title="${escapeHTML(name)}"><img loading="lazy" decoding="async" src="${escapeHTML(brand.logoUrl)}" alt="${escapeHTML(brand.alt || ('Logomarca de ' + name))}" referrerpolicy="no-referrer" onerror="this.style.display='none';this.nextElementSibling.style.display='grid';"><span class="institution-fallback" style="display:none">${fallback}</span></div>`;
  }

  function renderWelcome() {
    return `<div class="page narrow">
      <div class="breadcrumbs">Área de Trabalho › Bem-vindo</div>
      <section class="hero-profile">
        <img class="hero-photo" src="assets/img/profile.jpg" alt="Luiz Eduardo de Carvalho Costa">
        <div>
          <div class="eyebrow">Professional Portfolio</div>
          <h2>${escapeHTML(D.profile.name)}</h2>
          <div class="role-line">${escapeHTML(D.profile.headline)}</div>
          <p class="summary">${escapeHTML(D.profile.summary)}</p>
          <div class="quick-actions">
            <button class="win-btn" data-open="projects" type="button">📁 Ver projetos</button>
            <button class="win-btn" data-open="experience" type="button">💼 Trajetória</button>
            <button class="win-btn" data-open="linkedin" type="button">in LinkedIn</button>
          </div>
        </div>
      </section>
      <section class="stats">${D.highlights.map(h=>`<div class="stat"><strong>${escapeHTML(h.value)}</strong><span>${escapeHTML(h.label)}</span></div>`).join('')}</section>
      <div class="section-title"><h3>Destaques</h3><span class="muted">Seleção do currículo</span></div>
      <div class="cards">
        <div class="card"><div class="card-meta"><span class="badge">Formação</span><span>2019 — 2021</span></div><h4>Análise e Desenvolvimento de Sistemas</h4><p>Graduação pela Universidade Católica de Brasília — UCB/DF.</p></div>
        <div class="card"><div class="card-meta"><span class="badge">Projeto</span><span>2023</span></div><h4>Painel Fomento em Ciência, Tecnologia e Inovação</h4><p>Dashboard voltado ao acompanhamento e à análise de investimentos em CTI.</p></div>
        <div class="card"><div class="card-meta"><span class="badge">Dados</span><span>Atuação atual</span></div><h4>Visualização e processos</h4><p>Interfaces para painéis em Tableau, relatórios, modelagem de processos e gestão de informações.</p></div>
        <div class="card"><div class="card-meta"><span class="badge">Criativo</span><span>2025</span></div><h4>Entre a Lâmina e o Espelho</h4><p>Livro publicado pela UICLAP, além de registros fonográficos em produção artística/cultural.</p></div>
      </div>
      <div class="about-note">Este portfólio apresenta uma síntese dos dados públicos registrados no Currículo Lattes. A atuação profissional no CNPq é descrita conforme os vínculos com empresas prestadoras de serviço registrados no currículo.</div>
    </div>`;
  }

  function renderAbout() {
    return `<div class="page narrow">
      <div class="breadcrumbs">Perfil › Sobre mim</div>
      <section class="hero-profile">
        <img class="hero-photo" src="assets/img/profile.jpg" alt="Luiz Eduardo de Carvalho Costa">
        <div>
          <div class="eyebrow">${escapeHTML(D.profile.location)}</div>
          <h2>${escapeHTML(D.profile.name)}</h2>
          <div class="role-line">${escapeHTML(D.profile.role)}</div>
          <p class="summary">${escapeHTML(D.profile.summary)}</p>
          <div class="quick-actions">
            <a class="win-link" href="${D.profile.links.lattes}" target="_blank" rel="noopener noreferrer">📄 Currículo Lattes ↗</a>
            <button class="win-btn" data-open="linkedin" type="button">in LinkedIn</button>
            <a class="win-link" href="${D.profile.links.cnpq}" target="_blank" rel="noopener noreferrer">🏛 CNPq ↗</a>
          </div>
        </div>
      </section>
      <div class="section-title"><h3>Identidade profissional</h3></div>
      <div class="cards">
        <div class="card"><h4>Integração entre gestão e tecnologia</h4><p>Trajetória administrativa construída ao longo de mais de duas décadas, com modernização de rotinas, controles e acompanhamento de informações.</p></div>
        <div class="card"><h4>Dados para decisão</h4><p>Experiência com Business Intelligence, Tableau, relatórios, organização de dados e construção de visualizações voltadas à compreensão de informações complexas.</p></div>
        <div class="card"><h4>Processos e documentação</h4><p>Atuação com SEI, modelagem de processos, documentos oficiais, contratos, Termos de Referência e acompanhamento de fluxos administrativos.</p></div>
        <div class="card"><h4>Aprendizado contínuo</h4><p>Formação complementar em proteção de dados, Excel, estatística, análise de dados, gestão financeira de TI, SEI e processamento de linguagem natural.</p></div>
      </div>
      <div class="about-note">Nome em citações bibliográficas: <strong>${escapeHTML(D.profile.citationName)}</strong>. ${escapeHTML(D.profile.organizationContext)}.</div>
    </div>`;
  }

  function renderProjects() {
    return `<div class="page">
      <div class="breadcrumbs">Computador › Portfólio › Projetos</div>
      <h2>Projetos</h2><p class="page-lead">Projetos de desenvolvimento e programas de computador registrados no Currículo Lattes.</p>
      <div class="project-grid">${D.projects.map(p=>`<article class="project-card">
        <div class="project-head"><div class="card-meta">${badge(p.status)}<span>${escapeHTML(p.period)}</span></div><h4>${escapeHTML(p.title)}</h4><div class="muted">${escapeHTML(p.type)}</div></div>
        <div class="project-content"><p>${escapeHTML(p.description)}</p><div class="tags">${p.tags.map(t=>`<span class="tag">${escapeHTML(t)}</span>`).join('')}</div><div class="project-foot"><span>${escapeHTML(p.team)}</span>${p.url?`<a class="win-link" href="${p.url}" target="_blank" rel="noopener noreferrer">Abrir painel ↗</a>`:''}</div></div>
      </article>`).join('')}</div>
      <div class="section-title"><h3>Programas de computador sem registro</h3><span class="muted">Produção técnica</span></div>
      <div class="software-list">${D.software.map(s=>`<div class="software-item"><div class="software-icon">⚙</div><div><strong>${escapeHTML(s.name)}</strong><span>${escapeHTML(s.full)} · ${escapeHTML(s.year)}</span></div></div>`).join('')}</div>
    </div>`;
  }

  function renderExperience() {
    return `<div class="page">
      <div class="breadcrumbs">Perfil › Experiência profissional</div>
      <h2>Trajetória profissional</h2><p class="page-lead">Uma evolução que começa no suporte operacional e avança para gestão, tecnologia, dados, visualização e melhoria de processos.</p>
      <div class="timeline">${D.experience.map(e=>`<article class="timeline-item"><div class="timeline-period">${escapeHTML(e.period)}</div><div class="timeline-content"><h4>${escapeHTML(e.role)}</h4><div class="company">${escapeHTML(e.company)}</div><div class="context">${escapeHTML(e.context)}</div><ul>${e.bullets.map(b=>`<li>${escapeHTML(b)}</li>`).join('')}</ul></div></article>`).join('')}</div>
    </div>`;
  }

  function renderEducation() {
    return `<div class="page narrow">
      <div class="breadcrumbs">Perfil › Formação acadêmica</div>
      <h2>Formação acadêmica</h2><p class="page-lead">Base acadêmica em tecnologia complementada por formação contínua em dados, gestão, privacidade e ferramentas administrativas.</p>
      ${D.education.map(e=>`<div class="timeline-content with-logo">${renderInstitutionLogo(e.institution)}<div class="timeline-text"><div class="card-meta"><span class="badge">Graduação</span><span>${escapeHTML(e.period)}</span></div><h4 style="font-size:18px;margin-top:10px">${escapeHTML(e.title)}</h4><div class="company">${renderInstitutionName(e.institution)}</div><p class="page-lead" style="margin:8px 0 0">${escapeHTML(e.note)}</p></div></div>`).join('')}
      <div class="section-title"><h3>Formação complementar em destaque</h3><button class="win-btn" data-open="certifications" type="button">Ver todos os cursos</button></div>
      <div class="cards">
        ${D.certifications.slice(0,6).map(c=>`<div class="card edu-feature-card"><div class="card-meta"><span class="badge">${escapeHTML(c.year)}</span><span>${escapeHTML(c.hours)}</span></div><div class="edu-feature-main"><div>${renderInstitutionLogo(c.institution)}</div><div class="edu-feature-copy"><h4>${escapeHTML(c.title)}</h4><p>${renderInstitutionName(c.institution)}</p></div></div></div>`).join('')}
      </div>
    </div>`;
  }

  function renderCertifications() {
    return `<div class="page">
      <div class="breadcrumbs">Perfil › Formação complementar</div>
      <h2>Cursos e aperfeiçoamento</h2><p class="page-lead">Seleção da formação complementar registrada no Currículo Lattes, organizada do período mais recente para o mais antigo.</p>
      <div class="course-list">${D.certifications.map(c=>`<div class="course"><div class="course-year">${escapeHTML(c.year)}</div><div class="course-main"><div>${renderInstitutionLogo(c.institution)}</div><div class="course-copy"><h4>${escapeHTML(c.title)}</h4><p>${renderInstitutionName(c.institution)} · ${escapeHTML(c.hours)}</p></div></div></div>`).join('')}</div>
    </div>`;
  }

  const LATTES_PDF = 'assets/docs/curriculo-lattes-luiz-eduardo.pdf';

  function renderLattes() {
    const pdf = `${LATTES_PDF}#view=FitH&toolbar=1&navpanes=0`;
    const pdfFile = LATTES_PDF;
    return `<div class="lattes-shell">
      <div class="lattes-toolbar">
        <div class="lattes-toolbar-left"><span aria-hidden="true">📄</span><strong>Currículo Lattes — versão PDF integrada ao portfólio</strong></div>
        <div class="lattes-toolbar-actions">
          <a class="win-link" href="${pdfFile}" target="_blank" rel="noopener noreferrer">Abrir PDF ↗</a>
          <a class="win-link" href="${escapeHTML(D.profile.links.lattes)}" target="_blank" rel="noopener noreferrer">Versão online ↗</a>
        </div>
      </div>
      <object class="lattes-viewer" data="${pdf}" type="application/pdf" aria-label="Currículo Lattes de Luiz Eduardo de Carvalho Costa">
        <iframe class="lattes-viewer" src="${pdf}" title="Currículo Lattes de Luiz Eduardo de Carvalho Costa"></iframe>
        <div class="lattes-fallback"><div><strong>Visualização de PDF não disponível neste navegador.</strong><p>Use o botão “Abrir PDF” acima para consultar o currículo.</p></div></div>
      </object>
    </div>`;
  }

  // O <object> cai no conteúdo alternativo quando o navegador não renderiza PDF,
  // mas não quando o arquivo simplesmente não foi publicado — daí a checagem.
  function bindLattes(el) {
    if (!/^https?:$/.test(location.protocol)) return;
    const viewer = el.querySelector('object.lattes-viewer');
    if (!viewer) return;
    fetch(LATTES_PDF, { method: 'HEAD' })
      .then(res => { if (!res.ok) throw new Error(String(res.status)); })
      .catch(() => {
        const alt = document.createElement('div');
        alt.className = 'lattes-fallback';
        alt.innerHTML = '<div><strong>PDF do currículo ainda não publicado.</strong>' +
          '<p>Use “Versão online” na barra acima para abrir o Lattes.</p></div>';
        viewer.replaceWith(alt);
      });
  }

  function renderLinkedIn() {
    const photo = document.querySelector('.start-profile img')?.getAttribute('src') || '';
    const exp = D.experience || [];
    const edu = D.education || [];
    const skills = (D.skills || []).flatMap(g => g.items || []).slice(0,18);
    return `<div class="linkedin-shell">
      <div class="linkedin-topbar">
        <div class="linkedin-brand"><span class="linkedin-logo">in</span><strong>Visualização integrada ao portfólio</strong></div>
        <a class="win-link" href="${escapeHTML(D.profile.links.linkedin)}" target="_blank" rel="noopener noreferrer">Abrir perfil oficial ↗</a>
      </div>
      <div class="linkedin-wrap">
        <section class="linkedin-card">
          <div class="linkedin-banner"></div>
          <div class="linkedin-profile-head">
            ${photo?`<img class="linkedin-photo" src="${photo}" alt="${escapeHTML(D.profile.name)}">`:''}
            <div class="linkedin-profile-copy">
              <h2>${escapeHTML(D.profile.name)}</h2>
              <p class="linkedin-headline">${escapeHTML(D.profile.headline)}</p>
              <div class="linkedin-location">${escapeHTML(D.profile.location)} · Tecnologia, dados, BI, processos e produção criativa</div>
              <div class="linkedin-actions">
                <button class="win-btn" data-open="projects" type="button">📁 Projetos</button>
                <button class="win-btn" data-open="experience" type="button">💼 Experiência</button>
                <button class="win-btn" data-open="education" type="button">🎓 Formação</button>
              </div>
            </div>
          </div>
        </section>
        <section class="linkedin-card linkedin-section">
          <h3>Sobre</h3>
          <p>${escapeHTML(D.profile.summary)}</p>
          <div class="linkedin-note">Esta janela mantém a navegação dentro do Luiz Eduardo OS. O botão “Abrir perfil oficial” fica disponível caso o visitante queira consultar diretamente a página pública no LinkedIn.</div>
        </section>
        <section class="linkedin-card linkedin-section">
          <h3>Experiência</h3>
          ${exp.map(e=>`<article class="linkedin-entry"><div class="linkedin-entry-icon">💼</div><div><h4>${escapeHTML(e.role)}</h4><div class="meta"><strong>${escapeHTML(e.company)}</strong> · ${escapeHTML(e.period)}<br>${escapeHTML(e.context||'')}</div>${e.bullets?.length?`<ul>${e.bullets.slice(0,4).map(b=>`<li>${escapeHTML(b)}</li>`).join('')}</ul>`:''}</div></article>`).join('')}
        </section>
        <section class="linkedin-card linkedin-section">
          <h3>Formação</h3>
          ${edu.map(e=>`<article class="linkedin-entry"><div class="linkedin-entry-icon">🎓</div><div><h4>${escapeHTML(e.title)}</h4><div class="meta"><strong>${escapeHTML(e.institution)}</strong> · ${escapeHTML(e.period)}</div></div></article>`).join('')}
        </section>
        <section class="linkedin-card linkedin-section">
          <h3>Competências em destaque</h3>
          <div class="linkedin-skills">${skills.map(item=>`<span class="linkedin-skill">${escapeHTML(item)}</span>`).join('')}</div>
        </section>
      </div>
    </div>`;
  }

  function renderSkills() {
    return `<div class="page narrow">
      <div class="breadcrumbs">Computador › Competências</div>
      <h2>Competências</h2><p class="page-lead">Competências extraídas das atividades, projetos e formações registradas no currículo. Sem porcentagens arbitrárias: o foco aqui é evidência de uso.</p>
      <div class="skill-groups">${D.skills.map(g=>`<section class="skill-group"><h4>${escapeHTML(g.group)}</h4><div class="skill-list">${g.items.map(i=>`<span class="skill">${escapeHTML(i)}</span>`).join('')}</div></section>`).join('')}</div>
      <div class="about-note">A seção prioriza tecnologias e competências explicitamente mencionadas no Currículo Lattes. Outras tecnologias podem ser adicionadas quando você quiser consolidar também o conteúdo completo do LinkedIn.</div>
    </div>`;
  }

  function renderCreative() {
    return `<div class="page narrow">
      <div class="breadcrumbs">Biblioteca › Produção artística, musical e bibliográfica</div>
      <h2>Produção criativa</h2><p class="page-lead">Literatura publicada, projetos artísticos e discografia documentada com capas, datas, UPCs, faixas, ISRCs e créditos de produção.</p>
      <div class="creative-hero">
        <div class="creative-panel"><div class="big-icon">📖</div><div class="eyebrow">Literatura · ${escapeHTML(D.creative.book.year)}</div><h3>${escapeHTML(D.creative.book.title)}</h3><p>${escapeHTML(D.creative.book.edition)}</p></div>
        <div class="creative-panel"><div class="big-icon">🎧</div><div class="eyebrow">Música autoral</div><h3>Projetos & discografia</h3><p><strong>${D.creative.channels.length}</strong> projetos artísticos · <strong>${D.creative.releases.length}</strong> lançamentos documentados, com identificadores e créditos por faixa.</p></div>
      </div>

      <div class="section-title"><h3>Literatura</h3><span class="muted">Livro publicado</span></div>
      <section class="book-feature" aria-label="Detalhes do livro ${escapeHTML(D.creative.book.title)}">
        <img class="book-cover" loading="lazy" decoding="async" src="${escapeHTML(D.creative.book.coverUrl)}" alt="Capa do livro ${escapeHTML(D.creative.book.title)}">
        <div class="book-copy">
          <div class="eyebrow">Romance · ${escapeHTML(D.creative.book.year)}</div>
          <h3>${escapeHTML(D.creative.book.title)}</h3>
          <p class="book-tagline">${escapeHTML(D.creative.book.subtitle)}</p>
          <p class="book-synopsis">${escapeHTML(D.creative.book.synopsis)}</p>
          <div class="book-meta-grid">
            <div class="book-meta-item"><span>Publicação</span><strong>${escapeHTML(D.creative.book.publicationDate)}</strong></div>
            <div class="book-meta-item"><span>Editora</span><strong>${escapeHTML(D.creative.book.publisher)}</strong></div>
            <div class="book-meta-item"><span>Páginas</span><strong>222</strong></div>
            <div class="book-meta-item"><span>Formato</span><strong>${escapeHTML(D.creative.book.format)}</strong></div>
            <div class="book-meta-item"><span>Acabamento</span><strong>${escapeHTML(D.creative.book.cover)}</strong></div>
            <div class="book-meta-item"><span>Impressão</span><strong>${escapeHTML(D.creative.book.print)}</strong></div>
            <div class="book-meta-item"><span>Gêneros</span><strong>${escapeHTML(D.creative.book.genres)}</strong></div>
            <div class="book-meta-item"><span>Créditos</span><strong>${escapeHTML(D.creative.book.roles)}</strong></div>
            <div class="book-meta-item"><span>ISBN</span><strong>${escapeHTML(D.creative.book.isbn)}</strong></div>
            <div class="book-meta-item"><span>Classificação</span><strong>${escapeHTML(D.creative.book.audience)}</strong></div>
          </div>
          <div class="quick-actions">
            <a class="win-link" href="${escapeHTML(D.creative.book.storeUrl)}" target="_blank" rel="noopener noreferrer">Ver / comprar na UICLAP ↗</a>
            <a class="win-link secondary" href="${escapeHTML(D.creative.book.authorUrl)}" target="_blank" rel="noopener noreferrer">Perfil de autor ↗</a>
          </div>
        </div>
      </section>
      <div class="identity-strip"><strong>Identificador internacional de autor</strong><code>ISNI ${escapeHTML(D.creative.authorIdentity.isni)}</code><span>Função: ${escapeHTML(D.creative.authorIdentity.role)} · Fonte: ${escapeHTML(D.creative.authorIdentity.source)}</span><a class="win-link secondary" href="${escapeHTML(D.creative.authorIdentity.url)}" target="_blank" rel="noopener noreferrer">Consultar ISNI ↗</a></div>

      <div class="section-title"><h3>Projetos artísticos</h3><span class="muted">biografia · streaming · redes · letras</span></div>
      <div class="artist-profile-grid">
        ${D.creative.channels.map(c=>`<article class="artist-profile-card">
          <div class="artist-profile-top"><div class="artist-avatar">${c.logoUrl ? `<img loading="lazy" decoding="async" src="${escapeHTML(c.logoUrl)}" alt="Identidade visual de ${escapeHTML(c.name)}">` : `<span aria-hidden="true">${c.name.split(/\s+/).map(w=>w[0]).join('').slice(0,2).toUpperCase()}</span>`}</div><div><div class="eyebrow">Projeto artístico</div><h3>${escapeHTML(c.name)}</h3><div class="artist-subline">${escapeHTML(c.since)} · ${escapeHTML(c.genre)}</div>${c.roles?`<div class="artist-subline"><strong>${escapeHTML(c.roles)}</strong></div>`:''}</div></div>
          <p class="artist-bio">${escapeHTML(c.description)}</p>${c.name==='Cicatriz Invisível'?`<div class="release-credit-summary"><strong>Atuação de Luiz Eduardo:</strong> composição, letras, guitarra, baixo, produção e masterização documentadas em diferentes fonogramas do projeto.</div>`:c.name==='Filho Pródigo'?`<div class="release-credit-summary"><strong>Atuação de Luiz Eduardo:</strong> composição, letras, vocais, guitarra, baixo e produção documentadas nos lançamentos informados.</div>`:''}
          ${c.platforms?.length?`<div class="artist-platforms" aria-label="Plataformas de ${escapeHTML(c.name)}">${c.platforms.map(p=>`<a href="${escapeHTML(p.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(p.label)} ↗</a>`).join('')}</div>`:''}
        </article>`).join('')}
      </div>
      <div class="about-note">Os links acima conectam o portfólio às páginas públicas oficiais informadas para cada projeto. YouTube e serviços de streaming funcionam como camada de audição; o Letras.com reúne parte das letras já publicadas.</div>

      <div class="section-title"><h3>Discografia — lançamentos detalhados</h3><span class="muted">Dado Ziul · Cicatriz Invisível · Filho Pródigo · 2024 — 2026</span></div>
      <div class="release-summary" aria-label="Resumo dos lançamentos detalhados">
        <div class="creative-stat"><strong>${D.creative.releases.length}</strong><span>lançamentos documentados</span></div>
        <div class="creative-stat"><strong>${D.creative.releases.filter(r=>r.type==='Álbum').length}</strong><span>álbuns</span></div>
        <div class="creative-stat"><strong>${D.creative.releases.filter(r=>r.type==='Mini álbum').length}</strong><span>mini álbuns</span></div>
        <div class="creative-stat"><strong>${D.creative.releases.filter(r=>r.type==='Single').length}</strong><span>singles</span></div>
        <div class="creative-stat"><strong>${D.creative.releases.reduce((n,r)=>n+r.tracks.length,0)}</strong><span>faixas nas edições documentadas</span></div>
      </div>
      ${D.creative.channels.map(c=>c.name).map(artist=>`
        <div class="release-artist-heading">${escapeHTML(artist)} · ${D.creative.releases.filter(r=>r.artist===artist).length} lançamentos</div>
        <div class="release-grid">
          ${D.creative.releases.filter(r=>r.artist===artist).map(r=>`<article class="release-card ${r.type==='Single'?'single':''} ${r.type==='Mini álbum'?'mini':''} ${r.artist==='Cicatriz Invisível'?'cicatriz':''}">
            <div class="release-card-header">
              <div class="release-art">${r.coverUrl ? `<img loading="lazy" decoding="async" src="${escapeHTML(r.coverUrl)}" alt="Capa de ${escapeHTML(r.title)}">` : `<div class="release-art-text" aria-hidden="true">${escapeHTML(r.title)}</div>`}</div>
              <div>
                <div class="release-kicker">${escapeHTML(r.type)} · Lançado</div>
                <h4 class="release-title">${escapeHTML(r.title)}</h4>
                <div class="release-artist">${escapeHTML(r.artist)}</div>
                ${r.edition?`<div class="release-edition">${escapeHTML(r.edition)}</div>`:''}
                <div class="release-meta">
                  <span class="release-chip">${escapeHTML(r.releaseDate)}</span>
                  <span class="release-chip">${r.tracks.length} ${r.tracks.length===1?'faixa':'faixas'}</span>
                  <span class="release-chip">${escapeHTML(r.totalDuration)}</span>
                  <span class="release-chip">${escapeHTML(r.genre)}</span>
                </div>
                <div class="release-source-line"><span>Gravadora: <strong>${escapeHTML(r.label)}</strong></span><span>UPC <code class="release-upc">${escapeHTML(r.upc)}</code></span></div>
                ${r.creditSummary?`<div class="release-credit-summary"><strong>Créditos:</strong> ${escapeHTML(r.creditSummary)}</div>`:''}
                <div class="release-player-actions"><button type="button" class="release-play-btn" data-media-release="${escapeHTML(r.artist)}||${escapeHTML(r.title)}" data-media-track="0">▶ Abrir no Media Player</button></div>
              </div>
            </div>
            <details class="release-details">
              <summary>Ver faixas e identificadores</summary>
              <table class="track-table">
                <thead><tr><th class="track-no">#</th><th>Faixa</th><th class="track-duration">Duração</th><th class="track-isrc">ISRC</th></tr></thead>
                <tbody>${r.tracks.map(t=>`<tr><td class="track-no">${t.no}</td><td class="track-title-wrap"><strong>${escapeHTML(t.title)}</strong>${t.composer?`<details class="track-credit-details"><summary>Créditos completos</summary><div class="track-credit-grid">${t.version?`<span>Versão<br><strong>${escapeHTML(t.version)}</strong></span>`:''}<span>Compositor<br><strong>${escapeHTML(t.composer)}</strong></span>${t.lyricist?`<span>Letrista<br><strong>${escapeHTML(t.lyricist)}</strong></span>`:''}${t.performers?.length?t.performers.map(p=>`<span>${escapeHTML(p.role||'Músico')}<br><strong>${escapeHTML(p.name)}</strong></span>`).join(''):(t.musician?`<span>${escapeHTML(t.instrument||'Músico')}<br><strong>${escapeHTML(t.musician)}</strong></span>`:'')}${t.producer?`<span>Produção<br><strong>${escapeHTML(t.producer)}</strong></span>`:''}${t.masteringEngineer?`<span>Masterização<br><strong>${escapeHTML(t.masteringEngineer)}</strong></span>`:''}<span>Artista principal<br><strong>${escapeHTML(t.primaryArtist||r.artist)}</strong></span>${t.lyricsLanguage?`<span>Letra<br><strong>${escapeHTML(t.lyricsLanguage)}${t.explicit?` · ${escapeHTML(t.explicit)}`:''}</strong></span>`:''}</div></details>`:''}</td><td class="track-duration">${escapeHTML(t.duration)}</td><td class="track-isrc">${t.isrc?`<code>${escapeHTML(t.isrc)}</code>`:'<span class="track-isrc-missing">não informado</span>'}</td></tr>`).join('')}</tbody>
              </table>
            </details>
          </article>`).join('')}
        </div>`).join('')}
      <div class="about-note">As durações totais foram calculadas a partir das durações individuais informadas. O Media Player do portfólio foi reformulado para usar o widget oficial do Deezer por lançamento; cada álbum ou single poderá ser vinculado por sua URL/ID no Deezer, mantendo a reprodução dentro da página. Os lançamentos de Cicatriz Invisível exibem créditos por faixa, incluindo composição, letras, instrumentos, produção e masterização conforme os dados informados; “Ao Apagar das Luzes” permanece identificado como versão ao vivo, com seus seis ISRCs próprios. Os lançamentos de Dado Ziul incluem créditos de composição, letras, vocais, produção, artista principal, idioma e indicação de conteúdo explícito conforme os dados fornecidos. Filho Pródigo passa a reunir seis lançamentos documentados, com 31 faixas e créditos de composição, letras, vocais, guitarra, baixo e produção; “Na Tua Mesa” e “Quem fez o Céu?” estão identificados como demos, e “No Silêncio, Te Encontro” como versão ao vivo. As capas exibidas na discografia foram fornecidas pelo autor a partir dos links oficiais informados para cada lançamento.</div>
    </div>`;
  }

  let pendingMediaSelection = null;
  let mediaController = null;

  function renderMediaPlayer() {
    return `<div class="mpc-shell${new URLSearchParams(location.search).get('curadoria')==='1'?' curation':''}" data-mpc-root>
      <aside class="mpc-library" aria-label="Biblioteca musical"><div class="mpc-library-title">Biblioteca</div><div data-mpc-library></div></aside>
      <section class="mpc-main">
        <div class="mpc-menu"><span>Arquivo</span><span>Exibir</span><span>Reproduzir</span><span>Navegar</span><span>Ajuda</span></div>
        <div class="mpc-screen-wrap"><div class="mpc-screen"><div class="mpc-deezer-host" data-mpc-deezer-host></div><div class="mpc-placeholder" data-mpc-placeholder></div></div></div>
        <div class="mpc-controls deezer-controls">
          <div class="mpc-deezer-bar"><span class="mpc-deezer-brand">DEEZER WEB WIDGET</span><span class="mpc-now" data-mpc-now>Nenhum lançamento selecionado</span></div>
          <div class="mpc-deezer-hint">A reprodução, pausa, volume e seleção de faixa são controlados diretamente pelo player oficial do Deezer acima.</div>
        </div>
        <div class="mpc-status"><span data-mpc-status>Pronto</span><span><a class="mpc-external" data-mpc-external target="_blank" rel="noopener noreferrer" hidden>Abrir no Deezer ↗</a><button class="mpc-btn mpc-curation" type="button" data-mpc-link>Vincular Deezer</button></span></div>
      </section>
    </div>`;
  }

  function deezerMapKey(release) { return `${release?.artist||''}||${release?.title||''}`; }
  function readDeezerMap() {
    try { return JSON.parse(localStorage.getItem('luiz-eduardo-deezer-release-map') || '{}'); } catch { return {}; }
  }
  function writeDeezerMap(map) { try { localStorage.setItem('luiz-eduardo-deezer-release-map', JSON.stringify(map)); } catch {} }
  function parseDeezerSource(value='') {
    const v=String(value).trim();
    if (!v) return null;
    if (/^\d+$/.test(v)) return { type:'album', id:v, url:`https://www.deezer.com/album/${v}` };
    let m=v.match(/deezer\.com\/(?:[a-z]{2}\/)?(album|track)\/(\d+)/i);
    if (!m) m=v.match(/widget\.deezer\.com\/widget\/[^/]+\/(album|track)\/(\d+)/i);
    if (!m) return null;
    const type=m[1].toLowerCase(), id=m[2];
    return { type, id, url:`https://www.deezer.com/${type}/${id}` };
  }
  function getDeezerSource(release) {
    if (!release) return null;
    if (release.deezerAlbumId) return { type:'album', id:String(release.deezerAlbumId), url:release.deezerUrl||`https://www.deezer.com/album/${release.deezerAlbumId}` };
    if (release.deezerTrackId) return { type:'track', id:String(release.deezerTrackId), url:release.deezerUrl||`https://www.deezer.com/track/${release.deezerTrackId}` };
    if (release.deezerUrl) {
      const parsed=parseDeezerSource(release.deezerUrl);
      if (parsed) return {...parsed, url:release.deezerUrl};
    }
    const saved=readDeezerMap()[deezerMapKey(release)];
    if (!saved) return null;
    if (typeof saved==='string') return parseDeezerSource(saved);
    return saved?.id ? saved : null;
  }
  function deezerWidgetUrl(source) {
    return source ? `https://widget.deezer.com/widget/dark/${encodeURIComponent(source.type||'album')}/${encodeURIComponent(source.id)}` : '';
  }

  function bindMediaPlayer(el) {
    const root=el.querySelector('[data-mpc-root]'); if(!root) return;
    const releases=D.creative.releases;
    const lib=root.querySelector('[data-mpc-library]');
    const host=root.querySelector('[data-mpc-deezer-host]'), placeholder=root.querySelector('[data-mpc-placeholder]');
    const now=root.querySelector('[data-mpc-now]'), status=root.querySelector('[data-mpc-status]'), external=root.querySelector('[data-mpc-external]');
    let releaseIndex=Math.max(0,releases.findIndex(r=>pendingMediaSelection && `${r.artist}||${r.title}`===pendingMediaSelection.releaseKey));
    let trackIndex=Math.max(0,Math.min((pendingMediaSelection?.trackIndex||0),releases[releaseIndex].tracks.length-1));
    pendingMediaSelection=null;
    const artistOrder=['Dado Ziul','Cicatriz Invisível','Filho Pródigo'];
    const currentRelease=()=>releases[releaseIndex];

    function drawLibrary(){
      lib.innerHTML=artistOrder.map(a=>`<div class="mpc-artist-group"><div class="mpc-artist-label">${escapeHTML(a)}</div>${releases.map((r,i)=>r.artist===a?`<button type="button" class="mpc-album-btn ${i===releaseIndex?'active':''}" data-mpc-album="${i}">${r.coverUrl?`<img loading="lazy" decoding="async" src="${escapeHTML(r.coverUrl)}" alt="">`:'<span></span>'}<span><strong>${escapeHTML(r.title)}</strong><span>${escapeHTML(r.type)} · ${r.tracks.length} faixas${getDeezerSource(r)?' · Deezer ✓':''}</span></span></button>`:'').join('')}</div>`).join('');
    }
    function renderRelease(){
      const r=currentRelease(), source=getDeezerSource(r);
      now.textContent=`${r.title} — ${r.artist}`;
      drawLibrary();
      if(source){
        const src=deezerWidgetUrl(source);
        host.innerHTML=`<iframe title="Deezer — ${escapeHTML(r.artist)} — ${escapeHTML(r.title)}" src="${escapeHTML(src)}" width="100%" height="100%" frameborder="0" allowtransparency="true" allow="encrypted-media; clipboard-write" loading="lazy"></iframe>`;
        host.style.display='block';
        placeholder.style.display='none';
        external.hidden=false;
        external.href=source.url||`https://www.deezer.com/${source.type||'album'}/${source.id}`;
        external.textContent='Abrir lançamento no Deezer ↗';
        status.textContent='Fonte: widget oficial do Deezer · controles integrados ao player';
      } else {
        host.innerHTML=''; host.style.display='none';
        placeholder.style.display='grid';
        placeholder.innerHTML=`${r.coverUrl?`<img loading="lazy" decoding="async" src="${escapeHTML(r.coverUrl)}" alt="Capa de ${escapeHTML(r.title)}">`:''}<div><strong>${escapeHTML(r.title)}</strong><span>${escapeHTML(r.artist)} · ${escapeHTML(r.type)} · ${r.tracks.length} faixas<br>UPC ${escapeHTML(r.upc||'—')}<br><br>Este lançamento ainda não possui o link do Deezer cadastrado. Assim que a URL do álbum/single for vinculada, o player oficial será carregado aqui.</span></div>`;
        external.hidden=true; external.removeAttribute('href');
        status.textContent='Aguardando vínculo do lançamento no Deezer';
      }
    }

    root.addEventListener('click',e=>{
      const a=e.target.closest('[data-mpc-album]');
      if(a){ releaseIndex=Number(a.dataset.mpcAlbum); trackIndex=0; renderRelease(); return; }
      if(e.target.closest('[data-mpc-link]')){
        const r=currentRelease();
        const raw=prompt(`Cole a URL do lançamento no Deezer (álbum/single) ou o ID do álbum para:\n${r.artist} — ${r.title}`);
        if(!raw) return;
        const source=parseDeezerSource(raw);
        if(!source){ alert('Não consegui reconhecer uma URL/ID de álbum ou faixa do Deezer.'); return; }
        const map=readDeezerMap(); map[deezerMapKey(r)]=source; writeDeezerMap(map); renderRelease();
      }
    });

    drawLibrary(); renderRelease();
    mediaController={
      destroy(){ host.innerHTML=''; },
      select(releaseKey,index=0){
        const i=releases.findIndex(r=>`${r.artist}||${r.title}`===releaseKey);
        if(i>=0){ releaseIndex=i; trackIndex=Math.max(0,Math.min(Number(index)||0,releases[i].tracks.length-1)); renderRelease(); }
      }
    };
  }

  function buildStartResults(filter='') {
    const all = [
      ['about','👤','Sobre mim','Perfil e apresentação'],
      ['projects','📁','Projetos','Dashboards e sistemas'],
      ['experience','💼','Experiência','Trajetória profissional'],
      ['education','🎓','Formação','Graduação e aperfeiçoamento'],
      ['certifications','🏅','Cursos','Formação complementar'],
      ['skills','📊','Competências','Dados, BI, processos e sistemas'],
      ['creative','🖋️','Produção criativa','Livro, projetos artísticos e discografia'],
      ['media','🎵','Media Player','Biblioteca musical e Deezer'],
      ['lattes','📄','Currículo Lattes','Currículo acadêmico integrado'],
      ['linkedin','in','LinkedIn','Perfil profissional integrado']
    ].filter(x => `${x[2]} ${x[3]}`.toLowerCase().includes(filter.trim().toLowerCase()));
    startResults.innerHTML = all.map(x=>`<button type="button" class="start-result" data-open="${x[0]}"><span class="res-icon">${x[1]}</span><span><strong>${x[2]}</strong><span>${x[3]}</span></span></button>`).join('');
  }

  function focusWindow(id) {
    const rec = openWindows.get(id); if (!rec) return;
    topZ += 1;
    openWindows.forEach(r => { r.el.classList.remove('is-active'); r.task.classList.remove('active'); });
    rec.el.classList.remove('is-minimized');
    rec.el.classList.add('is-active');
    rec.el.style.zIndex = topZ;
    rec.task.classList.add('active');
  }

  function openWindow(id) {
    if (!windowDefs[id]) return;
    closeStartMenu();
    if (openWindows.has(id)) { focusWindow(id); return; }
    const def = windowDefs[id];
    const el = template.content.firstElementChild.cloneNode(true);
    el.dataset.windowId = id;
    el.querySelector('.window-icon').textContent = def.icon;
    el.querySelector('.window-name').textContent = def.title;
    el.querySelector('.window-body').innerHTML = def.render();
    el.setAttribute('aria-label', def.title);

    const mobile = matchMedia('(max-width:700px)').matches;
    if (!mobile) {
      const offset = cascade++ % 6;
      el.style.left = `${Math.min(190 + offset*28, innerWidth-620)}px`;
      el.style.top = `${Math.min(112 + offset*24, innerHeight-430)}px`;
    }
    el.style.zIndex = ++topZ;
    layer.appendChild(el);

    const task = document.createElement('button');
    task.type = 'button'; task.className = 'taskbar-window active'; task.dataset.windowId=id;
    task.innerHTML = `<span>${def.icon}</span><span>${def.title}</span>`;
    taskbarWindows.appendChild(task);

    openWindows.set(id,{el,task,maximized:false,previous:null});
    bindWindow(el,id);
    if (id === 'media') bindMediaPlayer(el);
    if (id === 'lattes') bindLattes(el);
    focusWindow(id);
    setTimeout(()=>el.querySelector('.window-body')?.focus?.(),0);
  }

  function bindWindow(el,id) {
    const titlebar = el.querySelector('.window-titlebar');
    el.addEventListener('pointerdown',()=>focusWindow(id));
    el.querySelector('.win-close').addEventListener('click',()=>closeWindow(id));
    el.querySelector('.win-min').addEventListener('click',()=>minimizeWindow(id));
    el.querySelector('.win-max').addEventListener('click',()=>toggleMaximize(id));
    el.querySelector('.win-max').addEventListener('dblclick',e=>e.stopPropagation());
    titlebar.addEventListener('dblclick',e=>{ if(!e.target.closest('button')) toggleMaximize(id); });

    let drag=null;
    titlebar.addEventListener('pointerdown',e=>{
      if(e.target.closest('button') || matchMedia('(max-width:700px)').matches) return;
      const rec=openWindows.get(id); if(rec.maximized) return;
      focusWindow(id);
      const r=el.getBoundingClientRect();
      drag={dx:e.clientX-r.left,dy:e.clientY-r.top};
      titlebar.setPointerCapture(e.pointerId);
    });
    titlebar.addEventListener('pointermove',e=>{
      if(!drag) return;
      const maxX=Math.max(0,innerWidth-el.offsetWidth); const maxY=Math.max(0,innerHeight-50-el.offsetHeight);
      el.style.left=`${Math.min(maxX,Math.max(0,e.clientX-drag.dx))}px`;
      el.style.top=`${Math.min(maxY,Math.max(0,e.clientY-drag.dy))}px`;
    });
    titlebar.addEventListener('pointerup',()=>drag=null);
    el.addEventListener('click',e=>{
      const media=e.target.closest('[data-media-release]');
      if(media){ e.preventDefault(); pendingMediaSelection={releaseKey:media.dataset.mediaRelease,trackIndex:Number(media.dataset.mediaTrack||0)}; openWindow('media'); setTimeout(()=>mediaController?.select?.(pendingMediaSelection?.releaseKey||media.dataset.mediaRelease,Number(media.dataset.mediaTrack||0)),30); return; }
      const opener=e.target.closest('[data-open]');
      if(opener){ e.preventDefault(); openWindow(opener.dataset.open); }
    });
  }

  function closeWindow(id){const rec=openWindows.get(id);if(!rec)return;if(id==='media'){mediaController?.destroy?.();mediaController=null;}rec.el.remove();rec.task.remove();openWindows.delete(id);const last=[...openWindows.keys()].pop();if(last)focusWindow(last)}
  function minimizeWindow(id){const rec=openWindows.get(id);if(!rec)return;rec.el.classList.add('is-minimized');rec.task.classList.remove('active')}
  function toggleMaximize(id){const rec=openWindows.get(id);if(!rec)return;rec.maximized=!rec.maximized;rec.el.classList.toggle('is-maximized',rec.maximized);focusWindow(id)}

  function toggleStartMenu(){const open=!startMenu.classList.contains('open');startMenu.classList.toggle('open',open);startMenu.setAttribute('aria-hidden',String(!open));startButton.setAttribute('aria-expanded',String(open));if(open){buildStartResults(startSearch.value);setTimeout(()=>startSearch.focus(),30)}}
  function closeStartMenu(){startMenu.classList.remove('open');startMenu.setAttribute('aria-hidden','true');startButton.setAttribute('aria-expanded','false')}

  document.addEventListener('click',e=>{
    const opener=e.target.closest('[data-open]');
    if(opener && !opener.closest('.aero-window')){e.preventDefault();openWindow(opener.dataset.open)}
    if(!e.target.closest('#start-menu')&&!e.target.closest('#start-button')&&startMenu.classList.contains('open'))closeStartMenu();
  });
  startButton.addEventListener('click',e=>{e.stopPropagation();toggleStartMenu()});
  startSearch.addEventListener('input',()=>buildStartResults(startSearch.value));
  startMenu.addEventListener('click',e=>{const opener=e.target.closest('[data-open]');if(opener){openWindow(opener.dataset.open)}});
  taskbarWindows.addEventListener('click',e=>{const btn=e.target.closest('.taskbar-window');if(!btn)return;const rec=openWindows.get(btn.dataset.windowId);if(!rec)return;if(rec.el.classList.contains('is-minimized'))focusWindow(btn.dataset.windowId);else if(rec.el.classList.contains('is-active'))minimizeWindow(btn.dataset.windowId);else focusWindow(btn.dataset.windowId)});

  document.addEventListener('keydown',e=>{
    if(e.key==='Escape')closeStartMenu();
    if(e.altKey && e.key.toLowerCase()==='p'){e.preventDefault();openWindow('projects')}
    if(e.altKey && e.key.toLowerCase()==='s'){e.preventDefault();openWindow('skills')}
  });

  function layoutDesktopIcons(){
    if(!desktopIcons) return;
    const mobile=matchMedia('(max-width:700px)').matches;
    if(mobile){
      desktopIcons.style.removeProperty('grid-template-rows');
      desktopIcons.style.removeProperty('grid-auto-flow');
      desktopIcons.style.removeProperty('grid-auto-columns');
      desktopIcons.style.removeProperty('width');
      desktopIcons.style.removeProperty('overflow');
      desktop.style.removeProperty('--desktop-icons-width');
      return;
    }
    const rowHeight=94;
    const gap=1;
    const availableHeight=desktopIcons.clientHeight;
    const rows=Math.max(1,Math.floor((availableHeight+gap)/(rowHeight+gap)));
    const columns=Math.max(1,Math.ceil(desktopIcons.children.length/rows));
    const width=(columns*116)+((columns-1)*gap);
    desktopIcons.style.gridTemplateRows=`repeat(${rows}, ${rowHeight}px)`;
    desktopIcons.style.gridAutoFlow='column';
    desktopIcons.style.gridAutoColumns='116px';
    desktopIcons.style.width=`${width}px`;
    desktopIcons.style.overflow='visible';
    desktop.style.setProperty('--desktop-icons-width',`${width}px`);
  }

  function updateClock(){const now=new Date();clock.innerHTML=`${now.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}<br>${now.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric'})}`}
  updateClock(); setInterval(updateClock,1000*30);
  buildStartResults();
  layoutDesktopIcons();
  window.addEventListener('resize',layoutDesktopIcons,{passive:true});

  window.addEventListener('load',()=>{
    layoutDesktopIcons();
    setTimeout(()=>document.getElementById('boot').classList.add('is-hidden'),650);
    setTimeout(()=>openWindow('welcome'),820);
  });
})();
