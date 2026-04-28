/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gamepad2, 
  Search, 
  X, 
  Maximize2, 
  ChevronRight, 
  Monitor, 
  Info,
  Clock,
  ExternalLink,
  Github
} from 'lucide-react';
import gamesData from './data/games.json';

export default function App() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(gamesData.map(g => g.category))];
    return cats;
  }, []);

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            game.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || game.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="flex flex-col h-screen bg-[#09090b] text-slate-100 font-sans overflow-hidden">
      {/* Header Navigation */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-zinc-950/50 backdrop-blur-md z-50 shrink-0">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => { setSelectedGame(null); setActiveCategory('All'); setSearchQuery(''); }}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-transform group-hover:scale-105">
            <Gamepad2 className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tighter uppercase italic">Nexus Flux</h1>
        </div>
        
        <div className="flex-1 max-w-md mx-8">
          <div className="relative group">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search for a game..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-white/5 rounded-full py-2 px-10 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500/50 placeholder:text-zinc-600 transition-all font-medium"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <span className="hidden md:inline-block text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20 uppercase tracking-widest">
            {filteredGames.length} Available
          </span>
          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white transition-colors cursor-pointer">
            <Github className="w-4 h-4" />
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/5 p-6 flex flex-col gap-8 bg-zinc-950/20 hidden lg:flex shrink-0">
          <nav className="space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-4">Library</p>
            <button 
              onClick={() => setSelectedGame(null)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${!selectedGame ? 'bg-white/5 text-indigo-400 border border-white/5' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
            >
              <Monitor className="w-4 h-4" />
              Main Hub
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg text-sm transition-colors">
              <Clock className="w-4 h-4" />
              Recent
            </button>
          </nav>

          <nav className="space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-4">Categories</p>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setSelectedGame(null); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all text-left ${activeCategory === cat ? 'text-indigo-400 font-bold bg-indigo-500/5' : 'text-zinc-400 hover:text-white'}`}
              >
                {cat}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/5">
            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-600/10 border border-indigo-500/20">
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2 italic">Pro Version</p>
              <p className="text-[11px] text-zinc-400 leading-relaxed">Unlock dedicated servers and high-speed cloud sync.</p>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto scrollbar-hide bg-radial-gradient">
          <AnimatePresence mode="wait">
            {!selectedGame ? (
              <motion.div
                key="browser"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Featured Banner */}
                {activeCategory === 'All' && !searchQuery && (
                   <section className="relative h-64 rounded-2xl overflow-hidden group shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 via-zinc-900/60 to-transparent z-10"></div>
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center opacity-60 scale-100 group-hover:scale-105 transition-transform duration-1000"></div>
                    <div className="relative z-20 p-8 flex flex-col justify-center h-full max-w-lg">
                      <span className="text-[10px] bg-indigo-500 text-white font-bold uppercase px-2 py-0.5 rounded w-fit mb-4 tracking-widest">Featured Game</span>
                      <h2 className="text-5xl font-black italic tracking-tighter mb-4 leading-none uppercase">CYBER EXPLORER</h2>
                      <p className="text-zinc-300 text-sm mb-8 leading-relaxed">Experience a new dimension of web-based gaming with unblocked titles and optimized performance.</p>
                      <button className="bg-white text-black font-bold px-8 py-3 rounded-full w-fit hover:bg-indigo-400 hover:text-white transition-all shadow-lg active:scale-95 text-xs uppercase tracking-widest">
                        Browse Library
                      </button>
                    </div>
                  </section>
                )}

                {/* Game Grid */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xs font-bold text-zinc-400 flex items-center gap-2 tracking-widest uppercase">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>
                      {activeCategory === 'All' ? 'DISCOVER GAMES' : `${activeCategory} TITLES`}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {filteredGames.length > 0 ? (
                      filteredGames.map((game, i) => (
                        <motion.div
                          key={game.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                          onClick={() => setSelectedGame(game)}
                          className="game-card group"
                        >
                          <div className="h-32 bg-zinc-800 rounded-lg mb-4 overflow-hidden relative border border-white/5">
                            <img 
                              src={game.thumbnail} 
                              alt={game.title} 
                              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                                <Maximize2 className="w-5 h-5 text-white" />
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-between items-start">
                            <div className="overflow-hidden">
                              <h4 className="text-sm font-bold truncate group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{game.title}</h4>
                              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">{game.category} • Browser</p>
                            </div>
                            <div className="text-[10px] bg-zinc-800/80 text-zinc-400 px-2 py-0.5 rounded border border-white/5 font-mono">9.2</div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="col-span-full py-20 text-center glass-panel rounded-2xl">
                        <Search className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                        <h4 className="text-zinc-500 uppercase tracking-widest text-xs font-bold">No results matched your query</h4>
                      </div>
                    )}
                  </div>
                </section>
              </motion.div>
            ) : (
              <motion.div
                key="player"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setSelectedGame(null)}
                      className="p-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-zinc-400 hover:text-white"
                    >
                      <ChevronRight className="w-5 h-5 rotate-180" />
                    </button>
                    <div>
                      <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">{selectedGame.title}</h3>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        {selectedGame.category} <span className="w-1 h-1 rounded-full bg-zinc-700" /> Web Optimized
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="p-3 border border-white/10 rounded-xl hover:bg-white/5 transition-colors text-zinc-400 group" onClick={() => window.open(selectedGame.iframeUrl, '_blank')}>
                      <ExternalLink className="w-4 h-4 group-hover:text-indigo-400" />
                    </button>
                    <button 
                      className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-indigo-500/20 active:scale-95 transition-all flex items-center gap-2"
                      onClick={() => document.querySelector('iframe')?.requestFullscreen()}
                    >
                      <Maximize2 className="w-4 h-4" /> Fullscreen
                    </button>
                  </div>
                </div>

                <div className="aspect-video w-full bg-zinc-950 rounded-2xl border border-white/5 overflow-hidden shadow-2xl relative group">
                  <iframe 
                    src={selectedGame.iframeUrl} 
                    className="w-full h-full border-none"
                    title={selectedGame.title}
                    allowFullScreen
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                  <div className="md:col-span-3 space-y-4">
                    <h5 className="text-[10px] uppercase tracking-widest font-bold text-indigo-400 flex items-center gap-2 italic">
                      System Logs: Description
                    </h5>
                    <p className="text-zinc-400 text-sm leading-relaxed max-w-2xl px-4 border-l border-indigo-500/30">
                      {selectedGame.description}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 glass-panel rounded-xl">
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Statistics</p>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-[10px] uppercase">
                          <span className="text-zinc-500">Rating</span>
                          <span className="text-indigo-400 font-bold">8.4 / 10</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] uppercase">
                          <span className="text-zinc-500">Latency</span>
                          <span className="text-green-500 font-bold">12ms</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Status Bar Footer */}
      <footer className="h-10 border-t border-white/5 flex items-center justify-between px-6 bg-zinc-950 text-[10px] text-zinc-500 uppercase tracking-widest shrink-0">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> 
            SERVER: STABLE
          </span>
          <span className="hidden sm:inline-block">REGION: AUTO (OPTIMIZED)</span>
          <span className="hidden md:inline-block">FPS: 60.00</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-indigo-400 transition-colors">Discord</a>
          <a href="#" className="hover:text-indigo-400 transition-colors">Manual</a>
          <span className="text-zinc-800">Version 2.4.1</span>
        </div>
      </footer>
    </div>
  );
}
