function CountdownTimer(min, sec) {
    this.sec = sec;
    this.min = min;
    this.ms = 999; // So starting time doesn't count down immediately
    this.distance = 0; // Ms from now to 00:00
    this.running = false;
    this.functions = []; // Functions to call each tick
    this.timer = ''; // timer ID for clearing timeout
  }
  
  // Function to start timer
  CountdownTimer.prototype.start = function () {
    if (this.running) { return }
    
    this.running = true;
    let start = Date.now(),
        thisObj = this,
        distance, time;
    
    function timer() {
      // Count in ms
      let totalMs = (thisObj.min * 60000) + (thisObj.sec * 1000) + thisObj.ms, // Session length in ms
          elapsedMs = Math.floor((Date.now() - start)); // Time passed since starting timer
      
      distance = totalMs - elapsedMs;
      thisObj.distance = distance;
      // Still time left, continue countdown
      if (distance >= 0 && thisObj.running) {
        thisObj.timer = setTimeout(timer, 100);
      }
      // If pause was clicked
      else if (!thisObj.running) {
        return;
      }
      // Time is up
      else {
        distance = 0;
        thisObj.distance = 0;
        thisObj.running = false;
      }
      
      // Update min, sec, and ms left
      time = CountdownTimer.getTime(distance);
      
      // Call the onTick functions
      thisObj.functions.forEach(function(func) {
        func.call(this, time.minutes, time.seconds)
      }, thisObj);
    };
    
    timer();
    
  };
  
  // Call this to add function to execute on tick
  CountdownTimer.prototype.onTick = function(func) {
    if (typeof func === 'function') {
      this.functions.push(func);
    }
    return this;
  };
  
  // Call this to get timer status
  CountdownTimer.prototype.isRunning = function() {
    return this.running;
  }
  
  // Call this to pause timer
  CountdownTimer.prototype.pauseTimer = function() {
    if (this.running) { 
      const time = CountdownTimer.getTime(this.distance);
      
      //clearTimeout(this.timer);
      this.running = false;
      // Save info so timer can be resumed from same time
      this.sec = time.seconds;
      this.min = time.minutes;
      this.ms = time.ms;
      return this;
    }
  }
  
  // Call this to resume a paused timer
  CountdownTimer.prototype.resumeTimer = function() {
    if (!this.running) {
      this.start();
    }
  }
  
  // Call this to get current time
  CountdownTimer.getTime = function(ms) {
    return {
      'minutes': Math.floor(ms / 60000), // ms to min
      'seconds': Math.floor((ms / 1000) % 60), // leftover seconds
      'ms': Math.floor(ms % 1000) // leftover ms
    };
  };

  module.exports = CountdownTimer;