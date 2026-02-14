/**
 * Achievement definitions — all 44 achievements
 */
import type { AchievementDef } from './types';

// ⭐️ 坚持系列 (Streak)
export const STREAK_ACHIEVEMENTS: AchievementDef[] = [
  { id: 'S1', series: 'streak', nameZh: '三天打鱼', nameEn: 'Three-Day Streak', descZh: '好的开始是成功的一半', descEn: 'A good start is half the battle', conditionZh: '连续打卡 3 天', conditionEn: '3-day streak', emoji: '🔥', target: 3, progressKey: 'currentStreak' },
  { id: 'S2', series: 'streak', nameZh: '一周达人', nameEn: 'Week Warrior', descZh: '一整周！习惯正在生根发芽 🌿', descEn: 'A whole week! Habits are taking root 🌿', conditionZh: '连续打卡 7 天', conditionEn: '7-day streak', emoji: '📅', target: 7, progressKey: 'currentStreak' },
  { id: 'S3', series: 'streak', nameZh: '半月坚持', nameEn: 'Fortnight Focus', descZh: '两周的坚持，西瓜田已经郁郁葱葱', descEn: 'Two weeks of persistence, your melon field is thriving', conditionZh: '连续打卡 14 天', conditionEn: '14-day streak', emoji: '🌿', target: 14, progressKey: 'currentStreak' },
  { id: 'S4', series: 'streak', nameZh: '钢铁意志', nameEn: 'Iron Will', descZh: '三十天，你证明了什么叫坚持', descEn: 'Thirty days — you proved what persistence means', conditionZh: '连续打卡 30 天', conditionEn: '30-day streak', emoji: '💪', target: 30, progressKey: 'currentStreak' },
  { id: 'S5', series: 'streak', nameZh: '百日传说', nameEn: 'Century Legend', descZh: '一百天不间断，你就是传说本身', descEn: '100 days unbroken — you are the legend', conditionZh: '连续打卡 100 天', conditionEn: '100-day streak', emoji: '👑', target: 100, progressKey: 'currentStreak' },
  { id: 'S6', series: 'streak', nameZh: '累计百天', nameEn: 'Hundred Days', descZh: '一百天的陪伴，西瓜时钟已经是你生活的一部分', descEn: '100 days together — Watermelon Clock is part of your life', conditionZh: '累计使用天数 ≥100 天', conditionEn: '100+ total days', emoji: '📆', target: 100, progressKey: 'totalDays' },
  { id: 'S7', series: 'streak', nameZh: '早起鸟', nameEn: 'Early Bird', descZh: '清晨的西瓜田，露珠还在叶子上 🌅', descEn: 'Morning dew on the melon field 🌅', conditionZh: '早上 6:00-8:00 完成专注', conditionEn: 'Complete a session 6-8 AM', emoji: '🌅' },
  { id: 'S8', series: 'streak', nameZh: '夜猫子', nameEn: 'Night Owl', descZh: '夜深了，你的西瓜还在安静地生长 🌙', descEn: 'Late night, your melon grows quietly 🌙', conditionZh: '晚上 22:00-00:00 完成专注', conditionEn: 'Complete a session 10 PM-12 AM', emoji: '🌙' },
  { id: 'S9', series: 'streak', nameZh: '周末战士', nameEn: 'Weekend Warrior', descZh: '别人在休息，你在成长 💪', descEn: 'Others rest, you grow 💪', conditionZh: '周六和周日都完成了专注', conditionEn: 'Focus on both Saturday and Sunday', emoji: '⚔️' },
  { id: 'S10', series: 'streak', nameZh: '西瓜元年', nameEn: 'Year One', descZh: '一整年，你和西瓜时钟一起走过了四季 🎂', descEn: 'A full year with Watermelon Clock 🎂', conditionZh: '首次使用满 365 天', conditionEn: '365 days since first use', emoji: '🎂', target: 365 },
];

