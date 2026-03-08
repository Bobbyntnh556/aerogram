import React, { useState, useEffect, useRef } from 'react';
import { User, Settings, Send, Paperclip, Smile, X, Maximize, Minus, Users, Phone, Video, Mic, Square, Play, Pause, Edit2, Trash2, Reply, Plus, Image as ImageIcon, MoreVertical, Check, ArrowLeft, Globe, StickyNote, FileText, Music, Search, Palette, Volume2, ExternalLink, RefreshCw, Cpu, Clock, Award, Volume1, VolumeX, Trash, Shield, Ban, Brush, Heart, ThumbsUp, Laugh } from 'lucide-react';
import Peer from 'peerjs';

// --- Firebase Imports ---
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, onSnapshot, addDoc, getDoc, deleteDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

// --- Firebase Initialization ---
const getEnvVar = (key, fallback) => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return fallback;
};

const firebaseConfig = {
  apiKey: getEnvVar('REACT_APP_FIREBASE_API_KEY', "AIzaSyCGhS6xM3WQYocSyOtY2hSwOyRMc_pqPC4"),
  authDomain: getEnvVar('REACT_APP_FIREBASE_AUTH_DOMAIN', "aerogram-362b4.firebaseapp.com"),
  projectId: getEnvVar('REACT_APP_FIREBASE_PROJECT_ID', "aerogram-362b4"),
  storageBucket: getEnvVar('REACT_APP_FIREBASE_STORAGE_BUCKET', "aerogram-362b4.firebasestorage.app"),
  messagingSenderId: getEnvVar('REACT_APP_FIREBASE_MESSAGING_SENDER_ID', "494278053383"),
  appId: getEnvVar('REACT_APP_FIREBASE_APP_ID', "1:494278053383:web:5cb0bdaba459f20108e4a2")
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = 'aerogram-custom';
const ADMIN_EMAIL = getEnvVar('REACT_APP_ADMIN_EMAIL', 'gaymomentispravitmoment@gmail.com');

// --- Constants ---
const WALLPAPERS = [
  { name: 'По умолчанию', url: '' },
  { name: 'Безмятежность', url: 'https://upload.wikimedia.org/wikipedia/en/2/27/Bliss_%28Windows_XP%29.png' },
  { name: 'Осень', url: 'https://preview.redd.it/finally-windows-xps-autumn-wallpaper-in-full-res-4200x2800-v0-3ma6nhepxbb81.jpg?width=1080&crop=smart&auto=webp&s=e3747c3ccf8c439969200d2d67fb06d3f3738138' },
  { name: 'Аэро', url: 'https://i.pinimg.com/originals/32/f6/ca/32f6ca603f286090a5716109218c9679.jpg' },
  { name: 'Звездное небо', url: 'https://avatars.mds.yandex.net/i?id=ead27b78b7e7ce55749fb98102ba3f77_l-5889364-images-thumbs&n=13' }
];

const EMOJIS = ['😀', '😂', '😍', '😎', '😭', '😡', '👍', '👎', '🎉', '❤️', '🔥', '💩', '🤔', '👋', '🙏', '💪', '👻', '💀', '👀', '✨'];
const REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '😡'];

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
    record: 'Записать голос',
    cancel: 'Отмена',
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
    pinMessage: 'Закрепить',
    unpinMessage: 'Открепить',
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
    soundMixer: 'Микшер громкости',
    draw: 'Нарисовать'
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
    record: 'Record voice',
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
    pinMessage: 'Pin',
    unpinMessage: 'Unpin',
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
    soundMixer: 'Volume Mixer',
    draw: 'Draw'
  }
};

