import * as React from 'react';
import VisualDrumPatternContext from '../../context/visualdrumpattern/VisualDrumPatternContext';

const PatternPoint = ({ timeout, barRef, mouseIn, interactive, sendDataForMove, sendDataForDelete, }) => {
  const { increaseSelectCount, decreaseSelectCount, selectCount, touch } = React.useContext(VisualDrumPatternContext);

  const [barLeft, setBarLeft] = React.useState(0);
  const [barWidth, setBarWidth] = React.useState(0);
  const [mouseDown, setMouseDown] = React.useState(false);
  const pointRef = React.useRef();
  const [offsetX, setOffsetX] = React.useState(0);
  const [selected, setSelected] = React.useState(false);
  const [mouseDownTime, setMouseDownTime] = React.useState(0);

  React.useEffect(() => {
    if (barRef.current) {
      setBarLeft(barRef.current.getBoundingClientRect().left);
      setBarWidth(barRef.current.getBoundingClientRect().width);
    }
  }, [barRef]);

  React.useEffect(() => {
    if (selectCount < 1) {
      setSelected(false);
    }
  }, [selectCount]);

  const add = (e) => {
      if (touch) {
        // setOffsetX(e.touches[0].clientX - pointRef.current.getBoundingClientRect().left); 
        setOffsetX(0); 
      } else {
        setOffsetX(e.clientX - pointRef.current.getBoundingClientRect().left);  
      }
      setMouseDown(true);
      if (selected) {
        toggleSelected();
      } else {
        setMouseDownTime(Date.now());
      }
  }

  const remove = (e) => {
    setMouseDown(false);
    if (Date.now() - mouseDownTime < 500) toggleSelected();     
  }

  React.useEffect(() => {
    setBarLeft(barRef.current.getBoundingClientRect().left);
    setBarWidth(barRef.current.getBoundingClientRect().width);
    let move = () => {};
    if (!touch) {
      move = (e) => {
        console.log('hey');
        if (e.pageX - barLeft - offsetX > barWidth || e.pageX - barLeft - offsetX < 0) return;
        if (mouseDown) {
          pointRef.current.style.left = `${e.pageX - barLeft - offsetX}px`;
        }
      }
    } else {
      move = (e) => {
        console.log('hey touch');
        if (!e.touches || e.touches[0].pageX - barLeft > barWidth || e.touches[0].pageX - barLeft < 0) return;
        console.log(offsetX);
        if (mouseDown) {
          pointRef.current.style.left = `${e.touches[0].pageX - barLeft}px`;
        }
      }
    }
    const barElement = barRef.current;
    barElement.addEventListener('mousemove', move);
    barElement.addEventListener('touchmove', move);
    return function() {
      console.log('cleaning');
      barElement.removeEventListener('mousemove', move);
      barElement.removeEventListener('touchmove', move);
    }
  }, [barRef, mouseDown, touch, barLeft, barWidth, offsetX]);

  React.useEffect(() => {
    if (!mouseIn) {
      setMouseDown(false);
    }
  }, [mouseIn]);

  const toggleSelected = () => {
    if (selected) {
      sendDataForDelete(timeout, false);
      decreaseSelectCount();
    } else {
      sendDataForDelete(timeout);
      increaseSelectCount();
    }
    setSelected((prev) => !prev);
  }

  React.useEffect(() => {
    if (!mouseDown) {
      if (barRef.current) {
        const factor = barRef.current.getBoundingClientRect().width / 4;
        const newX = parseFloat(pointRef.current.style.left.split('px')[0]);
        const newTimeOut = newX / factor;
        if (newX.toString() !== 'NaN') {
          const newWithRandom = Math.round(newTimeOut * 100 ) / 100 + Math.round(Math.random() * 1000) / 1000000;
          // sendDataForMove(newTimeOut, timeout);
          sendDataForMove(newWithRandom, timeout);
        }
      }
    }
  // eslint-disable-next-line  
  }, [mouseDown]);

    return (
      <React.Fragment>
      {interactive ? (
        <div
          className="pattern-point"
          style={{ left: `calc((${timeout} * 25%))`, cursor: 'pointer', 
            backgroundColor: `${selected ? 'var(--accent-color)' : 'var(--primary-color)'}`,
           }}
          ref={pointRef}
          onMouseDown={add}
          onMouseUp={remove}
          onTouchStart={add}
          onTouchEnd={remove}
          onDrag={(e) => {e.preventDefault()}}
        ></div>
      ) : (
        <div
          className="pattern-point"
          style={{ left: `calc((${timeout} * 25%))`, backgroundColor: 'darkgrey' }}
          ref={pointRef}
        ></div>
      )}
      </React.Fragment>
    );
  };

export default PatternPoint;