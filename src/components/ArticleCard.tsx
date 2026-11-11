import React from 'react';
import { Article, Season } from '../types';
import { Eye, Heart, Bookmark, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { playTavernClick, playRuneChime } from '../utils/audio';
import { SeasonalAccumulation } from './SeasonalAccumulation';

interface ArticleCardProps {
  article: Article;
  season?: Season;
  onRead: (article: Article) => void;
  onToggleLike: (id: string, e: React.MouseEvent) => void;
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  season = 'winter',
  onRead,
  onToggleLike,
  onToggleBookmark,
}) => {
  const getGameColor = (game: string) => {
    switch (game) {
      case 'Lineage 2':
        return 'text-amber-400 border-amber-500/30 bg-amber-950/30';
      case 'World of Warcraft':
        return 'text-sky-400 border-sky-500/30 bg-sky-950/30';
      case 'Path of Exile 2':
        return 'text-rose-400 border-rose-500/30 bg-rose-950/30';
      case 'Guild Wars 2':
        return 'text-emerald-400 border-emerald-500/30 bg-emerald-950/30';
      default:
        return 'text-amber-300 border-amber-500/30 bg-amber-950/30';
    }
  };

  const handleCardClick = () => {
    playTavernClick();
    onRead(article);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    playRuneChime();
    onToggleLike(article.id, e);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    playTavernClick();
    onToggleBookmark(article.id, e);
  };

  return (
    <article
      onClick={handleCardClick}
      className="group relative flex flex-col justify-between rounded-xl border border-amber-900/30 hover:border-amber-500/60 bg-[#11141e] hover:bg-[#141824] transition-all duration-300 hover:shadow-xl hover:shadow-amber-950/20 cursor-pointer overflow-visible"
    >
      {/* Real Seasonal Snow Mounds or Autumn Leaves Sitting on Card Rim */}
      <SeasonalAccumulation season={season} variant="card" />

      <div>
        {/* Cover Image Container */}
        <div className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-neutral-900">
          <img
            src={article.coverImage}
            alt={article.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-106"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#11141e] via-[#11141e]/30 to-transparent" />

          {/* Floating Game Badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-md border backdrop-blur-md ${getGameColor(
                article.game
              )}`}
            >
              {article.game}
            </span>
          </div>

          {/* Quick Bookmark Action */}
          <button
            onClick={handleBookmark}
            title={article.isBookmarked ? 'Удалить из избранного' : 'Добавить в избранное'}
            className="absolute top-3 right-3 p-2 rounded-lg bg-black/60 hover:bg-black/80 backdrop-blur-md text-neutral-300 hover:text-amber-400 border border-white/10 transition-colors"
          >
            <Bookmark
              className={`w-4 h-4 ${
                article.isBookmarked ? 'fill-amber-400 text-amber-400' : ''
              }`}
            />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-3">
          {/* Unboxed Metadata (Zero-pill discipline) */}
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span>{article.authorName}</span>
            <span aria-hidden="true">·</span>
            <span>{article.date}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-amber-400/90 font-mono">
              <Clock className="w-3 h-3" />
              <span>{article.readTime}</span>
            </span>
          </div>

          {/* Title */}
          <h3 className="font-cinzel text-lg font-bold text-neutral-100 group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
            {article.title}
          </h3>

          {/* Subtitle / Excerpt */}
          <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
            {article.subtitle}
          </p>

          {/* Stat highlights tags if available */}
          {article.statHighlights && article.statHighlights.length > 0 && (
            <div className="pt-2 flex flex-wrap gap-2">
              {article.statHighlights.slice(0, 2).map((stat, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 px-2 py-1 rounded bg-neutral-900/80 border border-amber-900/40 text-[11px] font-mono text-neutral-300"
                >
                  <span className="text-amber-400/80 font-medium">{stat.label}:</span>
                  <span className="text-amber-200 font-semibold tabular-nums">{stat.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Metrics & Read Action */}
      <div className="p-5 sm:p-6 pt-0 border-t border-neutral-800/80 mt-4 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs font-mono tabular-nums text-neutral-400">
          <div className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-neutral-500" />
            <span>{article.views}</span>
          </div>

          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 hover:text-rose-400 transition-colors ${
              article.isLiked ? 'text-rose-500 font-bold' : ''
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                article.isLiked ? 'fill-rose-500 text-rose-500' : ''
              }`}
            />
            <span>{article.likes}</span>
          </button>
        </div>

        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 group-hover:text-amber-300 group-hover:translate-x-1 transition-all">
          <span>Читать свиток</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </article>
  );
};
