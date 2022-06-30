import * as React from 'react';
import PlayButton from './PlayButton';

const Controls = ({
    startStop,
    playing,
    pulse,
    nextLoop,
    previousLoop,
    currentLoopId,
    loops
  }) => {
    const [style, setStyle] = React.useState({
      transform: "scale(1)",
      background: "var(--dark-color)"
    });
  
    React.useEffect(() => {
      setStyle((prev) => ({
        ...prev,
        transform: pulse ? "scale(1.1)" : "scale(1)",
        background: playing ? "var(--accent-color)" : "var(--dark-color)"
      }));
    }, [playing, pulse]);
  
    return (
      <div>
        <div className="flex flex-center flex-gap-1 flex-1 my-1">
          <button className="btn btn-round" onClick={previousLoop}>
            <i className="fa-solid fa-backward-step"></i>
          </button>
          <PlayButton startStop={startStop} playing={playing} style={style} />
          <button className="btn btn-round" onClick={nextLoop}>
            <i className="fa-solid fa-forward-step"></i>
          </button>
        </div>
      </div>
    );
  };

export default Controls;