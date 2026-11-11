import React, { useState } from 'react';
import { User } from '../types';
import { X, Shield, Lock, Mail, User as UserIcon, Sparkles, KeyRound, Check } from 'lucide-react';
import { playTavernClick, playRuneChime } from '../utils/audio';
import chroniclerAvatar from '../assets/images/author_chronicler_1792514646307.jpg';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAdminQuickLogin = () => {
    playRuneChime();
    onLogin({
      id: 'usr_admin',
      username: 'Станислав (Администратор)',
      email: 'admin@arcane.ru',
      role: 'admin',
      avatar: chroniclerAvatar,
      title: 'Верховный Хранитель Портала & Root',
      createdAt: '2026-10-01',
    });
    onClose();
  };

  const handleUserQuickLogin = () => {
    playTavernClick();
    onLogin({
      id: 'usr_regular',
      username: 'Рыцарь Света',
      email: 'player@arcane.ru',
      role: 'user',
      avatar: chroniclerAvatar,
      title: 'Исследователь подземелий',
      createdAt: '2026-10-20',
    });
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'login') {
      if (email.toLowerCase().includes('admin') || email === 'admin@arcane.ru') {
        handleAdminQuickLogin();
        return;
      }

      if (!email.trim() || !password.trim()) {
        setError('Пожалуйста, заполните все поля');
        return;
      }

      playTavernClick();
      onLogin({
        id: `usr_${Date.now()}`,
        username: email.split('@')[0] || 'Игрок',
        email: email.trim(),
        role: 'user',
        avatar: chroniclerAvatar,
        title: 'Ученик летописца',
        createdAt: '2026-10-20',
      });
      onClose();
    } else {
      if (!username.trim() || !email.trim() || !password.trim()) {
        setError('Пожалуйста, заполните все поля регистрации');
        return;
      }

      playRuneChime();
      onLogin({
        id: `usr_${Date.now()}`,
        username: username.trim(),
        email: email.trim(),
        role: 'user',
        avatar: chroniclerAvatar,
        title: 'Новый автор хроник',
        createdAt: '2026-10-20',
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl border border-amber-900/50 bg-[#101422] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-neutral-100">
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-amber-900/30 flex items-center justify-between bg-[#0c0e16]">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            <h3 className="font-cinzel text-base font-bold text-amber-200">
              {mode === 'login' ? 'Вход в чертоги хроник' : 'Регистрация нового автора'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-200 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          {/* Quick Admin & User Fast Login Buttons */}
          <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-950/20 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-amber-300 font-semibold uppercase tracking-wider">
              <span>Быстрый вход для тестирования</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleAdminQuickLogin}
                className="px-3 py-2 rounded-lg bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-neutral-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Вход Админа</span>
              </button>
              <button
                type="button"
                onClick={handleUserQuickLogin}
                className="px-3 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-semibold uppercase tracking-wider border border-neutral-700 transition-all flex items-center justify-center gap-1.5"
              >
                <UserIcon className="w-3.5 h-3.5 text-sky-400" />
                <span>Вход Игрока</span>
              </button>
            </div>
            <p className="text-[11px] text-neutral-400 leading-snug">
              * Аккаунт <strong>Админа</strong> имеет доступ к мониторингу сервера, контролю Docker-сервисов и файловому менеджеру.
            </p>
          </div>

          {/* Toggle Mode Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-neutral-900/90 border border-neutral-800 text-xs">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError('');
              }}
              className={`flex-1 py-1.5 rounded-lg font-semibold uppercase tracking-wider transition-all ${
                mode === 'login'
                  ? 'bg-amber-500 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Авторизация
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError('');
              }}
              className={`flex-1 py-1.5 rounded-lg font-semibold uppercase tracking-wider transition-all ${
                mode === 'register'
                  ? 'bg-amber-500 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Регистрация
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Имя персонажа / Никнейм
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Например: ElvenRanger, DarkKnight"
                    className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Электронная почта
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com или admin@arcane.ru"
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Пароль
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 mt-2 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-neutral-950 font-bold rounded-xl text-xs uppercase tracking-wider hover:brightness-110 shadow-lg shadow-amber-950/40 transition-all"
            >
              {mode === 'login' ? 'Войти в портал' : 'Создать аккаунт автора'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
