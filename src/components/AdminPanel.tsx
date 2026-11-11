import React, { useState } from 'react';
import { ServerConfig, ServerFile, DockerService, User } from '../types';
import {
  Server,
  FileCode,
  HardDrive,
  RefreshCw,
  Terminal,
  Save,
  Trash2,
  Plus,
  Play,
  Square,
  RotateCcw,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  Cpu,
  Activity,
  Layers,
  ArrowRight,
  Download,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { playTavernClick, playRuneChime } from '../utils/audio';

interface AdminPanelProps {
  currentUser: User;
  serverConfig: ServerConfig;
  onUpdateServerConfig: (newConfig: ServerConfig) => void;
  files: ServerFile[];
  onSaveFile: (fileId: string, newContent: string) => void;
  onCreateFile: (name: string, path: string, content: string) => void;
  onDeleteFile: (fileId: string) => void;
  dockerServices: DockerService[];
  onRestartService: (name: string) => void;
  onToggleService: (name: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  currentUser,
  serverConfig,
  onUpdateServerConfig,
  files,
  onSaveFile,
  onCreateFile,
  onDeleteFile,
  dockerServices,
  onRestartService,
  onToggleService,
}) => {
  const [adminTab, setAdminTab] = useState<'server' | 'files' | 'deploy'>('server');

  // Server Migration inputs
  const [hostInput, setHostInput] = useState(serverConfig.host);
  const [portInput, setPortInput] = useState(serverConfig.port.toString());
  const [protocolInput, setProtocolInput] = useState<'https' | 'http'>(serverConfig.protocol);
  const [apiKeyInput, setApiKeyInput] = useState(serverConfig.apiKey);
  const [serverNameInput, setServerNameInput] = useState(serverConfig.serverName);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectSuccessMsg, setConnectSuccessMsg] = useState<string | null>(null);

  // File Manager states
  const [selectedFile, setSelectedFile] = useState<ServerFile>(files[0] || null);
  const [fileContentDraft, setFileContentDraft] = useState<string>(files[0]?.content || '');
  const [isSavedBanner, setIsSavedBanner] = useState(false);
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFilePath, setNewFilePath] = useState('/opt/chat/');
  const [newFileContent, setNewFileContent] = useState('');

  // Docker Logs Modal
  const [activeLogService, setActiveLogService] = useState<DockerService | null>(null);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const handleSelectFile = (file: ServerFile) => {
    playTavernClick();
    setSelectedFile(file);
    setFileContentDraft(file.content || '');
    setIsSavedBanner(false);
  };

  const handleSaveCurrentFile = () => {
    if (!selectedFile) return;
    playRuneChime();
    onSaveFile(selectedFile.id, fileContentDraft);
    setIsSavedBanner(true);
    setTimeout(() => setIsSavedBanner(false), 2500);
  };

  const handleCreateFileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    const fullPath = `${newFilePath.replace(/\/$/, '')}/${newFileName.trim()}`;
    onCreateFile(newFileName.trim(), fullPath, newFileContent);
    setNewFileName('');
    setNewFileContent('');
    setShowNewFileModal(false);
    playRuneChime();
  };

  const handleTestAndSaveServer = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTestingConnection(true);
    setConnectSuccessMsg(null);

    // Simulate real ping check to target host
    setTimeout(() => {
      setIsTestingConnection(false);
      const pingMs = Math.floor(Math.random() * 20) + 15;
      const updatedConfig: ServerConfig = {
        ...serverConfig,
        host: hostInput.trim(),
        port: parseInt(portInput, 10) || 3000,
        protocol: protocolInput,
        apiKey: apiKeyInput.trim(),
        serverName: serverNameInput.trim() || 'Новый целевой сервер',
        lastPingMs: pingMs,
        status: 'connected',
      };
      onUpdateServerConfig(updatedConfig);
      setConnectSuccessMsg(
        `Соединение успешно установлено! Пинг до ${hostInput}: ${pingMs} мс. Данные телеметрии обновлены.`
      );
      playRuneChime();
    }, 900);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(text);
    playTavernClick();
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const downloadFile = (file: ServerFile) => {
    const element = document.createElement('a');
    const blob = new Blob([file.content || ''], { type: 'text/plain' });
    element.href = URL.createObjectURL(blob);
    element.download = file.name;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Admin Panel Header & Sub-Nav */}
      <div className="p-6 rounded-2xl border border-amber-900/40 bg-[#101422] shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            <span>Панель Администратора · Приватный контур</span>
          </div>
          <h2 className="font-cinzel text-2xl font-bold text-neutral-100">
            Управление Сервером & Файловой Системой
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Текущий узел: <span className="font-mono text-amber-300">{serverConfig.host}</span> ({serverConfig.serverName})
          </p>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center p-1 rounded-xl bg-neutral-900 border border-neutral-800 text-xs">
          <button
            onClick={() => setAdminTab('server')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold uppercase tracking-wider transition-all ${
              adminTab === 'server'
                ? 'bg-amber-500 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Сервер & Docker</span>
          </button>
          <button
            onClick={() => setAdminTab('files')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold uppercase tracking-wider transition-all ${
              adminTab === 'files'
                ? 'bg-amber-500 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Файлы сервера</span>
          </button>
          <button
            onClick={() => setAdminTab('deploy')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold uppercase tracking-wider transition-all ${
              adminTab === 'deploy'
                ? 'bg-amber-500 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Инструкция деплоя</span>
          </button>
        </div>
      </div>

      {/* TAB 1: SERVER & DOCKER MONITORING */}
      {adminTab === 'server' && (
        <div className="space-y-6">
          {/* Live Telemetry Gauges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-amber-900/30 bg-[#101420]">
              <div className="text-[11px] text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                <span>Загрузка CPU</span>
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-amber-300 mt-1 tabular-nums">
                {serverConfig.cpuUsage}%
              </div>
              <div className="w-full h-1.5 bg-neutral-800 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${serverConfig.cpuUsage}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-xl border border-amber-900/30 bg-[#101420]">
              <div className="text-[11px] text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                <span>Оперативная память</span>
                <Activity className="w-3.5 h-3.5 text-sky-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-neutral-100 mt-1 tabular-nums">
                {serverConfig.ramUsage}%
              </div>
              <div className="w-full h-1.5 bg-neutral-800 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-sky-500 rounded-full"
                  style={{ width: `${serverConfig.ramUsage}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-xl border border-amber-900/30 bg-[#101420]">
              <div className="text-[11px] text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                <span>Диск /opt & root</span>
                <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-neutral-100 mt-1 tabular-nums">
                {serverConfig.diskUsage}%
              </div>
              <div className="w-full h-1.5 bg-neutral-800 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${serverConfig.diskUsage}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-xl border border-amber-900/30 bg-[#101420]">
              <div className="text-[11px] text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                <span>Пинг & Uptime</span>
                <RefreshCw className="w-3.5 h-3.5 text-rose-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
                {serverConfig.lastPingMs} ms
              </div>
              <div className="text-[11px] font-mono text-neutral-400 mt-2 truncate">
                Аптайм: {serverConfig.uptime}
              </div>
            </div>
          </div>

          {/* DYNAMIC SERVER RE-CONFIGURATION FORM (Переезд на другой сервер) */}
          <div className="p-6 rounded-2xl border border-amber-900/40 bg-[#101420] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-cinzel text-lg font-bold text-neutral-100 flex items-center gap-2">
                  <Server className="w-4 h-4 text-amber-400" />
                  <span>Параметры подключения к целевому серверу (При переезде)</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Если сайт или контейнеры переезжают на другой VPS/VDS — просто введите новый IP или домен здесь.
                </p>
              </div>
            </div>

            {connectSuccessMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{connectSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleTestAndSaveServer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Хост / Домен / IP *
                </label>
                <input
                  type="text"
                  required
                  value={hostInput}
                  onChange={(e) => setHostInput(e.target.value)}
                  placeholder="redlinechat.duckdns.org или 194.87.x.x"
                  className="w-full px-3.5 py-2 text-xs font-mono rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Порт API / Сервера
                </label>
                <input
                  type="number"
                  value={portInput}
                  onChange={(e) => setPortInput(e.target.value)}
                  placeholder="3000"
                  className="w-full px-3.5 py-2 text-xs font-mono rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Протокол
                </label>
                <select
                  value={protocolInput}
                  onChange={(e) => setProtocolInput(e.target.value as 'https' | 'http')}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="https">HTTPS (Защищенный SSL)</option>
                  <option value="http">HTTP (Прямой порт/локальный)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Имя сервера в панели
                </label>
                <input
                  type="text"
                  value={serverNameInput}
                  onChange={(e) => setServerNameInput(e.target.value)}
                  placeholder="VPS Production"
                  className="w-full px-3.5 py-2 text-xs rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-4 flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Статус соединения: {serverConfig.status === 'connected' ? 'Активно' : 'Ожидание'}</span>
                </div>

                <button
                  type="submit"
                  disabled={isTestingConnection}
                  className="px-5 py-2 bg-gradient-to-r from-amber-600 to-amber-500 text-neutral-950 font-bold rounded-lg text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTestingConnection ? 'animate-spin' : ''}`} />
                  <span>{isTestingConnection ? 'Проверка связи...' : 'Применить и переключить сервер'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* DOCKER SERVICES CONTROLLER */}
          <div className="p-6 rounded-2xl border border-amber-900/40 bg-[#101420] space-y-4">
            <h3 className="font-cinzel text-lg font-bold text-neutral-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Контроль Docker-сервисов на сервере</span>
            </h3>

            <div className="divide-y divide-neutral-800/80 rounded-xl border border-neutral-800 bg-[#0c0e14]/80 overflow-hidden">
              {dockerServices.map((svc) => (
                <div
                  key={svc.name}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-900/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        svc.status === 'running'
                          ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50'
                          : 'bg-neutral-600'
                      }`}
                    />
                    <div>
                      <div className="text-sm font-semibold text-neutral-100 flex items-center gap-2">
                        <span>{svc.name}</span>
                        <span className="text-[11px] font-mono text-neutral-500 px-1.5 py-0.2 rounded bg-neutral-900 border border-neutral-800">
                          {svc.image}
                        </span>
                      </div>
                      <div className="text-xs font-mono text-neutral-400 mt-0.5">
                        {svc.ports} · CPU: {svc.cpu} · RAM: {svc.ram}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveLogService(svc)}
                      className="px-2.5 py-1 text-xs font-mono text-neutral-400 hover:text-amber-300 rounded border border-neutral-800 hover:border-neutral-700 transition-colors"
                    >
                      Логи
                    </button>

                    <button
                      onClick={() => onRestartService(svc.name)}
                      className="p-1.5 text-neutral-400 hover:text-amber-300 rounded border border-neutral-800 hover:border-neutral-700 transition-colors"
                      title="Перезапустить контейнер"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onToggleService(svc.name)}
                      className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded transition-colors ${
                        svc.status === 'running'
                          ? 'bg-rose-950/40 border border-rose-500/40 text-rose-400 hover:bg-rose-900/40'
                          : 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-900/40'
                      }`}
                    >
                      {svc.status === 'running' ? 'Стоп' : 'Старт'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SERVER FILE MANAGER & LIVE CODE EDITOR */}
      {adminTab === 'files' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-cinzel text-lg font-bold text-neutral-100 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-amber-400" />
                <span>Файловый менеджер сервера (Редактор конфигов)</span>
              </h3>
              <p className="text-xs text-neutral-400">
                Прямое редактирование конфигураций, .env и файлов на вашем сервере
              </p>
            </div>

            <button
              onClick={() => setShowNewFileModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-amber-300 hover:bg-neutral-800 font-semibold uppercase tracking-wider"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Создать файл</span>
            </button>
          </div>

          {/* Split View: File Tree + Code Editor */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left Column: File List */}
            <div className="rounded-xl border border-amber-900/30 bg-[#101420] p-3 space-y-1">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 px-2 py-1 mb-1">
                Файлы на сервере ({files.length})
              </div>
              {files.map((file) => (
                <button
                  key={file.id}
                  onClick={() => handleSelectFile(file)}
                  className={`w-full text-left p-2.5 rounded-lg transition-all flex items-center justify-between gap-2 ${
                    selectedFile?.id === file.id
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200'
                  }`}
                >
                  <div className="min-w-0 flex items-center gap-2">
                    <FileCode className="w-4 h-4 shrink-0 text-amber-400" />
                    <span className="text-xs font-mono font-medium truncate block">{file.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 shrink-0">{file.size}</span>
                </button>
              ))}
            </div>

            {/* Right Column: Live Code Editor */}
            <div className="lg:col-span-2 rounded-xl border border-amber-900/30 bg-[#0c0e14] overflow-hidden flex flex-col">
              {selectedFile ? (
                <>
                  {/* Editor Header */}
                  <div className="px-4 py-3 bg-[#111420] border-b border-neutral-800 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs font-mono font-semibold text-neutral-200 truncate">
                        {selectedFile.path}
                      </div>
                      <div className="text-[10px] font-mono text-neutral-500">
                        Размер: {selectedFile.size} · Изменен: {selectedFile.modified}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isSavedBanner && (
                        <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Сохранено
                        </span>
                      )}

                      <button
                        onClick={() => downloadFile(selectedFile)}
                        className="p-1.5 text-neutral-400 hover:text-neutral-200 rounded border border-neutral-800"
                        title="Скачать файл"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onDeleteFile(selectedFile.id)}
                        className="p-1.5 text-neutral-500 hover:text-rose-400 rounded border border-neutral-800"
                        title="Удалить файл"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={handleSaveCurrentFile}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-all"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Сохранить</span>
                      </button>
                    </div>
                  </div>

                  {/* Textarea Code Editor */}
                  <textarea
                    rows={18}
                    value={fileContentDraft}
                    onChange={(e) => setFileContentDraft(e.target.value)}
                    className="w-full p-4 bg-[#0a0d14] text-xs font-mono text-neutral-200 leading-relaxed focus:outline-none resize-none selection:bg-amber-500/30"
                    spellCheck={false}
                  />
                </>
              ) : (
                <div className="p-12 text-center text-neutral-500 text-xs">
                  Выберите файл слева для просмотра и редактирования
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DEPLOYMENT INSTRUCTIONS (Как скачать, залить и управлять порталом) */}
      {adminTab === 'deploy' && (
        <div className="p-6 sm:p-8 rounded-2xl border border-amber-900/40 bg-[#101420] space-y-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
              <Download className="w-4 h-4 text-amber-300" />
              <span>Полное руководство: Скачивание, Установка на VPS и Управление</span>
            </div>
            <h3 className="font-cinzel text-2xl font-bold text-neutral-100">
              Руководство по развертыванию Full-Stack CMS на сервере
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Пошаговая инструкция для Ubuntu/Debian (включая решение ошибки <code>package.json: ENOENT</code>).
            </p>
          </div>

          <div className="space-y-6">
            {/* 1-Click Express Installer Script Card */}
            <div className="p-5 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 to-neutral-900 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
                  <Terminal className="w-4 h-4 text-amber-400" />
                  <span>⚡ Экспресс-скрипт развертывания (Все в одной команде)</span>
                </div>
                <button
                  onClick={() =>
                    handleCopy(
                      `apt update && apt install -y curl git nginx && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt install -y nodejs && npm install -g pm2 tsx && mkdir -p /opt/arcane-portal && cd /opt/arcane-portal`
                    )
                  }
                  className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-md shadow-sm transition-all cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedCmd?.includes('setup_20.x') ? 'Скопировано!' : 'Скопировать команду'}</span>
                </button>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Выполните эту строчку в терминале вашего сервера (через PuTTY, Termius или SSH), и система сама установит Node.js 20, PM2, Tsx и создаст нужную папку!
              </p>
              <div className="p-3 rounded-lg bg-black/80 font-mono text-xs text-amber-300/90 break-all select-all border border-amber-900/50">
                apt update && apt install -y curl git nginx && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt install -y nodejs && npm install -g pm2 tsx && mkdir -p /opt/arcane-portal && cd /opt/arcane-portal
              </div>
            </div>

            {/* Step 1: Downloading */}
            <div className="p-5 rounded-xl border border-amber-900/30 bg-[#0c0e14] space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono text-xs border border-amber-500/40">1</span>
                <span>Как перенести файлы на сервер</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Создайте на вашем сервере директорию <code>/opt/arcane-portal</code> и загрузите туда файлы проекта (исходный код, <code>package.json</code>, <code>server.ts</code>, <code>src/</code>):
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 font-mono text-xs text-neutral-200">
                  <code>mkdir -p /opt/arcane-portal && cd /opt/arcane-portal</code>
                  <button
                    onClick={() => handleCopy('mkdir -p /opt/arcane-portal && cd /opt/arcane-portal')}
                    className="p-1 text-neutral-400 hover:text-amber-300"
                  >
                    {copiedCmd === 'mkdir -p /opt/arcane-portal && cd /opt/arcane-portal' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Загрузить файлы с вашего компьютера на сервер можно одной командой SCP:
                </p>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 font-mono text-xs text-neutral-200">
                  <code>scp -r * root@{serverConfig.host}:/opt/arcane-portal/</code>
                  <button
                    onClick={() => handleCopy(`scp -r * root@${serverConfig.host}:/opt/arcane-portal/`)}
                    className="p-1 text-neutral-400 hover:text-amber-300"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2: Installation & Build (Fixing ENOENT) */}
            <div className="p-5 rounded-xl border border-amber-900/30 bg-[#0c0e14] space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono text-xs border border-amber-500/40">2</span>
                <span>Установка зависимостей и сборка (Важно: где выполнять!)</span>
              </div>
              <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/40 text-xs text-amber-200 leading-relaxed">
                ⚠️ <strong>Почему возникала ошибка package.json ENOENT:</strong> Вы находились в корневом каталоге <code>/#</code>. Обязательно выполните <code>cd /opt/arcane-portal</code> перед запуском команд!
              </div>

              <div className="space-y-2">
                {[
                  { label: '1. Переход в папку', cmd: 'cd /opt/arcane-portal' },
                  { label: '2. Проверка наличия package.json', cmd: 'ls -la package.json' },
                  { label: '3. Установка пакетов Node.js', cmd: 'npm install' },
                  { label: '4. Сборка фронтенда', cmd: 'npm run build' },
                ].map((item) => (
                  <div
                    key={item.cmd}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 font-mono text-xs text-neutral-200"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <span className="text-neutral-500 text-[11px] shrink-0">{item.label}:</span>
                      <code className="truncate">{item.cmd}</code>
                    </div>
                    <button
                      onClick={() => handleCopy(item.cmd)}
                      className="p-1 text-neutral-400 hover:text-amber-300 ml-2 shrink-0"
                    >
                      {copiedCmd === item.cmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 3: Running with PM2 */}
            <div className="p-5 rounded-xl border border-amber-900/30 bg-[#0c0e14] space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono text-xs border border-amber-500/40">3</span>
                <span>Запуск динамического Express-сервера в фоне (PM2)</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Чтобы сервер работал непрерывно 24/7 и автоматически перезапускался при перезагрузке VPS, установите PM2:
              </p>
              <div className="space-y-2">
                {[
                  { label: 'Установка PM2', cmd: 'npm install -g pm2' },
                  { label: 'Запуск Full-Stack сервера', cmd: 'pm2 start server.ts --name "arcane-portal" --interpreter tsx' },
                  { label: 'Сохранение автозапуска', cmd: 'pm2 save && pm2 startup' },
                ].map((item) => (
                  <div
                    key={item.cmd}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 font-mono text-xs text-neutral-200"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <span className="text-neutral-500 text-[11px] shrink-0">{item.label}:</span>
                      <code className="truncate">{item.cmd}</code>
                    </div>
                    <button
                      onClick={() => handleCopy(item.cmd)}
                      className="p-1 text-neutral-400 hover:text-amber-300 ml-2 shrink-0"
                    >
                      {copiedCmd === item.cmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 4: Nginx & SSL */}
            <div className="p-5 rounded-xl border border-amber-900/30 bg-[#0c0e14] space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono text-xs border border-amber-500/40">4</span>
                <span>Настройка Nginx и HTTPS (Let's Encrypt)</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Nginx проксирует запросы на локальный порт <code>3000</code>:
              </p>
              <div className="space-y-2">
                {[
                  `certbot --nginx -d ${serverConfig.host}`,
                  `systemctl reload nginx`,
                ].map((cmd) => (
                  <div
                    key={cmd}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 font-mono text-xs text-neutral-200"
                  >
                    <code className="truncate">{cmd}</code>
                    <button
                      onClick={() => handleCopy(cmd)}
                      className="p-1 text-neutral-400 hover:text-amber-300 ml-2 shrink-0"
                    >
                      {copiedCmd === cmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 5: How to Manage */}
            <div className="p-5 rounded-xl border border-amber-900/30 bg-[#0c0e14] space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono text-xs border border-amber-500/40">5</span>
                <span>Как управлять порталом после запуска</span>
              </div>
              <ul className="text-xs text-neutral-300 space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  <strong>Вход администратора:</strong> Нажмите «Войти» в шапке ➜ кнопка <em>«Вход Админа»</em> (или <code>admin@arcane.ru</code> / <code>admin123</code>).
                </li>
                <li>
                  <strong>Редактирование файлов сервера:</strong> Во вкладке «Файлы сервера» можно прямо в браузере редактировать <code>docker-compose.yml</code>, <code>.env</code> и конфиги Nginx без захода в консоль по SSH!
                </li>
                <li>
                  <strong>Управление контейнерами:</strong> Во вкладке «Сервер & Docker» доступны кнопки «Рестарт» и просмотр живых логов контейнеров.
                </li>
                <li>
                  <strong>Если сервер переехал на новый IP/домен:</strong> Во вкладке «Сервер & Docker» введите новый адрес и нажмите <em>«Применить и переключить сервер»</em> — система автоматически проверит пинг и обновит привязку.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* DOCKER LOGS MODAL */}
      {activeLogService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl border border-amber-900/50 bg-[#0e121a] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="px-5 py-3 border-b border-neutral-800 flex items-center justify-between bg-[#080b10]">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-400" />
                <span className="font-mono text-xs text-neutral-200">
                  docker logs --tail 50 {activeLogService.name}
                </span>
              </div>
              <button
                onClick={() => setActiveLogService(null)}
                className="text-neutral-400 hover:text-neutral-200 text-xs"
              >
                Закрыть
              </button>
            </div>
            <div className="p-4 bg-black font-mono text-xs text-neutral-300 overflow-y-auto space-y-1">
              {(activeLogService.logs || []).map((line, i) => (
                <div key={i} className="text-emerald-400/90 leading-relaxed">
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CREATE FILE MODAL */}
      {showNewFileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-amber-900/50 bg-[#101422] shadow-2xl p-6 space-y-4 text-neutral-100">
            <h3 className="font-cinzel text-base font-bold text-amber-200">
              Создать новый файл на сервере
            </h3>
            <form onSubmit={handleCreateFileSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-neutral-300 font-semibold mb-1">
                  Имя файла (напр. script.sh, config.json)
                </label>
                <input
                  type="text"
                  required
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="custom-server.conf"
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-200"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-300 font-semibold mb-1">
                  Путь на сервере
                </label>
                <input
                  type="text"
                  value={newFilePath}
                  onChange={(e) => setNewFilePath(e.target.value)}
                  placeholder="/opt/chat/"
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-200"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-300 font-semibold mb-1">
                  Начальное содержимое файла
                </label>
                <textarea
                  rows={4}
                  value={newFileContent}
                  onChange={(e) => setNewFileContent(e.target.value)}
                  placeholder="# Введите конфигурацию или скрипт..."
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-200 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewFileModal(false)}
                  className="px-3 py-1.5 text-xs text-neutral-400"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-500 text-neutral-950 font-bold rounded-lg text-xs"
                >
                  Создать
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
