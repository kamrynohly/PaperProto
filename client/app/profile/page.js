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
  serverTimestamp
} from 'firebase/firestore';
import {
  LogOut,
  Edit,
  Trophy,
  Heart,
  Star,
  Gamepad2
} from 'lucide-react';
import Link from 'next/link';

function DashboardContent() {
  const router = useRouter();
  const { currentUser, userData, loading: authLoading, logout, db, refreshUserData } = useAuth();

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // --- EDIT MODAL STATE ---
  const [editingProject, setEditingProject] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editFile, setEditFile] = useState(null);
  const [editPreview, setEditPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  // SHARE
  const [showCopyNotification, setShowCopyNotification] = useState(false);

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
            gameCount: userData.gameCount || 0,
            favCount: userData.favCount || 0,
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
                    playCount: projectDoc.data().playCount || 0,
                    favCount: projectDoc.data().favCount || 0,
                    rating: projectDoc.data().rating || "N/A",
                    image: projectDoc.data().image || null
                  });
                }
              }
              
              // Calculate average rating across all projects
              const calculateAverageRating = (projects) => {
                const projectsWithRatings = projects.filter(project => 
                  project.rating && project.rating !== "N/A" && !isNaN(parseFloat(project.rating))
                );
                
                if (projectsWithRatings.length === 0) return "--";
                
                const sum = projectsWithRatings.reduce((acc, project) => 
                  acc + parseFloat(project.rating), 0
                );
                
                return (sum / projectsWithRatings.length).toFixed(1);
              };
              
              // Set average rating
              dashboardUserData.avgRating = calculateAverageRating(projectsData);
              
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
              gameCount: userDocData.gameCount || 0,
              favCount: userDocData.favCount || 0,
              avgRating: userDocData.avgRating || "--",
              projects: []
            };
            
            // Fetch projects if project_ids exists
            if (userDocData.project_ids && userDocData.project_ids.length > 0) {
              try {
                const projectsData = [];
                
                // For each project ID, fetch project details
                for (const projectId of userDocData.project_ids) {
                  const projectDoc = await getDoc(doc(db, "games", projectId));
                  if (projectDoc.exists()) {
                    projectsData.push({
                      id: projectId,
                      title: projectDoc.data().title || "Untitled Project",
                      description: projectDoc.data().description || "",
                      playCount: projectDoc.data().playCount || 0,
                      favCount: projectDoc.data().favCount || 0,
                      rating: projectDoc.data().rating || "N/A",
                      image: projectDoc.data().image || null
                    });
                  }
                }
                
                // Calculate average rating across all projects
                const calculateAverageRating = (projects) => {
                  const projectsWithRatings = projects.filter(project => 
                    project.rating && project.rating !== "N/A" && !isNaN(parseFloat(project.rating))
                  );
                  
                  if (projectsWithRatings.length === 0) return "--";
                  
                  const sum = projectsWithRatings.reduce((acc, project) => 
                    acc + parseFloat(project.rating), 0
                  );
                  
                  return (sum / projectsWithRatings.length).toFixed(1);
                };
                
                // Set average rating
                dashboardUserData.avgRating = calculateAverageRating(projectsData);
                
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
              project_ids: [],
              avatar: currentUser.photoURL || null,
              email: currentUser.email,
              createdAt: serverTimestamp(),
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
              gameCount: initialUserData.gameCount || 0,
              favCount: initialUserData.favCount || 0,
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
          gameCount: 0,
          favCount: 0,
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
          projects: [],
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
          gameCount: 0,
          favCount: 0,
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

  // --------------------------------------------------
  //  EDIT MODAL HANDLERS
  // --------------------------------------------------
  const openEditModal = project => {
    setEditingProject(project.id);
    setEditTitle(project.title || '');
    setEditDesc(project.description || '');
    setEditPreview(project.image || null);
    setEditFile(null);
  };

  const onEditFileChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    setEditFile(file);
    const reader = new FileReader();
    reader.onload = ev => setEditPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const saveProjectEdits = async () => {
    if (!editingProject) return;
    setSaving(true);

    try {
      const ref = doc(db, 'games', editingProject);
      const imageToStore = editFile ? editPreview : editPreview; // preview already base64
      await updateDoc(ref, {
        title: editTitle,
        description: editDesc,
        image: imageToStore
      });

      // update local
      setDashboardData(d => ({
        ...d,
        projects: d.projects.map(p =>
          p.id === editingProject
            ? { ...p, title: editTitle, description: editDesc, image: imageToStore }
            : p
        )
      }));

      setEditingProject(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleShare = (gameId) => {
    // Create the game URL
    const gameUrl = `https://paper-proto-one.vercel.app/games/${gameId}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(gameUrl)
      .then(() => {
        // Show notification
        setShowCopyNotification(true);
        
        // Hide notification after 2.5 seconds
        setTimeout(() => {
          setShowCopyNotification(false);
        }, 2500);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  // --------------------------------------------------
  //  RENDER
  // --------------------------------------------------
  if (loading || !dashboardData) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="w-16 h-16 pixel-spinner" />
      </div>
    );
  }

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
                <span className="text-xl font-bold">{dashboardData?.favCount || "0"}</span>
                <p className="text-xs text-gray-400">LIKES</p>
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
              <Link href="/create">
                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 border-2 border-indigo-400 flex items-center transition-colors duration-200 rounded-md shadow-[2px_2px_0px_0px_rgba(79,70,229)]">
                  <span className="text-2xl mr-1">+</span> New Game
                </button>
              </Link>
            </div>
            
            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loading ? (
                <div className="col-span-2 flex justify-center items-center h-64">
                  <div className="w-16 h-16 pixel-spinner"></div>
                </div>
              ) : dashboardData?.projects && dashboardData.projects.length > 0 ? (
                dashboardData.projects.map(p => (
                  <div key={p.id} className="bg-gray-800 border-4 border-indigo-600 overflow-hidden rounded-lg transition-transform duration-200 hover:scale-105 shadow-[4px_4px_0px_0px_rgba(79,70,229)]">
                    <div className="relative h-40 bg-indigo-900">
                      {p.image ? (
                        <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-4xl font-bold text-pink-500"
                              style={{ 
                                textShadow: '2px 2px 0px #4F46E5',
                                fontFamily: '"Press Start 2P", cursive'
                              }}>
                            {p.title && p.title.charAt(0)}
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
                      <h3 className="absolute bottom-2 left-4 text-xl font-bold text-pink-400"
                          style={{ 
                            textShadow: '1px 1px 0px #4F46E5'
                          }}>
                        {p.title || "Untitled Project"}
                      </h3>
                    </div>
                    <div className="p-4 flex justify-between items-center">
                      <div className="flex space-x-4">
                        <div className="flex items-center">
                          <Gamepad2 size={16} className="mr-1 text-indigo-400" />
                          <span>{p.playCount || 0}</span>
                        </div>
                        <div className="flex items-center">
                          <Heart size={16} className="mr-1 text-red-500" />
                          <span>{p.favCount || 0}</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Star size={16} className="mr-1 text-yellow-400" />
                        <span>{typeof p.rating === 'number' ? p.rating.toFixed(1) : (p.rating || 'N/A')}</span>
                      </div>
                    </div>
                    
                    {/* BUTTON SECTION */}
                    <div className="grid grid-cols-3 border-t border-gray-700">
                      <button 
                        onClick={() => openEditModal(p)}
                        className="p-2 bg-indigo-700 hover:bg-indigo-600 text-center transition-colors duration-200"
                      >
                        Edit
                      </button>
                      
                      <Link href={`/games/${p.id}`} className="block">
                        <button className="w-full p-2 bg-pink-600 hover:bg-pink-500 text-center transition-colors duration-200">
                          Play
                        </button>
                      </Link>
                      
                      <div className="relative">
                        <button 
                          className="w-full p-2 bg-indigo-600 hover:bg-indigo-500 text-center transition-colors duration-200"
                          onClick={() => handleShare(p.id)}
                        >
                          Share
                        </button>
                      </div>
                      {/* Notification popup - moved outside the relative container to avoid being clipped */}
                      {showCopyNotification && (
                        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-indigo-900 border-4 border-pink-500 text-white px-6 py-4 rounded-md shadow-[0px_0px_15px_5px_rgba(236,72,153,0.5)]">
                          <div className="text-center">
                            <p className="text-lg font-bold text-pink-400" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '14px' }}>
                              LINK COPIED!
                            </p>
                            <p className="mt-2 text-sm text-indigo-200">Game link saved to clipboard</p>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* END OF BUTTON SECTION */}
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
                    You have not created any games yet. Click the button below to get started!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <BottomNavigation/>

      {/** EDIT MODAL **/}
      {editingProject && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md space-y-4">
            <h3 className="text-xl font-bold text-pink-400">Edit Game</h3>

            <label className="block text-pink-300 text-sm">Cover Image</label>
            <input type="file" accept="image/*" onChange={onEditFileChange} className="text-xs text-gray-300" />
            {editPreview && (
              <img src={editPreview} className="w-full h-32 object-cover rounded" alt="Preview" />
            )}

            <label className="block text-pink-300 text-sm">Title</label>
            <input
              type="text"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              className="w-full bg-gray-700 px-3 py-2 rounded text-white text-sm"
            />

            <label className="block text-pink-300 text-sm">Description</label>
            <textarea
              value={editDesc}
              onChange={e => setEditDesc(e.target.value)}
              className="w-full bg-gray-700 px-3 py-2 rounded text-white text-sm h-20 resize-none"
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setEditingProject(null)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm"
              >Cancel</button>
              <button
                onClick={saveProjectEdits}
                disabled={saving}
                className="px-4 py-2 bg-pink-600 hover:bg-pink-500 rounded text-white text-sm disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
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