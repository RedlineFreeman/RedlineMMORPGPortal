import React from 'react';
import { GameTitle, ArticleCategory, Season } from '../types';
import { Search, Compass, Swords, Shield, Scroll, Sparkles } from 'lucide-react';
import heroImg from '../assets/images/mmorpg_hero_portal_1792514642830.jpg';
import { playTavernClick } from '../utils/audio';
import { SeasonalAccumulation } from './SeasonalAccumulation';

interface PortalHeroProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedGame: GameTitle | 'all';
  onSelectGame: (game: GameTitle | 'all') => void;
  selectedCategory: ArticleCategory | 'all';
  onSelectCategory: (cat: ArticleCategory | 'all') => void;
  articlesCount: number;
  season?: Season;
}

export const PortalHero: React.FC<PortalHeroProps> = ({
  searchQuery,
  onSearchChange,
  selectedGame,
  onSelectGame,
  selectedCategory,
  onSelectCategory,
  articlesCount,
  season = 'winter',
}) => {
  const games: { title: GameTitle | 'all'; label: string }[] = [
    { title: 'all', label: 'Все миры' },
    { title: 'Lineage 2', label: 'Lineage 2' },
    { title: 'World of Warcraft', label: 'World of Warcraft' },
    { title: 'Path of Exile 2', label: 'Path of Exile 2' },
    { title: 'Guild Wars 2', label: 'Guild Wars 2' },
    { title: 'Black Desert', label: 'Black Desert' },
  ];

  const categories: { id: ArticleCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'Все свитки' },
    { id: 'builds', label: 'Гайды & Билды' },
    { id: 'raids', label: 'Рейды & Боссы' },
    { id: 'lore', label: 'Лор & Хроники' },
    { id: 'economy', label: 'Экономика & Крафт' },
    { id: 'meta', label: 'Патчи & Мета' },
  ];

  const handleGameSelect = (game: GameTitle | 'all') => {
    playTavernClick();
    onSelectGame(game);
  };

  const handleCategorySelect = (cat: ArticleCategory | 'all') => {
    playTavernClick();
    onSelectCategory(cat);
  };

  return (
    <div className="relative rounded-2xl border border-amber-900/40 bg-[#0e121b] text-neutral-100 shadow-xl mb-10 overflow-visible">
      {/* Real Seasonal Snow Mounds or Autumn Leaves Sitting on Hero Rim */}
      <SeasonalAccumulation season={season} variant="wide" />

      {/* Background with Atmospheric Dark Fog & Scrim */}
      <img
        src={heroImg}
        alt="MMORPG Portal Ruins"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover rounded-2xl opacity-35 transition-transform duration-1000 scale-102 hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e14] via-[#0c0e14]/75 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0c0e14] via-[#0c0e14]/80 to-transparent" />

      {/* Content */}
      <div className="relative z-10 p-6 sm:p-10 lg:p-12 flex flex-col justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400 mb-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Библиотека Великих Хроник</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums text-neutral-400">
              {articlesCount} манускриптов
            </span>
          </div>

          <h1 className="font-cinzel text-2xl sm:text-4xl lg:text-5xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 via-amber-100 to-amber-300 max-w-3xl text-balance leading-tight">
            Хроники Забытых Миров: Портал исследователей MMORPG
          </h1>

          <p className="mt-3 text-sm sm:text-base text-neutral-300 max-w-2xl leading-relaxed">
            Святилище знаний для авторов и игроков: тактики осад замков в Lineage 2, мифик-рейды в
            Warcraft, алхимия связок в Path of Exile 2 и хроники легендарных побед.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-400/80">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Поиск по статьям, боссам, механикам или авторам..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-neutral-950/80 backdrop-blur-md border border-amber-900/50 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/80 focus:border-amber-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs text-neutral-400 hover:text-white"
            >
              Очистить
            </button>
          )}
        </div>

        {/* Game Filters Segmented Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-amber-900/30">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400/70 mr-1 hidden sm:inline">
            Вселенная:
          </span>
          {games.map((g) => (
            <button
              key={g.title}
              onClick={() => handleGameSelect(g.title)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                selectedGame === g.title
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/60 shadow-xs'
                  : 'bg-neutral-900/60 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mr-1 hidden sm:inline">
            Тематика:
          </span>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => handleCategorySelect(c.id)}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                selectedCategory === c.id
                  ? 'text-amber-200 font-semibold underline underline-offset-4 decoration-amber-500'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
