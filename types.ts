export interface Film {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  coverImage: string; // URL for the voter background
  thumbnail?: string;
}

export interface Vote {
  filmId: string;
  stars: number;
  sentiment: 'shortlist' | 'reject' | null;
  comment: string;
  timestamp: number;
  voter?: {
    name: string;
    icon: string;
    kanji: string;
    id: string;
  };
}

export interface PollingState {
  leftFilmId: string;
  rightFilmId: string;
  votes: Vote[];
  isLocked: boolean;
  roundEndsAt: number | null; // Timestamp when the current round ends
}

export interface PollingContextType {
  state: PollingState;
  leftFilm: Film;
  rightFilm: Film;
  submitVote: (vote: Vote) => void;
  nextFilm: (side: 'left' | 'right') => void;
  nextPair: () => void;
  startRound: () => void;
  jumpToNextCategory: () => void;
  resetSession: () => void;
  isConnected: boolean;
}