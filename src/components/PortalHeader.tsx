import React from 'react';
import { ViewMode, GameTitle, User, Season } from '../types';
import { Flame, PenTool, Bookmark, Sparkles, Shield, LogOut, User as UserIcon } from 'lucide-react';
import { playTavernClick } from '../utils/audio';
import { SeasonalAccumulation } from './SeasonalAccumulation';

interface PortalHeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  selectedGame: GameTitle | 'all';
  onSelectGame: (game: GameTitle | 'all') => void;
  isAmbientActive: boolean;
  onToggleAmbient: () => void;
  bookmarkedCount: number;
  currentUser: User | null;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  season?: Season;
}

export const PortalHeader: React.FC<PortalHeaderProps> = ({
  viewMode,
  onViewModeChange,
  selectedGame,
  onSelectGame,
  isAmbientActive,
  onToggleAmbient,
  bookmarkedCount,
  currentUser,
  onOpenAuthModal,
  onLogout,
  season = 'winter',
}) => {
  const handleNavClick = (mode: ViewMode, game?: GameTitle | 'all') => {
    playTavernClick();
    onViewModeChange(mode);
    if (game !== undefined) {
      onSelectGame(game);
    }
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-amber-900/30 bg-[#0c0e14]/90 backdrop-blur-md overflow-visible">
      {/* Seasonal Snow Mounds / Autumn Foliage on Top Header Bar */}
      <SeasonalAccumulation season={season} variant="nav" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Zone 1: Single Brand Wordmark in Cinzel Display Font */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 flex items-center justify-center text-amber-200 border border-amber-500/40 shadow-sm shadow-amber-900/30">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <button
            onClick={() => handleNavClick('catalog', 'all')}
            className="text-left cursor-pointer group"
          >
            <span className="font-cinzel text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-amber-500 whitespace-nowrap block">
              Arcane Chronicles
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          <button
            onClick={() => handleNavClick('catalog', 'all')}
            className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-md transition-colors whitespace-nowrap shrink-0 ${
              viewMode === 'catalog' && selectedGame === 'all'
                ? 'text-amber-300 bg-amber-950/50 border border-amber-500/30'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Все хроники
          </button>
          <button
            onClick={() => handleNavClick('catalog', 'Lineage 2')}
            className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-md transition-colors whitespace-nowrap shrink-0 ${
              viewMode === 'catalog' && selectedGame === 'Lineage 2'
                ? 'text-amber-300 bg-amber-950/50 border border-amber-500/30'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Lineage 2
          </button>
          <button
            onClick={() => handleNavClick('catalog', 'World of Warcraft')}
            className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-md transition-colors whitespace-nowrap shrink-0 ${
              viewMode === 'catalog' && selectedGame === 'World of Warcraft'
                ? 'text-amber-300 bg-amber-950/50 border border-amber-500/30'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Warcraft
          </button>
          <button
            onClick={() => handleNavClick('catalog', 'Path of Exile 2')}
            className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-md transition-colors whitespace-nowrap shrink-0 ${
              viewMode === 'catalog' && selectedGame === 'Path of Exile 2'
                ? 'text-amber-300 bg-amber-950/50 border border-amber-500/30'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            PoE 2
          </button>
          <button
            onClick={() => handleNavClick('bookmarks')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-md transition-colors whitespace-nowrap shrink-0 ${
              viewMode === 'bookmarks'
                ? 'text-amber-300 bg-amber-950/50 border border-amber-500/30'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Избранное</span>
            {bookmarkedCount > 0 && (
              <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {bookmarkedCount}
              </span>
            )}
          </button>

          {/* ADMIN-ONLY NAVIGATION TAB: Completely hidden for regular users! */}
          {isAdmin && (
            <button
              onClick={() => handleNavClick('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-md transition-colors whitespace-nowrap shrink-0 ${
                viewMode === 'admin'
                  ? 'text-amber-300 bg-amber-500/20 border border-amber-500/60 shadow-sm shadow-amber-950/50'
                  : 'text-amber-400/90 hover:text-amber-300 bg-amber-950/30 border border-amber-500/30'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Админка сервера</span>
            </button>
          )}
        </nav>

        {/* Zone 3: Actions & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Cozy Fire Ambient Toggle */}
          <button
            onClick={onToggleAmbient}
            title={
              isAmbientActive
                ? 'Погасить огонь в таверне'
                : 'Зажечь огонь в таверне (уютный треск костра)'
            }
            className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
              isAmbientActive
                ? 'border-amber-400 bg-amber-950/80 text-amber-300 shadow-md shadow-amber-900/40 animate-pulse'
                : 'border-neutral-800 bg-neutral-900/80 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Flame
              className={`w-4 h-4 ${
                isAmbientActive ? 'text-amber-400 fill-amber-400 animate-bounce' : 'text-neutral-500'
              }`}
            />
            <span className="hidden sm:inline text-[11px]">
              {isAmbientActive ? 'Костёр горит' : 'Звук костра'}
            </span>
          </button>

          {/* Write Article CTA */}
          <button
            onClick={() => handleNavClick('editor')}
            className={`hidden sm:flex items-center gap-2 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all shadow-sm ${
              viewMode === 'editor'
                ? 'bg-amber-500 text-neutral-950 border border-amber-400'
                : 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-neutral-950 font-bold hover:brightness-110 border border-amber-400/60'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Написать</span>
          </button>

          {/* User Profile or Login CTA */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-2 border-l border-amber-900/30">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  if (isAdmin) handleNavClick('admin');
                }}
                title={isAdmin ? 'Нажмите, чтобы открыть Админку' : currentUser.username}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.username}
                  referrerPolicy="no-referrer"
                  className={`w-7 h-7 rounded-full object-cover ring-1 ${
                    isAdmin ? 'ring-amber-400 ring-2' : 'ring-neutral-700'
                  }`}
                />
                <span className="hidden xl:inline text-xs font-medium text-neutral-200 truncate max-w-[120px]">
                  {currentUser.username}
                </span>
              </div>

              <button
                onClick={onLogout}
                title="Выйти из аккаунта"
                className="p-1.5 text-neutral-400 hover:text-rose-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="px-3 py-1.5 rounded-lg border border-amber-500/40 text-amber-300 hover:bg-amber-950/40 text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Войти
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
