// Global interface for game score submission
window.gameAPI = {
    gameScore: 0,
    
    // Set score
    setScore: function(score) {
      this.gameScore = score;
      // Optional: Broadcast score update event
      window.dispatchEvent(new CustomEvent('game-score-update', { 
        detail: { score } 
      }));
    },
    
    // Increment score
    addScore: function(points) {
      this.gameScore += points;
      // Optional: Broadcast score update event
      window.dispatchEvent(new CustomEvent('game-score-update', { 
        detail: { score: this.gameScore } 
      }));
    },
    
    // End game and submit score
    endGame: function() {
      // Broadcast game end event with final score
      window.dispatchEvent(new CustomEvent('game-end', { 
        detail: { finalScore: this.gameScore } 
      }));
      
      return this.gameScore;
    }
  };