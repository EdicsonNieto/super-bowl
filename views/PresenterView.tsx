import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, TrendingUp, Users, ThumbsUp, Star, MessageSquare, Check, X, Smartphone, ScanLine, Wifi } from 'lucide-react';
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
  // Filter votes for this specific film
  const currentVotes = useMemo(() => 
    votes.filter(v => v.filmId === film.id),
    [votes, film.id]
  );

  // Calculate Metrics
  const avgRating = useMemo(() => {
    if (currentVotes.length === 0) return 0;
    const total = currentVotes.reduce((acc, v) => acc + v.stars, 0);
    return (total / currentVotes.length).toFixed(1);
  }, [currentVotes]);

  const sentimentScore = useMemo(() => {
    if (currentVotes.length === 0) return 0;
    const positives = currentVotes.filter(v => v.sentiment === 'shortlist').length;
    return Math.round((positives / currentVotes.length) * 100);
  }, [currentVotes]);

  const sparklineData = useMemo(() => {
      return currentVotes.map((v, i) => ({ index: i, value: v.stars }));
  }, [currentVotes]);

  // Show all recent votes, not just comments
  const recentActivity = useMemo(() => 
    currentVotes.slice(-6).reverse(),
    [currentVotes]
  );

  return (
    <div className="relative w-full md:w-1/2 min-h-screen md:h-full flex flex-col overflow-hidden border-b md:border-b-0 md:border-r border-white/10 last:border-none">
       {/* Background Layer */}
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
        
        {/* Header Control */}
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
            <button 
                onClick={onNext}
                className="shrink-0 p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all hover:scale-105 active:scale-95 shadow-lg"
            >
                <Play size={20} fill="currentColor" className="text-white ml-1"/>
            </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
            <GlassCard className="p-4 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                    <Users size={16} className="text-blue-300" />
                    <span className="text-2xl font-bold text-white drop-shadow-md">{currentVotes.length}</span>
                </div>
                <span className="text-xs text-white/60 uppercase tracking-wider font-medium">Total Votes</span>
            </GlassCard>
            
            <GlassCard className="p-4 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                    <ThumbsUp size={16} className="text-green-400" />
                    <span className="text-2xl font-bold text-white drop-shadow-md">{sentimentScore}%</span>
                </div>
                <span className="text-xs text-white/60 uppercase tracking-wider font-medium">Approval</span>
            </GlassCard>
        </div>

        {/* Main Rating Large */}
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

        {/* Live Activity Feed */}
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
                            <div className="flex justify-between items-start mb-1">
                                <div className="flex gap-0.5">
                                    {[...Array(vote.stars)].map((_, i) => (
                                        <Star key={i} size={8} fill="currentColor" className="text-blue-400" />
                                    ))}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-white/40 font-mono">
                                        {new Date(vote.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}
                                    </span>
                                    {vote.sentiment === 'shortlist' && <Check size={10} className="text-green-400" />}
                                    {vote.sentiment === 'reject' && <X size={10} className="text-red-400" />}
                                </div>
                            </div>
                            {vote.comment ? (
                                <p className="text-xs text-white font-medium leading-snug drop-shadow-sm">"{vote.comment}"</p>
                            ) : (
                                <p className="text-[10px] text-white/40 italic">Voted without comment</p>
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

const JoinWidget: React.FC = () => {
    // Robustly get base URL (strip existing hash if present)
    const baseUrl = window.location.href.split('#')[0];
    const voteUrl = `${baseUrl}#/vote`;
    
    // Generate QR Code
    const qrImage = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(voteUrl)}&bgcolor=ffffff&color=000000&margin=10`;

    return (
        <motion.div 
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, type: 'spring', damping: 20 }}
            className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-8 pointer-events-none"
        >
            <div className="pointer-events-auto">
                <GlassCard className="p-4 flex flex-col items-center gap-3 !bg-black/90 !backdrop-blur-2xl border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-3xl">
                    <div className="bg-white p-2 rounded-2xl shadow-inner">
                        <img src={qrImage} alt="Scan to Vote" className="w-56 h-56 object-contain" />
                    </div>
                    <div className="text-center space-y-1">
                        <h3 className="text-white font-bold text-lg tracking-tight">Scan to Vote</h3>
                        <div className="flex items-center justify-center gap-2 text-xs text-blue-300 font-mono">
                            <Smartphone size={12} />
                            <span>No app download required</span>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </motion.div>
    );
};

const PresenterView: React.FC = () => {
  const { leftFilm, rightFilm, state, nextFilm, isConnected } = usePolling();

  return (
    <div className="w-full min-h-screen bg-black text-white font-sans flex flex-col md:flex-row relative">
      
      {/* Connection Status Indicator */}
      <div className="absolute top-0 inset-x-0 z-50 flex justify-center pt-2 pointer-events-none">
          <div className={`
              flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border backdrop-blur-md shadow-xl transition-colors duration-500
              ${isConnected 
                  ? 'bg-green-500/20 border-green-500/30 text-green-400' 
                  : 'bg-red-500/20 border-red-500/30 text-red-400'}
          `}>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-500'}`} />
              {isConnected ? 'Live Sync Active' : 'Connecting...'}
          </div>
      </div>

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
      
      {/* Overlay QR Code Widget */}
      <JoinWidget />
    </div>
  );
};

export default PresenterView;