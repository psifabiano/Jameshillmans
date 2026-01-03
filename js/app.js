/**
 * app.js - Main Application Logic
 * Orchestrates game flow, state management, and UI interactions
 */

class EvidenceApp {
  constructor() {
    this.state = {
      gameStatus: 'intro', // intro, registration, playing, finished
      currentScenarioIndex: 0,
      scores: {
        chaos: 0,
        order: 0,
        emotion: 0,
        logic: 0
      },
      currentResult: null,
      showShadow: false,
      isRegistered: storage.isUserRegistered()
    };

    this.scenarios = [];
    this.archetypes = [];
    this.init();
  }

  /**
   * Initialize application
   */
  async init() {
    // Load initial language
    await i18n.loadLanguage(i18n.currentLanguage);
    
    // Load game data
    this.scenarios = i18n.getScenarios();
    this.archetypes = i18n.getArchetypes();

    // Listen for language changes
    window.addEventListener('languageChanged', () => {
      this.scenarios = i18n.getScenarios();
      this.archetypes = i18n.getArchetypes();
      this.render();
    });

    // Initial render
    this.render();
  }

  /**
   * Start game flow
   */
  startGame() {
    if (!this.state.isRegistered) {
      this.state.gameStatus = 'registration';
    } else {
      this.state.gameStatus = 'playing';
      this.state.currentScenarioIndex = 0;
      this.state.scores = { chaos: 0, order: 0, emotion: 0, logic: 0 };
    }
    this.render();
  }

  /**
   * Handle user registration
   * @param {Object} userData - { name, email, location }
   */
  registerUser(userData) {
    storage.saveUser(userData);
    this.state.isRegistered = true;
    this.state.gameStatus = 'playing';
    this.state.currentScenarioIndex = 0;
    this.state.scores = { chaos: 0, order: 0, emotion: 0, logic: 0 };
    this.render();
  }

  /**
   * Handle scenario choice
   * @param {string} direction - 'left' or 'right'
   */
  handleChoice(direction) {
    const scenario = this.scenarios[this.state.currentScenarioIndex];
    const choice = direction === 'left' ? scenario.leftChoice : scenario.rightChoice;

    // Update scores based on choice impact
    if (choice.impact) {
      if (choice.impact.chaos) this.state.scores.chaos += choice.impact.chaos;
      if (choice.impact.order) this.state.scores.order += choice.impact.order;
      if (choice.impact.emotion) this.state.scores.emotion += choice.impact.emotion;
      if (choice.impact.logic) this.state.scores.logic += choice.impact.logic;
    }

    // Move to next scenario or finish
    if (this.state.currentScenarioIndex < this.scenarios.length - 1) {
      this.state.currentScenarioIndex++;
      this.render();
    } else {
      this.finishGame();
    }
  }

  /**
   * Calculate archetype based on final scores
   */
  calculateArchetype() {
    const scores = this.state.scores;
    const chaosVsOrder = scores.chaos - scores.order;
    const emotionVsLogic = scores.emotion - scores.logic;

    // Simple archetype mapping based on quadrants
    let archetypeIndex = 0;

    if (chaosVsOrder > 0 && emotionVsLogic > 0) {
      archetypeIndex = 0; // Ares - Chaos + Emotion
    } else if (chaosVsOrder > 0 && emotionVsLogic <= 0) {
      archetypeIndex = 1; // Hermes - Chaos + Logic
    } else if (chaosVsOrder <= 0 && emotionVsLogic > 0) {
      archetypeIndex = 2; // Aphrodite - Order + Emotion
    } else if (chaosVsOrder <= 0 && emotionVsLogic <= 0) {
      archetypeIndex = 3; // Athena - Order + Logic
    }

    // Add some variation based on total scores
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    if (totalScore > 25) {
      archetypeIndex = Math.min(archetypeIndex + 2, this.archetypes.length - 1);
    }

    return this.archetypes[Math.min(archetypeIndex, this.archetypes.length - 1)];
  }

  /**
   * Finish game and show result
   */
  finishGame() {
    const archetype = this.calculateArchetype();
    
    this.state.currentResult = {
      ...archetype,
      dimensions: this.state.scores
    };

    storage.saveResult(this.state.currentResult);
    this.state.gameStatus = 'finished';
    this.state.showShadow = false;
    this.render();
  }

  /**
   * Toggle shadow side visibility
   */
  toggleShadow() {
    this.state.showShadow = !this.state.showShadow;
    this.render();
  }

