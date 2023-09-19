import React from "react";
import Controls from "./controls";
import Session from "./session";
import Setting from "./setting"

const CountdownTimer = require('../countdowntimer.js');

class Timer extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        timeRemaining: 1500, //seconds
        breakLength: 300, // seconds
        sessionLength: 1500, // seconds
        paused: true,
        timer: ''
      }
      this.handleClick = this.handleClick.bind(this);
      this.updateTimer = this.updateTimer.bind(this);
      this.startBreak = this.startBreak.bind(this);
      this.toggleSettings = this.toggleSettings.bind(this);
    }
    
    startBreak() {
      let timer = this.state.timer;
      let breakLength = this.state.breakLength;
      let sessionLength = this.state.sessionLength;
      let label = document.getElementById('timer-label');
      let beep = document.getElementById('beep');
      
      // Switch to break, only if timer exists but is not running (reached 00:00)
      if (timer && !timer.isRunning() && label.innerText === 'Session') {
        beep.play();
        
        // Use promise to check timer after beep, then resolve
        // Prevents issues with resetting during 00:00
        let promise = new Promise(function(resolve) {
          setTimeout(function() {
            if (timer.timer) { resolve() };
          }, beep.duration * 1000);
        });
        
        promise.then(
          () => {
            label.innerText = 'Break';
            timer.min = Math.floor(breakLength / 60);
            timer.sec = Math.floor(breakLength % 60);
            timer.start();
          }
        );
      }
      
      else if (timer && !timer.isRunning() && label.innerText === 'Break') {
        beep.play();
        let promise = new Promise(function(resolve) {
          setTimeout(function() {
            if (timer.timer) { resolve() };
          }, beep.duration * 1000);
        });
        
        promise.then(
          () => {
            label.innerText = 'Session';
            timer.min = Math.floor(sessionLength / 60);;
            timer.sec = Math.floor(sessionLength % 60);
            timer.start();
          }
        );
      }
    }
    
    // Function to update timer state in seconds
    updateTimer(minutes, seconds) {
      const timeRemaining = (minutes * 60) + seconds;
      this.setState({ timeRemaining: timeRemaining });
    }
    
    // Function to turn of settings
    toggleSettings() {
      const settings = document.querySelectorAll('.setting');
      
      for (const setting of settings) {
        setting.toggleAttribute('disabled');
      }
    }
  
    // Handle click events
    handleClick(event) {
      let id = event.target.id, // Clicked element ID
          timeRemaining = this.state.timeRemaining,
          breakLength = this.state.breakLength,
          sessionLength = this.state.sessionLength,
          paused = this.state.paused,
          timer = this.state.timer,
          button,
          val;
      
      switch(id) {
        case 'break-decrement':
          if (breakLength <= 1) { break }; // Prevent setting under 1s
          this.setState(prevState => ({ breakLength: prevState.breakLength - 1 })); // Remove 1s
          break;
        case 'break-increment':
          if (breakLength >= 3600) { break }; // Prevent setting above 60:00
          this.setState(prevState => ({ breakLength: prevState.breakLength + 1 })); // Add 1s
          break;
        case 'session-decrement':
          if (sessionLength <= 1) { break }; // Prevent setting under 1s
          this.updateTimer(0, sessionLength - 1); // Update state and UI
          this.setState(prevState => ({ sessionLength: prevState.sessionLength - 1, timer: '' })); // Remove 1s, reset timer
          break;
        case 'session-increment':
          if (sessionLength >= 3600) { break }; // Prevent setting above 60:00
          this.updateTimer(0, sessionLength + 1); // Update state and UI
          this.setState(prevState => ({ sessionLength: prevState.sessionLength + 1, timer: '' })); // Add 1s, reset timer
          break;
        case 'break-slider':
          val = parseInt(event.target.value); // Slider val in seconds
          this.setState({ breakLength: val }); // Set length to new val
          break;
        case 'session-slider':
          val = parseInt(event.target.value); // Slider val in seconds
          this.updateTimer(0, val); // Update state and UI
          this.setState({ sessionLength: val, timer: '' }); // Set length to new val, reset timer
          break;
        case 'start_stop':
          // Toggle icon
          button = document.getElementById('play-icon');
          
          // If timer hasn't been started
          if (!timer) {
            timer = new CountdownTimer(Math.floor(timeRemaining / 60), Math.floor(timeRemaining % 60)); // Start new timer
            timer.onTick(this.updateTimer).onTick(this.startBreak).start(); // Add tick functions
            button.classList.add('fa-pause');
            button.classList.remove('fa-play');
            this.toggleSettings(); // Turn off settings
            this.setState({ paused: false, timer: timer });
          }
          // If paused, clicking starts timer
          else if (paused) { 
            button.classList.add('fa-pause');
            button.classList.remove('fa-play');
            timer.start();
            this.setState({ paused: false });
          }
          // If running and timer is not at 00:00, clicking pauses timer
          else if (!paused && timeRemaining !== 0) {
            button.classList.remove('fa-pause');
            button.classList.add('fa-play');
            timer.pauseTimer();
            this.setState({ paused: true });
          }
          break;
        case 'reset':
          document.getElementById('timer-label').innerText = 'Session'; // Reset to session
          document.getElementById('beep').load(); // Reset beep
          button = document.getElementById('play-icon'); // Reset icon
          button.classList.remove('fa-pause');
          button.classList.add('fa-play');
          
          if (timer) { 
            // Turn on settings and reset timer
            this.toggleSettings(); 
            //timer.running = false;
            //timer.distance = 0;
            clearTimeout(timer.timer);
            timer.timer = '';
          };
          
          this.setState(prevState => ({ timeRemaining: prevState.sessionLength, breakLength: prevState.breakLength, 
                                        sessionLength: prevState.sessionLength, paused: true, timer: ''} ));
          break;
        default:
            break;
      }
    }
    
    render() {
      
      
      return (
        <div className="container">
          
          <div className="row">
            <Setting type={"break"} title={"Break Length"} min={Math.floor(this.state.breakLength / 60)} sec={Math.floor(this.state.breakLength % 60)} handleClick={this.handleClick}/>
            
            <Session min={Math.floor(this.state.timeRemaining / 60) } sec={Math.floor(this.state.timeRemaining % 60)}/>
            
            <Setting type={"session"} title={"Session Length"} min={Math.floor(this.state.sessionLength / 60)} sec={Math.floor(this.state.sessionLength % 60)} handleClick={this.handleClick}/>
          </div>
          
          <div className="row">
            <Controls handleClick={this.handleClick}/>
          </div>
          
        </div>
      );
    }
  }

  export default Timer;