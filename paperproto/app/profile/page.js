// app/dashboard/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { User, LogOut, Edit, Trophy, Heart, Star, Gamepad2 } from 'lucide-react';


// Create the Dashboard component that will be wrapped with ProtectedRoute
function DashboardContent() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Handle logout function
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // For testing purposes, use a static userId or fallback to demo data if auth fails
        const userId = user?.uid || "demoUser";
        const userDocRef = doc(db, "users", userId);
        
        try {
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            // If no user data is found, use the sample data instead
            const initialUserData = {
              username: user?.displayName || "My Cool Name",
              avatar: user?.photoURL || null,
              karmaScore: 112,
              projects: [
                { id: 1, name: "Project 1", plays: 2000, likes: 1100 },
                { id: 2, name: "Project 2", plays: 20, likes: 12 },
                { id: 3, name: "Project 3", plays: 0, likes: 0 }
              ]
            };
            
            // Try to set the doc, but don't block rendering if it fails
            try {
              await setDoc(userDocRef, initialUserData);
            } catch (e) {
              console.warn("Couldn't save initial user data:", e);
            }
            
            setUserData(initialUserData);
          }
        } catch (e) {
          console.error("Error accessing Firestore, using sample data:", e);
          // Fallback to sample data if Firestore access fails
          setUserData({
            username: "My Cool Name",
            avatar: null,
            karmaScore: 112,
            projects: [
              { id: 1, name: "Project 1", plays: 2000, likes: 1100 },
              { id: 2, name: "Project 2", plays: 20, likes: 12 },
              { id: 3, name: "Project 3", plays: 0, likes: 0 }
            ]
          });
        }
      } catch (error) {
        console.error("Error in user data setup:", error);
        // Ultimate fallback if everything fails
        setUserData({
          username: "My Cool Name",
          avatar: null,
          karmaScore: 112,
          projects: [
            { id: 1, name: "Project 1", plays: 2000, likes: 1100 },
            { id: 2, name: "Project 2", plays: 20, likes: 12 },
            { id: 3, name: "Project 3", plays: 0, likes: 0 }
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    
    // Set a timeout to ensure we don't get stuck in loading
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn("Loading timeout reached, using fallback data");
        setLoading(false);
        setUserData({
          username: "My Cool Name",
          avatar: null,
          karmaScore: 112,
          projects: [
            { id: 1, name: "Project 1", plays: 2000, likes: 1100 },
            { id: 2, name: "Project 2", plays: 20, likes: 12 },
            { id: 3, name: "Project 3", plays: 0, likes: 0 }
          ]
        });
      }
    }, 3000); // 3 second timeout
    
    fetchUserData();
    
    return () => clearTimeout(timeoutId);
  }, [user, loading]);

  // Handle profile image as base64 directly in Firestore
  const handleUploadProfileImage = async () => {
    if (!file || !user) return;
    
    try {
      setUploading(true);
      
      // Convert file to base64 string
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const base64String = e.target.result;
        
        // Update user data in state
        setUserData(prev => ({
          ...prev,
          avatar: base64String
        }));
        
        // Update the user document in Firestore
        await updateDoc(doc(db, "users", user.uid), { 
          avatar: base64String 
        });
        
        setUploading(false);
        setFile(null);
      };
      
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        setUploading(false);
      };
      
      // Read the file as data URL (base64)
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error("Error handling image:", error);
      setUploading(false);
    }
  };
  
  // Effect to upload image when file is selected
  useEffect(() => {
    if (file) {
      handleUploadProfileImage();
    }
  }, [file]);

  // Initialize with sample data if userData is still null after 1 second
  useEffect(() => {
    if (userData === null) {
      const timer = setTimeout(() => {
        console.log("Fallback to sample data due to timeout");
        setUserData({
          username: "My Cool Name",
          avatar: null,
          karmaScore: 112,
          projects: [
            { id: 1, name: "Project 1", plays: 2000, likes: 1100 },
            { id: 2, name: "Project 2", plays: 20, likes: 12 },
            { id: 3, name: "Project 3", plays: 0, likes: 0 }
          ]
        });
        setLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [userData]);


  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header with retro styling */}
      <header className="bg-indigo-900 border-b-4 border-pink-500 shadow-lg">
        <div className="container mx-auto py-6 px-4">
          <h1 className="text-4xl font-bold text-center tracking-wider text-pink-500" 
              style={{ 
                textShadow: '2px 2px 0px #4F46E5, 4px 4px 0px #2D3748',
                fontFamily: '"Press Start 2P", cursive'
              }}>
            PLAYER DASHBOARD
          </h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {/* Profile Section */}
        <div className="mb-12 flex flex-col md:flex-row gap-8">
          {/* Left Column - Profile Info */}
          <div className="md:w-1/3 bg-gray-800 p-6 border-4 border-indigo-600 relative rounded-lg shadow-[4px_4px_0px_0px_rgba(99,102,241)]">
            {/* Profile Image with Pixelated Border */}
            <div className="relative mb-6 mx-auto">
              <div className="w-40 h-40 mx-auto border-4 border-pink-500 p-2 bg-gray-900">
                {userData?.avatar ? (
                  <img 
                    src={userData?.avatar} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-900 text-pink-500 text-4xl font-bold">
                    {userData?.username?.charAt(0) || "?"}
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 p-2 bg-pink-600 hover:bg-pink-700 border-2 border-pink-400 cursor-pointer transition-colors duration-200">
                <Edit size={16} />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </label>
            </div>
            
            {/* Username */}
            <h1 className="text-3xl font-bold text-center mb-6 text-pink-400"
                style={{ 
                  textShadow: '2px 2px 0px #4F46E5',
                  fontFamily: '"Press Start 2P", cursive'
                }}>
              {userData?.username}
            </h1>
            
            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-2 mb-6 text-center">
              <div className="bg-gray-700 p-3 border-2 border-indigo-500 rounded-md">
                <Trophy size={20} className="mx-auto mb-1 text-yellow-400" />
                <span className="text-xl font-bold">12</span>
                <p className="text-xs text-gray-400">GAMES</p>
              </div>
              <div className="bg-gray-700 p-3 border-2 border-indigo-500 rounded-md">
                <Star size={20} className="mx-auto mb-1 text-yellow-400" />
                <span className="text-xl font-bold">4.5</span>
                <p className="text-xs text-gray-400">AVG RATING</p>
              </div>
              <div className="bg-gray-700 p-3 border-2 border-indigo-500 rounded-md">
                <Heart size={20} className="mx-auto mb-1 text-red-500" />
                <span className="text-xl font-bold">2.4k</span>
                <p className="text-xs text-gray-400">TOTAL LIKES</p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center p-3 bg-indigo-600 hover:bg-indigo-500 border-2 border-indigo-400 transition-colors duration-200 rounded-md shadow-[2px_2px_0px_0px_rgba(79,70,229)]">
                <Edit size={16} className="mr-2" /> Edit Profile
              </button>
              <button onClick={handleLogout} className="w-full flex items-center justify-center p-3 bg-pink-600 hover:bg-pink-500 border-2 border-pink-400 transition-colors duration-200 rounded-md shadow-[2px_2px_0px_0px_rgba(236,72,153)]">
                <LogOut size={16} className="mr-2" /> Logout
              </button>
            </div>
          </div>
          
          {/* Right Column - Projects */}
          <div className="md:w-2/3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-indigo-400"
                  style={{ 
                    textShadow: '1px 1px 0px #EC4899',
                    fontFamily: '"Press Start 2P", cursive'
                  }}>
                <Gamepad2 size={24} className="inline mr-2 text-pink-400" /> 
                MY GAMES
              </h2>
              <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 border-2 border-indigo-400 flex items-center transition-colors duration-200 rounded-md shadow-[2px_2px_0px_0px_rgba(79,70,229)]">
                <span className="text-2xl mr-1">+</span> New Game
              </button>
            </div>
            
            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loading ? (
                <div className="col-span-2 flex justify-center items-center h-64">
                  <div className="w-16 h-16 pixel-spinner"></div>
                </div>
              ) : userData?.projects.map(project => (
                <div key={project.id} className="bg-gray-800 border-4 border-indigo-600 overflow-hidden rounded-lg transition-transform duration-200 hover:scale-105 shadow-[4px_4px_0px_0px_rgba(79,70,229)]">
                  <div className="relative h-40 bg-indigo-900">
                    {project.image ? (
                      <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-4xl font-bold text-pink-500"
                            style={{ 
                              textShadow: '2px 2px 0px #4F46E5',
                              fontFamily: '"Press Start 2P", cursive'
                            }}>
                          {project.name.charAt(0)}
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
                    <h3 className="absolute bottom-2 left-4 text-xl font-bold text-pink-400"
                        style={{ 
                          textShadow: '1px 1px 0px #4F46E5'
                        }}>
                      {project.name}
                    </h3>
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <div className="flex space-x-4">
                      <div className="flex items-center">
                        <Gamepad2 size={16} className="mr-1 text-indigo-400" />
                        <span>{project.plays}</span>
                      </div>
                      <div className="flex items-center">
                        <Heart size={16} className="mr-1 text-red-500" />
                        <span>{project.likes}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Star size={16} className="mr-1 text-yellow-400" />
                      <span>{project.rating || "N/A"}</span>
                    </div>
                  </div>
                  <div className="flex border-t border-gray-700">
                    <button className="flex-1 p-2 bg-indigo-700 hover:bg-indigo-600 text-center transition-colors duration-200">Edit</button>
                    <button className="flex-1 p-2 bg-pink-600 hover:bg-pink-500 text-center transition-colors duration-200">Play</button>
                    <button className="flex-1 p-2 bg-indigo-600 hover:bg-indigo-500 text-center transition-colors duration-200">Share</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Wrap the Dashboard content with ProtectedRoute
export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}