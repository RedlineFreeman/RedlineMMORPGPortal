import React from 'react';
import { Article, Season } from '../types';
import { Bookmark, ArrowLeft, BookOpen } from 'lucide-react';
import { ArticleCard } from './ArticleCard';
import { playTavernClick } from '../utils/audio';

interface BookmarksViewProps {
  articles: Article[];
  season?: Season;
  onRead: (article: Article) => void;
  onToggleLike: (id: string, e: React.MouseEvent) => void;
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
  onBackToCatalog: () => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  articles,
  season = 'winter',
  onRead,
  onToggleLike,
  onToggleBookmark,
  onBackToCatalog,
}) => {
  const bookmarked = articles.filter((a) => a.isBookmarked);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <button
            onClick={() => {
              playTavernClick();
              onBackToCatalog();
            }}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-amber-300 mb-2 uppercase tracking-wider font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Вернуться ко всем хроникам</span>
          </button>
          <h2 className="font-cinzel text-2xl font-bold text-neutral-100 flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-amber-400 fill-amber-400/20" />
            <span>Свиток избранных манускриптов ({bookmarked.length})</span>
          </h2>
        </div>
      </div>

      {bookmarked.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-amber-900/30 bg-[#101420] space-y-4">
          <BookOpen className="w-12 h-12 text-amber-500/40 mx-auto" />
          <h3 className="font-cinzel text-lg font-bold text-neutral-200">
            Ваш свиток избранного пока пуст
          </h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Нажимайте на значок закладки на карточке любой статьи, чтобы сохранить её в этот список для быстрого чтения.
          </p>
          <button
            onClick={onBackToCatalog}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-amber-300 text-xs font-semibold uppercase tracking-wider rounded-lg border border-amber-900/40"
          >
            Перейти к каталогу статей
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarked.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              season={season}
              onRead={onRead}
              onToggleLike={onToggleLike}
              onToggleBookmark={onToggleBookmark}
            />
          ))}
        </div>
      )}
    </div>
  );
};
