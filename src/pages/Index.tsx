import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

interface AudioBook {
  id: number;
  title: string;
  author: string;
  genre: string;
  duration: string;
  coverGradient: string;
  description: string;
  narrator: string;
  rating: number;
  audioUrl: string;
}

const audioBooks: AudioBook[] = [
  {
    id: 1,
    title: 'Мастер и Маргарита',
    author: 'Михаил Булгаков',
    genre: 'Классика',
    duration: '14 ч 30 мин',
    coverGradient: 'from-purple-500 via-pink-500 to-orange-400',
    description: 'Легендарный роман о дьяволе, посетившем Москву 1930-х годов, и о великой любви.',
    narrator: 'Максим Суханов',
    rating: 4.9,
    audioUrl: ''
  },
  {
    id: 2,
    title: 'Преступление и наказание',
    author: 'Фёдор Достоевский',
    genre: 'Классика',
    duration: '18 ч 45 мин',
    coverGradient: 'from-red-500 via-purple-600 to-indigo-700',
    description: 'История Родиона Раскольникова, совершившего преступление и ищущего путь к искуплению.',
    narrator: 'Константин Хабенский',
    rating: 4.8,
    audioUrl: ''
  },
  {
    id: 3,
    title: 'Гарри Поттер и философский камень',
    author: 'Джоан Роулинг',
    genre: 'Фэнтези',
    duration: '8 ч 25 мин',
    coverGradient: 'from-amber-400 via-red-500 to-purple-600',
    description: 'Начало магического приключения мальчика, который выжил, в школе чародейства и волшебства.',
    narrator: 'Вячеслав Герасимов',
    rating: 4.9,
    audioUrl: ''
  },
  {
    id: 4,
    title: 'Метро 2033',
    author: 'Дмитрий Глуховский',
    genre: 'Фантастика',
    duration: '12 ч 15 мин',
    coverGradient: 'from-slate-700 via-blue-800 to-cyan-600',
    description: 'Постапокалиптический мир московского метро после ядерной войны.',
    narrator: 'Владимир Левашёв',
    rating: 4.7,
    audioUrl: ''
  },
  {
    id: 5,
    title: 'Алиса в Стране чудес',
    author: 'Льюис Кэрролл',
    genre: 'Детская литература',
    duration: '3 ч 10 мин',
    coverGradient: 'from-pink-400 via-purple-400 to-blue-400',
    description: 'Волшебная история о девочке, попавшей в необычный мир, полный странных существ.',
    narrator: 'Чулпан Хаматова',
    rating: 4.6,
    audioUrl: ''
  },
  {
    id: 6,
    title: 'Война и мир',
    author: 'Лев Толстой',
    genre: 'Классика',
    duration: '61 ч 05 мин',
    coverGradient: 'from-emerald-600 via-teal-600 to-blue-700',
    description: 'Эпопея о судьбах русских семей в период наполеоновских войн.',
    narrator: 'Александр Клюквин',
    rating: 4.8,
    audioUrl: ''
  },
  {
    id: 7,
    title: 'Сумерки',
    author: 'Стефани Майер',
    genre: 'Фэнтези',
    duration: '11 ч 40 мин',
    coverGradient: 'from-slate-600 via-purple-700 to-pink-600',
    description: 'Романтическая история любви обычной девушки и вампира.',
    narrator: 'Татьяна Шитова',
    rating: 4.3,
    audioUrl: ''
  },
  {
    id: 8,
    title: 'Властелин колец',
    author: 'Джон Толкин',
    genre: 'Фэнтези',
    duration: '54 ч 30 мин',
    coverGradient: 'from-yellow-600 via-green-700 to-emerald-900',
    description: 'Эпическое путешествие хоббита Фродо для уничтожения Кольца Всевластья.',
    narrator: 'Александр Ленков',
    rating: 4.9,
    audioUrl: ''
  },
  {
    id: 9,
    title: 'Шерлок Холмс',
    author: 'Артур Конан Дойл',
    genre: 'Детектив',
    duration: '9 ч 20 мин',
    coverGradient: 'from-gray-700 via-amber-600 to-yellow-500',
    description: 'Сборник детективных рассказов о гениальном сыщике и его верном друге докторе Ватсоне.',
    narrator: 'Василий Ливанов',
    rating: 4.8,
    audioUrl: ''
  },
  {
    id: 10,
    title: 'Маленький принц',
    author: 'Антуан де Сент-Экзюпери',
    genre: 'Детская литература',
    duration: '1 ч 45 мин',
    coverGradient: 'from-sky-400 via-blue-400 to-indigo-500',
    description: 'Философская сказка о маленьком мальчике с другой планеты.',
    narrator: 'Иннокентий Смоктуновский',
    rating: 4.9,
    audioUrl: ''
  }
];

const genres = ['Все жанры', 'Классика', 'Фэнтези', 'Фантастика', 'Детская литература', 'Детектив'];
const authors = ['Все авторы', ...Array.from(new Set(audioBooks.map(book => book.author))).sort()];

