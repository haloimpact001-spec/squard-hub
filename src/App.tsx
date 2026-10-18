import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { NameGenerator } from './pages/NameGenerator';
import { StickerMaker } from './pages/StickerMaker';
import { Rewards } from './pages/Rewards';
import { Lobby } from './pages/Lobby';
import { GamerCard } from './pages/GamerCard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="names" element={<NameGenerator />} />
        <Route path="stickers" element={<StickerMaker />} />
        <Route path="rewards" element={<Rewards />} />
        <Route path="lobby" element={<Lobby />} />
        <Route path="card" element={<GamerCard />} />
      </Route>
    </Routes>
  );
}

export default App;