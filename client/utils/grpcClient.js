'use client';

import { PaperProtoServerClient } from '../proto/service_grpc_web_pb';
import { 
  LaunchGameRoomRequest,
  JoinGameRoomRequest,
  GetPlayersRequest,
  SubscribeToGameUpdatesRequest,
  SendGameUpdateRequest,
  GameEndRequest,
  HeartbeatRequest
} from '../proto/service_pb';

// Create the client from the server URL in the .env file
// This will create a client utilizing web-grpc, which can communicate with our server to send grpc calls.
const client = new PaperProtoServerClient(process.env.NEXT_PUBLIC_SERVER_URL);

/**
 * Launch Game Room: Send a request to the server to start a new game room.
 * @param {string} gameSessionID - The UUID of the new game
 * @param {string} hostID - The UUID of the user creating the game
 * @param {string} hostUsername - The username of the user creating the game
 */
export const launchGameRoom = (gameSessionID, hostID, hostUsername) => {
  return new Promise((resolve, reject) => {
    const request = new LaunchGameRoomRequest();

    try {
      request.setGamesessionid(gameSessionID);
      request.setHostid(hostID);
      request.setHostusername(hostUsername);
    } catch (e) {
      console.error('Setting properties failed:', e);
      // Fall back to direct property assignment
      request.gameSessionID = gameSessionID;
      request.hostID = hostID;
      request.hostUsername = hostUsername;
    }

    client.launchGameRoom(request, {}, (err, response) => {
      if (err) {
        console.error('gRPC call failed:', err);
        reject(err);
        return;
      }
      
      console.log('Response received:', response);
      resolve({
        status: response.getStatus(),
        message: response.getMessage()
      });
    });
  });
};

/**
 * Join Game Room: Send a request to join an existing game
 * @param {string} gameSessionID - The UUID of the game to join
 * @param {string} userID - The UUID of the user joining the game
 * @param {string} username - The username of the user joining the game
 */
export const joinGameRoom = (gameSessionID, userID, username) => {
  return new Promise((resolve, reject) => {
    const request = new JoinGameRoomRequest();
    
    try {
      request.setGamesessionid(gameSessionID);
      request.setUserid(userID);
      request.setUsername(username);

    } catch (e) {
      console.error('Setting join properties failed:', e);
      // Fall back to direct property assignment
      request.gameSessionID = gameSessionID;
      request.userID = userID;
      request.username = username;
    }
    
    client.joinGameRoom(request, {}, (err, response) => {
      if (err) {
        console.error('Join gRPC call failed:', err);
        reject(err);
        return;
      }

      console.log("joinGameRoom response:", response)
      
      resolve({
        status: response.getStatus(),
        message: response.getMessage()
      });
    });
  });
};

/**
 * Get Players: Returns a stream of players joining the game room, 
 * specifically player IDs and usernames.
 * @param {string} gameSessionID - The UUID of the game to monitor
 * @param {string} userID - The UUID of the user requesting to be updated on players who join.
 */
export const getPlayers = (gameSessionID, userID) => {
  // Add validation
  if (!gameSessionID) {
    console.error('getPlayers called with empty gameSessionID');
    throw new Error('Game session ID cannot be empty');
  }

  if (!userID) {
    console.error('getPlayers called with empty userID');
    throw new Error('User ID cannot be empty');
  }

  const request = new GetPlayersRequest();

  try {
    request.setGamesessionid(gameSessionID);
    request.setUserid(userID);
    
    // Debug log
    console.log('getPlayers request:', {
      sessionID: request.getGamesessionid(),
      userID: request.getUserid()
    });
  } catch (e) {
    console.error('Setting getPlayers properties failed:', e);
    throw e;
  }

  console.log('Creating gRPC stream for players');
  return client.getPlayers(request, {});
};

/**
 * Subscribe to Game Updates: Get updates on game state through a stream of game updates.
 * @param {string} gameSessionID - The UUID of the game to monitor
 * @param {string} userID - The UUID of the user requesting to be updated on game state changes
 * Contains a call back for when the stream updates.
 */
