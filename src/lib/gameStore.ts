interface GameState {
  coins: number;
  gems: number;
  level: number;
  exp: number;
  expToNextLevel: number;
  clickPower: number;
  totalClicks: number;
  
  upgrades: {
    autoClicker: number;
    clickMultiplier: number;
    coinBoost: number;
    gemBoost: number;
    megaTap: number;
  };

  dailyTasks: DailyTask[];
  completedTasks: string[];
  lastTaskReset: string;

  referrals: Referral[];
  referralCode: string;
  referralRewards: number;

  purchases: Purchase[];
  
  stats: {
    totalCoinsEarned: number;
    totalGemsEarned: number;
    totalTaps: number;
    daysPlayed: number;
    lastLogin: string;
  };

  leaderboard: LeaderboardEntry[];
}

interface DailyTask {
  id: string;
  title: string;
  description: string;
  reward: { coins?: number; gems?: number };
  progress: number;
  target: number;
  completed: boolean;
  type: 'taps' | 'coins' | 'level' | 'login';
}

interface Referral {
  code: string;
  username: string;
  date: string;
  reward: number;
}

interface Purchase {
  id: string;
  name: string;
  cost: { coins?: number; gems?: number };
  type: 'upgrade' | 'boost' | 'cosmetic';
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  level: number;
  totalClicks: number;
  coins: number;
}

const STORAGE_KEY = 'eric_bdsm_game_state';

const generateReferralCode = (): string => {
  return 'ERIC' + Math.random().toString(36).substring(2, 8).toUpperCase();
};

const calculateExpForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

const getDefaultState = (): GameState => {
  const now = new Date().toISOString();
  return {
    coins: 0,
    gems: 0,
    level: 1,
    exp: 0,
    expToNextLevel: calculateExpForLevel(1),
    clickPower: 1,
    totalClicks: 0,
    
    upgrades: {
      autoClicker: 0,
      clickMultiplier: 0,
      coinBoost: 0,
      gemBoost: 0,
      megaTap: 0,
    },

    dailyTasks: generateDailyTasks(),
    completedTasks: [],
    lastTaskReset: now,

    referrals: [],
    referralCode: generateReferralCode(),
    referralRewards: 0,

    purchases: [],
    
    stats: {
      totalCoinsEarned: 0,
      totalGemsEarned: 0,
      totalTaps: 0,
      daysPlayed: 1,
      lastLogin: now,
    },

    leaderboard: generateMockLeaderboard(),
  };
};

const generateDailyTasks = (): DailyTask[] => {
  return [
    {
      id: 'daily_taps_100',
      title: 'Тапнуть 100 раз',
      description: 'Сделай 100 тапов',
      reward: { coins: 500 },
      progress: 0,
      target: 100,
      completed: false,
      type: 'taps',
    },
    {
      id: 'daily_taps_500',
      title: 'Тапнуть 500 раз',
      description: 'Сделай 500 тапов',
      reward: { coins: 2000, gems: 5 },
      progress: 0,
      target: 500,
      completed: false,
      type: 'taps',
    },
    {
      id: 'daily_coins_1000',
      title: 'Заработать 1000 монет',
      description: 'Собери 1000 монет за день',
      reward: { gems: 10 },
      progress: 0,
      target: 1000,
      completed: false,
      type: 'coins',
    },
    {
      id: 'daily_login',
      title: 'Ежедневный вход',
      description: 'Заходи каждый день',
      reward: { coins: 1000, gems: 5 },
      progress: 0,
      target: 1,
      completed: false,
      type: 'login',
    },
  ];
};

const generateMockLeaderboard = (): LeaderboardEntry[] => {
  const names = ['DarkMaster', 'NeonQueen', 'PurpleKing', 'ShadowLord', 'VioletVixen', 'ChainBreaker', 'MidnightRider', 'CrimsonDom'];
  return names.map((name, index) => ({
    rank: index + 2,
    username: name,
    level: Math.floor(Math.random() * 50) + 10,
    totalClicks: Math.floor(Math.random() * 100000) + 10000,
    coins: Math.floor(Math.random() * 1000000) + 50000,
  })).sort((a, b) => b.coins - a.coins).map((entry, index) => ({ ...entry, rank: index + 2 }));
};

