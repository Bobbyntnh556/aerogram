import React, { useState, useEffect, useRef } from 'react';
import { User, Settings, Send, Paperclip, Smile, X, Maximize, Minus, Users, Phone, Video, Mic, Square, Play, Pause, Edit2, Trash2, Reply, Plus, Image as ImageIcon, MoreVertical, Check, ArrowLeft, Globe, StickyNote, FileText, Music, Search, Palette, Volume2, ExternalLink, RefreshCw, Cpu, Clock, Award, Volume1, VolumeX, Trash, Shield, Ban } from 'lucide-react';
import Peer from 'peerjs';

// --- Firebase Imports ---
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, onSnapshot, addDoc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';

// --- Firebase Initialization ---
// Конфигурация вашего Firebase проекта
const firebaseConfig = {
  apiKey: "AIzaSyCGhS6xM3WQYocSyOtY2hSwOyRMc_pqPC4",
  authDomain: "aerogram-362b4.firebaseapp.com",
  projectId: "aerogram-362b4",
  storageBucket: "aerogram-362b4.firebasestorage.app",
  messagingSenderId: "494278053383",
  appId: "1:494278053383:web:5cb0bdaba459f20108e4a2"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = 'aerogram-custom';
const ADMIN_EMAIL = 'gaymomentispravitmoment@gmail.com';

// --- Constants ---
const WALLPAPERS = [
  { name: 'По умолчанию', url: '' },
  { name: 'Безмятежность', url: 'https://upload.wikimedia.org/wikipedia/en/2/27/Bliss_%28Windows_XP%29.png' },
  { name: 'Осень', url: 'https://preview.redd.it/finally-windows-xps-autumn-wallpaper-in-full-res-4200x2800-v0-3ma6nhepxbb81.jpg?width=1080&crop=smart&auto=webp&s=e3747c3ccf8c439969200d2d67fb06d3f3738138' },
  { name: 'Аэро', url: 'https://i.pinimg.com/originals/32/f6/ca/32f6ca603f286090a5716109218c9679.jpg' },
  { name: 'Звездное небо', url: 'https://avatars.mds.yandex.net/i?id=ead27b78b7e7ce55749fb98102ba3f77_l-5889364-images-thumbs&n=13' }
];

const EMOJIS = ['😀', '😂', '😍', '😎', '😭', '😡', '👍', '👎', '🎉', '❤️', '🔥', '💩', '🤔', '👋', '🙏', '💪', '👻', '💀', '👀', '✨'];

const THEMES = {
  blue: { name: 'Aero Blue', color: 'rgba(220, 235, 250, 0.45)', border: 'rgba(255, 255, 255, 0.6)', highlight: 'rgba(255, 255, 255, 0.9)', bg: 'radial-gradient(circle at 10% 20%, #e0f2fe 0%, #bae6fd 30%, #38bdf8 70%, #0284c7 100%)' },
  pink: { name: 'Evening Pink', color: 'rgba(250, 220, 235, 0.45)', border: 'rgba(255, 230, 240, 0.6)', highlight: 'rgba(255, 240, 250, 0.9)', bg: 'radial-gradient(circle at 10% 20%, #fce7f3 0%, #fbcfe8 30%, #f472b6 70%, #db2777 100%)' },
  green: { name: 'Fresh Leaf', color: 'rgba(220, 250, 225, 0.45)', border: 'rgba(230, 255, 235, 0.6)', highlight: 'rgba(240, 255, 245, 0.9)', bg: 'radial-gradient(circle at 10% 20%, #dcfce7 0%, #bbf7d0 30%, #4ade80 70%, #16a34a 100%)' },
  graphite: { name: 'Graphite', color: 'rgba(20, 25, 30, 0.65)', border: 'rgba(80, 80, 80, 0.6)', highlight: 'rgba(100, 100, 100, 0.5)', bg: 'radial-gradient(circle at 10% 20%, #e2e8f0 0%, #94a3b8 30%, #475569 70%, #0f172a 100%)' }
};

const SOUND_SCHEMES = {
  xp: 'Windows XP',
  vista: 'Windows Vista',
  win7: 'Windows 7'
};

// Helper to detect URLs
const extractUrl = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const match = text.match(urlRegex);
  return match ? match[0] : null;
};

const TRANSLATIONS = {
  ru: {
    loginTitle: 'Вход в AeroGram',
    welcome: 'Добро пожаловать',
    register: 'Регистрация',
    nickname: 'Никнейм',
    email: 'Email',
    password: 'Пароль',
    createAccount: 'Создать аккаунт',
    login: 'Войти',
    haveAccount: 'Уже есть аккаунт? Войти',
    noAccount: 'Нет аккаунта? Зарегистрироваться',
    searchPlaceholder: 'Поиск контактов...',
    createGroup: 'Создать беседу',
    online: 'В сети',
    offline: 'Не в сети',
    away: 'Нет на месте',
    dnd: 'Не беспокоить',
    invisible: 'Невидимый',
    typing: 'печатает...',
    typingPlural: 'печатают...',
    edit: 'Изменить',
    delete: 'Удалить',
    reply: 'Ответить',
    messagePlaceholder: 'Напишите сообщение...',
    send: 'Отправить',
    record: 'Записать голосовое сообщение',
    cancel: 'Отменить',
    save: 'ОК',
    close: 'Закрыть',
    profile: 'Профиль',
    myProfile: 'Мой профиль',
    userProfile: 'Профиль пользователя',
    settings: 'Настройки',
    general: 'Общие',
    logout: 'Выйти',
    deleteConfirmTitle: 'Подтверждение',
    deleteConfirmText: 'Вы действительно хотите удалить это сообщение? Это действие нельзя отменить.',
    groupName: 'Название группы',
    participants: 'Участники',
    create: 'Создать',
    viewMessage: 'Просмотр сообщения',
    call: 'Звонок',
    videoCall: 'Видеозвонок',
    startVoiceCall: 'Начать голосовой звонок',
    startVideoCall: 'Начать видеозвонок',
    joinCall: 'Присоединиться к звонку',
    hangup: 'Положить трубку',
    image: 'Изображение',
    audio: 'Голосовое сообщение',
    unknown: 'Неизвестный',
    clickToWrite: 'Нажмите, чтобы написать',
    selectChat: 'Выберите чат, чтобы начать общение',
    wallpapers: 'Обои чата',
    properties: 'Свойства',
    avatarUrl: 'URL аватарки (ссылка на картинку):',
    textStatus: 'Текстовый статус:',
    status: 'Статус:',
    username: 'Имя пользователя:',
    viewingOtherProfile: 'Вы просматриваете профиль другого пользователя.',
    authErrorEmptyNick: 'Пожалуйста, введите никнейм',
    authErrorEmailInUse: 'Этот Email уже занят.',
    authErrorInvalidCreds: 'Неверный Email или пароль.',
    authErrorWeakPass: 'Пароль слишком слабый (минимум 6 символов).',
    uploadErrorImage: 'Пожалуйста, выберите изображение.',
    uploadErrorGeneric: 'Ошибка при отправке. Попробуйте еще раз.',
    uploadErrorMic: 'Нет доступа к микрофону. Проверьте разрешения.',
    uploadErrorAudio: 'Не удалось отправить голосовое сообщение.',
    startedVoiceCall: 'начал(а) голосовой звонок',
    startedVideoCall: 'начал(а) групповой видеозвонок',
    edited: '(ред.)',
    read: 'Прочитано',
    sent: 'Отправлено',
    editingMessage: 'Редактирование сообщения',
    replyTo: 'Ответ',
    conference: 'Конференц-связь',
    personalCall: 'Личный звонок',
    attachImage: 'Прикрепить изображение',
    noMessages: 'Нет сообщений',
    actions: 'Действия',
    writeMessage: 'Написать сообщение',
    default: 'По умолчанию',
    statusPlaceholder: 'Слушаю музыку...',
    groupNamePlaceholder: 'Мои друзья',
    nicknamePlaceholder: 'Пользователь 2009',
    someone: 'Кто-то',
    pinMessage: 'Закрепить сообщение',
    unpinMessage: 'Открепить сообщение',
    pinnedMessage: 'Закрепленное сообщение',
    mediaExplorer: 'Медиа Проводник',
    files: 'Файлы',
    links: 'Ссылки',
    theme: 'Тема оформления',
    soundScheme: 'Звуковая схема',
    gadgets: 'Гаджеты',
    recycleBin: 'Корзина',
    restore: 'Восстановить',
    deleteForever: 'Удалить навсегда',
    emptyBin: 'Очистить корзину',
    achievements: 'Достижения',
    soundMixer: 'Микшер громкости'
  },
  en: {
    loginTitle: 'Login to AeroGram',
    welcome: 'Welcome',
    register: 'Registration',
    nickname: 'Nickname',
    email: 'Email',
    password: 'Password',
    createAccount: 'Create Account',
    login: 'Log In',
    haveAccount: 'Already have an account? Log In',
    noAccount: 'No account? Register',
    searchPlaceholder: 'Search contacts...',
    createGroup: 'Create Group',
    online: 'Online',
    offline: 'Offline',
    away: 'Away',
    dnd: 'Do Not Disturb',
    invisible: 'Invisible',
    typing: 'is typing...',
    typingPlural: 'are typing...',
    edit: 'Edit',
    delete: 'Delete',
    reply: 'Reply',
    messagePlaceholder: 'Type a message...',
    send: 'Send',
    record: 'Record voice message',
    cancel: 'Cancel',
    save: 'OK',
    close: 'Close',
    profile: 'Profile',
    myProfile: 'My Profile',
    userProfile: 'User Profile',
    settings: 'Settings',
    general: 'General',
    logout: 'Log Out',
    deleteConfirmTitle: 'Confirmation',
    deleteConfirmText: 'Are you sure you want to delete this message? This action cannot be undone.',
    groupName: 'Group Name',
    participants: 'Participants',
    create: 'Create',
    viewMessage: 'View Message',
    call: 'Call',
    videoCall: 'Video Call',
    startVoiceCall: 'Start Voice Call',
    startVideoCall: 'Start Video Call',
    joinCall: 'Join Call',
    hangup: 'Hang Up',
    image: 'Image',
    audio: 'Voice Message',
    unknown: 'Unknown',
    clickToWrite: 'Click to write',
    selectChat: 'Select a chat to start messaging',
    wallpapers: 'Chat Wallpapers',
    properties: 'Properties',
    avatarUrl: 'Avatar URL (image link):',
    textStatus: 'Text Status:',
    status: 'Status:',
    username: 'Username:',
    viewingOtherProfile: 'You are viewing another user\'s profile.',
    authErrorEmptyNick: 'Please enter a nickname',
    authErrorEmailInUse: 'This Email is already in use.',
    authErrorInvalidCreds: 'Invalid Email or password.',
    authErrorWeakPass: 'Password is too weak (minimum 6 characters).',
    uploadErrorImage: 'Please select an image.',
    uploadErrorGeneric: 'Error sending. Please try again.',
    uploadErrorMic: 'No microphone access. Check permissions.',
    uploadErrorAudio: 'Failed to send voice message.',
    startedVoiceCall: 'started a voice call',
    startedVideoCall: 'started a group video call',
    edited: '(edited)',
    read: 'Read',
    sent: 'Sent',
    editingMessage: 'Editing message',
    replyTo: 'Reply to',
    conference: 'Conference Call',
    personalCall: 'Personal Call',
    attachImage: 'Attach Image',
    noMessages: 'No messages',
    actions: 'Actions',
    writeMessage: 'Send Message',
    default: 'Default',
    statusPlaceholder: 'Listening to music...',
    groupNamePlaceholder: 'My Friends',
    nicknamePlaceholder: 'User 2009',
    someone: 'Someone',
    pinMessage: 'Pin Message',
    unpinMessage: 'Unpin Message',
    pinnedMessage: 'Pinned Message',
    mediaExplorer: 'Media Explorer',
    files: 'Files',
    links: 'Links',
    theme: 'Theme',
    soundScheme: 'Sound Scheme',
    gadgets: 'Gadgets',
    recycleBin: 'Recycle Bin',
    restore: 'Restore',
    deleteForever: 'Delete Forever',
    emptyBin: 'Empty Recycle Bin',
    achievements: 'Achievements',
    soundMixer: 'Volume Mixer'
  }
};

