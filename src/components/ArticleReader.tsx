import React, { useState } from 'react';
import { Article } from '../types';
import {
  ArrowLeft,
  Heart,
  Bookmark,
  Share2,
  Clock,
  Eye,
  Sparkles,
  ShieldAlert,
  Send,
  MessageSquare,
  Check,
} from 'lucide-react';
import { playTavernClick, playRuneChime } from '../utils/audio';

interface ArticleReaderProps {
  article: Article;
  onBack: () => void;
  onToggleLike: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  onAddComment: (articleId: string, author: string, text: string) => void;
}

export const ArticleReader: React.FC<ArticleReaderProps> = ({
  article,
  onBack,
  onToggleLike,
  onToggleBookmark,
  onAddComment,
}) => {
  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('Странник Рэкласта');
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    playRuneChime();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(article.id, commentAuthor.trim() || 'Анонимный паладин', commentText.trim());
    setCommentText('');
    playTavernClick();
  };

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'text-amber-400 border-amber-500/40 bg-amber-950/40';
      case 'epic':
        return 'text-purple-400 border-purple-500/40 bg-purple-950/40';
      case 'rare':
        return 'text-sky-400 border-sky-500/40 bg-sky-950/40';
      default:
        return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => {
            playTavernClick();
            onBack();
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-amber-300 hover:bg-neutral-900 border border-neutral-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Назад к хроникам</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playRuneChime();
              onToggleLike(article.id);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              article.isLiked
                ? 'border-rose-500/60 bg-rose-950/40 text-rose-400'
                : 'border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:text-rose-400'
            }`}
          >
            <Heart className={`w-4 h-4 ${article.isLiked ? 'fill-rose-500' : ''}`} />
            <span className="font-mono tabular-nums">{article.likes}</span>
          </button>

          <button
            onClick={() => {
              playTavernClick();
              onToggleBookmark(article.id);
            }}
            className={`p-2 rounded-lg border text-xs transition-colors ${
              article.isBookmarked
                ? 'border-amber-500/60 bg-amber-950/40 text-amber-300'
                : 'border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:text-amber-400'
            }`}
            title="В свиток избранного"
          >
            <Bookmark className={`w-4 h-4 ${article.isBookmarked ? 'fill-amber-400' : ''}`} />
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:text-amber-300 text-xs transition-colors"
            title="Скопировать ссылку на свиток"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? 'Скопировано!' : 'Поделиться'}</span>
          </button>
        </div>
      </div>

      {/* Hero Header Article Block */}
      <div className="rounded-2xl border border-amber-900/40 bg-[#101420] overflow-hidden shadow-2xl">
        <div className="relative aspect-video sm:aspect-[21/9] w-full overflow-hidden bg-neutral-900">
          <img
            src={article.coverImage}
            alt={article.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101420] via-[#101420]/50 to-transparent" />

          <div className="absolute bottom-6 left-6 right-6">
            <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-md border border-amber-500/40 bg-amber-950/60 text-amber-300 backdrop-blur-md">
              {article.game}
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-amber-900/20 text-xs text-neutral-400">
            {/* Author Profile */}
            <div className="flex items-center gap-3">
              <img
                src={article.authorAvatar}
                alt={article.authorName}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-500/40"
              />
              <div>
                <div className="font-semibold text-neutral-200 text-sm">
                  {article.authorName}
                </div>
                <div className="text-amber-400/80 text-xs">{article.authorTitle}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 font-mono">
              <span>{article.date}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-amber-300">
                <Clock className="w-3.5 h-3.5" />
                <span>{article.readTime}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                <span>{article.views} просмотров</span>
              </span>
            </div>
          </div>

          <h1 className="font-cinzel text-2xl sm:text-4xl font-bold text-neutral-100 leading-tight">
            {article.title}
          </h1>

          <p className="text-base sm:text-lg text-amber-100/80 font-light leading-relaxed italic border-l-2 border-amber-500/60 pl-4">
            {article.subtitle}
          </p>

          {/* Stat Matrix Highlights */}
          {article.statHighlights && article.statHighlights.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
              {article.statHighlights.map((stat, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl border border-amber-900/30 bg-[#0c0e14]/80 flex flex-col justify-between"
                >
                  <div className="text-[11px] text-neutral-400 uppercase tracking-wider">
                    {stat.label}
                  </div>
                  <div className="text-lg font-bold font-mono text-amber-300 mt-1 tabular-nums">
                    {stat.value}
                  </div>
                  {stat.tier && (
                    <div className="text-[10px] text-amber-500/80 font-semibold mt-1">
                      Ранг: {stat.tier}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Article Content Sections */}
      <div className="p-6 sm:p-10 rounded-2xl border border-amber-900/30 bg-[#101420] text-neutral-200 space-y-10 leading-relaxed text-base sm:text-lg">
        {article.sections.map((section, idx) => (
          <section key={idx} className="space-y-4">
            <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-amber-200 pt-2 border-b border-amber-900/30 pb-2">
              {section.title}
            </h2>

            <p className="whitespace-pre-line text-neutral-300 text-sm sm:text-base leading-relaxed">
              {section.text}
            </p>

            {/* Pro-Tip Box with glowing runic accent */}
            {section.tipBox && (
              <div className="p-5 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-amber-950/20 to-transparent flex items-start gap-3.5 shadow-sm">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-amber-200 leading-relaxed">
                  {section.tipBox}
                </div>
              </div>
            )}

            {/* Loot & Drop Table if present */}
            {section.lootTable && section.lootTable.length > 0 && (
              <div className="mt-4 rounded-xl border border-amber-900/30 bg-[#0c0e14]/70 overflow-hidden">
                <div className="px-4 py-2.5 bg-neutral-900/80 border-b border-neutral-800 text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center justify-between">
                  <span>Трофеи & Лут</span>
                  <span>Шанс / Источник</span>
                </div>
                <div className="divide-y divide-neutral-800/60">
                  {section.lootTable.map((item, lIdx) => (
                    <div
                      key={lIdx}
                      className="px-4 py-3 flex items-center justify-between text-xs sm:text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase border ${getRarityBadge(
                            item.rarity
                          )}`}
                        >
                          {item.rarity}
                        </span>
                        <span className="font-medium text-neutral-200">{item.name}</span>
                      </div>
                      <div className="text-right text-xs font-mono text-neutral-400">
                        <span className="text-amber-300 font-semibold">{item.dropRate}</span>
                        <span className="text-neutral-500 ml-2">({item.source})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        ))}

        {article.conclusion && (
          <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/50 text-neutral-300 text-sm leading-relaxed">
            <h3 className="font-cinzel text-base font-bold text-amber-300 mb-2">
              Эпилог летописца
            </h3>
            <p>{article.conclusion}</p>
          </div>
        )}

        {/* Tags */}
        <div className="pt-6 border-t border-amber-900/30 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-md bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-400"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Comments Section */}
      <div className="p-6 sm:p-10 rounded-2xl border border-amber-900/30 bg-[#101420] space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-cinzel text-xl font-bold text-neutral-100 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-400" />
            <span>Обсуждение у костра ({article.comments.length})</span>
          </h3>
        </div>

        {/* Add Comment Form */}
        <form onSubmit={handleCommentSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Ваше имя / Никнейм"
              value={commentAuthor}
              onChange={(e) => setCommentAuthor(e.target.value)}
              className="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
            />
          </div>
          <div className="flex items-end gap-2">
            <textarea
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Поделитесь своим опытом или задайте вопрос автору манускрипта..."
              className="flex-1 px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs sm:text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500 resize-none"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="px-4 py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-neutral-950 font-bold rounded-xl text-xs uppercase tracking-wider hover:brightness-110 disabled:opacity-40 transition-all flex items-center gap-1.5 shrink-0"
            >
              <Send className="w-4 h-4" />
              <span>Отправить</span>
            </button>
          </div>
        </form>

        {/* Existing Comments */}
        <div className="space-y-3 pt-4 border-t border-neutral-800/80">
          {article.comments.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-xl border border-neutral-800/60 bg-[#0c0e14]/60 space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-neutral-200">{c.author}</span>
                  <span className="text-neutral-500 font-mono">{c.date}</span>
                </div>
                <div className="text-rose-400 font-mono text-[11px] flex items-center gap-1">
                  <Heart className="w-3 h-3 fill-rose-500/20" />
                  <span>{c.likes}</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
