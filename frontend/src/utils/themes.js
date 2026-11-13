export const THEMES = [
  {
    id: 'teal',
    name: 'Executive Teal',
    category: 'Light Theme',
    desc: 'Ice Blue canvas with Deep Navy sidebar and Neon Cyan highlights',
    type: 'light',
    previewColors: ['#031B35', '#006B83', '#00E5FF', '#EFF8FF'],
    palette: {
      bg: '#EFF8FF',
      sidebar: '#031B35',
      sidebarBorder: '#0b294c',
      sidebarActive: 'linear-gradient(to right, #006B83, #004d61)',
      sidebarActiveBorder: '#00E5FF',
      nav: 'rgba(255, 255, 255, 0.96)',
      navBorder: '#DCEAF5',
      card: '#FFFFFF',
      cardBorder: '#DCEAF5',
      cardHover: '#006B83',
      cardSoft: '#EFF8FF',
      text: '#102A43',
      textMuted: '#64748B',
      primary: '#006B83',
      primaryHover: '#005569',
      primaryText: '#FFFFFF',
      accent: '#00E5FF',
      badgeBg: 'rgba(0, 229, 255, 0.15)',
      badgeText: '#006B83',
      heroGrad: 'linear-gradient(to right, #031B35, #004B63, #006B83)'
    }
  },
  {
    id: 'midnight',
    name: 'Midnight Cyber',
    category: 'Dark Theme',
    desc: 'Deep futuristic obsidian with glowing cyan and electric blue accents',
    type: 'dark',
    previewColors: ['#030712', '#0C182F', '#00E5FF', '#060D1A'],
    palette: {
      bg: '#060D1A',
      sidebar: '#030712',
      sidebarBorder: '#13233F',
      sidebarActive: 'linear-gradient(to right, #0E3B64, #082846)',
      sidebarActiveBorder: '#00E5FF',
      nav: 'rgba(12, 24, 47, 0.96)',
      navBorder: '#192E52',
      card: '#0C182F',
      cardBorder: '#192E52',
      cardHover: '#00E5FF',
      cardSoft: '#112242',
      text: '#F1F5F9',
      textMuted: '#94A3B8',
      primary: '#00E5FF',
      primaryHover: '#38BDF8',
      primaryText: '#030712',
      accent: '#00E5FF',
      badgeBg: 'rgba(0, 229, 255, 0.2)',
      badgeText: '#00E5FF',
      heroGrad: 'linear-gradient(to right, #020617, #0A1E3F, #0E3B64)'
    }
  },
  {
    id: 'purple',
    name: 'Royal Indigo',
    category: 'Dark Theme',
    desc: 'Luxury amethyst & deep purple SaaS with vibrant neon violet glow',
    type: 'dark',
    previewColors: ['#0A0817', '#1A1535', '#A855F7', '#0F0C20'],
    palette: {
      bg: '#0F0C20',
      sidebar: '#0A0817',
      sidebarBorder: '#2A204D',
      sidebarActive: 'linear-gradient(to right, #581C87, #3B0764)',
      sidebarActiveBorder: '#C084FC',
      nav: 'rgba(26, 21, 53, 0.96)',
      navBorder: '#2E2555',
      card: '#1A1535',
      cardBorder: '#2E2555',
      cardHover: '#A855F7',
      cardSoft: '#231D45',
      text: '#F8FAFC',
      textMuted: '#A5B4FC',
      primary: '#9333EA',
      primaryHover: '#7E22CE',
      primaryText: '#FFFFFF',
      accent: '#C084FC',
      badgeBg: 'rgba(168, 85, 247, 0.2)',
      badgeText: '#C084FC',
      heroGrad: 'linear-gradient(to right, #0A0817, #2E1065, #581C87)'
    }
  },
  {
    id: 'slate',
    name: 'Obsidian Slate',
    category: 'Dark Theme',
    desc: 'Clean minimal developer aesthetic with charcoal slate & sky blue',
    type: 'dark',
    previewColors: ['#050811', '#151C2C', '#38BDF8', '#0B0F19'],
    palette: {
      bg: '#0B0F19',
      sidebar: '#050811',
      sidebarBorder: '#1F293D',
      sidebarActive: 'linear-gradient(to right, #1E293B, #0F172A)',
      sidebarActiveBorder: '#38BDF8',
      nav: 'rgba(21, 28, 44, 0.96)',
      navBorder: '#1F293D',
      card: '#151C2C',
      cardBorder: '#1F293D',
      cardHover: '#38BDF8',
      cardSoft: '#1C263B',
      text: '#F8FAFC',
      textMuted: '#94A3B8',
      primary: '#38BDF8',
      primaryHover: '#0284C7',
      primaryText: '#050811',
      accent: '#38BDF8',
      badgeBg: 'rgba(56, 189, 248, 0.15)',
      badgeText: '#38BDF8',
      heroGrad: 'linear-gradient(to right, #020617, #0F172A, #1E293B)'
    }
  },
  {
    id: 'emerald',
    name: 'Emerald Forest',
    category: 'Dark Theme',
    desc: 'Organic executive dark green palette with mint & radiant jade highlights',
    type: 'dark',
    previewColors: ['#02110D', '#0B2921', '#10B981', '#041A14'],
    palette: {
      bg: '#041A14',
      sidebar: '#02110D',
      sidebarBorder: '#164E3F',
      sidebarActive: 'linear-gradient(to right, #064E3B, #022C22)',
      sidebarActiveBorder: '#34D399',
      nav: 'rgba(11, 41, 33, 0.96)',
      navBorder: '#164E3F',
      card: '#0B2921',
      cardBorder: '#164E3F',
      cardHover: '#10B981',
      cardSoft: '#10392E',
      text: '#ECFDF5',
      textMuted: '#A7F3D0',
      primary: '#10B981',
      primaryHover: '#059669',
      primaryText: '#02110D',
      accent: '#34D399',
      badgeBg: 'rgba(52, 211, 153, 0.2)',
      badgeText: '#34D399',
      heroGrad: 'linear-gradient(to right, #02110D, #064E3B, #047857)'
    }
  },
  {
    id: 'corporate',
    name: 'Corporate Pure',
    category: 'Light Theme',
    desc: 'Crisp corporate white theme with royal blue accents & sharp typography',
    type: 'light',
    previewColors: ['#0F172A', '#FFFFFF', '#2563EB', '#F8FAFC'],
    palette: {
      bg: '#F8FAFC',
      sidebar: '#0F172A',
      sidebarBorder: '#1E293B',
      sidebarActive: 'linear-gradient(to right, #1E293B, #334155)',
      sidebarActiveBorder: '#2563EB',
      nav: 'rgba(255, 255, 255, 0.96)',
      navBorder: '#E2E8F0',
      card: '#FFFFFF',
      cardBorder: '#E2E8F0',
      cardHover: '#2563EB',
      cardSoft: '#F1F5F9',
      text: '#0F172A',
      textMuted: '#64748B',
      primary: '#2563EB',
      primaryHover: '#1D4ED8',
      primaryText: '#FFFFFF',
      accent: '#38BDF8',
      badgeBg: 'rgba(37, 99, 235, 0.12)',
      badgeText: '#2563EB',
      heroGrad: 'linear-gradient(to right, #0F172A, #1E3A8A, #2563EB)'
    }
  }
];

