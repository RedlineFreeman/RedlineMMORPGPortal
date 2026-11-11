/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Article,
  ViewMode,
  GameTitle,
  ArticleCategory,
  User,
  ServerConfig,
  ServerFile,
  DockerService,
  Season,
} from './types';
import { INITIAL_ARTICLES } from './data/initialArticles';
import {
  DEFAULT_ADMIN,
  INITIAL_SERVER_CONFIG,
  INITIAL_SERVER_FILES,
  INITIAL_DOCKER_SERVICES,
} from './data/authData';
import { PortalHeader } from './components/PortalHeader';
import { PortalHero } from './components/PortalHero';
import { ArticleCard } from './components/ArticleCard';
import { ArticleReader } from './components/ArticleReader';
import { ArticleEditor } from './components/ArticleEditor';
import { BookmarksView } from './components/BookmarksView';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/AuthModal';
import { SeasonWeatherOverlay } from './components/SeasonWeatherOverlay';
import { CozyCampfireFooter } from './components/CozyCampfireFooter';
import { toggleCozyFire, playTavernClick, playRuneChime } from './utils/audio';
import { Scroll, PenTool, Bookmark, Compass, Sparkles, Flame, Shield, LogIn } from 'lucide-react';

// Determine initial seasonal state based on current calendar month
const getCurrentSeason = (): Season => {
  const month = new Date().getMonth(); // 0 = Jan, 9 = Oct
  if (month === 11 || month === 0 || month === 1) return 'winter';
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  return 'autumn';
};

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('catalog');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedGame, setSelectedGame] = useState<GameTitle | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAmbientActive, setIsAmbientActive] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Dynamic Seasons & Weather System
  const [season, setSeason] = useState<Season>(() => {
    return (localStorage.getItem('arcane_season') as Season) || getCurrentSeason();
  });
  const [isWeatherEnabled, setIsWeatherEnabled] = useState<boolean>(() => {
    return localStorage.getItem('arcane_weather') !== 'false';
  });

  // Authenticated User State (defaults to configured Admin, persisted)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('arcane_user');
      return saved ? JSON.parse(saved) : DEFAULT_ADMIN;
    } catch {
      return DEFAULT_ADMIN;
    }
  });

  // Persistent articles storage
  const [articles, setArticles] = useState<Article[]>(() => {
    try {
      const saved = localStorage.getItem('arcane_articles');
      return saved ? JSON.parse(saved) : INITIAL_ARTICLES;
    } catch {
      return INITIAL_ARTICLES;
    }
  });

  // Persistent Server Telemetry Config
  const [serverConfig, setServerConfig] = useState<ServerConfig>(() => {
    try {
      const saved = localStorage.getItem('arcane_server_config');
      return saved ? JSON.parse(saved) : INITIAL_SERVER_CONFIG;
    } catch {
      return INITIAL_SERVER_CONFIG;
    }
  });

  // Persistent Server Files (for File Manager)
  const [serverFiles, setServerFiles] = useState<ServerFile[]>(() => {
    try {
      const saved = localStorage.getItem('arcane_server_files');
      return saved ? JSON.parse(saved) : INITIAL_SERVER_FILES;
    } catch {
      return INITIAL_SERVER_FILES;
    }
  });

  // Docker Services State
  const [dockerServices, setDockerServices] = useState<DockerService[]>(INITIAL_DOCKER_SERVICES);

  // Sync state to localStorage & backend
  useEffect(() => {
    localStorage.setItem('arcane_season', season);
  }, [season]);

  useEffect(() => {
    localStorage.setItem('arcane_weather', String(isWeatherEnabled));
  }, [isWeatherEnabled]);

  useEffect(() => {
    localStorage.setItem('arcane_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('arcane_articles', JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem('arcane_server_config', JSON.stringify(serverConfig));
  }, [serverConfig]);

  useEffect(() => {
    localStorage.setItem('arcane_server_files', JSON.stringify(serverFiles));
  }, [serverFiles]);

  const handleToggleAmbient = () => {
    const newState = !isAmbientActive;
    toggleCozyFire(newState);
    setIsAmbientActive(newState);
  };

  const handleReadArticle = (article: Article) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === article.id ? { ...a, views: a.views + 1 } : a))
    );
    setSelectedArticle({ ...article, views: article.views + 1 });
    setViewMode('reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleLike = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setArticles((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const isLiked = !a.isLiked;
        return {
          ...a,
          isLiked,
          likes: isLiked ? a.likes + 1 : Math.max(0, a.likes - 1),
        };
      })
    );

    if (selectedArticle && selectedArticle.id === id) {
      const isLiked = !selectedArticle.isLiked;
      setSelectedArticle({
        ...selectedArticle,
        isLiked,
        likes: isLiked ? selectedArticle.likes + 1 : Math.max(0, selectedArticle.likes - 1),
      });
    }
  };

  const handleToggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setArticles((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        return { ...a, isBookmarked: !a.isBookmarked };
      })
    );

    if (selectedArticle && selectedArticle.id === id) {
      setSelectedArticle({
        ...selectedArticle,
        isBookmarked: !selectedArticle.isBookmarked,
      });
    }
  };

  const handleAddComment = (articleId: string, author: string, text: string) => {
    const newComment = {
      id: `c_${Date.now()}`,
      author,
      avatar: currentUser?.avatar || selectedArticle?.authorAvatar || '',
      text,
      date: 'Только что',
      likes: 1,
    };

    setArticles((prev) =>
      prev.map((a) => {
        if (a.id !== articleId) return a;
        return {
          ...a,
          comments: [newComment, ...a.comments],
        };
      })
    );

    if (selectedArticle && selectedArticle.id === articleId) {
      setSelectedArticle({
        ...selectedArticle,
        comments: [newComment, ...selectedArticle.comments],
      });
    }
  };

  const handlePublishArticle = (newArticle: Article) => {
    setArticles((prev) => [newArticle, ...prev]);
    setSelectedArticle(newArticle);
    setViewMode('reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // File Manager Handlers
  const handleSaveFile = (fileId: string, newContent: string) => {
    setServerFiles((prev) =>
      prev.map((f) =>
        f.id === fileId
          ? {
              ...f,
              content: newContent,
              modified: new Date().toISOString().replace('T', ' ').slice(0, 16),
            }
          : f
      )
    );
  };

  const handleCreateFile = (name: string, path: string, content: string) => {
    const newFile: ServerFile = {
      id: `f_${Date.now()}`,
      name,
      path,
      type: 'file',
      size: `${(content.length / 1024).toFixed(1)} KB`,
      modified: new Date().toISOString().replace('T', ' ').slice(0, 16),
      content,
    };
    setServerFiles((prev) => [newFile, ...prev]);
  };

  const handleDeleteFile = (fileId: string) => {
    setServerFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  // Docker Controller Handlers
  const handleRestartDockerService = (name: string) => {
    playRuneChime();
    setDockerServices((prev) =>
      prev.map((s) => (s.name === name ? { ...s, status: 'restarting' } : s))
    );
    setTimeout(() => {
      setDockerServices((prev) =>
        prev.map((s) =>
          s.name === name
            ? {
                ...s,
                status: 'running',
                logs: [...(s.logs || []), `[Restart] Container ${name} gracefully restarted`],
              }
            : s
        )
      );
    }, 1200);
  };

  const handleToggleDockerService = (name: string) => {
    playTavernClick();
    setDockerServices((prev) =>
      prev.map((s) =>
        s.name === name
          ? {
              ...s,
              status: s.status === 'running' ? 'stopped' : 'running',
              logs: [
                ...(s.logs || []),
                `[State] Service ${name} transitioned to ${s.status === 'running' ? 'stopped' : 'running'}`,
              ],
            }
          : s
      )
    );
  };

  // Filtered articles
  const filteredArticles = articles.filter((a) => {
    const matchesGame = selectedGame === 'all' || a.game === selectedGame;
    const matchesCategory = selectedCategory === 'all' || a.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesGame && matchesCategory && matchesSearch;
  });

  const bookmarkedCount = articles.filter((a) => a.isBookmarked).length;
  const isAdmin = currentUser?.role === 'admin';

  return (
    <div
      className={`min-h-screen bg-[#0c0e14] text-[#e2e8f0] flex flex-col selection:bg-amber-500 selection:text-neutral-950 season-${season}`}
    >
      {/* Dynamic Seasonal Weather Falling Particles Overlay */}
      <SeasonWeatherOverlay season={season} isEnabled={isWeatherEnabled} />

      {/* Ambient subtle glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[320px] bg-amber-600/5 blur-[140px] pointer-events-none rounded-full" />

      {/* Top Bar Header with exclusive admin role visibility */}
      <PortalHeader
        viewMode={viewMode}
        onViewModeChange={(mode) => {
          setViewMode(mode);
          if (mode !== 'reader') setSelectedArticle(null);
        }}
        selectedGame={selectedGame}
        onSelectGame={setSelectedGame}
        isAmbientActive={isAmbientActive}
        onToggleAmbient={handleToggleAmbient}
        bookmarkedCount={bookmarkedCount}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={() => {
          playTavernClick();
          setCurrentUser(null);
          if (viewMode === 'admin') setViewMode('catalog');
        }}
        season={season}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {viewMode === 'catalog' && (
          <div className="space-y-8">
            <PortalHero
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedGame={selectedGame}
              onSelectGame={setSelectedGame}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              articlesCount={filteredArticles.length}
              season={season}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-amber-900/20">
                <h2 className="font-cinzel text-lg sm:text-xl font-bold text-neutral-100 flex items-center gap-2">
                  <Scroll className="w-5 h-5 text-amber-400" />
                  <span>
                    {selectedGame === 'all' ? 'Все свитки мудрости' : `Хроники: ${selectedGame}`}
                  </span>
                </h2>
                <span className="text-xs font-mono text-neutral-400 tabular-nums">
                  {filteredArticles.length} статей
                </span>
              </div>

              {filteredArticles.length === 0 ? (
                <div className="p-12 text-center rounded-2xl border border-amber-900/30 bg-[#101420] space-y-3">
                  <p className="font-cinzel text-base text-neutral-300">
                    По вашему запросу не найдено ни одного манускрипта
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedGame('all');
                      setSelectedCategory('all');
                    }}
                    className="px-4 py-2 mt-2 bg-neutral-900 hover:bg-neutral-800 text-amber-300 text-xs font-semibold uppercase tracking-wider rounded-lg border border-neutral-700"
                  >
                    Сбросить фильтры
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArticles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      season={season}
                      onRead={handleReadArticle}
                      onToggleLike={(id, e) => handleToggleLike(id, e)}
                      onToggleBookmark={(id, e) => handleToggleBookmark(id, e)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {viewMode === 'reader' && selectedArticle && (
          <ArticleReader
            article={selectedArticle}
            onBack={() => {
              setViewMode('catalog');
              setSelectedArticle(null);
            }}
            onToggleLike={(id) => handleToggleLike(id)}
            onToggleBookmark={(id) => handleToggleBookmark(id)}
            onAddComment={handleAddComment}
          />
        )}

        {viewMode === 'editor' && (
          <ArticleEditor
            onPublish={handlePublishArticle}
            onCancel={() => setViewMode('catalog')}
          />
        )}

        {viewMode === 'bookmarks' && (
          <BookmarksView
            articles={articles}
            season={season}
            onRead={handleReadArticle}
            onToggleLike={(id, e) => handleToggleLike(id, e)}
            onToggleBookmark={(id, e) => handleToggleBookmark(id, e)}
            onBackToCatalog={() => setViewMode('catalog')}
          />
        )}

        {/* ADMIN VIEW: ONLY ACCESSIBLE BY ADMIN */}
        {viewMode === 'admin' && isAdmin && (
          <AdminPanel
            currentUser={currentUser}
            serverConfig={serverConfig}
            onUpdateServerConfig={setServerConfig}
            files={serverFiles}
            onSaveFile={handleSaveFile}
            onCreateFile={handleCreateFile}
            onDeleteFile={handleDeleteFile}
            dockerServices={dockerServices}
            onRestartService={handleRestartDockerService}
            onToggleService={handleToggleDockerService}
          />
        )}
      </main>

      {/* Cozy Forest Campfire & Sitting Logs Footer with Seasonal Controls */}
      <CozyCampfireFooter
        season={season}
        onSeasonChange={setSeason}
        isWeatherEnabled={isWeatherEnabled}
        onToggleWeather={() => setIsWeatherEnabled(!isWeatherEnabled)}
        isAmbientActive={isAmbientActive}
        onToggleAmbient={handleToggleAmbient}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={(user) => {
          setCurrentUser(user);
          if (user.role === 'admin') {
            setViewMode('admin');
          }
        }}
      />

      {/* Mobile Sticky Thumb Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0c0e14]/95 backdrop-blur-md border-t border-amber-900/40 safe-area-bottom">
        <div className={`grid h-14 ${isAdmin ? 'grid-cols-5' : 'grid-cols-4'}`}>
          <button
            onClick={() => {
              playTavernClick();
              setViewMode('catalog');
              setSelectedArticle(null);
            }}
            className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
              viewMode === 'catalog' ? 'text-amber-300 font-semibold' : 'text-neutral-400'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 uppercase tracking-wider">Хроники</span>
          </button>

          <button
            onClick={() => {
              playTavernClick();
              setViewMode('bookmarks');
              setSelectedArticle(null);
            }}
            className={`flex flex-col items-center justify-center min-h-[44px] relative transition-colors ${
              viewMode === 'bookmarks' ? 'text-amber-300 font-semibold' : 'text-neutral-400'
            }`}
          >
            <Bookmark className="w-5 h-5" />
            {bookmarkedCount > 0 && (
              <span className="absolute top-1.5 right-4 px-1 py-0.2 bg-amber-500 text-neutral-950 font-mono text-[9px] font-bold rounded-full">
                {bookmarkedCount}
              </span>
            )}
            <span className="text-[10px] mt-0.5 uppercase tracking-wider">Избранное</span>
          </button>

          <button
            onClick={() => {
              playTavernClick();
              setViewMode('editor');
              setSelectedArticle(null);
            }}
            className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
              viewMode === 'editor' ? 'text-amber-300 font-semibold' : 'text-neutral-400'
            }`}
          >
            <PenTool className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 uppercase tracking-wider">Написать</span>
          </button>

          {/* Exclusive Admin button on mobile */}
          {isAdmin && (
            <button
              onClick={() => {
                playTavernClick();
                setViewMode('admin');
                setSelectedArticle(null);
              }}
              className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
                viewMode === 'admin' ? 'text-amber-300 font-semibold' : 'text-amber-400/80'
              }`}
            >
              <Shield className="w-5 h-5" />
              <span className="text-[10px] mt-0.5 uppercase tracking-wider">Админка</span>
            </button>
          )}

          <button
            onClick={handleToggleAmbient}
            className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
              isAmbientActive ? 'text-amber-400' : 'text-neutral-400'
            }`}
          >
            <Flame className={`w-5 h-5 ${isAmbientActive ? 'fill-amber-400 animate-pulse' : ''}`} />
            <span className="text-[10px] mt-0.5 uppercase tracking-wider">
              {isAmbientActive ? 'Костёр' : 'Эмбиент'}
            </span>
          </button>
        </div>
      </nav>
    </div>
  );
}
