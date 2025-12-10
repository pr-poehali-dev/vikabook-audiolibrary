import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { gameStore } from '@/lib/gameStore';

export default function Index() {
  const [gameState, setGameState] = useState(gameStore.getState());
  const [showFloatingCoins, setShowFloatingCoins] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [activeTab, setActiveTab] = useState('game');
  const [selectedShopItem, setSelectedShopItem] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = gameStore.subscribe(() => {
      setGameState(gameStore.getState());
    });
    return unsubscribe;
  }, []);

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    gameStore.tap();
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const coinId = Date.now() + Math.random();
    setShowFloatingCoins(prev => [...prev, { id: coinId, x, y }]);
    
    setTimeout(() => {
      setShowFloatingCoins(prev => prev.filter(c => c.id !== coinId));
    }, 1000);
  };

  const shopItems = [
    {
      id: 'click_mult_1',
      name: 'Усилитель тапа',
      description: 'Увеличивает силу каждого тапа на 50%',
      cost: { coins: 1000 },
      level: gameState.upgrades.clickMultiplier,
      type: 'clickMultiplier' as const,
      icon: 'Zap',
    },
    {
      id: 'auto_clicker_1',
      name: 'Авто-кликер',
      description: 'Автоматически добавляет монеты каждую секунду',
      cost: { coins: 5000 },
      level: gameState.upgrades.autoClicker,
      type: 'autoClicker' as const,
      icon: 'Repeat',
    },
    {
      id: 'coin_boost_1',
      name: 'Монетный бустер',
      description: 'Увеличивает получаемые монеты на 25%',
      cost: { coins: 3000 },
      level: gameState.upgrades.coinBoost,
      type: 'coinBoost' as const,
      icon: 'Coins',
    },
  ];

  const vipShopItems = [
    {
      id: 'mega_tap',
      name: 'Мега-тап',
      description: 'Каждый 10-й тап дает x10 монет',
      cost: { gems: 100 },
      level: gameState.upgrades.megaTap,
      type: 'megaTap' as const,
      icon: 'Sparkles',
    },
    {
      id: 'gem_boost',
      name: 'Гем-бустер',
      description: 'Увеличивает получаемые гемы на 50%',
      cost: { gems: 150 },
      level: gameState.upgrades.gemBoost,
      type: 'gemBoost' as const,
      icon: 'Gem',
    },
  ];

  const handlePurchase = (item: any) => {
    const newCost = {
      coins: item.cost.coins ? item.cost.coins * Math.pow(1.5, item.level) : undefined,
      gems: item.cost.gems ? item.cost.gems * Math.pow(1.5, item.level) : undefined,
    };
    
    const success = gameStore.purchaseUpgrade(item.type, newCost);
    if (success) {
      setSelectedShopItem(null);
    }
  };

  const expPercent = (gameState.exp / gameState.expToNextLevel) * 100;
  const leaderboard = gameStore.getLeaderboard();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-pink-950">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <header className="text-center mb-6">
          <h1 className="text-5xl md:text-7xl font-bold neon-glow text-purple-300 mb-2 animate-pulse-neon">
            ERIC BDSM
          </h1>
          <p className="text-lg text-purple-400">Легендарная тапалка</p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Card className="bg-purple-950/50 border-purple-700 p-4 neon-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-purple-300">Монеты</p>
                <p className="text-2xl font-bold text-yellow-400">{Math.floor(gameState.coins)}</p>
              </div>
              <Icon name="Coins" size={32} className="text-yellow-400" />
            </div>
          </Card>

          <Card className="bg-purple-950/50 border-pink-700 p-4 neon-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-pink-300">Гемы</p>
                <p className="text-2xl font-bold text-pink-400">{gameState.gems}</p>
              </div>
              <Icon name="Gem" size={32} className="text-pink-400" />
            </div>
          </Card>

          <Card className="bg-purple-950/50 border-purple-700 p-4 neon-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-purple-300">Уровень</p>
                <p className="text-2xl font-bold text-purple-300">{gameState.level}</p>
              </div>
              <Icon name="Crown" size={32} className="text-purple-300" />
            </div>
          </Card>

          <Card className="bg-purple-950/50 border-purple-700 p-4 neon-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-purple-300">Тапы</p>
                <p className="text-2xl font-bold text-white">{gameState.totalClicks}</p>
              </div>
              <Icon name="MousePointerClick" size={32} className="text-white" />
            </div>
          </Card>
        </div>

        <Card className="bg-purple-950/30 border-purple-700 p-4 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="TrendingUp" size={20} className="text-purple-400" />
            <span className="text-sm text-purple-300">Опыт до уровня {gameState.level + 1}</span>
          </div>
          <Progress value={expPercent} className="h-3 bg-purple-950" />
          <p className="text-xs text-purple-400 mt-1 text-right">
            {gameState.exp} / {gameState.expToNextLevel}
          </p>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-5 bg-purple-950/50 border border-purple-700">
            <TabsTrigger value="game" className="data-[state=active]:bg-purple-700">
              <Icon name="Gamepad2" size={20} />
            </TabsTrigger>
            <TabsTrigger value="tasks" className="data-[state=active]:bg-purple-700">
              <Icon name="ListTodo" size={20} />
            </TabsTrigger>
            <TabsTrigger value="shop" className="data-[state=active]:bg-purple-700">
              <Icon name="ShoppingBag" size={20} />
            </TabsTrigger>
            <TabsTrigger value="referral" className="data-[state=active]:bg-purple-700">
              <Icon name="Users" size={20} />
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-purple-700">
              <Icon name="Trophy" size={20} />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="game" className="mt-6">
            <div className="flex flex-col items-center">
              <div className="relative mb-6">
                <div
                  onClick={handleTap}
                  className="tap-button cursor-pointer animate-float relative"
                  style={{ width: '280px', height: '280px' }}
                >
                  <img
                    src="https://unlock-rent.ru/eric.jpg"
                    alt="Eric"
                    className="w-full h-full object-cover rounded-full border-8 border-purple-500 shadow-2xl"
                  />
                  {showFloatingCoins.map(coin => (
                    <div
                      key={coin.id}
                      className="absolute text-3xl font-bold text-yellow-400 neon-glow animate-slide-up pointer-events-none"
                      style={{ left: coin.x, top: coin.y }}
                    >
                      +{gameState.clickPower}
                    </div>
                  ))}
                </div>
              </div>

              <Card className="bg-purple-950/50 border-purple-700 p-6 w-full max-w-md">
                <h3 className="text-xl font-bold text-purple-300 mb-4 text-center neon-glow">
                  Статистика
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-300 flex items-center gap-2">
                      <Icon name="Zap" size={18} />
                      Сила тапа:
                    </span>
                    <span className="text-white font-bold">{gameState.clickPower}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-300 flex items-center gap-2">
                      <Icon name="Coins" size={18} />
                      Всего заработано:
                    </span>
                    <span className="text-yellow-400 font-bold">{Math.floor(gameState.stats.totalCoinsEarned)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-300 flex items-center gap-2">
                      <Icon name="MousePointerClick" size={18} />
                      Всего тапов:
                    </span>
                    <span className="text-white font-bold">{gameState.stats.totalTaps}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-300 flex items-center gap-2">
                      <Icon name="Calendar" size={18} />
                      Дней игры:
                    </span>
                    <span className="text-white font-bold">{gameState.stats.daysPlayed}</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="mt-6">
            <ScrollArea className="h-[500px]">
              <div className="space-y-4">
                {gameState.dailyTasks.map(task => (
                  <Card
                    key={task.id}
                    className={`p-4 border-2 ${
                      task.completed
                        ? 'bg-green-950/30 border-green-700'
                        : 'bg-purple-950/50 border-purple-700'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-bold text-white mb-1">{task.title}</h4>
                        <p className="text-sm text-purple-300">{task.description}</p>
                      </div>
                      {task.completed && (
                        <Icon name="CheckCircle2" size={24} className="text-green-400" />
                      )}
                    </div>
                    
                    <Progress
                      value={(task.progress / task.target) * 100}
                      className="h-2 mb-2"
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-purple-400">
                        {task.progress} / {task.target}
                      </span>
                      <div className="flex gap-2">
                        {task.reward.coins && (
                          <Badge className="bg-yellow-600">
                            <Icon name="Coins" size={12} className="mr-1" />
                            {task.reward.coins}
                          </Badge>
                        )}
                        {task.reward.gems && (
                          <Badge className="bg-pink-600">
                            <Icon name="Gem" size={12} className="mr-1" />
                            {task.reward.gems}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="shop" className="mt-6">
            <Tabs defaultValue="regular" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-purple-950/50 mb-4">
                <TabsTrigger value="regular">Магазин</TabsTrigger>
                <TabsTrigger value="vip">VIP Магазин</TabsTrigger>
              </TabsList>

              <TabsContent value="regular">
                <ScrollArea className="h-[500px]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {shopItems.map(item => {
                      const cost = item.cost.coins! * Math.pow(1.5, item.level);
                      return (
                        <Card
                          key={item.id}
                          className="bg-purple-950/50 border-purple-700 p-4 hover:border-purple-500 transition-all cursor-pointer"
                          onClick={() => setSelectedShopItem(item)}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-lg bg-purple-700/50 flex items-center justify-center">
                              <Icon name={item.icon as any} size={24} className="text-purple-300" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-white">{item.name}</h4>
                              <Badge className="bg-purple-700">Уровень {item.level}</Badge>
                            </div>
                          </div>
                          <p className="text-sm text-purple-300 mb-3">{item.description}</p>
                          <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                            <Icon name="Coins" size={16} className="mr-2" />
                            {Math.floor(cost)}
                          </Button>
                        </Card>
                      );
                    })}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="vip">
                <ScrollArea className="h-[500px]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vipShopItems.map(item => {
                      const cost = item.cost.gems! * Math.pow(1.5, item.level);
                      return (
                        <Card
                          key={item.id}
                          className="bg-gradient-to-br from-pink-950/50 to-purple-950/50 border-pink-700 p-4 hover:border-pink-500 transition-all cursor-pointer"
                          onClick={() => setSelectedShopItem(item)}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-lg bg-pink-700/50 flex items-center justify-center">
                              <Icon name={item.icon as any} size={24} className="text-pink-300" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-white">{item.name}</h4>
                              <Badge className="bg-pink-700">Уровень {item.level}</Badge>
                            </div>
                          </div>
                          <p className="text-sm text-pink-300 mb-3">{item.description}</p>
                          <Button className="w-full bg-gradient-to-r from-pink-600 to-purple-600">
                            <Icon name="Gem" size={16} className="mr-2" />
                            {Math.floor(cost)}
                          </Button>
                        </Card>
                      );
                    })}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="referral" className="mt-6">
            <Card className="bg-purple-950/50 border-purple-700 p-6 mb-6">
              <h3 className="text-2xl font-bold text-purple-300 mb-4 neon-glow text-center">
                Реферальная программа
              </h3>
              <div className="bg-purple-900/50 p-4 rounded-lg mb-4">
                <p className="text-sm text-purple-300 mb-2">Твой реферальный код:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={gameState.referralCode}
                    readOnly
                    className="flex-1 bg-purple-950 border border-purple-700 rounded px-4 py-2 text-white font-mono text-lg"
                  />
                  <Button
                    onClick={() => navigator.clipboard.writeText(gameState.referralCode)}
                    className="bg-purple-700"
                  >
                    <Icon name="Copy" size={20} />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-purple-900/30 border-purple-700 p-4 text-center">
                  <Icon name="Users" size={32} className="text-purple-300 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{gameState.referrals.length}</p>
                  <p className="text-sm text-purple-300">Рефералов</p>
                </Card>
                <Card className="bg-purple-900/30 border-purple-700 p-4 text-center">
                  <Icon name="Coins" size={32} className="text-yellow-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-yellow-400">{gameState.referralRewards}</p>
                  <p className="text-sm text-purple-300">Заработано</p>
                </Card>
                <Card className="bg-purple-900/30 border-purple-700 p-4 text-center">
                  <Icon name="Gift" size={32} className="text-pink-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-pink-400">5000</p>
                  <p className="text-sm text-purple-300">За реферала</p>
                </Card>
              </div>

              <div className="bg-purple-900/30 p-4 rounded-lg">
                <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                  <Icon name="Gift" size={20} />
                  Бонусы за рефералов
                </h4>
                <ul className="space-y-2 text-sm text-purple-300">
                  <li className="flex items-center gap-2">
                    <Icon name="CheckCircle2" size={16} className="text-green-400" />
                    5000 монет за каждого реферала
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="CheckCircle2" size={16} className="text-green-400" />
                    50 гемов за каждого реферала
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="CheckCircle2" size={16} className="text-green-400" />
                    5% от заработка рефералов
                  </li>
                </ul>
              </div>
            </Card>

            {gameState.referrals.length > 0 && (
              <Card className="bg-purple-950/50 border-purple-700 p-4">
                <h4 className="font-bold text-white mb-3">Твои рефералы</h4>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2">
                    {gameState.referrals.map((ref, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-purple-900/30 p-3 rounded"
                      >
                        <div>
                          <p className="text-white font-semibold">{ref.username}</p>
                          <p className="text-xs text-purple-400">
                            {new Date(ref.date).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className="bg-yellow-600">+{ref.reward}</Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="leaderboard" className="mt-6">
            <Card className="bg-purple-950/50 border-purple-700 p-6">
              <h3 className="text-2xl font-bold text-purple-300 mb-6 neon-glow text-center">
                <Icon name="Trophy" size={32} className="inline mr-2" />
                Топ игроков
              </h3>
              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {leaderboard.map(entry => (
                    <Card
                      key={entry.rank}
                      className={`p-4 ${
                        entry.username === 'ТЫ'
                          ? 'bg-gradient-to-r from-purple-700 to-pink-700 border-2 border-yellow-400'
                          : 'bg-purple-900/30 border-purple-700'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-center min-w-[50px]">
                          {entry.rank === 1 && (
                            <Icon name="Crown" size={32} className="text-yellow-400 mx-auto" />
                          )}
                          {entry.rank === 2 && (
                            <Icon name="Medal" size={28} className="text-gray-300 mx-auto" />
                          )}
                          {entry.rank === 3 && (
                            <Icon name="Award" size={28} className="text-orange-600 mx-auto" />
                          )}
                          {entry.rank > 3 && (
                            <span className="text-2xl font-bold text-purple-400">#{entry.rank}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-white text-lg">{entry.username}</p>
                          <div className="flex gap-4 text-sm">
                            <span className="text-purple-300">Ур. {entry.level}</span>
                            <span className="text-yellow-400">{entry.coins} монет</span>
                            <span className="text-white">{entry.totalClicks} тапов</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!selectedShopItem} onOpenChange={() => setSelectedShopItem(null)}>
        <DialogContent className="bg-purple-950 border-purple-700 text-white">
          {selectedShopItem && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl text-purple-300 neon-glow">
                  {selectedShopItem.name}
                </DialogTitle>
                <DialogDescription className="text-purple-400">
                  {selectedShopItem.description}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-purple-900/50 p-4 rounded-lg">
                  <p className="text-sm text-purple-300 mb-2">Текущий уровень:</p>
                  <p className="text-3xl font-bold text-white">{selectedShopItem.level}</p>
                </div>
                <div className="bg-purple-900/50 p-4 rounded-lg">
                  <p className="text-sm text-purple-300 mb-2">Стоимость улучшения:</p>
                  {selectedShopItem.cost.coins && (
                    <p className="text-2xl font-bold text-yellow-400">
                      {Math.floor(selectedShopItem.cost.coins * Math.pow(1.5, selectedShopItem.level))} монет
                    </p>
                  )}
                  {selectedShopItem.cost.gems && (
                    <p className="text-2xl font-bold text-pink-400">
                      {Math.floor(selectedShopItem.cost.gems * Math.pow(1.5, selectedShopItem.level))} гемов
                    </p>
                  )}
                </div>
                <Button
                  onClick={() => handlePurchase(selectedShopItem)}
                  className="w-full py-6 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Купить улучшение
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
