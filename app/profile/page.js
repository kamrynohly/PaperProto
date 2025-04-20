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

  // --- EDIT MODAL STATE ---
  const [editingProject, setEditingProject] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editFile, setEditFile] = useState(null);
  const [editPreview, setEditPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  // --------------------------------------------------
  //  FETCH DASHBOARD DATA
  // --------------------------------------------------
  const fetchDashboard = async () => {
    if (authLoading) return;
    let base = userData;
    if (!base && currentUser) {
      const uDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (uDoc.exists()) base = uDoc.data();
      else {
        // create initial
        const init = {
          username: currentUser.displayName || 'Unknown',
          avatar: currentUser.photoURL || null,
          points: 0,
          project_ids: [],
          createdAt: serverTimestamp()
        };
        await setDoc(doc(db, 'users', currentUser.uid), init);
        base = init;
      }
      refreshUserData();
    }

    const dash = {
      username: base.username || 'Unknown',
      avatar: base.avatar || null,
      points: base.points || 0,
      gameCount: base.gameCount || 0,
      favCount: base.favCount || 0,
      avgRating: base.avgRating || '--',
      projects: []
    };

    if (base.project_ids?.length) {
      const proms = base.project_ids.map(id =>
        getDoc(doc(db, 'games', id)).then(d =>
          d.exists()
            ? { id, ...d.data() }
            : null
        )
      );
      const results = await Promise.all(proms);
      dash.projects = results.filter(Boolean);
    }

    setDashboardData(dash);
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboard();
  }, [authLoading, userData]);

  // --------------------------------------------------
  //  LOGOUT
  // --------------------------------------------------
  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

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
      {/* header */}
      <header className="bg-indigo-900 border-b-4 border-pink-500 shadow-lg">
        <div className="container mx-auto py-6 px-4">
          <h1 className="text-4xl font-bold text-center tracking-wider text-pink-500"
              style={{fontFamily:'"Press Start 2P",cursive'}}>
            PLAYER DASHBOARD
          </h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {/* PROFILE + STATS */}
        <div className="mb-12 flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3 bg-gray-800 p-6 border-4 border-indigo-600 rounded-lg relative">
            {/* avatar */}
            <div className="relative mb-6 mx-auto">
              <div className="w-40 h-40 border-4 border-pink-500 p-2 bg-gray-900">
                {dashboardData.avatar
                  ? <img src={dashboardData.avatar} className="w-full h-full object-cover" />
                  : <div className="w-full h-full bg-indigo-900 flex items-center justify-center text-pink-500 text-4xl">
                      {dashboardData.username.charAt(0)}
                    </div>}
              </div>
            </div>
            <h2 className="text-3xl font-bold text-center text-pink-400 mb-6">{dashboardData.username}</h2>
            <div className="grid grid-cols-3 gap-2 text-center mb-6">
              <div className="bg-gray-700 p-3 border-2 border-indigo-500 rounded">
                <Trophy className="mx-auto mb-1 text-yellow-400" />
                <div className="font-bold">{dashboardData.gameCount}</div>
                <div className="text-xs">GAMES</div>
              </div>
              <div className="bg-gray-700 p-3 border-2 border-indigo-500 rounded">
                <Star className="mx-auto mb-1 text-yellow-400" />
                <div className="font-bold">{dashboardData.avgRating}</div>
                <div className="text-xs">AVG RATING</div>
              </div>
              <div className="bg-gray-700 p-3 border-2 border-indigo-500 rounded">
                <Heart className="mx-auto mb-1 text-red-500" />
                <div className="font-bold">{dashboardData.points}</div>
                <div className="text-xs">POINTS</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full p-3 bg-pink-600 hover:bg-pink-500 rounded text-white"
            >
              <LogOut className="inline mr-2" /> Logout
            </button>
          </div>

          {/* projects */}
          <div className="md:w-2/3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-indigo-400">
                <Gamepad2 className="inline mr-2 text-pink-400" />
                MY GAMES
              </h2>
              <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-white">
                + New Game
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dashboardData.projects.map(p => (
                <div key={p.id} className="bg-gray-800 border-4 border-indigo-600 rounded-lg overflow-hidden">
                  <div className="relative h-40">
                    {p.image
                      ? <img src={p.image} className="w-full h-full object-cover" />
                      : <div className="w-full h-full bg-indigo-900 flex items-center justify-center text-pink-500 text-4xl">
                          {p.title.charAt(0)}
                        </div>}
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="text-xl font-bold text-pink-400">{p.title}</h3>
                    <p className="text-gray-300 text-sm line-clamp-2">{p.description}</p>
                    <div className="flex justify-between text-gray-400 text-sm">
                      <div><Gamepad2 className="inline mr-1" />{p.playCount}</div>
                      <div><Heart className="inline mr-1" />{p.favCount}</div>
                      <div><Star className="inline mr-1" />{p.rating}</div>
                    </div>
                  </div>
                  <div className="flex border-t border-gray-700">
                    <button
                      onClick={() => openEditModal(p)}
                      className="flex-1 p-2 bg-indigo-700 hover:bg-indigo-600"
                    >Edit</button>
                    <Link href={`/games/${p.id}`}>
                      <button className="flex-1 p-2 bg-pink-600 hover:bg-pink-500">Play</button>
                    </Link>
                    <button className="flex-1 p-2 bg-indigo-600 hover:bg-indigo-500">Share</button>
                  </div>
                </div>
              ))}
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
              <img src={editPreview} className="w-full h-32 object-cover rounded" />
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

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
