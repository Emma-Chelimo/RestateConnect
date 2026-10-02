import React, { createContext, useContext, useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Get this from Firebase Console > Project Settings > General > Your Android app
// (it's the "Web client ID" under the auto-generated OAuth 2.0 client IDs)
const WEB_CLIENT_ID = 'REPLACE_WITH_YOUR_WEB_CLIENT_ID.apps.googleusercontent.com';

GoogleSignin.configure({ webClientId: WEB_CLIENT_ID });

const AuthContext = createContext(null);

const defaultProfile = (user) => ({
  name: user.displayName || '',
  email: user.email || '',
  phone: '',
  bio: '',
  photoURL: user.photoURL || null,
  notificationPrefs: {
    newListings: true,
    priceDrops: true,
    inquiries: true,
    marketing: false,
  },
  stripeCustomerId: null,
  createdAt: firestore.FieldValue.serverTimestamp(),
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = auth().onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const userRef = firestore().collection('users').doc(firebaseUser.uid);
        const snap = await userRef.get();
        if (!snap.exists) {
          await userRef.set(defaultProfile(firebaseUser));
        }
      } else {
        setProfile(null);
      }
      if (initializing) setInitializing(false);
    });
    return unsubscribeAuth;
  }, [initializing]);

  useEffect(() => {
    if (!user) return;
    const unsubscribeProfile = firestore()
      .collection('users')
      .doc(user.uid)
      .onSnapshot(
        (snap) => setProfile(snap.exists ? snap.data() : null),
        (err) => console.warn('Profile listener error', err)
      );
    return unsubscribeProfile;
  }, [user]);

  const signUpWithEmail = async (email, password, name) => {
    const cred = await auth().createUserWithEmailAndPassword(email, password);
    if (name) await cred.user.updateProfile({ displayName: name });
    return cred.user;
  };

  const signInWithEmail = (email, password) =>
    auth().signInWithEmailAndPassword(email, password);

  const signInWithGoogle = async () => {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const { idToken } = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    return auth().signInWithCredential(googleCredential);
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
    } catch (e) {
      // user may not have signed in with Google - safe to ignore
    }
    await auth().signOut();
  };

  const resetPassword = (email) => auth().sendPasswordResetEmail(email);

  const updateProfileFields = async (fields) => {
    if (!user) throw new Error('Not signed in');
    await firestore().collection('users').doc(user.uid).update(fields);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        initializing,
        signUpWithEmail,
        signInWithEmail,
        signInWithGoogle,
        signOut,
        resetPassword,
        updateProfileFields,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
