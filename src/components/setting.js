import React from "react";

const Setting = (props) => {
    return(
      <div id={props.type+"-container"} className="setting-container col-md-3">
        <div id={props.type+"-label"} className="setting-title">{props.title}</div>
  
        <button id={props.type+"-decrement"} type="button" className="setting btn btn-outline-secondary" value="-" onClick={props.handleClick}>-</button>
        
        <div id={props.type+"-length"} className="setting-value">

          <span className="length">{props.min}</span>

          {props.sec < 10 ? <span className="length">:0{props.sec}</span>
                          : <span className="length">:{props.sec}</span>}

        </div>
        
        <button id={props.type+"-increment"} type="button" className="setting btn btn-outline-secondary" value="+" onClick={props.handleClick}>+</button>
  
        <input id={props.type+"-slider"} className="setting slider" type="range" min="1" max="3600" step="1" value={props.min * 60 + props.sec} onChange={props.handleClick}></input>
  
      </div>
    );
  }

  export default Setting;