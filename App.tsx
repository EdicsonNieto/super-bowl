import React, { useState, useEffect } from 'react';
import { PollingProvider } from './context/PollingContext';
import VoterView from './views/VoterView';
import PresenterView from './views/PresenterView';
import { Users, Presentation } from 'lucide-react';
import { GlassCard } from './components/ui/GlassCard';

// Simple Hash Router Implementation
const App: React.FC = () => {
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderView = () => {
    if (route === '#/vote') return <VoterView />;
    if (route === '#/presenter') return <PresenterView />;
    return <LandingSelection />;
  };

  return (
    <PollingProvider>
      {renderView()}
    </PollingProvider>
  );
};

const LandingSelection: React.FC = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <GlassCard 
            hoverEffect 
            onClick={() => window.location.hash = '#/vote'}
            className="group p-12 flex flex-col items-center justify-center text-center gap-6 border-white/5 hover:border-blue-500/50 transition-all"
        >
            <div className="w-24 h-24 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <Users size={48} className="text-blue-400" />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Voter View</h2>
                <p className="text-white/40 text-sm">Join the session as a participant on mobile.</p>
            </div>
        </GlassCard>

        <GlassCard 
            hoverEffect 
            onClick={() => window.location.hash = '#/presenter'}
            className="group p-12 flex flex-col items-center justify-center text-center gap-6 border-white/5 hover:border-purple-500/50 transition-all"
        >
            <div className="w-24 h-24 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                <Presentation size={48} className="text-purple-400" />
            </div>
             <div>
                <h2 className="text-2xl font-bold text-white mb-2">Presenter View</h2>
                <p className="text-white/40 text-sm">Access the dashboard control center.</p>
            </div>
        </GlassCard>

      </div>
    </div>
  );
};

export default App;