export const getThemeById = (id) => {
  return THEMES.find(t => t.id === id) || THEMES[0];
};

export const applyThemeToDocument = (theme) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const p = theme.palette;

  // Set CSS variables
  root.style.setProperty('--theme-bg', p.bg);
  root.style.setProperty('--theme-card', p.card);
  root.style.setProperty('--theme-card-border', p.cardBorder);
  root.style.setProperty('--theme-card-soft', p.cardSoft);
  root.style.setProperty('--theme-sidebar', p.sidebar);
  root.style.setProperty('--theme-sidebar-border', p.sidebarBorder);
  root.style.setProperty('--theme-nav', p.nav);
  root.style.setProperty('--theme-nav-border', p.navBorder);
  root.style.setProperty('--theme-text', p.text);
  root.style.setProperty('--theme-text-muted', p.textMuted);
  root.style.setProperty('--theme-primary', p.primary);
  root.style.setProperty('--theme-primary-hover', p.primaryHover);
  root.style.setProperty('--theme-primary-text', p.primaryText);
  root.style.setProperty('--theme-accent', p.accent);
  root.style.setProperty('--theme-hero-grad', p.heroGrad);

  // Set dark / light class
  if (theme.type === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
  }

  root.setAttribute('data-theme', theme.id);
  document.body.style.backgroundColor = p.bg;
  document.body.style.color = p.text;
};
