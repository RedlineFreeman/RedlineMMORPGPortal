import React, { useState, useEffect, useRef } from 'react';
import { Season } from '../types';
import { Wind, Volume2, VolumeX } from 'lucide-react';
import campfireArt from '../assets/images/cozy_forest_campfire_1792515910541.jpg';
import { playTavernClick, toggleCozyFire } from '../utils/audio';
import { SeasonalAccumulation } from './SeasonalAccumulation';

interface CozyCampfireFooterProps {
  season: Season;
  onSeasonChange: (s: Season) => void;
  isWeatherEnabled: boolean;
  onToggleWeather: () => void;
  isAmbientActive: boolean;
  onToggleAmbient: () => void;
}

interface Spark {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  color: string;
}

export const CozyCampfireFooter: React.FC<CozyCampfireFooterProps> = ({
  season,
  onSeasonChange,
  isWeatherEnabled,
  onToggleWeather,
  isAmbientActive,
  onToggleAmbient,
}) => {
  const [sittingMessage, setSittingMessage] = useState<string | null>(null);
  const sparkCanvasRef = useRef<HTMLCanvasElement>(null);

  // Natural rising sparks & embers rising directly from the artwork's real campfire
  useEffect(() => {
    const canvas = sparkCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = 180);
    const height = (canvas.height = 240);
    const sparks: Spark[] = [];

    const createSpark = (): Spark => ({
      x: width / 2 + (Math.random() - 0.5) * 36,
      y: height - 15,
      size: Math.random() * 2.2 + 1.0,
      speedY: Math.random() * 2.0 + 1.1,
      speedX: (Math.random() - 0.5) * 1.4,
      opacity: 1,
      color: Math.random() > 0.35 ? '#fbbf24' : '#f97316',
    });

    for (let i = 0; i < 24; i++) {
      const s = createSpark();
      s.y = Math.random() * height;
      sparks.push(s);
    }

    const loop = () => {
      ctx.clearRect(0, 0, width, height);

      sparks.forEach((s, idx) => {
        s.y -= s.speedY;
        s.x += s.speedX + Math.sin(s.y * 0.05) * 0.3;
        s.opacity -= 0.007;

        if (s.y < 0 || s.opacity <= 0) {
          sparks[idx] = createSpark();
          return;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = s.color;
        ctx.globalAlpha = Math.max(0, s.opacity);
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => cancelAnimationFrame(animId);
  }, []);

  const handleSitOnLog = (logName: string) => {
    playTavernClick();
    if (!isAmbientActive) {
      onToggleAmbient();
    }
    setSittingMessage(
      `Вы присели на ${logName} у костра. Ночная прохлада отступает, здоровье и мана восстанавливаются под уютный треск пламени...`
    );
    setTimeout(() => {
      setSittingMessage(null);
    }, 6000);
  };

  const getSeasonLabel = (s: Season) => {
    switch (s) {
      case 'winter':
        return 'Зима (Снегопад и пышные сугробы)';
      case 'spring':
        return 'Весна (Цветение сакуры)';
      case 'summer':
        return 'Лето (Теплые светлячки)';
      case 'autumn':
        return 'Осень (Золотой листопад)';
    }
  };

  return (
    <footer className="relative mt-20 border-t border-amber-900/40 bg-[#090b10] overflow-hidden text-neutral-200">
      {/* Campfire Forest Clearing Artwork Banner */}
      <div className="relative h-96 sm:h-112 w-full overflow-hidden select-none">
        <img
          src={campfireArt}
          alt="Уютный лагерь и костёр на опушке леса"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-bottom"
        />

        {/* Soft atmospheric gradient transitions */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090b10] via-transparent to-[#0c0e14]/90" />

        {/* Animated Fire Light Warm Breathing Glow around the real art campfire */}
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 w-80 h-52 rounded-full bg-amber-500/20 blur-3xl pointer-events-none animate-pulse" />

        {/* Natural golden sparks & embers rising above the campfire in the artwork */}
        <div className="absolute bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 pointer-events-none z-15 flex flex-col items-center">
          <canvas
            ref={sparkCanvasRef}
            className="w-44 h-60 -mb-8 pointer-events-none filter drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]"
          />
        </div>

        {/* Sitting Logs Interactive Affordance Buttons */}
        <div className="absolute bottom-5 left-0 right-0 max-w-4xl mx-auto px-4 flex flex-wrap items-center justify-center gap-3 z-25">
          {/* Left Log Button */}
          <div className="relative">
            <SeasonalAccumulation season={season} variant="button" />
            <button
              onClick={() => handleSitOnLog('левое замшелое бревно')}
              className="px-4 py-2 rounded-xl bg-black/80 hover:bg-amber-950/90 border border-amber-500/40 text-xs font-semibold text-amber-200 backdrop-blur-md transition-all hover:scale-105 active:scale-95 shadow-xl cursor-pointer"
            >
              <span>Присесть на левое бревно</span>
            </button>
          </div>

          {/* Central Fireplace Place Button */}
          <div className="relative">
            <SeasonalAccumulation season={season} variant="button" />
            <button
              onClick={() => handleSitOnLog('центральное место у костра')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 hover:brightness-115 border border-amber-300 text-xs font-bold text-neutral-950 backdrop-blur-md transition-all hover:scale-105 active:scale-95 shadow-2xl cursor-pointer"
            >
              <span>Сесть ближе к костру</span>
            </button>
          </div>

          {/* Right Log Button */}
          <div className="relative">
            <SeasonalAccumulation season={season} variant="button" />
            <button
              onClick={() => handleSitOnLog('правое бревно с шкурой волка')}
              className="px-4 py-2 rounded-xl bg-black/80 hover:bg-amber-950/90 border border-amber-500/40 text-xs font-semibold text-amber-200 backdrop-blur-md transition-all hover:scale-105 active:scale-95 shadow-xl cursor-pointer"
            >
              <span>Присесть на правое бревно</span>
            </button>
          </div>
        </div>

        {/* Floating Rest notification */}
        {sittingMessage && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 max-w-lg w-[90%] p-3.5 rounded-xl bg-neutral-950/95 border border-amber-500 text-amber-200 text-xs text-center backdrop-blur-md shadow-2xl animate-in fade-in slide-in-from-top-3 z-35">
            {sittingMessage}
          </div>
        )}
      </div>

      {/* Season Controls & Atmosphere Settings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="relative p-6 rounded-2xl border border-amber-900/40 bg-[#101420]/80 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-visible">
          <SeasonalAccumulation season={season} variant="wide" />

          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
              <Wind className="w-4 h-4 text-amber-300" />
              <span>Сезонное преображение портала</span>
            </div>
            <h4 className="font-cinzel text-lg font-bold text-neutral-100">
              Текущий сезон: {getSeasonLabel(season)}
            </h4>
            <p className="text-xs text-neutral-400 mt-1 max-w-xl">
              При смене сезона на карточки, навигацию и кнопки сайта ложатся рельефные снежные холмики с сосульками зимой, золотые листья осенью, или лепестки сакуры весной!
            </p>
          </div>

          {/* Season Segmented Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'winter' as Season, label: 'Зима' },
              { id: 'spring' as Season, label: 'Весна' },
              { id: 'summer' as Season, label: 'Лето' },
              { id: 'autumn' as Season, label: 'Осень' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  playTavernClick();
                  onSeasonChange(s.id);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                  season === s.id
                    ? 'border-amber-500 bg-amber-500/20 text-amber-300 shadow-sm'
                    : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {s.label}
              </button>
            ))}

            <button
              onClick={onToggleWeather}
              title="Включить / отключить падающие частицы"
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                isWeatherEnabled
                  ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300'
                  : 'border-neutral-800 text-neutral-500'
              }`}
            >
              {isWeatherEnabled ? 'Погода: Вкл' : 'Погода: Выкл'}
            </button>

            {/* Direct Campfire Sound Button */}
            <button
              onClick={onToggleAmbient}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                isAmbientActive
                  ? 'border-amber-400 bg-amber-950/80 text-amber-300 shadow-md shadow-amber-900/40 animate-pulse'
                  : 'border-neutral-800 text-neutral-400 hover:text-neutral-200 bg-neutral-900/50'
              }`}
            >
              {isAmbientActive ? (
                <>
                  <Volume2 className="w-4 h-4 text-amber-400" />
                  <span>Треск костра: Вкл</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>Включить звук костра</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer Meta & Copyright */}
        <div className="pt-6 border-t border-amber-900/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-3">
            <span className="font-cinzel font-bold text-neutral-300">Arcane Chronicles</span>
            <span aria-hidden="true">·</span>
            <span>MMORPG Статьи, Гайды и Хроники</span>
            <span aria-hidden="true">·</span>
            <span>Express CMS Full-Stack</span>
          </div>

          <div className="flex items-center gap-4">
            <span>© 2026 Redline Hub · Разработано для MMORPG сообщества</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
