import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ref, onValue, set, push, update } from 'firebase/database';
import { signInAnonymously } from 'firebase/auth';
import { db, auth } from '../src/firebase'; // Import from the file we just created
import { PollingContextType, PollingState, Vote } from '../types';
import { FILMS, INITIAL_STATE } from '../constants';

const PollingContext = createContext<PollingContextType | undefined>(undefined);

export const PollingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PollingState>(INITIAL_STATE);
  const [isConnected, setIsConnected] = useState(false);

  // 1. Connect to Firebase and Listen for Changes
  useEffect(() => {
    // Sign in anonymously so we have permission to read/write
    signInAnonymously(auth).then(() => {
        
      // Listen to the 'session' object in the database
      const sessionRef = ref(db, 'session');
      
      const unsubscribe = onValue(sessionRef, (snapshot) => {
        const data = snapshot.val();
        
        if (data) {
          // If data exists in cloud, sync it to our app
          // We handle votes separately because they are a list
          const votesList = data.votes ? Object.values(data.votes) : [];
          setState({
            ...data,
            votes: votesList as Vote[]
          });
          setIsConnected(true);
        } else {
          // If database is empty (first run), upload our INITIAL_STATE
          set(sessionRef, {
             ...INITIAL_STATE,
             votes: {} // Empty object for votes in DB
          });
          setIsConnected(true);
        }
      });

      return () => unsubscribe();
    }).catch(error => {
      console.error("Auth Failed", error);
      setIsConnected(false);
    });
  }, []);

  const leftFilm = FILMS.find(f => f.id === state.leftFilmId) || FILMS[0];
  const rightFilm = FILMS.find(f => f.id === state.rightFilmId) || FILMS[1];

  // Action: Voter submits a vote
  const submitVote = useCallback((vote: Vote) => {
    // Push a new entry to the 'session/votes' list in the database
    const votesRef = ref(db, 'session/votes');
    push(votesRef, vote);
  }, []);

  // Action: Presenter changes film (Syncs to everyone)
  const nextFilm = useCallback((side: 'left' | 'right') => {
    const currentId = side === 'left' ? state.leftFilmId : state.rightFilmId;
    const currentIndex = FILMS.findIndex(f => f.id === currentId);
    const nextIndex = (currentIndex + 1) % FILMS.length;
    
    // Update the specific field in the cloud
    update(ref(db, 'session'), {
        [side === 'left' ? 'leftFilmId' : 'rightFilmId']: FILMS[nextIndex].id
    });
  }, [state.leftFilmId, state.rightFilmId]);

  // Action: Presenter changes both films
  const nextPair = useCallback(() => {
    const leftIndex = FILMS.findIndex(f => f.id === state.leftFilmId);
    const rightIndex = FILMS.findIndex(f => f.id === state.rightFilmId);
    
    const nextLeftIndex = (leftIndex + 2) % FILMS.length;
    const nextRightIndex = (rightIndex + 2) % FILMS.length;

    update(ref(db, 'session'), {
        leftFilmId: FILMS[nextLeftIndex].id,
        rightFilmId: FILMS[nextRightIndex].id
    });
  }, [state.leftFilmId, state.rightFilmId]);

  // Action: Reset everything
  const resetSession = useCallback(() => {
    set(ref(db, 'session'), {
        ...INITIAL_STATE,
        votes: {}
    });
  }, []);

  if (!isConnected && state === INITIAL_STATE) {
      // Optional: Show a loading state if needed, but for now we just render
  }

  return (
    <PollingContext.Provider value={{ state, leftFilm, rightFilm, submitVote, nextFilm, nextPair, resetSession, isConnected }}>
      {children}
    </PollingContext.Provider>
  );
};

export const usePolling = () => {
  const context = useContext(PollingContext);
  if (context === undefined) {
    throw new Error('usePolling must be used within a PollingProvider');
  }
  return context;
};