'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { UserPlus } from 'lucide-react';

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

export default function SetupUsername() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleUser, setGoogleUser] = useState(null);
  const [suggestedUsername, setSuggestedUsername] = useState('');
  const router = useRouter();

  // Get the user data from sessionStorage on component mount
  useEffect(() => {
    const userJson = sessionStorage.getItem('googleAuthUser');
    if (!userJson) {
      // No user data found, redirect to login
      router.push('/login');
      return;
    }

    const userObj = JSON.parse(userJson);
    setGoogleUser(userObj);

    // Generate suggested username from Google display name or email
    let suggestion = '';
    if (userObj.displayName) {
      suggestion = userObj.displayName
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '');
    } else if (userObj.email) {
      suggestion = userObj.email.split('@')[0]
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '');
    }

    if (suggestion) {
      setSuggestedUsername(suggestion);
      setUsername(suggestion);
    }
  }, [router]);

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
        favCount: 0,
        project_ids: [],
        email: user.email,
        createdAt: new Date(),
      });

      // Create username document for quick lookup
      await setDoc(doc(db, 'usernames', username), {
        uid: user.uid
      });

      // Update profile with displayName
      const currentUser = auth.currentUser;
      if (currentUser) {
        await updateProfile(currentUser, { displayName: username });
      }

    } catch (error) {
      console.error("Error creating user document:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate username
      if (!username || username.length < 3) {
        setError('Username must be at least 3 characters');
        setLoading(false);
        return;
      }

      if (username.length > 20) {
        setError('Username must be less than 20 characters');
        setLoading(false);
        return;
      }

      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        setError('Username can only contain letters, numbers, and underscores');
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

      // Create user document in Firestore
      if (googleUser) {
        await createUserDocument(googleUser, username);
        
        // Clear session storage
        sessionStorage.removeItem('googleAuthUser');
        
        // Redirect to profile
        router.push('/profile');
      } else {
        setError('User data not found');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error in username setup:', error);
      setError(error.message || 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 retro-grid-bg">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 border-4 border-indigo-600 rounded-lg shadow-[8px_8px_0px_0px_rgba(79,70,229)] crt-on">
        <div>
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 flex items-center justify-center bg-indigo-900 rounded-full border-4 border-pink-500 mb-4">
              <UserPlus size={36} className="text-pink-500" />
            </div>
          </div>
          
          <h2 className="mt-4 text-center text-3xl font-extrabold text-pink-500"
              style={{ 
                textShadow: '2px 2px 0px #4F46E5, 3px 3px 0px #2D3748',
                fontFamily: '"Press Start 2P", cursive'
              }}>
            CREATE USERNAME
          </h2>
          
          <p className="mt-4 text-center text-sm text-gray-300">
            Welcome to PaperProto! Choose a username to continue.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
              Your Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="appearance-none relative block w-full px-3 py-3 border-2 border-indigo-500 placeholder-gray-400 text-white bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <p className="mt-1 text-xs text-gray-400">
              Only letters, numbers, and underscores. 3-20 characters.
            </p>
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center px-4 py-2 bg-gray-700 border-2 border-red-500 rounded-md">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border-2 border-pink-400 text-md font-bold rounded-md text-white bg-pink-600 hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-transform duration-200 hover:translate-y-[-2px] shadow-[2px_2px_0px_0px_rgba(236,72,153)]"
            >
              {loading ? (
                <div className="inline-block w-6 h-6 pixel-spinner mr-2"></div>
              ) : (
                <UserPlus size={20} className="mr-2" />
              )}
              {loading ? 'SAVING...' : 'CONTINUE TO GAME'}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              // Clear session storage and go back to login
              sessionStorage.removeItem('googleAuthUser');
              router.push('/login');
            }}
            className="text-sm text-indigo-400 hover:text-pink-400 transition-colors duration-200"
          >
            Cancel and go back
          </button>
        </div>
      </div>
    </div>
  );
}