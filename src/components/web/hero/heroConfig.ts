import { 
  SiNextdotjs, 
  SiReact, 
  SiNodedotjs, 
  SiPostgresql, 
  SiTypescript, 
  SiDocker,
  SiTailwindcss,
  SiVuedotjs
} from 'react-icons/si';
import { FaAws } from 'react-icons/fa';

export const heroConfig = {
  // KPI Card Config
  kpi: {
    title: 'Success Rate',
    value: '98%',
    stats: [
      { label: 'Projects Delivered', value: '120+' },
      { label: 'Global Clients', value: '50+' },
      { label: 'Uptime SLA', value: '99.99%' },
      { label: 'Code Commits', value: '10k+' }
    ],
    intervalMs: 1500
  },

  // Terminal Config
  terminal: {
    lines: [
      { text: "> Initializing Project...", isAction: true },
      { text: "✓ Planning", isCheck: true },
      { text: "✓ Designing", isCheck: true },
      { text: "✓ Development", isCheck: true },
      { text: "✓ Testing", isCheck: true },
      { text: "✓ Optimization", isCheck: true },
      { text: "> Deploying...", isAction: true },
      { text: "Live ✓", isCheck: true }
    ],
    typingSpeedMs: 30,
    lineDelayMs: 150,
    restartDelayMs: 1800
  },

  // Dashboard Config
  dashboard: {
    title: 'Live Metrics',
    dropdownLabel: 'Real-time ⌄',
    sets: [
      {
        metrics: { performance: 98, seo: 100, accessibility: 100 },
        growthVal: '+327%',
        growthLbl: 'Traffic Growth',
        labels: { performance: 'Performance', seo: 'SEO', accessibility: 'Accessibility' }
      },
      {
        metrics: { performance: 94, seo: 92, accessibility: 98 },
        growthVal: '+142%',
        growthLbl: 'Conversion Rate',
        labels: { performance: 'Conversion', seo: 'Engagement', accessibility: 'Retention' }
      },
      {
        metrics: { performance: 99, seo: 97, accessibility: 99 },
        growthVal: '+215%',
        growthLbl: 'Revenue Growth',
        labels: { performance: 'Reliability', seo: 'Security', accessibility: 'Scalability' }
      }
    ],
    intervalMs: 2200,
    animationDurationMs: 700
  },

  // Orbital Tech Icons
  orbitalIcons: [
    { icon: SiNextdotjs, color: '#000000', size: 24 },
    { icon: SiNodedotjs, color: '#339933', size: 24 },
    { icon: SiTypescript, color: '#3178C6', size: 20 },
    { icon: SiTailwindcss, color: '#06B6D4', size: 24 },
    { icon: SiVuedotjs, color: '#4FC08D', size: 24 },
    { icon: SiPostgresql, color: '#4169E1', size: 24 },
    { icon: FaAws, color: '#232F3E', size: 24 },
    { icon: SiDocker, color: '#2496ED', size: 24 },
    { icon: SiReact, color: '#61DAFB', size: 24 }
  ],

  // Browser Config
  browser: {
    domain: 'shofarx.com',
    slideDurationMs: 2200
  }
};