export default function Index() {
  const [selectedGenre, setSelectedGenre] = useState('Все жанры');
  const [selectedAuthor, setSelectedAuthor] = useState('Все авторы');
  const [selectedBook, setSelectedBook] = useState<AudioBook | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBook, setCurrentBook] = useState<AudioBook | null>(null);

  const filteredBooks = audioBooks.filter(book => {
    const genreMatch = selectedGenre === 'Все жанры' || book.genre === selectedGenre;
    const authorMatch = selectedAuthor === 'Все авторы' || book.author === selectedAuthor;
    return genreMatch && authorMatch;
  });

  const handlePlayPause = (book: AudioBook) => {
    if (currentBook?.id === book.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentBook(book);
      setIsPlaying(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="text-center mb-12 animate-fade-in">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent mb-4">
            Vika Book
          </h1>
          <p className="text-xl text-gray-600">Погрузитесь в мир аудиокниг</p>
        </header>

        <div className="mb-8 space-y-4 animate-slide-up">
          <div className="flex flex-wrap gap-3 justify-center">
            <div className="flex items-center gap-2">
              <Icon name="Filter" size={20} className="text-purple-600" />
              <span className="text-sm font-semibold text-gray-700">Жанры:</span>
            </div>
            {genres.map(genre => (
              <Button
                key={genre}
                variant={selectedGenre === genre ? 'default' : 'outline'}
                onClick={() => setSelectedGenre(genre)}
                className={`transition-all duration-300 ${
                  selectedGenre === genre
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg scale-105'
                    : 'hover:scale-105 hover:border-purple-400'
                }`}
              >
                {genre}
              </Button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <div className="flex items-center gap-2">
              <Icon name="User" size={20} className="text-pink-600" />
              <span className="text-sm font-semibold text-gray-700">Авторы:</span>
            </div>
            {authors.map(author => (
              <Button
                key={author}
                variant={selectedAuthor === author ? 'default' : 'outline'}
                onClick={() => setSelectedAuthor(author)}
                className={`transition-all duration-300 ${
                  selectedAuthor === author
                    ? 'bg-gradient-to-r from-pink-600 to-orange-500 hover:from-pink-700 hover:to-orange-600 text-white shadow-lg scale-105'
                    : 'hover:scale-105 hover:border-pink-400'
                }`}
              >
                {author}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-24">
          {filteredBooks.map((book, index) => (
            <Card
              key={book.id}
              className="group overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 animate-fade-in border-0 shadow-lg"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedBook(book)}
            >
              <div className={`h-64 bg-gradient-to-br ${book.coverGradient} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Icon name="Headphones" size={64} className="text-white/90 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <Badge className="absolute top-3 right-3 bg-white/90 text-gray-800 backdrop-blur">
                  <Icon name="Star" size={14} className="mr-1 fill-yellow-400 text-yellow-400" />
                  {book.rating}
                </Badge>
              </div>
              <div className="p-4 bg-white">
                <h3 className="font-bold text-lg mb-1 line-clamp-1 group-hover:text-purple-600 transition-colors">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                    {book.genre}
                  </Badge>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Icon name="Clock" size={14} />
                    {book.duration}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {currentBook && (
          <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-900 via-pink-900 to-orange-900 text-white p-4 shadow-2xl backdrop-blur-lg animate-slide-up z-50">
            <div className="container mx-auto max-w-7xl flex items-center gap-4">
              <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${currentBook.coverGradient} flex items-center justify-center flex-shrink-0`}>
                <Icon name="Headphones" size={32} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold truncate">{currentBook.title}</h4>
                <p className="text-sm text-white/70 truncate">{currentBook.author}</p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handlePlayPause(currentBook)}
                className="bg-white/20 hover:bg-white/30 rounded-full w-12 h-12"
              >
                <Icon name={isPlaying ? 'Pause' : 'Play'} size={24} />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  setCurrentBook(null);
                  setIsPlaying(false);
                }}
                className="hover:bg-white/20 rounded-full"
              >
                <Icon name="X" size={20} />
              </Button>
            </div>
          </div>
        )}

        <Dialog open={!!selectedBook} onOpenChange={() => setSelectedBook(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
            {selectedBook && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {selectedBook.title}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className={`h-72 rounded-xl bg-gradient-to-br ${selectedBook.coverGradient} flex items-center justify-center relative overflow-hidden shadow-2xl`}>
                    <div className="absolute inset-0 bg-black/10" />
                    <Icon name="Headphones" size={96} className="text-white/90 relative z-10" />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 flex-wrap">
                      <Badge className="text-sm px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600">
                        <Icon name="BookOpen" size={16} className="mr-2" />
                        {selectedBook.genre}
                      </Badge>
                      <span className="text-gray-600 flex items-center gap-2">
                        <Icon name="Clock" size={18} />
                        {selectedBook.duration}
                      </span>
                      <span className="text-gray-600 flex items-center gap-2">
                        <Icon name="Star" size={18} className="fill-yellow-400 text-yellow-400" />
                        {selectedBook.rating}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Icon name="User" size={18} />
                        Автор
                      </h4>
                      <p className="text-lg">{selectedBook.author}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Icon name="Mic" size={18} />
                        Читает
                      </h4>
                      <p className="text-lg">{selectedBook.narrator}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Описание</h4>
                      <p className="text-gray-600 leading-relaxed">{selectedBook.description}</p>
                    </div>

                    <Button
                      className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 shadow-xl hover:shadow-2xl transition-all duration-300"
                      onClick={() => {
                        handlePlayPause(selectedBook);
                        setSelectedBook(null);
                      }}
                    >
                      <Icon name={currentBook?.id === selectedBook.id && isPlaying ? 'Pause' : 'Play'} size={24} className="mr-3" />
                      {currentBook?.id === selectedBook.id && isPlaying ? 'Пауза' : 'Слушать'}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
