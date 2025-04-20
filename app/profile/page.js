'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import BottomNavigation from '../../components/BottomNavigation';
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
import { User, LogOut, Edit, Trophy, Heart, Star, Gamepad2 } from 'lucide-react';
import Link from 'next/link';

// Create the Dashboard component that will be wrapped with ProtectedRoute
function DashboardContent() {
  const router = useRouter();
  const { currentUser, userData, loading: authLoading, logout, db, refreshUserData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
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
        if (authLoading) return;
        
        // If user data already exists in context, use it as a base
        if (userData) {
          // Transform userData to match expected dashboard structure
          const dashboardUserData = {
            username: userData.username || "Unknown",
            avatar: userData.avatar || null,
            points: userData.points || 0,
            gameCount: userData.gameCount || 0,
            likeCount: userData.likeCount || 0,
            avgRating: userData.avgRating || "--",
            projects: []
          };
          
          // Fetch projects if project_ids exists
          if (userData.project_ids && userData.project_ids.length > 0) {
            try {
              const projectsData = [];
              
              // For each project ID, fetch project details
              for (const projectId of userData.project_ids) {
                const projectDoc = await getDoc(doc(db, "games", projectId));
                if (projectDoc.exists()) {
                  projectsData.push({
                    id: projectId,
                    title: projectDoc.data().title || "Untitled Project",
                    description: projectDoc.data().description || "",
                    plays: projectDoc.data().plays || 0,
                    likes: projectDoc.data().likes || 0,
                    rating: projectDoc.data().rating || "N/A",
                    image: projectDoc.data().image || null
                  });
                }
              }
              
              dashboardUserData.projects = projectsData;
            } catch (error) {
              console.error("Error fetching projects:", error);
            }
          }
          
          setDashboardData(dashboardUserData);
          setLoading(false);
          return;
        }
        
        // If userData doesn't exist but user is authenticated, try to fetch data
        if (currentUser) {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userDocData = userDoc.data();
            
            // Create user dashboard data
            const dashboardUserData = {
              username: userDocData.username || currentUser.displayName || "Unknown",
              avatar: userDocData.avatar || null,
              points: userDocData.points || 0,
              gameCount: userDocData.gameCount || 0,
              likeCount: userDocData.likeCount || 0,
              avgRating: userDocData.avgRating || "--",
              projects: []
            };
            
            // Fetch projects if project_ids exists
            console.log("CURRENT USER")
            console.log(userDocData.project_ids)
            if (userDocData.project_ids && userDocData.project_ids.length > 0) {
              try {
                const projectsData = [];
                
                // For each project ID, fetch project details
                for (const projectId of userDocData.project_ids) {
                  const projectDoc = await getDoc(doc(db, "projects", projectId));
                  if (projectDoc.exists()) {
                    projectsData.push({
                      id: projectId,
                      title: projectDoc.data().title || "Untitled Project",
                      description: projectDoc.data().description || "",
                      plays: projectDoc.data().plays || 0,
                      likes: projectDoc.data().likes || 0,
                      rating: projectDoc.data().rating || "N/A",
                      image: projectDoc.data().image || null
                    });
                  }
                }
                
                dashboardUserData.projects = projectsData;
              } catch (error) {
                console.error("Error fetching projects:", error);
              }
            }
            
            setDashboardData(dashboardUserData);
            setLoading(false);
            
            // Also refresh user data in the context
            refreshUserData();
            return;
          } else {
            // If user document doesn't exist, create initial user data
            const initialUserData = {
              username: currentUser.displayName || "Unknown",
              points: 0,
              project_ids: [],
              avatar: currentUser.photoURL || null,
              email: currentUser.email,
              createdAt: serverTimestamp()
            };
            
            // Try to set the doc, but don't block rendering if it fails
            try {
              await setDoc(userDocRef, initialUserData);
              // Also refresh user data in the context
              refreshUserData();
            } catch (e) {
              console.warn("Couldn't save initial user data:", e);
            }
            
            const dashboardUserData = {
              username: initialUserData.username,
              avatar: initialUserData.avatar,
              points: initialUserData.points,
              gameCount: initialUserData.gameCount || 0,
              likeCount: initialUserData.likeCount || 0,
              avgRating: initialUserData.avgRating || "--",
              projects: []
            };
            
            setDashboardData(dashboardUserData);
            setLoading(false);
            return;
          }
        }
        
        // Fallback to sample data if not authenticated or errors occur
        setDashboardData({
          username: "Unknown",
          avatar: null,
          points: 0,
          gameCount: 0,
          likeCount: 0,
          avgRating: "--",
          projects: []
        });
        setLoading(false);
      } catch (error) {
        console.error("Error in user data setup:", error);
        // Ultimate fallback if everything fails
        setDashboardData({
          username: "Error",
          avatar: null,
          points: 0,
          projects: []
        });
        setLoading(false);
      }
    };
    
    // Set a timeout to ensure we don't get stuck in loading
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn("Loading timeout reached, using fallback data");
        setLoading(false);
        setDashboardData({
          username: "Unknown",
          avatar: null,
          points: 0,
          gameCount: 0,
          likeCount: 0,
          avgRating: "--",
          projects: []
        });
      }
    }, 3000); // 3 second timeout
    
    fetchUserData();
    
    return () => clearTimeout(timeoutId);
  }, [currentUser, userData, authLoading, db, refreshUserData, loading]);

  // Handle profile image as base64 directly in Firestore
  const handleUploadProfileImage = async () => {
    if (!file || !currentUser) return;
    
    try {
      setUploading(true);
      
      // Convert file to base64 string
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const base64String = e.target.result;
        
        // Update dashboard data in state
        setDashboardData(prev => ({
          ...prev,
          avatar: base64String
        }));
        
        // Update the user document in Firestore
        await updateDoc(doc(db, "users", currentUser.uid), { 
          avatar: base64String 
        });
        
        // Refresh user data in context
        refreshUserData();
        
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
                {dashboardData?.avatar ? (
                  <img 
                    src={dashboardData?.avatar} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-900 text-pink-500 text-4xl font-bold">
                    {dashboardData?.username?.charAt(0) || "?"}
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
              {dashboardData?.username}
            </h1>
            
            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-2 mb-6 text-center">
              <div className="bg-gray-700 p-3 border-2 border-indigo-500 rounded-md">
                <Trophy size={20} className="mx-auto mb-1 text-yellow-400" />
                <span className="text-xl font-bold">{dashboardData?.gameCount}</span>
                <p className="text-xs text-gray-400">GAMES</p>
              </div>
              <div className="bg-gray-700 p-3 border-2 border-indigo-500 rounded-md">
                <Star size={20} className="mx-auto mb-1 text-yellow-400" />
                <span className="text-xl font-bold">{dashboardData?.avgRating}</span>
                <p className="text-xs text-gray-400">AVG RATING</p>
              </div>
              <div className="bg-gray-700 p-3 border-2 border-indigo-500 rounded-md">
                <Heart size={20} className="mx-auto mb-1 text-red-500" />
                <span className="text-xl font-bold">{dashboardData?.points || "0"}</span>
                <p className="text-xs text-gray-400">TOTAL POINTS</p>
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
              ) : dashboardData?.projects && dashboardData.projects.length > 0 ? (
                dashboardData.projects.map(project => (
                  <div key={project.id} className="bg-gray-800 border-4 border-indigo-600 overflow-hidden rounded-lg transition-transform duration-200 hover:scale-105 shadow-[4px_4px_0px_0px_rgba(79,70,229)]">
                    <div className="relative h-40 bg-indigo-900">
                      {project.image ? (
                        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-4xl font-bold text-pink-500"
                              style={{ 
                                textShadow: '2px 2px 0px #4F46E5',
                                fontFamily: '"Press Start 2P", cursive'
                              }}>
                            {project.title && project.title.charAt(0)}
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
                      <h3 className="absolute bottom-2 left-4 text-xl font-bold text-pink-400"
                          style={{ 
                            textShadow: '1px 1px 0px #4F46E5'
                          }}>
                        {project.title || "Untitled Project"}
                      </h3>
                    </div>
                    <div className="p-4 flex justify-between items-center">
                      <div className="flex space-x-4">
                        <div className="flex items-center">
                          <Gamepad2 size={16} className="mr-1 text-indigo-400" />
                          <span>{project.plays || 0}</span>
                        </div>
                        <div className="flex items-center">
                          <Heart size={16} className="mr-1 text-red-500" />
                          <span>{project.likes || 0}</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Star size={16} className="mr-1 text-yellow-400" />
                        <span>{project.rating || "N/A"}</span>
                      </div>
                    </div>
                    <div className="flex border-t border-gray-700">
                      <button className="flex-1 p-2 bg-indigo-700 hover:bg-indigo-600 text-center transition-colors duration-200">Edit</button>
                      <Link href={`/games/${project.id}`}>
                        <button className="flex-1 p-2 bg-pink-600 hover:bg-pink-500 text-center transition-colors duration-200">Play</button>
                      </Link>
                      <button className="flex-1 p-2 bg-indigo-600 hover:bg-indigo-500 text-center transition-colors duration-200">Share</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 bg-gray-800 border-4 border-indigo-600 p-8 rounded-lg text-center">
                  <Gamepad2 size={48} className="mx-auto mb-4 text-pink-400 opacity-50" />
                  <h3 className="text-2xl font-bold text-indigo-400 mb-4"
                      style={{ 
                        textShadow: '1px 1px 0px #EC4899',
                        fontFamily: '"Press Start 2P", cursive'
                      }}>
                    No Games Yet
                  </h3>
                  <p className="text-gray-400 mb-6">
                    You haven't created any games yet. Click the button below to get started!
                  </p>
                  {/* <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 border-2 border-indigo-400 inline-flex items-center transition-colors duration-200 rounded-md shadow-[2px_2px_0px_0px_rgba(79,70,229)]">
                    <span className="text-2xl mr-2">+</span> Create Your First Game
                  </button> */}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <BottomNavigation/>
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