  /**
   * Reset game to intro
   */
  resetGame() {
    this.state.gameStatus = 'intro';
    this.state.currentScenarioIndex = 0;
    this.state.scores = { chaos: 0, order: 0, emotion: 0, logic: 0 };
    this.state.currentResult = null;
    this.state.showShadow = false;
    this.render();
  }

  /**
   * Download archetype card as image
   */
  downloadCard() {
    if (!this.state.currentResult) return;

    const cardElement = document.getElementById('archetype-card');
    if (!cardElement) return;

    // Use html2canvas if available, otherwise show message
    if (typeof html2canvas !== 'undefined') {
      html2canvas(cardElement, {
        backgroundColor: null,
        scale: 2,
        useCORS: true
      }).then(canvas => {
        const link = document.createElement('a');
        link.download = `evidence-${this.state.currentResult.title.toLowerCase()}.png`;
        link.href = canvas.toDataURL();
        link.click();
      });
    } else {
      alert(i18n.t('messages.downloadNotAvailable', 'Download feature requires html2canvas library'));
    }
  }

  /**
   * Get progress percentage
   */
  getProgress() {
    return ((this.state.currentScenarioIndex + 1) / this.scenarios.length) * 100;
  }

  /**
   * Main render function - updates UI based on state
   */
  render() {
    const app = document.getElementById('app');
    if (!app) return;

    // Clear app
    app.innerHTML = '';

    // Render based on game status
    switch (this.state.gameStatus) {
      case 'intro':
        this.renderIntro(app);
        break;
      case 'registration':
        this.renderRegistration(app);
        break;
      case 'playing':
        this.renderGame(app);
        break;
      case 'finished':
        this.renderResult(app);
        break;
    }
  }

  /**
   * Render intro screen
   */
  renderIntro(container) {
    container.innerHTML = `
      <div class="screen intro-screen">
        <div class="intro-content">
          <div class="sparkle-icon">✨</div>
          <h1 class="title">${i18n.t('app.title')}</h1>
          <p class="subtitle">${i18n.t('app.subtitle')}</p>
          <p class="tagline">${i18n.t('app.tagline')}</p>
          
          <button class="btn btn-primary" id="start-btn">
            <span class="play-icon">▶</span>
            ${i18n.t('buttons.startJourney')}
          </button>

          ${this.getHistory().length > 0 ? `
            <button class="btn btn-secondary" id="history-btn">
              📊 ${i18n.t('buttons.viewArchetypes')}
            </button>
            <div id="history-list" class="history-list hidden">
              ${this.renderHistoryList()}
            </div>
          ` : ''}
        </div>
      </div>
    `;

    document.getElementById('start-btn').addEventListener('click', () => this.startGame());
    
    if (this.getHistory().length > 0) {
      const historyBtn = document.getElementById('history-btn');
      const historyList = document.getElementById('history-list');
      historyBtn.addEventListener('click', () => {
        historyList.classList.toggle('hidden');
      });
    }
  }

