// // app/utils/grpcClient.js
'use client';

import { PaperProtoServerClient } from '../proto/service_grpc_web_pb';
import { LaunchGameRoomRequest } from '../proto/service_pb';

// // Create the client (replace with your actual server URL)
// // I THINK THIS IS PROXY?
const client = new PaperProtoServerClient('http://localhost:8080');

// Debug version to find the correct setter methods
export const launchGameRoom = (gameSessionID, hostID, hostUsername) => {
    return new Promise((resolve, reject) => {
      const request = new LaunchGameRoomRequest();
      
      // Debug: Log the available methods on the request object
      console.log('Available methods on request:', Object.getOwnPropertyNames(
        Object.getPrototypeOf(request)
      ));
      
      // Try to use the methods we find from the debug output
      // For example, if you see setGameSessionId instead of setGameSessionID
      
      // Based on your proto definition, try these variations:
      try {
        // Camel case version
        request.setGameSessionId(gameSessionID);
        request.setHostId(hostID); 
        request.setHostUsername(hostUsername);
      } catch (e) {
        console.error('First attempt failed:', e);
        try {
          // All lowercase version
          request.setGamesessionid(gameSessionID);
          request.setHostid(hostID);
          request.setHostusername(hostUsername);
        } catch (e) {
          console.error('Second attempt failed:', e);
          // Fall back to direct property assignment
          request.gameSessionID = gameSessionID;
          request.hostID = hostID;
          request.hostUsername = hostUsername;
        }
      }
      
      client.launchGameRoom(request, {}, (err, response) => {
        if (err) {
          console.error('gRPC call failed:', err);
          reject(err);
          return;
        }
        
        console.log('Response received:', response);
        
        // Rest of the function remains the same
        // ...
      });
    });
  };