import sys
import os
import uuid
import logging
from collections import defaultdict
# Handle our file paths properly.
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from proto import service_pb2
from proto import service_pb2_grpc
import time


# MARK: Initialize Logger
# Configure logging set-up. We want to log times & types of logs, as well as
# function names & the subsequent message.
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(funcName)s - %(message)s'
)

# Create a logger
logger = logging.getLogger(__name__)

# MARK: PaperProtoServer 
class PaperProtoServer(service_pb2_grpc.PaperProtoServerServicer):
    """
    PaperProtoServer handles multiplayer game sessions, including creating and joining
    game rooms, managing game updates between players, and ending game sessions.
    """
        
    def __init__(self, ip, port):
        # Define server information, including its unique identifier.
        self.ip = str(ip)
        self.port = str(port)
        self.server_id = str(uuid.uuid4())

        # Store active game sessions and their participants
        self.active_games = {}  # gameSessionID -> {players, gameState, etc.}
        self.update_queue = defaultdict(list)  # gameSessionID -> list of updates
        self.player_streams = {}  # userID+gameSessionID -> stream context

        logger.info(f"Game Server created with UUID: {self.server_id}")

    # MARK: Game Room Management
    def LaunchGameRoom(self, request, context):
        """
        Handles a client's RPC request to create a new game room.

        Parameters:
            request (LaunchGameRoomRequest): Contains game room details.
                - gameSessionID (str): The unique ID for this game session.
                - hostID (str): The unique ID of the host player.
                - hostUsername (str): The username of the host player.
            context (RPCContext): The RPC call context.

        Returns:
            LaunchGameRoomResponse: A response indicating the status of the room creation.
                - status (LaunchGameRoomStatus): SUCCESS or FAILURE.
                - message (str): Description of the result.
        """
        try:
            logger.info(f"Creating new game room with ID: {request.gameSessionID}, host: {request.hostUsername}")
            
            # Check if the game session ID already exists
            if request.gameSessionID in self.active_games:
                logger.warning(f"Game session ID {request.gameSessionID} already exists")
                return service_pb2.LaunchGameRoomResponse(
                    status=service_pb2.LaunchGameRoomResponse.LaunchGameRoomStatus.FAILURE,
                    message="Game session ID already exists"
                )
            
            # Create a new game session with the host as the first player
            self.active_games[request.gameSessionID] = {
                "players": {
                    request.hostID: {
                        "username": request.hostUsername,
                        "isHost": True
                    }
                },
                "gameState": "",
                "isActive": True
            }
            
            return service_pb2.LaunchGameRoomResponse(
                status=service_pb2.LaunchGameRoomResponse.LaunchGameRoomStatus.SUCCESS,
                message="Game room created successfully"
            )
            
        except Exception as e:
            logger.error(f"Failed to create game room with error: {e}")
            return service_pb2.LaunchGameRoomResponse(
                status=service_pb2.LaunchGameRoomResponse.LaunchGameRoomStatus.FAILURE,
                message=f"Error creating game room: {str(e)}"
            )

    # def JoinGameRoom(self, request, context):
    #     """
    #     Handles a client's RPC request to join an existing game room.

    #     Parameters:
    #         request (JoinGameRoomRequest): Contains join request details.
    #             - gameSessionID (str): The ID of the game session to join.
    #             - userID (str): The unique ID of the joining player.
    #             - username (str): The username of the joining player.
    #         context (RPCContext): The RPC call context.

    #     Returns:
    #         JoinGameRoomResponse: A response indicating the status of the join request.
    #             - status (JoinGameRoomStatus): SUCCESS or FAILURE.
    #             - message (str): Description of the result.
    #     """
    #     try:
    #         logger.info(f"Player {request.username} attempting to join game session {request.gameSessionID}")
            
    #         # Check if the game session exists
    #         if request.gameSessionID not in self.active_games:
    #             logger.warning(f"Game session ID {request.gameSessionID} does not exist")
    #             return service_pb2.JoinGameRoomResponse(
    #                 status=service_pb2.JoinGameRoomResponse.JoinGameRoomStatus.FAILURE,
    #                 message="Game session does not exist"
    #             )
            
    #         # Check if the game is still active
    #         if not self.active_games[request.gameSessionID]["isActive"]:
    #             logger.warning(f"Game session {request.gameSessionID} is no longer active")
    #             return service_pb2.JoinGameRoomResponse(
    #                 status=service_pb2.JoinGameRoomResponse.JoinGameRoomStatus.FAILURE,
    #                 message="Game session is no longer active"
    #             )
            
    #         # Add the player to the game session
    #         self.active_games[request.gameSessionID]["players"][request.userID] = {
    #             "username": request.username,
    #             "isHost": False
    #         }
            
    #         return service_pb2.JoinGameRoomResponse(
    #             status=service_pb2.JoinGameRoomResponse.JoinGameRoomStatus.SUCCESS,
    #             message="Successfully joined game room"
    #         )
            
    #     except Exception as e:
    #         logger.error(f"Failed to join game room with error: {e}")
    #         return service_pb2.JoinGameRoomResponse(
    #             status=service_pb2.JoinGameRoomResponse.JoinGameRoomStatus.FAILURE,
    #             message=f"Error joining game room: {str(e)}"
    #         )


    def JoinGameRoom(self, request, context):
        try:
            logger.info(f"Player {request.username} attempting to join game session {request.gameSessionID}")
            
            # Check if the game session exists
            if request.gameSessionID not in self.active_games:
                logger.warning(f"Game session ID {request.gameSessionID} does not exist")
                return service_pb2.JoinGameRoomResponse(
                    status=service_pb2.JoinGameRoomResponse.JoinGameRoomStatus.FAILURE,
                    message="Game session does not exist"
                )
            
            # Log the current players before adding the new one
            logger.info(f"Current players before join: {self.active_games[request.gameSessionID]['players']}")
            
            # Add the player to the game session
            self.active_games[request.gameSessionID]["players"][request.userID] = {
                "username": request.username,
                "isHost": False
            }
            
            # Log the players after adding the new one
            logger.info(f"Players after join: {self.active_games[request.gameSessionID]['players']}")
            
            return service_pb2.JoinGameRoomResponse(
                status=service_pb2.JoinGameRoomResponse.JoinGameRoomStatus.SUCCESS,
                message="Successfully joined game room"
            )
            
        except Exception as e:
            logger.error(f"Failed to join game room with error: {e}")
            return service_pb2.JoinGameRoomResponse(
                status=service_pb2.JoinGameRoomResponse.JoinGameRoomStatus.FAILURE,
                message=f"Error joining game room: {str(e)}"
            )

    def SubscribeToGameUpdates(self, request, context):
        """
        Handles a client's RPC request to subscribe to game updates.
        
        Parameters:
            request (SubscribeToGameUpdatesRequest): Contains subscription details.
                - gameSessionID (str): The ID of the game session.
                - userID (str): The unique ID of the subscribing player.
            context (RPCContext): The RPC call context.

        Yields (stream):
            SubscribeToGameUpdatesResponse: Updates from the game.
                - fromPlayerID (str): ID of the player who sent the update.
                - gameState (str): The current state of the game.
        """
        try:
            logger.info(f"REQUEST:  {request}")
            logger.info(f"Player {request.userID} subscribing to updates for game session {request.gameSessionID}")
            
            # Check if the game session exists
            if request.gameSessionID not in self.active_games:
                logger.warning(f"Game session ID {request.gameSessionID} does not exist")
                return
            
            # Create a unique key for this player's stream
            stream_key = f"{request.userID}_{request.gameSessionID}"
            
            # Store the stream context
            self.player_streams[stream_key] = context
            
            # Process any pending updates for this game
            while True:
                # If we have updates ready to send, yield them to the stream
                if len(self.update_queue[request.gameSessionID]) > 0 and context.is_active():
                    update = self.update_queue[request.gameSessionID].pop(0)
                    logger.info(f"Sending game update to player {request.userID} in session {request.gameSessionID}")
                    yield service_pb2.SubscribeToGameUpdatesResponse(
                        fromPlayerID=update["fromPlayerID"],
                        gameState=update["gameState"]
                    )
                
        except Exception as e:
            logger.error(f"Error in game update subscription: {e}")
        
        finally:
            # When the player's stream closes, clean up
            stream_key = f"{request.userID}_{request.gameSessionID}"
            if stream_key in self.player_streams:
                logger.info(f"Player {request.userID} disconnected from game session {request.gameSessionID}")
                self.player_streams.pop(stream_key)

    def SendGameUpdate(self, request, context):
        """
        Handles a client's RPC request to send a game update.

        Parameters:
            request (SendGameUpdateRequest): Contains update details.
                - fromPlayerID (str): ID of the player sending the update.
                - gameState (str): The new state of the game.
            context (RPCContext): The RPC call context.

        Returns:
            SendGameUpdateResponse: A response indicating the status of the update.
                - status (SendGameUpdateStatus): SUCCESS or FAILURE.
                - message (str): Description of the result.
        """
        try:
            logger.info(f"Received game update from player {request.fromPlayerID}")
            
            # Find which game session this player belongs to
            player_game_session = None
            for game_id, game_data in self.active_games.items():
                if request.fromPlayerID in game_data["players"]:
                    player_game_session = game_id
                    break
            
            if player_game_session is None:
                logger.warning(f"Player {request.fromPlayerID} is not in any active game session")
                return service_pb2.SendGameUpdateResponse(
                    status=service_pb2.SendGameUpdateResponse.SendGameUpdateStatus.FAILURE,
                    message="Player is not in any active game session"
                )
            
            # Update the game state
            self.active_games[player_game_session]["gameState"] = request.gameState
            
            # Queue the update for all players in this game
            update = {
                "fromPlayerID": request.fromPlayerID,
                "gameState": request.gameState
            }
            self.update_queue[player_game_session].append(update)
            
            return service_pb2.SendGameUpdateResponse(
                status=service_pb2.SendGameUpdateResponse.SendGameUpdateStatus.SUCCESS,
                message="Game update sent successfully"
            )
            
        except Exception as e:
            logger.error(f"Failed to send game update with error: {e}")
            return service_pb2.SendGameUpdateResponse(
                status=service_pb2.SendGameUpdateResponse.SendGameUpdateStatus.FAILURE,
                message=f"Error sending game update: {str(e)}"
            )

    def GameEnd(self, request, context):
        """
        Handles a client's RPC request to end a game session.

        Parameters:
            request (GameEndRequest): Contains game end details.
                - gameSessionID (str): The ID of the game session to end.
                - endState (str): The final state of the game.
            context (RPCContext): The RPC call context.

        Returns:
            GameEndResponse: A response indicating the status of the game end request.
                - status (GameEndStatus): SUCCESS or FAILURE.
                - message (str): Description of the result.
        """
        try:
            logger.info(f"Ending game session {request.gameSessionID}")
            
            # Check if the game session exists
            if request.gameSessionID not in self.active_games:
                logger.warning(f"Game session ID {request.gameSessionID} does not exist")
                return service_pb2.GameEndResponse(
                    status=service_pb2.GameEndResponse.GameEndStatus.FAILURE,
                    message="Game session does not exist"
                )
            
            # Mark the game as inactive and store the final state
            self.active_games[request.gameSessionID]["isActive"] = False
            self.active_games[request.gameSessionID]["gameState"] = request.endState
            
            # Send a final update to all subscribed players
            final_update = {
                "fromPlayerID": "SERVER",
                "gameState": request.endState
            }
            self.update_queue[request.gameSessionID].append(final_update)
            
            # Schedule cleanup of this game session (could be done after a delay)
            # For now, we'll keep it in memory for history purposes
            
            return service_pb2.GameEndResponse(
                status=service_pb2.GameEndResponse.GameEndStatus.SUCCESS,
                message="Game ended successfully"
            )
            
        except Exception as e:
            logger.error(f"Failed to end game with error: {e}")
            return service_pb2.GameEndResponse(
                status=service_pb2.GameEndResponse.GameEndStatus.FAILURE,
                message=f"Error ending game: {str(e)}"
            )

    def GetPlayers(self, request, context):
        """
        Handles a client's RPC request to get and monitor players in a game session.
        This is a streaming RPC that will stay open and send updates for new players.
        """
        try:
            logger.info(f"Starting player monitoring for session {request.gameSessionID}, requested by {request.userID}")
            
            # Check if the game session exists
            if request.gameSessionID not in self.active_games:
                logger.warning(f"Game session ID {request.gameSessionID} does not exist")
                return
            
            # Create a unique key for this stream
            stream_key = f"players_{request.userID}_{request.gameSessionID}"
            self.player_streams[stream_key] = context
            
            # Send all current players initially
            game_data = self.active_games[request.gameSessionID]
            known_players = set()
            
            for player_id, player_data in game_data["players"].items():
                known_players.add(player_id)
                logger.info(f"Sending initial player info: {player_data['username']} ({player_id})")
                
                # Determine if this player is the creator/host
                # is_creator = player_data.get('isHost', False)
                
                yield service_pb2.GetPlayersResponse(
                    username=player_data['username'],
                    userID=player_id,
                    # isCreator=is_creator
                )
            
            # Keep the stream open and monitor for new players
            while context.is_active():
                # Check for new players every second
                time.sleep(1)
                
                # If game no longer exists, end the stream
                if request.gameSessionID not in self.active_games:
                    logger.info(f"Game session {request.gameSessionID} no longer exists, ending player stream")
                    break
                    
                # Check for new players
                current_players = set(self.active_games[request.gameSessionID]["players"].keys())
                new_players = current_players - known_players
                
                # Send info for any new players
                for player_id in new_players:
                    player_data = self.active_games[request.gameSessionID]["players"][player_id]
                    known_players.add(player_id)
                    logger.info(f"Sending new player info: {player_data['username']} ({player_id})")
                    
                    # Determine if this player is the creator/host
                    is_creator = player_data.get('isHost', False)
                    
                    yield service_pb2.GetPlayersResponse(
                        username=player_data['username'],
                        userID=player_id,
                        isCreator=is_creator
                    )
        
        except Exception as e:
            logger.error(f"Error in player monitoring stream: {e}")
        
        finally:
            # Clean up when stream ends
            stream_key = f"players_{request.userID}_{request.gameSessionID}"
            if stream_key in self.player_streams:
                logger.info(f"Player monitoring stream ended for user {request.userID} in session {request.gameSessionID}")
                self.player_streams.pop(stream_key)
            
        
    # MARK: Simple Heartbeat
    def Heartbeat(self, request, context):
        """
        Handles heartbeat RPC requests to check server status.

        Parameters:
            request (HeartbeatRequest): Contains the request details.
                - requestor_id (str): The id of the client/entity sending the heartbeat.
                - server_id (str): The id of the intended recipient of the heartbeat.
            context (RPCContext): The RPC call context.

        Returns:
            HeartbeatResponse: The response to the heartbeat request.
                - responder_id (str): The id of the server responding.
                - status (str): Description of the state.
        """
        try:
            logger.info(f"Received heartbeat from {request.requestor_id}")
            return service_pb2.HeartbeatResponse(
                responder_id=self.server_id,
                status="Heartbeat received"
            )
            
        except Exception as e:
            logger.error(f"Error occurred in Heartbeat request: {e}")
            return service_pb2.HeartbeatResponse(
                responder_id=self.server_id,
                status=f"Error: {str(e)}"
            )