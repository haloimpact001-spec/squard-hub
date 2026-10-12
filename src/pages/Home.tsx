import { HeroCarousel } from '../components/HeroCarousel';
import { NameWall } from '../features/names/NameWall';
import { AdSlot } from '../components/AdSlot';

export function Home() {
  return (
    <div style={{ width: '100%' }}>
      <HeroCarousel />
      
      <div className="container" style={{ padding: '3rem 16px' }}>
        <NameWall />
        <AdSlot />
      </div>
    </div>
  );
}