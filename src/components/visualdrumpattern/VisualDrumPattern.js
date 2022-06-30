import * as React from 'react';
import PatternBar from './PatternBar';
import VisualDrumPatternContext from '../../context/visualdrumpattern/VisualDrumPatternContext';

const VisualDrumPattern = ({
    addedSoundsArray,
    loops,
    currentLoopId,
    discardRecord,
    soundsAdded,
    playing,
    beatLength,
    loopEnd,
    setAddedSoundsArray,
  }) => {
    const { unselectAllPoints, selectCount, setTouch, touch } = React.useContext(VisualDrumPatternContext);

    const [mouseIn, setMouseIn] = React.useState(false);
    const [prelimArrayForDel, setPrelimArrayForDel] = React.useState([...addedSoundsArray]);
    const [addedSoundsTracker, setAddedSoundsTracker] = React.useState([...addedSoundsArray]);

    // Like in PatterBar, the prelimArrayForDel doesnt update when more sounds are added. So for now, the best solution seems to be to track the addedSoundsArray with a state, check if its equal to the prop, and update prelimArrayForDel when something has changed, otherwise not. It really only works when its not possible to add sounds while points are selected so needs to be made sure
    React.useEffect(() => {
      const clickAway = (e) => {
        if (touch) {
          setTouch(false);
        }
        if (!e.target.classList.contains('pattern-point')) {
          console.log('clicked away');
          if (selectCount > 0) {
            unselectAllPoints();
          }
          }
      }

      document.addEventListener('click', clickAway);
      
      return function() {
        document.removeEventListener('click', clickAway);
      }
    }, [selectCount, unselectAllPoints, touch, setTouch]);

    React.useEffect(() => {
      const handleTouch = () => {
        if (!touch) {
          setTouch(true);
        }
      };

      document.addEventListener('touchstart', handleTouch);
      console.log('touch event listener added');

      return function() {
        document.removeEventListener('touchstart', handleTouch);
        console.log('touch event listener removed');
      }
    }, [touch, setTouch]);

    React.useEffect(() => {
      if (addedSoundsTracker.length !== addedSoundsArray.length) {
        setAddedSoundsTracker([...addedSoundsArray]);
        setPrelimArrayForDel([...addedSoundsArray]);
      }
    // eslint-disable-next-line  
    }, [addedSoundsArray]);

    const currentLoop = loops.find((loop) => loop.id === currentLoopId);
  
    const soundMap = {};
    const audioElementMap = {};
    const addedSoundsArrayCopy = [...addedSoundsArray];
    addedSoundsArrayCopy.sort((a, b) => {
      if (a.audioElement.id < b.audioElement.id) return -1;
      if (a.audioElement.id > b.audioElement.id) return 1;
      return 0;
    });
    for (let sound of addedSoundsArrayCopy) {
      const soundName = sound.audioElement.parentElement.id;
      if (soundMap[soundName]) {
        soundMap[soundName].push(sound.timeout);
      } else {
        soundMap[soundName] = [sound.timeout];
      }
      if (!audioElementMap[soundName]) {
        audioElementMap[soundName] = sound.audioElement;
      }
    }

    const rebuildSoundMap = (newTimeOuts, sound, move=true) => {
      // soundMap[sound] = newTimeOuts;
      const audioElement = audioElementMap[sound];
      const newTimeOutsWithSoundElements = newTimeOuts.map((item) => ({
        audioElement: audioElement,
        timeout: item,
      }));
      if (move) {
        // Move = true is for moving the point within the bar, move = false is for selecting/unselecting the point for deletion
        const filteredAddedSoundsArray = addedSoundsArray.filter((item) => item.audioElement !== audioElement);
        filteredAddedSoundsArray.push(...newTimeOutsWithSoundElements);
        setAddedSoundsArray(filteredAddedSoundsArray);
        // When a point is moved, it also needs to be moved in the prelim for del array
        const filteredDelArray = prelimArrayForDel.filter((item) => item.audioElement !== audioElement);
        filteredDelArray.push(...newTimeOutsWithSoundElements);
        setPrelimArrayForDel(filteredDelArray);
      } else {
        const filteredAddedSoundsArray = prelimArrayForDel.filter((item) => item.audioElement !== audioElement);
        filteredAddedSoundsArray.push(...newTimeOutsWithSoundElements);
        setPrelimArrayForDel(filteredAddedSoundsArray);
      }
    }

    const deleteSelected = () => {
      setAddedSoundsArray(prelimArrayForDel);
      unselectAllPoints();
    }

    const arrayForRender = [];
    for (let key in soundMap) {
      const arrayElement = (
        <PatternBar key={soundMap[key][0]} sound={key} timeouts={soundMap[key]} beatLength={beatLength} mouseIn={mouseIn} interactive rebuildSoundMap={rebuildSoundMap} />
      );
      arrayForRender.push(arrayElement);
    }
  
    let trashClassName = "btn btn-pill btn-border";
    if (!soundsAdded) {
      trashClassName += " btn-disabled";
    }

    // Remove event listener for dragging point
    const handleMouseEnter = () => {
      setMouseIn(true);
    }

    const handleMouseLeave = () => {
      setMouseIn(false);
    }

    const handleClearClick = () => {
      if (selectCount > 0) {
        deleteSelected();
      } else {
        discardRecord();
      }
    }
  
    return (
      <React.Fragment>
        <div className="flex flex-center flex-space-between mb-1">
          <h2 className="mt-0">{currentLoop.name}</h2>
          <div>
            <button
              className={trashClassName}
              onClick={handleClearClick}
              disabled={!soundsAdded}
            >
              <i className="fa-solid fa-broom"></i> {`Clear ${selectCount > 0 ? 'Selected' : 'All'}`}
            </button>
          </div>
        </div>
        <div className='visual-drum-pattern' style={playing ? { '--bar-length': `${beatLength * 4}ms` } : {}} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onMouseUp={handleMouseLeave} onMouseDown={handleMouseEnter}>
        <PatternBar sound={'hihat'} timeouts={[0, 1, 2, 3]} beatLength={beatLength} playing={playing} loopEnd={loopEnd} mouseIn={mouseIn} interactive={false} rebuildSoundMap={() => {}} />
          {arrayForRender}</div>
      </React.Fragment>
    );
  };

  export default VisualDrumPattern;