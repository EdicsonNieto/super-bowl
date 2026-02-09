import { Film } from './types';

export const FILMS: Film[] = [
  {
    id: 'f1',
    title: 'Pepsi - "The Choice"',
    subtitle: 'Super Bowl 2026',
    category: 'PLAY TYPE 1 - TRASH TALK',
    year: '2026',
    coverImage: 'https://i.imgur.com/vbJzrvI.png', // Updated Branding Image
  },
  {
    id: 'f2',
    title: 'Anthropic - "A Time and a Place"',
    subtitle: 'Super Bowl 2026',
    category: 'PLAY TYPE 1 - TRASH TALK',
    year: '2026',
    coverImage: 'https://i.imgur.com/ht60lnT.png', // Updated Branding Image
  },
  {
    id: 'f3',
    title: 'Uber Eats - "Hungry for the Truth"',
    subtitle: 'Super Bowl 2026',
    category: 'PLAY TYPE 2 - “WHAT IF“ CONSPIRACY',
    year: '2026',
    coverImage: 'https://i.imgur.com/B2YKTBx.png',
  },
  {
    id: 'f4',
    title: 'Xfinity – “Jurassic Park... Works”',
    subtitle: 'Super Bowl 2026',
    category: 'PLAY TYPE 2 - “WHAT IF“ CONSPIRACY',
    year: '2026',
    coverImage: 'https://i.imgur.com/Kdw9rgS.png',
  },
  {
    id: 'f5',
    title: 'Turbo Tax - "The Expert feat. Adrien Brody"',
    subtitle: 'Super Bowl 2026',
    category: 'PLAY TYPE 3 - “PLAY THE DRAMA“',
    year: '2026',
    coverImage: 'https://i.imgur.com/PMKlJf3.png',
  },
  {
    id: 'f6',
    title: 'Foursquare – “Unavailable”',
    subtitle: 'Super Bowl 2026',
    category: 'PLAY TYPE 3 - “PLAY THE DRAMA“',
    year: '2026',
    coverImage: 'https://i.imgur.com/Trb4sEM.png',
  },
  {
    id: 'f7',
    title: 'BUDWEISER - "American Icons"',
    subtitle: 'Super Bowl 2026',
    category: 'PLAY TYPE 4 - “LEGACY TOUCHDOWN “',
    year: '2026',
    coverImage: 'https://i.imgur.com/eC7gd18.png',
  },
  {
    id: 'f8',
    title: 'LAY\'S – “Last Harvest”',
    subtitle: 'Super Bowl 2026',
    category: 'PLAY TYPE 4 - “LEGACY TOUCHDOWN “',
    year: '2026',
    coverImage: 'https://i.imgur.com/uA4aoik.png',
  },
  {
    id: 'f9',
    title: 'PRINGLES - "Pringleleo”"',
    subtitle: 'Super Bowl 2026',
    category: 'PLAY TYPE 5 - “CAN‘T HELP IT“ CRAVINGS',
    year: '2026',
    coverImage: 'https://i.imgur.com/u6KrWpq.jpeg',
  },
  {
    id: 'f10',
    title: 'Bud Light – “Keg”',
    subtitle: 'Super Bowl 2026',
    category: 'PLAY TYPE 5 - “CAN‘T HELP IT“ CRAVINGS',
    year: '2026',
    coverImage: 'https://i.imgur.com/ADQrANg.png',
  },
  {
    id: 'f11',
    title: 'Dunkin\' - "Good Will Dunkin’ ”',
    subtitle: 'Super Bowl 2026',
    category: 'PLAY TYPE 6 - “CELEBRITY ATTACK“',
    year: '2026',
    coverImage: 'https://i.imgur.com/uC74b2Y.png',
  },
  {
    id: 'f12',
    title: 'Instacart – “Bananas”',
    subtitle: 'Super Bowl 2026',
    category: 'PLAY TYPE 6 - “CELEBRITY ATTACK“',
    year: '2026',
    coverImage: 'https://i.imgur.com/Zo5BGNm.png',
  },
  {
    id: 'f13',
    title: 'Verizon - " No One Gets You Closer”',
    subtitle: 'Super Bowl 2026',
    category: 'PLAY TYPE 7 - “FOOTBALL FIRST“',
    year: '2026',
    coverImage: 'https://i.imgur.com/EcLxSIe.png',
  },
  {
    id: 'f14',
    title: 'Pizza HUT – “The Big New Yorker”',
    subtitle: 'Super Bowl 2026',
    category: 'PLAY TYPE 7 - “FOOTBALL FIRST“',
    year: '2026',
    coverImage: 'https://i.imgur.com/30jgCzJ.png',
  }
];

export const INITIAL_STATE = {
  leftFilmId: FILMS[0].id,
  rightFilmId: FILMS[1].id,
  votes: [],
  isLocked: false,
};