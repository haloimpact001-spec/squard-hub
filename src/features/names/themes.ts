import { lazy } from 'react';

export interface Theme {
  id: string;
  name: string;
  accent: string;
  accentGlow: string;
  Background: React.LazyExoticComponent<React.ComponentType>;
  frameStyle: React.CSSProperties;
  badgeColor: string;
}

const BackgroundBattleRoyale = lazy(() => import('./BackgroundBattleRoyale'));
const BackgroundFootballNight = lazy(() => import('./BackgroundFootballNight'));
const BackgroundCityLife = lazy(() => import('./BackgroundCityLife'));

export const themes: Theme[] = [
  {
    id: 'battle-royale',
    name: 'Battle Royale',
    accent: '#ff6b35',
    accentGlow: 'rgba(255, 107, 53, 0.6)',
    Background: BackgroundBattleRoyale,
    badgeColor: '#ff6b35',
    frameStyle: {
      border: '3px solid #ff6b35',
      borderRadius: '4px',
      clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
      boxShadow: '0 0 30px rgba(255, 107, 53, 0.4), inset 0 0 20px rgba(255, 107, 53, 0.1)'
    }
  },
  {
    id: 'football-night',
    name: 'Football Night',
    accent: '#fff4a3',
    accentGlow: 'rgba(255, 244, 163, 0.6)',
    Background: BackgroundFootballNight,
    badgeColor: '#fff4a3',
    frameStyle: {
      border: '3px solid #fff4a3',
      borderRadius: '16px',
      boxShadow: '0 0 30px rgba(255, 244, 163, 0.4), inset 0 0 20px rgba(255, 244, 163, 0.1)'
    }
  },
  {
    id: 'city-life',
    name: 'City Life',
    accent: '#ffb347',
    accentGlow: 'rgba(255, 179, 71, 0.6)',
    Background: BackgroundCityLife,
    badgeColor: '#ffb347',
    frameStyle: {
      border: '3px solid #ffb347',
      borderRadius: '8px',
      boxShadow: '0 0 30px rgba(255, 179, 71, 0.4), inset 0 0 20px rgba(255, 179, 71, 0.1)'
    }
  }
];