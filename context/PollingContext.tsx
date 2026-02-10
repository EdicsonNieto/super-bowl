import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ref, onValue, set, push, update } from 'firebase/database';
import { signInAnonymously } from 'firebase/auth';
import { db, auth } from '../src/firebase';
import { PollingContextType, PollingState, Vote } from '../types';
import { FILMS, INITIAL_STATE, ROUND_DURATION_MS } from '../constants';

const PollingContext = createContext<PollingContextType | undefined>(undefined);

export const PollingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PollingState>(INITIAL_STATE);
  const [isConnected, setIsConnected] = useState(false);

  // 1. Connect to Firebase and Listen for Changes
  useEffect(() => {
    signInAnonymously(auth).then(() => {
      const sessionRef = ref(db, 'session');
      
      const unsubscribe = onValue(sessionRef, (snapshot) => {
        const data = snapshot.val();
        
        if (data) {
          const votesList = data.votes ? Object.values(data.votes) : [];
          setState({
            ...data,
            votes: votesList as Vote[]
          });
          setIsConnected(true);
        } else {
          set(sessionRef, {
             ...INITIAL_STATE,
             votes: {}
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
    const votesRef = ref(db, 'session/votes');
    push(votesRef, vote);
  }, []);

  // Action: Presenter changes film (Syncs to everyone)
  const nextFilm = useCallback((side: 'left' | 'right') => {
    const currentId = side === 'left' ? state.leftFilmId : state.rightFilmId;
    const currentIndex = FILMS.findIndex(f => f.id === currentId);
    const nextIndex = (currentIndex + 1) % FILMS.length;
    
    update(ref(db, 'session'), {
        [side === 'left' ? 'leftFilmId' : 'rightFilmId']: FILMS[nextIndex].id
    });
  }, [state.leftFilmId, state.rightFilmId]);

  // Action: Start current round (Reset timer for current pair)
  const startRound = useCallback(() => {
    const newEndTime = Date.now() + ROUND_DURATION_MS;
    update(ref(db, 'session'), {
        roundEndsAt: newEndTime,
        isLocked: false
    });
  }, []);

  // Action: Presenter changes both films. 
  // CHANGED: Checks for end of list to trigger finish state
  const nextPair = useCallback(() => {
    const leftIndex = FILMS.findIndex(f => f.id === state.leftFilmId);
    const rightIndex = FILMS.findIndex(f => f.id === state.rightFilmId);
    
    // Check if we are at the end of the list
    if (leftIndex + 2 >= FILMS.length) {
        update(ref(db, 'session'), {
            isFinished: true,
            isLocked: true,
            roundEndsAt: null
        });
        return;
    }

    const nextLeftIndex = (leftIndex + 2) % FILMS.length;
    const nextRightIndex = (rightIndex + 2) % FILMS.length;

    update(ref(db, 'session'), {
        leftFilmId: FILMS[nextLeftIndex].id,
        rightFilmId: FILMS[nextRightIndex].id,
        roundEndsAt: null, // Reset timer
        isLocked: true,     // Lock voting until Presenter clicks Start
        isFinished: false
    });
  }, [state.leftFilmId, state.rightFilmId]);

  // Action: Jump to next category
  const jumpToNextCategory = useCallback(() => {
    const currentCategory = leftFilm.category;
    let nextIndex = FILMS.findIndex(f => f.id === state.leftFilmId);
    
    // Find first film with different category
    while(nextIndex < FILMS.length && FILMS[nextIndex].category === currentCategory) {
        nextIndex++;
    }
    
    // If we ran out of films, cycle back to 0 or stay at end
    if (nextIndex >= FILMS.length) nextIndex = 0;

    // Ensure we have a pair (even index)
    if (nextIndex % 2 !== 0) nextIndex--;

    update(ref(db, 'session'), {
        leftFilmId: FILMS[nextIndex].id,
        rightFilmId: FILMS[nextIndex + 1]?.id || FILMS[0].id,
        roundEndsAt: null, // Reset timer
        isLocked: true,     // Lock voting
        isFinished: false
    });

  }, [state.leftFilmId, leftFilm.category]);

  // Action: Reset everything
  const resetSession = useCallback(() => {
    // Explicitly set structure and use null for votes to delete the node
    set(ref(db, 'session'), {
        leftFilmId: FILMS[0].id,
        rightFilmId: FILMS[1].id,
        votes: null,
        isLocked: true, // Start locked
        roundEndsAt: null,
        isFinished: false // Reset
    }).catch(err => console.error("Reset failed", err));
  }, []);

  return (
    <PollingContext.Provider value={{ state, leftFilm, rightFilm, submitVote, nextFilm, nextPair, startRound, jumpToNextCategory, resetSession, isConnected }}>
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