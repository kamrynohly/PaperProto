import unittest
import os
import sys
import uuid
import time
import grpc
from unittest.mock import MagicMock, patch
from concurrent import futures

# Add the parent directory to the path so Python can find your modules
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, parent_dir)

# Import the server implementation directly from the current directory
from PaperProtoServer import PaperProtoServer

# Now import the proto modules from the proto directory at the project root level
sys.path.insert(0, os.path.join(parent_dir, "proto"))
from proto.service_pb2 import *
from proto.service_pb2_grpc import *

class TestPaperProtoServer(unittest.TestCase):
    """Test cases for the PaperProtoServer class."""

    def setUp(self):
        """Set up test environment before each test case."""
        self.server = PaperProtoServer("localhost", 50051)
        self.mock_context = MagicMock()
        self.mock_context.is_active.return_value = True

    def tearDown(self):
        """Clean up after each test case."""
        # Reset active games and player streams
        self.server.active_games = {}
        self.server.player_streams = {}
        self.server.update_queue.clear()

    # Test LaunchGameRoom functionality
    def test_launch_game_room_success(self):
        """Test creating a new game room successfully."""
        game_session_id = str(uuid.uuid4())
        host_id = str(uuid.uuid4())
        host_username = "TestHost"

        request = service_pb2.LaunchGameRoomRequest(
            gameSessionID=game_session_id,
            hostID=host_id,
            hostUsername=host_username
        )

        response = self.server.LaunchGameRoom(request, self.mock_context)

        # Verify response
        self.assertEqual(
            response.status,
            service_pb2.LaunchGameRoomResponse.LaunchGameRoomStatus.SUCCESS
        )
        self.assertEqual(response.message, "Game room created successfully")

        # Verify game was created in server state
        self.assertIn(game_session_id, self.server.active_games)
        self.assertIn(host_id, self.server.active_games[game_session_id]["players"])
        self.assertEqual(
            self.server.active_games[game_session_id]["players"][host_id]["username"],
            host_username
        )
        self.assertTrue(self.server.active_games[game_session_id]["players"][host_id]["isHost"])

    def test_launch_game_room_duplicate(self):
        """Test attempting to create a game room with an existing ID."""
        # First create a game room
        game_session_id = str(uuid.uuid4())
        host_id = str(uuid.uuid4())
        host_username = "TestHost"

        self.server.active_games[game_session_id] = {
            "players": {
                host_id: {
                    "username": host_username,
                    "isHost": True
                }
            },
            "gameState": "",
            "isActive": True
        }

        # Try to create another with the same ID
        request = service_pb2.LaunchGameRoomRequest(
            gameSessionID=game_session_id,
            hostID=str(uuid.uuid4()),  # Different host
            hostUsername="AnotherHost"
        )

        response = self.server.LaunchGameRoom(request, self.mock_context)

        # Verify response indicates failure
        self.assertEqual(
            response.status,
            service_pb2.LaunchGameRoomResponse.LaunchGameRoomStatus.FAILURE
        )
        self.assertEqual(response.message, "Game session ID already exists")

    @patch('logging.Logger.error')
    def test_launch_game_room_exception(self, mock_error):
        """Test error handling in LaunchGameRoom."""
        # Create a request that will cause an exception
        request = MagicMock()
        request.gameSessionID = None  # This will cause a KeyError when accessed
        
        # Set up a side effect on request to raise an exception
        type(request).gameSessionID = property(side_effect=Exception("Test exception"))

        response = self.server.LaunchGameRoom(request, self.mock_context)

        # Verify response indicates failure
        self.assertEqual(
            response.status,
            service_pb2.LaunchGameRoomResponse.LaunchGameRoomStatus.FAILURE
        )
        self.assertTrue("Error creating game room" in response.message)
        mock_error.assert_called()

    # Test JoinGameRoom functionality
    def test_join_game_room_success(self):
        """Test joining an existing game room successfully."""
        # First create a game room
        game_session_id = str(uuid.uuid4())
        host_id = str(uuid.uuid4())
        player_id = str(uuid.uuid4())
        player_username = "TestPlayer"

        self.server.active_games[game_session_id] = {
            "players": {
                host_id: {
                    "username": "TestHost",
                    "isHost": True
                }
            },
            "gameState": "",
            "isActive": True
        }

        # Player joins the game
        request = service_pb2.JoinGameRoomRequest(
            gameSessionID=game_session_id,
            userID=player_id,
            username=player_username
        )

        response = self.server.JoinGameRoom(request, self.mock_context)

        # Verify response
        self.assertEqual(
            response.status,
            service_pb2.JoinGameRoomResponse.JoinGameRoomStatus.SUCCESS
        )
        self.assertEqual(response.message, "Successfully joined game room")

        # Verify player was added to the game
        self.assertIn(player_id, self.server.active_games[game_session_id]["players"])
        self.assertEqual(
            self.server.active_games[game_session_id]["players"][player_id]["username"],
            player_username
        )
        self.assertFalse(self.server.active_games[game_session_id]["players"][player_id]["isHost"])

    def test_join_nonexistent_game_room(self):
        """Test joining a game room that doesn't exist."""
        request = service_pb2.JoinGameRoomRequest(
            gameSessionID="nonexistent_game",
            userID=str(uuid.uuid4()),
            username="TestPlayer"
        )

        response = self.server.JoinGameRoom(request, self.mock_context)

        # Verify response indicates failure
        self.assertEqual(
            response.status,
            service_pb2.JoinGameRoomResponse.JoinGameRoomStatus.FAILURE
        )
        self.assertEqual(response.message, "Game session does not exist")

    @patch('logging.Logger.error')
    def test_join_game_room_exception(self, mock_error):
        """Test error handling in JoinGameRoom."""
        # Create a request that will cause an exception
        request = MagicMock()
        # Set up a side effect on request to raise an exception
        type(request).gameSessionID = property(side_effect=Exception("Test exception"))

        response = self.server.JoinGameRoom(request, self.mock_context)

        # Verify response indicates failure
        self.assertEqual(
            response.status,
            service_pb2.JoinGameRoomResponse.JoinGameRoomStatus.FAILURE
        )
        self.assertTrue("Error joining game room" in response.message)
        mock_error.assert_called()

    # Test GetPlayers functionality
    def test_get_players_existing_players(self):
        """Test getting existing players in a game room."""
        # Create a game with multiple players
        game_session_id = str(uuid.uuid4())
        host_id = str(uuid.uuid4())
        player1_id = str(uuid.uuid4())
        player2_id = str(uuid.uuid4())

        self.server.active_games[game_session_id] = {
            "players": {
                host_id: {
                    "username": "TestHost",
                    "isHost": True
                },
                player1_id: {
                    "username": "Player1",
                    "isHost": False
                },
                player2_id: {
                    "username": "Player2",
                    "isHost": False
                }
            },
            "gameState": "",
            "isActive": True
        }

        # Request to get players
        request = service_pb2.GetPlayersRequest(
            gameSessionID=game_session_id,
            userID=str(uuid.uuid4())  # A different user requests the player list
        )

        # Use a mock context that will terminate the stream after receiving players
        mock_stream_context = MagicMock()
        # Return true once, then false to end the stream
        mock_stream_context.is_active.side_effect = [True, False]

        # Collect all yielded responses
        responses = list(self.server.GetPlayers(request, mock_stream_context))

        # Verify all players were returned
        self.assertEqual(len(responses), 3)
        
        # Verify each player's details
        player_ids = [host_id, player1_id, player2_id]
        usernames = ["TestHost", "Player1", "Player2"]
        
        for response in responses:
            self.assertIn(response.userID, player_ids)
            index = player_ids.index(response.userID)
            self.assertEqual(response.username, usernames[index])
            
            # If it's the host, verify isCreator is true
            if response.userID == host_id:
                self.assertTrue(response.isCreator)

    def test_get_players_nonexistent_game(self):
        """Test getting players for a game that doesn't exist."""
        request = service_pb2.GetPlayersRequest(
            gameSessionID="nonexistent_game",
            userID=str(uuid.uuid4())
        )

        # Collect all yielded responses (should be empty)
        responses = list(self.server.GetPlayers(request, self.mock_context))
        self.assertEqual(len(responses), 0)

    @patch('logging.Logger.error')
    def test_get_players_exception(self, mock_error):
        """Test error handling in GetPlayers."""
        # Create a request that will cause an exception
        request = MagicMock()
        # Set up a side effect on request to raise an exception
        type(request).gameSessionID = property(side_effect=Exception("Test exception"))

        # Collect all yielded responses (should be empty due to exception)
        responses = list(self.server.GetPlayers(request, self.mock_context))
        self.assertEqual(len(responses), 0)
        mock_error.assert_called()

    # Test SubscribeToGameUpdates functionality
    def test_subscribe_to_game_updates(self):
        """Test subscribing to game updates."""
        # Create a game session
        game_session_id = str(uuid.uuid4())
        player_id = str(uuid.uuid4())

        self.server.active_games[game_session_id] = {
            "players": {
                player_id: {
                    "username": "TestPlayer",
                    "isHost": True
                }
            },
            "gameState": "",
            "isActive": True
        }

        # Set up a queue with updates for the player
        queue_key = f"updates_{player_id}_{game_session_id}"
        self.server.update_queue[queue_key] = [
            {"fromPlayerID": "otherPlayer", "gameState": "update1"},
            {"fromPlayerID": "anotherPlayer", "gameState": "update2"}
        ]

        # Request to subscribe to game updates
        request = service_pb2.SubscribeToGameUpdatesRequest(
            gameSessionID=game_session_id,
            userID=player_id
        )

        # Use a mock context that will terminate after processing updates
        mock_stream_context = MagicMock()
        # Return true twice for the updates, then false to end the stream
        mock_stream_context.is_active.side_effect = [True, True, False]

        # Collect all yielded responses
        responses = list(self.server.SubscribeToGameUpdates(request, mock_stream_context))

        # Verify updates were received
        self.assertEqual(len(responses), 2)
        self.assertEqual(responses[0].fromPlayerID, "otherPlayer")
        self.assertEqual(responses[0].gameState, "update1")
        self.assertEqual(responses[1].fromPlayerID, "anotherPlayer")
        self.assertEqual(responses[1].gameState, "update2")

        # Verify the stream was registered and then removed
        stream_key = f"{player_id}_{game_session_id}"
        self.assertNotIn(stream_key, self.server.player_streams)

    def test_subscribe_nonexistent_game(self):
        """Test subscribing to updates for a game that doesn't exist."""
        request = service_pb2.SubscribeToGameUpdatesRequest(
            gameSessionID="nonexistent_game",
            userID=str(uuid.uuid4())
        )

        # Collect all yielded responses (should be empty)
        responses = list(self.server.SubscribeToGameUpdates(request, self.mock_context))
        self.assertEqual(len(responses), 0)

    @patch('logging.Logger.error')
    def test_subscribe_exception(self, mock_error):
        """Test error handling in SubscribeToGameUpdates."""
        # Create a request that will cause an exception
        request = MagicMock()
        # Set up a side effect on request to raise an exception
        type(request).gameSessionID = property(side_effect=Exception("Test exception"))

        # Collect all yielded responses (should be empty due to exception)
        responses = list(self.server.SubscribeToGameUpdates(request, self.mock_context))
        self.assertEqual(len(responses), 0)
        mock_error.assert_called()

    # Test SendGameUpdate functionality
    def test_send_game_update_success(self):
        """Test sending a game update successfully."""
        # Create a game with multiple players
        game_session_id = str(uuid.uuid4())
        host_id = str(uuid.uuid4())
        player_id = str(uuid.uuid4())

        self.server.active_games[game_session_id] = {
            "players": {
                host_id: {
                    "username": "TestHost",
                    "isHost": True
                },
                player_id: {
                    "username": "TestPlayer",
                    "isHost": False
                }
            },
            "gameState": "",
            "isActive": True
        }

        # Send a game update from the host
        request = service_pb2.SendGameUpdateRequest(
            fromPlayerID=host_id,
            gameState="Test game state",
            gameSessionID=game_session_id
        )

        response = self.server.SendGameUpdate(request, self.mock_context)

        # Verify response
        self.assertEqual(
            response.status,
            service_pb2.SendGameUpdateResponse.SendGameUpdateStatus.SUCCESS
        )
        self.assertEqual(response.message, "Game update sent successfully")

        # Verify the game state was updated
        self.assertEqual(self.server.active_games[game_session_id]["gameState"], "Test game state")

        # Verify the update was queued for the other player
        player_queue_key = f"updates_{player_id}_{game_session_id}"
        self.assertIn(player_queue_key, self.server.update_queue)
        self.assertEqual(len(self.server.update_queue[player_queue_key]), 1)
        self.assertEqual(self.server.update_queue[player_queue_key][0]["fromPlayerID"], host_id)
        self.assertEqual(self.server.update_queue[player_queue_key][0]["gameState"], "Test game state")

    def test_send_game_update_invalid_session(self):
        """Test sending an update with an invalid game session ID."""
        request = service_pb2.SendGameUpdateRequest(
            fromPlayerID=str(uuid.uuid4()),
            gameState="Test game state",
            gameSessionID=None
        )

        response = self.server.SendGameUpdate(request, self.mock_context)

        # Verify response indicates failure
        self.assertEqual(
            response.status,
            service_pb2.SendGameUpdateResponse.SendGameUpdateStatus.FAILURE
        )
        self.assertEqual(response.message, "Game session ID is invalid")

    @patch('logging.Logger.error')
    def test_send_game_update_exception(self, mock_error):
        """Test error handling in SendGameUpdate."""
        # Create a request that will cause an exception
        request = MagicMock()
        # Set up a side effect on request to raise an exception
        type(request).fromPlayerID = property(side_effect=Exception("Test exception"))

        response = self.server.SendGameUpdate(request, self.mock_context)

        # Verify response indicates failure
        self.assertEqual(
            response.status,
            service_pb2.SendGameUpdateResponse.SendGameUpdateStatus.FAILURE
        )
        self.assertTrue("Error sending game update" in response.message)
        mock_error.assert_called()

    # Test GameEnd functionality
    def test_game_end_success(self):
        """Test ending a game successfully."""
        # Create a game session
        game_session_id = str(uuid.uuid4())
        host_id = str(uuid.uuid4())
        player_id = str(uuid.uuid4())

        self.server.active_games[game_session_id] = {
            "players": {
                host_id: {
                    "username": "TestHost",
                    "isHost": True
                },
                player_id: {
                    "username": "TestPlayer",
                    "isHost": False
                }
            },
            "gameState": "InProgress",
            "isActive": True
        }

        # End the game
        end_state = '{"winner": "' + host_id + '", "finalScore": 100}'
        request = service_pb2.GameEndRequest(
            gameSessionID=game_session_id,
            endState=end_state
        )

        response = self.server.GameEnd(request, self.mock_context)

        # Verify response
        self.assertEqual(
            response.status,
            service_pb2.GameEndResponse.GameEndStatus.SUCCESS
        )
        self.assertEqual(response.message, "Game ended successfully")

        # Verify game state was updated
        self.assertEqual(self.server.active_games[game_session_id]["gameState"], end_state)
        self.assertFalse(self.server.active_games[game_session_id]["isActive"])

        # Verify a final update was queued
        self.assertIn(game_session_id, self.server.update_queue)
        self.assertEqual(len(self.server.update_queue[game_session_id]), 1)
        self.assertEqual(self.server.update_queue[game_session_id][0]["fromPlayerID"], "SERVER")
        self.assertEqual(self.server.update_queue[game_session_id][0]["gameState"], end_state)

    def test_end_nonexistent_game(self):
        """Test ending a game that doesn't exist."""
        request = service_pb2.GameEndRequest(
            gameSessionID="nonexistent_game",
            endState='{"winner": "player1", "finalScore": 100}'
        )

        response = self.server.GameEnd(request, self.mock_context)

        # Verify response indicates failure
        self.assertEqual(
            response.status,
            service_pb2.GameEndResponse.GameEndStatus.FAILURE
        )
        self.assertEqual(response.message, "Game session does not exist")

    @patch('logging.Logger.error')
    def test_game_end_exception(self, mock_error):
        """Test error handling in GameEnd."""
        # Create a request that will cause an exception
        request = MagicMock()
        # Set up a side effect on request to raise an exception
        type(request).gameSessionID = property(side_effect=Exception("Test exception"))

        response = self.server.GameEnd(request, self.mock_context)

        # Verify response indicates failure
        self.assertEqual(
            response.status,
            service_pb2.GameEndResponse.GameEndStatus.FAILURE
        )
        self.assertTrue("Error ending game" in response.message)
        mock_error.assert_called()

    # Test Heartbeat functionality
    def test_heartbeat_success(self):
        """Test heartbeat functionality."""
        request = service_pb2.HeartbeatRequest(
            requestor_id=str(uuid.uuid4()),
            server_id=self.server.server_id
        )

        response = self.server.Heartbeat(request, self.mock_context)

        # Verify response
        self.assertEqual(response.responder_id, self.server.server_id)
        self.assertEqual(response.status, "Heartbeat received")

    @patch('logging.Logger.error')
    def test_heartbeat_exception(self, mock_error):
        """Test error handling in Heartbeat."""
        # Create a request that will cause an exception
        request = MagicMock()
        # Set up a side effect on request to raise an exception
        type(request).requestor_id = property(side_effect=Exception("Test exception"))

        response = self.server.Heartbeat(request, self.mock_context)

        # Verify response includes error message
        self.assertEqual(response.responder_id, self.server.server_id)
        self.assertTrue("Error" in response.status)
        mock_error.assert_called()

    # Integration test for player flow
    def test_integration_game_flow(self):
        """Integration test for a typical game flow with multiple players."""
        # 1. Host creates a game
        game_session_id = str(uuid.uuid4())
        host_id = str(uuid.uuid4())
        host_username = "TestHost"

        launch_request = service_pb2.LaunchGameRoomRequest(
            gameSessionID=game_session_id,
            hostID=host_id,
            hostUsername=host_username
        )

        launch_response = self.server.LaunchGameRoom(launch_request, self.mock_context)
        self.assertEqual(
            launch_response.status,
            service_pb2.LaunchGameRoomResponse.LaunchGameRoomStatus.SUCCESS
        )

        # 2. Player joins the game
        player_id = str(uuid.uuid4())
        player_username = "TestPlayer"

        join_request = service_pb2.JoinGameRoomRequest(
            gameSessionID=game_session_id,
            userID=player_id,
            username=player_username
        )

        join_response = self.server.JoinGameRoom(join_request, self.mock_context)
        self.assertEqual(
            join_response.status,
            service_pb2.JoinGameRoomResponse.JoinGameRoomStatus.SUCCESS
        )

        # 3. Host sends a game update
        game_state = '{"move": {"player": "host", "action": "start"}}'
        update_request = service_pb2.SendGameUpdateRequest(
            fromPlayerID=host_id,
            gameState=game_state,
            gameSessionID=game_session_id
        )

        update_response = self.server.SendGameUpdate(update_request, self.mock_context)
        self.assertEqual(
            update_response.status,
            service_pb2.SendGameUpdateResponse.SendGameUpdateStatus.SUCCESS
        )

        # Verify the update was queued for the player
        player_queue_key = f"updates_{player_id}_{game_session_id}"
        self.assertIn(player_queue_key, self.server.update_queue)
        self.assertEqual(len(self.server.update_queue[player_queue_key]), 1)
        
        # 4. Player sends a game update
        player_game_state = '{"move": {"player": "player", "action": "response"}}'
        player_update_request = service_pb2.SendGameUpdateRequest(
            fromPlayerID=player_id,
            gameState=player_game_state,
            gameSessionID=game_session_id
        )

        player_update_response = self.server.SendGameUpdate(player_update_request, self.mock_context)
        self.assertEqual(
            player_update_response.status,
            service_pb2.SendGameUpdateResponse.SendGameUpdateStatus.SUCCESS
        )

        # Verify the update was queued for the host
        host_queue_key = f"updates_{host_id}_{game_session_id}"
        self.assertIn(host_queue_key, self.server.update_queue)
        self.assertEqual(len(self.server.update_queue[host_queue_key]), 1)

        # 5. End the game
        end_state = '{"winner": "' + host_id + '", "finalScore": 100}'
        end_request = service_pb2.GameEndRequest(
            gameSessionID=game_session_id,
            endState=end_state
        )

        end_response = self.server.GameEnd(end_request, self.mock_context)
        self.assertEqual(
            end_response.status,
            service_pb2.GameEndResponse.GameEndStatus.SUCCESS
        )

        # Verify game is marked as inactive
        self.assertFalse(self.server.active_games[game_session_id]["isActive"])


if __name__ == '__main__':
    unittest.main()