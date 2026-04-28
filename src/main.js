import gamesData from './data/games.js';

// State management
let currentCategory = 'All';
let searchQuery = '';
let selectedGame = null;

// DOM Elements
const appRoot = document.getElementById('app');
const searchInput = document.getElementById('search-input');
const gameCount = document.getElementById('game-count');
const categoriesNav = document.getElementById('categories-nav');
const gameGrid = document.getElementById('game-grid');
const browserView = document.getElementById('browser-view');
const playerView = document.getElementById('player-view');
const heroBanner = document.getElementById('hero-banner');
const viewTitle = document.getElementById('view-title');

// Player Elements
const backBtn = document.getElementById('back-btn');
const gameIframe = document.getElementById('game-iframe');
const currentGameTitle = document.getElementById('current-game-title');
const currentGameMeta = document.getElementById('current-game-meta');
const currentGameDesc = document.getElementById('current-game-desc');
const popoutBtn = document.getElementById('popout-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const logoBtn = document.getElementById('logo-btn');
const homeNav = document.getElementById('home-nav');

/**
 * Initialize application
 */
function init() {
    setupCategories();
    renderGames();
    setupEventListeners();
}

/**
 * Setup categories in the sidebar
 */
function setupCategories() {
    const categories = ['All', ...new Set(gamesData.map(g => g.category))];
    
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all text-left ${cat === currentCategory ? 'text-indigo-400 font-bold bg-indigo-500/5' : 'text-zinc-400 hover:text-white'}`;
        btn.innerText = cat;
        btn.onclick = () => {
            currentCategory = cat;
            selectedGame = null;
            updateCategoryUI(cat);
            renderGames();
            showView('browser');
        };
        categoriesNav.appendChild(btn);
    });
}

/**
 * Render games grid based on filters
 */
function renderGames() {
    const filtered = gamesData.filter(game => {
        const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             game.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = currentCategory === 'All' || game.category === currentCategory;
        return matchesSearch && matchesCategory;
    });

    gameGrid.innerHTML = '';
    
    if (filtered.length > 0) {
        filtered.forEach((game, index) => {
            const card = document.createElement('div');
            card.className = 'bg-zinc-900/50 border border-white/5 rounded-xl p-3 hover:border-indigo-500/50 transition-all cursor-pointer shadow-xl group';
            card.innerHTML = `
                <div class="h-32 bg-zinc-800 rounded-lg mb-4 overflow-hidden relative border border-white/5">
                    <img src="${game.thumbnail}" alt="${game.title}" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" loading="lazy">
                    <div class="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                        </div>
                    </div>
                </div>
                <div class="flex justify-between items-start">
                    <div class="overflow-hidden">
                        <h4 class="text-sm font-bold truncate group-hover:text-indigo-400 transition-colors uppercase tracking-tight">${game.title}</h4>
                        <p class="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">${game.category} • Browser</p>
                    </div>
                    <div class="text-[10px] bg-zinc-800/80 text-zinc-400 px-2 py-0.5 rounded border border-white/5 font-mono">9.2</div>
                </div>
            `;
            card.onclick = () => launchGame(game);
            gameGrid.appendChild(card);
        });
    } else {
        gameGrid.innerHTML = `
            <div class="col-span-full py-20 text-center bg-zinc-950/50 backdrop-blur-md border border-white/10 rounded-2xl">
                <svg class="w-12 h-12 text-zinc-800 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <h4 class="text-zinc-500 uppercase tracking-widest text-xs font-bold">No results matched your query</h4>
            </div>
        `;
    }

    gameCount.innerText = `${filtered.length} Available`;
    viewTitle.innerHTML = `<span class="w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span> ${currentCategory === 'All' ? 'DISCOVER GAMES' : `${currentCategory.toUpperCase()} TITLES`}`;
    
    // Hide hero if searching or filtered
    if (searchQuery || currentCategory !== 'All') {
        heroBanner.classList.add('hidden');
    } else {
        heroBanner.classList.remove('hidden');
    }
}

/**
 * Launch game in the player view
 */
function launchGame(game) {
    selectedGame = game;
    gameIframe.src = game.iframeUrl;
    currentGameTitle.innerText = game.title;
    currentGameMeta.innerHTML = `${game.category} <span class="w-1 h-1 rounded-full bg-zinc-700"></span> Web Optimized`;
    currentGameDesc.innerText = game.description;
    showView('player');
}

/**
 * Handle view switching
 */
function showView(view) {
    if (view === 'player') {
        browserView.classList.add('hidden');
        playerView.classList.remove('hidden');
    } else {
        browserView.classList.remove('hidden');
        playerView.classList.add('hidden');
        gameIframe.src = ''; // Stop game when leaving
    }
}

/**
 * Update active state in sidebar UI
 */
function updateCategoryUI(activeCat) {
    const buttons = categoriesNav.querySelectorAll('button');
    buttons.forEach(btn => {
        if (btn.innerText === activeCat) {
            btn.className = 'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all text-left text-indigo-400 font-bold bg-indigo-500/5';
        } else {
            btn.className = 'w-full flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-white rounded-lg text-sm transition-all text-left hover:bg-white/5';
        }
    });

    if (activeCat === 'All') {
        homeNav.className = 'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all bg-white/5 text-indigo-400 border border-white/5';
    } else {
        homeNav.className = 'w-full flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-white rounded-lg text-sm transition-all text-left hover:bg-white/5';
    }
}

/**
 * Event Listeners
 */
function setupEventListeners() {
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderGames();
    });

    backBtn.onclick = () => showView('browser');
    logoBtn.onclick = () => {
        currentCategory = 'All';
        searchQuery = '';
        searchInput.value = '';
        updateCategoryUI('All');
        renderGames();
        showView('browser');
    };

    homeNav.onclick = () => {
        currentCategory = 'All';
        updateCategoryUI('All');
        renderGames();
        showView('browser');
    };

    popoutBtn.onclick = () => {
        if (selectedGame) window.open(selectedGame.iframeUrl, '_blank');
    };

    fullscreenBtn.onclick = () => {
        if (gameIframe.requestFullscreen) {
            gameIframe.requestFullscreen();
        }
    };
}

// Kick off
init();
