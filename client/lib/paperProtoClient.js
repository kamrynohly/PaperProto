import { createChannel, createClient } from 'nice-grpc-web';
import { Observable } from 'rxjs';

/**
 * PaperProto gRPC Client Utilities
 * 
 * This file contains utility functions to communicate with the PaperProto gRPC server.
 * It handles all the gRPC calls defined in the service.proto file.
 */

// Configure the gRPC server URL from environment variables or default to localhost
const GRPC_SERVER_URL = process.env.NEXT_PUBLIC_GRPC_SERVER_URL || 'http://127.0.0.1:5001';

// Create a singleton channel to reuse across requests
const channel = createChannel(GRPC_SERVER_URL);

import { PaperProtoServerClient } from './generated/ServiceServiceClientPb';


// Create the gRPC client
const client = createClient(PaperProtoServerClient, channel);

/**
 * Launch a new game room
 * @param {string} gameSessionID - Unique identifier for the game session
 * @param {string} hostID - Unique identifier for the host
 * @param {string} hostUsername - Display name for the host
 * @returns {Promise} Promise with the launch response
 */
export async function launchGameRoom(gameSessionID, hostID, hostUsername) {
  try {
    const request = {
      gameSessionID,
      hostID,
      hostUsername
    };
    
    return await client.launchGameRoom(request);
  } catch (error) {
    console.error('Error launching game room:', error);
    throw handleError(error);
  }
}

/**
 * Join an existing game room
 * @param {string} gameSessionID - Unique identifier for the game session
 * @param {string} userID - Unique identifier for the joining user
 * @param {string} username - Display name for the joining user
 * @returns {Promise} Promise with the join response
 */
export async function joinGameRoom(gameSessionID, userID, username) {
  try {
    const request = {
      gameSessionID,
      userID,
      username
    };
    
    return await client.joinGameRoom(request);
  } catch (error) {
    console.error('Error joining game room:', error);
    throw handleError(error);
  }
}

/**
 * Get a stream of players in a game room
 * @param {string} gameSessionID - Unique identifier for the game session
 * @param {string} userID - Unique identifier for the requesting user
 * @returns {Observable} Observable of player responses
 */
export function getPlayers(gameSessionID, userID) {
  try {
    const request = {
      gameSessionID,
      userID
    };
    
    // Convert the AsyncIterable to Observable
    return new Observable((subscriber) => {
      const stream = client.getPlayers(request);
      
      (async () => {
        try {
          for await (const response of stream) {
            subscriber.next(response);
          }
          subscriber.complete();
        } catch (error) {
          subscriber.error(handleError(error));
        }
      })();
      
      // Return cleanup function
      return () => {
        // Stream cleanup would go here if needed
      };
    });
  } catch (error) {
    console.error('Error getting players:', error);
    throw handleError(error);
  }
}

/**
 * Subscribe to game updates
 * @param {string} gameSessionID - Unique identifier for the game session
 * @param {string} userID - Unique identifier for the subscribing user
 * @returns {Observable} Observable of game update responses
 */
export function subscribeToGameUpdates(gameSessionID, userID) {
  try {
    const request = {
      gameSessionID,
      userID
    };
    
    // Convert the AsyncIterable to Observable
    return new Observable((subscriber) => {
      const stream = client.subscribeToGameUpdates(request);
      
      (async () => {
        try {
          for await (const response of stream) {
            subscriber.next(response);
          }
          subscriber.complete();
        } catch (error) {
          subscriber.error(handleError(error));
        }
      })();
      
      // Return cleanup function
      return () => {
        // Stream cleanup would go here if needed
      };
    });
  } catch (error) {
    console.error('Error subscribing to game updates:', error);
    throw handleError(error);
  }
}

/**
 * Send a game update
 * @param {string} fromPlayerID - Unique identifier of the player sending the update
 * @param {string} gameState - Current game state (JSON string)
 * @returns {Promise} Promise with the send update response
 */
export async function sendGameUpdate(fromPlayerID, gameState) {
  try {
    const request = {
      fromPlayerID,
      gameState
    };
    
    return await client.sendGameUpdate(request);
  } catch (error) {
    console.error('Error sending game update:', error);
    throw handleError(error);
  }
}

/**
 * End a game
 * @param {string} gameSessionID - Unique identifier for the game session
 * @param {string} endState - Final state of the game (JSON string)
 * @returns {Promise} Promise with the game end response
 */
export async function endGame(gameSessionID, endState) {
  try {
    const request = {
      gameSessionID,
      endState
    };
    
    return await client.gameEnd(request);
  } catch (error) {
    console.error('Error ending game:', error);
    throw handleError(error);
  }
}

/**
 * Send a heartbeat to check server status
 * @param {string} requestorID - Unique identifier of the requesting client
 * @param {string} serverID - Optional server identifier
 * @returns {Promise} Promise with the heartbeat response
 */
export async function heartbeat(requestorID, serverID = '') {
  try {
    const request = {
      requestor_id: requestorID,
      server_id: serverID
    };
    
    return await client.heartbeat(request);
  } catch (error) {
    console.error('Error sending heartbeat:', error);
    throw handleError(error);
  }
}

/**
 * Check if a response indicates success
 * @param {Object} response - Response from a gRPC call
 * @returns {boolean} Whether the response indicates success
 */
export function isSuccessResponse(response) {
  return response && response.status === 0; // 0 = SUCCESS in the proto enum
}

/**
 * Generate a unique session ID
 * @returns {string} A unique session ID
 */
export function generateSessionID() {
  return `game_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Generate a unique user ID
 * @returns {string} A unique user ID
 */
export function generateUserID() {
  return `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

/**
 * Helper to standardize error handling
 * @param {*} error - The caught error
 * @returns {Error} A standardized error object
 */
function handleError(error) {
  // Check if it's a gRPC ClientError
  if (error && error.code) {
    return new Error(`gRPC error (${error.code}): ${error.details || error.message}`);
  }
  return error instanceof Error ? error : new Error(String(error));
}

// Export all functions as a single object for convenience
export default {
  launchGameRoom,
  joinGameRoom,
  getPlayers,
  subscribeToGameUpdates,
  sendGameUpdate,
  endGame,
  heartbeat,
  isSuccessResponse,
  generateSessionID,
  generateUserID
};