// ⏱️ 专注系列 (Focus)
export const FOCUS_ACHIEVEMENTS: AchievementDef[] = [
  { id: 'F1', series: 'focus', nameZh: '第一颗西瓜', nameEn: 'First Melon', descZh: '每一段旅程都从第一步开始 🌱', descEn: 'Every journey begins with a single step 🌱', conditionZh: '完成第 1 次专注', conditionEn: 'Complete 1 session', emoji: '🌱', target: 1, progressKey: 'totalSessions' },
  { id: 'F2', series: 'focus', nameZh: '专注新手', nameEn: 'Focus Rookie', descZh: '一小时的专注，一小时的成长', descEn: 'One hour of focus, one hour of growth', conditionZh: '累计专注 1 小时', conditionEn: '1 hour total focus', emoji: '⏰', target: 60, progressKey: 'totalFocusMinutes' },
  { id: 'F3', series: 'focus', nameZh: '专注达人', nameEn: 'Focus Pro', descZh: '十个小时，你的西瓜田已经初具规模', descEn: 'Ten hours — your melon field is taking shape', conditionZh: '累计专注 10 小时', conditionEn: '10 hours total focus', emoji: '🎯', target: 600, progressKey: 'totalFocusMinutes' },
  { id: 'F4', series: 'focus', nameZh: '专注大师', nameEn: 'Focus Master', descZh: '五十小时的浇灌，荒漠变绿洲', descEn: 'Fifty hours of nurturing — desert to oasis', conditionZh: '累计专注 50 小时', conditionEn: '50 hours total focus', emoji: '🏅', target: 3000, progressKey: 'totalFocusMinutes' },
  { id: 'F5', series: 'focus', nameZh: '专注传奇', nameEn: 'Focus Legend', descZh: '一百小时，你已经是时间的朋友', descEn: '100 hours — you are a friend of time', conditionZh: '累计专注 100 小时', conditionEn: '100 hours total focus', emoji: '🏆', target: 6000, progressKey: 'totalFocusMinutes' },
  { id: 'F6', series: 'focus', nameZh: '时间领主', nameEn: 'Time Lord', descZh: '时间在你手中不再流逝，而是绽放', descEn: 'Time doesn\'t pass — it blooms in your hands', conditionZh: '累计专注 500 小时', conditionEn: '500 hours total focus', emoji: '⏳', target: 30000, progressKey: 'totalFocusMinutes' },
  { id: 'F7', series: 'focus', nameZh: '深度潜水', nameEn: 'Deep Dive', descZh: '你潜入了专注的深海 🐋', descEn: 'You dove into the deep sea of focus 🐋', conditionZh: '单次专注 ≥45 分钟', conditionEn: 'Single session ≥45 min', emoji: '🐋' },
  { id: 'F8', series: 'focus', nameZh: '马拉松选手', nameEn: 'Marathon Runner', descZh: '九十分钟的极限专注，致敬你的意志力', descEn: '90 minutes of extreme focus — salute to your willpower', conditionZh: '单次专注 ≥90 分钟', conditionEn: 'Single session ≥90 min', emoji: '🏃' },
  { id: 'F9', series: 'focus', nameZh: '日产十瓜', nameEn: 'Ten-a-Day', descZh: '今天的西瓜田大丰收！', descEn: 'A bumper harvest today!', conditionZh: '一天完成 ≥10 次专注', conditionEn: '10+ sessions in one day', emoji: '🍉', target: 10, progressKey: 'todaySessions' },
  { id: 'F10', series: 'focus', nameZh: '项目达人', nameEn: 'Project Pro', descZh: '十个项目，你已经是项目管理高手', descEn: 'Ten projects — you\'re a project management pro', conditionZh: '完成 10 个项目', conditionEn: 'Complete 10 projects', emoji: '📋', target: 10, progressKey: 'totalProjects' },
];

// 🏠 瓜棚系列 (House) — display only
export const HOUSE_ACHIEVEMENTS: AchievementDef[] = [
  { id: 'H1', series: 'house', nameZh: '初次收获', nameEn: 'First Harvest', descZh: '', descEn: '', emoji: '🧺' },
  { id: 'H2', series: 'house', nameZh: '满园春色', nameEn: 'Full Garden', descZh: '', descEn: '', emoji: '🌸' },
  { id: 'H3', series: 'house', nameZh: '金瓜降临', nameEn: 'Golden Arrival', descZh: '', descEn: '', emoji: '✨' },
  { id: 'H4', series: 'house', nameZh: '金瓜收藏家', nameEn: 'Golden Collector', descZh: '', descEn: '', emoji: '💎' },
  { id: 'H5', series: 'house', nameZh: '仓库大亨', nameEn: 'Warehouse Tycoon', descZh: '', descEn: '', emoji: '🏭' },
  { id: 'H6', series: 'house', nameZh: '合成初体验', nameEn: 'First Synthesis', descZh: '', descEn: '', emoji: '⚗️' },
  { id: 'H7', series: 'house', nameZh: '合成大师', nameEn: 'Synthesis Master', descZh: '', descEn: '', emoji: '🧪' },
  { id: 'H8', series: 'house', nameZh: '第一刀', nameEn: 'First Slice', descZh: '', descEn: '', emoji: '🔪' },
  { id: 'H9', series: 'house', nameZh: '切瓜百刀', nameEn: 'Hundred Slices', descZh: '', descEn: '', emoji: '⚔️' },
  { id: 'H10', series: 'house', nameZh: '道具全收集', nameEn: 'Tool Collector', descZh: '', descEn: '', emoji: '🎒' },
];