export const subscribeToGameUpdates = (gameSessionID, userID, onGameUpdate) => {
  console.log("PROTO CALL - subscribing to game updates:", gameSessionID,  userID)
  const request = new SubscribeToGameUpdatesRequest();
  
  try {
    request.setGamesessionid(gameSessionID);
    request.setUserid(userID);
    console.log("you are sending this request:", request)

    // Debug log
    console.log('subscribeToGameUpdates request:', {
        gameSessionID: gameSessionID,
        userID: userID
      });
      
  } catch (e) {
    console.error('Setting subscribeToGameUpdates properties failed:', e);
    // Fall back to direct property assignment
    request.gameSessionID = gameSessionID;
    request.userID = userID;
  }

  const stream = client.subscribeToGameUpdates(request, {});
  
  stream.on('data', (response) => {
    console.log("🚀 Game update to send to other player received:", response);
    onGameUpdate({
      fromPlayerID: response.getFromplayerid(),
      gameState: response.getGamestate()
    });
  });
  
  stream.on('error', (err) => {
    console.error('Game updates stream error:', err);
  });
  
  stream.on('end', () => {
    console.log('Game updates stream ended');
  });
  
  // Return the stream so caller can cancel if needed
  return stream;
};

/**
 * Send Game Update: When a game is updated, send a notification to the server of the update.
 * @param {string} fromPlayerID - The UUID of the player making the update
 * @param {string} gameState - A string formatted by the game itself to communicate an update
 * @param {string} gameSessionID - The UUID of the game being updated
 */
export const sendGameUpdate = (fromPlayerID, gameState, gameSessionID) => {
  return new Promise((resolve, reject) => {
    const request = new SendGameUpdateRequest();
    
    try {
      request.setFromplayerid(fromPlayerID);
      request.setGamestate(gameState);
      request.setGamesessionid(gameSessionID);
    } catch (e) {
      console.error('Setting sendGameUpdate properties failed:', e);
      // Fall back to direct property assignment
      request.fromPlayerID = fromPlayerID;
      request.gameState = gameState;
      request.gameSessionID = gameSessionID;
    }
    
    client.sendGameUpdate(request, {}, (err, response) => {
      if (err) {
        console.error('Send game update gRPC call failed:', err);
        reject(err);
        return;
      }
      
      resolve({
        status: response.getStatus(),
        message: response.getMessage()
      });
    });
  });
};

/**
 * Game End: Communicate to the server that the game has concluded.
 * @param {string} gameSessionID - The UUID of the game being updated
 * @param {string} endState - A string formatted by the game itself to communicate its end state
 */
export const gameEnd = (gameSessionID, endState) => {
  return new Promise((resolve, reject) => {
    const request = new GameEndRequest();
    
    try {
      request.setGamesessionid(gameSessionID);
      request.setEndstate(endState);
    } catch (e) {
      console.error('Setting gameEnd properties failed:', e);
      // Fall back to direct property assignment
      request.gameSessionID = gameSessionID;
      request.endState = endState;
    }
    
    client.gameEnd(request, {}, (err, response) => {
      if (err) {
        console.error('Game end gRPC call failed:', err);
        reject(err);
        return;
      }
      
      resolve({
        status: response.getStatus(),
        message: response.getMessage()
      });
    });
  });
};

/**
 * Heartbeat: Send a request to check on the server
 * @param {string} requestorID - The UUID of the client requesting the check on server
 * @param {string} serverID - The UUID of the server to check on
 */
export const heartbeat = (requestorID, serverID) => {
  return new Promise((resolve, reject) => {
    const request = new HeartbeatRequest();

    // Helpful debugging code - DO NOT DELETE.
    // console.log('Available methods on request:', Object.getOwnPropertyNames(
    //   Object.getPrototypeOf(request)
    // ));
    
    try {
      request.setRequestorId(requestorID);
      request.setServerId(serverID);
    } catch (e) {
      console.error('Setting heartbeat properties failed:', e);
      // Fall back to direct property assignment
      request.requestor_id = requestorID;
      request.server_id = serverID;
    }
    
    client.heartbeat(request, {}, (err, response) => {
      if (err) {
        console.error('Heartbeat gRPC call failed:', err);
        reject(err);
        return;
      }
      
      resolve({
        responderID: response.getResponderId(),
        status: response.getStatus()
      });
    });
  });
};