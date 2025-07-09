export const colors = {
    // Primary Colors
    primary: '#4A90E2',
    primaryDark: '#357ABD',
    primaryLight: '#6BA3E8',
  
    // Gray Scale
    dark: '#2C3E50',
    medium: '#7F8C8D',
    light: '#95A5A6',
    lighter: '#BDC3C7',
    lightest: '#E0E6ED',
  
    // Background
    background: '#F8F9FA',
    white: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.5)',
  
    // Status Colors
    success: '#27AE60',
    successLight: '#2ECC71',
    warning: '#F39C12',
    warningLight: '#F1C40F',
    error: '#E74C3C',
    errorLight: '#E67E22',
    info: '#3498DB',
    infoLight: '#5DADE2',
  
    // Sticker Colors
    stickerGold: '#F39C12',
    stickerBackground: '#FFF3CD',
    stickerBorder: '#F1C40F',
  
    // Social Colors
    follow: '#3498DB',
    unfollow: '#95A5A6',
    
    // Goal Mode Colors
    personal: '#9B59B6',
    competition: '#E74C3C',
    challenger: '#27AE60',
  
    // Progress Colors
    progressBackground: '#E9ECEF',
    progressFill: '#4A90E2',
    progressComplete: '#27AE60',
  
    // Border Colors
    border: '#E0E6ED',
    borderLight: '#F8F9FA',
    borderDark: '#BDC3C7',
  } as const;
  
  export type ColorKeys = keyof typeof colors;