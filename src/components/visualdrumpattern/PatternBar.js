import * as React from 'react';
import PatternPoint from './PatternPoint';

const PatternBar = ({ sound, timeouts, playing, loopEnd, mouseIn, interactive, rebuildSoundMap, }) => {
    const barRef = React.useRef();
    // deleteTimeOuts keeps track of how the timeouts array would look if all selected timeouts where deleted
    const [deleteTimeOuts, setDeleteTimeOuts] = React.useState([...timeouts]);
    const [trackTimeOuts, setTrackTimeOuts] = React.useState([...timeouts]);

    // This checks if timeouts changed and updates the deleteTimeOuts state. It seems important when sounds are added, because the state actually doenst upadete automatically when sounds are added. Looks hacky, maybe check if there is another way.
    React.useEffect(() => {
      if (trackTimeOuts.toString() !== timeouts.toString()) {
        setDeleteTimeOuts([...timeouts]);
        setTrackTimeOuts([...timeouts]);
      }
    // eslint-disable-next-line  
    }, [timeouts]);

    const sendDataForMove = (newPoint, oldPoint) => {
      const filteredTimeOuts = timeouts.filter((item) => item !== oldPoint);
      filteredTimeOuts.push(newPoint);
      rebuildSoundMap(filteredTimeOuts, sound);
    }

    const sendDataForDelete = (point, select=true) => {
      let timeOutsToSend;
      if (select) {
        // select = true is for the case when the point is selected for deletion, select = false is for when the point is unselected
        // timeOutsToSend = [...deleteTimeOuts].filter((item) => item !== point);
        timeOutsToSend = [...deleteTimeOuts].filter((item) => {
          if (item === point) console.log(item, '===', point);
          return item !== point;
        });
        console.log('deletetimeouts: ', [...deleteTimeOuts].filter((item) => item !== point));
      } else {
        const newArray = [...deleteTimeOuts];
        newArray.push(point);
        timeOutsToSend = [...newArray];
        console.log('deletetimeouts: ', newArray);
      }
      setDeleteTimeOuts(timeOutsToSend);
      rebuildSoundMap(timeOutsToSend, sound, false);
    }

    return (
      <React.Fragment>
        <p className="pattern-bar-label">{sound}</p>
        <div className={`pattern-bar ${playing && !loopEnd && 'active'}`} ref={barRef}>
          {timeouts.map((timeout) => (
            <PatternPoint key={timeout} timeout={timeout} mouseIn={mouseIn} barRef={barRef} interactive={interactive} sendDataForMove={sendDataForMove} sendDataForDelete={sendDataForDelete} />
          ))}
        </div>
      </React.Fragment>
    );
  };

export default PatternBar;