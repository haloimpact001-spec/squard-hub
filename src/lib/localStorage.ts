export interface SavedName {
  id: string;
  text: string;
  styleName: string;
  date: number;
}

export interface UserProfile {
  username: string;
  isPro: boolean;
  savedNames: SavedName[];
  createdAt: number;
  streak: number;
  tokens: number;
  lastLoginDate: string; // Format: YYYY-MM-DD
  hasGoldenStyle: boolean;
}

const STORAGE_KEY = 'squard_hub_user_data';

const defaultProfile: UserProfile = {
  username: 'Guest_Gamer',
  isPro: false,
  savedNames: [],
  createdAt: Date.now(),
  streak: 0,
  tokens: 0,
  lastLoginDate: '',
  hasGoldenStyle: false,
};

export function getUserProfile(): UserProfile {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (error) {
    console.error('Failed to parse user profile', error);
  }
  return defaultProfile;
}

export function saveUserProfile(profile: UserProfile): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function toggleProStatus(isPro: boolean): UserProfile {
  const profile = getUserProfile();
  profile.isPro = isPro;
  saveUserProfile(profile);
  return profile;
}

export function addSavedName(text: string, styleName: string): UserProfile {
  const profile = getUserProfile();
  if (profile.savedNames.some(n => n.text === text)) return profile;
  
  const newName: SavedName = { id: Date.now().toString(), text, styleName, date: Date.now() };
  profile.savedNames.unshift(newName);
  
  // Reward: Give 1 token for saving a name
  profile.tokens += 1;
  
  saveUserProfile(profile);
  return profile;
}

export function removeSavedName(id: string): UserProfile {
  const profile = getUserProfile();
  profile.savedNames = profile.savedNames.filter(n => n.id !== id);
  saveUserProfile(profile);
  return profile;
}

// --- ADDICTION LOOP FUNCTIONS ---

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

export function handleDailyLogin(): { isNewDay: boolean; profile: UserProfile } {
  const profile = getUserProfile();
  const today = getTodayString();
  
  if (profile.lastLoginDate === today) {
    return { isNewDay: false, profile };
  }

  // Check if it's consecutive (yesterday)
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (profile.lastLoginDate === yesterdayStr) {
    profile.streak += 1;
  } else {
    profile.streak = 1; // Reset streak
  }

  profile.lastLoginDate = today;
  profile.tokens += 2; // Daily login reward: 2 tokens
  saveUserProfile(profile);
  
  return { isNewDay: true, profile };
}

export function spinMysteryBox(): { success: boolean; profile: UserProfile; reward?: string } {
  const profile = getUserProfile();
  if (profile.tokens < 3) return { success: false, profile };

  profile.tokens -= 3;
  
  // 30% chance to get Golden Style, 70% chance to get Pro for 24h (simulated)
  const isGolden = Math.random() < 0.3;
  
  if (isGolden) {
    profile.hasGoldenStyle = true;
    saveUserProfile(profile);
    return { success: true, profile, reward: 'Golden Crown Style Unlocked! 👑' };
  } else {
    profile.isPro = true; // Temporary Pro
    saveUserProfile(profile);
    return { success: true, profile, reward: 'Pro Status Activated for 24h! ★' };
  }
}
// --- LOCALIZED MONETIZATION SIMULATION ---
export function simulatePayment(amountNaira: number): UserProfile {
  const profile = getUserProfile();
  
  // Exchange rate simulation: 100 Naira = 10 Tokens. Pro Upgrade = 500 Naira.
  if (amountNaira === 500) {
    profile.isPro = true;
    profile.tokens += 50; // Bonus tokens for Pro
  } else {
    profile.tokens += Math.floor(amountNaira / 10);
  }
  
  saveUserProfile(profile);
  return profile;
}
// --- GAMER LOBBY & WAGERING ENGINE ---

export interface Match {
  id: string;
  host: string;
  game: string; // e.g., 'Free Fire', 'DLS'
  wager: number;
  status: 'open' | 'completed' | 'cancelled';
  winner?: string;
  createdAt: number;
}

export function getWalletBalance(): number {
  const profile = getUserProfile();
  // Give new users 100 starting coins
  if (profile.tokens === 0 && profile.createdAt > Date.now() - 10000) {
    profile.tokens = 100;
    saveUserProfile(profile);
  }
  return profile.tokens;
}

export function deductCoins(amount: number): boolean {
  const profile = getUserProfile();
  if (profile.tokens < amount) return false;
  profile.tokens -= amount;
  saveUserProfile(profile);
  return true;
}

export function addCoins(amount: number): void {
  const profile = getUserProfile();
  profile.tokens += amount;
  saveUserProfile(profile);
}

const MATCHES_KEY = 'squard_hub_matches';

export function getMatches(): Match[] {
  try {
    const data = localStorage.getItem(MATCHES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function createMatch(host: string, game: string, wager: number): Match | null {
  if (!deductCoins(wager)) return null; // Host must lock in their wager

  const matches = getMatches();
  const newMatch: Match = {
    id: Date.now().toString(),
    host,
    game,
    wager,
    status: 'open',
    createdAt: Date.now(),
  };
  matches.unshift(newMatch);
  localStorage.setItem(MATCHES_KEY, JSON.stringify(matches));
  return newMatch;
}

export function settleMatch(matchId: string, winnerName: string): boolean {
  const matches = getMatches();
  const matchIndex = matches.findIndex(m => m.id === matchId);
  
  if (matchIndex === -1 || matches[matchIndex].status !== 'open') return false;

  const match = matches[matchIndex];
  match.status = 'completed';
  match.winner = winnerName;

  // Payout logic: Winner gets their wager back + the opponent's wager (2x total)
  if (winnerName === match.host) {
    addCoins(match.wager * 2);
  } else {
    // If the challenger won, we just add the total pot to their wallet
    // (In a real app, the challenger's coins would have been deducted upon joining)
    addCoins(match.wager * 2); 
  }

  matches[matchIndex] = match;
  localStorage.setItem(MATCHES_KEY, JSON.stringify(matches));
  return true;
}