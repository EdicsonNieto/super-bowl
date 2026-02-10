import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, MessageSquare, Lock, Trophy, BarChart2, Clock, Hourglass } from 'lucide-react';
import { usePolling } from '../context/PollingContext';
import { GlassCard } from '../components/ui/GlassCard';
import { StarRating } from '../components/ui/StarRating';
import { Film, Vote } from '../types';
import { FILMS, ANIMALS } from '../constants';

const formatTime = (seconds: number) => {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

interface VoterIdentity {
    name: string;
    icon: string;
    kanji: string;
    id: string;
}

const getVoterIdentity = (): VoterIdentity => {
    const stored = localStorage.getItem('lumina_voter_identity');
    if (stored) return JSON.parse(stored);

    const randomAnimal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const identity = {
        name: randomAnimal.name,
        icon: randomAnimal.icon,
        kanji: randomAnimal.kanji,
        id: `#${randomSuffix}`
    };
    
    localStorage.setItem('lumina_voter_identity', JSON.stringify(identity));
    return identity;
};

const VotingPanel: React.FC<{ 
  film: Film; 
  onSubmit: (vote: any) => void; 
  onVoteSuccess: () => void; 
  isLocked: boolean;
  timeLeft: number | null;
}> = ({ film, onSubmit, onVoteSuccess, isLocked, timeLeft }) => {
  const [rating, setRating] = useState(0);
  const [sentiment, setSentiment] = useState<'shortlist' | 'reject' | null>(null);
  const [comment, setComment] = useState('');
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    setRating(0);
    setSentiment(null);
    setComment('');
    setHasVoted(false);
  }, [film.id]);

  const handleVote = () => {
    if (rating === 0) return;
    const identity = getVoterIdentity();
    onSubmit({
      filmId: film.id,
      stars: rating,
      sentiment,
      comment,
      timestamp: Date.now(),
      voter: identity
    });
    setHasVoted(true);
    onVoteSuccess();
  };

  const isFormValid = rating > 0;

  return (
    <div className={`relative w-full h-full min-h-[inherit] flex flex-col items-center justify-center overflow-hidden font-sans border-b md:border-b-0 md:border-r border-white/10 last:border-none transition-all duration-500 ${isLocked ? 'grayscale opacity-50 pointer-events-none' : ''}`}>
      <div className="absolute inset-0 z-0">
        <img 
          src={film.coverImage} 
          alt="Background" 
          className="w-full h-full object-cover opacity-80"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
      </div>

      <div className="relative z-10 w-full max-w-sm px-6 py-8 flex flex-col items-center justify-center min-h-full">
        <AnimatePresence mode="wait">
          {!hasVoted ? (
            <motion.div 
              key={`form-${film.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="w-full flex flex-col items-center space-y-5"
            >
              <div className="text-center space-y-1 mt-2 w-full overflow-hidden px-1">
                <p className="text-[10px] font-bold tracking-widest text-blue-300 uppercase shadow-black drop-shadow-md">{film.category}</p>
                <h1 className="text-lg sm:text-2xl font-bold text-white tracking-tight leading-tight drop-shadow-xl whitespace-nowrap overflow-hidden text-ellipsis w-full">
                  {film.title}
                </h1>
                <p className="text-white/80 text-xs font-medium drop-shadow-md">{film.subtitle}</p>
              </div>

              <div className="w-full text-center scale-90 origin-center">
                 <StarRating rating={rating} setRating={setRating} disabled={isLocked} />
              </div>

              <div className="grid grid-cols-2 gap-3 w-full">
                <GlassCard 
                  className={`flex flex-col items-center justify-center p-3 space-y-1 border-transparent transition-all active:scale-95 touch-none ${sentiment === 'shortlist' ? '!bg-green-500/30 !border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.3)]' : ''}`}
                  hoverEffect
                  onClick={() => setSentiment('shortlist')}
                >
                  <Check className={`w-5 h-5 ${sentiment === 'shortlist' ? 'text-white' : 'text-white/50'}`} />
                  <span className={`text-[10px] font-bold tracking-wider ${sentiment === 'shortlist' ? 'text-white' : 'text-white/60'}`}>Short Listed</span>
                </GlassCard>

                <GlassCard 
                  className={`flex flex-col items-center justify-center p-3 space-y-1 border-transparent transition-all active:scale-95 touch-none ${sentiment === 'reject' ? '!bg-red-500/30 !border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : ''}`}
                  hoverEffect
                  onClick={() => setSentiment('reject')}
                >
                  <X className={`w-5 h-5 ${sentiment === 'reject' ? 'text-white' : 'text-white/50'}`} />
                  <span className={`text-[10px] font-bold tracking-wider ${sentiment === 'reject' ? 'text-white' : 'text-white/60'}`}>Reject</span>
                </GlassCard>
              </div>

              <div className="w-full relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-blue-300 transition-colors">
                  <MessageSquare size={16} />
                </div>
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Quick thought..."
                  disabled={isLocked}
                  className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-blue-400/50 focus:border-blue-400/50 backdrop-blur-md transition-all shadow-lg"
                />
              </div>

              <div className="w-full pt-1">
                 <motion.button
                   whileTap={{ scale: 0.98 }}
                   onClick={handleVote}
                   disabled={!isFormValid || isLocked}
                   className={`
                     w-full py-3.5 rounded-xl font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2
                     transition-all duration-300 shadow-xl border
                     ${isFormValid 
                       ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-blue-500/30 border-blue-400/30 hover:brightness-110' 
                       : 'bg-white/10 text-white/30 cursor-not-allowed border-white/5'}
                   `}
                 >
                   <span className="flex items-center gap-2">
                     Submit Vote 
                     {timeLeft !== null && timeLeft > 0 ? (
                        <span className="font-mono bg-black/20 px-1.5 rounded">
                           {formatTime(timeLeft)}
                        </span>
                     ) : ''}
                   </span>
                   <Lock size={12} className={isFormValid ? "opacity-50" : "opacity-0"} />
                 </motion.button>
              </div>

            </motion.div>
          ) : (
            <motion.div 
              key={`success-${film.id}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="flex flex-col items-center justify-center space-y-4 text-center py-10"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-green-400 to-emerald-500 flex items-center justify-center shadow-xl shadow-green-500/30">
                <Check className="w-8 h-8 text-white" strokeWidth={4} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white mb-1 drop-shadow-lg">Vote Recorded</h2>
                <p className="text-white/60 text-xs">Waiting for next film...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ResultsDashboard: React.FC<{ votes: Vote[] }> = ({ votes }) => {
  const ranking = useMemo(() => {
    return FILMS.map(film => {
      const filmVotes = (votes || []).filter(v => v.filmId === film.id);
      const score = filmVotes.reduce((acc, curr) => acc + curr.stars, 0);
      const avg = filmVotes.length > 0 ? score / filmVotes.length : 0;
      return { ...film, avg, count: filmVotes.length };
    }).sort((a, b) => b.avg - a.avg);
  }, [votes]);

  const winner = ranking[0];

  return (
    <div className="w-full min-h-screen bg-black text-white p-4 md:p-8 flex flex-col items-center">
      <div className="max-w-2xl w-full space-y-8 pb-12">
        <div className="text-center space-y-2 mt-8">
           <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Final Results</h2>
           <p className="text-white/60">The audience has spoken</p>
        </div>

        {winner && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
                <GlassCard className="p-6 border-yellow-500/30 bg-gradient-to-b from-yellow-500/10 to-transparent relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3">
                        <Trophy className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" size={32} />
                    </div>
                    <div className="flex items-center gap-6 relative z-10">
                        <img src={winner.coverImage} className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-xl shadow-2xl shadow-black/50 border border-white/10" />
                        <div>
                            <div className="text-yellow-400 text-xs font-bold tracking-widest uppercase mb-1">Grand Winner</div>
                            <h3 className="text-xl md:text-2xl font-bold leading-tight mb-2">{winner.title}</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-white">{winner.avg.toFixed(1)}</span>
                                <span className="text-white/40 text-sm">/ 5.0</span>
                            </div>
                            <div className="text-xs text-white/40 mt-1">{winner.count} votes</div>
                        </div>
                    </div>
                    <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-10 group-hover:animate-shine" />
                </GlassCard>
            </motion.div>
        )}

        <div className="space-y-3">
            {ranking.slice(1).map((film, idx) => (
                <motion.div 
                    key={film.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + (idx * 0.05) }}
                >
                    <GlassCard className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors">
                        <div className="w-8 text-center font-bold text-white/30">#{idx + 2}</div>
                        <img src={film.coverImage} className="w-12 h-12 rounded-lg object-cover bg-white/10" />
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm truncate">{film.title}</h4>
                            <p className="text-xs text-white/40 truncate">{film.category}</p>
                        </div>
                        <div className="text-right">
                             <div className="font-bold text-lg">{film.avg.toFixed(1)}</div>
                             <div className="text-[10px] text-white/30">{film.count} votes</div>
                        </div>
                    </GlassCard>
                </motion.div>
            ))}
        </div>
        
        <div className="text-center pt-8">
             <button onClick={() => window.location.reload()} className="text-xs text-white/30 hover:text-white transition-colors uppercase tracking-widest">
                 Start New Session
             </button>
        </div>
      </div>
    </div>
  );
};

const ThankYouScreen: React.FC<{ onShowResults: () => void }> = ({ onShowResults }) => {
  return (
    <div className="w-full min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 animate-pulse" />
        
        <GlassCard className="max-w-md w-full p-10 flex flex-col items-center text-center space-y-8 relative z-10">
            <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-24 h-24 rounded-full bg-gradient-to-tr from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30"
            >
                <Trophy className="w-12 h-12 text-white" />
            </motion.div>
            
            <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white">All Done!</h2>
                <p className="text-white/60">Your votes have been submitted successfully. The session is now complete.</p>
            </div>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onShowResults}
                className="w-full py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
                <BarChart2 size={18} />
                <span>View Final Results</span>
            </motion.button>
       </GlassCard>
    </div>
  );
};

const VoterView: React.FC = () => {
  const { leftFilm, rightFilm, submitVote, nextPair, state } = usePolling();
  const [leftVoted, setLeftVoted] = useState(false);
  const [rightVoted, setRightVoted] = useState(false);
  const [viewState, setViewState] = useState<'voting' | 'thanks' | 'results'>('voting');
  const [identity, setIdentity] = useState<VoterIdentity | null>(null);
  
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
      setIdentity(getVoterIdentity());
  }, []);

  // Timer Logic: Safe handling of undefined/null values
  useEffect(() => {
    if (!state.roundEndsAt) {
      setTimeLeft(null);
      return;
    }

    const updateTimer = () => {
        // Ensure state.roundEndsAt is treated as number
        const endsAt = state.roundEndsAt || 0;
        const remaining = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
        setTimeLeft(remaining);
        return remaining;
    };

    const initial = updateTimer();
    // Don't run interval if time already up
    if (initial <= 0) return;

    const interval = setInterval(() => {
        const remaining = updateTimer();
        if (remaining <= 0) {
            clearInterval(interval);
        }
    }, 1000);

    return () => clearInterval(interval);
  }, [state.roundEndsAt]);

  const isTimeUp = timeLeft !== null && timeLeft <= 0;
  // Locking logic: Locked if explicitly locked (waiting for start) OR if time ran out
  const isSessionLocked = state.isLocked || isTimeUp;
  const isWaitingForStart = state.isLocked && timeLeft === null;

  useEffect(() => {
    setLeftVoted(false);
    setRightVoted(false);
  }, [leftFilm.id, rightFilm.id]);

  const allVoted = leftVoted && rightVoted;

  const isLastPair = useMemo(() => {
     const idx = FILMS.findIndex(f => f.id === leftFilm.id);
     return idx >= FILMS.length - 2;
  }, [leftFilm.id]);

  if (viewState === 'thanks') return <ThankYouScreen onShowResults={() => setViewState('results')} />;
  if (viewState === 'results') return <ResultsDashboard votes={state.votes} />;

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-black relative">

        {identity && (
            <div className="fixed top-2 left-2 z-[60] flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 shadow-lg pointer-events-none">
                <span className="text-lg">{identity.icon}</span>
                <div className="flex flex-col leading-none">
                    <span className="text-[10px] text-white/50 font-bold uppercase">{identity.name}</span>
                    <span className="text-[8px] text-white/30 font-mono tracking-widest">{identity.id}</span>
                </div>
            </div>
        )}
      
      <AnimatePresence>
        {isSessionLocked && (
             <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="absolute inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
           >
              <GlassCard 
                 className="w-full max-w-sm p-8 flex flex-col items-center text-center space-y-4 !border-white/10 !bg-white/5"
              >
                  {isWaitingForStart ? (
                      <>
                        <Hourglass size={48} className="text-blue-400/50 mb-2 animate-pulse" />
                        <h2 className="text-xl font-bold text-white">Get Ready</h2>
                        <p className="text-white/50 text-sm">Waiting for presenter to start the round...</p>
                      </>
                  ) : (
                      <>
                        <Lock size={48} className="text-red-400/50 mb-2" />
                        <h2 className="text-xl font-bold text-white">Voting Closed</h2>
                        <p className="text-white/50 text-sm">Time's up for this round.</p>
                      </>
                  )}
              </GlassCard>
           </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full md:w-1/2 min-h-[50vh] flex-1 relative">
        <VotingPanel 
            film={leftFilm} 
            onSubmit={submitVote} 
            onVoteSuccess={() => setLeftVoted(true)} 
            isLocked={isSessionLocked || leftVoted} 
            timeLeft={timeLeft}
        />
      </div>
      <div className="w-full md:w-1/2 min-h-[50vh] flex-1 relative">
         <VotingPanel 
            film={rightFilm} 
            onSubmit={submitVote} 
            onVoteSuccess={() => setRightVoted(true)} 
            isLocked={isSessionLocked || rightVoted}
            timeLeft={timeLeft}
         />
      </div>

      <AnimatePresence>
        {allVoted && !isSessionLocked && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
          >
             <GlassCard 
                className="w-full max-w-md p-8 flex flex-col items-center text-center space-y-6 !border-white/20 !bg-black/80 shadow-[0_0_50px_rgba(59,130,246,0.3)]"
             >
                <div>
                   <h2 className="text-2xl font-bold text-white mb-2">Round Complete</h2>
                   <p className="text-white/50">All votes have been recorded successfully.</p>
                </div>
                
                {timeLeft !== null && timeLeft > 0 && (
                  <div className="py-4 flex flex-col items-center animate-pulse">
                      <div className="text-4xl font-mono font-bold text-blue-400">
                          {formatTime(timeLeft)}
                      </div>
                      <div className="text-[10px] text-white/30 uppercase tracking-widest mt-1">Time Remaining</div>
                  </div>
                )}
                
                <div className="text-sm text-white/30 italic">Waiting for presenter...</div>
             </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoterView;