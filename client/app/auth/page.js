'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { Gamepad2, LogIn, UserPlus } from 'lucide-react';

// Import necessary Firebase components from our .env file
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

/**
 * This page controls the creation of new users and 
 * authentication of existing users. 
 * It allows users to create accounts or sign-in with both
 * email/password authentication, as well as Google authentication.
*/
export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Check if username exists
  const checkUsernameExists = async (username) => {
    try {
      // Query users by username
      const userRef = doc(db, 'usernames', username);
      const userSnap = await getDoc(userRef);
      return userSnap.exists();
    } catch (error) {
      console.error("Error checking username:", error);
      return false;
    }
  };

  // Create user document in Firestore
  const createUserDocument = async (user, username) => {
    try {
      // Create user document
      await setDoc(doc(db, 'users', user.uid), {
        username: username,
        points: 0,
        gameCount: 0,
        likeCount: 0,
        project_ids: [],
        email: user.email,
        createdAt: new Date(),
      });

      // Create username document for quick lookup
      await setDoc(doc(db, 'usernames', username), {
        uid: user.uid
      });

      // Update profile with displayName
      await updateProfile(user, { displayName: username });

    } catch (error) {
      console.error("Error creating user document:", error);
      throw error;
    }
  };

  // Authenticate with Email/Password
  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        router.push('/profile');
      } else {
        // Check if username is provided for signup
        if (!username) {
          setError('Username is required');
          setLoading(false);
          return;
        }

        // Check if username already exists
        const usernameExists = await checkUsernameExists(username);
        if (usernameExists) {
          setError('Username already taken');
          setLoading(false);
          return;
        }

        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Create user document in Firestore
        await createUserDocument(userCredential.user, username);
        
        router.push('/profile');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Authenticate with Google
  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user already exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // If new Google user, redirect to username setup page
        // Store auth info in sessionStorage temporarily
        sessionStorage.setItem('googleAuthUser', JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName
        }));
        router.push('/setup-username');
      } else {
        // Existing user, redirect to profile
        router.push('/profile');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 retro-grid-bg">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 border-4 border-indigo-600 rounded-lg shadow-[8px_8px_0px_0px_rgba(79,70,229)] crt-on">
        <div>
          {/* Game controller icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 flex items-center justify-center bg-indigo-900 rounded-full border-4 border-pink-500 mb-4">
              {isLogin ? (
                <LogIn size={36} className="text-pink-500" />
              ) : (
                <UserPlus size={36} className="text-pink-500" />
              )}
            </div>
          </div>
          
          <h2 className="mt-4 text-center text-3xl font-extrabold text-pink-500"
              style={{ 
                textShadow: '2px 2px 0px #4F46E5, 3px 3px 0px #2D3748',
                fontFamily: '"Press Start 2P", cursive'
              }}>
            {isLogin ? 'PLAYER LOGIN' : 'NEW PLAYER'}
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleAuth}>
          <div className="rounded-md shadow-sm -space-y-px">
            {!isLogin && (
              <div>
                <label htmlFor="username" className="sr-only">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required={!isLogin}
                  className="appearance-none relative block w-full px-3 py-3 border-2 border-indigo-500 placeholder-gray-400 text-white bg-gray-700 rounded-t-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            )}
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`appearance-none relative block w-full px-3 py-3 border-2 border-indigo-500 placeholder-gray-400 text-white bg-gray-700 ${isLogin ? 'rounded-t-md' : ''} focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 sm:text-sm`}
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none relative block w-full px-3 py-3 border-2 border-indigo-500 placeholder-gray-400 text-white bg-gray-700 rounded-b-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center px-4 py-2 bg-gray-700 border-2 border-red-500 rounded-md">
              {error}
            </div>
          )}

          <div className="text-sm text-center">
            <button
              type="button"
              className="font-medium text-indigo-400 hover:text-pink-400 transition-colors duration-200"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
            </button>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border-2 border-pink-400 text-md font-bold rounded-md text-white bg-pink-600 hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-transform duration-200 hover:translate-y-[-2px] shadow-[2px_2px_0px_0px_rgba(236,72,153)]"
            >
              {loading ? (
                <div className="inline-block w-6 h-6 pixel-spinner mr-2"></div>
              ) : isLogin ? (
                <LogIn size={20} className="mr-2" />
              ) : (
                <UserPlus size={20} className="mr-2" />
              )}
              {loading ? 'LOADING...' : isLogin ? 'SIGN IN' : 'SIGN UP'}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-indigo-400"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-indigo-400">OR</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex justify-center py-3 px-4 border-2 border-indigo-400 rounded-md shadow-[2px_2px_0px_0px_rgba(79,70,229)] bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white hover:transform hover:translate-y-[-2px] transition-transform duration-200"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M21.35 11.1h-9.17v2.92h5.33c-.23 1.2-.96 2.21-2.05 2.92v2.42h3.3c1.93-1.78 3.05-4.42 3.05-7.34 0-.62-.06-1.23-.16-1.82z"/>
                <path fill="#34A853" d="M12.18 22c2.64 0 4.87-.88 6.49-2.4l-3.3-2.42c-.91.61-2.07.97-3.19.97-2.45 0-4.52-1.66-5.26-3.89H3.5v2.44C5.14 19.94 8.45 22 12.18 22z"/>
                <path fill="#FBBC05" d="M6.92 13.2c-.21-.61-.33-1.27-.33-1.95 0-.68.12-1.34.33-1.95V6.86H3.5A9.89 9.89 0 002 11.25c0 1.53.36 2.98 1 4.25l3.92-2.3z"/>
                <path fill="#EA4335" d="M12.18 4.48c1.44 0 2.73.5 3.75 1.5l2.8-2.8C16.99 1.61 14.75.5 12.18.5 8.45.5 5.14 2.56 3.5 5.51l3.92 2.29c.74-2.23 2.81-3.89 5.26-3.89z"/>
              </svg>
              QUICK START WITH GOOGLE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}