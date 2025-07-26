export const colors = {
  // Primary Colors - Mint Green Theme
  primary: '#4ECDC4',
  primaryDark: '#26A69A',
  primaryLight: '#80CBC4',

  // Gray Scale
  dark: '#2C3E50',
  medium: '#34495E',
  light: '#7F8C8D',
  lighter: '#BDC3C7',
  lightest: '#F8F9FA',

  // Background
  background: '#F5F7FA',
  white: '#FFFFFF',
  overlay: 'rgba(78, 205, 196, 0.3)',

  // Status Colors
  success: '#27AE60',
  successLight: '#2ECC71',
  warning: '#F39C12',
  warningLight: '#F1C40F',
  error: '#E74C3C',
  errorLight: '#E67E22',
  info: '#4ECDC4',
  infoLight: '#80CBC4',

  // Sticker Colors
  stickerGold: '#FFD700',
  stickerBackground: '#F0F8F7',
  stickerBorder: '#4ECDC4',

  // Social Colors
  follow: '#4ECDC4',
  unfollow: '#7F8C8D',

  // Goal Mode Colors
  personal: '#4ECDC4',
  competition: '#E74C3C',
  challenger: '#27AE60',

  // Progress Colors
  progressBackground: '#E8F5F3',
  progressFill: '#4ECDC4',
  progressComplete: '#27AE60',

  // Border Colors
  border: '#E8F5F3',
  borderLight: '#F5F7FA',
  borderDark: '#B2DFDB',

  // Component Specific Colors
  components: {
    // Floating Action Button
    fab: {
      background: '#4ECDC4',
      shadow: '#4ECDC4',
      border: '#FFFFFF',
    },
    // Goal Card
    goalCard: {
      background: '#FFFFFF',
      shadow: '#4ECDC4',
      border: '#80CBC4',
      avatar: {
        background: '#4ECDC4',
        border: '#80CBC4',
      },
      title: '#4ECDC4',
      description: '#34495E',
      progress: {
        background: '#E8F5F3',
        fill: '#4ECDC4',
      },
      button: {
        background: '#4ECDC4',
        text: '#FFFFFF',
        shadow: '#4ECDC4',
      },
      participant: {
        background: '#4ECDC4',
        text: '#FFFFFF',
      },
    },
    // Navigation
    navigation: {
      active: '#4ECDC4',
      inactive: '#80CBC4',
      shadow: '#4ECDC4',
    },
    // Tab View
    tabView: {
      active: '#4ECDC4',
      inactive: '#2C3E50',
      indicator: '#4ECDC4',
    },
    // Goal Detail Screen
    goalDetail: {
      background: '#F5F7FA',
      header: {
        background: '#E8F5F3',
        shadow: '#4ECDC4',
        title: '#4ECDC4',
        description: '#34495E',
      },
      card: {
        background: '#FFFFFF',
        shadow: '#4ECDC4',
        border: '#E8F5F3',
      },
      info: {
        background: '#F0F8F7',
        label: '#34495E',
        value: '#4ECDC4',
      },
      section: {
        title: '#4ECDC4',
        participant: {
          background: '#F0F8F7',
          border: '#E8F5F3',
          text: '#34495E',
        },
      },
      modal: {
        overlay: 'rgba(78, 205, 196, 0.3)',
        background: '#FFFFFF',
        shadow: '#4ECDC4',
        border: '#E8F5F3',
        title: '#4ECDC4',
        button: {
          background: '#4ECDC4',
          text: '#FFFFFF',
          cancel: '#BDC3C7',
        },
      },
      input: {
        background: '#F0F8F7',
        border: '#E8F5F3',
        text: '#34495E',
        placeholder: '#7F8C8D',
      },
      sticker: {
        background: '#F0F8F7',
        border: '#E8F5F3',
        title: '#4ECDC4',
        text: '#34495E',
        button: {
          background: '#4ECDC4',
          text: '#FFFFFF',
          shadow: '#4ECDC4',
        },
      },
      avatar: {
        background: '#E8F5F3',
        border: '#B2DFDB',
        text: '#4ECDC4',
      },
    },
    // Goal List
    goalList: {
      background: '#FFFFFF',
      shadow: '#4ECDC4',
      border: '#E8F5F3',
      completed: {
        background: '#E6FFE6',
        border: '#27AE60',
        shadow: '#27AE60',
        badge: {
          background: '#27AE60',
          border: '#2ECC71',
          text: '#FFFFFF',
        },
      },
      header: {
        icon: {
          background: '#E8F5F3',
          border: '#B2DFDB',
        },
        title: '#4ECDC4',
        mode: '#34495E',
      },
      badge: {
        participant: {
          background: '#4ECDC4',
          text: '#FFFFFF',
          shadow: '#4ECDC4',
        },
      },
      info: {
        background: '#F0F8F7',
        sticker: '#4ECDC4',
        creator: '#34495E',
      },
      participants: {
        background: '#F0F8F7',
        border: '#E8F5F3',
        title: '#4ECDC4',
        name: '#34495E',
        sticker: '#4ECDC4',
        more: '#34495E',
      },
      empty: {
        background: '#FFFFFF',
        shadow: '#4ECDC4',
        border: '#E8F5F3',
        title: '#4ECDC4',
        text: '#BDC3C7',
        subtext: '#34495E',
      },
    },
  },
} as const;

export type ColorKeys = keyof typeof colors;
