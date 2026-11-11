import React, { useState } from 'react';
import { Article, GameTitle, ArticleCategory, StatHighlight, ArticleSection } from '../types';
import {
  PenTool,
  Plus,
  Trash2,
  Eye,
  Check,
  Sparkles,
  Image as ImageIcon,
  BookOpen,
  ArrowLeft,
} from 'lucide-react';
import l2Img from '../assets/images/article_lineage2_siege_1792514647252.jpg';
import wowImg from '../assets/images/article_wow_raid_1792514644485.jpg';
import poeImg from '../assets/images/article_poe_build_1792514645547.jpg';
import heroImg from '../assets/images/mmorpg_hero_portal_1792514642830.jpg';
import chroniclerAvatar from '../assets/images/author_chronicler_1792514646307.jpg';
import { playTavernClick, playRuneChime } from '../utils/audio';

interface ArticleEditorProps {
  onPublish: (newArticle: Article) => void;
  onCancel: () => void;
}

const PRESET_COVERS = [
  { name: 'Lineage 2 Осада', url: l2Img },
  { name: 'Warcraft Мифик-Рейд', url: wowImg },
  { name: 'PoE 2 Алхимический Кабинет', url: poeImg },
  { name: 'Древние Руины Портала', url: heroImg },
];

export const ArticleEditor: React.FC<ArticleEditorProps> = ({ onPublish, onCancel }) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  // Form states
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [game, setGame] = useState<GameTitle>('Lineage 2');
  const [category, setCategory] = useState<ArticleCategory>('builds');
  const [coverImage, setCoverImage] = useState(l2Img);
  const [authorName, setAuthorName] = useState('Архимагистр Станислав');
  const [authorTitle, setAuthorTitle] = useState('Летописец MMORPG');
  const [tagsStr, setTagsStr] = useState('Гайд, Механика, Топ');

  // Stat highlights
  const [stats, setStats] = useState<StatHighlight[]>([
    { label: 'Требуемый уровень', value: '85+', tier: 'S' },
    { label: 'Шанс успеха', value: '75%', tier: 'A' },
  ]);

  // Sections
  const [sections, setSections] = useState<ArticleSection[]>([
    {
      title: '01. Введение в механику и подготовка',
      text: 'Опишите ключевую суть билда или тактики. С какими сложностями сталкивается игрок и почему этот подход эффективен...',
      tipBox: 'Совет мастера: Обратите внимание на правильную ротацию баффов перед пулом!',
    },
    {
      title: '02. Пошаговое выполнение и ротация',
      text: 'Подробный разбор последовательности действий, выбора экипировки и распределения очков умений.',
    },
  ]);

  const [conclusion, setConclusion] = useState(
    'Следуя этим рекомендациям, вы сможете значительно повысить эффективность вашего персонажа в актуальных хрониках.'
  );

  const handleAddStat = () => {
    setStats([...stats, { label: 'Новый параметр', value: '100', tier: 'A' }]);
  };

  const handleRemoveStat = (index: number) => {
    setStats(stats.filter((_, i) => i !== index));
  };

  const handleUpdateStat = (index: number, field: keyof StatHighlight, value: string) => {
    const updated = [...stats];
    updated[index] = { ...updated[index], [field]: value };
    setStats(updated);
  };

  const handleAddSection = () => {
    setSections([
      ...sections,
      {
        title: `0${sections.length + 1}. Новая глава манускрипта`,
        text: 'Текст следующего раздела статьи...',
      },
    ]);
  };

  const handleRemoveSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const handleUpdateSection = (index: number, field: keyof ArticleSection, value: string) => {
    const updated = [...sections];
    updated[index] = { ...updated[index], [field]: value };
    setSections(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    playRuneChime();

    const tags = tagsStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newArticle: Article = {
      id: `art_${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim() || 'Новое руководство от автора сообщества.',
      game,
      category,
      coverImage,
      authorName: authorName.trim() || 'Станислав',
      authorAvatar: chroniclerAvatar,
      authorTitle: authorTitle.trim() || 'Летописец',
      date: new Date().toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      readTime: '7 мин чтения',
      views: 1,
      likes: 1,
      isLiked: false,
      isBookmarked: false,
      tags: tags.length ? tags : [game],
      statHighlights: stats,
      sections,
      conclusion,
      comments: [],
    };

    onPublish(newArticle);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Controls */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => {
            playTavernClick();
            onCancel();
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-amber-300 hover:bg-neutral-900 border border-neutral-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Вернуться в библиотеку</span>
        </button>

        {/* Edit / Preview Segmented Control */}
        <div className="flex items-center p-1 rounded-xl bg-neutral-900 border border-neutral-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`px-3 py-1.5 rounded-lg font-semibold uppercase tracking-wider transition-all ${
              activeTab === 'edit'
                ? 'bg-amber-500 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Скрипторий (Редактор)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded-lg font-semibold uppercase tracking-wider transition-all ${
              activeTab === 'preview'
                ? 'bg-amber-500 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Предпросмотр свитка
          </button>
        </div>
      </div>

      {activeTab === 'edit' ? (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-200">
          {/* Main Card */}
          <div className="p-6 sm:p-8 rounded-2xl border border-amber-900/40 bg-[#101420] space-y-5">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <PenTool className="w-4 h-4" />
              <span>Создание нового манускрипта MMORPG</span>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Заголовок статьи *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Например: Полный гайд по прокачке Гладиатора и заточке дуалов в Lineage 2"
                className="w-full px-4 py-3 rounded-xl bg-neutral-900/90 border border-amber-900/40 text-base sm:text-lg font-cinzel text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Краткое введение / Подзаголовок
              </label>
              <textarea
                rows={2}
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Краткая суть статьи для карточки в каталоге и первого абзаца..."
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            {/* Game & Category Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  MMORPG Вселенная
                </label>
                <select
                  value={game}
                  onChange={(e) => setGame(e.target.value as GameTitle)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="Lineage 2">Lineage 2 (Essence / Remastered / C4)</option>
                  <option value="World of Warcraft">World of Warcraft (The War Within)</option>
                  <option value="Path of Exile 2">Path of Exile 2</option>
                  <option value="Guild Wars 2">Guild Wars 2</option>
                  <option value="Black Desert">Black Desert Online</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Категория манускрипта
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ArticleCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="builds">Гайды & Билды</option>
                  <option value="raids">Рейды & Тактики боссов</option>
                  <option value="lore">Лор & Хроники вселенной</option>
                  <option value="economy">Экономика, Рынок & Крафт</option>
                  <option value="meta">Патчи & Мета</option>
                </select>
              </div>
            </div>

            {/* Author info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Имя автора / Никнейм
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-200 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Титул автора
                </label>
                <input
                  type="text"
                  value={authorTitle}
                  onChange={(e) => setAuthorTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Cover image picker */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Обложка манускрипта
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                {PRESET_COVERS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setCoverImage(preset.url)}
                    className={`relative rounded-lg overflow-hidden border text-left p-1 transition-all ${
                      coverImage === preset.url
                        ? 'border-amber-500 ring-2 ring-amber-500/50'
                        : 'border-neutral-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-16 object-cover rounded"
                    />
                    <div className="text-[10px] text-neutral-300 truncate mt-1">
                      {preset.name}
                    </div>
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Или укажите свою ссылку на изображение..."
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-400 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Stat Matrix Highlights */}
          <div className="p-6 sm:p-8 rounded-2xl border border-amber-900/40 bg-[#101420] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-200">
                  Ключевые характеристики / Стат-матрица
                </h3>
                <p className="text-xs text-neutral-400">
                  Метрики отображаются на карточке статьи и в начале страницы
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddStat}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-800 hover:border-amber-500/40 text-xs text-amber-300"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Добавить показатель</span>
              </button>
            </div>

            <div className="space-y-2">
              {stats.map((stat, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => handleUpdateStat(idx, 'label', e.target.value)}
                    placeholder="Параметр (напр. DPS)"
                    className="flex-1 px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-200"
                  />
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => handleUpdateStat(idx, 'value', e.target.value)}
                    placeholder="Значение (напр. 25M)"
                    className="w-28 px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-amber-300 font-mono"
                  />
                  <select
                    value={stat.tier || 'S'}
                    onChange={(e) => handleUpdateStat(idx, 'tier', e.target.value)}
                    className="w-28 px-2 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-200"
                  >
                    <option value="Legendary">Legendary</option>
                    <option value="S">S-Tier</option>
                    <option value="A">A-Tier</option>
                    <option value="B">B-Tier</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => handleRemoveStat(idx)}
                    className="p-2 text-neutral-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Sections Builder */}
          <div className="p-6 sm:p-8 rounded-2xl border border-amber-900/40 bg-[#101420] space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-200">
                  Главы и разделы манускрипта
                </h3>
                <p className="text-xs text-neutral-400">
                  Добавляйте абзацы, тактические советы мастера и пояснения
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddSection}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-800 hover:border-amber-500/40 text-xs text-amber-300"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Добавить главу</span>
              </button>
            </div>

            <div className="space-y-6">
              {sections.map((sec, sIdx) => (
                <div
                  key={sIdx}
                  className="p-5 rounded-xl border border-neutral-800 bg-[#0c0e14]/70 space-y-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <input
                      type="text"
                      value={sec.title}
                      onChange={(e) => handleUpdateSection(sIdx, 'title', e.target.value)}
                      placeholder="Заголовок раздела (напр. 01. Фазы босса)"
                      className="flex-1 px-3.5 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-sm font-cinzel text-amber-200"
                    />
                    {sections.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSection(sIdx)}
                        className="p-2 text-neutral-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <textarea
                    rows={4}
                    value={sec.text}
                    onChange={(e) => handleUpdateSection(sIdx, 'text', e.target.value)}
                    placeholder="Основной текст раздела..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs sm:text-sm text-neutral-200 leading-relaxed resize-none"
                  />

                  <div>
                    <label className="block text-[11px] text-amber-400 font-semibold mb-1">
                      💡 Совет мастера (выделенный блок с руническим свечением, опционально):
                    </label>
                    <input
                      type="text"
                      value={sec.tipBox || ''}
                      onChange={(e) => handleUpdateSection(sIdx, 'tipBox', e.target.value)}
                      placeholder="Например: Не используйте сейвы до второй фазы..."
                      className="w-full px-3 py-2 rounded-lg bg-neutral-900/80 border border-amber-900/30 text-xs text-amber-200"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Epilogue */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Эпилог летописца (заключение)
              </label>
              <textarea
                rows={2}
                value={conclusion}
                onChange={(e) => setConclusion(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs sm:text-sm text-neutral-200 leading-relaxed resize-none"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Теги (через запятую)
              </label>
              <input
                type="text"
                value={tagsStr}
                onChange={(e) => setTagsStr(e.target.value)}
                placeholder="Lineage 2, Заточка, Гайд, Осады"
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 font-mono"
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-xl border border-neutral-800 text-xs uppercase tracking-wider text-neutral-400 hover:text-neutral-200"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-neutral-950 font-bold rounded-xl text-xs uppercase tracking-wider hover:brightness-110 shadow-lg shadow-amber-950/40 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Опубликовать в хроники</span>
            </button>
          </div>
        </form>
      ) : (
        /* Live Preview Mode */
        <div className="p-6 sm:p-10 rounded-2xl border border-amber-900/40 bg-[#101420] space-y-6">
          <div className="aspect-video w-full rounded-xl overflow-hidden bg-neutral-900">
            <img
              src={coverImage}
              alt={title || 'Превью'}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="px-2.5 py-1 text-xs font-semibold uppercase rounded border border-amber-500/40 bg-amber-950/40 text-amber-300">
            {game}
          </span>
          <h1 className="font-cinzel text-3xl font-bold text-neutral-100">{title || 'Без названия'}</h1>
          <p className="text-neutral-300 italic">{subtitle || 'Подзаголовок манускрипта...'}</p>
          <div className="space-y-4 pt-4 border-t border-amber-900/20">
            {sections.map((s, i) => (
              <div key={i} className="space-y-2">
                <h3 className="font-cinzel text-xl text-amber-200">{s.title}</h3>
                <p className="text-sm text-neutral-300 leading-relaxed">{s.text}</p>
                {s.tipBox && (
                  <div className="p-4 rounded-lg bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200">
                    💡 {s.tipBox}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