  /**
   * Render registration form
   */
  renderRegistration(container) {
    container.innerHTML = `
      <div class="screen registration-screen">
        <div class="form-container">
          <h2 class="form-title">${i18n.t('form.title')}</h2>
          <p class="form-subtitle">${i18n.t('form.subtitle')}</p>

          <form id="registration-form" class="registration-form">
            <div class="form-group">
              <input 
                type="text" 
                id="name-input" 
                placeholder="${i18n.t('form.name')}"
                required
                class="form-input"
              />
            </div>

            <div class="form-group">
              <input 
                type="email" 
                id="email-input" 
                placeholder="${i18n.t('form.email')}"
                required
                class="form-input"
              />
            </div>

            <div class="form-group">
              <input 
                type="text" 
                id="location-input" 
                placeholder="${i18n.t('form.location')}"
                required
                class="form-input"
              />
            </div>

            <button type="submit" class="btn btn-primary">
              ${i18n.t('buttons.identify')}
            </button>
          </form>

          <button class="btn btn-secondary" id="skip-registration">
            ${i18n.t('buttons.alreadyRegistered')}
          </button>
        </div>
      </div>
    `;

    const form = document.getElementById('registration-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.registerUser({
        name: document.getElementById('name-input').value,
        email: document.getElementById('email-input').value,
        location: document.getElementById('location-input').value
      });
    });

    document.getElementById('skip-registration').addEventListener('click', () => {
      this.state.gameStatus = 'playing';
      this.render();
    });
  }

  /**
   * Render game screen with scenario
   */
  renderGame(container) {
    const scenario = this.scenarios[this.state.currentScenarioIndex];
    const progress = this.getProgress();

    container.innerHTML = `
      <div class="screen game-screen">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progress}%"></div>
        </div>

        <div class="scenario-card">
          <div class="swipe-hint">${i18n.t('game.swipeInstruction')}</div>
          
          <div class="scenario-question">
            ${scenario.question}
          </div>

          <div class="scenario-choices">
            <div class="choice-left">
              <span class="arrow">←</span>
              <span class="choice-text">${scenario.left}</span>
            </div>
            <div class="choice-right">
              <span class="choice-text">${scenario.right}</span>
              <span class="arrow">→</span>
            </div>
          </div>

          <div class="swipe-instruction">${i18n.t('game.swipeHint')}</div>
        </div>

        <div class="choice-buttons">
          <button class="btn btn-choice" id="choice-left">
            ← ${scenario.left}
          </button>
          <button class="btn btn-choice" id="choice-right">
            ${scenario.right} →
          </button>
        </div>
      </div>
    `;

    document.getElementById('choice-left').addEventListener('click', () => this.handleChoice('left'));
    document.getElementById('choice-right').addEventListener('click', () => this.handleChoice('right'));
  }

  /**
   * Render result screen
   */
  renderResult(container) {
    const result = this.state.currentResult;
    const showShadow = this.state.showShadow;

    container.innerHTML = `
      <div class="screen result-screen">
        <div class="archetype-card" id="archetype-card">
          <div class="archetype-header">
            <h3 class="archetype-label">
              ${showShadow ? i18n.t('archetype.shadowLabel') : i18n.t('archetype.label')}
            </h3>
            <h1 class="archetype-title">${result.title}</h1>
          </div>

          <div class="archetype-description">
            ${showShadow ? (result.shadow || i18n.t('archetype.shadowNotRevealed')) : result.description}
          </div>

          <div class="archetype-traits">
            ${result.traits.map(trait => `<span class="trait-badge">${trait}</span>`).join('')}
          </div>

          <div class="archetype-dimensions">
            <div class="dimension">
              <label>${i18n.t('archetype.chaos')} / ${i18n.t('archetype.order')}</label>
              <div class="dimension-bar">
                <div class="dimension-fill" style="width: ${(result.dimensions.chaos / (result.dimensions.chaos + result.dimensions.order)) * 100}%"></div>
              </div>
            </div>
            <div class="dimension">
              <label>${i18n.t('archetype.emotion')} / ${i18n.t('archetype.logic')}</label>
              <div class="dimension-bar">
                <div class="dimension-fill" style="width: ${(result.dimensions.emotion / (result.dimensions.emotion + result.dimensions.logic)) * 100}%"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="result-actions">
          <button class="btn btn-shadow" id="shadow-toggle">
            ${showShadow ? '☀️' : '🌙'} ${showShadow ? i18n.t('buttons.returnToLight') : i18n.t('buttons.revealShadow')}
          </button>

          <div class="action-row">
            <button class="btn btn-secondary" id="download-btn">
              💾 ${i18n.t('buttons.saveCard')}
            </button>
            <button class="btn btn-secondary" id="restart-btn">
              🔄 ${i18n.t('buttons.restart')}
            </button>
          </div>

          <button class="btn btn-instagram" id="instagram-btn">
            📷 ${i18n.t('buttons.followInstagram')}
          </button>
        </div>
      </div>
    `;

    document.getElementById('shadow-toggle').addEventListener('click', () => this.toggleShadow());
    document.getElementById('download-btn').addEventListener('click', () => this.downloadCard());
    document.getElementById('restart-btn').addEventListener('click', () => this.resetGame());
    document.getElementById('instagram-btn').addEventListener('click', () => {
      window.open('https://instagram.com/fabianosaft', '_blank');
    });
  }

  /**
   * Get user history
   */
  getHistory() {
    return storage.getHistory();
  }

  /**
   * Render history list
   */
  renderHistoryList() {
    const history = this.getHistory();
    return history.map((item, idx) => `
      <div class="history-item">
        <span class="history-archetype">${item.title}</span>
        <span class="history-date">${new Date(item.completedAt).toLocaleDateString()}</span>
      </div>
    `).join('');
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new EvidenceApp();
});
