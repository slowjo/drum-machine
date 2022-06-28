import DrumPad from './DrumPad';
import Display from './Display';
import { pads } from '../../data/pads';

const Keyboard = (props) => {
    let recordClassName = "btn btn-pill btn-primary";
    if (props.recording) {
      recordClassName += " btn-on";
    }
  
    return (
      <div className="keyboard mb-3" style={props.mobile ? {width: '100%'} : {}}>
        <div className="flex flex-center flex-space-between mb-1">
          <h2 className="text-center mt-0">
            <i className="fa-solid fa-drum"></i> Drum Kit
          </h2>
          <div>
            <button className={recordClassName} onClick={props.record}>
              <i className="fa-solid fa-circle"></i>{" "}
              {props.recording ? "Stop Recording" : "Start Recording"}
            </button>
          </div>
        </div>
        <div className={`${!props.mobile ? 'flex flex-gap-1' : '' }`} >
          <div className="pads flex-2" style={props.mobile ? {maxWidth: '100%'} : {}} onClick={props.handleClick} onTouchStart={props.handleClick}>
            {pads.map((pad) => (
              <DrumPad
                key={pad.sound}
                pad={pad}
                handleHover={props.handleHover}
                clearDisplay={props.clearDisplay}
                desktop={props.desktop}
                mobile={props.mobile}
              />
            ))}
          </div>
          {
            !props.mobile && (
              <Display id={props.displayId} sound={props.sound} />
            )
          }
        </div>
      </div>
    );
  };

  export default Keyboard;