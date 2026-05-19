/* ============================================================
 * Nova Vida TI · Next LP · gp-scripts.js
 * Carregado via <img onerror> shim no index.html
 * (Great Pages strippa <script> inline)
 *
 * Conteúdo:
 *  - Demonstração interativa do hero (chips funcionais + tabela filtra ao vivo + decisor expand)
 *  - Typed effect no search box
 *  - Counter animations (stats bar)
 *  - Smooth scroll (data-scroll-to)
 *  - Mobile drawer (burger toggle + ESC + click outside)
 *  - Form: máscaras CNPJ/WhatsApp, blocklist e-mail pessoal,
 *    custom select estilizado, submit handler (TODO Pipedrive)
 *  - Cookie banner LGPD (localStorage persistido)
 *  - Reveal-on-scroll
 * ============================================================ */

(function () {
  'use strict';

  // Guard: previne dupla execução (em dev, <script> direto + shim <img> podem ambos disparar).
  if (window.__gpScriptsLoaded) return;
  window.__gpScriptsLoaded = true;

  // Great Pages aplica `<body class="preload">` e nunca remove. O CSS deles tem
  // `.preload * { transition: none !important }`, o que mata todas as animações.
  // Removemos imediatamente e observamos pra impedir re-adição.
  function killPreload() {
    if (document.body) document.body.classList.remove('preload');
    document.documentElement.classList.remove('preload');
  }
  killPreload();
  var preloadObserver = new MutationObserver(killPreload);
  preloadObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  if (document.body) {
    preloadObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      preloadObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
      killPreload();
    });
  }

  var REDUCE_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function onReady(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  // ============================================================
  // MOCK DATA · 18 empresas (demonstração interativa do hero)
  // ============================================================
  var empresas = [
    { id: 1, nome: "Casa do Pão Ltda", cnpj: "12.345.***.***-22", setor: "Varejo", estado: "SP", score: 94, status: "hot", decisor: { nome: "Ana Souza", cargo: "Diretora Comercial", av: "AS", canais: ["tel","em","wa"] } },
    { id: 2, nome: "Mercado Verde S/A", cnpj: "23.876.***.***-04", setor: "Varejo", estado: "SP", score: 87, status: "warm", decisor: { nome: "Rafael Bento", cargo: "Head de Compras", av: "RB", canais: ["tel","em"] } },
    { id: 3, nome: "Distribuidora Aurora ME", cnpj: "34.219.***.***-71", setor: "Varejo", estado: "SP", score: 81, status: "hot", decisor: { nome: "Patrícia Mendes", cargo: "Sócia · Diretora", av: "PM", canais: ["tel","em","wa"] } },
    { id: 4, nome: "Comércio Atlas Eireli", cnpj: "45.602.***.***-18", setor: "Varejo", estado: "SP", score: 76, status: "warm", decisor: { nome: "Lucas Camargo", cargo: "CEO", av: "LC", canais: ["tel","em"] } },
    { id: 5, nome: "Varejo Sul Distrib.", cnpj: "56.083.***.***-49", setor: "Varejo", estado: "RS", score: 72, status: "cold", decisor: { nome: "Juliana Rocha", cargo: "Diretora Financeira", av: "JR", canais: ["em"] } },
    { id: 6, nome: "Quero-Quero Varejo", cnpj: "67.218.***.***-65", setor: "Varejo", estado: "RS", score: 89, status: "hot", decisor: { nome: "Gabriela Nunes", cargo: "VP Comercial", av: "GN", canais: ["tel","em","wa"] } },
    { id: 7, nome: "Compre Bem Atacado", cnpj: "78.456.***.***-31", setor: "Varejo", estado: "SP", score: 83, status: "hot", decisor: { nome: "Sandro Reis", cargo: "Sócio", av: "SR", canais: ["tel","em"] } },
    { id: 8, nome: "Líder Atacarejo", cnpj: "89.621.***.***-46", setor: "Varejo", estado: "BA", score: 78, status: "warm", decisor: { nome: "Vinicius Santos", cargo: "Diretor de Vendas", av: "VS", canais: ["em"] } },
    { id: 9, nome: "Química Brasil", cnpj: "01.572.***.***-19", setor: "Indústria", estado: "MG", score: 91, status: "hot", decisor: { nome: "Carlos Pereira", cargo: "VP de Vendas", av: "CP", canais: ["tel","em","wa"] } },
    { id: 10, nome: "ChemTech Soluções", cnpj: "67.451.***.***-32", setor: "Indústria", estado: "SC", score: 79, status: "warm", decisor: { nome: "Marina Lopes", cargo: "Diretora Comercial", av: "ML", canais: ["tel","em"] } },
    { id: 11, nome: "NovaSoft Tecnologia", cnpj: "78.302.***.***-67", setor: "TI", estado: "SP", score: 88, status: "hot", decisor: { nome: "Diego Almeida", cargo: "CEO", av: "DA", canais: ["tel","em","wa"] } },
    { id: 12, nome: "CodeRising Software", cnpj: "90.834.***.***-92", setor: "TI", estado: "RJ", score: 90, status: "hot", decisor: { nome: "Larissa Freitas", cargo: "CEO", av: "LF", canais: ["tel","em","wa"] } },
    { id: 13, nome: "CloudWise Sistemas", cnpj: "89.124.***.***-15", setor: "TI", estado: "RJ", score: 82, status: "warm", decisor: { nome: "Tatiana Borges", cargo: "CTO", av: "TB", canais: ["em","wa"] } },
    { id: 14, nome: "Construtora Atlas", cnpj: "90.567.***.***-83", setor: "Construção", estado: "BA", score: 76, status: "warm", decisor: { nome: "Roberto Vieira", cargo: "Diretor de Obras", av: "RV", canais: ["tel","em"] } },
    { id: 15, nome: "EngObras Sudeste", cnpj: "01.245.***.***-50", setor: "Construção", estado: "MG", score: 84, status: "hot", decisor: { nome: "Beatriz Costa", cargo: "Diretora Comercial", av: "BC", canais: ["tel","em","wa"] } },
    { id: 16, nome: "Clínica Vida Saúde", cnpj: "45.789.***.***-12", setor: "Saúde", estado: "SP", score: 80, status: "warm", decisor: { nome: "Dra. Aline Tavares", cargo: "Diretora Médica", av: "AT", canais: ["tel","em"] } },
    { id: 17, nome: "Consultoria Vértice", cnpj: "23.671.***.***-44", setor: "Serviços", estado: "SP", score: 86, status: "hot", decisor: { nome: "Carolina Dias", cargo: "Sócia", av: "CD", canais: ["tel","em","wa"] } },
    { id: 18, nome: "Mercantil Plus Distrib.", cnpj: "12.408.***.***-29", setor: "Varejo", estado: "PR", score: 74, status: "cold", decisor: { nome: "Marcos Pinto", cargo: "Sócio · Diretor", av: "MP", canais: ["em"] } }
  ];

  onReady(function () {

    // ============================================================
    // REVEAL-ON-SCROLL · estratégia defensiva em 4 camadas
    // 1. Pre-mark above-the-fold como .in
    // 2. IntersectionObserver pra entrada progressiva
    // 3. Scroll handler como safety (caso IO falhe)
    // 4. Force-all timeout de 800ms · garante que NENHUMA seção fique invisível
    //    mesmo se IO + scroll não dispararem (problema observado no Great Pages)
    // ============================================================
    var revealEls = $$('.reveal');

    // Camada 1: pre-mark above-the-fold antes de armar reveal-armed
    revealEls.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.95 && r.bottom > 0) el.classList.add('in');
    });

    // Adiciona reveal-armed pra ativar regras de animação
    document.documentElement.classList.add('reveal-armed');

    // Camada 2: IntersectionObserver
    if ('IntersectionObserver' in window) {
      var revealObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); }
        });
      }, { threshold: 0.05, rootMargin: '0px 0px -5% 0px' });
      revealEls.forEach(function (el) { if (!el.classList.contains('in')) revealObs.observe(el); });

      // Camada 3: scroll handler como redundância
      function checkRevealsOnScroll() {
        revealEls.forEach(function (el) {
          if (el.classList.contains('in')) return;
          var r = el.getBoundingClientRect();
          if (r.top < window.innerHeight * 1.1 && r.bottom > 0) el.classList.add('in');
        });
      }
      window.addEventListener('scroll', checkRevealsOnScroll, { passive: true });

      // Camada 4: FORCE-ALL · garante visibilidade em 800ms se tudo falhar
      setTimeout(function () {
        revealEls.forEach(function (el) { el.classList.add('in'); });
      }, 800);

      // Camada 5: fallback final no load event (DOM totalmente carregado)
      window.addEventListener('load', function () {
        revealEls.forEach(function (el) { el.classList.add('in'); });
      });
    } else {
      revealEls.forEach(function (el) { el.classList.add('in'); });
    }

    // ============================================================
    // COUNTERS · stats bar (data-count + data-prefix + data-suffix)
    // ============================================================
    function fmtNum(n) {
      return n.toLocaleString('pt-BR');
    }
    function animateCount(el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var prefix = el.getAttribute('data-prefix') || '';
      var suffix = el.getAttribute('data-suffix') || '';
      if (isNaN(target)) return;
      if (REDUCE_MOTION) { el.textContent = prefix + fmtNum(target) + suffix; return; }
      var duration = 1400, start = null;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var current = Math.floor(target * eased);
        el.textContent = prefix + fmtNum(current) + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = prefix + fmtNum(target) + suffix;
      }
      requestAnimationFrame(step);
    }
    if ('IntersectionObserver' in window) {
      var countObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { animateCount(e.target); countObs.unobserve(e.target); }
        });
      }, { threshold: 0.5 });
      $$('[data-count]').forEach(function (el) { countObs.observe(el); });
    } else {
      $$('[data-count]').forEach(animateCount);
    }

    // ============================================================
    // SMOOTH SCROLL · data-scroll-to
    // ============================================================
    $$('[data-scroll-to]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var target = $(btn.getAttribute('data-scroll-to'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    // ============================================================
    // DEMONSTRAÇÃO INTERATIVA · chips + tabela + expand
    // ============================================================
    var state = {
      filters: { setor: ['Varejo'], estado: ['SP'], status: ['hot'] },
      expandedId: null
    };

    function scoreClass(score) {
      if (score >= 85) return '';
      if (score >= 75) return 'mid';
      return 'low';
    }
    function applyFilters() {
      return empresas.filter(function (e) {
        if (state.filters.setor.length && state.filters.setor.indexOf(e.setor) === -1) return false;
        if (state.filters.estado.length && state.filters.estado.indexOf(e.estado) === -1) return false;
        if (state.filters.status.length && state.filters.status.indexOf(e.status) === -1) return false;
        return true;
      });
    }

    var resultList = $('#resultList');
    var resultCount = $('#resultCount');
    var resultTime = $('#resultTime');
    var resultBar = $('#resultBar');

    function escapeHtml(s) {
      return String(s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    }

    function render() {
      if (!resultList) return;
      var filtered = applyFilters();
      var displayCount = filtered.length === 0 ? 0 : 3000 + Math.floor(filtered.length * 137);
      if (resultCount) resultCount.textContent = displayCount.toLocaleString('pt-BR');
      if (resultTime) resultTime.textContent = (0.2 + Math.random() * 0.5).toFixed(2);
      if (resultBar) {
        resultBar.classList.add('flash');
        setTimeout(function () { resultBar.classList.remove('flash'); }, 400);
      }

      if (filtered.length === 0) {
        resultList.innerHTML = '<div class="result-empty"><h4>Nenhuma empresa nesses filtros.</h4><p>Tente desativar um filtro tocando nele de novo. A base real tem 30M empresas com filtros muito mais finos.</p></div>';
        return;
      }

      resultList.innerHTML = filtered.map(function (e, idx) {
        var detail = '';
        if (state.expandedId === e.id) {
          var canalLabel = { tel: 'telefone', em: 'e-mail', wa: 'whatsapp' };
          var canais = e.decisor.canais.map(function (c) {
            return '<span class="canal-locked">🔒 ' + canalLabel[c] + '</span>';
          }).join('');
          detail = '<div class="result-detail">' +
            '<div class="detail-card">' +
              '<span class="detail-av">' + e.decisor.av + '</span>' +
              '<div class="detail-info">' +
                '<div class="detail-nome">' + escapeHtml(e.decisor.nome) + '</div>' +
                '<div class="detail-cargo">' + escapeHtml(e.decisor.cargo) + '</div>' +
                '<div class="detail-canais">' + canais + '</div>' +
              '</div>' +
            '</div>' +
            '<div class="detail-unlock">' +
              '<div class="detail-unlock-text"><strong>' + e.decisor.canais.length + ' canais validados</strong> pra falar com ' + escapeHtml(e.decisor.nome.split(' ')[0]) + ' agora.</div>' +
              '<button class="detail-unlock-btn" type="button" data-unlock>Desbloquear contatos →</button>' +
            '</div>' +
          '</div>';
        }
        var statusLabel = e.status === 'hot' ? 'Hot' : e.status === 'warm' ? 'Warm' : 'Cold';
        return '<div class="result-row' + (state.expandedId === e.id ? ' is-expanded' : '') + '" data-id="' + e.id + '" style="animation-delay: ' + (30 * Math.min(idx, 9)) + 'ms">' +
          '<strong>' + escapeHtml(e.nome) + '</strong>' +
          '<span class="rtr-cnpj">' + e.cnpj + '</span>' +
          '<div class="rtr-decisor">' +
            '<span class="rtr-decisor-av">' + e.decisor.av + '</span>' +
            '<div class="rtr-decisor-info">' +
              '<span class="rtr-decisor-name">' + escapeHtml(e.decisor.nome) + '</span>' +
              '<span class="rtr-decisor-role">' + escapeHtml(e.decisor.cargo) + '</span>' +
            '</div>' +
          '</div>' +
          '<span class="rtr-score ' + scoreClass(e.score) + '">' + e.score + '%</span>' +
          '<span class="rtr-status ' + e.status + '"><span class="dot"></span> ' + statusLabel + '</span>' +
          detail +
        '</div>';
      }).join('');

      // Bind clicks
      $$('.result-row', resultList).forEach(function (row) {
        row.addEventListener('click', function (ev) {
          if (ev.target.closest('.canal-locked')) {
            scrollToForm(); return;
          }
          if (ev.target.closest('[data-unlock]')) {
            ev.stopPropagation(); scrollToForm(); return;
          }
          var id = parseInt(row.getAttribute('data-id'));
          state.expandedId = state.expandedId === id ? null : id;
          render();
        });
      });
    }
    function scrollToForm() {
      var f = $('#form'); if (f) f.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // CHIP handlers
    $$('.chip').forEach(function (chip) {
      if (chip.classList.contains('is-disabled')) return;
      function toggle() {
        var filter = chip.getAttribute('data-filter');
        var val = chip.getAttribute('data-val');
        if (!filter || !val) return;
        var arr = state.filters[filter];
        var idx = arr.indexOf(val);
        if (idx >= 0) { arr.splice(idx, 1); chip.classList.remove('is-active'); chip.setAttribute('aria-pressed', 'false'); }
        else { arr.push(val); chip.classList.add('is-active'); chip.setAttribute('aria-pressed', 'true'); }
        state.expandedId = null;
        render();
      }
      chip.addEventListener('click', toggle);
      chip.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
      });
    });

    // ============================================================
    // TYPED EFFECT no search box
    // ============================================================
    var phrases = [
      'vendem para varejo em São Paulo',
      'cresceram acima de 30% em 12 meses',
      'compram software via TI',
      'têm decisor de compras com WhatsApp ativo'
    ];
    var typedEl = $('#searchTyped');
    var typedScroller = typedEl ? typedEl.parentElement : null;
    function autoScrollTyped() {
      if (!typedScroller) return;
      // Só faz scroll quando o conteúdo excede a largura visível (overflow detected)
      if (typedScroller.scrollWidth > typedScroller.clientWidth) {
        typedScroller.scrollLeft = typedScroller.scrollWidth;
      }
    }
    if (typedEl && !REDUCE_MOTION) {
      var phraseIdx = 0, charIdx = 0, deleting = false;
      function typedDelay(phrase, idx, isDeleting) {
        if (isDeleting) return 32 + Math.random() * 14;
        var lastChar = phrase.charAt(idx - 1);
        if (lastChar === ' ') return 120;
        if (lastChar === ',' || lastChar === '.') return 220;
        return 55 + Math.random() * 40;
      }
      function tick() {
        var phrase = phrases[phraseIdx];
        if (!deleting) {
          charIdx++;
          typedEl.textContent = phrase.substring(0, charIdx);
          autoScrollTyped();
          if (charIdx === phrase.length) { deleting = true; setTimeout(tick, 2100); return; }
        } else {
          charIdx--;
          typedEl.textContent = phrase.substring(0, charIdx);
          autoScrollTyped();
          if (charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; setTimeout(tick, 400); return; }
        }
        setTimeout(tick, typedDelay(phrase, charIdx, deleting));
      }
      setTimeout(tick, 600);
    } else if (typedEl) {
      typedEl.textContent = phrases[0];
      autoScrollTyped();
    }

    // ============================================================
    // MOBILE DRAWER
    // ============================================================
    var navBurger = $('#navBurger');
    var navDrawer = $('#navDrawer');
    var navDrawerClose = $('#navDrawerClose');
    var navDrawerCta = $('#navDrawerCta');

    function openDrawer() {
      if (!navDrawer || !navBurger) return;
      navDrawer.classList.add('is-open');
      navBurger.classList.add('is-open');
      navBurger.setAttribute('aria-expanded', 'true');
      navDrawer.setAttribute('aria-hidden', 'false');
      document.body.classList.add('drawer-open');
    }
    function closeDrawer() {
      if (!navDrawer || !navBurger) return;
      navDrawer.classList.remove('is-open');
      navBurger.classList.remove('is-open');
      navBurger.setAttribute('aria-expanded', 'false');
      navDrawer.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('drawer-open');
    }
    if (navBurger) {
      navBurger.addEventListener('click', function () {
        if (navDrawer.classList.contains('is-open')) closeDrawer(); else openDrawer();
      });
    }
    if (navDrawerClose) navDrawerClose.addEventListener('click', closeDrawer);
    if (navDrawerCta) {
      navDrawerCta.addEventListener('click', function () {
        closeDrawer();
        setTimeout(scrollToForm, 320);
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navDrawer && navDrawer.classList.contains('is-open')) closeDrawer();
    });

    // Drawer links · fecha drawer ao clicar, e segue link suave
    $$('[data-drawer-link]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var href = a.getAttribute('href');
        if (href && href.charAt(0) === '#') {
          e.preventDefault();
          var t = $(href);
          closeDrawer();
          if (t) setTimeout(function () { t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 320);
        }
      });
    });

    // ============================================================
    // NAV · scroll spy + indicator deslizante (padrão Varejo)
    // ============================================================

    // data-nav-dark · alterna logo branca/preta quando passa sobre seções dark
    var heroSection = $('#hero');
    if (heroSection && 'IntersectionObserver' in window) {
      var navDarkObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && e.intersectionRatio > 0.2) {
            document.body.setAttribute('data-nav-dark', '');
          } else {
            document.body.removeAttribute('data-nav-dark');
          }
        });
      }, { threshold: [0.2, 0.5] });
      navDarkObs.observe(heroSection);
    }

    var navCenter = $('.nav-center');
    var navIndicator = $('.nav-indicator');
    var navLinkEls = $$('.nav-center a[data-section]');

    function moveIndicator(linkEl) {
      if (!navIndicator || !navCenter || !linkEl) return;
      var c = navCenter.getBoundingClientRect();
      var l = linkEl.getBoundingClientRect();
      var x = l.left - c.left;
      navIndicator.style.width = l.width + 'px';
      navIndicator.style.transform = 'translateX(' + x + 'px)';
    }

    function setActiveSection(id) {
      var hit = null;
      navLinkEls.forEach(function (a) {
        if (a.getAttribute('data-section') === id) { a.classList.add('active'); hit = a; }
        else a.classList.remove('active');
      });
      if (hit) moveIndicator(hit);
    }

    if (navLinkEls.length) {
      // Posiciona o indicator no link já marcado como .active
      var initial = navLinkEls.filter(function (a) { return a.classList.contains('active'); })[0] || navLinkEls[0];
      // Aguarda paint pra ter bounding rect correto
      requestAnimationFrame(function () { moveIndicator(initial); });

      // Bind click
      navLinkEls.forEach(function (a) {
        a.addEventListener('click', function (e) {
          var href = a.getAttribute('href');
          if (href && href.charAt(0) === '#') {
            e.preventDefault();
            var t = $(href);
            if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setActiveSection(a.getAttribute('data-section'));
          }
        });
      });

      // Recalcula em resize (fontes podem alterar largura dos links)
      window.addEventListener('resize', function () {
        var current = navLinkEls.filter(function (a) { return a.classList.contains('active'); })[0];
        if (current) moveIndicator(current);
      });

      // Scroll spy via IntersectionObserver
      if ('IntersectionObserver' in window) {
        var sectionIds = navLinkEls.map(function (a) { return a.getAttribute('data-section'); });
        var visible = {};
        var spyObs = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            visible[e.target.id] = e.isIntersecting ? e.intersectionRatio : 0;
          });
          var best = null, bestRatio = 0;
          sectionIds.forEach(function (id) {
            var r = visible[id] || 0;
            if (r > bestRatio) { best = id; bestRatio = r; }
          });
          if (best) setActiveSection(best);
        }, { threshold: [0.2, 0.4, 0.6], rootMargin: '-80px 0px -40% 0px' });
        sectionIds.forEach(function (id) {
          var el = document.getElementById(id);
          if (el) spyObs.observe(el);
        });
      }
    }

    // ============================================================
    // FORM · máscaras, validação, custom select, submit
    // ============================================================

    // CNPJ mask · 00.000.000/0000-00
    function maskCNPJ(value) {
      value = value.replace(/\D/g, '').slice(0, 14);
      if (value.length > 12) return value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})$/, '$1.$2.$3/$4-$5');
      if (value.length > 8) return value.replace(/^(\d{2})(\d{3})(\d{3})(\d{0,4})$/, '$1.$2.$3/$4');
      if (value.length > 5) return value.replace(/^(\d{2})(\d{3})(\d{0,3})$/, '$1.$2.$3');
      if (value.length > 2) return value.replace(/^(\d{2})(\d{0,3})$/, '$1.$2');
      return value;
    }
    var cnpjInput = $('#cnpj');
    if (cnpjInput) cnpjInput.addEventListener('input', function () { cnpjInput.value = maskCNPJ(cnpjInput.value); });

    // WhatsApp mask · (00) 00000-0000
    function maskPhone(value) {
      value = value.replace(/\D/g, '').slice(0, 11);
      if (value.length > 10) return value.replace(/^(\d{2})(\d{5})(\d{0,4})$/, '($1) $2-$3');
      if (value.length > 6) return value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
      if (value.length > 2) return value.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
      if (value.length > 0) return '(' + value;
      return value;
    }
    var whatsappInput = $('#whatsapp');
    if (whatsappInput) whatsappInput.addEventListener('input', function () { whatsappInput.value = maskPhone(whatsappInput.value); });

    // Email blocklist · domínios pessoais
    var PERSONAL_DOMAINS = [
      'gmail.com', 'hotmail.com', 'outlook.com', 'outlook.com.br',
      'yahoo.com', 'yahoo.com.br', 'icloud.com', 'live.com', 'msn.com',
      'bol.com.br', 'terra.com.br', 'uol.com.br', 'ig.com.br',
      'globomail.com', 'globo.com', 'r7.com', 'oi.com.br',
      'hotmail.com.br', 'me.com', 'mac.com', 'aol.com', 'protonmail.com'
    ];
    function isValidCorporateEmail(email) {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
      var domain = email.split('@')[1].toLowerCase();
      return PERSONAL_DOMAINS.indexOf(domain) === -1;
    }
    function isValidCNPJ(value) { return value.replace(/\D/g, '').length === 14; }
    function isValidPhone(value) {
      var d = value.replace(/\D/g, '').length;
      return d === 10 || d === 11;
    }

    // Custom select (ARIA combobox 1.2)
    $$('.custom-select[data-custom-select]').forEach(function (root) {
      var trigger = $('.custom-select-trigger', root);
      var optionsList = $('.custom-select-options', root);
      var valueEl = $('.custom-select-value', trigger);
      var hidden = $('.custom-select-hidden', root);
      var options = $$('li[role="option"]', optionsList);
      var focusIdx = -1;

      function open() {
        root.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
        focusIdx = options.findIndex(function (o) { return o.classList.contains('is-selected'); });
        if (focusIdx < 0) focusIdx = 0;
        highlight();
      }
      function close() {
        root.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
        focusIdx = -1;
      }
      function highlight() {
        options.forEach(function (o, i) { o.setAttribute('aria-selected', i === focusIdx ? 'true' : 'false'); });
      }
      function select(li) {
        var value = li.getAttribute('data-value');
        var text = li.textContent.trim();
        valueEl.textContent = text;
        trigger.classList.remove('is-empty');
        options.forEach(function (o) { o.classList.remove('is-selected'); });
        li.classList.add('is-selected');
        if (hidden) {
          hidden.value = value;
          hidden.dispatchEvent(new Event('change', { bubbles: true }));
        }
        root.classList.remove('error');
        close();
      }
      trigger.addEventListener('click', function () {
        if (root.classList.contains('is-open')) close(); else open();
      });
      trigger.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
          e.preventDefault();
          if (!root.classList.contains('is-open')) open();
        }
      });
      options.forEach(function (li, i) {
        li.addEventListener('click', function () { select(li); });
        li.addEventListener('mouseenter', function () { focusIdx = i; highlight(); });
      });
      document.addEventListener('keydown', function (e) {
        if (!root.classList.contains('is-open')) return;
        if (e.key === 'Escape') { e.preventDefault(); close(); trigger.focus(); }
        else if (e.key === 'ArrowDown') { e.preventDefault(); focusIdx = Math.min(focusIdx + 1, options.length - 1); highlight(); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); focusIdx = Math.max(focusIdx - 1, 0); highlight(); }
        else if (e.key === 'Enter') { e.preventDefault(); if (options[focusIdx]) select(options[focusIdx]); }
        else if (e.key === 'Tab') { close(); }
      });
      document.addEventListener('click', function (e) {
        if (!root.contains(e.target)) close();
      });
    });

    // Form submit
    var leadForm = $('#leadForm');
    var formSuccess = $('#formSuccess');
    if (leadForm) {
      $$('.form-input, .form-textarea', leadForm).forEach(function (inp) {
        inp.addEventListener('input', function () { inp.classList.remove('error'); });
      });

      leadForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var hasError = false;
        var nome = $('#nome').value.trim();
        var email = $('#email').value.trim();
        var empresa = $('#empresa').value.trim();
        var cnpj = $('#cnpj').value.trim();
        var whatsapp = $('#whatsapp').value.trim();
        var maturidade = $('#maturidade').value;

        if (!nome) { $('#nome').classList.add('error'); hasError = true; }
        if (!isValidCorporateEmail(email)) { $('#email').classList.add('error'); hasError = true; }
        if (!empresa) { $('#empresa').classList.add('error'); hasError = true; }
        if (!isValidCNPJ(cnpj)) { $('#cnpj').classList.add('error'); hasError = true; }
        if (!isValidPhone(whatsapp)) { $('#whatsapp').classList.add('error'); hasError = true; }
        if (!maturidade) {
          var cs = $('.custom-select[data-custom-select]');
          if (cs) cs.classList.add('error');
          hasError = true;
        }

        if (hasError) {
          var firstErr = $('.form-input.error, .custom-select.error');
          if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }

        var submitBtn = $('.form-submit', leadForm);
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.setAttribute('aria-busy', 'true');
          submitBtn.textContent = 'Enviando...';
        }

        // TODO: integrar com Pipedrive aqui (escopo futuro)
        setTimeout(function () {
          leadForm.style.display = 'none';
          if (formSuccess) formSuccess.classList.add('show');
        }, 800);
      });
    }

    // ============================================================
    // COOKIE BANNER LGPD
    // ============================================================
    var cookieBanner = $('#cookieBanner');
    var cookieAccept = $('#cookieAccept');
    var cookieReject = $('#cookieReject');
    var COOKIE_KEY = 'nv_cookie_consent_next';

    function persistConsent(val) {
      try { localStorage.setItem(COOKIE_KEY, JSON.stringify({ value: val, ts: Date.now() })); } catch (e) {}
    }
    function hideCookieBanner() {
      if (!cookieBanner) return;
      cookieBanner.classList.remove('show');
      setTimeout(function () { cookieBanner.hidden = true; }, 400);
    }
    if (cookieBanner) {
      var stored = null;
      try { stored = localStorage.getItem(COOKIE_KEY); } catch (e) {}
      if (!stored) {
        cookieBanner.hidden = false;
        setTimeout(function () { cookieBanner.classList.add('show'); }, 1500);
      }
      if (cookieAccept) cookieAccept.addEventListener('click', function () { persistConsent('accepted'); hideCookieBanner(); });
      if (cookieReject) cookieReject.addEventListener('click', function () { persistConsent('rejected'); hideCookieBanner(); });
    }

    // Initial render
    render();
  });
})();
