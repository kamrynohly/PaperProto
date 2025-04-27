#!/usr/bin/env python3
import os
import json
import uuid
import time
import threading
import grpc
from concurrent import futures

# Import generated gRPC modules
from proto import service_pb2 as game_pb2
from proto import service_pb2_grpc as game_pb2_grpc


class TicTacToeClient:
    def __init__(self):
        # Game state
        self.board = [None] * 9
        self.current_player = 'X'
        self.game_session_id = ''
        self.player_id = str(uuid.uuid4())
        self.player_username = ''
        self.is_host = False
        self.other_player_id = ''
        self.other_player_username = None
        self.is_game_over = False
        self.is_my_turn = False
        
        # Debug flag
        self.debug = True
        
        # Connect to gRPC server
        self.channel = grpc.insecure_channel('127.0.0.1:5001')  # Update with your server address
        self.stub = game_pb2_grpc.PaperProtoServerStub(self.channel)
        
        # Threads for subscriptions
        self.game_updates_thread = None
        self.players_thread = None
        self.heartbeat_thread = None
    
    def display_board(self):
        """Display the current state of the Tic-Tac-Toe board."""
        # os.system('cls' if os.name == 'nt' else 'clear')
        print("\n Tic-Tac-Toe\n")
        
        # Print game session ID for debugging
        if self.debug:
            print(f"Game Session ID: {self.game_session_id}")
            print(f"Player ID: {self.player_id}")
            print(f"Current player symbol: {self.current_player}")
            print(f"Is my turn: {self.is_my_turn}")
        
        for i in range(3):
            row = " "
            for j in range(3):
                index = i * 3 + j
                cell = self.board[index] if self.board[index] else str(index + 1)
                row += f" {cell} "
                if j < 2:
                    row += "|"
            print(row)
            if i < 2:
                print(" -----------")
        
        my_symbol = 'X' if self.is_host else 'O'
        opponent_symbol = 'O' if self.is_host else 'X'
        
        print(f"\nYou are playing as: {my_symbol}")
        
        if self.other_player_username:
            print("HEYYYY")
            print(f"\nYou ({my_symbol}): {self.player_username}")
            print(f"Opponent ({opponent_symbol}): {self.other_player_username}")
            
            if self.current_player == my_symbol and not self.is_game_over:
                print("\n⭐ It's YOUR turn!")
            elif not self.is_game_over:
                print(f"\nWaiting for {self.other_player_username} to make a move...")
        else:
            if self.is_host:
                print("\n⏳ Waiting for another player to join...")
                print(f"\nShare this game code with your friend: {self.game_session_id}")
            else:
                print("\n⏳ Connecting to the game...")
    
    def check_win(self, board, player):
        """Check if a player has won."""
        win_patterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],  # Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8],  # Columns
            [0, 4, 8], [2, 4, 6]              # Diagonals
        ]
        
        for pattern in win_patterns:
            if all(board[index] == player for index in pattern):
                return True
        return False
    
    def check_draw(self, board):
        """Check if the game is a draw."""
        return all(cell is not None for cell in board)
    
    def make_move(self, position):
        """Make a move on the board."""
        if not self.other_player_username:
            print("\nCannot move until opponent joins the game.")
            return False
            
        if (
            position < 0 or 
            position > 8 or 
            self.board[position] is not None or
            self.is_game_over or
            not self.is_my_turn
        ):
            if not self.is_my_turn:
                print("It's not your turn yet.")
            elif self.board[position] is not None:
                print("That position is already taken.")
            elif position < 0 or position > 8:
                print("Invalid position. Choose 1-9.")
            return False
        
        # Determine which symbol (X or O) this player is using
        my_symbol = 'X' if self.is_host else 'O'
        
        # Make sure it's this player's turn
        if self.current_player != my_symbol:
            print("It's not your turn yet!")
            return False
            
        self.board[position] = my_symbol
        
        # Check for win or draw
        if self.check_win(self.board, my_symbol):
            self.is_game_over = True
            self.display_board()
            print("You win!")
            self.end_game(f"{my_symbol}_WINS")
            return True
        
        if self.check_draw(self.board):
            self.is_game_over = True
            self.display_board()
            print("It's a draw!")
            self.end_game('DRAW')
            return True
        
        # Switch to other player's turn
        self.current_player = 'O' if self.current_player == 'X' else 'X'
        self.is_my_turn = False
        
        # Send game update to server
        self.send_game_update()
        return True
    
    def send_game_update(self):
        """Send the current game state to the server."""
        # Convert None values to null for JSON serialization
        json_board = []
        for cell in self.board:
            json_board.append(cell if cell is not None else None)
            
        game_state_string = json.dumps({
            'board': json_board,
            'currentPlayer': self.current_player,
            'gameSessionID': self.game_session_id,
        })
        
        try:
            print(f"Sending game update to server...")
            response = self.stub.SendGameUpdate(
                game_pb2.SendGameUpdateRequest(
                    fromPlayerID=self.player_id,
                    gameState=game_state_string
                )
            )
            
            if response.status != game_pb2.SendGameUpdateResponse.SendGameUpdateStatus.SUCCESS:
                print(f"Failed to send game update: {response.message}")
            else:
                print("Move sent successfully!")
                # After sending the update, explicitly update the display to show the waiting state
                self.display_board()
        except grpc.RpcError as e:
            print(f"Error sending game update: {e}")
    
    def log(self, message):
        """Print debug messages if debug mode is enabled."""
        if self.debug:
            print(f"[DEBUG] {message}")
    
    def subscribe_to_game_updates(self):
        """Subscribe to game updates from the server."""
        request = game_pb2.SubscribeToGameUpdatesRequest(
            gameSessionID=self.game_session_id,
            userID=self.player_id
        )
        
        self.log(f"Starting game updates subscription for session {self.game_session_id}")
        self.log(f"My player ID: {self.player_id}")
        
        try:
            for response in self.stub.SubscribeToGameUpdates(request):
                # Only process updates from the other player
                if response.fromPlayerID != self.player_id:
                    self.log(f"Received game update from {response.fromPlayerID}")
                    
                    try:
                        updated_state = json.loads(response.gameState)
                        self.log(f"Updated state: {updated_state}")
                        
                        self.board = updated_state['board']
                        self.current_player = updated_state['currentPlayer']
                        
                        # Check if it's this player's turn
                        my_symbol = 'X' if self.is_host else 'O'
                        self.is_my_turn = (self.current_player == my_symbol)
                        
                        self.log(f"Current player: {self.current_player}, My symbol: {my_symbol}, Is my turn: {self.is_my_turn}")
                        
                        self.display_board()
                        
                        # Check for win/draw after opponent's move
                        opponent_symbol = 'O' if self.is_host else 'X'
                        if self.check_win(self.board, opponent_symbol):
                            self.is_game_over = True
                            print(f"Player {opponent_symbol} wins!")
                            print(f"{self.other_player_username} has won the game!")
                            # No need to send game end as the opponent should have done that
                            return
                        
                        if self.check_draw(self.board) and not self.is_game_over:
                            self.is_game_over = True
                            print("It's a draw!")
                            # No need to send game end as the opponent should have done that
                            return
                        
                        if self.is_my_turn and not self.is_game_over:
                            self.prompt_for_move()
                    except json.JSONDecodeError as e:
                        print(f"Error parsing game state: {e}")
                        self.log(f"Error parsing game state from {response.gameState}: {e}")
                    except Exception as e:
                        print(f"Error processing game update: {e}")
                        self.log(f"Error processing game update: {e}")
        except grpc.RpcError as e:
            print(f"Error in game updates stream: {e}")
            self.log(f"Error in game updates stream: {e}")

    def subscribe_to_player_updates(self):
        """Subscribe to player updates from the server."""
        while not self.is_game_over:  # Keep running until game is over
            # If we already found the other player, no need to keep subscribing
            if self.other_player_username:
                self.log("Already found opponent, no need to keep polling for players")
                break
                
            print("IN FUNCTION")
            request = game_pb2.GetPlayersRequest(
                gameSessionID=self.game_session_id,
                userID=self.player_id
            )

            print("AM HEREEE")
            print(request)
            
            self.log(f"Starting player updates subscription for session {self.game_session_id}")
            self.log(f"My player ID: {self.player_id}, username: {self.player_username}")
            
            try:
                # To avoid processing our own player record as another player
                other_player_found = False
                
                for player in self.stub.GetPlayers(request):
                    print("FIRST PLAYER", player)
                    self.log(f"Received player update: ID={player.userID}, username={player.username}")
                    
                    # Skip if this is our own player record
                    if player.userID == self.player_id:
                        self.log(f"Skipping own player record: {player.userID}")
                        continue
                    
                    # We found a different player, so this is truly the opponent
                    if not other_player_found:
                        print("HERE")
                        other_player_found = True
                        self.other_player_id = player.userID
                        self.other_player_username = player.username
                        
                        self.log(f"Found opponent: ID={player.userID}, username={player.username}")
                        print(f"\n{player.username} has joined the game!")
                        print("\nGame is now starting!")
                        
                        # Set initial turn state
                        if self.is_host:
                            print("\nYou're the host (X), so you go first!")
                            self.is_my_turn = True
                            self.current_player = 'X'
                        else:
                            print("\nYou're the guest (O), waiting for host to make first move.")
                            self.is_my_turn = False
                            self.current_player = 'X'  # Host (X) goes first
                        
                        self.display_board()
                        
                        # If host, prompt for first move
                        if self.is_host:
                            self.prompt_for_move()
                        
                        # Exit the loop since we found the opponent
                        return
            
            except grpc.RpcError as e:
                print(f"Error in player updates stream: {e}")
                self.log(f"Error in player updates stream: {e}")
            
            # Add a small delay before retrying to avoid hammering the server
            if not self.is_game_over and not self.other_player_username:
                self.log("Player updates subscription ended, restarting in 5 seconds...")
                time.sleep(5)
    
    def end_game(self, end_state):
        """End the game and notify the server."""
        try:
            response = self.stub.GameEnd(
                game_pb2.GameEndRequest(
                    gameSessionID=self.game_session_id,
                    endState=end_state
                )
            )
            
            if response.status != game_pb2.GameEndResponse.GameEndStatus.SUCCESS:
                print(f"Failed to end game: {response.message}")
            
            print("Game has ended. Thanks for playing!")
            input("Press Enter to exit...")
            os._exit(0)
        except grpc.RpcError as e:
            print(f"Error ending game: {e}")
    
    def heartbeat(self):
        """Send periodic heartbeats to the server."""
        while not self.is_game_over:
            try:
                self.stub.Heartbeat(
                    game_pb2.HeartbeatRequest(
                        requestor_id=self.player_id,
                        server_id="server"
                    )
                )
            except grpc.RpcError as e:
                print(f"Heartbeat error: {e}")
            
            time.sleep(30)  # Send heartbeat every 30 seconds
    
    def prompt_for_move(self):
        """Prompt the player to make a move."""
        if not self.other_player_username:
            print("Waiting for opponent to join before you can make a move...")
            return
            
        try:
            self.log(f"Prompting for move, my turn: {self.is_my_turn}, current player: {self.current_player}")
            move = int(input("\nEnter your move (1-9): ")) - 1  # Convert to 0-based index
            
            if not self.make_move(move):
                print("Invalid move. Try again.")
                self.prompt_for_move()
            else:
                self.display_board()
        except ValueError:
            print("Please enter a number between 1 and 9.")
            self.prompt_for_move()
    
    def create_game(self):
        """Create a new game as the host."""
        self.player_username = input("Enter your username: ")
        self.game_session_id = str(uuid.uuid4())
        self.is_host = True
        self.is_my_turn = False  # Set to false until other player joins
        
        try:
            response = self.stub.LaunchGameRoom(
                game_pb2.LaunchGameRoomRequest(
                    gameSessionID=self.game_session_id,
                    hostID=self.player_id,
                    hostUsername=self.player_username
                )
            )
            
            if response.status != game_pb2.LaunchGameRoomResponse.LaunchGameRoomStatus.SUCCESS:
                print(f"Failed to create game room: {response.message}")
                return
            
            print(f"\nGame created! Share this game code with your friend: {self.game_session_id}")
            print("\nWaiting for opponent to join. The game will start automatically once they connect.")
            
            # Start subscription threads
            self.heartbeat_thread = threading.Thread(target=self.heartbeat, daemon=True)
            self.heartbeat_thread.start()
            
            self.players_thread = threading.Thread(target=self.subscribe_to_player_updates, daemon=True)
            self.players_thread.start()
            
            self.game_updates_thread = threading.Thread(target=self.subscribe_to_game_updates, daemon=True)
            self.game_updates_thread.start()
            
            # Display initial waiting board
            self.display_board()
            
            # Keep the main thread alive
            while not self.is_game_over:
                time.sleep(1)
                
        except grpc.RpcError as e:
            print(f"Error creating game room: {e}")
    
    def join_game(self):
        """Join an existing game."""
        self.game_session_id = input("Enter the game code: ")
        self.player_username = input("Enter your username: ")
        self.is_host = False
        self.is_my_turn = False  # Initially not your turn as guest (O)
        self.current_player = 'X'  # Game starts with X (host) turn
        
        try:
            response = self.stub.JoinGameRoom(
                game_pb2.JoinGameRoomRequest(
                    gameSessionID=self.game_session_id,
                    userID=self.player_id,
                    username=self.player_username
                )
            )
            
            if response.status != game_pb2.JoinGameRoomResponse.JoinGameRoomStatus.SUCCESS:
                print(f"Failed to join game room: {response.message}")
                return
            
            print("Successfully joined the game!")
            print("You are player O. The host (X) will make the first move.")
            self.display_board()
            
            # Start subscription threads
            self.heartbeat_thread = threading.Thread(target=self.heartbeat, daemon=True)
            self.heartbeat_thread.start()
            
            self.players_thread = threading.Thread(target=self.subscribe_to_player_updates, daemon=True)
            self.players_thread.start()
            
            self.game_updates_thread = threading.Thread(target=self.subscribe_to_game_updates, daemon=True)
            self.game_updates_thread.start()
            
            # Keep the main thread alive
            while not self.is_game_over:
                time.sleep(1)
                
        except grpc.RpcError as e:
            print(f"Error joining game room: {e}")


def main():
    print("Welcome to Tic-Tac-Toe!")
    choice = input("Do you want to (1) Create a new game or (2) Join a game? ")
    
    client = TicTacToeClient()
    
    if choice == '1':
        client.create_game()
    elif choice == '2':
        client.join_game()
    else:
        print("Invalid choice. Exiting...")


if __name__ == "__main__":
    main()