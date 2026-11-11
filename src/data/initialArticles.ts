import { Article } from '../types';
import l2Img from '../assets/images/article_lineage2_siege_1792514647252.jpg';
import wowImg from '../assets/images/article_wow_raid_1792514644485.jpg';
import poeImg from '../assets/images/article_poe_build_1792514645547.jpg';
import chroniclerAvatar from '../assets/images/author_chronicler_1792514646307.jpg';

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'l2-overenchant-siege-2026',
    title: 'Тайны великих осад и оверчанта: Как покорить Аден и заточить оружие до сияния богов',
    subtitle: 'Анализ шансов заточки D-S84 грейда, скрытые механики кристаллов души и расстановка осадных големов клана.',
    game: 'Lineage 2',
    category: 'builds',
    coverImage: l2Img,
    authorName: 'Архимагистр Станислав',
    authorAvatar: chroniclerAvatar,
    authorTitle: 'Ветеран Хроник С4 и Gracia',
    date: '20 октября 2026',
    readTime: '9 мин чтения',
    views: 4280,
    likes: 312,
    isLiked: false,
    isBookmarked: true,
    tags: ['Осады', 'Заточка', 'Aden Castle', 'Soul Crystals', 'PvP'],
    statHighlights: [
      { label: 'Шанс заточки на +16', value: '1.8%', tier: 'Legendary' },
      { label: 'Множитель P.Atk', value: 'x3.4', tier: 'S' },
      { label: 'Откат осадного флага', value: '15 мин', tier: 'A' },
      { label: 'Расход Soulshots', value: '12 / удар', tier: 'B' },
    ],
    sections: [
      {
        title: '01. Математика заточки: Безопасный порог и кривая риска',
        text: 'Каждый, кто ступал на мостовые Гирана, помнит этот замирающий стук сердца при наложении благословенного свитка модификации. До порога +3 оружие гарантированно впитывает магию. Но начиная с +4, каждый шаг превращается в испытание воли. В обновленных хрониках Essence и Remastered алгоритм псевдослучайности учитывает серии неудач, однако шанс успешной инкрустации после +12 стабилизируется на жестких 22-25% за точку.',
        tipBox: 'Совет мастера: Никогда не используйте обычные свитки на оружие выше +7 без страховочных камней защиты печати (Scroll of Destruction), иначе потеря оружия в виде кристаллов отбросит ваш прогресс на недели.',
      },
      {
        title: '02. Позиционирование на воротах замка Аден',
        text: 'Внутренний двор замка представляет собой классическую смертельную ловушку для атакующих. Осадный голем крафтера должен ломать левые ворота, пока отряд Bishop и Cardinal держит круговую оборону под куполами Celestial Shield. Магические паки обязаны фокусить возвышенности стен, отсекая лучников Sagittarius и Moonlight Sentinel.',
        lootTable: [
          { name: 'Dragon Slayer (+16 Glow)', dropRate: 'Крафт 60%', rarity: 'legendary', source: 'Кузнец замка' },
          { name: 'Soul Crystal 16 Stage (Red)', dropRate: '12.5%', rarity: 'epic', source: 'РБ Antharas' },
          { name: 'Scroll: Enchant Weapon (S)', dropRate: '25.0%', rarity: 'rare', source: 'Осадный сундук' },
        ],
      },
      {
        title: '03. Роль баффов Overlord в переломный момент',
        text: 'Победа на осадном кристалле куется не только уроном, но и контролем. Своевременный проброс Suspension и Seal of Winter режет скорость атаки вражеских гладиаторов и тирантов вдвое, открывая окно для контрудара клановой кавалерии.',
      },
    ],
    conclusion: 'Осады в Lineage 2 — это чистый адреналин, где важен не только шмот, но и хладнокровие каждого мембера конст-пати. Держите банку CP наготове!',
    comments: [
      {
        id: 'c1',
        author: 'ElfLord99',
        avatar: chroniclerAvatar,
        text: 'Статья — просто бальзам на душу! Ностальгия по ночным осадам и дрожащим рукам при заточке на +10.',
        date: '2 часа назад',
        likes: 18,
      },
      {
        id: 'c2',
        author: 'DwarfCrafter',
        avatar: chroniclerAvatar,
        text: 'По поводу шанса на +12 подтверждаю, сожгли три веспера подряд, пока не применили камни печати.',
        date: '4 часа назад',
        likes: 7,
      },
    ],
  },
  {
    id: 'wow-nerubar-mythic-tactics',
    title: 'Дворец Неруб\'ар в Мифике: Пошаговая тактика на Королеву Ансурек и тайминги Heroism',
    subtitle: 'Как скоординировать 20 человек в узких паутинных залах, распределить кулдауны хилеров и пережить третью фазу.',
    game: 'World of Warcraft',
    category: 'raids',
    coverImage: wowImg,
    authorName: 'Рейдлидер Валериан',
    authorAvatar: chroniclerAvatar,
    authorTitle: 'World 50 Raider · The War Within',
    date: '19 октября 2026',
    readTime: '12 мин чтения',
    views: 6150,
    likes: 489,
    isLiked: true,
    isBookmarked: false,
    tags: ['World of Warcraft', 'The War Within', 'Mythic Raid', 'Неруб\'ар', 'Tactics'],
    statHighlights: [
      { label: 'Требуемый DPS рейда', value: '28.5M', tier: 'Legendary' },
      { label: 'Таймер берсерка', value: '10:30', tier: 'S' },
      { label: 'Количество вайпов в среднем', value: '180+', tier: 'A' },
      { label: 'Размер рейд-группы', value: '20 игроков', tier: 'B' },
    ],
    sections: [
      {
        title: '01. Фаза 1: Липкая паутина и капли яда',
        text: 'Главная ошибка рейда на первой фазе — хаотичный разнос метки ядовитого взрыва. Каждая группа должна двигаться по часовой стрелке строго по секторам круговой арены. Танки меняются на 3 стаках сдавления, мгновенно поворачивая босса спиной к милишникам.',
        tipBox: 'Совет рейдлидера: Оставьте Жажду крови / Героизм строго на экзекут-фазу ниже 30% здоровья босса. Первая фаза проходится чисто за счет механики и ротации сэйвов хилеров.',
      },
      {
        title: '02. Фаза 2: Межпространственные разломы',
        text: 'Платформа рушится, и игроки должны использовать нити паутины для перемещения между парящими коконами. Здесь ключевое значение имеет персональная мобильность: Рыцари Смерти и Жрецы требуют своевременного ускорения от Драктиров и Шаманов.',
        lootTable: [
          { name: 'Scepter of the Subjugated Queen', dropRate: '20.0%', rarity: 'legendary', source: 'Королева Ансурек' },
          { name: 'Void-Touched Carapace (Mythic)', dropRate: '35.0%', rarity: 'epic', source: 'Сундук Королевы' },
          { name: 'Spindle-Weaver Greatcloak', dropRate: '40.0%', rarity: 'epic', source: 'Сундук Королевы' },
        ],
      },
    ],
    conclusion: 'Королева Ансурек требует ювелирной дисциплины каждого бойца. Не жадничайте с дамагом, если на вас висит дебафф взрыва!',
    comments: [
      {
        id: 'c3',
        author: 'HolyPaladin',
        avatar: chroniclerAvatar,
        text: 'Отличная раскладка по кулдаунам хилеров на второй фазе, сразу помогло закрыть босса за вечер.',
        date: 'Вчера',
        likes: 24,
      },
    ],
  },
  {
    id: 'poe2-storm-witch-starter',
    title: 'Path of Exile 2: Стартовый билд Ведьмы Бури на дуал-специализации и каскадной заморозке',
    subtitle: 'Абсолютный контроль карт, масштабирование урона от шока и переключение оружия в новой механике линков умений.',
    game: 'Path of Exile 2',
    category: 'builds',
    coverImage: poeImg,
    authorName: 'Архимагистр Станислав',
    authorAvatar: chroniclerAvatar,
    authorTitle: 'Теорекрафтер Рэкласта',
    date: '18 октября 2026',
    readTime: '11 мин чтения',
    views: 8900,
    likes: 672,
    isLiked: false,
    isBookmarked: true,
    tags: ['Path of Exile 2', 'Witch', 'Storm Build', 'Endgame', 'Crafting'],
    statHighlights: [
      { label: 'Шанс шока', value: '100%', tier: 'Legendary' },
      { label: 'Радиус заморозки', value: '18 метров', tier: 'S' },
      { label: 'Скорость зачистки карт', value: '90 сек', tier: 'S' },
      { label: 'Бюджет старта', value: '3 Божественные сферы', tier: 'A' },
    ],
    sections: [
      {
        title: '01. Новая философия линков умений в PoE 2',
        text: 'В Path of Exile 2 сокеты перенесены с брони непосредственно на камни умений. Это дает небывалую свободу: теперь у нас активно сразу несколько шестилинков без необходимости тратить миллионы сфер сплетения на нагрудник. Мы используем гибридное комбо: посох для тяжелого шокового града и парные жезлы для мобильного ледяного шторма.',
        tipBox: 'Совет мастера: Инвестируйте в пассивное умение "Перегрузка стихий" на ранних этапах кампании — это дает мгновенный прирост урона на 40% без необходимости собирать высокий крит-шанс.',
      },
      {
        title: '02. Прокачка дерева пассивных умений и алхимия',
        text: 'Приоритет в первых трех актах — взятие нодов на регенерацию маны при убийстве и сопротивления стихиям. Уклонение в сочетании с Энергетическим щитом гарантирует выживание в ближнем бою при перекатах.',
        lootTable: [
          { name: 'Staff of the Maelstrom (6L)', dropRate: 'Крафт', rarity: 'legendary', source: 'Древний алтарь' },
          { name: 'Ring of Prismatic Fury', dropRate: '1.2%', rarity: 'epic', source: 'Боссы карт T16' },
          { name: 'Flawless Sapphire Gem', dropRate: '15.0%', rarity: 'rare', source: 'Лабиринт' },
        ],
      },
    ],
    conclusion: 'Этот билд прощает ошибки позиционирования благодаря заморозке врагов на расстоянии экрана. Идеален для комфортного старта новой лиги!',
    comments: [
      {
        id: 'c4',
        author: 'ExileHunter',
        avatar: chroniclerAvatar,
        text: 'Жду не дождусь релиза, связка шока и льда в трейлерах выглядела сокрушительно!',
        date: '3 дня назад',
        likes: 31,
      },
    ],
  },
];
