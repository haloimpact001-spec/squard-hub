import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { ToolsHub } from './pages/ToolsHub';
import { NameGenerator } from './pages/NameGenerator';
import { StickerMaker } from './pages/StickerMaker';
import { Rewards } from './pages/Rewards';
import { Lobby } from './pages/Lobby';
import { GamerCard } from './pages/GamerCard';
import { Squads } from './pages/Squads';
import { SquadChat } from './pages/SquadChat';
import { Profile } from './pages/Profile'; // <-- ADDED IMPORT

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
        <Route path="squads" element={<Squads />} />
        <Route path="chat" element={<SquadChat />} />
        <Route path="profile" element={<Profile />} /> {/* <-- ADDED ROUTE */}
      </Route>
    </Routes>
  );
}

export default App;