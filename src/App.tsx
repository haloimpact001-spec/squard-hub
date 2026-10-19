import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { ToolsHub } from './pages/ToolsHub';
import { NameGenerator } from './pages/NameGenerator';
import { StickerMaker } from './pages/StickerMaker';
import { Rewards } from './pages/Rewards';
import { Lobby } from './pages/Lobby';
import { GamerCard } from './pages/GamerCard';
import { Squads } from './pages/Squads'; // <-- ENSURE THIS IS HERE
import { SquadChat } from './pages/SquadChat';
   // ... inside Routes:
   <Route path="chat" element={<SquadChat />} />

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="tools" element={<ToolsHub />} />
        <Route path="names" element={<NameGenerator />} />
        <Route path="stickers" element={<StickerMaker />} />
        <Route path="rewards" element={<Rewards />} />
        <Route path="lobby" element={<Lobby />} />
        <Route path="card" element={<GamerCard />} />
        <Route path="squads" element={<Squads />} /> {/* <-- ENSURE THIS IS HERE */}
        <Route path="chat" element={<SquadChat />} />
      </Route>
    </Routes>
  );
}

export default App;