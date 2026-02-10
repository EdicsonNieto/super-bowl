import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Users, Check, X, ScanLine, Clock, ArrowRight, BarChart2, RotateCcw, Home, Timer, Star } from 'lucide-react';
import { usePolling } from '../context/PollingContext';
import { GlassCard } from '../components/ui/GlassCard';
import { Sparkline } from '../components/ui/Sparkline';
import { Film } from '../types';

interface DashboardPanelProps {
  film: Film;
  votes: any[];
  onNext: () => void;
  side: 'left' | 'right';
}

const DashboardPanel: React.FC<DashboardPanelProps> = ({ film, votes, onNext, side }) => {
  const currentVotes = useMemo(() => 
    (votes || []).filter(v => v.filmId === film.id),
    [votes, film.id]
  );

  const avgRating = useMemo(() => {
    if (currentVotes.length === 0) return 0;
    const total = currentVotes.reduce((acc, v) => acc + v.stars, 0);
    return (total / currentVotes.length).toFixed(1);
  }, [currentVotes]);

  const shortlistCount = useMemo(() => 
    currentVotes.filter(v => v.sentiment === 'shortlist').length,
    [currentVotes]
  );

  const rejectCount = useMemo(() => 
    currentVotes.filter(v => v.sentiment === 'reject').length,
    [currentVotes]
  );

  const sparklineData = useMemo(() => {
      return currentVotes.map((v, i) => ({ index: i, value: v.stars }));
  }, [currentVotes]);

  const recentActivity = useMemo(() => 
    currentVotes.slice(-6).reverse(),
    [currentVotes]
  );

  return (
    <div className="relative w-full md:w-1/2 min-h-screen md:h-full flex flex-col overflow-hidden border-b md:border-b-0 md:border-r border-white/10 last:border-none">
       <div className="absolute inset-0 z-0">
        <img 
          src={film.coverImage}
          className="absolute inset-0 w-full h-full object-cover opacity-70"
          alt="Background"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40" />
      </div>

      <div className="relative z-10 flex flex-col h-full p-6 md:p-8">
        <div className="flex items-start justify-between mb-6 md:mb-8 overflow-hidden">
            <div className="min-w-0 flex-1 mr-4">
                <h3 className="text-blue-300 font-bold tracking-widest uppercase text-xs mb-1 drop-shadow-md">
                    Channel {side === 'left' ? 'A' : 'B'} • {film.category}
                </h3>
                <h2 className="text-xl md:text-3xl font-bold text-white leading-tight whitespace-nowrap overflow-hidden text-ellipsis drop-shadow-lg">
                    {film.title}
                </h2>
                <p className="text-white/70 text-xs md:text-sm drop-shadow">{film.subtitle}</p>
            </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
            <GlassCard className="p-3 flex flex-col justify-between h-20">
                <div className="flex justify-between items-start mb-1">
                    <Users size={16} className="text-blue-300" />
                    <span className="text-xl font-bold text-white drop-shadow-md">{currentVotes.length}</span>
                </div>
                <span className="text-[10px] text-white/60 uppercase tracking-wider font-medium">Total</span>
            </GlassCard>
            
            <GlassCard className="p-3 flex flex-col justify-between h-20 !bg-green-500/10 border-green-500/20">
                <div className="flex justify-between items-start mb-1">
                    <Check size={16} className="text-green-400" />
                    <span className="text-xl font-bold text-white drop-shadow-md">{shortlistCount}</span>
                </div>
                <span className="text-[10px] text-green-200/60 uppercase tracking-wider font-medium">Short Listed</span>
            </GlassCard>

            <GlassCard className="p-3 flex flex-col justify-between h-20 !bg-red-500/10 border-red-500/20">
                <div className="flex justify-between items-start mb-1">
                    <X size={16} className="text-red-400" />
                    <span className="text-xl font-bold text-white drop-shadow-md">{rejectCount}</span>
                </div>
                <span className="text-[10px] text-red-200/60 uppercase tracking-wider font-medium">Reject</span>
            </GlassCard>
        </div>

        <GlassCard className="mb-6 p-6 flex items-center justify-between">
            <div>
                <div className="flex items-baseline gap-2">
                    <span className="text-5xl md:text-6xl font-bold text-white drop-shadow-xl">{avgRating}</span>
                    <span className="text-base md:text-lg text-white/60">/ 5.0</span>
                </div>
                 <div className="flex gap-1 mt-1">
                    {[1,2,3,4,5].map(s => (
                        <Star key={s} size={14} fill={s <= Number(avgRating) ? "#3b82f6" : "none"} className={s <= Number(avgRating) ? "text-blue-500" : "text-white/30"} />
                    ))}
                </div>
            </div>
            <div className="h-12 md:h-16 w-24 md:w-32">
                 <Sparkline data={sparklineData} />
            </div>
        </GlassCard>

        <div className="flex-1 overflow-hidden flex flex-col min-h-[200px] mb-32 md:mb-0">
            <h3 className="text-xs font-bold tracking-widest uppercase text-white/60 mb-3 flex items-center gap-2 drop-shadow">
                <ScanLine size={12} /> Live Activity
            </h3>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-white/10">
                <AnimatePresence initial={false} mode="popLayout">
                    {recentActivity.map((vote) => (
                        <motion.div
                            key={vote.timestamp}
                            initial={{ opacity: 0, x: side === 'left' ? -20 : 20, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            layout
                            className="bg-white/10 border border-white/10 p-3 rounded-lg shadow-sm"
                        >
                            <div className="flex justify-between items-start mb-2 pb-2 border-b border-white/5">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm shadow-inner">
                                        {vote.voter?.icon || '👤'}
                                    </div>
                                    <div className="flex flex-col leading-none justify-center">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-[11px] font-bold text-blue-200">
                                                {vote.voter?.name || 'Anonymous'}
                                            </span>
                                            {vote.voter?.kanji && (
                                                <span className="text-[9px] text-white/30">{vote.voter.kanji}</span>
                                            )}
                                        </div>
                                        {vote.voter?.id && (
                                            <span className="text-[9px] text-white/40 font-mono tracking-wider">
                                                {vote.voter.id}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <span className="text-[9px] text-white/30 font-mono mt-1">
                                    {new Date(vote.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}
                                </span>
                            </div>

                            <div className="flex justify-between items-center mb-1">
                                <div className="flex gap-0.5">
                                    {[...Array(vote.stars)].map((_, i) => (
                                        <Star key={i} size={10} fill="currentColor" className="text-blue-400" />
                                    ))}
                                </div>
                                <div className="flex items-center gap-2">
                                    {vote.sentiment === 'shortlist' && (
                                        <div className="flex items-center gap-1 bg-green-500/10 px-1.5 py-0.5 rounded border border-green-500/20">
                                            <Check size={10} className="text-green-400" />
                                            <span className="text-[9px] font-bold text-green-300 uppercase tracking-wider">Shortlist</span>
                                        </div>
                                    )}
                                    {vote.sentiment === 'reject' && (
                                        <div className="flex items-center gap-1 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">
                                            <X size={10} className="text-red-400" />
                                            <span className="text-[9px] font-bold text-red-300 uppercase tracking-wider">Reject</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {vote.comment ? (
                                <p className="text-xs text-white font-medium leading-snug drop-shadow-sm mt-1">"{vote.comment}"</p>
                            ) : (
                                <p className="text-[10px] text-white/20 italic mt-1">Voted without comment</p>
                            )}
                        </motion.div>
                    ))}
                     {recentActivity.length === 0 && (
                        <div className="text-center text-white/30 py-4 text-xs italic">
                            Waiting for votes...
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>

      </div>
    </div>
  );
};

const PresenterView: React.FC = () => {
  const { leftFilm, rightFilm, state, nextFilm, nextPair, startRound, jumpToNextCategory, resetSession } = usePolling();
  
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showEndModal, setShowEndModal] = useState(false);
  const [qrUrl, setQrUrl] = useState('');

  // Determine if a round is currently active/started
  // Important: Check for truthiness or typeof number, as Firebase deletion results in undefined
  const isRoundStarted = useMemo(() => {
    return typeof state.roundEndsAt === 'number' && state.roundEndsAt > 0;
  }, [state.roundEndsAt]);

  useEffect(() => {
      // Logic: If round is NOT started (undefined/null), reset timer and return
      if (!isRoundStarted) {
          setTimeLeft(null);
          setShowEndModal(false);
          return;
      }

      const updateTimer = () => {
          const now = Date.now();
          const diff = (state.roundEndsAt || 0) - now;
          const remaining = Math.max(0, Math.ceil(diff / 1000));
          
          setTimeLeft(remaining);
          return remaining;
      };

      // Initial check
      const initialRemaining = updateTimer();
      
      // If time is up, show modal
      if (initialRemaining <= 0) {
          setShowEndModal(true);
      } else {
          setShowEndModal(false);
      }

      const interval = setInterval(() => {
          const remaining = updateTimer();
          if (remaining <= 0) {
              clearInterval(interval);
              setShowEndModal(true);
          }
      }, 1000);

      return () => clearInterval(interval);
  }, [state.roundEndsAt, isRoundStarted]);

  useEffect(() => {
      const voteUrl = window.location.origin + window.location.pathname + '#/vote';
      setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&bgcolor=000000&color=ffffff&data=${encodeURIComponent(voteUrl)}`);
  }, []);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNextPlayType = () => {
      jumpToNextCategory();
      setShowEndModal(false);
  };

  const handleMainAction = () => {
      if (!isRoundStarted) {
          startRound();
      } else {
          nextPair();
      }
  };

  return (
    <div className="w-full min-h-screen bg-black text-white font-sans flex flex-col md:flex-row relative">
      
      <AnimatePresence>
        {showEndModal && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-8"
            >
                <GlassCard className="w-full max-w-2xl p-10 flex flex-col items-center text-center space-y-8 !bg-black/90 !border-white/20 shadow-2xl">
                    <div className="space-y-2">
                        <div className="text-blue-400 font-bold tracking-widest uppercase text-sm">Round Complete</div>
                        <h2 className="text-4xl font-bold text-white">Time's Up!</h2>
                        <p className="text-white/60 text-lg">The voting window for this pair has closed.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        <button 
                            onClick={() => setShowEndModal(false)}
                            className="group p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all flex flex-col items-center gap-4"
                        >
                            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                <BarChart2 size={24} />
                            </div>
                            <div className="text-lg font-bold">Show Results</div>
                            <div className="text-xs text-white/40">Review the data on the dashboard</div>
                        </button>

                        <button 
                             onClick={handleNextPlayType}
                             className="group p-6 rounded-2xl border border-green-500/30 bg-green-500/10 hover:bg-green-500/20 transition-all flex flex-col items-center gap-4 relative overflow-hidden"
                        >
                             <div className="absolute inset-0 bg-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                             <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform">
                                <ArrowRight size={24} />
                            </div>
                            <div className="text-lg font-bold text-green-100">Next Play Type</div>
                            <div className="text-xs text-green-200/40">Jump to the next category</div>
                        </button>
                    </div>
                </GlassCard>
            </motion.div>
        )}
      </AnimatePresence>

      <DashboardPanel 
        film={leftFilm} 
        votes={state.votes} 
        onNext={() => nextFilm('left')}
        side="left"
      />
      <DashboardPanel 
        film={rightFilm} 
        votes={state.votes} 
        onNext={() => nextFilm('right')}
        side="right"
      />

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-4">
        
        {/* Timer - Positioned above QR Code */}
        <AnimatePresence>
            {timeLeft !== null && timeLeft > 0 && (
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 10 }}
                    className="flex justify-center mb-1 pointer-events-none"
                >
                    <div className={`
                        flex items-center gap-3 px-6 py-3 rounded-2xl text-xl font-bold tracking-widest border backdrop-blur-xl shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all
                        ${timeLeft <= 10 ? 'bg-red-600/90 border-red-500 text-white animate-pulse' : 'bg-black/80 border-white/30 text-white'}
                    `}>
                        <Clock size={20} />
                        <span className="font-mono text-2xl">{formatTime(timeLeft)}</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {qrUrl && (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-2 rounded-xl shadow-2xl mb-4 flex flex-col items-center"
            >
                <img src={qrUrl} alt="Join" className="w-40 h-40 object-contain" />
                <span className="text-black font-bold text-[10px] tracking-widest uppercase mt-1">Scan to Vote</span>
            </motion.div>
        )}

        <GlassCard className="p-2 flex items-center gap-2 !rounded-2xl !bg-black/90 !border-white/20">
            <button
                onClick={handleMainAction}
                className={`
                    px-8 py-4 rounded-xl font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center gap-3
                    ${!isRoundStarted
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-green-900/50 animate-pulse' 
                        : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-blue-900/50'
                    }
                `}
            >
                {!isRoundStarted ? <Play size={20} fill="currentColor" /> : <ArrowRight size={20} />}
                <span>{!isRoundStarted ? 'Start Round (2:00)' : 'Next Pair'}</span>
            </button>
        </GlassCard>
     </div>

     <div className="fixed bottom-8 right-8 z-40">
        <GlassCard className="p-2 flex items-center gap-2 !rounded-2xl !bg-black/90 !border-white/20">
            <button 
                onClick={() => window.location.hash = '#'}
                className="p-3 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-colors flex items-center gap-2 group"
                title="Go to Start Screen"
            >
                <Home size={20} />
            </button>

            <div className="w-px h-8 bg-white/10" />

            <button 
                onClick={() => {
                    if(confirm("WARNING: This will RESET the entire session, going back to the first pair and DELETING all votes. Are you sure?")) resetSession();
                }}
                className="px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors flex items-center gap-2"
                title="Reset Session"
            >
                <RotateCcw size={18} />
                <span className="text-xs font-bold uppercase tracking-wider">Reset Session</span>
            </button>
        </GlassCard>
     </div>
    </div>
  );
};

export default PresenterView;