// --- CSS Styles for Frutiger Aero / Windows 7 Glass ---
const aeroStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Segoe+UI:wght@400;600&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
  }

  :root {
    --aero-glass: rgba(220, 235, 250, 0.45);
    --aero-border: rgba(255, 255, 255, 0.6);
    --aero-highlight: rgba(255, 255, 255, 0.9);
  }

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

  /* Base window styling */
  .aero-window {
    background: var(--aero-glass);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid var(--aero-border);
    box-shadow: 
      inset 0 0 0 1px rgba(255,255,255,0.4),
      inset 0 0 20px rgba(255,255,255,0.3),
      0 12px 40px rgba(0,0,0,0.3);
    overflow: hidden;
  }

  .aero-titlebar {
    background: linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 100%);
    border-bottom: 1px solid rgba(255,255,255,0.5);
    box-shadow: inset 0 1px 0 var(--aero-highlight);
    height: 36px;
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

  .win-control {
    width: 32px;
    height: 20px;
    border: 1px solid rgba(0,0,0,0.2);
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.5);
    cursor: pointer;
    margin-left: 2px;
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

  ::-webkit-scrollbar { width: 8px; height: 8px; }
  ::-webkit-scrollbar-track { background: rgba(255,255,255,0.2); box-shadow: inset 0 0 6px rgba(0,0,0,0.1); }
  ::-webkit-scrollbar-thumb { 
    background: linear-gradient(90deg, #e0e0e0 0%, #bfbfbf 50%, #d0d0d0 100%); 
    border: 1px solid #999; 
    border-radius: 6px; 
  }
  ::-webkit-scrollbar-thumb:hover { background: linear-gradient(90deg, #f0f0f0 0%, #cfcfcf 50%, #e0e0e0 100%); }

  .glass-panel {
    background: rgba(255, 255, 255, 0.3);
    border: 1px solid rgba(255,255,255,0.4);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.6);
  }

  .status-dot {
    border-radius: 50%;
    border: 1px solid;
  }
  .status-online { background: radial-gradient(circle at 30% 30%, #7cfc00, #32cd32); border-color: #228b22; box-shadow: 0 0 4px #32cd32, inset 0 1px 1px rgba(255,255,255,0.8); }
  .status-away { background: radial-gradient(circle at 30% 30%, #fff59d, #fbc02d); border-color: #f57f17; box-shadow: 0 0 4px #fbc02d, inset 0 1px 1px rgba(255,255,255,0.8); }
  .status-dnd { background: radial-gradient(circle at 30% 30%, #ef9a9a, #e53935); border-color: #b71c1c; box-shadow: 0 0 4px #e53935, inset 0 1px 1px rgba(255,255,255,0.8); }
  .status-invisible { background: radial-gradient(circle at 30% 30%, #e0e0e0, #9e9e9e); border-color: #616161; box-shadow: 0 0 4px #9e9e9e, inset 0 1px 1px rgba(255,255,255,0.8); }

  .aero-badge {
    background: linear-gradient(180deg, #ff6b6b 0%, #d81b1b 100%);
    border: 1px solid #a30b0b;
    box-shadow: inset 0 1px 1px rgba(255,255,255,0.6), 0 1px 2px rgba(0,0,0,0.3);
    color: white;
    text-shadow: 0 1px 1px rgba(0,0,0,0.4);
  }

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
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: linear-gradient(180deg, #ffffff 0%, #dcdcdc 50%, #b8b8b8 51%, #f0f0f0 100%);
    border: 1px solid #777;
    box-shadow: inset 0 1px 1px white, 0 1px 2px rgba(0,0,0,0.4);
    cursor: pointer;
  }
  input[type=range].aero-slider:focus {
    outline: none;
  }

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
  
  .sticky-note {
    background: linear-gradient(180deg, #fff9c4 0%, #fff59d 100%);
    border: 1px solid #fbc02d;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    color: #5d4037;
  }

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
  
  .reaction-pill {
    background: rgba(255,255,255,0.9); border: 1px solid #cbd5e1; border-radius: 12px;
    padding: 2px 6px; font-size: 11px; display: inline-flex; align-items: center; gap: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1); cursor: pointer; transition: transform 0.1s;
  }
  .reaction-pill:hover { transform: scale(1.1); }

  /* --- Mobile Optimization Classes --- */
  
  /* Draggable Modal Adaptation for Mobile */
  .draggable-modal {
    left: var(--drag-x);
    top: var(--drag-y);
    width: var(--drag-w);
    height: var(--drag-h);
  }
  
  @media (max-width: 767px) {
    .aero-peek-popup { display: none !important; }
    
    .draggable-modal {
      position: fixed !important;
      left: 0 !important;
      top: 0 !important;
      width: 100% !important;
      height: 100% !important;
      height: 100dvh !important;
      max-width: none !important;
      max-height: none !important;
      border-radius: 0 !important;
      z-index: 1000 !important;
      transform: none !important;
    }

    /* Force full-screen windows to feel native */
    .mobile-fullscreen-app {
      border-radius: 0 !important;
      border: none !important;
      width: 100% !important;
      height: 100% !important;
      height: 100dvh !important;
      max-width: none !important;
    }

    /* Slightly larger chat bubbles on mobile for readability */
    .bubble-self, .bubble-other {
      max-width: 85% !important;
    }
  }
`;

// --- Initial Seed Data ---
const initialChatsSeed = [
  { id: '1', name: 'Общий чат (Public)', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Aero', isGroup: true, order: 1 }
];

// --- Web Audio API for Win7 System Sounds ---
const playSystemSound = (type = 'notify', scheme = 'xp', volume = 0.5) => {
  try {
    const vol = Math.max(0, Math.min(1, volume));

    // Используем звуки Skype, как просил пользователь!
    if (type === 'notify') {
      const audio = new Audio('https://www.myinstants.com/media/sounds/skype-message.mp3');
      audio.volume = vol;
      audio.play().catch(() => {});
      return;
    }

    // Оставляем генерацию звуков для входа и корзины
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    const baseFreq = scheme === 'xp' ? 880 : (scheme === 'vista' ? 600 : 1000);

    if (type === 'login') {
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

const AeroAudioPlayer = ({ src, isLiveStream = false }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log(e));
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
    if (isLiveStream) return;
    const time = Number(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  return (
    <div className="flex items-center gap-2 bg-gradient-to-b from-white/80 to-white/40 border border-white/80 p-1.5 rounded-full shadow-sm w-full max-w-[240px] backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
      <button 
        onClick={togglePlay} 
        className="w-8 h-8 rounded-full aero-btn flex items-center justify-center shrink-0 shadow-md"
        title={isPlaying ? "Пауза" : "Воспроизвести"}
      >
        {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
      </button>
      
      {isLiveStream ? (
        <div className="flex-1 flex items-center justify-center px-1">
          <span className="text-[10px] font-bold text-red-600 animate-pulse tracking-widest drop-shadow-sm" style={{textShadow: '0 1px 0 rgba(255,255,255,0.8)'}}>● LIVE</span>
        </div>
      ) : (
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
      )}
      
      {!isLiveStream && (
        <span className="text-[10px] text-slate-700 font-bold w-7 text-right shrink-0 select-none" style={{ textShadow: '0 1px 0 rgba(255,255,255,0.8)' }}>
          {formatAudioTime(currentTime)}
        </span>
      )}
      
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

// --- Helper Components for Modals & MS Paint ---
const DraggableWindow = ({ title, icon: Icon, onClose, children, initialPos = { x: 50, y: 50 }, width = 450, height = 'auto', zIndex = 50 }) => {
  const [pos, setPos] = useState(initialPos);
  const [isDragging, setIsDragging] = useState(false);
  const [rel, setRel] = useState({ x: 0, y: 0 });

  const onMouseDown = (e) => {
    if (e.target.closest('.win-control') || window.innerWidth < 768) return;
    setIsDragging(true);
    setRel({ x: e.clientX - pos.x, y: e.clientY - pos.y });
  };

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!isDragging || window.innerWidth < 768) return;
      setPos({ x: e.clientX - rel.x, y: e.clientY - rel.y });
    };
    const onMouseUp = () => setIsDragging(false);

    if (isDragging) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, rel]);

  return (
    <div 
      className="absolute aero-window shadow-2xl flex flex-col animate-gentle-fade-in-up border border-white/80 draggable-modal"
      style={{ position: 'absolute', '--drag-x': `${pos.x}px`, '--drag-y': `${pos.y}px`, '--drag-w': typeof width === 'number' ? `${width}px` : width, '--drag-h': height, zIndex }}
    >
      <div className="aero-titlebar cursor-move" onMouseDown={onMouseDown}>
        <span className="aero-title-text flex items-center gap-2">
          {Icon && <Icon size={14} className="text-blue-700" />} {title}
        </span>
        <div className="ml-auto">
          <div className="win-control win-close" onClick={onClose}><X size={14} color="white" /></div>
        </div>
      </div>
      <div className="flex-1 bg-white/90 overflow-hidden flex flex-col relative z-10">
        {children}
      </div>
    </div>
  );
};

const PaintApp = ({ onSend, onClose }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Fit canvas to screen on mobile
    const fitCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = Math.min(parent.clientWidth - 16, 600);
        canvas.height = Math.min(parent.clientHeight - 16, 400);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    };
    
    fitCanvas();
    window.addEventListener('resize', fitCanvas);
    return () => window.removeEventListener('resize', fitCanvas);
  }, []);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    if(e.cancelable) e.preventDefault();
    setIsDrawing(true);
    const coords = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  };
  
  const draw = (e) => {
    if (!isDrawing) return;
    if(e.cancelable) e.preventDefault();
    const coords = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = color;
    
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };
  
  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleSend = () => {
    if (canvasRef.current) {
      onSend(canvasRef.current.toDataURL('image/png'));
      onClose();
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-100 border-b border-slate-300 shadow-sm">
        <div className="flex gap-2">
          {['#000000', '#ff0000', '#0000ff', '#008000', '#ffff00', '#ffa500'].map(c => (
            <button key={c} onClick={() => setColor(c)} className={`w-8 h-8 rounded-full border-2 ${color === c ? 'border-slate-800 scale-110 shadow-md' : 'border-slate-300'}`} style={{backgroundColor: c}} />
          ))}
        </div>
        <div className="w-px h-8 bg-slate-300 mx-1 hidden md:block"></div>
        <input type="range" min="1" max="25" value={brushSize} onChange={(e) => setBrushSize(e.target.value)} className="w-24 md:w-32 aero-slider flex-1 md:flex-none" />
        <div className="w-px h-8 bg-slate-300 mx-1 hidden md:block"></div>
        <div className="flex gap-2 ml-auto w-full md:w-auto justify-end mt-2 md:mt-0">
          <button onClick={clearCanvas} className="aero-btn px-4 py-2 text-sm font-semibold">Очистить</button>
          <button onClick={handleSend} className="aero-btn px-4 py-2 text-sm font-bold flex items-center gap-2"><Send size={16}/> Отправить</button>
        </div>
      </div>
      <div className="flex-1 bg-slate-200 p-2 overflow-hidden flex items-center justify-center">
        <canvas 
          ref={canvasRef} 
          onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing}
          onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing}
          className="bg-white shadow-md border border-slate-300 rounded touch-none cursor-crosshair"
        />
      </div>
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
  
  const [viewProfileId, setViewProfileId] = useState(null);
  
  const [myAvatarUrl, setMyAvatarUrl] = useState('');
  const [myStatus, setMyStatus] = useState('online');
  const [myCustomStatus, setMyCustomStatus] = useState('');
  const [usersData, setUsersData] = useState({});
  
  const [searchQuery, setSearchQuery] = useState('');

  const [activeCallChatId, setActiveCallChatId] = useState(null);
  const [activeCallRoom, setActiveCallRoom] = useState(null);
  const [isCallVideo, setIsCallVideo] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  
  const [callStatus, setCallStatus] = useState('idle');
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const lastTypingRef = useRef(0);

  const [chatWallpaper, setChatWallpaper] = useState(localStorage.getItem('aero_wallpaper') || '');
  const [showWallpaperMenu, setShowWallpaperMenu] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedUsersForGroup, setSelectedUsersForGroup] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeMenuMsgId, setActiveMenuMsgId] = useState(null);
  const [viewingMessage, setViewingMessage] = useState(null);
  const [language, setLanguage] = useState('ru');
  const t = (key) => TRANSLATIONS[language][key] || key;
  
  const [currentTheme, setCurrentTheme] = useState('blue');
  const [currentSoundScheme, setCurrentSoundScheme] = useState('win7');
  const [hoveredChatId, setHoveredChatId] = useState(null);
  const [activeTab, setActiveTab] = useState('general');
  const [isDragOver, setIsDragOver] = useState(false);
  
  const [showGadgets, setShowGadgets] = useState(false);
  const [showRecycleBin, setShowRecycleBin] = useState(false);
  const [gadgetNotes, setGadgetNotes] = useState(localStorage.getItem('aero_notes') || '');
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showPaint, setShowPaint] = useState(false);
  const [cpuUsage, setCpuUsage] = useState(15);
  
  const [volumes, setVolumes] = useState({ notify: 0.5, call: 0.5, system: 0.3 });
  const [timeTick, setTimeTick] = useState(0);

  const [startupSoundPlayed, setStartupSoundPlayed] = useState(false);
  const [lastProcessedMsgId, setLastProcessedMsgId] = useState(null);

  useEffect(() => {
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      setActiveChatId(params.get('chat') || null);
      setViewProfileId(params.get('profile') || null);
    };
    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    
    const params = new URLSearchParams(window.location.search);
    let hasChanges = false;

    if (activeChatId) {
      if (params.get('chat') !== activeChatId) {
        params.set('chat', activeChatId);
        hasChanges = true;
      }
    } else if (params.has('chat')) {
      params.delete('chat');
      hasChanges = true;
    }

    if (viewProfileId) {
      if (params.get('profile') !== viewProfileId) {
        params.set('profile', viewProfileId);
        hasChanges = true;
      }
    } else if (params.has('profile')) {
      params.delete('profile');
      hasChanges = true;
    }

    if (hasChanges) {
      const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
      window.history.pushState({}, '', newUrl);
    }
  }, [activeChatId, viewProfileId, isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn && !startupSoundPlayed) {
      const playStartup = () => {
        const audio = new Audio('https://www.myinstants.com/media/sounds/windows-7-startup.mp3');
        audio.volume = volumes.system || 0.5;
        
        audio.play()
          .then(() => setStartupSoundPlayed(true))
          .catch(e => {
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

  useEffect(() => {
    if (!isLoggedIn || !user) return;
    const allMessages = Object.values(messages).flat();
    if (allMessages.length === 0) return;

    const newestMsg = allMessages.reduce((prev, current) => (prev.timestamp > current.timestamp) ? prev : current);

    if (newestMsg && newestMsg.id !== lastProcessedMsgId) {
      setLastProcessedMsgId(newestMsg.id);
      const isNew = (Date.now() - newestMsg.timestamp) < 5000;
      if (isNew && newestMsg.senderId !== user.uid) {
        playSystemSound('notify', currentSoundScheme, volumes.notify);
      }
    }
  }, [messages, lastProcessedMsgId, user, currentSoundScheme, volumes.notify, isLoggedIn]);

  const getEffectiveStatus = (uid, uData) => {
    if (uid === user?.uid) return myStatus;
    if (!uData || !uData.lastSeen) return 'offline';
    if (Date.now() - uData.lastSeen > 120000) return 'offline';
    return uData.status || 'offline';
  };

  useEffect(() => {
    if (!user) return;
    const userRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', user.uid);
    
    const sendHeartbeat = async () => {
      try {
        await updateDoc(userRef, {
          lastSeen: Date.now(),
          status: myStatus
        });
      } catch (e) {
        console.error("Heartbeat failed", e);
      }
    };

    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, 30000);
    const tickInterval = setInterval(() => setTimeTick(t => t + 1), 60000);

    return () => {
      clearInterval(interval);
      clearInterval(tickInterval);
    };
  }, [user, myStatus]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
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

  useEffect(() => {
    if (!user || !isLoggedIn) return;

    const chatsRef = collection(db, 'artifacts', appId, 'public', 'data', 'chats');
    const unsubChats = onSnapshot(chatsRef, (snapshot) => {
      const fetchedChats = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      const visibleChats = fetchedChats.filter(c => c.isGroup || (c.participants && c.participants.includes(user.uid)));
      
      if (visibleChats.length === 0) {
        initialChatsSeed.forEach(async (c) => {
          await setDoc(doc(chatsRef, c.id), c);
        });
      } else {
        setChats(visibleChats);
      }
    }, console.error);

    const msgsRef = collection(db, 'artifacts', appId, 'public', 'data', 'messages');
    const unsubMsgs = onSnapshot(msgsRef, (snapshot) => {
      const msgs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      msgs.sort((a, b) => a.timestamp - b.timestamp);
      
      const grouped = {};
      msgs.forEach(m => {
        if (!grouped[m.chatId]) grouped[m.chatId] = [];
        grouped[m.chatId].push(m);
      });
      
      setMessages(grouped);
    }, console.error);

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

  useEffect(() => {
    if (!activeChatId || !user || chats.length === 0) return;
    const chatMsgs = messages[activeChatId] || [];
    if (chatMsgs.length === 0) return;
    
    const activeChatObj = chats.find(c => c.id === activeChatId);
    if (!activeChatObj) return;

    const myLastRead = activeChatObj.lastRead?.[user.uid] || 0;
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

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeChatId]);

  useEffect(() => {
    const theme = THEMES[currentTheme];
    const root = document.documentElement;
    root.style.setProperty('--aero-glass', theme.color);
    root.style.setProperty('--aero-border', theme.border);
    root.style.setProperty('--aero-highlight', theme.highlight);
    root.style.setProperty('--aero-bg', theme.bg);
  }, [currentTheme]);

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
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        currentUser = userCredential.user;

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
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        currentUser = userCredential.user;
        
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
    setStartupSoundPlayed(false);
  };

  const handleSendMessage = async (e, customType = null, customData = null) => {
    e?.preventDefault();
    if ((!inputText.trim() && !customData) || !activeChatId || !user) return;

    const msgsRef = collection(db, 'artifacts', appId, 'public', 'data', 'messages');

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
    
    await addDoc(msgsRef, {
      chatId: activeChatId,
      type: customType || 'text',
      text: customType ? null : inputText.trim(),
      imageUrl: customType === 'image' ? customData : null,
      replyTo: replyingTo ? { 
        id: replyingTo.id, 
        text: replyingTo.text || (replyingTo.type === 'image' ? `📷 ${t('image')}` : t('message')), 
        senderName: replyingTo.senderName 
      } : null,
      senderId: user.uid,
      senderName: loginName.trim(),
      timestamp: Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: {}
    });

    setInputText('');
    setReplyingTo(null);
  };
  
  const handleReaction = async (msgId, emoji) => {
    if (!user) return;
    const msgRef = doc(db, 'artifacts', appId, 'public', 'data', 'messages', msgId);
    const msg = messages[activeChatId].find(m => m.id === msgId);
    
    const hasReacted = msg.reactions && msg.reactions[emoji] && msg.reactions[emoji].includes(user.uid);
    
    await updateDoc(msgRef, {
      [`reactions.${emoji}`]: hasReacted ? arrayRemove(user.uid) : arrayUnion(user.uid)
    });
    setActiveMenuMsgId(null);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload({ target: { files: e.dataTransfer.files } });
    }
  };

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
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            reactions: {}
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
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            reactions: {}
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

  const handleStartCall = async (isVideo) => {
    if (!activeChatId || !user) return;
    const newCallId = `${activeChatId}_${Date.now()}`;
    
    setIsCallVideo(isVideo);
    const callDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'calls', newCallId);
    await setDoc(callDocRef, {
      hostId: user.uid,
      createdAt: Date.now(),
      isVideo: isVideo
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
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: {}
    });
    
    playSystemSound('notify', currentSoundScheme, volumes.notify);
  };

  useEffect(() => {
    if (!activeCallRoom || !user) return;
    
    let peer = null;
    let localStream = null;
    let unsubscribe = null;
    let cancelled = false;

    const startPeerCall = async () => {
      setCallStatus('connecting');

      try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: isCallVideo, audio: true });
        if (cancelled) {
          localStream.getTracks().forEach(track => track.stop());
          return;
        }
        if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
      } catch (err) {
        console.error("Ошибка доступа к медиа:", err);
        setUploadError(t('uploadErrorMic'));
        return;
      }

      peer = new Peer(undefined, {
        host: '0.peerjs.com',
        port: 443,
        secure: true,
        debug: 2
      });

      peer.on('open', async (myPeerId) => {
        if (cancelled) return;
        const callDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'calls', activeCallRoom);
        const callDoc = await getDoc(callDocRef);

        if (callDoc.exists() && callDoc.data().hostId === user.uid) {
          await updateDoc(callDocRef, { hostPeerId: myPeerId });
          setCallStatus('waiting');
        } else {
          unsubscribe = onSnapshot(callDocRef, (snap) => {
            if (cancelled) return;
            const data = snap.data();
            if (data && data.hostPeerId) {
              const call = peer.call(data.hostPeerId, localStream);
              setCallStatus('connected');
              call.on('stream', (remoteStream) => {
                if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
              });
            }
          });
        }
      });

      peer.on('error', (err) => {
        console.error("PeerJS Error:", err);
        setUploadError(`Ошибка соединения: ${err.type}`);
      });

      peer.on('call', (call) => {
        if (cancelled) return;
        call.answer(localStream);
        setCallStatus('connected');
        call.on('stream', (remoteStream) => {
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
        });
      });
    };

    startPeerCall();

    return () => {
      cancelled = true;
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

  const handleStartDM = async (targetUserId) => {
    if (!user || targetUserId === user.uid) return;
    
    const dmId = [user.uid, targetUserId].sort().join('_');
    
    const existingChat = chats.find(c => c.id === dmId);
    if (!existingChat) {
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

  const handlePinMessage = async (msgId) => {
    if (!activeChatId) return;
    const chatRef = doc(db, 'artifacts', appId, 'public', 'data', 'chats', activeChatId);
    const isPinned = activeChat?.pinnedMessageId === msgId;
    await setDoc(chatRef, { pinnedMessageId: isPinned ? null : msgId }, { merge: true });
  };

  const requestDeleteMessage = (msgId) => {
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

  const handleTyping = async () => {
    if (!activeChatId || !user) return;
    const now = Date.now();
    if (now - lastTypingRef.current > 2000) {
      lastTypingRef.current = now;
      const chatRef = doc(db, 'artifacts', appId, 'public', 'data', 'chats', activeChatId);
      await setDoc(chatRef, {
        typing: { [user.uid]: now }
      }, { merge: true });
    }
  };

  const handleSetWallpaper = (url) => {
    setChatWallpaper(url);
    localStorage.setItem('aero_wallpaper', url);
    setShowWallpaperMenu(false);
  };

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

  const typingUsers = activeChat?.typing ? Object.entries(activeChat.typing)
    .filter(([uid, ts]) => uid !== user?.uid && Date.now() - ts < 3000)
    .map(([uid]) => usersData[uid]?.name || t('someone')) : [];

  const typingText = typingUsers.length > 0 
    ? `${typingUsers.join(', ')} ${typingUsers.length > 1 ? t('typingPlural') : t('typing')}` 
    : '';

  let activeChatDetails = null;
  if (activeChat) {
    if (activeChat.isGroup) {
      activeChatDetails = { name: activeChat.name, status: 'В сети' };
    } else {
      const otherUserId = activeChat.participants?.find(id => id !== user?.uid);
      const otherUser = usersData[otherUserId] || {};
      activeChatDetails = { 
        name: otherUser.name || t('unknown'), 
        status: getStatusText(getEffectiveStatus(otherUserId, otherUser)) 
      };
    }
  }

  const isMyProfile = viewProfileId === user?.uid;
  const profileData = isMyProfile
    ? { name: loginName, avatar: myAvatarUrl || myAvatar, status: myStatus, customStatus: myCustomStatus, id: user?.uid }
    : {
        name: usersData[viewProfileId]?.name || t('unknown'), 
        avatar: usersData[viewProfileId]?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${viewProfileId}`, 
        status: getEffectiveStatus(viewProfileId, usersData[viewProfileId]),
        customStatus: usersData[viewProfileId]?.customStatus || '',
        id: viewProfileId 
      };

  const pinnedMessageId = activeChat?.pinnedMessageId;
  const pinnedMessage = pinnedMessageId ? (messages[activeChatId] || []).find(m => m.id === pinnedMessageId) : null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: aeroStyles }} />
      
      <div className="h-[100dvh] w-full flex items-center justify-center relative bg-transparent overflow-hidden">
        {!isLoggedIn ? (
          // --- LOGIN SCREEN ---
          <div className="aero-window relative w-full max-w-md mx-4 md:mx-auto shadow-2xl animate-gentle-fade-in-up z-10 flex flex-col max-h-[90vh]">
            <div className="aero-titlebar">
              <span className="aero-title-text flex items-center gap-2 flex-1 justify-center md:justify-start">
                <Smile size={16} className="text-blue-600" /> {t('loginTitle')}
              </span>
              <div className="ml-auto flex gap-1 absolute right-3">
                <div className="win-control win-btn" onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')} title="Language / Язык"><Globe size={12} color="#333" /></div>
                <div className="win-control win-close"><X size={12} color="white" /></div>
              </div>
            </div>
            
            <div className="p-6 md:p-8 glass-panel relative z-10 overflow-y-auto">
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-b from-blue-200 to-blue-400 p-1 shadow-lg border-2 border-white mb-4">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                    <User size={48} className="text-blue-500" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-800" style={{ textShadow: '0 1px 0 #fff' }}>
                  {isRegistering ? t('register') : t('welcome')}
                </h2>
              </div>
              
              <form onSubmit={handleAuth} className="space-y-4">
                {isRegistering && (
                  <div>
                    <label className="block text-sm text-slate-700 mb-1 font-semibold" style={{ textShadow: '0 1px 0 #fff' }}>{t('nickname')}</label>
                    <input 
                      type="text" 
                      value={loginName}
                      onChange={(e) => setLoginName(e.target.value)}
                      placeholder={t('nicknamePlaceholder')}
                      className="aero-input w-full px-4 py-2 rounded-md text-base" 
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
                    placeholder="name@example.com"
                    className="aero-input w-full px-4 py-2 rounded-md text-base" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-1 font-semibold" style={{ textShadow: '0 1px 0 #fff' }}>{t('password')}</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="aero-input w-full px-4 py-2 rounded-md text-base" 
                    required 
                  />
                </div>
                
                {authError && <div className="text-red-600 text-xs font-semibold bg-red-100 p-3 rounded-md border border-red-300 text-center">{authError}</div>}

                <button 
                  type="submit" 
                  className="aero-btn w-full py-3 font-bold text-lg mt-4 shadow-md rounded-md"
                >
                  {isRegistering ? t('createAccount') : t('login')}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button 
                  type="button" 
                  onClick={() => { setIsRegistering(!isRegistering); setAuthError(''); }}
                  className="text-base text-blue-700 hover:underline font-semibold cursor-pointer"
                >
                  {isRegistering ? t('haveAccount') : t('noAccount')}
                </button>
              </div>
            </div>
          </div>
        ) : (
          // --- MAIN APP WINDOW ---
          <div className={`aero-window flex flex-col shadow-2xl relative transition-all duration-300 z-10 mobile-fullscreen-app ${isFullScreen ? 'fixed inset-0 w-full h-full max-w-none rounded-none z-50' : 'w-full h-full md:h-[90vh] md:max-w-6xl md:rounded-xl'}`}>
            
            {/* Window Controls */}
            <div className="aero-titlebar">
              <span className="aero-title-text flex items-center gap-2 flex-1 justify-center md:justify-start">
                <Smile size={16} className="text-blue-600 drop-shadow" /> AeroGram 2009
              </span>
              <div className="ml-auto flex gap-1 absolute right-3">
                <div className="win-control win-btn" onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')} title="Language / Язык"><Globe size={12} color="#333" /></div>
                <div className="win-control win-btn hidden md:flex"><Minus size={12} color="#333" /></div>
                <div className="win-control win-btn hidden md:flex" onClick={() => setShowGadgets(!showGadgets)} title={t('gadgets')}><Cpu size={12} color="#333" /></div>
                <div className="win-control win-btn hidden md:flex" onClick={() => setIsFullScreen(!isFullScreen)} title={isFullScreen ? "Свернуть" : "Развернуть"}><Maximize size={10} color="#333" /></div>
                <div className="win-control win-close"><X size={12} color="white" /></div>
              </div>
            </div>

            <div className="flex flex-1 overflow-hidden glass-panel relative z-10">
              
              {/* SIDEBAR */}
              <div className={`w-full md:w-80 lg:w-[360px] border-r border-white/50 flex flex-col bg-white/40 transition-all ${activeChatId ? 'hidden md:flex' : 'flex'}`}>
                {/* User Profile Header */}
                <div 
                  className="p-4 md:p-3 border-b border-white/50 flex items-center gap-4 cursor-pointer explorer-hover transition-colors"
                  onClick={() => setViewProfileId(user.uid)}
                >
                  <div className="w-12 h-12 md:w-10 md:h-10 rounded-full bg-gradient-to-b from-blue-300 to-blue-500 p-0.5 shadow shrink-0">
                    <img src={myAvatar} alt="Me" className="w-full h-full rounded-full bg-white object-cover shine-effect" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-800 text-base md:text-sm truncate">{loginName}</div>
                    <div className="text-xs text-slate-700 font-semibold flex items-center gap-1 mt-0.5">
                      <div className={`w-2 h-2 status-dot status-${myStatus}`}></div> {getStatusText(myStatus)}
                    </div>
                    {myCustomStatus && (
                      <div className="text-[11px] md:text-[10px] text-slate-500 truncate italic mt-0.5">"{myCustomStatus}"</div>
                    )}
                  </div>
                  <Settings size={22} className="text-slate-600 shrink-0 opacity-70" />
                </div>

                {/* Admin Button */}
                {user?.email === ADMIN_EMAIL && (
                   <div className="px-3 pt-3">
                     <button onClick={() => setShowAdminPanel(true)} className="w-full aero-btn py-2 md:py-1 text-sm md:text-xs flex items-center justify-center gap-1 bg-red-100 border-red-300 text-red-800 font-bold rounded-md">
                       <Shield size={14} /> Админ Панель
                     </button>
                   </div>
                )}

                {/* Search */}
                <div className="p-3">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('searchPlaceholder')}
                    className="aero-input w-full px-4 py-2.5 md:py-1.5 rounded-full text-sm md:text-xs shadow-inner"
                  />
                </div>

                {/* Create Group Button */}
                <div className="px-3 pb-3">
                  <button onClick={() => setShowGroupModal(true)} className="w-full aero-btn py-2 md:py-1 text-sm md:text-xs flex items-center justify-center gap-2 rounded-md font-semibold" title={t('createGroup')}>
                    <Plus size={16} /> {t('createGroup')}
                  </button>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto">
                  {searchQuery.trim() ? (
                    Object.entries(usersData)
                      .filter(([uid, u]) => uid !== user.uid && u.name?.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map(([uid, u]) => (
                        <div 
                          key={uid} 
                          onClick={() => handleStartDM(uid)} 
                          className="p-4 md:p-3 flex items-center gap-4 md:gap-3 cursor-pointer explorer-hover border-b border-white/20 transition-all"
                        >
                          <div className="relative shrink-0">
                            <img src={u.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${uid}`} alt={u.name} className="w-14 h-14 md:w-12 md:h-12 rounded-lg bg-white shadow-sm border border-slate-300 p-0.5 object-cover" />
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 md:w-3.5 md:h-3.5 status-dot z-10 status-${getEffectiveStatus(uid, u)}`}></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-slate-800 text-base md:text-sm truncate">{u.name}</div>
                            <div className="text-sm md:text-xs text-slate-600 truncate mt-0.5">{t('clickToWrite')}</div>
                          </div>
                        </div>
                      ))
                  ) : (
                    [...chats].sort((a, b) => {
                      const msgsA = messages[a.id];
                      const msgsB = messages[b.id];
                      const timeA = msgsA && msgsA.length > 0 ? msgsA[msgsA.length - 1].timestamp : (a.timestamp || 0);
                      const timeB = msgsB && msgsB.length > 0 ? msgsB[msgsB.length - 1].timestamp : (b.timestamp || 0);
                      
                      if (timeA === timeB) return (a.order || 99) - (b.order || 99);
                      return timeB - timeA; 
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
                      
                      let chatName = chat.name;
                      let chatAvatar = chat.avatar;
                      let chatStatus = null;

                      if (!chat.isGroup) {
                        const otherUserId = chat.participants?.find(id => id !== user.uid);
                        const otherUser = usersData[otherUserId] || {};
                        chatName = otherUser.name || t('unknown');
                        chatAvatar = otherUser.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${otherUserId}`;
                        chatStatus = getEffectiveStatus(otherUserId, otherUser);
                      }

                      const myLastRead = chat.lastRead?.[user?.uid] || 0;
                      const unreadCount = chatMsgs.filter(m => m.timestamp > myLastRead && m.senderId !== user?.uid).length;
                      
                      return (
                        <div key={chat.id} className="relative group">
                          <div 
                            onClick={() => setActiveChatId(chat.id)}
                            onMouseEnter={() => setHoveredChatId(chat.id)}
                            onMouseLeave={() => setHoveredChatId(null)}
                            className={`p-4 md:p-3 flex items-center gap-4 md:gap-3 border-b border-transparent cursor-pointer transition-all
                              ${activeChatId === chat.id ? 'explorer-active' : 'explorer-hover border-b-white/20'}`}
                          >
                            <div className="relative shrink-0">
                              <img src={chatAvatar} alt={chatName} className="w-14 h-14 md:w-12 md:h-12 rounded-lg bg-white shadow-sm border border-slate-300 p-0.5 object-cover shine-effect" />
                              {!chat.isGroup && <div className={`absolute -bottom-1 -right-1 w-4 h-4 md:w-3.5 md:h-3.5 status-dot z-10 status-${chatStatus || 'offline'}`}></div>}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-slate-800 truncate text-base md:text-sm flex items-center gap-1.5">
                                  {chat.isGroup && <Users size={14} className="text-blue-600"/>}
                                  {chatName}
                                </span>
                                {unreadCount > 0 && (
                                  <div className="aero-badge px-2 py-0.5 rounded-full text-xs md:text-[10px] font-bold ml-2 shadow-sm">
                                    {unreadCount}
                                  </div>
                                )}
                              </div>
                              <div className={`text-sm md:text-xs truncate ${unreadCount > 0 ? 'font-bold text-slate-800' : 'text-slate-600'}`}>
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
                    <div className="h-16 md:h-14 border-b border-white/60 bg-gradient-to-b from-white/60 to-white/20 flex items-center justify-between px-2 md:px-4 shadow-sm relative z-10">
                      <div className="flex items-center gap-2 md:gap-3 overflow-hidden">
                        <button onClick={() => setActiveChatId(null)} className="md:hidden p-2 text-slate-600 hover:bg-white/50 rounded-full transition-colors flex-shrink-0">
                          <ArrowLeft size={24} />
                        </button>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-slate-800 text-base md:text-sm truncate leading-tight">{activeChatDetails?.name}</span>
                          <span className="text-[10px] text-slate-600 font-semibold truncate leading-tight mt-0.5 opacity-80">{activeChatDetails?.status}</span>
                        </div>
                      </div>
                      <div className="flex gap-1 md:gap-2 shrink-0">
                        <div className="relative">
                          <button onClick={() => setShowWallpaperMenu(!showWallpaperMenu)} className="p-2 md:p-1.5 hover:bg-white/50 rounded-md border border-transparent hover:border-white/80 transition-all text-slate-600 shadow-sm" title={t('wallpapers')}><ImageIcon size={20} className="md:w-[18px] md:h-[18px]"/></button>
                          {showWallpaperMenu && (
                            <div className="absolute top-full right-0 mt-1 w-48 md:w-40 bg-white border border-slate-300 shadow-xl rounded z-50 py-1 animate-fade-in-up">
                              {WALLPAPERS.map((wp) => (
                                <div 
                                  key={wp.name} 
                                  onClick={() => handleSetWallpaper(wp.url)}
                                  className="px-4 md:px-3 py-3 md:py-2 hover:bg-blue-50 cursor-pointer text-base md:text-sm flex items-center justify-between"
                                >
                                  {wp.name === 'По умолчанию' ? t('default') : wp.name} {chatWallpaper === wp.url && <Check size={14} className="text-blue-600"/>}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <button onClick={() => setShowParticipantsModal(true)} className="p-2 md:p-1.5 hover:bg-white/50 rounded-md border border-transparent hover:border-white/80 transition-all text-slate-600 shadow-sm" title={t('participants')}><Users size={20} className="md:w-[18px] md:h-[18px]"/></button>
                        <button onClick={() => handleStartCall(false)} className="p-2 md:p-1.5 hover:bg-white/50 rounded-md border border-transparent hover:border-white/80 transition-all text-slate-600 shadow-sm" title={t('startVoiceCall')}><Phone size={20} className="md:w-[18px] md:h-[18px]"/></button>
                        <button onClick={() => handleStartCall(true)} className="p-2 md:p-1.5 hover:bg-white/50 rounded-md border border-transparent hover:border-white/80 transition-all text-slate-600 shadow-sm" title={t('startVideoCall')}><Video size={20} className="md:w-[18px] md:h-[18px]"/></button>
                      </div>
                      <div className="ml-1 md:ml-2 border-l border-white/50 pl-1 md:pl-2 shrink-0">
                         <button onClick={() => setShowRecycleBin(true)} className="p-2 md:p-1.5 hover:bg-white/50 rounded-md border border-transparent hover:border-white/80 transition-all text-slate-600 shadow-sm relative" title={t('recycleBin')}>
                           <Trash size={20} className="md:w-[18px] md:h-[18px]"/>
                           {(messages[activeChatId] || []).filter(m => m.deletedAt).length > 0 && <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></div>}
                         </button>
                      </div>
                    </div>

                    {/* Pinned Message (Sticky Note) */}
                    {pinnedMessage && (
                      <div className="sticky-note mx-3 md:mx-4 mt-2 p-3 md:p-2 rounded-md text-sm md:text-xs flex items-center gap-3 md:gap-2 relative z-10 animate-gentle-fade-in-up cursor-pointer shadow-md" onClick={() => {
                        document.getElementById(`msg-${pinnedMessage.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }}>
                        <StickyNote size={18} className="shrink-0 text-yellow-700" />
                        <div className="flex-1 truncate font-medium">{pinnedMessage.text || (pinnedMessage.type === 'image' ? t('image') : '...')}</div>
                        <button onClick={(e) => { e.stopPropagation(); handlePinMessage(pinnedMessage.id); }} className="hover:bg-yellow-500/20 rounded-md p-1.5 md:p-0.5"><X size={16}/></button>
                      </div>
                    )}

                    {/* Messages Feed */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-5 relative" onClick={() => setActiveMenuMsgId(null)}>
                      {(messages[activeChatId] || []).filter(m => !m.deletedAt).map((msg) => {
                        // --- Рендер приглашения на звонок ---
                        if (msg.type === 'call') {
                          return (
                            <div key={msg.id} className="flex justify-center my-6 w-full animate-gentle-fade-in-up">
                              <div className="bg-white/60 border border-blue-300 rounded-xl p-5 text-center shadow-lg w-[90%] md:w-[85%] max-w-sm backdrop-blur-md">
                                <div className="text-base md:text-sm text-slate-800 font-semibold mb-4 flex items-center justify-center gap-3">
                                  <div 
                                    className="w-10 h-10 rounded-full overflow-hidden shrink-0 shadow-md border-2 border-white cursor-pointer hover:scale-105 transition-transform"
                                    onClick={() => setViewProfileId(msg.senderId)}
                                    title={t('profile')}
                                  >
                                     <img src={usersData[msg.senderId]?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${msg.senderId}`} className="w-full h-full object-cover" alt="avatar"/>
                                  </div>
                                  <span className="text-left leading-tight">{msg.senderName} <br/><span className="text-slate-500 font-normal">{msg.text}</span></span>
                                </div>
                                <button onClick={() => {
                                  setActiveCallRoom(msg.callId || msg.chatId);
                                  setActiveCallChatId(msg.chatId);
                                  setIsCallVideo(msg.isVideo);
                                }} className="aero-btn px-4 py-3 md:py-2 text-base md:text-sm flex items-center justify-center gap-2 w-full mt-2 font-bold rounded-lg shadow-md">
                                  {msg.isVideo ? <Video size={18}/> : <Phone size={18}/>}
                                  {t('joinCall')}
                                </button>
                              </div>
                            </div>
                          );
                        }

                        // --- Рендер обычного сообщения ---
                        const isMe = msg.senderId === user?.uid;
                        const senderData = usersData[msg.senderId] || {};
                        const senderAvatar = senderData.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${msg.senderId}`;

                        const isRead = activeChat?.isGroup 
                            ? Object.entries(activeChat.lastRead || {}).some(([uid, ts]) => uid !== user?.uid && ts >= msg.timestamp)
                            : (activeChat?.lastRead?.[activeChat.participants?.find(id => id !== user?.uid)] || 0) >= msg.timestamp;

                        return (
                          <div key={msg.id} id={`msg-${msg.id}`} className={`flex gap-2 group ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className="relative shrink-0 self-end mb-1">
                              <img 
                                src={senderAvatar} 
                                alt="avatar" 
                                className="w-8 h-8 md:w-8 md:h-8 rounded bg-white shadow-sm border border-slate-300 p-0.5 object-cover cursor-pointer hover:opacity-80 transition-opacity shine-effect" 
                                onClick={() => setViewProfileId(msg.senderId)}
                                title={`${t('profile')}: ${msg.senderName}`}
                              />
                              <div className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 status-dot z-10 status-${getEffectiveStatus(msg.senderId, senderData)}`}></div>
                            </div>
                            
                            <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%] md:max-w-[70%] relative`}>
                              {!isMe && <span className="text-[11px] text-slate-500 mb-1 ml-1 font-semibold">{msg.senderName}</span>}
                              
                              <div className={`w-full p-3 rounded-xl text-[15px] md:text-sm relative break-words shadow-sm
                                ${isMe ? 'bubble-self rounded-br-sm' : 'bubble-other rounded-bl-sm'} 
                                ${msg.edited ? 'italic' : ''}`}
                              >
                                {/* Цитата (Reply) */}
                                {msg.replyTo && (
                                  <div className="mb-2 p-2.5 bg-black/5 border-l-4 border-blue-400 rounded-md text-xs cursor-pointer opacity-80 hover:opacity-100 transition-opacity">
                                    <div className="font-bold text-blue-700 mb-0.5">{msg.replyTo.senderName}</div>
                                    <div className="truncate" title={msg.replyTo.text}>
                                      {msg.replyTo.text && msg.replyTo.text.length > 25 ? msg.replyTo.text.substring(0, 25) + '...' : msg.replyTo.text}
                                    </div>
                                  </div>
                                )}

                                {/* Рендер картинки */}
                                {msg.type === 'image' && msg.imageUrl && (
                                  <div className="block mb-1">
                                    <img 
                                      src={msg.imageUrl} 
                                      alt={t('image')} 
                                      className="max-w-full sm:max-w-[280px] max-h-[300px] object-contain rounded bg-white/50 border border-black/10 cursor-pointer hover:opacity-90 transition-opacity shadow-sm" 
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
                                  <div className="leading-snug">
                                    {msg.text}
                                    {/* Rich Link Preview */}
                                    {extractUrl(msg.text) && (
                                      <a href={extractUrl(msg.text)} target="_blank" rel="noopener noreferrer" className="mt-2 block bg-white/60 border border-blue-200 rounded-lg p-2 flex items-center gap-3 hover:bg-white/80 transition-colors no-underline group-link shadow-sm">
                                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center shrink-0">
                                          <ExternalLink size={16} className="text-blue-600"/>
                                        </div>
                                        <div className="text-xs text-blue-800 truncate font-semibold">{extractUrl(msg.text)}</div>
                                      </a>
                                    )}
                                  </div>
                                )}
                                
                                <div className={`text-[11px] mt-1.5 flex justify-end items-center gap-1 opacity-60 ${isMe ? 'text-blue-900' : 'text-slate-600'}`}>
                                  <span>{msg.time}</span>
                                  {isMe && (
                                    <span className="text-[14px] leading-none tracking-tighter" title={isRead ? t('read') : t('sent')}>
                                      {isRead ? '✓✓' : '✓'}
                                    </span>
                                  )}
                                  {msg.edited && <span className="text-[10px] ml-1">{t('edited')}</span>}
                                </div>

                                {/* Hover Reaction Menu (Desktop) */}
                                <div className={`absolute top-0 ${isMe ? '-left-10' : '-right-10'} opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex flex-col gap-1 z-50`}>
                                   <button 
                                     onClick={(e) => { e.stopPropagation(); setActiveMenuMsgId(activeMenuMsgId === msg.id ? null : msg.id); }} 
                                     className="p-1.5 bg-white/90 rounded-full shadow border border-slate-200 text-slate-500 hover:text-blue-500"
                                     title={t('actions')}
                                   >
                                     <Smile size={16}/>
                                   </button>
                                </div>
                              </div>

                              {/* Mobile Interaction Trigger - Click on bubble directly to show actions */}
                              <div className="absolute inset-0 z-10 md:hidden" onClick={(e) => { e.stopPropagation(); setActiveMenuMsgId(activeMenuMsgId === msg.id ? null : msg.id); }}></div>

                              {/* Reactions Display */}
                              {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-1.5 z-20 -mb-2">
                                  {Object.entries(msg.reactions).map(([emoji, uids]) => uids.length > 0 && (
                                    <div key={emoji} className="reaction-pill px-2 py-0.5" onClick={(e) => { e.stopPropagation(); handleReaction(msg.id, emoji); }}>
                                      <span className="text-sm md:text-xs">{emoji}</span> <span className="font-bold text-slate-600">{uids.length}</span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Active Actions Popup */}
                              {activeMenuMsgId === msg.id && (
                                <div className={`absolute top-10 ${isMe ? 'right-0' : 'left-0'} w-56 md:w-48 bg-white/95 backdrop-blur-md border border-slate-300 shadow-xl rounded-xl z-50 p-2 animate-gentle-fade-in-up`} onClick={e => e.stopPropagation()}>
                                  <div className="flex gap-1 justify-between mb-2 pb-2 border-b border-slate-200 px-1">
                                    {REACTIONS.map(emoji => (
                                      <button key={emoji} onClick={() => handleReaction(msg.id, emoji)} className="hover:scale-125 transition-transform text-xl md:text-lg">{emoji}</button>
                                    ))}
                                  </div>
                                  <button onClick={() => { setReplyingTo(msg); setActiveMenuMsgId(null); }} className="w-full text-left px-3 py-2 text-base md:text-sm hover:bg-blue-50 rounded-lg flex items-center gap-3"><Reply size={16}/> {t('reply')}</button>
                                  {isMe && msg.type === 'text' && <button onClick={() => { setInputText(msg.text); setEditingMessageId(msg.id); setActiveMenuMsgId(null); }} className="w-full text-left px-3 py-2 text-base md:text-sm hover:bg-blue-50 rounded-lg flex items-center gap-3"><Edit2 size={16}/> {t('edit')}</button>}
                                  <button onClick={() => { handlePinMessage(msg.id); setActiveMenuMsgId(null); }} className="w-full text-left px-3 py-2 text-base md:text-sm hover:bg-blue-50 rounded-lg flex items-center gap-3"><StickyNote size={16}/> {pinnedMessageId === msg.id ? t('unpinMessage') : t('pinMessage')}</button>
                                  {isMe && <div className="border-t border-slate-100 my-1"></div>}
                                  {isMe && <button onClick={() => requestDeleteMessage(msg.id)} className="w-full text-left px-3 py-2 text-base md:text-sm hover:bg-red-50 text-red-600 rounded-lg flex items-center gap-3 font-semibold"><Trash2 size={16}/> {t('delete')}</button>}
                                </div>
                              )}
                              
                            </div>
                          </div>
                        );
                      })}
                      {/* Индикатор печати */}
                      {typingText && (
                        <div className="text-[11px] md:text-xs text-slate-500 italic ml-12 animate-pulse mt-2">
                          {typingText}
                        </div>
                      )}
                      <div ref={messagesEndRef} className="h-2" />
                    </div>

                    {/* Input Area */}
                    <div className="p-2 md:p-3 border-t border-white/60 bg-gradient-to-t from-white/60 to-white/30 backdrop-blur-md relative pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
                      {uploadError && (
                        <div className="absolute -top-10 left-3 bg-red-100 border border-red-300 text-red-700 px-3 py-1 text-sm rounded-md shadow-md font-semibold animate-gentle-fade-in-up z-20">
                          {uploadError}
                        </div>
                      )}
                      
                      {/* Панель ответа / редактирования */}
                      {(replyingTo || editingMessageId) && (
                        <div className="absolute bottom-full left-0 w-full bg-white/95 border-t border-blue-200 p-3 flex items-center justify-between shadow-md backdrop-blur-md">
                          <div className="flex items-center gap-3 overflow-hidden">
                            {editingMessageId ? <Edit2 size={18} className="text-yellow-600"/> : <Reply size={18} className="text-blue-600"/>}
                            <div className="border-l-2 border-slate-400 pl-3 flex flex-col">
                              <span className="font-bold text-slate-800 text-sm md:text-xs">{editingMessageId ? t('editingMessage') : `${t('replyTo')}: ${replyingTo.senderName}`}</span>
                              <span className="truncate text-slate-600 text-xs mt-0.5 max-w-[250px]" title={replyingTo.text}>
                                {editingMessageId ? '' : (replyingTo.text && replyingTo.text.length > 25 ? replyingTo.text.substring(0, 25) + '...' : replyingTo.text)}
                              </span>
                            </div>
                          </div>
                          <button onClick={() => { setReplyingTo(null); setEditingMessageId(null); setInputText(''); }} className="p-2 hover:bg-slate-200 rounded-full transition-colors bg-white shadow-sm border border-slate-200"><X size={16}/></button>
                        </div>
                      )}

                      {isRecording ? (
                        // --- UI записи голосового сообщения ---
                        <div className="flex items-center gap-3 bg-white/80 px-4 py-2 rounded-xl shadow-inner border border-red-300 h-[52px]">
                          <div className="w-3.5 h-3.5 bg-red-600 rounded-full animate-pulse shadow-md"></div>
                          <span className="text-red-600 font-bold text-base w-12">{formatRecordingTime(recordingTime)}</span>
                          <div className="flex-1"></div>
                          <button 
                            type="button" 
                            onClick={cancelRecording} 
                            className="p-2 text-slate-500 hover:text-red-600 transition-colors bg-white/50 rounded-lg border border-white hover:bg-white shadow-sm" 
                            title={t('cancel')}
                          >
                            <X size={20} />
                          </button>
                          <button 
                            type="button" 
                            onClick={stopAndSendRecording} 
                            className="aero-btn px-5 py-2 flex items-center justify-center gap-2 rounded-lg shadow-md"
                          >
                            <Send size={18} /> <span className="hidden sm:inline font-bold">{t('send')}</span>
                          </button>
                        </div>
                      ) : (
                        // --- Обычный UI ввода ---
                        <form onSubmit={(e) => handleSendMessage(e, null, null)} className="flex gap-2 w-full">
                          <div className="flex gap-1">
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
                              className={`p-2 text-slate-600 hover:text-blue-600 transition-colors bg-white/70 rounded-lg border border-white hover:bg-white flex items-center justify-center w-11 h-11 shadow-sm ${isUploading ? 'opacity-50 cursor-wait' : ''}`}
                              title={t('attachImage')}
                            >
                              {isUploading ? (
                                <div className="w-5 h-5 border-2 border-slate-400 border-t-blue-500 rounded-full animate-spin"></div>
                              ) : (
                                <Paperclip size={22} />
                              )}
                            </button>
                            
                            <button 
                              type="button" 
                              onClick={() => setShowPaint(true)} 
                              className="p-2 text-slate-600 hover:text-blue-600 bg-white/70 rounded-lg border border-white shadow-sm flex items-center justify-center w-11 h-11 transition-colors hover:bg-white" 
                              title={t('draw')}
                            >
                              <Brush size={22} />
                            </button>
                          </div>
                          
                          <div className="flex-1 relative">
                            <input
                              type="text"
                              value={inputText}
                              onChange={(e) => { setInputText(e.target.value); handleTyping(); }}
                              placeholder={t('messagePlaceholder')}
                              className="aero-input w-full px-4 py-2.5 rounded-xl shadow-inner text-base md:text-sm h-11 pr-12 focus:ring-2 focus:ring-blue-300"
                            />
                            <button 
                              type="button"
                              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                              className="absolute right-1 top-1 p-1.5 text-slate-400 hover:text-yellow-500 transition-colors rounded-lg flex items-center justify-center h-9 w-9"
                            >
                              <Smile size={20} />
                            </button>
                            {showEmojiPicker && (
                              <div className="absolute bottom-14 right-0 bg-white/95 backdrop-blur-md border border-slate-300 shadow-2xl rounded-xl p-3 grid grid-cols-5 gap-2 w-[280px] z-50 animate-gentle-fade-in-up">
                                {EMOJIS.map(emoji => (
                                  <button key={emoji} type="button" onClick={() => handleAddEmoji(emoji)} className="text-2xl hover:bg-slate-100 rounded-lg p-2 transition-colors">{emoji}</button>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          {inputText.trim() ? (
                            <button type="submit" className="aero-btn px-4 flex items-center justify-center w-12 h-11 rounded-xl shadow-md" title={t('send')}>
                              {editingMessageId ? <Check size={20} /> : <Send size={20} className="ml-1" />}
                            </button>
                          ) : (
                            <button 
                              type="button" 
                              onClick={startRecording} 
                              className="aero-btn px-4 flex items-center justify-center w-12 h-11 rounded-xl shadow-md" 
                              title={t('record')}
                            >
                              <Mic size={20} />
                            </button>
                          )}
                        </form>
                      )}
                    </div>
                  </>
                ) : (
                  // Empty State
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-500 z-10 p-8 text-center">
                    <div className="w-32 h-32 mb-6 opacity-60 bg-gradient-to-br from-blue-200 to-transparent rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                      <Smile size={64} className="text-blue-500" />
                    </div>
                    <p className="font-bold text-xl md:text-lg" style={{ textShadow: '0 1px 0 rgba(255,255,255,0.8)' }}>
                      {t('selectChat')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* --- GADGETS SIDEBAR (Desktop Only) --- */}
            {showGadgets && (
              <div className="absolute top-9 right-0 bottom-0 w-64 gadget-sidebar p-5 flex flex-col gap-5 z-20 animate-gentle-fade-in-up overflow-y-auto hidden md:flex">
                {/* Clock Gadget */}
                <div className="gadget-item p-4 flex flex-col items-center justify-center aspect-square">
                  <Clock size={56} className="text-slate-800 drop-shadow-md mb-3" />
                  <div className="text-2xl font-bold text-slate-800" style={{textShadow: '0 1px 0 rgba(255,255,255,0.8)'}}>
                    {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
                
                {/* CPU Gadget */}
                <div className="gadget-item p-4">
                  <div className="flex items-center gap-2 mb-3 text-slate-800 font-bold text-sm">
                    <Cpu size={18} /> CPU Usage
                  </div>
                  <div className="w-full bg-slate-300/50 rounded-full h-4 border border-slate-400/50 overflow-hidden shadow-inner">
                    <div className="h-full bg-gradient-to-r from-green-400 to-red-500 transition-all duration-500" style={{width: `${cpuUsage}%`}}></div>
                  </div>
                  <div className="text-right text-sm font-mono mt-2 font-bold">{Math.round(cpuUsage)}%</div>
                </div>
                
                {/* Sticky Notes Gadget */}
                <div className="gadget-item p-0 overflow-hidden bg-[#fff9c4] border-[#fbc02d] shadow-md">
                  <div className="bg-[#fbc02d]/20 p-2 border-b border-[#fbc02d]/30 flex justify-between items-center px-3">
                    <span className="text-xs font-bold text-[#5d4037]">Notes</span>
                    <Plus size={14} className="text-[#5d4037] cursor-pointer"/>
                  </div>
                  <textarea 
                    className="w-full h-40 bg-transparent resize-none p-3 text-sm text-[#5d4037] focus:outline-none font-medium leading-relaxed"
                    value={gadgetNotes}
                    onChange={(e) => { setGadgetNotes(e.target.value); localStorage.setItem('aero_notes', e.target.value); }}
                    placeholder="Type a note..."
                  />
                </div>

                {/* Music Player Gadget */}
                <div className="gadget-item p-4 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-2 mb-3 text-slate-800 font-bold text-sm">
                    <Music size={18} className="text-blue-600" /> Aero Vibes FM
                  </div>
                  {/* Заменен URL и включен режим Live-радио для бесконечного потока */}
                  <AeroAudioPlayer src="https://stream.laut.fm/synthwave" isLiveStream={true} />
                </div>
              </div>
            )}

            {/* CALL MODAL */}
            {activeCallRoom && (
              <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-0 md:p-6">
                <div className="aero-window relative w-full h-full md:max-w-4xl md:h-[80vh] flex flex-col shadow-2xl animate-gentle-fade-in-up md:border border-white/80 overflow-hidden rounded-none md:rounded-xl">
                  <div className="aero-titlebar cursor-move hidden md:flex">
                    <span className="aero-title-text flex items-center gap-2">
                      <Phone size={14} className="text-blue-700" />
                      {t('conference')}: {chats.find(c => c.id === activeCallChatId)?.name || t('personalCall')}
                    </span>
                    <div className="ml-auto flex gap-1">
                      <div className="win-control win-close" onClick={() => window.location.reload()} title="Force Close"><X size={12} color="white" /></div>
                    </div>
                  </div>
                  
                  <div className="flex-1 bg-slate-900 relative flex items-center justify-center overflow-hidden">
                    {/* Remote Video */}
                    <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover md:object-contain" />
                    
                    {/* Local Video (PIP) */}
                    <div className="absolute top-4 right-4 md:bottom-6 md:right-6 md:top-auto w-24 h-32 md:w-48 md:h-36 bg-slate-800 border-2 border-white/50 rounded-xl shadow-2xl overflow-hidden z-20">
                      <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                    </div>

                    {/* Status Overlay */}
                    {callStatus !== 'connected' && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm z-10 text-center p-6">
                        <div className="w-20 h-20 mb-6 bg-blue-500/20 rounded-full flex items-center justify-center animate-pulse">
                          <Phone size={40} className="text-blue-400 animate-bounce" />
                        </div>
                        <div className="text-white font-bold text-2xl mb-2">{chats.find(c => c.id === activeCallChatId)?.name || t('unknown')}</div>
                        <div className="text-blue-200 text-lg opacity-80">{callStatus === 'waiting' ? 'Ожидание собеседника...' : 'Соединение...'}</div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 bg-gradient-to-t from-slate-200 to-white border-t border-white flex justify-center gap-6 glass-panel pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
                    <button onClick={() => setActiveCallRoom(null)} className="aero-btn px-10 py-4 font-bold flex items-center gap-3 text-lg shadow-xl rounded-full" style={{background: 'linear-gradient(180deg, #ff8c8c 0%, #e81123 100%)', borderColor: '#c3000f'}}>
                      <Phone size={24} className="rotate-[135deg]" /> {t('hangup')}
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* CREATE GROUP MODAL */}
            {showGroupModal && (
              <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-0 md:p-4">
                <div className="aero-window relative w-full md:max-w-md h-full md:h-auto shadow-2xl animate-gentle-fade-in-up border-0 md:border border-white/80 flex flex-col draggable-modal">
                  <div className="aero-titlebar shrink-0">
                    <span className="aero-title-text flex items-center gap-2"><Users size={16} className="text-blue-600"/> {t('createGroup')}</span>
                    <div className="ml-auto flex gap-1">
                      <div className="win-control win-close" onClick={() => setShowGroupModal(false)}><X size={14} color="white" /></div>
                    </div>
                  </div>
                  <div className="p-6 bg-white/95 flex-1 overflow-y-auto backdrop-blur-md">
                    <div className="mb-6">
                      <label className="block text-sm font-bold text-slate-800 mb-2">{t('groupName')}</label>
                      <input type="text" value={newGroupName} onChange={e => setNewGroupName(e.target.value)} className="aero-input w-full px-4 py-3 rounded-lg text-base" placeholder={t('groupNamePlaceholder')} />
                    </div>
                    <div className="mb-8 flex-1">
                      <label className="block text-sm font-bold text-slate-800 mb-2">{t('participants')}</label>
                      <div className="h-48 md:h-64 overflow-y-auto border border-slate-300 bg-white/50 rounded-lg p-2 shadow-inner">
                        {Object.entries(usersData).filter(([uid]) => uid !== user.uid).map(([uid, u]) => (
                          <label key={uid} className="flex items-center gap-4 p-3 hover:bg-blue-50 cursor-pointer rounded-lg border-b border-slate-100 last:border-0 transition-colors">
                            <input 
                              type="checkbox" 
                              className="w-5 h-5 accent-blue-600"
                              checked={selectedUsersForGroup.includes(uid)}
                              onChange={(e) => {
                                if (e.target.checked) setSelectedUsersForGroup([...selectedUsersForGroup, uid]);
                                else setSelectedUsersForGroup(selectedUsersForGroup.filter(id => id !== uid));
                              }}
                            />
                            <img src={u.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${uid}`} className="w-10 h-10 rounded bg-white shadow-sm border border-slate-300 p-0.5 object-cover" />
                            <span className="text-base font-semibold text-slate-800">{u.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <button onClick={handleCreateGroup} className="aero-btn w-full py-3 text-lg font-bold rounded-xl shadow-md mt-auto mb-[env(safe-area-inset-bottom)]">{t('create')}</button>
                  </div>
                </div>
              </div>
            )}

            {/* PARTICIPANTS MODAL */}
            {showParticipantsModal && (
              <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-0 md:p-4">
                <div className="aero-window relative w-full md:max-w-md h-full md:h-auto shadow-2xl animate-gentle-fade-in-up border-0 md:border border-white/80 flex flex-col draggable-modal">
                  <div className="aero-titlebar shrink-0">
                    <span className="aero-title-text flex items-center gap-2"><Users size={16} className="text-blue-600"/> {t('participants')}</span>
                    <div className="ml-auto flex gap-1">
                      <div className="win-control win-close" onClick={() => setShowParticipantsModal(false)}><X size={14} color="white" /></div>
                    </div>
                  </div>
                  <div className="p-4 bg-white/95 flex-1 md:h-[400px] overflow-y-auto backdrop-blur-md">
                    {activeChat?.participants?.map(uid => {
                      const u = usersData[uid] || {};
                      return (
                        <div key={uid} onClick={() => { setViewProfileId(uid); setShowParticipantsModal(false); }} className="flex items-center gap-4 p-3 hover:bg-blue-50 cursor-pointer rounded-xl border-b border-slate-200 last:border-0 transition-colors">
                          <div className="relative">
                            <img src={u.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${uid}`} className="w-12 h-12 rounded-lg bg-white border border-slate-300 p-0.5 shadow-sm object-cover" />
                            <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 status-dot z-10 status-${getEffectiveStatus(uid, u)}`}></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-slate-800 text-base truncate">{u.name || t('unknown')}</div>
                            <div className="text-sm text-slate-500 truncate mt-0.5">{u.customStatus || getStatusText(u.status || 'offline')}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ADMIN PANEL */}
            {showAdminPanel && (
              <DraggableWindow title="Панель Администратора" icon={Shield} onClose={() => setShowAdminPanel(false)} initialPos={{x: Math.max(10, window.innerWidth/2 - 350), y: Math.max(10, 100)}} width={700} zIndex={150}>
                  <div className="flex-1 bg-white/95 p-4 md:p-6 overflow-y-auto backdrop-blur-md">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left border-collapse min-w-[500px]">
                        <thead>
                          <tr className="border-b-2 border-slate-300 text-slate-800">
                            <th className="p-3">Пользователь</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Статус</th>
                            <th className="p-3">Действия</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(usersData).map(([uid, u]) => (
                            <tr key={uid} className="border-b border-slate-200 hover:bg-blue-50 transition-colors">
                              <td className="p-3 flex items-center gap-3">
                                <img src={u.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${uid}`} className="w-8 h-8 rounded-full border border-slate-300 shadow-sm"/>
                                <span className="font-bold text-slate-800 text-base">{u.name}</span>
                              </td>
                              <td className="p-3 text-slate-600 font-mono text-xs">{u.email || '-'}</td>
                              <td className="p-3">
                                  {u.isBanned ? (
                                    <div className="flex flex-col">
                                      <span className="text-red-600 font-bold bg-red-100 px-2 py-0.5 rounded text-xs w-max">Забанен</span>
                                      <span className="text-[11px] text-slate-500 max-w-[150px] truncate mt-1" title={u.banReason}>{u.banReason}</span>
                                    </div>
                                  ) : <span className="text-green-600 font-bold bg-green-100 px-2 py-0.5 rounded text-xs w-max">Активен</span>}
                              </td>
                              <td className="p-3">
                                {uid !== user.uid && (
                                  <button 
                                    onClick={() => toggleBan(uid, u.isBanned)}
                                    className={`px-3 py-1.5 rounded-md text-xs font-bold text-white shadow-sm transition-transform hover:scale-105 ${u.isBanned ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
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
              </DraggableWindow>
            )}

            {/* MS Paint Mini-App */}
            {showPaint && (
              <DraggableWindow title="Aero Paint" icon={Brush} onClose={() => setShowPaint(false)} initialPos={{x: Math.max(10, window.innerWidth/2 - 300), y: Math.max(10, 50)}} width={600} height={500} zIndex={160}>
                <PaintApp onSend={(dataUrl) => { handleSendMessage(null, 'image', dataUrl); }} onClose={() => setShowPaint(false)} />
              </DraggableWindow>
            )}

            {/* Recycle Bin Window */}
            {showRecycleBin && (
              <DraggableWindow title={t('recycleBin')} icon={Trash} onClose={() => setShowRecycleBin(false)} initialPos={{x: Math.max(10, window.innerWidth/2 - 250), y: Math.max(10, 100)}} width={500} height={450} zIndex={170}>
                <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
                  {(messages[activeChatId] || []).filter(m => m.deletedAt).length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                      <Trash size={64} className="opacity-30 mb-4"/>
                      <p className="font-semibold text-lg">{t('noMessages')}</p>
                    </div>
                  ) : (
                    (messages[activeChatId] || []).filter(m => m.deletedAt).map(msg => (
                      <div key={msg.id} className="flex items-center justify-between p-3 mb-2 bg-white border border-slate-200 rounded-lg hover:bg-red-50 shadow-sm transition-colors">
                        <div className="flex-1 min-w-0 pr-4">
                          <span className="font-bold text-slate-800">{msg.senderName}:</span> <span className="text-slate-600 truncate">{msg.text || 'Медиа'}</span>
                          <div className="text-[11px] text-slate-400 mt-1">Удалено: {new Date(msg.deletedAt).toLocaleTimeString()}</div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button onClick={() => restoreMessage(msg.id)} className="p-2 hover:bg-green-100 rounded-md text-green-600 border border-transparent hover:border-green-300 transition-colors" title={t('restore')}><RefreshCw size={16}/></button>
                          <button onClick={() => permanentDeleteMessage(msg.id)} className="p-2 hover:bg-red-100 rounded-md text-red-600 border border-transparent hover:border-red-300 transition-colors" title={t('deleteForever')}><X size={16}/></button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-3 bg-slate-100/80 backdrop-blur-sm border-t border-slate-300 flex justify-end pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
                  <button onClick={emptyRecycleBin} className="aero-btn px-5 py-2 text-sm font-bold flex items-center gap-2 rounded-lg shadow-md"><Trash2 size={16}/> {t('emptyBin')}</button>
                </div>
              </DraggableWindow>
            )}

            {/* Profile Window */}
            {viewProfileId && (
              <DraggableWindow title={isMyProfile ? t('myProfile') : t('userProfile')} icon={Settings} onClose={() => setViewProfileId(null)} initialPos={{x: Math.max(10, window.innerWidth/2 - 250), y: Math.max(10, window.innerHeight/2 - 250)}} width={500} zIndex={180}>
                  <div className="bg-white/95 p-4 md:p-6 flex-1 overflow-y-auto backdrop-blur-md">
                    <div className="flex gap-2 border-b border-slate-300 mb-6 px-1">
                      <div onClick={() => setActiveTab('general')} className={`px-4 py-2 border border-slate-300 rounded-t-lg text-sm md:text-base font-bold -mb-px z-10 cursor-pointer transition-colors ${activeTab === 'general' ? 'bg-white border-b-transparent text-blue-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>{t('general')}</div>
                      <div onClick={() => setActiveTab('media')} className={`px-4 py-2 border border-slate-300 rounded-t-lg text-sm md:text-base font-bold -mb-px z-10 cursor-pointer transition-colors ${activeTab === 'media' ? 'bg-white border-b-transparent text-blue-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>{t('mediaExplorer')}</div>
                    </div>
                    
                    {activeTab === 'general' ? (
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-32 flex flex-col items-center shrink-0">
                          <img src={profileData.avatar} alt="Avatar" className="w-28 h-28 md:w-24 md:h-24 bg-white border border-slate-300 p-1 shadow-md mb-3 object-cover shine-effect rounded-lg" />
                          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-600 font-bold bg-slate-100 px-3 py-1 rounded-full shadow-inner">
                             <div className={`w-2.5 h-2.5 status-dot status-${profileData.status}`}></div>
                             {getStatusText(profileData.status)}
                          </div>
                        </div>
                        <div className="flex-1 space-y-4 min-w-0">
                          <div>
                            <label className="text-sm font-bold text-slate-700 block mb-1.5">{t('username')}</label>
                            <input type="text" readOnly defaultValue={profileData.name} className="aero-input w-full text-base px-3 py-2 rounded-md bg-slate-100 text-slate-600 font-semibold border-slate-300" />
                          </div>
                          
                          {isMyProfile ? (
                            <>
                              <div>
                                <label className="text-sm font-bold text-slate-700 block mb-1.5">{t('avatarUrl')}</label>
                                <input 
                                  type="text" 
                                  value={myAvatarUrl}
                                  onChange={(e) => setMyAvatarUrl(e.target.value)}
                                  placeholder="https://example.com/image.jpg"
                                  className="aero-input w-full text-base px-3 py-2 rounded-md" 
                                />
                              </div>
                              <div>
                                <label className="text-sm font-bold text-slate-700 block mb-1.5">{t('textStatus')}</label>
                                <input 
                                  type="text" 
                                  value={myCustomStatus}
                                  onChange={(e) => setMyCustomStatus(e.target.value)}
                                  placeholder={t('statusPlaceholder')}
                                  className="aero-input w-full text-base px-3 py-2 rounded-md" 
                                />
                              </div>
                              <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                  <label className="text-sm font-bold text-slate-700 block mb-1.5">{t('status')}</label>
                                  <select 
                                    value={myStatus}
                                    onChange={(e) => setMyStatus(e.target.value)}
                                    className="aero-input w-full text-base px-3 py-2 rounded-md"
                                  >
                                    <option value="online">{t('online')}</option>
                                    <option value="away">{t('away')}</option>
                                    <option value="dnd">{t('dnd')}</option>
                                    <option value="invisible">{t('invisible')}</option>
                                  </select>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <label className="text-sm font-bold text-slate-700 block mb-1.5 truncate">{t('theme')}</label>
                                  <div className="flex items-center gap-2">
                                    <Palette size={18} className="text-blue-500 shrink-0"/>
                                    <select value={currentTheme} onChange={(e) => setCurrentTheme(e.target.value)} className="aero-input w-full text-base px-2 py-2 rounded-md truncate">
                                      {Object.entries(THEMES).map(([key, val]) => <option key={key} value={key}>{val.name}</option>)}
                                    </select>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-bold text-slate-700 block mb-1.5">{t('soundScheme')}</label>
                                <div className="flex items-center gap-2">
                                  <Volume2 size={18} className="text-blue-500"/>
                                  <select value={currentSoundScheme} onChange={(e) => setCurrentSoundScheme(e.target.value)} className="aero-input w-full text-base px-3 py-2 rounded-md">
                                    {Object.entries(SOUND_SCHEMES).map(([key, name]) => <option key={key} value={key}>{name}</option>)}
                                  </select>
                                </div>
                              </div>
                            </>
                          ) : (
                             <div className="text-base text-slate-600 p-4 bg-slate-100 border border-slate-200 rounded-lg shadow-inner">
                               {t('viewingOtherProfile')}
                               {profileData.customStatus && (
                                 <div className="mt-3 font-semibold italic text-blue-800">"{profileData.customStatus}"</div>
                               )}
                             </div>
                          )}
                          
                          <div className="text-sm text-slate-500 mt-4 pt-4 border-t border-slate-200">
                            ID: <span className="font-mono text-xs bg-slate-200 px-2 py-1 rounded block mt-2 break-all text-slate-600">{profileData.id}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // --- Media Explorer Tab ---
                      <div className="h-72 overflow-y-auto bg-white border border-slate-300 rounded-lg p-3 shadow-inner">
                        {activeChatId ? (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {(messages[activeChatId] || []).filter(m => m.type === 'image').map(m => (
                              <div key={m.id} className="aspect-square border border-slate-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity shadow-sm" onClick={() => setViewingMessage(m)}>
                                <img src={m.imageUrl} className="w-full h-full object-cover" />
                              </div>
                            ))}
                            {(messages[activeChatId] || []).filter(m => m.type === 'image').length === 0 && (
                              <div className="col-span-full text-center text-slate-500 text-base py-8 font-semibold">{t('noMessages')}</div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center text-slate-500 text-base py-8 font-semibold">{t('selectChat')}</div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 bg-slate-200/80 backdrop-blur-md border-t border-white flex justify-end gap-3 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                    {isMyProfile && (
                      <button onClick={handleLogout} className="aero-btn px-5 py-2.5 text-base md:text-sm font-bold mr-auto rounded-lg shadow-md" style={{background: 'linear-gradient(180deg, #ff8c8c 0%, #e81123 100%)', borderColor: '#c3000f'}}>{t('logout')}</button>
                    )}
                    {!isMyProfile && (
                      <button onClick={() => handleStartDM(profileData.id)} className="aero-btn px-5 py-2.5 text-base md:text-sm font-bold mr-auto rounded-lg shadow-md">{t('writeMessage')}</button>
                    )}
                    <button onClick={handleSaveProfile} className="aero-btn px-6 py-2.5 text-base md:text-sm font-bold min-w-[100px] rounded-lg shadow-md">{t('save')}</button>
                    <button onClick={() => setViewProfileId(null)} className="aero-btn px-6 py-2.5 text-base md:text-sm font-bold min-w-[100px] rounded-lg shadow-md">
                        {isMyProfile ? t('cancel') : t('close')}
                    </button>
                  </div>
              </DraggableWindow>
            )}

            {/* Image Viewer */}
            {viewingMessage && viewingMessage.type === 'image' && (
              <div className="absolute inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4" onClick={() => setViewingMessage(null)}>
                <div className="relative w-full h-full flex items-center justify-center">
                  <button className="absolute top-4 right-4 md:top-8 md:right-8 text-white hover:text-red-400 bg-black/50 p-2 rounded-full backdrop-blur z-10 transition-colors"><X size={32}/></button>
                  <img src={viewingMessage.imageUrl} className="max-w-full max-h-[90dvh] object-contain shadow-2xl rounded border border-white/20" alt="Fullscreen view" onClick={e => e.stopPropagation()}/>
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </>
  );
}