'use client';

import { useState, useEffect } from 'react';
import { 
  launchGameRoom, 
  joinGameRoom, 
  getPlayers, 
  subscribeToGameUpdates, 
  sendGameUpdate, 
  gameEnd, 
  heartbeat 
} from '../utils/grpcClient';

// Helper functions
const generateSessionID = () => `game_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
const generateUserID = () => `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

export default function GrpcTestUI() {
  // Shared state
  const [activeTab, setActiveTab] = useState('launch');
  const [logs, setLogs] = useState([]);
  
  // Add log helper
  const addLog = (message) => {
    setLogs(prev => [
      { id: Date.now(), timestamp: new Date().toISOString(), message },
      ...prev
    ]);
  };
  
  // Auto-generate IDs for all tabs
  const [sharedState, setSharedState] = useState({
    gameSessionID: generateSessionID(),
    hostID: generateUserID(),
    playerID: generateUserID(),
  });
  
  // Reset generated IDs
  const regenerateIDs = () => {
    const newState = {
      gameSessionID: generateSessionID(),
      hostID: generateUserID(),
      playerID: generateUserID(),
    };
    setSharedState(newState);
    addLog(`Generated new IDs: Session=${newState.gameSessionID}, Host=${newState.hostID}, Player=${newState.playerID}`);
  };
  
  // Tabs to render different function tests
  const tabs = [
    { id: 'launch', label: 'Launch Game Room' },
    { id: 'join', label: 'Join Game Room' },
    { id: 'players', label: 'Get Players' },
    { id: 'subscribe', label: 'Subscribe to Updates' },
    { id: 'send', label: 'Send Game Update' },
    { id: 'end', label: 'Game End' },
    { id: 'heartbeat', label: 'Heartbeat' },
  ];
  
  // Component for Launch Game Room
  const LaunchGameRoomTab = () => {
    const [hostUsername, setHostUsername] = useState('HostPlayer');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    
    const handleLaunch = async () => {
      setLoading(true);
      setResult(null);
      
      try {
        addLog(`Launching game room: sessionID=${sharedState.gameSessionID}, hostID=${sharedState.hostID}, username=${hostUsername}`);
        
        const response = await launchGameRoom(
          sharedState.gameSessionID,
          sharedState.hostID,
          hostUsername
        );
        
        setResult(response);
        addLog(`Launch result: ${JSON.stringify(response)}`);
      } catch (error) {
        setResult({ error: error.message });
        addLog(`Launch error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    return (
      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Game Session ID:</label>
          <input
            type="text"
            value={sharedState.gameSessionID}
            onChange={(e) => setSharedState({...sharedState, gameSessionID: e.target.value})}
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium">Host ID:</label>
          <input
            type="text"
            value={sharedState.hostID}
            onChange={(e) => setSharedState({...sharedState, hostID: e.target.value})}
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium">Host Username:</label>
          <input
            type="text"
            value={hostUsername}
            onChange={(e) => setHostUsername(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>
        
        <button
          onClick={handleLaunch}
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? 'Launching...' : 'Launch Game Room'}
        </button>
        
        {result && !result.error && (
          <div className="p-3 bg-green-100 text-green-800 rounded-md">
            <p><strong>Status:</strong> {result.status}</p>
            <p><strong>Message:</strong> {result.message}</p>
          </div>
        )}
        
        {result && result.error && (
          <div className="p-3 bg-red-100 text-red-800 rounded-md">
            <p><strong>Error:</strong> {result.error}</p>
          </div>
        )}
      </div>
    );
  };
  
  // Component for Join Game Room
  const JoinGameRoomTab = () => {
    const [playerUsername, setPlayerUsername] = useState('GuestPlayer');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    
    const handleJoin = async () => {
      setLoading(true);
      setResult(null);
      
      try {
        addLog(`Joining game room: sessionID=${sharedState.gameSessionID}, playerID=${sharedState.playerID}, username=${playerUsername}`);
        
        const response = await joinGameRoom(
          sharedState.gameSessionID,
          sharedState.playerID,
          playerUsername
        );
        
        setResult(response);
        addLog(`Join result: ${JSON.stringify(response)}`);
      } catch (error) {
        setResult({ error: error.message });
        addLog(`Join error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    return (
      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Game Session ID:</label>
          <input
            type="text"
            value={sharedState.gameSessionID}
            onChange={(e) => setSharedState({...sharedState, gameSessionID: e.target.value})}
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium">Player ID:</label>
          <input
            type="text"
            value={sharedState.playerID}
            onChange={(e) => setSharedState({...sharedState, playerID: e.target.value})}
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium">Player Username:</label>
          <input
            type="text"
            value={playerUsername}
            onChange={(e) => setPlayerUsername(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>
        
        <button
          onClick={handleJoin}
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? 'Joining...' : 'Join Game Room'}
        </button>
        
        {result && !result.error && (
          <div className="p-3 bg-green-100 text-green-800 rounded-md">
            <p><strong>Status:</strong> {result.status}</p>
            <p><strong>Message:</strong> {result.message}</p>
          </div>
        )}
        
        {result && result.error && (
          <div className="p-3 bg-red-100 text-red-800 rounded-md">
            <p><strong>Error:</strong> {result.error}</p>
          </div>
        )}
      </div>
    );
  };
  
  // Component for Get Players
  const GetPlayersTab = () => {
    const [players, setPlayers] = useState([]);
    const [isStreaming, setIsStreaming] = useState(false);
    const [playerStream, setPlayerStream] = useState(null);
    
    const handleGetPlayers = () => {
      if (isStreaming) {
        // Stop streaming
        if (playerStream) {
          playerStream.cancel();
          setPlayerStream(null);
        }
        setIsStreaming(false);
        addLog('Stopped player stream');
        return;
      }
      
      try {
        addLog(`Getting players for session: ${sharedState.gameSessionID}, requester: ${sharedState.hostID}`);
        setPlayers([]);
        
        // Start streaming players
        const stream = getPlayers(
          sharedState.gameSessionID,
          sharedState.hostID,
          (player) => {
            addLog(`Received player: ${JSON.stringify(player)}`);
            setPlayers(prev => [...prev, player]);
          }
        );
        
        setPlayerStream(stream);
        setIsStreaming(true);
        addLog('Started player stream');
      } catch (error) {
        addLog(`Get players error: ${error.message}`);
      }
    };
    
    // Clean up stream on unmount
    useEffect(() => {
      return () => {
        if (playerStream) {
          playerStream.cancel();
        }
      };
    }, [playerStream]);
    
    return (
      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Game Session ID:</label>
          <input
            type="text"
            value={sharedState.gameSessionID}
            onChange={(e) => setSharedState({...sharedState, gameSessionID: e.target.value})}
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium">Requester ID:</label>
          <input
            type="text"
            value={sharedState.hostID}
            onChange={(e) => setSharedState({...sharedState, hostID: e.target.value})}
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>
        
        <button
          onClick={handleGetPlayers}
          className={`w-full py-2 rounded-md text-white ${isStreaming ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          {isStreaming ? 'Stop Player Stream' : 'Start Player Stream'}
        </button>
        
        <div>
          <h3 className="font-medium mb-2">Received Players:</h3>
          {players.length === 0 ? (
            <p className="text-gray-500 text-sm italic">No players received yet</p>
          ) : (
            <div className="border rounded-md divide-y">
              {players.map((player, index) => (
                <div key={index} className="p-2">
                  <p><strong>Username:</strong> {player.username}</p>
                  <p><strong>User ID:</strong> {player.userID}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Component for Subscribe to Game Updates
  const SubscribeToGameUpdatesTab = () => {
    const [updates, setUpdates] = useState([]);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [updateStream, setUpdateStream] = useState(null);
    
    const handleSubscribe = () => {
      if (isSubscribed) {
        // Stop subscription
        if (updateStream) {
          updateStream.cancel();
          setUpdateStream(null);
        }
        setIsSubscribed(false);
        addLog('Stopped game updates subscription');
        return;
      }
      
      try {
        addLog(`Subscribing to updates for session: ${sharedState.gameSessionID}, player: ${sharedState.playerID}`);
        setUpdates([]);
        
        // Start subscription
        const stream = subscribeToGameUpdates(
          sharedState.gameSessionID,
          sharedState.playerID,
          (update) => {
            const newUpdate = {
              id: Date.now(),
              timestamp: new Date().toISOString(),
              ...update
            };
            addLog(`Received game update: ${JSON.stringify(update)}`);
            setUpdates(prev => [newUpdate, ...prev]);
          }
        );
        
        setUpdateStream(stream);
        setIsSubscribed(true);
        addLog('Started game updates subscription');
      } catch (error) {
        addLog(`Subscribe error: ${error.message}`);
      }
    };
    
    // Clean up stream on unmount
    useEffect(() => {
      return () => {
        if (updateStream) {
          updateStream.cancel();
        }
      };
    }, [updateStream]);
    
    return (
      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Game Session ID:</label>
          <input
            type="text"
            value={sharedState.gameSessionID}
            onChange={(e) => setSharedState({...sharedState, gameSessionID: e.target.value})}
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium">Player ID:</label>
          <input
            type="text"
            value={sharedState.playerID}
            onChange={(e) => setSharedState({...sharedState, playerID: e.target.value})}
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>
        
        <button
          onClick={handleSubscribe}
          className={`w-full py-2 rounded-md text-white ${isSubscribed ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          {isSubscribed ? 'Unsubscribe from Updates' : 'Subscribe to Updates'}
        </button>
        
        <div>
          <h3 className="font-medium mb-2">Received Updates:</h3>
          {updates.length === 0 ? (
            <p className="text-gray-500 text-sm italic">No updates received yet</p>
          ) : (
            <div className="border rounded-md divide-y max-h-48 overflow-y-auto">
              {updates.map(update => (
                <div key={update.id} className="p-2 text-sm">
                  <p className="text-xs text-gray-500">{new Date(update.timestamp).toLocaleTimeString()}</p>
                  <p><strong>From Player:</strong> {update.fromPlayerID}</p>
                  <p><strong>Game State:</strong> <span className="font-mono">{update.gameState}</span></p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Component for Send Game Update
  const SendGameUpdateTab = () => {
    const [gameState, setGameState] = useState(JSON.stringify({ type: 'MOVE', data: { x: 10, y: 20 } }, null, 2));
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    
    const handleSendUpdate = async () => {
      setLoading(true);
      setResult(null);
      
      try {
        addLog(`Sending game update: fromPlayer=${sharedState.hostID}, state=${gameState}`);
        
        const response = await sendGameUpdate(
          sharedState.hostID,
          gameState
        );
        
        setResult(response);
        addLog(`Send update result: ${JSON.stringify(response)}`);
      } catch (error) {
        setResult({ error: error.message });
        addLog(`Send update error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    return (
      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">From Player ID:</label>
          <input
            type="text"
            value={sharedState.hostID}
            onChange={(e) => setSharedState({...sharedState, hostID: e.target.value})}
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium">Game State (JSON):</label>
          <textarea
            value={gameState}
            onChange={(e) => setGameState(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm h-36 font-mono"
          />
        </div>
        
        <button
          onClick={handleSendUpdate}
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? 'Sending...' : 'Send Game Update'}
        </button>
        
        {result && !result.error && (
          <div className="p-3 bg-green-100 text-green-800 rounded-md">
            <p><strong>Status:</strong> {result.status}</p>
            <p><strong>Message:</strong> {result.message}</p>
          </div>
        )}
        
        {result && result.error && (
          <div className="p-3 bg-red-100 text-red-800 rounded-md">
            <p><strong>Error:</strong> {result.error}</p>
          </div>
        )}
      </div>
    );
  };
  
  // Component for Game End
  const GameEndTab = () => {
    const [endState, setEndState] = useState(JSON.stringify({ winner: 'hostID', finalScore: 100 }, null, 2));
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    
    const handleGameEnd = async () => {
      setLoading(true);
      setResult(null);
      
      try {
        addLog(`Ending game: sessionID=${sharedState.gameSessionID}, endState=${endState}`);
        
        const response = await gameEnd(
          sharedState.gameSessionID,
          endState
        );
        
        setResult(response);
        addLog(`Game end result: ${JSON.stringify(response)}`);
      } catch (error) {
        setResult({ error: error.message });
        addLog(`Game end error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    return (
      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Game Session ID:</label>
          <input
            type="text"
            value={sharedState.gameSessionID}
            onChange={(e) => setSharedState({...sharedState, gameSessionID: e.target.value})}
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium">End State (JSON):</label>
          <textarea
            value={endState}
            onChange={(e) => setEndState(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm h-36 font-mono"
          />
        </div>
        
        <button
          onClick={handleGameEnd}
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? 'Ending Game...' : 'End Game'}
        </button>
        
        {result && !result.error && (
          <div className="p-3 bg-green-100 text-green-800 rounded-md">
            <p><strong>Status:</strong> {result.status}</p>
            <p><strong>Message:</strong> {result.message}</p>
          </div>
        )}
        
        {result && result.error && (
          <div className="p-3 bg-red-100 text-red-800 rounded-md">
            <p><strong>Error:</strong> {result.error}</p>
          </div>
        )}
      </div>
    );
  };
  
  // Component for Heartbeat
  const HeartbeatTab = () => {
    const [serverID, setServerID] = useState('server1');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    
    const handleHeartbeat = async () => {
      setLoading(true);
      setResult(null);
      
      try {
        addLog(`Sending heartbeat: requestorID=${sharedState.hostID}, serverID=${serverID}`);
        
        const response = await heartbeat(
          sharedState.hostID,
          serverID
        );
        
        setResult(response);
        addLog(`Heartbeat result: ${JSON.stringify(response)}`);
      } catch (error) {
        setResult({ error: error.message });
        addLog(`Heartbeat error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    return (
      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Requestor ID:</label>
          <input
            type="text"
            value={sharedState.hostID}
            onChange={(e) => setSharedState({...sharedState, hostID: e.target.value})}
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium">Server ID:</label>
          <input
            type="text"
            value={serverID}
            onChange={(e) => setServerID(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>
        
        <button
          onClick={handleHeartbeat}
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? 'Sending Heartbeat...' : 'Send Heartbeat'}
        </button>
        
        {result && !result.error && (
          <div className="p-3 bg-green-100 text-green-800 rounded-md">
            <p><strong>Responder ID:</strong> {result.responderID}</p>
            <p><strong>Status:</strong> {result.status}</p>
          </div>
        )}
        
        {result && result.error && (
          <div className="p-3 bg-red-100 text-red-800 rounded-md">
            <p><strong>Error:</strong> {result.error}</p>
          </div>
        )}
      </div>
    );
  };
  
  // Render the active tab content
  const renderTabContent = () => {
    switch(activeTab) {
      case 'launch': return <LaunchGameRoomTab />;
      case 'join': return <JoinGameRoomTab />;
      case 'players': return <GetPlayersTab />;
      case 'subscribe': return <SubscribeToGameUpdatesTab />;
      case 'send': return <SendGameUpdateTab />;
      case 'end': return <GameEndTab />;
      case 'heartbeat': return <HeartbeatTab />;
      default: return <LaunchGameRoomTab />;
    }
  };
  
  return (
    <div className="p-6 max-w-6xl mx-auto text-black">
      <h1 className="text-2xl font-bold mb-4">gRPC Client Function Tester</h1>
      
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={regenerateIDs}
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium"
        >
          Regenerate IDs
        </button>
        
        <div className="text-sm">
          <span className="font-medium">Session:</span> {sharedState.gameSessionID.substring(0, 16)}...
        </div>
        
        <div className="text-sm">
          <span className="font-medium">Host:</span> {sharedState.hostID.substring(0, 8)}...
        </div>
        
        <div className="text-sm">
          <span className="font-medium">Player:</span> {sharedState.playerID.substring(0, 8)}...
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="divide-y">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full px-4 py-3 text-left ${
                    activeTab === tab.id 
                      ? 'bg-blue-50 text-blue-700 font-medium' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          {/* Tab Content */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">
              {tabs.find(tab => tab.id === activeTab)?.label}
            </h2>
            
            {renderTabContent()}
          </div>
          
          {/* Logs */}
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Logs</h2>
              <button
                onClick={() => setLogs([])}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md text-sm"
              >
                Clear
              </button>
            </div>
            
            <div className="bg-gray-100 rounded-md p-3 h-64 overflow-y-auto font-mono text-sm">
              {logs.length === 0 ? (
                <p className="text-gray-500 italic">No logs yet</p>
              ) : (
                logs.map(log => (
                  <div key={log.id} className="mb-1">
                    <span className="text-gray-500 text-xs">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    {' - '}
                    <span>{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}