// 🌱 农场系列 (Farm) — display only
export const FARM_ACHIEVEMENTS: AchievementDef[] = [
  { id: 'G1', series: 'farm', nameZh: '播种者', nameEn: 'First Planting', descZh: '', descEn: '', emoji: '🌱' },
  { id: 'G2', series: 'farm', nameZh: '第一次丰收', nameEn: 'First Farm Harvest', descZh: '', descEn: '', emoji: '🌾' },
  { id: 'G3', series: 'farm', nameZh: '种植百株', nameEn: 'Hundred Plants', descZh: '', descEn: '', emoji: '🌳' },
  { id: 'G4', series: 'farm', nameZh: '星系征服者', nameEn: 'Galaxy Conqueror', descZh: '', descEn: '', emoji: '🌌' },
  { id: 'G5', series: 'farm', nameZh: '图鉴大师', nameEn: 'Codex Master', descZh: '', descEn: '', emoji: '📖' },
  { id: 'G6', series: 'farm', nameZh: '外星人之友', nameEn: 'Alien Friend', descZh: '', descEn: '', emoji: '👽' },
  { id: 'G7', series: 'farm', nameZh: '瓜贼克星', nameEn: 'Thief Buster', descZh: '', descEn: '', emoji: '🛡️' },
  { id: 'G8', series: 'farm', nameZh: '不枯之田', nameEn: 'Evergreen Farm', descZh: '', descEn: '', emoji: '🌿' },
];

// 🌟 隐藏系列 (Hidden)
export const HIDDEN_ACHIEVEMENTS: AchievementDef[] = [
  { id: 'X1', series: 'hidden', nameZh: '时间旅行者', nameEn: 'Time Traveler', descZh: '你在时间的缝隙中完成了专注', descEn: 'You focused in the crack of time', emoji: '⏰' },
  { id: 'X2', series: 'hidden', nameZh: '情人节西瓜', nameEn: 'Valentine Melon', descZh: '爱与专注，都是甜蜜的', descEn: 'Love and focus — both are sweet', emoji: '💝' },
  { id: 'X3', series: 'hidden', nameZh: '音效探索家', nameEn: 'Sound Explorer', descZh: '你发现了声音的无限可能', descEn: 'You discovered infinite possibilities of sound', emoji: '🎵' },
  { id: 'X4', series: 'hidden', nameZh: '完美主义者', nameEn: 'Perfectionist', descZh: '连续完美，无一放弃', descEn: 'Perfect streak — never gave up', emoji: '💯' },
  { id: 'X5', series: 'hidden', nameZh: '全能玩家', nameEn: 'All-Rounder', descZh: '专注、收获、种植，样样精通', descEn: 'Focus, harvest, plant — master of all', emoji: '🎮' },
  { id: 'X6', series: 'hidden', nameZh: '午夜园丁', nameEn: 'Midnight Gardener', descZh: '深夜的西瓜田，只有你和星光', descEn: 'In the midnight garden, just you and starlight', emoji: '🌃' },
];

export const ALL_ACHIEVEMENTS: AchievementDef[] = [
  ...STREAK_ACHIEVEMENTS,
  ...FOCUS_ACHIEVEMENTS,
  ...HOUSE_ACHIEVEMENTS,
  ...FARM_ACHIEVEMENTS,
  ...HIDDEN_ACHIEVEMENTS,
];

export const ACHIEVEMENTS_BY_SERIES: Record<string, AchievementDef[]> = {
  streak: STREAK_ACHIEVEMENTS,
  focus: FOCUS_ACHIEVEMENTS,
  house: HOUSE_ACHIEVEMENTS,
  farm: FARM_ACHIEVEMENTS,
  hidden: HIDDEN_ACHIEVEMENTS,
};

export function getAchievementById(id: string): AchievementDef | undefined {
  return ALL_ACHIEVEMENTS.find(a => a.id === id);
}
