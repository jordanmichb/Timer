import React from "react";

const Controls = (props) => {
    return(
      <div id="controls" className="row">
        <span id="buttons">
          <button id="start_stop" onClick={props.handleClick}><i id="play-icon" className="fa-solid fa-play"></i>Play/Pause</button>
          <button id="reset" onClick={props.handleClick}><i className="fa-solid fa-repeat"></i>Reset</button>
        </span>
      </div>
    );
  }

  export default Controls;