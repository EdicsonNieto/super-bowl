import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Home, RotateCcw } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { FILMS } from '../constants';
import { usePolling } from '../context/PollingContext';

export const ResultsDashboard: React.FC<{ isPresenter?: boolean }> = ({ isPresenter = false }) => {
  const { state, resetSession } = usePolling();
  const votes = state.votes;

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
    <div className="w-full min-h-screen bg-black text-white p-4 md:p-8 flex flex-col items-center relative">
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
        
        <div className="text-center pt-8 pb-12">
             {isPresenter ? (
                 <button 
                    onClick={() => {
                        if(confirm("WARNING: This will RESET the entire session. Are you sure?")) resetSession();
                    }} 
                    className="px-6 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors uppercase tracking-widest font-bold border border-red-500/20"
                 >
                     Reset Session
                 </button>
             ) : (
                <button onClick={() => window.location.reload()} className="text-xs text-white/30 hover:text-white transition-colors uppercase tracking-widest">
                    Start New Session
                </button>
             )}
        </div>
      </div>

      {isPresenter && (
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
      )}
    </div>
  );
};