// --- CSS Styles for Frutiger Aero / Windows 7 Glass ---
const aeroStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Segoe+UI:wght@400;600&display=swap');

  :root {
    --aero-glass: rgba(220, 235, 250, 0.45);
    --aero-border: rgba(255, 255, 255, 0.6);
    --aero-highlight: rgba(255, 255, 255, 0.9);
  }

  /* Slower, more beautiful animations */
  @keyframes gentle-fade-in-up {
    from {
      opacity: 0;
      transform: translateY(15px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-gentle-fade-in-up {
    animation: gentle-fade-in-up 0.5s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
  }

  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    overflow: hidden;
    background: var(--aero-bg, radial-gradient(circle at 10% 20%, #e0f2fe 0%, #bae6fd 30%, #38bdf8 70%, #0284c7 100%));
    background-size: 200% 200%;
    animation: aurora 25s ease infinite;
  }

  @keyframes aurora {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  /* Main Glass Window */
  .aero-window {
    background: var(--aero-glass);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid var(--aero-border);
    box-shadow: 
      inset 0 0 0 1px rgba(255,255,255,0.4),
      inset 0 0 20px rgba(255,255,255,0.3),
      0 12px 40px rgba(0,0,0,0.3);
    border-radius: 8px;
    overflow: hidden;
    position: relative;
  }

  /* Titlebar with glow */
  .aero-titlebar {
    background: linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 100%);
    border-bottom: 1px solid rgba(255,255,255,0.5);
    box-shadow: inset 0 1px 0 var(--aero-highlight);
    height: 32px;
    display: flex;
    align-items: center;
    padding: 0 12px;
    position: relative;
  }
  
  .aero-title-text {
    color: #0f172a;
    font-weight: 600;
    text-shadow: 0 0 8px rgba(255,255,255,1), 0 0 4px rgba(255,255,255,0.8);
    font-size: 14px;
    pointer-events: none;
  }

  /* Glossy Buttons */
  .aero-btn {
    background: 
      linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 49%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.1) 100%),
      linear-gradient(180deg, #5bb4db 0%, #1e69de 100%);
    border: 1px solid #1a53b0;
    border-radius: 4px;
    box-shadow: inset 0 1px 1px rgba(255,255,255,0.8), 0 2px 4px rgba(0,0,0,0.2);
    color: white;
    text-shadow: 0px 1px 2px rgba(0,0,0,0.6);
    transition: all 0.25s ease;
    cursor: pointer;
  }
  .aero-btn:hover {
    background: 
      linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 49%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.3) 100%),
      linear-gradient(180deg, #7ecaf5 0%, #297be6 100%);
    box-shadow: inset 0 1px 2px rgba(255,255,255,1), 0 0 8px rgba(91,180,219,0.8);
  }
  .aero-btn:active {
    background: 
      linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 49%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.1) 100%),
      linear-gradient(180deg, #1e69de 0%, #4aa3df 100%);
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);
  }

  /* Window Controls */
  .win-control {
    width: 28px;
    height: 18px;
    border: 1px solid rgba(0,0,0,0.2);
    border-radius: 3px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.5);
    cursor: pointer;
  }
  .win-close {
    background: linear-gradient(180deg, #ff8c8c 0%, #e81123 49%, #c3000f 50%, #e81123 100%);
    box-shadow: inset 0 1px 1px rgba(255,255,255,0.7), 0 1px 2px rgba(0,0,0,0.3);
  }
  .win-close:hover {
    background: linear-gradient(180deg, #ffb3b3 0%, #ff4d4d 49%, #e60012 50%, #ff4d4d 100%);
    box-shadow: inset 0 1px 1px rgba(255,255,255,0.9), 0 0 6px #ff4d4d;
  }
  .win-btn {
    background: linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(220,230,240,0.5) 49%, rgba(190,200,210,0.4) 50%, rgba(210,220,230,0.6) 100%);
  }
  .win-btn:hover {
    background: linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(230,240,250,0.8) 49%, rgba(210,225,240,0.7) 50%, rgba(230,245,255,0.9) 100%);
    box-shadow: inset 0 1px 1px rgba(255,255,255,1), 0 0 5px rgba(255,255,255,0.8);
  }

  /* Chat Bubbles */
  .bubble-self {
    background: 
      linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 40%),
      linear-gradient(180deg, #d2ebff 0%, #aadaff 100%);
    border: 1px solid #7cb1d9;
    box-shadow: inset 0 1px 2px rgba(255,255,255,0.8), 0 2px 4px rgba(0,0,0,0.05);
    color: #0f3d61;
  }
  .bubble-other {
    background: 
      linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 40%),
      linear-gradient(180deg, #ffffff 0%, #eaeaea 100%);
    border: 1px solid #c0c0c0;
    box-shadow: inset 0 1px 2px rgba(255,255,255,1), 0 2px 4px rgba(0,0,0,0.05);
    color: #333;
  }

  /* List Item Hover */
  .explorer-hover:hover {
    background: linear-gradient(180deg, rgba(235, 245, 255, 0.7) 0%, rgba(210, 230, 250, 0.5) 100%);
    border-color: rgba(153, 204, 255, 0.8);
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.5);
  }
  .explorer-active {
    background: linear-gradient(180deg, rgba(220, 240, 255, 0.9) 0%, rgba(180, 215, 245, 0.7) 100%);
    border-color: rgba(102, 178, 255, 0.9);
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.8);
  }

  /* Inputs */
  .aero-input {
    background: rgba(255, 255, 255, 0.85);
    border: 1px solid #999;
    border-top-color: #666;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
    transition: all 0.25s ease;
  }
  .aero-input:focus {
    outline: none;
    border-color: #5bb4db;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.1), 0 0 5px rgba(91,180,219,0.5);
    background: #fff;
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 12px; }
  ::-webkit-scrollbar-track { background: rgba(255,255,255,0.2); box-shadow: inset 0 0 6px rgba(0,0,0,0.1); }
  ::-webkit-scrollbar-thumb { 
    background: linear-gradient(90deg, #e0e0e0 0%, #bfbfbf 50%, #d0d0d0 100%); 
    border: 1px solid #999; 
    border-radius: 6px; 
  }
  ::-webkit-scrollbar-thumb:hover { background: linear-gradient(90deg, #f0f0f0 0%, #cfcfcf 50%, #e0e0e0 100%); }

  /* Utilities */
  .glass-panel {
    background: rgba(255, 255, 255, 0.3);
    border: 1px solid rgba(255,255,255,0.4);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.6);
  }

  /* Status Indicators */
  .status-dot {
    border-radius: 50%;
    border: 1px solid;
  }
  .status-online { background: radial-gradient(circle at 30% 30%, #7cfc00, #32cd32); border-color: #228b22; box-shadow: 0 0 4px #32cd32, inset 0 1px 1px rgba(255,255,255,0.8); }
  .status-away { background: radial-gradient(circle at 30% 30%, #fff59d, #fbc02d); border-color: #f57f17; box-shadow: 0 0 4px #fbc02d, inset 0 1px 1px rgba(255,255,255,0.8); }
  .status-dnd { background: radial-gradient(circle at 30% 30%, #ef9a9a, #e53935); border-color: #b71c1c; box-shadow: 0 0 4px #e53935, inset 0 1px 1px rgba(255,255,255,0.8); }
  .status-invisible { background: radial-gradient(circle at 30% 30%, #e0e0e0, #9e9e9e); border-color: #616161; box-shadow: 0 0 4px #9e9e9e, inset 0 1px 1px rgba(255,255,255,0.8); }

  /* Unread Badge */
  .aero-badge {
    background: linear-gradient(180deg, #ff6b6b 0%, #d81b1b 100%);
    border: 1px solid #a30b0b;
    box-shadow: inset 0 1px 1px rgba(255,255,255,0.6), 0 1px 2px rgba(0,0,0,0.3);
    color: white;
    text-shadow: 0 1px 1px rgba(0,0,0,0.4);
  }

  /* Custom Aero Audio Slider */
  input[type=range].aero-slider {
    -webkit-appearance: none;
    background: rgba(255, 255, 255, 0.5);
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.2), 0 1px 0 rgba(255,255,255,0.5);
    height: 6px;
  }
  input[type=range].aero-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: linear-gradient(180deg, #ffffff 0%, #dcdcdc 50%, #b8b8b8 51%, #f0f0f0 100%);
    border: 1px solid #777;
    box-shadow: inset 0 1px 1px white, 0 1px 2px rgba(0,0,0,0.4);
    cursor: pointer;
  }
  input[type=range].aero-slider:focus {
    outline: none;
  }

  /* Animated Avatar Shine */
  .shine-effect {
    position: relative;
    overflow: hidden;
  }
  .shine-effect::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(to bottom right, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 60%, rgba(255,255,255,0) 100%);
    transform: rotate(30deg);
    animation: shine 4s infinite;
    pointer-events: none;
  }
  @keyframes shine {
    0% { transform: translateX(-100%) rotate(30deg); }
    20% { transform: translateX(100%) rotate(30deg); }
    100% { transform: translateX(100%) rotate(30deg); }
  }

  /* Aero Peek Popup */
  .aero-peek-popup {
    position: absolute;
    left: 100%;
    top: 0;
    width: 250px;
    background: var(--aero-glass);
    backdrop-filter: blur(10px);
    border: 1px solid var(--aero-border);
    border-radius: 8px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    z-index: 100;
    padding: 10px;
    margin-left: 10px;
    pointer-events: none;
    opacity: 0;
    transform: translateX(-10px);
    transition: opacity 0.2s, transform 0.2s;
  }
  .aero-peek-popup.visible {
    opacity: 1;
    transform: translateX(0);
  }
  
  /* Mobile-specific optimizations */
  @media (max-width: 767px) {
    .aero-peek-popup {
      display: none !important;
    }
  }

  /* Sticky Note */
  .sticky-note {
    background: linear-gradient(180deg, #fff9c4 0%, #fff59d 100%);
    border: 1px solid #fbc02d;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    color: #5d4037;
  }

  /* Gadget Sidebar */
  .gadget-sidebar {
    background: rgba(0, 0, 0, 0.2);
    border-left: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: inset 10px 0 20px rgba(0,0,0,0.1);
  }

  .gadget-item {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    backdrop-filter: blur(5px);
    transition: transform 0.2s;
  }
  .gadget-item:hover {
    transform: scale(1.02);
    background: rgba(255, 255, 255, 0.3);
  }
`;

// --- Initial Seed Data ---
const initialChatsSeed = [
  { id: '1', name: 'Общий чат (Public)', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Aero', isGroup: true, order: 1 }
];

// --- Web Audio API for Win7 System Sounds ---
const playSystemSound = (type = 'notify', scheme = 'xp', volume = 0.5) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    const vol = Math.max(0, Math.min(1, volume)); // Clamp 0-1
    
    // Simple synthesis variations based on scheme
    const baseFreq = scheme === 'xp' ? 880 : (scheme === 'vista' ? 600 : 1000);
    const typeWave = scheme === 'xp' ? 'sine' : (scheme === 'vista' ? 'triangle' : 'sine');

    if (type === 'notify') {
      osc.type = typeWave;
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      if (scheme === 'win7') {
         osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, ctx.currentTime + 0.1);
      } else {
         osc.frequency.setValueAtTime(baseFreq * 1.25, ctx.currentTime + 0.1);
      }
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3 * vol, ctx.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    } else if (type === 'login') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq / 2, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq, ctx.currentTime + 0.4);
      if (scheme === 'win7') osc.frequency.exponentialRampToValueAtTime(baseFreq * 2, ctx.currentTime + 0.8);
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2 * vol, ctx.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 1.5);
    } else if (type === 'trash') {
      // Crunch sound for recycle bin
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(50, ctx.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.2 * vol, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch (e) {
    console.log("Audio not supported or blocked");
  }
};

// Хелпер для конвертации Blob -> Base64
const blobToBase64 = (blob) => {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};

// --- Custom Aero Audio Player ---
const formatAudioTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

const AeroAudioPlayer = ({ src }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e) => {
    const time = Number(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  return (
    <div className="flex items-center gap-2 bg-gradient-to-b from-white/80 to-white/40 border border-white/80 p-1.5 rounded-full shadow-sm w-full sm:w-[240px] backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
      <button 
        onClick={togglePlay} 
        className="w-8 h-8 rounded-full aero-btn flex items-center justify-center shrink-0 shadow-md"
        title={isPlaying ? "Пауза" : "Воспроизвести"}
      >
        {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
      </button>
      
      <div className="flex-1 flex items-center px-1">
        <input 
          type="range" 
          min="0" 
          max={duration || 100} 
          step="0.01"
          value={currentTime} 
          onChange={handleSeek} 
          className="w-full aero-slider" 
        />
      </div>
      
      <span className="text-[10px] text-slate-700 font-bold w-7 text-right shrink-0 select-none" style={{ textShadow: '0 1px 0 rgba(255,255,255,0.8)' }}>
        {formatAudioTime(currentTime)}
      </span>
      
      <audio 
        ref={audioRef} 
        src={src} 
        onTimeUpdate={handleTimeUpdate} 
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        className="hidden"
      />
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginName, setLoginName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [authError, setAuthError] = useState('');
  
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState({});
  const [inputText, setInputText] = useState('');
  
  // Состояние профиля
  const [viewProfileId, setViewProfileId] = useState(null);
  
  // Стейты профиля текущего пользователя
  const [myAvatarUrl, setMyAvatarUrl] = useState('');
  const [myStatus, setMyStatus] = useState('online');
  const [myCustomStatus, setMyCustomStatus] = useState('');
  const [usersData, setUsersData] = useState({});
  
  // Стейт для поиска пользователей
  const [searchQuery, setSearchQuery] = useState('');

  // Стейт для звонков, файлов и аудиосообщений
  const [activeCallChatId, setActiveCallChatId] = useState(null);
  const [activeCallRoom, setActiveCallRoom] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  
  // --- WebRTC State (PeerJS) ---
  const [callStatus, setCallStatus] = useState('idle');
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  
  // --- Состояния для голосовых сообщений ---
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const lastTypingRef = useRef(0);

  // --- Новые стейты для функционала ---
  const [chatWallpaper, setChatWallpaper] = useState(localStorage.getItem('aero_wallpaper') || '');
  const [showWallpaperMenu, setShowWallpaperMenu] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedUsersForGroup, setSelectedUsersForGroup] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, msgId: null });
  const [activeMenuMsgId, setActiveMenuMsgId] = useState(null);
  const [viewingMessage, setViewingMessage] = useState(null);
  const [language, setLanguage] = useState('ru');
  const t = (key) => TRANSLATIONS[language][key] || key;
  
  // --- New Features State ---
  const [currentTheme, setCurrentTheme] = useState('blue');
  const [currentSoundScheme, setCurrentSoundScheme] = useState('win7');
  const [hoveredChatId, setHoveredChatId] = useState(null); // Aero Peek
  const [activeTab, setActiveTab] = useState('general'); // Profile tabs
  const [isDragOver, setIsDragOver] = useState(false); // Drag & Drop
  
  const [showGadgets, setShowGadgets] = useState(false);
  const [showRecycleBin, setShowRecycleBin] = useState(false);
  const [gadgetNotes, setGadgetNotes] = useState(localStorage.getItem('aero_notes') || '');
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [cpuUsage, setCpuUsage] = useState(15);
  
  const [volumes, setVolumes] = useState({ notify: 0.5, call: 0.5, system: 0.3 });

  // --- ЗВУКОВЫЕ СТЕЙТЫ ---
  const [startupSoundPlayed, setStartupSoundPlayed] = useState(false);
  const [lastProcessedMsgId, setLastProcessedMsgId] = useState(null);

  // ЭФФЕКТ: Воспроизведение звука запуска Windows 7
  useEffect(() => {
    if (isLoggedIn && !startupSoundPlayed) {
      const playStartup = () => {
        // Ссылка на оригинальный звук "Приветствия" Windows 7
        const audio = new Audio('https://www.myinstants.com/media/sounds/windows-7-startup.mp3');
        audio.volume = volumes.system || 0.5;
        
        audio.play()
          .then(() => setStartupSoundPlayed(true))
          .catch(e => {
            // Если браузер заблокировал автовоспроизведение, дожидаемся клика пользователя по странице
            console.log("Автовоспроизведение заблокировано браузером. Ожидание клика для звука запуска...");
            const onInteract = () => {
              audio.play();
              setStartupSoundPlayed(true);
              window.removeEventListener('click', onInteract);
            };
            window.addEventListener('click', onInteract);
          });
      };
      playStartup();
    }
  }, [isLoggedIn, startupSoundPlayed, volumes.system]);

  // ЭФФЕКТ: Воспроизведение звука при получении нового НЕПРОЧИТАННОГО сообщения
  useEffect(() => {
    if (!isLoggedIn || !user) return;
    
    // Собираем все сообщения в один плоский массив
    const allMessages = Object.values(messages).flat();
    if (allMessages.length === 0) return;

    // Ищем самое свежее сообщение по времени
    const newestMsg = allMessages.reduce((prev, current) => (prev.timestamp > current.timestamp) ? prev : current);

    // Если это действительно НОВОЕ сообщение (которое мы еще не обрабатывали)
    if (newestMsg && newestMsg.id !== lastProcessedMsgId) {
      setLastProcessedMsgId(newestMsg.id);

      // Проверяем:
      // 1. Сообщение не от нас (мы не отправитель)
      // 2. Оно пришло только что (меньше 5 секунд назад), а не загружено из старой истории
      const isNew = (Date.now() - newestMsg.timestamp) < 5000;
      
      if (isNew && newestMsg.senderId !== user.uid) {
        // Воспроизводим системный звук уведомления
        playSystemSound('notify', currentSoundScheme, volumes.notify);
      }
    }
  }, [messages, lastProcessedMsgId, user, currentSoundScheme, volumes.notify, isLoggedIn]);

  // 1. Авторизация Firebase (по Email/Паролю)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Подтягиваем имя из БД
        const userRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', currentUser.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.isBanned) {
            await signOut(auth);
            setUser(null);
            setIsLoggedIn(false);
            setAuthError(`Ваш аккаунт заблокирован администратором. Причина: ${data.banReason || 'не указана'}`);
            return;
          }
          setLoginName(data.name || '');
          setMyAvatarUrl(data.avatar || '');
          setMyStatus(data.status || 'online');
          setMyCustomStatus(data.customStatus || '');
        }
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Загрузка данных из Firestore после входа
  useEffect(() => {
    if (!user || !isLoggedIn) return;

    // Подписка на Чаты
    const chatsRef = collection(db, 'artifacts', appId, 'public', 'data', 'chats');
    const unsubChats = onSnapshot(chatsRef, (snapshot) => {
      const fetchedChats = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      
      // Фильтруем чаты: показываем группы ИЛИ личные чаты, в которых состоит текущий пользователь
      const visibleChats = fetchedChats.filter(c => c.isGroup || (c.participants && c.participants.includes(user.uid)));
      
      if (visibleChats.length === 0) {
        initialChatsSeed.forEach(async (c) => {
          await setDoc(doc(chatsRef, c.id), c);
        });
      } else {
        setChats(visibleChats);
      }
    }, console.error);

    // Подписка на Сообщения
    const msgsRef = collection(db, 'artifacts', appId, 'public', 'data', 'messages');
    const unsubMsgs = onSnapshot(msgsRef, (snapshot) => {
      const msgs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      msgs.sort((a, b) => a.timestamp - b.timestamp); // Сортировка по времени
      
      const grouped = {};
      msgs.forEach(m => {
        if (!grouped[m.chatId]) grouped[m.chatId] = [];
        grouped[m.chatId].push(m);
      });
      
      setMessages(grouped);
    }, console.error);

    // Подписка на Пользователей (для аватарок и статусов в реальном времени)
    const usersRef = collection(db, 'artifacts', appId, 'public', 'data', 'users');
    const unsubUsers = onSnapshot(usersRef, (snapshot) => {
      const uData = {};
      snapshot.docs.forEach(d => {
        uData[d.id] = d.data();
      });
      setUsersData(uData);
    }, console.error);

    return () => { 
      unsubChats(); 
      unsubMsgs(); 
      unsubUsers();
    };
  }, [user, isLoggedIn]);

  // Эффект: Помечаем сообщения как прочитанные, когда открываем чат или получаем новые
  useEffect(() => {
    if (!activeChatId || !user || chats.length === 0) return;
    const chatMsgs = messages[activeChatId] || [];
    if (chatMsgs.length === 0) return;
    
    const activeChatObj = chats.find(c => c.id === activeChatId);
    if (!activeChatObj) return;

    const myLastRead = activeChatObj.lastRead?.[user.uid] || 0;
    
    // Проверяем, есть ли новые сообщения от других людей
    const hasUnread = chatMsgs.some(m => m.timestamp > myLastRead && m.senderId !== user.uid);
    
    if (hasUnread) {
      const chatRef = doc(db, 'artifacts', appId, 'public', 'data', 'chats', activeChatId);
      setDoc(chatRef, {
        lastRead: {
          [user.uid]: Date.now()
        }
      }, { merge: true }).catch(console.error);
    }
  }, [activeChatId, messages, chats, user]);

  // Таймер записи голосового сообщения
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Автоскролл
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeChatId]);

  // Apply Theme CSS Variables
  useEffect(() => {
    const theme = THEMES[currentTheme];
    const root = document.documentElement;
    root.style.setProperty('--aero-glass', theme.color);
    root.style.setProperty('--aero-border', theme.border);
    root.style.setProperty('--aero-highlight', theme.highlight);
    root.style.setProperty('--aero-bg', theme.bg);
  }, [currentTheme]);

  // CPU Emulation
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(prev => Math.min(100, Math.max(5, prev + (Math.random() * 20 - 10))));
    }, 2000);
    return () => clearInterval(interval);
  }, []);


  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      let currentUser;
      if (isRegistering) {
        if (!loginName.trim()) {
          setAuthError(t('authErrorEmptyNick'));
          return;
        }
        // Регистрация
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        currentUser = userCredential.user;

        // Сохраняем профиль нового пользователя
        const userRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', currentUser.uid);
        await setDoc(userRef, {
          name: loginName.trim(),
          email: email,
          avatar: '',
          status: 'online',
          customStatus: '',
          lastSeen: Date.now(),
          isBanned: false
        }, { merge: true });
      } else {
        // Вход
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        currentUser = userCredential.user;
        
        // Получаем имя пользователя
        const userRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', currentUser.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.isBanned) {
            await signOut(auth);
            setAuthError(`Ваш аккаунт заблокирован администратором. Причина: ${data.banReason || 'не указана'}`);
            return;
          }
          if (!data.email) {
             await setDoc(userRef, { email: currentUser.email }, { merge: true });
          }
          setLoginName(data.name || '');
          setMyAvatarUrl(data.avatar || '');
          setMyStatus(data.status || 'online');
          setMyCustomStatus(data.customStatus || '');
        }
      }

      setIsLoggedIn(true);
    } catch (err) {
      console.error("Auth Error:", err);
      if (err.code === 'auth/email-already-in-use') setAuthError(t('authErrorEmailInUse'));
      else if (err.code === 'auth/invalid-credential') setAuthError(t('authErrorInvalidCreds'));
      else if (err.code === 'auth/weak-password') setAuthError(t('authErrorWeakPass'));
      else setAuthError(err.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsLoggedIn(false);
    setUser(null);
    setLoginName('');
    setEmail('');
    setPassword('');
    setStartupSoundPlayed(false); // Сбрасываем флаг звука запуска
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputText.trim() || !activeChatId || !user) return;

    const msgsRef = collection(db, 'artifacts', appId, 'public', 'data', 'messages');

    // Если это редактирование сообщения
    if (editingMessageId) {
      const msgDocRef = doc(msgsRef, editingMessageId);
      await updateDoc(msgDocRef, {
        text: inputText.trim(),
        edited: true
      });
      setEditingMessageId(null);
      setInputText('');
      setReplyingTo(null);
      return;
    }
    
    // Сохраняем в Firebase
    await addDoc(msgsRef, {
      chatId: activeChatId,
      type: 'text',
      text: inputText.trim(),
      replyTo: replyingTo ? { 
        id: replyingTo.id, 
        text: replyingTo.text || (replyingTo.type === 'image' ? `📷 ${t('image')}` : t('message')), 
        senderName: replyingTo.senderName 
      } : null,
      senderId: user.uid,
      senderName: loginName.trim(),
      timestamp: Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    setInputText('');
    setReplyingTo(null);
  };
  
  // --- Drag and Drop Handler ---
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Reuse existing file upload logic, mocking the event
      handleFileUpload({ target: { files: e.dataTransfer.files } });
    }
  };

  // --- Загрузка изображения (сжатие на лету без Storage) ---
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeChatId || !user) return;

    if (!file.type.startsWith('image/')) {
      setUploadError(t('uploadErrorImage'));
      setTimeout(() => setUploadError(''), 4000);
      return;
    }

    setIsUploading(true);
    setUploadError('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const MAX_DIMENSION = 800;

        if (width > height && width > MAX_DIMENSION) {
          height *= MAX_DIMENSION / width;
          width = MAX_DIMENSION;
        } else if (height > MAX_DIMENSION) {
          width *= MAX_DIMENSION / height;
          height = MAX_DIMENSION;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);

        try {
          const msgsRef = collection(db, 'artifacts', appId, 'public', 'data', 'messages');
          await addDoc(msgsRef, {
            chatId: activeChatId,
            type: 'image',
            imageUrl: dataUrl,
            senderId: user.uid,
            senderName: loginName.trim(),
            timestamp: Date.now(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
        } catch (err) {
          console.error("Ошибка при отправке картинки:", err);
          setUploadError(t('uploadErrorGeneric'));
        } finally {
          setIsUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // --- Логика голосовых сообщений ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });

      let options = { audioBitsPerSecond: 128000 };
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        options.mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4;codecs=mp4a.40.2')) {
        options.mimeType = 'audio/mp4;codecs=mp4a.40.2';
      }

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());

        try {
          const base64Audio = await blobToBase64(audioBlob);
          const msgsRef = collection(db, 'artifacts', appId, 'public', 'data', 'messages');
          await addDoc(msgsRef, {
            chatId: activeChatId,
            type: 'audio',
            audioUrl: base64Audio,
            senderId: user.uid,
            senderName: loginName.trim(),
            timestamp: Date.now(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
        } catch (err) {
          console.error("Ошибка отправки голосового:", err);
          setUploadError(t('uploadErrorAudio'));
          setTimeout(() => setUploadError(''), 4000);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
    } catch (err) {
      console.error("Ошибка доступа к микрофону:", err);
      setUploadError(t('uploadErrorMic'));
      setTimeout(() => setUploadError(''), 4000);
    }
  };

  const stopAndSendRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.onstop = () => {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const formatRecordingTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // --- Звонки ---
  const handleStartCall = async (isVideo) => {
    if (!activeChatId || !user) return;
    const newCallId = `${activeChatId}_${Date.now()}`;
    
    // Создаем документ звонка, чтобы определить хоста
    const callDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'calls', newCallId);
    await setDoc(callDocRef, {
      hostId: user.uid,
      createdAt: Date.now()
    });

    setActiveCallRoom(newCallId);
    setActiveCallChatId(activeChatId);

    const msgsRef = collection(db, 'artifacts', appId, 'public', 'data', 'messages');
    await addDoc(msgsRef, {
      chatId: activeChatId,
      callId: newCallId,
      type: 'call',
      isVideo: isVideo,
      text: isVideo ? t('startedVideoCall') : t('startedVoiceCall'),
      senderId: user.uid,
      senderName: loginName.trim(),
      timestamp: Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    
    playSystemSound('notify', currentSoundScheme, volumes.notify);
  };

  // --- PeerJS Logic ---
  useEffect(() => {
    if (!activeCallRoom || !user) return;
    
    let peer = null;
    let localStream = null;
    let unsubscribe = null;

    const startPeerCall = async () => {
      setCallStatus('connecting');

      // 1. Получаем доступ к камере/микрофону
      try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
      } catch (err) {
        console.error("Ошибка доступа к медиа:", err);
        setUploadError(t('uploadErrorMic'));
        return;
      }

      // 2. Инициализируем PeerJS
      // debug: 2 покажет ошибки в консоли браузера (F12)
      peer = new Peer(undefined, {
        host: '0.peerjs.com',
        port: 443,
        secure: true,
        debug: 2
      });

      peer.on('open', async (myPeerId) => {
        const callDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'calls', activeCallRoom);
        const callDoc = await getDoc(callDocRef);

        if (callDoc.exists() && callDoc.data().hostId === user.uid) {
          // Я - инициатор звонка (Хост)
          await updateDoc(callDocRef, { hostPeerId: myPeerId });
          setCallStatus('waiting'); // Ждем собеседника
        } else {
          // Я - присоединившийся (Гость)
          // Слушаем, когда появится ID хоста
          unsubscribe = onSnapshot(callDocRef, (snap) => {
            const data = snap.data();
            if (data && data.hostPeerId) {
              // Звоним хосту
              const call = peer.call(data.hostPeerId, localStream);
              setCallStatus('connected');
              call.on('stream', (remoteStream) => {
                if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
              });
            }
          });
        }
      });

      // Обработка ошибок PeerJS
      peer.on('error', (err) => {
        console.error("PeerJS Error:", err);
        setUploadError(`Ошибка соединения: ${err.type}`);
      });

      // 3. Обработка входящего звонка (для Хоста)
      peer.on('call', (call) => {
        call.answer(localStream); // Отвечаем своим потоком
        setCallStatus('connected');
        call.on('stream', (remoteStream) => {
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
        });
      });
    };

    startPeerCall();

    return () => {
      if (peer) peer.destroy();
      if (localStream) localStream.getTracks().forEach(track => track.stop());
      if (unsubscribe) unsubscribe();
      setCallStatus('idle');
    };
  }, [activeCallRoom, user]);

  const handleSaveProfile = async () => {
    if (!user || viewProfileId !== user.uid) {
        setViewProfileId(null);
        return;
    }
    const userRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', user.uid);
    await setDoc(userRef, {
      avatar: myAvatarUrl,
      status: myStatus,
      customStatus: myCustomStatus
    }, { merge: true });
    setViewProfileId(null);
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'online': return t('online');
      case 'away': return t('away');
      case 'dnd': return t('dnd');
      case 'invisible': return t('invisible');
      default: return 'В сети';
    }
  };

  // --- Личные сообщения ---
  const handleStartDM = async (targetUserId) => {
    if (!user || targetUserId === user.uid) return;
    
    // Генерируем уникальный ID для чата двух пользователей (по алфавиту)
    const dmId = [user.uid, targetUserId].sort().join('_');
    
    const existingChat = chats.find(c => c.id === dmId);
    if (!existingChat) {
      // Создаем новую комнату в БД
      const chatRef = doc(db, 'artifacts', appId, 'public', 'data', 'chats', dmId);
      await setDoc(chatRef, {
        isGroup: false,
        participants: [user.uid, targetUserId],
        timestamp: Date.now(),
        lastRead: { [user.uid]: Date.now() }
      });
    }
    
    setActiveChatId(dmId);
    setViewProfileId(null);
    setSearchQuery('');
  };

  // --- Создание группы ---
  const handleCreateGroup = async () => {
    if (!newGroupName.trim() || selectedUsersForGroup.length === 0 || !user) return;
    
    const newChatRef = doc(collection(db, 'artifacts', appId, 'public', 'data', 'chats'));
    await setDoc(newChatRef, {
      name: newGroupName.trim(),
      isGroup: true,
      participants: [user.uid, ...selectedUsersForGroup],
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${newChatRef.id}`,
      timestamp: Date.now(),
      lastRead: { [user.uid]: Date.now() }
    });
    
    setShowGroupModal(false);
    setNewGroupName('');
    setSelectedUsersForGroup([]);
    setActiveChatId(newChatRef.id);
  };

  // --- Закрепление сообщения ---
  const handlePinMessage = async (msgId) => {
    if (!activeChatId) return;
    const chatRef = doc(db, 'artifacts', appId, 'public', 'data', 'chats', activeChatId);
    // Toggle pin: if already pinned, unpin (set to null)
    const isPinned = activeChat?.pinnedMessageId === msgId;
    await setDoc(chatRef, { pinnedMessageId: isPinned ? null : msgId }, { merge: true });
  };

  // --- Удаление сообщения ---
  const requestDeleteMessage = (msgId) => {
    // Soft delete (move to Recycle Bin)
    const msgRef = doc(db, 'artifacts', appId, 'public', 'data', 'messages', msgId);
    updateDoc(msgRef, { deletedAt: Date.now() });
    setActiveMenuMsgId(null);
  };

  const restoreMessage = async (msgId) => {
    const msgRef = doc(db, 'artifacts', appId, 'public', 'data', 'messages', msgId);
    await updateDoc(msgRef, { deletedAt: null });
  };

  const permanentDeleteMessage = async (msgId) => {
    try {
      await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'messages', msgId));
      playSystemSound('trash', currentSoundScheme, volumes.system);
    } catch (e) {
      console.error("Error deleting message", e);
    }
  };

  const emptyRecycleBin = async () => {
    if (!activeChatId) return;
    const deletedMsgs = (messages[activeChatId] || []).filter(m => m.deletedAt);
    for (const msg of deletedMsgs) {
      await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'messages', msg.id));
    }
    playSystemSound('trash', currentSoundScheme, volumes.system);
    setShowRecycleBin(false);
  };

  // --- Индикатор печати ---
  const handleTyping = async () => {
    if (!activeChatId || !user) return;
    const now = Date.now();
    // Обновляем статус не чаще чем раз в 2 секунды
    if (now - lastTypingRef.current > 2000) {
      lastTypingRef.current = now;
      const chatRef = doc(db, 'artifacts', appId, 'public', 'data', 'chats', activeChatId);
      await setDoc(chatRef, {
        typing: { [user.uid]: now }
      }, { merge: true });
    }
  };

  // --- Смена обоев ---
  const handleSetWallpaper = (url) => {
    setChatWallpaper(url);
    localStorage.setItem('aero_wallpaper', url);
    setShowWallpaperMenu(false);
  };

  // --- Вставка эмодзи ---
  const handleAddEmoji = (emoji) => {
    setInputText(prev => prev + emoji);
    setShowEmojiPicker(false);
  };
  
  const toggleBan = async (uid, currentStatus) => {
    const userRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', uid);
    if (currentStatus) {
      await updateDoc(userRef, { isBanned: false, banReason: null });
    } else {
      const reason = prompt('Укажите причину блокировки:', 'Нарушение правил');
      if (reason !== null) {
        await updateDoc(userRef, { isBanned: true, banReason: reason });
      }
    }
  };

  const activeChat = chats.find(c => c.id === activeChatId);
  const myAvatar = myAvatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.uid || 'Me'}`;

  // Вычисляем, кто печатает
  const typingUsers = activeChat?.typing ? Object.entries(activeChat.typing)
    .filter(([uid, ts]) => uid !== user?.uid && Date.now() - ts < 3000)
    .map(([uid]) => usersData[uid]?.name || t('someone')) : [];

  const typingText = typingUsers.length > 0 
    ? `${typingUsers.join(', ')} ${typingUsers.length > 1 ? t('typingPlural') : t('typing')}` 
    : '';

  // Данные активного чата (для подмены имени в шапке ЛС)
  let activeChatDetails = null;
  if (activeChat) {
    if (activeChat.isGroup) {
      activeChatDetails = { name: activeChat.name, status: 'В сети' };
    } else {
      const otherUserId = activeChat.participants?.find(id => id !== user?.uid);
      const otherUser = usersData[otherUserId] || {};
      activeChatDetails = { 
        name: otherUser.name || t('unknown'), 
        status: getStatusText(otherUser.status || 'offline') 
      };
    }
  }

  // Данные для модального окна профиля
  const isMyProfile = viewProfileId === user?.uid;
  const profileData = isMyProfile
    ? { name: loginName, avatar: myAvatarUrl || myAvatar, status: myStatus, customStatus: myCustomStatus, id: user?.uid }
    : {
        name: usersData[viewProfileId]?.name || t('unknown'), 
        avatar: usersData[viewProfileId]?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${viewProfileId}`, 
        status: usersData[viewProfileId]?.status || 'offline',
        customStatus: usersData[viewProfileId]?.customStatus || '',
        id: viewProfileId 
      };

  // Pinned Message Data
  const pinnedMessageId = activeChat?.pinnedMessageId;
  const pinnedMessage = pinnedMessageId ? (messages[activeChatId] || []).find(m => m.id === pinnedMessageId) : null;

  // Achievements Calculation
  const myMsgCount = Object.values(messages).flat().filter(m => m.senderId === user?.uid).length;
  const achievements = [
    { id: 'newbie', name: 'Новичок', icon: <Smile size={20} className="text-blue-500"/>, condition: myMsgCount >= 1 },
    { id: 'active', name: 'Активист', icon: <Award size={20} className="text-yellow-500"/>, condition: myMsgCount >= 50 },
    { id: 'master', name: 'Мастер ГС', icon: <Mic size={20} className="text-red-500"/>, condition: Object.values(messages).flat().filter(m => m.senderId === user?.uid && m.type === 'audio').length >= 10 },
  ].filter(a => a.condition);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: aeroStyles }} />
      
      <div className="h-screen w-full flex items-center justify-center p-4 sm:p-8">
        {!isLoggedIn ? (
          // --- LOGIN SCREEN ---
          <div className="aero-window w-full max-w-sm shadow-2xl animate-gentle-fade-in-up">
            <div className="aero-titlebar">
              <span className="aero-title-text flex items-center gap-2">
                <Smile size={16} className="text-blue-600" /> {t('loginTitle')}
              </span>
              <div className="ml-auto flex gap-1">
                <div className="win-control win-btn" onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')} title="Language / Язык"><Globe size={12} color="#333" /></div>
                <div className="win-control win-close"><X size={12} color="white" /></div>
              </div>
            </div>
            
            <div className="p-8 glass-panel relative z-10">
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-b from-blue-200 to-blue-400 p-1 shadow-lg border-2 border-white mb-4">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                    <User size={40} className="text-blue-500" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-slate-800" style={{ textShadow: '0 1px 0 #fff' }}>
                  {isRegistering ? t('register') : t('welcome')}
                </h2>
              </div>
              
              <form onSubmit={handleAuth} className="space-y-3">
                {isRegistering && (
                  <div>
                    <label className="block text-sm text-slate-700 mb-1 font-semibold" style={{ textShadow: '0 1px 0 #fff' }}>{t('nickname')}</label>
                    <input 
                      type="text" 
                      value={loginName}
                      onChange={(e) => setLoginName(e.target.value)}
                      placeholder={t('nicknamePlaceholder')}
                      className="aero-input w-full px-3 py-1.5 rounded" 
                      required={isRegistering} 
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm text-slate-700 mb-1 font-semibold" style={{ textShadow: '0 1px 0 #fff' }}>{t('email')}</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('emailPlaceholder') || "name@example.com"}
                    className="aero-input w-full px-3 py-1.5 rounded" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-1 font-semibold" style={{ textShadow: '0 1px 0 #fff' }}>{t('password')}</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('passwordPlaceholder') || "••••••••"}
                    className="aero-input w-full px-3 py-1.5 rounded" 
                    required 
                  />
                </div>
                
                {authError && <div className="text-red-600 text-xs font-semibold bg-red-100 p-2 rounded border border-red-300">{authError}</div>}

                <button 
                  type="submit" 
                  className="aero-btn w-full py-2 font-bold text-lg mt-2"
                >
                  {isRegistering ? t('createAccount') : t('login')}
                </button>
              </form>

              <div className="mt-4 text-center">
                <button 
                  type="button" 
                  onClick={() => { setIsRegistering(!isRegistering); setAuthError(''); }}
                  className="text-sm text-blue-700 hover:underline font-semibold cursor-pointer"
                >
                  {isRegistering ? t('haveAccount') : t('noAccount')}
                </button>
              </div>
            </div>
          </div>
        ) : (
          // --- MAIN APP WINDOW ---
          <div className={`aero-window flex flex-col shadow-2xl relative transition-all duration-300 ${isFullScreen ? 'fixed inset-0 w-full h-full max-w-none rounded-none z-50' : 'w-full h-full md:h-[85vh] md:max-w-5xl'}`}>
            
            {/* Window Controls */}
            <div className="aero-titlebar">
              <span className="aero-title-text flex items-center gap-2">
                <Smile size={16} className="text-blue-600 drop-shadow" /> AeroGram 2009 (Live)
              </span>
              <div className="ml-auto flex gap-1">
                <div className="win-control win-btn" onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')} title="Language / Язык"><Globe size={12} color="#333" /></div>
                <div className="win-control win-btn"><Minus size={12} color="#333" /></div>
                <div className="win-control win-btn" onClick={() => setShowGadgets(!showGadgets)} title={t('gadgets')}><Cpu size={12} color="#333" /></div>
                <div className="win-control win-btn" onClick={() => setIsFullScreen(!isFullScreen)} title={isFullScreen ? "Свернуть" : "Развернуть"}><Maximize size={10} color="#333" /></div>
                <div className="win-control win-close"><X size={12} color="white" /></div>
              </div>
            </div>

            <div className="flex flex-1 overflow-hidden glass-panel relative z-10">
              
              {/* SIDEBAR */}
              <div className={`w-full md:w-1/3 md:min-w-[250px] md:max-w-[350px] border-r border-white/50 flex flex-col bg-white/20 ${activeChatId ? 'hidden md:flex' : 'flex'}`}>
                {/* User Profile Header */}
                <div 
                  className="p-3 border-b border-white/50 flex items-center gap-3 cursor-pointer explorer-hover transition-colors"
                  onClick={() => setViewProfileId(user.uid)}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-b from-blue-300 to-blue-500 p-0.5 shadow shrink-0">
                    <img src={myAvatar} alt="Me" className="w-full h-full rounded-full bg-white object-cover shine-effect" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-800 text-sm truncate">{loginName}</div>
                    <div className="text-xs text-slate-700 font-semibold flex items-center gap-1">
                      <div className={`w-2 h-2 status-dot status-${myStatus}`}></div> {getStatusText(myStatus)}
                    </div>
                    {myCustomStatus && (
                      <div className="text-[10px] text-slate-500 truncate italic">"{myCustomStatus}"</div>
                    )}
                  </div>
                  <Settings size={18} className="text-slate-600 shrink-0" />
                </div>

                {/* Admin Button */}
                {user?.email === ADMIN_EMAIL && (
                   <div className="px-2 pt-2">
                     <button onClick={() => setShowAdminPanel(true)} className="w-full aero-btn py-1 text-xs flex items-center justify-center gap-1 bg-red-100 border-red-300 text-red-800 font-bold">
                       <Shield size={12} /> Админ Панель
                     </button>
                   </div>
                )}

                {/* Search */}
                <div className="p-2">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('searchPlaceholder')}
                    className="aero-input w-full px-3 py-1.5 rounded-full text-sm"
                  />
                </div>

                {/* Create Group Button */}
                <div className="px-2 pb-2">
                  <button onClick={() => setShowGroupModal(true)} className="w-full aero-btn py-1 text-xs flex items-center justify-center gap-1" title={t('createGroup')}>
                    <Plus size={12} /> {t('createGroup')}
                  </button>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto">
                  {searchQuery.trim() ? (
                    // Рендер результатов поиска пользователей
                    Object.entries(usersData)
                      .filter(([uid, u]) => uid !== user.uid && u.name?.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map(([uid, u]) => (
                        <div 
                          key={uid} 
                          onClick={() => handleStartDM(uid)} 
                          className="p-3 flex items-center gap-3 cursor-pointer explorer-hover border-b border-transparent transition-all border-b-white/20"
                        >
                          <div className="relative">
                            <img src={u.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${uid}`} alt={u.name} className="w-12 h-12 rounded bg-white shadow-sm border border-slate-300 p-0.5 object-cover" />
                            <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 status-dot z-10 status-${u.status || 'offline'}`}></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-slate-800 text-sm truncate">{u.name}</div>
                            <div className="text-xs text-slate-600 truncate">{t('clickToWrite')}</div>
                          </div>
                        </div>
                      ))
                  ) : (
                    // Обычный список чатов (с сортировкой по свежим сообщениям)
                    [...chats].sort((a, b) => {
                      const msgsA = messages[a.id];
                      const msgsB = messages[b.id];
                      const timeA = msgsA && msgsA.length > 0 ? msgsA[msgsA.length - 1].timestamp : (a.timestamp || 0);
                      const timeB = msgsB && msgsB.length > 0 ? msgsB[msgsB.length - 1].timestamp : (b.timestamp || 0);
                      
                      if (timeA === timeB) return (a.order || 99) - (b.order || 99);
                      return timeB - timeA; // Новые сообщения сверху
                    }).map(chat => {
                      const chatMsgs = messages[chat.id] || [];
                      let lastMsg = t('noMessages');
                      if (chatMsgs.length > 0) {
                        const lastObj = chatMsgs[chatMsgs.length - 1];
                        if (lastObj.type === 'image') lastMsg = `📷 ${t('image')}`;
                        else if (lastObj.type === 'call') lastMsg = `📞 ${t('call')}`;
                        else if (lastObj.type === 'audio') lastMsg = `🎤 ${t('audio')}`;
                        else lastMsg = lastObj.text;
                      }
                      
                      // Определяем имя и аватарку для чата (свои для групп, чужие для ЛС)
                      let chatName = chat.name;
                      let chatAvatar = chat.avatar;
                      let chatStatus = null;

                      if (!chat.isGroup) {
                        const otherUserId = chat.participants?.find(id => id !== user.uid);
                        const otherUser = usersData[otherUserId] || {};
                        chatName = otherUser.name || t('unknown');
                        chatAvatar = otherUser.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${otherUserId}`;
                        chatStatus = otherUser.status || 'offline';
                      }

                      // Вычисляем количество непрочитанных
                      const myLastRead = chat.lastRead?.[user?.uid] || 0;
                      const unreadCount = chatMsgs.filter(m => m.timestamp > myLastRead && m.senderId !== user?.uid).length;
                      
                      return (
                        <div key={chat.id} className="relative group">
                          <div 
                            onClick={() => setActiveChatId(chat.id)}
                            onMouseEnter={() => setHoveredChatId(chat.id)}
                            onMouseLeave={() => setHoveredChatId(null)}
                            className={`p-3 flex items-center gap-3 border-b border-transparent cursor-pointer transition-all
                              ${activeChatId === chat.id ? 'explorer-active' : 'explorer-hover border-b-white/20'}`}
                          >
                            <div className="relative shrink-0">
                              <img src={chatAvatar} alt={chatName} className="w-12 h-12 rounded bg-white shadow-sm border border-slate-300 p-0.5 object-cover shine-effect" />
                              {!chat.isGroup && <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 status-dot z-10 status-${chatStatus || 'offline'}`}></div>}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center mb-0.5">
                                <span className="font-bold text-slate-800 truncate text-sm flex items-center gap-1">
                                  {chat.isGroup && <Users size={12} className="text-blue-600"/>}
                                  {chatName}
                                </span>
                                {/* Бейдж непрочитанных сообщений */}
                                {unreadCount > 0 && (
                                  <div className="aero-badge px-2 py-0.5 rounded-full text-[10px] font-bold ml-2">
                                    {unreadCount}
                                  </div>
                                )}
                              </div>
                              <div className={`text-xs truncate ${unreadCount > 0 ? 'font-bold text-slate-800' : 'text-slate-600'}`}>
                                {lastMsg}
                              </div>
                            </div>
                          </div>
                          
                          {/* Aero Peek Popup */}
                          {hoveredChatId === chat.id && (
                            <div className="aero-peek-popup visible">
                              <div className="font-bold text-xs text-slate-700 mb-2 border-b border-slate-400/50 pb-1">{chatName}</div>
                              {chatMsgs.slice(-3).map(m => (
                                <div key={m.id} className="text-[10px] text-slate-600 mb-1 truncate">
                                  <span className="font-semibold">{m.senderName}:</span> {m.text || (m.type === 'image' ? '📷' : '...')}
                                </div>
                              ))}
                              {chatMsgs.length === 0 && <div className="text-[10px] text-slate-500 italic">{t('noMessages')}</div>}
                            </div>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

              {/* CHAT AREA */}
              <div 
                className={`flex-1 flex flex-col bg-white/40 relative ${!activeChatId ? 'hidden md:flex' : 'flex'} ${isDragOver ? 'bg-blue-100/50' : ''}`} 
                style={{ 
                backgroundImage: chatWallpaper ? `url("${chatWallpaper}")` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
                }}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
              >
                {/* Overlay for readability if wallpaper is set */}
                {chatWallpaper && <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px] pointer-events-none"></div>}
                
                {/* Backdrop for closing menus */}
                {activeMenuMsgId && (
                  <div className="absolute inset-0 z-40" onClick={() => setActiveMenuMsgId(null)}></div>
                )}

                {activeChat ? (
                  <>
                    {/* Chat Header */}
                    <div className="h-14 border-b border-white/60 bg-gradient-to-b from-white/60 to-white/20 flex items-center justify-between px-4 shadow-sm relative z-10">
                      <div className="flex items-center gap-3">
                        <button onClick={() => setActiveChatId(null)} className="md:hidden p-1 -ml-2 text-slate-600 hover:bg-white/50 rounded-full transition-colors">
                          <ArrowLeft size={20} />
                        </button>
                        <span className="font-bold text-slate-800">{activeChatDetails?.name}</span>
                        <span className="text-xs text-slate-600 font-semibold bg-white/50 px-2 py-0.5 rounded-full border border-white/80 shadow-sm">{activeChatDetails?.status}</span>
                      </div>
                      <div className="flex gap-2">
                        <div className="relative">
                          <button onClick={() => setShowWallpaperMenu(!showWallpaperMenu)} className="p-1.5 hover:bg-white/50 rounded border border-transparent hover:border-white/80 transition-all text-slate-600 shadow-sm" title={t('wallpapers')}><ImageIcon size={18} /></button>
                          {showWallpaperMenu && (
                            <div className="absolute top-full right-0 mt-1 w-40 bg-white border border-slate-300 shadow-xl rounded z-50 py-1 animate-fade-in-up">
                              {WALLPAPERS.map((wp) => (
                                <div 
                                  key={wp.name} 
                                  onClick={() => handleSetWallpaper(wp.url)}
                                  className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm flex items-center justify-between"
                                >
                                  {wp.name === 'По умолчанию' ? t('default') : wp.name} {chatWallpaper === wp.url && <Check size={12} className="text-blue-600"/>}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <button onClick={() => handleStartCall(false)} className="p-1.5 hover:bg-white/50 rounded border border-transparent hover:border-white/80 transition-all text-slate-600 shadow-sm" title={t('startVoiceCall')}><Phone size={18} /></button>
                        <button onClick={() => handleStartCall(true)} className="p-1.5 hover:bg-white/50 rounded border border-transparent hover:border-white/80 transition-all text-slate-600 shadow-sm" title={t('startVideoCall')}><Video size={18} /></button>
                      </div>
                      <div className="ml-2 border-l border-white/50 pl-2">
                         <button onClick={() => setShowRecycleBin(true)} className="p-1.5 hover:bg-white/50 rounded border border-transparent hover:border-white/80 transition-all text-slate-600 shadow-sm relative" title={t('recycleBin')}>
                           <Trash size={18} />
                           {(messages[activeChatId] || []).filter(m => m.deletedAt).length > 0 && <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>}
                         </button>
                      </div>
                    </div>

                    {/* Pinned Message (Sticky Note) */}
                    {pinnedMessage && (
                      <div className="sticky-note mx-4 mt-2 p-2 rounded text-xs flex items-start gap-2 relative z-10 animate-gentle-fade-in-up cursor-pointer" onClick={() => {
                        document.getElementById(`msg-${pinnedMessage.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }}>
                        <StickyNote size={16} className="shrink-0 text-yellow-700" />
                        <div className="flex-1 truncate font-medium">{pinnedMessage.text || (pinnedMessage.type === 'image' ? t('image') : '...')}</div>
                        <button onClick={(e) => { e.stopPropagation(); handlePinMessage(pinnedMessage.id); }} className="hover:bg-yellow-500/20 rounded p-0.5"><X size={12}/></button>
                      </div>
                    )}

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
                      {(messages[activeChatId] || []).filter(m => !m.deletedAt).map((msg) => {
                        // --- Рендер приглашения на звонок ---
                        if (msg.type === 'call') {
                          return (
                            <div key={msg.id} className="flex justify-center my-4 w-full animate-gentle-fade-in-up">
                              <div className="bg-white/60 border border-blue-300 rounded-lg p-4 text-center shadow-md w-[85%] max-w-sm backdrop-blur-md">
                                <div className="text-sm text-slate-800 font-semibold mb-3 flex items-center justify-center gap-2">
                                  <div 
                                    className="w-8 h-8 rounded-full overflow-hidden shrink-0 shadow-sm border border-slate-300 cursor-pointer hover:opacity-80"
                                    onClick={() => setViewProfileId(msg.senderId)}
                                    title={t('profile')}
                                  >
                                     <img src={usersData[msg.senderId]?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${msg.senderId}`} className="w-full h-full object-cover" alt="avatar"/>
                                  </div>
                                  <span>{msg.senderName} <br/><span className="text-slate-500 font-normal">{msg.text}</span></span>
                                </div>
                                <button onClick={() => {
                                  setActiveCallRoom(msg.callId || msg.chatId);
                                  setActiveCallChatId(msg.chatId);
                                }} className="aero-btn px-4 py-2 text-sm flex items-center justify-center gap-2 w-full mt-2 font-bold">
                                  {msg.isVideo ? <Video size={16}/> : <Phone size={16}/>}
                                  {t('joinCall')}
                                </button>
                              </div>
                            </div>
                          );
                        }

                        // --- Рендер обычного сообщения (текст, картинка, аудио) ---
                        const isMe = msg.senderId === user?.uid;
                        const senderData = usersData[msg.senderId] || {};
                        const senderAvatar = senderData.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${msg.senderId}`;

                        // Проверяем, прочитал ли кто-то наше сообщение
                        const isRead = activeChat?.isGroup 
                            ? Object.entries(activeChat.lastRead || {}).some(([uid, ts]) => uid !== user?.uid && ts >= msg.timestamp)
                            : (activeChat?.lastRead?.[activeChat.participants?.find(id => id !== user?.uid)] || 0) >= msg.timestamp;

                        return (
                          <div key={msg.id} id={`msg-${msg.id}`} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className="relative shrink-0 self-end mb-1">
                              <img 
                                src={senderAvatar} 
                                alt="avatar" 
                                className="w-8 h-8 rounded bg-white shadow-sm border border-slate-300 p-0.5 object-cover cursor-pointer hover:opacity-80 transition-opacity shine-effect" 
                                onClick={() => setViewProfileId(msg.senderId)}
                                title={`${t('profile')}: ${msg.senderName}`}
                              />
                              <div className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 status-dot z-10 status-${senderData.status || 'online'}`}></div>
                            </div>
                            <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[70%]`}>
                              {!isMe && <span className="text-xs text-slate-500 mb-1 ml-1 font-semibold">{msg.senderName}</span>}
                              <div className={`w-full p-2.5 rounded-lg text-sm relative group break-words
                                ${isMe ? 'bubble-self rounded-br-none' : 'bubble-other rounded-bl-none'} 
                                ${msg.edited ? 'italic' : ''}`}
                              >
                                {/* Цитата (Reply) */}
                                {msg.replyTo && (
                                  <div className="mb-2 p-2 bg-black/5 border-l-2 border-blue-400 rounded text-xs cursor-pointer opacity-80">
                                    <div className="font-bold text-blue-700">{msg.replyTo.senderName}</div>
                                    <div className="truncate">{msg.replyTo.text}</div>
                                  </div>
                                )}

                                {/* Рендер картинки */}
                                {msg.type === 'image' && msg.imageUrl && (
                                  <div className="block mb-1">
                                    <img 
                                      src={msg.imageUrl} 
                                      alt={t('image')} 
                                      className="max-w-full sm:max-w-[250px] max-h-[250px] object-contain rounded shadow-sm bg-white/50 border border-white/50 cursor-pointer hover:opacity-90 transition-opacity" 
                                      onClick={() => setViewingMessage(msg)}
                                    />
                                  </div>
                                )}
                                
                                {/* Рендер аудио */}
                                {msg.type === 'audio' && msg.audioUrl && (
                                  <div className="mb-1">
                                    <AeroAudioPlayer src={msg.audioUrl} />
                                  </div>
                                )}

                                {/* Рендер текста */}
                                {msg.text && (
                                  <div>
                                    {msg.text}
                                    {/* Rich Link Preview */}
                                    {extractUrl(msg.text) && (
                                      <a href={extractUrl(msg.text)} target="_blank" rel="noopener noreferrer" className="mt-2 block bg-white/60 border border-blue-200 rounded p-2 flex items-center gap-2 hover:bg-white/80 transition-colors no-underline group-link">
                                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center shrink-0">
                                          <ExternalLink size={16} className="text-blue-600"/>
                                        </div>
                                        <div className="text-xs text-blue-800 truncate font-semibold">{extractUrl(msg.text)}</div>
                                      </a>
                                    )}
                                  </div>
                                )}
                                
                                <div className={`text-[10px] mt-1 flex justify-end items-center gap-1 opacity-60 ${isMe ? 'text-blue-900' : 'text-slate-600'}`}>
                                  <span>{msg.time}</span>
                                  {isMe && (
                                    <span className="text-[12px] leading-none tracking-tighter" title={isRead ? t('read') : t('sent')}>
                                      {isRead ? '✓✓' : '✓'}
                                    </span>
                                  )}
                                  {msg.edited && <span className="text-[9px] ml-1">{t('edited')}</span>}
                                </div>

                                {/* Меню действий (3 точки) */}
                                <div className={`absolute top-0 ${isMe ? '-left-7' : '-right-7'} opacity-0 group-hover:opacity-100 transition-opacity ${activeMenuMsgId === msg.id ? '!opacity-100' : ''} z-50`}>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); setActiveMenuMsgId(activeMenuMsgId === msg.id ? null : msg.id); }}
                                    className="p-2 bg-white/80 rounded-full shadow hover:bg-blue-100 text-slate-600 border border-white/50"
                                    title={t('actions')}
                                  >
                                    <MoreVertical size={16} />
                                  </button>
                                  
                                  {/* Выпадающее меню */}
                                  {activeMenuMsgId === msg.id && (
                                    <div className={`absolute top-9 ${isMe ? 'right-0' : 'left-0'} w-40 bg-white/95 backdrop-blur-sm border border-slate-300 shadow-xl rounded-lg py-1 animate-gentle-fade-in-up flex flex-col overflow-hidden`} onClick={(e) => e.stopPropagation()}>
                                      <button onClick={() => { setReplyingTo(msg); setActiveMenuMsgId(null); }} className="px-3 py-2.5 text-left text-sm hover:bg-blue-50 flex items-center gap-2 text-slate-700 transition-colors"><Reply size={14} className="text-blue-500" /> {t('reply')}</button>
                                      {isMe && msg.type === 'text' && (
                                        <button onClick={() => { setInputText(msg.text); setEditingMessageId(msg.id); setReplyingTo(null); setActiveMenuMsgId(null); }} className="px-3 py-2.5 text-left text-sm hover:bg-blue-50 flex items-center gap-2 text-slate-700 transition-colors"><Edit2 size={14} className="text-yellow-500" /> {t('edit')}</button>
                                      )}
                                      <button onClick={() => { handlePinMessage(msg.id); setActiveMenuMsgId(null); }} className="px-3 py-2.5 text-left text-sm hover:bg-blue-50 flex items-center gap-2 text-slate-700 transition-colors"><StickyNote size={14} className="text-green-600" /> {pinnedMessageId === msg.id ? t('unpinMessage') : t('pinMessage')}</button>
                                      {isMe && <div className="border-t border-slate-100 my-0.5"></div>}
                                      {isMe && (
                                        <button onClick={() => requestDeleteMessage(msg.id)} className="px-3 py-2.5 text-left text-sm hover:bg-red-50 flex items-center gap-2 text-red-600 transition-colors"><Trash2 size={14} /> {t('delete')}</button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {/* Индикатор печати */}
                      {typingText && (
                        <div className="text-xs text-slate-500 italic ml-12 animate-pulse">
                          {typingText}
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 border-t border-white/60 bg-gradient-to-t from-white/40 to-transparent relative">
                      {uploadError && (
                        <div className="absolute -top-8 left-3 bg-red-100 border border-red-300 text-red-700 px-3 py-1 text-xs rounded shadow-sm font-semibold animate-gentle-fade-in-up z-20">
                          {uploadError}
                        </div>
                      )}
                      
                      {/* Панель ответа / редактирования */}
                      {(replyingTo || editingMessageId) && (
                        <div className="absolute bottom-full left-0 w-full bg-white/90 border-t border-blue-200 p-2 flex items-center justify-between text-xs z-20 shadow-sm backdrop-blur-sm">
                          <div className="flex items-center gap-2 overflow-hidden">
                            {editingMessageId ? <Edit2 size={14} className="text-yellow-600"/> : <Reply size={14} className="text-blue-600"/>}
                            <div className="border-l-2 border-slate-400 pl-2 flex flex-col">
                              <span className="font-bold text-slate-700">{editingMessageId ? t('editingMessage') : `${t('replyTo')}: ${replyingTo.senderName}`}</span>
                              <span className="truncate text-slate-500 max-w-[200px]">{editingMessageId ? '' : replyingTo.text}</span>
                            </div>
                          </div>
                          <button onClick={() => { setReplyingTo(null); setEditingMessageId(null); setInputText(''); }} className="p-1 hover:bg-slate-200 rounded"><X size={14}/></button>
                        </div>
                      )}

                      {isRecording ? (
                        // --- UI записи голосового сообщения ---
                        <div className="flex items-center gap-3 bg-white/70 px-4 py-2 rounded shadow-inner border border-red-300 h-[46px]">
                          <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                          <span className="text-red-600 font-bold text-sm w-12">{formatRecordingTime(recordingTime)}</span>
                          <div className="flex-1"></div>
                          <button 
                            type="button" 
                            onClick={cancelRecording} 
                            className="p-1.5 text-slate-500 hover:text-red-600 transition-colors bg-white/50 rounded border border-white hover:bg-white shadow-sm" 
                            title={t('cancel')}
                          >
                            <X size={18} />
                          </button>
                          <button 
                            type="button" 
                            onClick={stopAndSendRecording} 
                            className="aero-btn px-4 py-1.5 flex items-center justify-center gap-2"
                          >
                            <Send size={16} /> {t('send')}
                          </button>
                        </div>
                      ) : (
                        // --- Обычный UI ввода ---
                        <form onSubmit={handleSendMessage} className="flex gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                          />
                          <button 
                            type="button" 
                            disabled={isUploading}
                            onClick={() => fileInputRef.current?.click()}
                            className={`p-2 text-slate-600 hover:text-blue-600 transition-colors bg-white/50 rounded border border-white hover:bg-white flex items-center justify-center w-10 h-10 ${isUploading ? 'opacity-50 cursor-wait' : ''}`}
                            title={t('attachImage')}
                          >
                            {isUploading ? (
                              <div className="w-5 h-5 border-2 border-slate-400 border-t-blue-500 rounded-full animate-spin"></div>
                            ) : (
                              <Paperclip size={20} />
                            )}
                          </button>
                          
                          <input
                            type="text"
                            value={inputText}
                            onChange={(e) => { setInputText(e.target.value); handleTyping(); }}
                            placeholder={t('messagePlaceholder')}
                            className="aero-input flex-1 px-3 py-2 rounded shadow-inner text-sm"
                          />
                          
                          <div className="relative">
                            <button 
                              type="button"
                              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                              className="p-2 text-slate-600 hover:text-yellow-600 transition-colors bg-white/50 rounded border border-white hover:bg-white flex items-center justify-center w-10 h-10"
                            >
                              <Smile size={20} />
                            </button>
                            {showEmojiPicker && (
                              <div className="absolute bottom-12 right-0 bg-white border border-slate-300 shadow-xl rounded p-2 grid grid-cols-5 gap-1 w-48 z-50 animate-gentle-fade-in-up">
                                {EMOJIS.map(emoji => (
                                  <button key={emoji} type="button" onClick={() => handleAddEmoji(emoji)} className="text-xl hover:bg-slate-100 rounded p-1">{emoji}</button>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          {inputText.trim() ? (
                            <button type="submit" className="aero-btn px-4 flex items-center justify-center w-12 h-10" title={t('send')}>
                              {editingMessageId ? <Check size={18} /> : <Send size={18} />}
                            </button>
                          ) : (
                            <button 
                              type="button" 
                              onClick={startRecording} 
                              className="aero-btn px-4 flex items-center justify-center w-12 h-10 shadow-sm" 
                              title={t('record')}
                            >
                              <Mic size={18} />
                            </button>
                          )}
                        </form>
                      )}
                    </div>
                  </>
                ) : (
                  // Empty State
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                    <div className="w-24 h-24 mb-4 opacity-50 bg-gradient-to-br from-blue-300 to-transparent rounded-full flex items-center justify-center border-4 border-white shadow-inner">
                      <Smile size={48} className="text-blue-500" />
                    </div>
                    <p className="font-semibold text-lg" style={{ textShadow: '0 1px 0 rgba(255,255,255,0.8)' }}>
                      {t('selectChat')}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* GADGETS SIDEBAR */}
            {showGadgets && (
              <div className="absolute top-8 right-0 bottom-0 w-60 gadget-sidebar p-4 flex flex-col gap-4 z-20 animate-gentle-fade-in-up overflow-y-auto">
                {/* Clock Gadget */}
                <div className="gadget-item p-3 flex flex-col items-center justify-center aspect-square">
                  <Clock size={48} className="text-slate-800 drop-shadow-md mb-2" />
                  <div className="text-xl font-bold text-slate-800" style={{textShadow: '0 1px 0 rgba(255,255,255,0.8)'}}>
                    {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
                
                {/* CPU Gadget */}
                <div className="gadget-item p-3">
                  <div className="flex items-center gap-2 mb-2 text-slate-800 font-bold text-xs">
                    <Cpu size={16} /> CPU Usage
                  </div>
                  <div className="w-full bg-slate-300/50 rounded-full h-3 border border-slate-400/50 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-400 to-red-500 transition-all duration-500" style={{width: `${cpuUsage}%`}}></div>
                  </div>
                  <div className="text-right text-xs font-mono mt-1">{Math.round(cpuUsage)}%</div>
                </div>
                
                {/* Sticky Notes Gadget */}
                <div className="gadget-item p-0 overflow-hidden bg-[#fff9c4] border-[#fbc02d]">
                  <div className="bg-[#fbc02d]/20 p-1 border-b border-[#fbc02d]/30 flex justify-between items-center px-2">
                    <span className="text-[10px] font-bold text-[#5d4037]">Notes</span>
                    <Plus size={10} className="text-[#5d4037] cursor-pointer"/>
                  </div>
                  <textarea 
                    className="w-full h-32 bg-transparent resize-none p-2 text-xs text-[#5d4037] focus:outline-none font-handwriting"
                    value={gadgetNotes}
                    onChange={(e) => { setGadgetNotes(e.target.value); localStorage.setItem('aero_notes', e.target.value); }}
                    placeholder="Type a note..."
                  />
                </div>
              </div>
            )}

            {/* PROFILE MODAL (Windows Media Player Settings Style) */}
            {viewProfileId && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                <div className="aero-window w-full max-w-[400px] m-4 shadow-2xl animate-gentle-fade-in-up border border-white/80">
                  <div className="aero-titlebar cursor-move">
                    <span className="aero-title-text flex items-center gap-2">
                      {t('properties')}: {isMyProfile ? t('myProfile') : t('userProfile')}
                    </span>
                    <div className="ml-auto flex gap-1">
                      <div className="win-control win-close" onClick={() => setViewProfileId(null)}><X size={12} color="white" /></div>
                    </div>
                  </div>
                  
                  <div className="bg-white/90 p-4">
                    <div className="flex gap-1 border-b border-slate-300 mb-4 px-1">
                      <div onClick={() => setActiveTab('general')} className={`px-3 py-1 border border-slate-300 rounded-t text-sm font-semibold -mb-px z-10 cursor-pointer ${activeTab === 'general' ? 'bg-white border-b-transparent' : 'bg-slate-100 text-slate-500'}`}>{t('general')}</div>
                      <div onClick={() => setActiveTab('media')} className={`px-3 py-1 border border-slate-300 rounded-t text-sm font-semibold -mb-px z-10 cursor-pointer ${activeTab === 'media' ? 'bg-white border-b-transparent' : 'bg-slate-100 text-slate-500'}`}>{t('mediaExplorer')}</div>
                    </div>
                    
                    {activeTab === 'general' ? (
                      <div className="flex gap-4">
                        <div className="w-24 flex flex-col items-center shrink-0">
                          <img src={profileData.avatar} alt="Avatar" className="w-20 h-20 bg-white border border-slate-300 p-1 shadow-sm mb-2 object-cover shine-effect" />
                          <div className="flex items-center gap-1 text-[10px] text-slate-600 font-semibold mt-1">
                             <div className={`w-2 h-2 status-dot status-${profileData.status}`}></div>
                             {getStatusText(profileData.status)}
                          </div>
                        </div>
                        <div className="flex-1 space-y-3 min-w-0">
                          <div>
                            <label className="text-xs text-slate-600 block mb-1">{t('username')}</label>
                            <input type="text" readOnly defaultValue={profileData.name} className="aero-input w-full text-sm px-2 py-1 rounded-sm bg-slate-100 text-slate-500" />
                          </div>
                          
                          {isMyProfile ? (
                            <>
                              <div>
                                <label className="text-xs text-slate-600 block mb-1">{t('avatarUrl')}</label>
                                <input 
                                  type="text" 
                                  value={myAvatarUrl}
                                  onChange={(e) => setMyAvatarUrl(e.target.value)}
                                  placeholder="https://example.com/image.jpg"
                                  className="aero-input w-full text-sm px-2 py-1 rounded-sm" 
                                />
                              </div>
                              <div>
                                <label className="text-xs text-slate-600 block mb-1">{t('textStatus')}</label>
                                <input 
                                  type="text" 
                                  value={myCustomStatus}
                                  onChange={(e) => setMyCustomStatus(e.target.value)}
                                  placeholder={t('statusPlaceholder')}
                                  className="aero-input w-full text-sm px-2 py-1 rounded-sm" 
                                />
                              </div>
                              <div className="flex gap-2">
                                <div className="flex-1">
                                  <label className="text-xs text-slate-600 block mb-1">{t('status')}</label>
                                  <select 
                                    value={myStatus}
                                    onChange={(e) => setMyStatus(e.target.value)}
                                    className="aero-input w-full text-sm px-2 py-1 rounded-sm"
                                  >
                                    <option value="online">{t('online')}</option>
                                    <option value="away">{t('away')}</option>
                                    <option value="dnd">{t('dnd')}</option>
                                    <option value="invisible">{t('invisible')}</option>
                                  </select>
                                </div>
                                <div className="flex-1">
                                  <label className="text-xs text-slate-600 block mb-1">{t('theme')}</label>
                                  <div className="flex items-center gap-1">
                                    <Palette size={14} className="text-slate-500"/>
                                    <select value={currentTheme} onChange={(e) => setCurrentTheme(e.target.value)} className="aero-input w-full text-sm px-2 py-1 rounded-sm">
                                      {Object.entries(THEMES).map(([key, val]) => <option key={key} value={key}>{val.name}</option>)}
                                    </select>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <label className="text-xs text-slate-600 block mb-1">{t('soundScheme')}</label>
                                <div className="flex items-center gap-1">
                                  <Volume2 size={14} className="text-slate-500"/>
                                  <select value={currentSoundScheme} onChange={(e) => setCurrentSoundScheme(e.target.value)} className="aero-input w-full text-sm px-2 py-1 rounded-sm">
                                    {Object.entries(SOUND_SCHEMES).map(([key, name]) => <option key={key} value={key}>{name}</option>)}
                                  </select>
                                </div>
                              </div>
                            </>
                          ) : (
                             <div className="text-sm text-slate-600 p-2 bg-slate-100 border border-slate-200 rounded">
                               {t('viewingOtherProfile')}
                               {profileData.customStatus && (
                                 <div className="mt-2 font-semibold italic">"{profileData.customStatus}"</div>
                               )}
                             </div>
                          )}
                          
                          <div className="text-xs text-slate-500 mt-2">
                            ID: <span className="font-mono text-[10px] bg-slate-200 px-1 rounded truncate block mt-1">{profileData.id}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // --- Media Explorer Tab ---
                      <div className="h-64 overflow-y-auto bg-white border border-slate-300 rounded p-2">
                        {activeChatId ? (
                          <div className="grid grid-cols-3 gap-2">
                            {(messages[activeChatId] || []).filter(m => m.type === 'image').map(m => (
                              <div key={m.id} className="aspect-square border border-slate-200 rounded overflow-hidden cursor-pointer hover:opacity-80" onClick={() => setViewingMessage(m)}>
                                <img src={m.imageUrl} className="w-full h-full object-cover" />
                              </div>
                            ))}
                            {(messages[activeChatId] || []).filter(m => m.type === 'image').length === 0 && (
                              <div className="col-span-3 text-center text-slate-500 text-sm py-4">{t('noMessages')}</div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center text-slate-500 text-sm py-4">{t('selectChat')}</div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3 bg-slate-100/50 border-t border-white flex justify-end gap-2">
                    {isMyProfile && (
                      <button onClick={handleLogout} className="aero-btn px-4 py-1.5 text-sm mr-auto" style={{background: 'linear-gradient(180deg, #ff8c8c 0%, #e81123 100%)', borderColor: '#c3000f'}}>{t('logout')}</button>
                    )}
                    {!isMyProfile && (
                      <button onClick={() => handleStartDM(profileData.id)} className="aero-btn px-4 py-1.5 text-sm mr-auto">{t('writeMessage')}</button>
                    )}
                    <button onClick={handleSaveProfile} className="aero-btn px-4 py-1.5 text-sm min-w-[80px]">{t('save')}</button>
                    <button onClick={() => setViewProfileId(null)} className="aero-btn px-4 py-1.5 text-sm min-w-[80px]">
                        {isMyProfile ? t('cancel') : t('close')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* CALL MODAL */}
            {activeCallRoom && (
              <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-2 sm:p-6">
                <div className="aero-window w-full h-full md:max-w-6xl md:max-h-[800px] flex flex-col shadow-2xl animate-gentle-fade-in-up border border-white/80 overflow-hidden">
                  <div className="aero-titlebar cursor-move">
                    <span className="aero-title-text flex items-center gap-2">
                      <Phone size={14} className="text-blue-700" />
                      {t('conference')}: {chats.find(c => c.id === activeCallChatId)?.name || t('personalCall')}
                    </span>
                    <div className="ml-auto flex gap-1">
                      <div className="win-control win-close" onClick={() => window.location.reload()} title="Force Close"><X size={12} color="white" /></div>
                    </div>
                  </div>
                  
                  <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
                    {/* Remote Video */}
                    <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-contain" />
                    
                    {/* Local Video (PIP) */}
                    <div className="absolute bottom-4 right-4 w-32 h-24 bg-slate-800 border-2 border-white/50 rounded shadow-lg overflow-hidden z-20">
                      <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                    </div>

                    {/* Status Overlay */}
                    {callStatus !== 'connected' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10">
                        <div className="text-white font-bold animate-pulse text-xl">{callStatus === 'waiting' ? 'Ожидание собеседника...' : 'Соединение...'}</div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3 bg-gradient-to-t from-slate-200 to-white border-t border-white flex justify-center gap-4 glass-panel">
                    <button onClick={() => setActiveCallRoom(null)} className="aero-btn px-8 py-2 font-bold flex items-center gap-2 text-base shadow-md" style={{background: 'linear-gradient(180deg, #ff8c8c 0%, #e81123 100%)', borderColor: '#c3000f'}}>
                      <Phone size={18} className="rotate-[135deg]" /> {t('hangup')}
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* CREATE GROUP MODAL */}
            {showGroupModal && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                <div className="aero-window w-full max-w-[350px] m-4 shadow-2xl animate-gentle-fade-in-up border border-white/80">
                  <div className="aero-titlebar">
                    <span className="aero-title-text flex items-center gap-2">{t('createGroup')}</span>
                    <div className="ml-auto flex gap-1">
                      <div className="win-control win-close" onClick={() => setShowGroupModal(false)}><X size={12} color="white" /></div>
                    </div>
                  </div>
                  <div className="p-4 bg-white/90">
                    <div className="mb-4">
                      <label className="block text-xs font-bold text-slate-700 mb-1">{t('groupName')}</label>
                      <input type="text" value={newGroupName} onChange={e => setNewGroupName(e.target.value)} className="aero-input w-full px-2 py-1 rounded" placeholder={t('groupNamePlaceholder')} />
                    </div>
                    <div className="mb-4">
                      <label className="block text-xs font-bold text-slate-700 mb-1">{t('participants')}</label>
                      <div className="h-32 overflow-y-auto border border-slate-300 bg-white rounded p-1">
                        {Object.entries(usersData).filter(([uid]) => uid !== user.uid).map(([uid, u]) => (
                          <label key={uid} className="flex items-center gap-2 p-1 hover:bg-blue-50 cursor-pointer rounded">
                            <input 
                              type="checkbox" 
                              checked={selectedUsersForGroup.includes(uid)}
                              onChange={(e) => {
                                if (e.target.checked) setSelectedUsersForGroup([...selectedUsersForGroup, uid]);
                                else setSelectedUsersForGroup(selectedUsersForGroup.filter(id => id !== uid));
                              }}
                            />
                            <span className="text-sm">{u.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <button onClick={handleCreateGroup} className="aero-btn w-full py-1.5 font-bold">{t('create')}</button>
                  </div>
                </div>
              </div>
            )}

            {/* ADMIN PANEL */}
            {showAdminPanel && (
              <div className="absolute inset-0 z-[300] flex items-center justify-center bg-black/20 backdrop-blur-sm">
                <div className="aero-window w-full max-w-2xl h-[500px] max-h-[80vh] m-4 shadow-2xl animate-gentle-fade-in-up border border-white/80 flex flex-col">
                  <div className="aero-titlebar">
                    <span className="aero-title-text flex items-center gap-2"><Shield size={14} className="text-red-600"/> Панель Администратора</span>
                    <div className="ml-auto"><div className="win-control win-close" onClick={() => setShowAdminPanel(false)}><X size={12} color="white" /></div></div>
                  </div>
                  <div className="flex-1 bg-white/90 p-4 overflow-y-auto">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-300">
                          <th className="p-2">Пользователь</th>
                          <th className="p-2">Email</th>
                          <th className="p-2">Статус</th>
                          <th className="p-2">Действия</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(usersData).map(([uid, u]) => (
                          <tr key={uid} className="border-b border-slate-100 hover:bg-blue-50">
                            <td className="p-2 flex items-center gap-2">
                              <img src={u.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${uid}`} className="w-6 h-6 rounded-full border border-slate-300"/>
                              <span className="font-bold text-slate-700">{u.name}</span>
                            </td>
                            <td className="p-2 text-slate-600">{u.email || '-'}</td>
                            <td className="p-2">
                                {u.isBanned ? (
                                  <div className="flex flex-col">
                                    <span className="text-red-600 font-bold">Забанен</span>
                                    <span className="text-[10px] text-slate-500 max-w-[150px] truncate" title={u.banReason}>{u.banReason}</span>
                                  </div>
                                ) : <span className="text-green-600">Активен</span>}
                            </td>
                            <td className="p-2">
                              {uid !== user.uid && (
                                <button 
                                  onClick={() => toggleBan(uid, u.isBanned)}
                                  className={`px-2 py-1 rounded text-xs font-bold text-white shadow-sm ${u.isBanned ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
                                >
                                  {u.isBanned ? 'Разбанить' : 'Забанить'}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* RECYCLE BIN MODAL */}
            {showRecycleBin && (
              <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm">
                <div className="aero-window w-full max-w-[500px] m-4 shadow-2xl animate-gentle-fade-in-up border border-white/80 h-[400px] flex flex-col">
                  <div className="aero-titlebar">
                    <span className="aero-title-text flex items-center gap-2"><Trash size={14}/> {t('recycleBin')}</span>
                    <div className="ml-auto"><div className="win-control win-close" onClick={() => setShowRecycleBin(false)}><X size={12} color="white" /></div></div>
                  </div>
                  <div className="flex-1 bg-white/90 p-2 overflow-y-auto">
                    {(messages[activeChatId] || []).filter(m => m.deletedAt).length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-slate-500">
                        <Trash size={48} className="opacity-20 mb-2"/>
                        <p>{t('noMessages')}</p>
                      </div>
                    ) : (
                      (messages[activeChatId] || []).filter(m => m.deletedAt).map(msg => (
                        <div key={msg.id} className="flex items-center justify-between p-2 border-b border-slate-200 hover:bg-red-50">
                          <div className="flex-1 truncate text-sm">
                            <span className="font-bold text-slate-700">{msg.senderName}:</span> {msg.text || 'Media'}
                            <div className="text-[10px] text-slate-400">Deleted: {new Date(msg.deletedAt).toLocaleTimeString()}</div>
                          </div>
                          <div className="flex gap-1">
                            <button onClick={() => restoreMessage(msg.id)} className="p-1 hover:bg-green-100 rounded text-green-600" title={t('restore')}><RefreshCw size={14}/></button>
                            <button onClick={() => permanentDeleteMessage(msg.id)} className="p-1 hover:bg-red-100 rounded text-red-600" title={t('deleteForever')}><X size={14}/></button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-2 bg-slate-100 border-t border-slate-300 flex justify-end">
                    <button onClick={emptyRecycleBin} className="aero-btn px-4 py-1 text-xs flex items-center gap-1"><Trash2 size={12}/> {t('emptyBin')}</button>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW MESSAGE MODAL */}
            {viewingMessage && (
              <div className="absolute inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setViewingMessage(null)}>
                <div className="aero-window w-full max-w-4xl max-h-[90vh] m-4 flex flex-col shadow-2xl animate-gentle-fade-in-up" onClick={e => e.stopPropagation()}>
                  <div className="aero-titlebar">
                    <span className="aero-title-text flex items-center gap-2">{t('viewMessage')}</span>
                    <div className="ml-auto"><div className="win-control win-close" onClick={() => setViewingMessage(null)}><X size={12} color="white" /></div></div>
                  </div>
                  <div className="flex-1 overflow-auto p-8 bg-white/90 flex flex-col items-center justify-center relative">
                    {viewingMessage.type === 'image' ? (
                       <img src={viewingMessage.imageUrl} className="max-w-full max-h-full object-contain shadow-lg rounded" />
                    ) : (
                       <div className="text-xl text-slate-800 whitespace-pre-wrap text-center font-medium max-w-2xl">{viewingMessage.text}</div>
                    )}
                    <div className="mt-6 text-sm text-slate-500">
                      {t('sentBy')}: {viewingMessage.senderName} • {viewingMessage.time}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </>
  );
}