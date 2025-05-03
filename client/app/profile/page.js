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
  deleteDoc,
  arrayRemove,
  serverTimestamp
} from 'firebase/firestore';
import {
  LogOut,
  Edit,
  Trophy,
  Heart,
  Star,
  Gamepad2,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

import { onSnapshot } from "firebase/firestore";

// Added this function outside the component to avoid recreation on each render
const calculateAverageRating = (projects) => {
  const projectsWithRatings = projects.filter(project => 
    project.rating && project.rating !== "?" && !isNaN(parseFloat(project.rating))
  );
  
  if (projectsWithRatings.length === 0) return "--";
  
  const sum = projectsWithRatings.reduce((acc, project) => 
    acc + parseFloat(project.rating), 0
  );
  
  return (sum / projectsWithRatings.length).toFixed(1);
};

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

  // --- DELETE MODAL STATE ---
  const [deleteProject, setDeleteProject] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // SHARE
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Handle logout function
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Improved real-time listener for user data and games
  // Improved real-time listener for user data and games
  useEffect(() => {
    if (!currentUser) return;
  
    // Listen for ANY change to the user doc with onSnapshot (real-time)
    const userUnsubscribe = onSnapshot(
      doc(db, "users", currentUser.uid),
      userSnap => {
        if (!userSnap.exists()) {
          // If user document doesn't exist, create initial user data
          setDoc(doc(db, "users", currentUser.uid), {
            username: currentUser.displayName || "Unknown",
            project_ids: [],
            avatar: currentUser.photoURL || null,
            email: currentUser.email,
            createdAt: serverTimestamp(),
          }).catch(e => console.warn("Couldn't save initial user data:", e));
          
          setDashboardData({
            username: currentUser.displayName || "Unknown",
            avatar: currentUser.photoURL || null,
            gameCount: 0,
            favCount: 0,
            avgRating: "--",
            projects: []
          });
          setLoading(false);
          return;
        }

        const data = userSnap.data();
        
        // Create initial dashboard data with user info
        const dashboardUserData = {
          username: data.username || "Unknown",
          avatar: data.avatar,
          gameCount: data.project_ids?.length || 0,
          favCount: 0,
          avgRating: "--",
          projects: [],
        };
  
        // Set initial dashboard data with user information
        setDashboardData(dashboardUserData);
        
        // Now re-fetch the game docs too
        if (!data.project_ids || data.project_ids.length === 0) {
          // No projects, just update the dashboard data
          setLoading(false);
          return;
        }

        // Set up listeners for all games
        const gameListeners = data.project_ids.map(gameId => {
          return onSnapshot(
            doc(db, "games", gameId),
            gameSnap => {
              if (!gameSnap.exists()) return;
              
              setDashboardData(prevData => {
                // First, filter out any previous version of this game
                const filteredProjects = prevData?.projects?.filter(p => p.id !== gameId) || [];
                
                // Add the updated game
                const updatedProjects = [
                  ...filteredProjects,
                  {
                    id: gameId,
                    ...(gameSnap.data())
                  }
                ];
                
                // Calculate new average rating
                const newAvgRating = calculateAverageRating(updatedProjects);
                
                // Calculate total likes across all games
                const totalLikes = updatedProjects.reduce((total, project) => 
                  total + (project.favCount || 0), 0
                );
                
                return {
                  ...prevData, // Keep username and avatar from previous state
                  projects: updatedProjects,
                  avgRating: newAvgRating,
                  gameCount: updatedProjects.length,
                  favCount: totalLikes
                };
              });
              
              setLoading(false);
            },
            error => {
              console.error(`Error listening to game ${gameId}:`, error);
              setLoading(false);
            }
          );
        });
        
        // Return cleanup function
        return () => {
          gameListeners.forEach(unsubscribe => unsubscribe());
        };
      },
      error => {
        console.error("Error listening to user data:", error);
        setLoading(false);
      }
    );
  
    // Return cleanup function for user listener
    return () => {
      userUnsubscribe();
    };
  }, [currentUser, db]);

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions while maintaining aspect ratio
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to base64 with reduced quality
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          resolve(compressedBase64);
        };
        
        img.onerror = (error) => reject(error);
      };
      
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUploadProfileImage = async () => {
    if (!file || !currentUser) return;
    
    try {
      setUploading(true);
      setNotificationMessage('Compressing image...');
      setShowCopyNotification(true);
      
      // Compress the image first
      const compressedBase64 = await compressImage(file);
      
      try {
        setNotificationMessage('Uploading image...');
        
        // Update the user document in Firestore with compressed image
        await updateDoc(doc(db, "users", currentUser.uid), { 
          avatar: compressedBase64 
        });
        
        // Manually update the dashboardData state to show changes immediately
        setDashboardData(prevData => ({
          ...prevData,
          avatar: compressedBase64
        }));
        
        // Show success notification
        setNotificationMessage('Profile image updated!');
        setTimeout(() => {
          setShowCopyNotification(false);
        }, 2500);
      } catch (error) {
        console.error("Error updating profile:", error);
        setNotificationMessage('Image too large!');
        setTimeout(() => {
          setShowCopyNotification(false);
        }, 2500);
      }
    } catch (error) {
      console.error("Error handling image:", error);
      setNotificationMessage('Error processing image!');
      setTimeout(() => {
        setShowCopyNotification(false);
      }, 2500);
    } finally {
      setUploading(false);
      setFile(null);
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

      // merge confict resolution:
      setDashboardData(d => ({
        ...d,
        projects: d.projects.map(p =>
          p.id === editingProject
            ? { ...p, title: editTitle, description: editDesc, image: imageToStore }
            : p
        )
      }));

      // State will be updated by the real-time listener
      setEditingProject(null);
      
      // Show success notification
      setNotificationMessage('Game updated successfully!');
      setShowCopyNotification(true);
      setTimeout(() => setShowCopyNotification(false), 2500);
    } catch (err) {
      console.error(err);
      // Show error notification
      setNotificationMessage('Error updating game!');
      setShowCopyNotification(true);
      setTimeout(() => setShowCopyNotification(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  //  DELETE HANDLERS - NEW CODE
  // --------------------------------------------------
  const openDeleteModal = project => {
    setDeleteProject(project);
  };

  const confirmDelete = async () => {
    if (!deleteProject || !currentUser) return;
    setDeleting(true);

    try {
      // Delete the game document from Firestore
      await deleteDoc(doc(db, 'games', deleteProject.id));
      
      // Update the user document to remove the game from project_ids array
      await updateDoc(doc(db, 'users', currentUser.uid), {
        project_ids: arrayRemove(deleteProject.id)
      });

      // State will be updated by the real-time listener
      setDeleteProject(null);
      
      // Show success notification
      setNotificationMessage('Game deleted successfully!');
      setShowCopyNotification(true);
      setTimeout(() => setShowCopyNotification(false), 1000);
    } catch (err) {
      console.error("Error deleting game:", err);
      
      // Show error notification
      setNotificationMessage('Error deleting game!');
      setShowCopyNotification(true);
      setTimeout(() => setShowCopyNotification(false), 1000);
    } finally {
      setDeleting(false);
    }
  };

  // Share handler
  const handleShare = (gameId) => {
    // Create the game URL
    const gameUrl = `https://paper-proto.com/games/${gameId}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(gameUrl)
      .then(() => {
        // Show notification
        setNotificationMessage('Link copied to clipboard!');
        setShowCopyNotification(true);
        
        // Hide notification after 1 second
        setTimeout(() => {
          setShowCopyNotification(false);
        }, 1000);
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
                {/* removed this from merge conflict:*/}
              {/* <label className={`absolute bottom-0 right-0 p-2 ${uploading ? 'bg-gray-600' : 'bg-pink-600 hover:bg-pink-700'} border-2 border-pink-400 cursor-pointer transition-colors duration-200`}>
                {uploading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Edit size={16} />
                )} */}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                //   disabled={uploading} // idk if this is correct, just kept incoming from merge conflict
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
              {/* <button className="w-full flex items-center justify-center p-3 bg-indigo-600 hover:bg-indigo-500 border-2 border-indigo-400 transition-colors duration-200 rounded-md shadow-[2px_2px_0px_0px_rgba(79,70,229)]">
                <Edit size={16} className="mr-2" /> Edit Profile
              </button> */}
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
                        <span>{typeof p.rating === 'number' ? p.rating.toFixed(1) : (p.rating || '?')}</span>
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
                  <Link href="/create">
                    <button className="px-6 py-3 bg-pink-600 hover:bg-pink-500 border-2 border-pink-400 rounded-md shadow-lg transition-colors duration-200">
                      Create Your First Game
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <BottomNavigation/>

      {/** NOTIFICATION POPUP **/}
      {showCopyNotification && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-indigo-900 border-4 border-pink-500 text-white px-6 py-4 rounded-md shadow-[0px_0px_15px_5px_rgba(236,72,153,0.5)]">
          <div className="text-center">
            <p className="text-lg font-bold text-pink-400" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '14px' }}>
              {notificationMessage || 'LINK COPIED!'}
            </p>
          </div>
        </div>
      )}

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

            <div className="flex justify-between mt-6">
              {/* Delete button in edit modal */}
              <button
                onClick={() => {
                  setEditingProject(null);
                  // Get the project data to pass to delete modal
                  const projectToDelete = dashboardData.projects.find(p => p.id === editingProject);
                  if (projectToDelete) {
                    openDeleteModal(projectToDelete);
                  }
                }}
                className="px-4 py-2 bg-red-700 hover:bg-red-600 rounded text-white text-sm flex items-center"
              >
                <Trash2 size={16} className="mr-2" /> Delete Game
              </button>
              
              <div className="flex space-x-2">
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
        </div>
      )}

      {/** DELETE CONFIRMATION MODAL - NEW **/}
      {deleteProject && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md space-y-4 border-2 border-red-500">
            <div className="flex items-center space-x-3">
              <AlertTriangle size={24} className="text-red-500" />
              <h3 className="text-xl font-bold text-red-400">Delete Game</h3>
            </div>

            <p className="text-gray-300">
              Are you sure you want to delete <span className="font-bold text-pink-400">{deleteProject.title || "this game"}</span>? This action cannot be undone.
            </p>

            <div className="flex justify-end space-x-2 pt-4">
              <button
                onClick={() => setDeleteProject(null)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded text-white text-sm disabled:opacity-50 flex items-center"
              >
                {deleting ? 'Deleting...' : 'Delete Game'}
                {!deleting && <Trash2 size={16} className="ml-2" />}
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