export class GameStore {
  private state: GameState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadState();
    this.checkDailyReset();
    this.updateLoginStats();
    this.startAutoClicker();
  }

  private loadState(): GameState {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...getDefaultState(), ...parsed };
      }
    } catch (e) {
      console.error('Failed to load game state:', e);
    }
    return getDefaultState();
  }

  private saveState(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      this.notifyListeners();
    } catch (e) {
      console.error('Failed to save game state:', e);
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getState(): GameState {
    return { ...this.state };
  }

  private checkDailyReset(): void {
    const now = new Date();
    const lastReset = new Date(this.state.lastTaskReset);
    
    if (now.getDate() !== lastReset.getDate() || now.getMonth() !== lastReset.getMonth()) {
      this.state.dailyTasks = generateDailyTasks();
      this.state.completedTasks = [];
      this.state.lastTaskReset = now.toISOString();
      this.saveState();
    }
  }

  private updateLoginStats(): void {
    const now = new Date();
    const lastLogin = new Date(this.state.stats.lastLogin);
    
    if (now.getDate() !== lastLogin.getDate() || now.getMonth() !== lastLogin.getMonth()) {
      this.state.stats.daysPlayed += 1;
      this.state.stats.lastLogin = now.toISOString();
      
      const loginTask = this.state.dailyTasks.find(t => t.type === 'login');
      if (loginTask && !loginTask.completed) {
        loginTask.progress = 1;
        this.checkTaskCompletion(loginTask);
      }
      
      this.saveState();
    }
  }

  tap(): void {
    const coinsEarned = this.state.clickPower * (1 + this.state.upgrades.clickMultiplier * 0.5);
    this.state.coins += coinsEarned;
    this.state.totalClicks += 1;
    this.state.stats.totalTaps += 1;
    this.state.stats.totalCoinsEarned += coinsEarned;

    this.addExp(1);

    const tapTasks = this.state.dailyTasks.filter(t => t.type === 'taps' && !t.completed);
    tapTasks.forEach(task => {
      task.progress += 1;
      this.checkTaskCompletion(task);
    });

    const coinTasks = this.state.dailyTasks.filter(t => t.type === 'coins' && !t.completed);
    coinTasks.forEach(task => {
      task.progress += coinsEarned;
      this.checkTaskCompletion(task);
    });

    this.saveState();
  }

  private addExp(amount: number): void {
    this.state.exp += amount;
    
    while (this.state.exp >= this.state.expToNextLevel) {
      this.state.exp -= this.state.expToNextLevel;
      this.levelUp();
    }
  }

  private levelUp(): void {
    this.state.level += 1;
    this.state.expToNextLevel = calculateExpForLevel(this.state.level);
    this.state.clickPower += 1;
    this.state.gems += 10;
    this.state.stats.totalGemsEarned += 10;
  }

  private checkTaskCompletion(task: DailyTask): void {
    if (task.progress >= task.target && !task.completed) {
      task.completed = true;
      this.state.completedTasks.push(task.id);
      
      if (task.reward.coins) {
        this.state.coins += task.reward.coins;
        this.state.stats.totalCoinsEarned += task.reward.coins;
      }
      if (task.reward.gems) {
        this.state.gems += task.reward.gems;
        this.state.stats.totalGemsEarned += task.reward.gems;
      }
    }
  }

  purchaseUpgrade(upgradeType: keyof GameState['upgrades'], cost: { coins?: number; gems?: number }): boolean {
    if (cost.coins && this.state.coins < cost.coins) return false;
    if (cost.gems && this.state.gems < cost.gems) return false;

    if (cost.coins) this.state.coins -= cost.coins;
    if (cost.gems) this.state.gems -= cost.gems;

    this.state.upgrades[upgradeType] += 1;

    if (upgradeType === 'clickMultiplier') {
      this.state.clickPower = 1 + this.state.upgrades.clickMultiplier;
    }

    this.saveState();
    return true;
  }

  addReferral(code: string, username: string): void {
    const reward = 5000;
    this.state.referrals.push({
      code,
      username,
      date: new Date().toISOString(),
      reward,
    });
    this.state.referralRewards += reward;
    this.state.coins += reward;
    this.state.gems += 50;
    this.saveState();
  }

  private startAutoClicker(): void {
    setInterval(() => {
      if (this.state.upgrades.autoClicker > 0) {
        const autoCoins = this.state.upgrades.autoClicker * 0.5;
        this.state.coins += autoCoins;
        this.state.stats.totalCoinsEarned += autoCoins;
        this.saveState();
      }
    }, 1000);
  }

  getLeaderboard(): LeaderboardEntry[] {
    const userEntry: LeaderboardEntry = {
      rank: 1,
      username: 'ТЫ',
      level: this.state.level,
      totalClicks: this.state.totalClicks,
      coins: this.state.coins,
    };
    
    return [userEntry, ...this.state.leaderboard];
  }
}

export const gameStore = new GameStore();
