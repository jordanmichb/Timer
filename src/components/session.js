import React from "react";

const Session = (props) => {
    return(
      <div id="timer-container" className="col-md-5">
        <div id="timer-label">Session</div>
       
        <div id="time-left">

          {props.min < 10 ? <span>0{props.min}</span>
                          : <span>{props.min}</span>}
          {props.sec < 10 ? <span>:0{props.sec}</span>
                          : <span>:{props.sec}</span>}

        </div>
  
        <audio id="beep" preload="auto" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"></audio>
      </div>
    );
  }

  export default Session;