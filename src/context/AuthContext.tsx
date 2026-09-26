import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile as updateFirebaseProfile
} from 'firebase/auth';
import {
  doc,
  setDoc,
  collection,
  onSnapshot,
  updateDoc,
  getDocs
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../firebase';
import { UserProfile, UserPreferences, SavedRoute, TicketSummary } from '../types';
import { INITIAL_TICKETS } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  preferences: UserPreferences | null;
  savedRoutes: SavedRoute[];
  tickets: TicketSummary[];
  loading: boolean;
  authError: string | null;
  clearError: () => void;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserPreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
  updateUserKarma: (points: number) => Promise<void>;
  saveRouteToCloud: (route: Omit<SavedRoute, 'routeId' | 'userId' | 'createdAt'>) => Promise<void>;
  createTicketInCloud: (ticket: Omit<TicketSummary, 'id'>) => Promise<void>;
  upvoteTicketInCloud: (ticketId: string) => Promise<void>;
  resolveTicketInCloud: (ticketId: string) => Promise<void>;
  submitReviewInCloud: (ticketId: string, rating: number, tags: string[], notes?: string) => Promise<void>;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  userId: '',
  viewMode: 'citizen',
  accessibilityMode: true,
  elevatorVital: true,
  lowFloorBus: true,
  max3PctIncline: true,
  sensoryCues: true,
  preferredRouting: 'least-walking',
  updatedAt: new Date().toISOString()
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([]);
  const [tickets, setTickets] = useState<TicketSummary[]>(INITIAL_TICKETS);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const clearError = () => setAuthError(null);

  // Seed default tickets into Firestore once if collection is empty
  const seedTicketsIfEmpty = async () => {
    try {
      const ticketsRef = collection(db, 'tickets');
      const snap = await getDocs(ticketsRef);
      if (snap.empty) {
        for (const t of INITIAL_TICKETS) {
          await setDoc(doc(db, 'tickets', t.id), t);
        }
      }
    } catch {
      // Ignored for offline or restricted scenarios
    }
  };

  // Auth State Listener
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setProfile(null);
        setPreferences(DEFAULT_PREFERENCES);
        setSavedRoutes([]);
        setLoading(false);
        return;
      }

      const uid = currentUser.uid;
      const email = currentUser.email || '';
      const isOwnerAdmin = email.includes('admin') || email === 'santhoshguggilam2007@gmail.com';

      // 1. Listen to User Profile
      const profileRef = doc(db, 'users', uid, 'profile', 'info');
      const unsubscribeProfile = onSnapshot(
        profileRef,
        async (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            // Initialize user profile in Firestore
            const initialProfile: UserProfile = {
              userId: uid,
              displayName: currentUser.displayName || email.split('@')[0] || 'Guardian Citizen',
              email: email,
              photoURL: currentUser.photoURL || undefined,
              role: isOwnerAdmin ? 'admin' : 'citizen',
              karma: 820,
              level: 'Level 4 Guardian Citizen',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            try {
              await setDoc(profileRef, initialProfile);
              setProfile(initialProfile);
            } catch (err) {
              handleFirestoreError(err, OperationType.WRITE, `users/${uid}/profile/info`);
            }
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, `users/${uid}/profile/info`);
        }
      );

      // 2. Listen to User Preferences
      const prefsRef = doc(db, 'users', uid, 'preferences', 'settings');
      const unsubscribePrefs = onSnapshot(
        prefsRef,
        async (docSnap) => {
          if (docSnap.exists()) {
            setPreferences(docSnap.data() as UserPreferences);
          } else {
            const initialPrefs: UserPreferences = {
              ...DEFAULT_PREFERENCES,
              userId: uid,
              updatedAt: new Date().toISOString()
            };
            try {
              await setDoc(prefsRef, initialPrefs);
              setPreferences(initialPrefs);
            } catch (err) {
              handleFirestoreError(err, OperationType.WRITE, `users/${uid}/preferences/settings`);
            }
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, `users/${uid}/preferences/settings`);
        }
      );

      // 3. Listen to Saved Routes
      const routesRef = collection(db, 'users', uid, 'savedRoutes');
      const unsubscribeRoutes = onSnapshot(
        routesRef,
        (snapshot) => {
          const loaded: SavedRoute[] = [];
          snapshot.forEach((doc) => {
            loaded.push(doc.data() as SavedRoute);
          });
          setSavedRoutes(loaded);
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, `users/${uid}/savedRoutes`);
        }
      );

      // 4. Seed and listen to real-time Civic Tickets
      await seedTicketsIfEmpty();
      const ticketsRef = collection(db, 'tickets');
      const unsubscribeTickets = onSnapshot(
        ticketsRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const loaded: TicketSummary[] = [];
            snapshot.forEach((doc) => {
              loaded.push(doc.data() as TicketSummary);
            });
            setTickets(loaded);
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, 'tickets');
        }
      );

      setLoading(false);

      return () => {
        unsubscribeProfile();
        unsubscribePrefs();
        unsubscribeRoutes();
        unsubscribeTickets();
      };
    });

    return () => unsubscribeAuth();
  }, []);

  // Google Login
  const loginWithGoogle = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign in failed';
      setAuthError(msg);
      throw err;
    }
  };

  // Email Login
  const loginWithEmail = async (email: string, pass: string) => {
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid email or password';
      setAuthError(msg);
      throw err;
    }
  };

  // Email Sign Up
  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    setAuthError(null);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      if (res.user) {
        await updateFirebaseProfile(res.user, { displayName: name });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign up failed';
      setAuthError(msg);
      throw err;
    }
  };

  // Logout
  const logout = async () => {
    setAuthError(null);
    try {
      await signOut(auth);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Logout failed';
      setAuthError(msg);
      throw err;
    }
  };

  // Update Preferences (Persisted across devices)
  const updateUserPreferences = async (newPrefs: Partial<UserPreferences>) => {
    if (!user) {
      setPreferences((prev) => ({ ...prev, ...newPrefs }));
      return;
    }
    const updated = {
      ...preferences,
      ...newPrefs,
      updatedAt: new Date().toISOString()
    };
    setPreferences(updated);
    try {
      const prefsRef = doc(db, 'users', user.uid, 'preferences', 'settings');
      await setDoc(prefsRef, updated);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}/preferences/settings`);
    }
  };

  // Update Karma
  const updateUserKarma = async (points: number) => {
    if (!user || !profile) return;
    const newKarma = (profile.karma || 0) + points;
    const updatedProfile = {
      ...profile,
      karma: newKarma,
      updatedAt: new Date().toISOString()
    };
    setProfile(updatedProfile);
    try {
      const profileRef = doc(db, 'users', user.uid, 'profile', 'info');
      await updateDoc(profileRef, { karma: newKarma, updatedAt: updatedProfile.updatedAt });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}/profile/info`);
    }
  };

  // Save Route to Cloud
  const saveRouteToCloud = async (routeData: Omit<SavedRoute, 'routeId' | 'userId' | 'createdAt'>) => {
    if (!user) return;
    const routeId = `route-${Date.now()}`;
    const newRoute: SavedRoute = {
      ...routeData,
      routeId,
      userId: user.uid,
      createdAt: new Date().toISOString()
    };
    try {
      const routeRef = doc(db, 'users', user.uid, 'savedRoutes', routeId);
      await setDoc(routeRef, newRoute);
      setSavedRoutes((prev) => [newRoute, ...prev]);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}/savedRoutes/${routeId}`);
    }
  };

  // Create Ticket in Cloud
  const createTicketInCloud = async (newTicketData: Omit<TicketSummary, 'id'>) => {
    const id = `t-${Date.now()}`;
    const fullTicket: TicketSummary = {
      ...newTicketData,
      id
    };
    setTickets((prev) => [fullTicket, ...prev]);
    if (user) {
      try {
        await setDoc(doc(db, 'tickets', id), fullTicket);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `tickets/${id}`);
      }
    }
  };

  // Upvote Ticket
  const upvoteTicketInCloud = async (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, upvotes: t.upvotes + 1 } : t))
    );
    if (user) {
      try {
        const ticketRef = doc(db, 'tickets', ticketId);
        const ticket = tickets.find((t) => t.id === ticketId);
        if (ticket) {
          await updateDoc(ticketRef, { upvotes: ticket.upvotes + 1 });
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `tickets/${ticketId}`);
      }
    }
  };

  // Resolve Ticket
  const resolveTicketInCloud = async (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: 'RESOLVED', slaRemaining: 'Resolved on-site' } : t))
    );
    if (user) {
      try {
        const ticketRef = doc(db, 'tickets', ticketId);
        await updateDoc(ticketRef, { status: 'RESOLVED', slaRemaining: 'Resolved on-site' });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `tickets/${ticketId}`);
      }
    }
  };

  // Submit Review
  const submitReviewInCloud = async (ticketId: string, rating: number, tags: string[], notes?: string) => {
    if (!user) return;
    const reviewId = `rev-${Date.now()}`;
    const reviewPayload = {
      reviewId,
      ticketId,
      userId: user.uid,
      userName: profile?.displayName || user.displayName || 'Guardian Citizen',
      rating,
      tags: tags.join(','),
      notes: notes || '',
      createdAt: new Date().toISOString()
    };
    try {
      const reviewRef = doc(db, 'tickets', ticketId, 'reviews', reviewId);
      await setDoc(reviewRef, reviewPayload);
      // Award +10 karma for quality review
      await updateUserKarma(10);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `tickets/${ticketId}/reviews/${reviewId}`);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        preferences,
        savedRoutes,
        tickets,
        loading,
        authError,
        clearError,
        loginWithGoogle,
        loginWithEmail,
        signUpWithEmail,
        logout,
        updateUserPreferences,
        updateUserKarma,
        saveRouteToCloud,
        createTicketInCloud,
        upvoteTicketInCloud,
        resolveTicketInCloud,
        submitReviewInCloud
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
