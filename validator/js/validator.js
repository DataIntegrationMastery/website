/* ============================================================
   Data Integration Mastery™ — Integration Architecture Validator
   Multi-step quiz engine: questions → scoring → recommendations
   ============================================================ */

(function () {
  'use strict';

  /* ── Questions ─────────────────────────────────────────── */
  var QUESTIONS = [
    {
      id: 'scenario',
      text: 'What best describes your integration scenario?',
      hint: 'Choose the option that most closely matches your current situation.',
      options: [
        { value: 'p2p',        label: 'Connecting two specific systems (one-to-one link)' },
        { value: 'enterprise', label: 'Connecting many internal enterprise systems' },
        { value: 'b2b',        label: 'Exposing or consuming APIs with external partners (B2B)' },
        { value: 'cloud',      label: 'Cloud-native microservices or containerised workloads' },
        { value: 'hybrid',     label: 'Hybrid: cloud + on-premise environment' }
      ]
    },
    {
      id: 'latency',
      text: 'What are your latency and timing requirements?',
      hint: 'Think about what happens when a message or request is delayed.',
      options: [
        { value: 'realtime',  label: 'Real-time — response required in under one second' },
        { value: 'nearrt',    label: 'Near real-time — a few seconds are acceptable' },
        { value: 'async',     label: 'Asynchronous — minutes or hours are fine' },
        { value: 'batch',     label: 'Batch processing — scheduled daily or on a cycle' }
      ]
    },
    {
      id: 'scale',
      text: 'How many systems are involved in this integration?',
      hint: 'Count all source, target, and intermediate systems.',
      options: [
        { value: 'two',    label: 'Two systems only' },
        { value: 'few',    label: '3 – 5 systems' },
        { value: 'many',   label: '6 – 15 systems' },
        { value: 'large',  label: '15+ systems or enterprise-wide scope' }
      ]
    },
    {
      id: 'transform',
      text: 'How complex is the data transformation required?',
      hint: 'How much must you change the data as it flows between systems?',
      options: [
        { value: 'none',     label: 'Minimal — pass-through or simple field mapping' },
        { value: 'moderate', label: 'Moderate — format conversion (XML → JSON), basic rules' },
        { value: 'complex',  label: 'Complex — aggregation, enrichment, conditional logic' },
        { value: 'orchestrated', label: 'Very complex — multi-step orchestration with multiple systems' }
      ]
    },
    {
      id: 'reliability',
      text: 'What are your reliability and consistency requirements?',
      hint: 'What is the cost of a lost or duplicated message?',
      options: [
        { value: 'best_effort', label: 'Best-effort — occasional loss is acceptable' },
        { value: 'at_least_once', label: 'At-least-once — no loss allowed, duplicates are ok' },
        { value: 'exactly_once', label: 'Exactly-once — every message must be processed exactly once' },
        { value: 'transactional', label: 'Full ACID transactions / distributed transactions required' }
      ]
    },
    {
      id: 'context',
      text: 'What best describes your team and infrastructure context?',
      hint: 'This shapes which tools and approaches are realistic for you.',
      options: [
        { value: 'greenfield', label: 'Small team, no existing middleware or integration platform' },
        { value: 'api_first',  label: 'Medium team with existing API gateway or REST infrastructure' },
        { value: 'esb',        label: 'Large enterprise team with existing ESB or messaging middleware' },
        { value: 'cloudnative', label: 'Cloud-native team working with Kubernetes and microservices' }
      ]
    },
    {
      id: 'driver',
      text: 'What is the primary business driver for this integration?',
      hint: 'The driver often determines how critical the integration is.',
      options: [
        { value: 'automation',    label: 'Operational efficiency — automate a manual process' },
        { value: 'visibility',    label: 'Real-time data visibility or reporting' },
        { value: 'digital',       label: 'Enable new digital services or customer experience' },
        { value: 'modernisation', label: 'System migration or legacy modernisation' },
        { value: 'partner',       label: 'External partner integration or EDI' }
      ]
    }
  ];

  /* ── Architecture Profiles ──────────────────────────────── */
  var PROFILES = {
    p2p_api: {
      id: 'p2p_api',
      title: 'Point-to-Point API Integration',
      icon: '🔗',
      summary: 'A direct, lightweight REST or messaging connection between two systems. Ideal for simple, well-defined integrations with low operational overhead.',
      when: 'Best when: you have 2 systems, low transformation complexity, and a small team.',
      patterns: [
        { name: 'Request-Reply', url: '/patterns/messaging-patterns/request-reply.html' },
        { name: 'Retry Mechanism', url: '/patterns/resilience-patterns/retry-mechanism.html' },
        { name: 'Timeout', url: '/patterns/resilience-patterns/timeout.html' },
        { name: 'Authentication', url: '/patterns/security-patterns/authentication.html' }
      ]
    },
    api_management: {
      id: 'api_management',
      title: 'API Management / API Gateway',
      icon: '🚪',
      summary: 'A centralised API layer that manages access, security, rate-limiting, and versioning for your integrations. Ideal for B2B and externally exposed services.',
      when: 'Best when: you expose APIs to external partners, need access control, or manage multiple API consumers.',
      patterns: [
        { name: 'API Security', url: '/patterns/security-patterns/api-security.html' },
        { name: 'Authentication', url: '/patterns/security-patterns/authentication.html' },
        { name: 'Token Management', url: '/patterns/security-patterns/token-management.html' },
        { name: 'Request-Reply', url: '/patterns/messaging-patterns/request-reply.html' },
        { name: 'Content-Based Router', url: '/patterns/routing-patterns/content-based-router.html' }
      ]
    },
    esb: {
      id: 'esb',
      title: 'ESB / Hub-and-Spoke Integration',
      icon: '🏗️',
      summary: 'An Enterprise Service Bus acts as a central integration hub, handling routing, transformation, and protocol mediation for many systems. Suited for large enterprise environments.',
      when: 'Best when: you have 6+ systems, complex transformation requirements, and an existing enterprise integration team.',
      patterns: [
        { name: 'Message Translator', url: '/patterns/data-transformation-patterns/message-translator.html' },
        { name: 'Content-Based Router', url: '/patterns/routing-patterns/content-based-router.html' },
        { name: 'Message Queue', url: '/patterns/messaging-patterns/message-queue.html' },
        { name: 'Dead Letter Queue', url: '/patterns/resilience-patterns/dead-letter-queue.html' },
        { name: 'Correlation ID', url: '/patterns/messaging-patterns/correlation-id.html' },
        { name: 'Circuit Breaker', url: '/patterns/resilience-patterns/circuit-breaker.html' }
      ]
    },
    ipaas: {
      id: 'ipaas',
      title: 'iPaaS / Cloud Integration Platform',
      icon: '☁️',
      summary: 'A cloud-hosted integration platform (iPaaS) provides a managed environment for building, running, and monitoring integration flows. Great balance of power and operational simplicity.',
      when: 'Best when: your environment is hybrid or cloud-first, you want low-ops overhead, and your team is mid-sized.',
      patterns: [
        { name: 'Data Mapper', url: '/patterns/data-transformation-patterns/data-mapper.html' },
        { name: 'Message Routing', url: '/patterns/messaging-patterns/message-routing.html' },
        { name: 'Retry Mechanism', url: '/patterns/resilience-patterns/retry-mechanism.html' },
        { name: 'Health Checks', url: '/patterns/monitoring-observability-patterns/health-checks.html' },
        { name: 'Metrics Collection', url: '/patterns/monitoring-observability-patterns/metrics-collection.html' }
      ]
    },
    event_driven: {
      id: 'event_driven',
      title: 'Event-Driven / Message Broker Architecture',
      icon: '⚡',
      summary: 'Decouple producers and consumers through an event stream or message broker (e.g. Kafka, RabbitMQ). Scales well under high load and enables loose coupling across many services.',
      when: 'Best when: you need async processing, high throughput, decoupled teams, or real-time event propagation.',
      patterns: [
        { name: 'Publish-Subscribe', url: '/patterns/messaging-patterns/publish-subscribe.html' },
        { name: 'Event Streaming', url: '/patterns/messaging-patterns/event-streaming.html' },
        { name: 'Message Queue', url: '/patterns/messaging-patterns/message-queue.html' },
        { name: 'Dead Letter Queue', url: '/patterns/resilience-patterns/dead-letter-queue.html' },
        { name: 'Correlation ID', url: '/patterns/messaging-patterns/correlation-id.html' },
        { name: 'Distributed Tracing', url: '/patterns/monitoring-observability-patterns/distributed-tracing.html' }
      ]
    },
    saga: {
      id: 'saga',
      title: 'Saga / Distributed Transaction Patterns',
      icon: '🔄',
      summary: 'When you need reliable multi-step workflows across services without a global transaction, the Saga pattern coordinates compensating transactions to maintain eventual consistency.',
      when: 'Best when: you have multi-system business processes with strong consistency requirements but cannot use distributed ACID transactions.',
      patterns: [
        { name: 'Saga Pattern', url: '/patterns/orchestration-patterns/saga-pattern.html' },
        { name: 'Compensation Transactions', url: '/patterns/orchestration-patterns/compensation-transactions.html' },
        { name: 'Process Manager', url: '/patterns/orchestration-patterns/process-manager.html' },
        { name: 'Correlation ID', url: '/patterns/messaging-patterns/correlation-id.html' },
        { name: 'Dead Letter Queue', url: '/patterns/resilience-patterns/dead-letter-queue.html' }
      ]
    },
    microservices: {
      id: 'microservices',
      title: 'Microservice Architecture + Service Mesh',
      icon: '🧩',
      summary: 'Decompose functionality into independently deployable services with a service mesh (e.g. Istio) or API gateway managing inter-service communication, security, and observability.',
      when: 'Best when: you run Kubernetes, have multiple autonomous teams, need independent scaling, and invest in DevOps maturity.',
      patterns: [
        { name: 'Circuit Breaker', url: '/patterns/resilience-patterns/circuit-breaker.html' },
        { name: 'Bulkhead', url: '/patterns/resilience-patterns/bulkhead.html' },
        { name: 'Choreography', url: '/patterns/orchestration-patterns/choreography.html' },
        { name: 'API Security', url: '/patterns/security-patterns/api-security.html' },
        { name: 'Distributed Tracing', url: '/patterns/monitoring-observability-patterns/distributed-tracing.html' },
        { name: 'Health Checks', url: '/patterns/monitoring-observability-patterns/health-checks.html' }
      ]
    }
  };

  /* ── Scoring Engine ─────────────────────────────────────── */
  function score(answers) {
    var scores = {};
    Object.keys(PROFILES).forEach(function (k) { scores[k] = 0; });

    // scenario
    if (answers.scenario === 'p2p')        { scores.p2p_api += 4; scores.api_management += 1; }
    if (answers.scenario === 'enterprise') { scores.esb += 4; scores.ipaas += 3; scores.event_driven += 2; }
    if (answers.scenario === 'b2b')        { scores.api_management += 5; scores.ipaas += 2; scores.p2p_api += 1; }
    if (answers.scenario === 'cloud')      { scores.microservices += 5; scores.event_driven += 3; scores.ipaas += 2; }
    if (answers.scenario === 'hybrid')     { scores.ipaas += 4; scores.esb += 3; scores.api_management += 2; }

    // latency
    if (answers.latency === 'realtime')  { scores.p2p_api += 3; scores.microservices += 3; scores.api_management += 2; }
    if (answers.latency === 'nearrt')    { scores.event_driven += 2; scores.ipaas += 2; scores.api_management += 1; }
    if (answers.latency === 'async')     { scores.event_driven += 4; scores.esb += 3; scores.ipaas += 2; }
    if (answers.latency === 'batch')     { scores.esb += 3; scores.ipaas += 3; scores.event_driven += 1; }

    // scale
    if (answers.scale === 'two')   { scores.p2p_api += 5; }
    if (answers.scale === 'few')   { scores.api_management += 3; scores.ipaas += 3; scores.p2p_api += 1; }
    if (answers.scale === 'many')  { scores.esb += 4; scores.ipaas += 4; scores.event_driven += 3; }
    if (answers.scale === 'large') { scores.esb += 5; scores.event_driven += 4; scores.microservices += 3; }

    // transform
    if (answers.transform === 'none')        { scores.p2p_api += 3; scores.api_management += 2; }
    if (answers.transform === 'moderate')    { scores.ipaas += 3; scores.api_management += 2; scores.esb += 1; }
    if (answers.transform === 'complex')     { scores.esb += 4; scores.ipaas += 3; scores.event_driven += 1; }
    if (answers.transform === 'orchestrated'){ scores.saga += 5; scores.esb += 3; scores.ipaas += 2; }

    // reliability
    if (answers.reliability === 'best_effort')    { scores.p2p_api += 2; scores.microservices += 1; }
    if (answers.reliability === 'at_least_once')  { scores.event_driven += 3; scores.ipaas += 2; scores.esb += 2; }
    if (answers.reliability === 'exactly_once')   { scores.event_driven += 3; scores.esb += 4; scores.ipaas += 2; }
    if (answers.reliability === 'transactional')  { scores.saga += 5; scores.esb += 3; }

    // context
    if (answers.context === 'greenfield')  { scores.p2p_api += 3; scores.ipaas += 2; }
    if (answers.context === 'api_first')   { scores.api_management += 4; scores.ipaas += 2; scores.microservices += 1; }
    if (answers.context === 'esb')         { scores.esb += 5; scores.ipaas += 2; }
    if (answers.context === 'cloudnative') { scores.microservices += 5; scores.event_driven += 3; scores.ipaas += 1; }

    // driver
    if (answers.driver === 'automation')    { scores.esb += 2; scores.ipaas += 3; scores.event_driven += 1; }
    if (answers.driver === 'visibility')    { scores.event_driven += 3; scores.ipaas += 2; scores.microservices += 1; }
    if (answers.driver === 'digital')       { scores.api_management += 3; scores.microservices += 3; scores.ipaas += 1; }
    if (answers.driver === 'modernisation') { scores.ipaas += 3; scores.microservices += 3; scores.api_management += 1; }
    if (answers.driver === 'partner')       { scores.api_management += 4; scores.esb += 2; scores.p2p_api += 1; }

    // Return top 3 profiles sorted by score
    var ranked = Object.keys(scores).map(function (k) {
      return { profile: k, score: scores[k] };
    }).sort(function (a, b) { return b.score - a.score; });

    return ranked.slice(0, 3).filter(function (r) { return r.score > 0; }).map(function (r) {
      return PROFILES[r.profile];
    });
  }

  /* ── State ──────────────────────────────────────────────── */
  var answers = {};
  var currentStep = 0; // 0 = intro, 1-7 = questions, 8 = results

  /* ── DOM helpers ────────────────────────────────────────── */
  function $(sel) { return document.querySelector(sel); }

  var introEl    = document.getElementById('v-intro');
  var questionEl = document.getElementById('v-question');
  var resultsEl  = document.getElementById('v-results');
  var progressEl = document.getElementById('v-progress-bar');
  var stepLabel  = document.getElementById('v-step-label');

  /* ── Render helpers ─────────────────────────────────────── */
  function updateProgress() {
    var pct = currentStep === 0 ? 0 : Math.round((currentStep / QUESTIONS.length) * 100);
    if (progressEl) progressEl.style.width = pct + '%';
    if (stepLabel)  stepLabel.textContent   = currentStep > 0
      ? 'Question ' + currentStep + ' of ' + QUESTIONS.length
      : '';
  }

  function showIntro() {
    currentStep = 0;
    answers = {};
    introEl.hidden    = false;
    questionEl.hidden = true;
    resultsEl.hidden  = true;
    updateProgress();
  }

  function showQuestion(idx) {
    currentStep = idx + 1;
    var q = QUESTIONS[idx];

    introEl.hidden    = true;
    resultsEl.hidden  = true;
    questionEl.hidden = false;

    var qNum   = questionEl.querySelector('.v-q-number');
    var qText  = questionEl.querySelector('.v-q-text');
    var qHint  = questionEl.querySelector('.v-q-hint');
    var optBox = questionEl.querySelector('.v-options');
    var backBtn = questionEl.querySelector('.v-btn-back');

    if (qNum)  qNum.textContent  = 'Question ' + currentStep + ' / ' + QUESTIONS.length;
    if (qText) qText.textContent = q.text;
    if (qHint) qHint.textContent = q.hint;

    if (backBtn) {
      backBtn.style.display = idx === 0 ? 'none' : 'inline-flex';
    }

    if (optBox) {
      optBox.innerHTML = '';
      q.options.forEach(function (opt) {
        var btn = document.createElement('button');
        btn.className = 'v-option' + (answers[q.id] === opt.value ? ' selected' : '');
        btn.textContent = opt.label;
        btn.setAttribute('data-value', opt.value);
        btn.setAttribute('type', 'button');
        btn.addEventListener('click', function () {
          answers[q.id] = opt.value;
          optBox.querySelectorAll('.v-option').forEach(function (b) {
            b.classList.toggle('selected', b.getAttribute('data-value') === opt.value);
          });
          // Auto-advance after short delay
          setTimeout(function () {
            if (idx + 1 < QUESTIONS.length) {
              showQuestion(idx + 1);
            } else {
              showResults();
            }
          }, 280);
        });
        optBox.appendChild(btn);
      });
    }

    updateProgress();
  }

  function showResults() {
    currentStep = QUESTIONS.length + 1;
    introEl.hidden    = true;
    questionEl.hidden = true;
    resultsEl.hidden  = false;
    updateProgress();

    var recommendations = score(answers);
    var container = resultsEl.querySelector('.v-recommendations');
    if (!container) return;
    container.innerHTML = '';

    if (recommendations.length === 0) {
      container.innerHTML = '<p class="v-no-results">Could not determine a recommendation based on your answers. Please try the validator again.</p>';
      return;
    }

    recommendations.forEach(function (profile, i) {
      var card = document.createElement('div');
      card.className = 'v-result-card' + (i === 0 ? ' primary' : '');

      var badge = i === 0 ? '<span class="v-badge">Best Match</span>' : (i === 1 ? '<span class="v-badge secondary">Strong Match</span>' : '<span class="v-badge tertiary">Also Consider</span>');

      var patternLinks = profile.patterns.map(function (p) {
        return '<a href="' + p.url + '" class="v-pattern-link" target="_blank" rel="noopener">' + p.name + '</a>';
      }).join('');

      card.innerHTML = '<div class="v-result-header">'
        + badge
        + '<div class="v-result-icon">' + profile.icon + '</div>'
        + '<h3 class="v-result-title">' + profile.title + '</h3>'
        + '</div>'
        + '<p class="v-result-summary">' + profile.summary + '</p>'
        + '<p class="v-result-when">' + profile.when + '</p>'
        + '<div class="v-patterns-section">'
        + '<p class="v-patterns-label">Relevant patterns to explore:</p>'
        + '<div class="v-pattern-links">' + patternLinks + '</div>'
        + '</div>';

      container.appendChild(card);
    });

    if (progressEl) progressEl.style.width = '100%';
    if (stepLabel)  stepLabel.textContent = 'Complete!';
  }

  /* ── Event Bindings ─────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {

    var startBtn  = document.getElementById('v-start-btn');
    var backBtn   = document.getElementById('v-back-btn');  // question back
    var restartBtn = document.getElementById('v-restart-btn');

    if (startBtn) {
      startBtn.addEventListener('click', function () {
        showQuestion(0);
      });
    }

    questionEl.addEventListener('click', function (e) {
      if (e.target && e.target.id === 'v-back-btn') {
        var prevIdx = currentStep - 2;
        if (prevIdx >= 0) { showQuestion(prevIdx); }
        else              { showIntro(); }
      }
    });

    if (restartBtn) {
      restartBtn.addEventListener('click', function () { showIntro(); });
    }

    // Initialise
    showIntro();
  });

})();
