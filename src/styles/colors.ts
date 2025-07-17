export const colors = {
  // Primary Colors
  primary: '#FF6B9D',
  primaryDark: '#E91E63',
  primaryLight: '#FF8FA3',

  // Gray Scale
  dark: '#8E44AD',
  medium: '#8E44AD',
  light: '#9B59B6',
  lighter: '#BDC3C7',
  lightest: '#FFE5F0',

  // Background
  background: '#FFF5F7',
  white: '#FFFFFF',
  overlay: 'rgba(255, 107, 157, 0.3)',

  // Status Colors
  success: '#27AE60',
  successLight: '#2ECC71',
  warning: '#F39C12',
  warningLight: '#F1C40F',
  error: '#E74C3C',
  errorLight: '#E67E22',
  info: '#FF6B9D',
  infoLight: '#FF8FA3',

  // Sticker Colors
  stickerGold: '#FFD700',
  stickerBackground: '#FFF8E1',
  stickerBorder: '#FFD700',

  // Social Colors
  follow: '#FF6B9D',
  unfollow: '#8E44AD',

  // Goal Mode Colors
  personal: '#9B59B6',
  competition: '#E74C3C',
  challenger: '#27AE60',

  // Progress Colors
  progressBackground: '#FFE5F0',
  progressFill: '#FF6B9D',
  progressComplete: '#27AE60',

  // Border Colors
  border: '#FFE5F0',
  borderLight: '#FFF5F7',
  borderDark: '#FFD1DC',
} as const;

export type ColorKeys = keyof typeof colors;
