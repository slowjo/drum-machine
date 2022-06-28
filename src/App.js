import * as React from 'react';
import LoopList from './components/looplist/LoopList';
import Keyboard from './components/drumkit/Keyboard';
import LoopCombiner from './components/loopcombiner/LoopCombiner';
import VisualDrumPattern from './components/visualdrumpattern/VisualDrumPattern';
import Controls from './components/controls/Controls';
import TempoSlider from './components/controls/TempoSlider';
// import Display from './components/drumkit/Display';
// import LoopDisplay from './components/controls/LoopDisplay';
import VisualDrumPatternState from './context/visualdrumpattern/VisualDrumPatternState';

const App = () => {
  const [currentSound, setCurrentSound] = React.useState("");
  const [playing, setPlaying] = React.useState(false);
  const [recording, setRecording] = React.useState(false);
  const [loopEnd, setLoopEnd] = React.useState(true);
  const [addedSoundsArray, setAddedSoundsArray] = React.useState([]);
  const [beatLength, setBeatLength] = React.useState(350);
  const [loopStart, setLoopStart] = React.useState(null);
  const [baseAudio, setBaseAudio] = React.useState(null);
  const [pulse, setPulse] = React.useState(false);
  const [loops, setLoops] = React.useState([
    {
      id: 1,
      name: "Loop 1",
      addedSounds: []
    }
  ]);
  const [currentLoopId, setCurrentLoopId] = React.useState(1);
  const [loopsListView, setLoopsListView] = React.useState(false);
  const [loopCombination, setLoopCombination] = React.useState([1, 1, 1, 1]);
  const [playingCombination, setPlayingCombination] = React.useState(false);
  const [comboIndex, setComboIndex] = React.useState(0);

  const selectLoop = (id, newLoop = false) => {
    if (id !== currentLoopId) {
      setLoops((prev) => {
        const newArray = prev.map((item) => {
          if (item.id === currentLoopId) {
            return {
              ...item,
              addedSounds: addedSoundsArray
            };
          } else {
            return item;
          }
        });
        return newArray;
      });

      setCurrentLoopId(id);

      if (newLoop) {
        setAddedSoundsArray([]);
      } else {
        setAddedSoundsArray(loops.find((loop) => loop.id === id).addedSounds);
      }
    }
  };

  const nextLoop = () => {
    const currentLoop = loops.find((loop) => loop.id === currentLoopId);
    const currentLoopIndex = loops.indexOf(currentLoop);

    if (currentLoopIndex === loops.length - 1) return;

    const nextLoopId = loops[currentLoopIndex + 1].id;
    selectLoop(nextLoopId);
  };

  const previousLoop = () => {
    const currentLoop = loops.find((loop) => loop.id === currentLoopId);
    const currentLoopIndex = loops.indexOf(currentLoop);

    if (currentLoopIndex === 0) return;

    const previousLoopId = loops[currentLoopIndex - 1].id;
    selectLoop(previousLoopId);
  };

  const makeNewLoop = () => {
    const newLoop = {
      id: Date.now(),
      name: "Loop " + (loops.length + 1),
      addedSounds: []
    };

    setLoops((prev) => [...prev, newLoop]);

    selectLoop(newLoop.id, true);
  };

  const deleteLoop = (id) => {
    if (loops.length < 2) return;

    const loopToDelete = loops.find((loop) => loop.id === id);

    if (id === currentLoopId) {
      const loopIndex = loops.indexOf(loopToDelete);
      if (loopIndex === 0) {
        const nextLoopId = loops[1].id;
        selectLoop(nextLoopId);
      } else {
        const prevLoopId = loops[loopIndex - 1].id;
        selectLoop(prevLoopId);
      }
    }

    setLoops((prev) => {
      const newArray = prev.filter((item) => item.id !== id);
      return newArray;
    });
  };

  const handleLoopClick = (e, id) => {
    if (e.target.classList.contains("loop-delete")) {
      deleteLoop(id);
    } else {
      selectLoop(id);
    }
  };

  const startStop = () => {
    if (playing) {
      setRecording(false);
    }
    setPlaying((prev) => !prev);
  };

  const record = () => {
    if (!recording) {
      setRecording(true);
      setPlaying(true);
    } else {
      setRecording(false);
      setPlaying(false);
    }
  };

  const discardRecord = () => {
    setAddedSoundsArray([]);
  };

  React.useEffect(() => {
    setBaseAudio(document.getElementById("A"));
  }, []);

  React.useEffect(() => {
    if (playing && loopEnd) {
      let nextLoopIndex = comboIndex < 3 ? comboIndex + 1 : 0;
      setLoopEnd(false);
      setLoopStart(Date.now());
      baseAudio.currentTime = 0;
      baseAudio.play();
      playBeatAfter(baseAudio, beatLength);
      playBeatAfter(baseAudio, beatLength * 2);
      playBeatAfter(baseAudio, beatLength * 3);
      setTimeout(() => {
        if (playingCombination) {
          selectLoop(loopCombination[nextLoopIndex]);
          setComboIndex((prev) => (prev < 3 ? prev + 1 : 0));
        }
        setLoopEnd(true);
      }, beatLength * 4);
      addedSoundsArray.forEach((soundItem) => {
        playBeatAfter(soundItem.audioElement, soundItem.timeout * beatLength);
      });
      setPulse(true);
      setTimeout(() => {
        setPulse(false);
      }, 150);
    }
  // eslint-disable-next-line  
  }, [playing, loopEnd]);

  const handleClick = (e) => {
    if (e.target.classList.contains("drum-pad")) {
      setCurrentSound(e.target.id);
      const audioElement = e.target.querySelector("audio");
      playAndSave(audioElement);
    }
  };

  const handleHover = (e) => {
    setCurrentSound(e.target.id);
  };

  const clearDisplay = () => {
    setCurrentSound(null);
  };

  // const handleKeyPress = (e) => {
  //   const audioElement = document.getElementById(e.key.toUpperCase());
  //   if (audioElement) {
  //     playAndSave(audioElement);
  //     setCurrentSound(audioElement.parentElement.id);
  //   }
  // };

  function playAndSave(audioElement) {
    audioElement.currentTime = 0;
    audioElement.play();
    if (playing && recording && addedSoundsArray.length < 15) {
      setAddedSoundsArray((prev) => {
        return [
          ...prev,
          {
            audioElement: audioElement,
            timeout: Math.round((Date.now() - loopStart) / beatLength * 100 ) / 100 + Math.round(Math.random() * 1000) / 100000,
          }
        ];
      });
    }
  }

  function playBeatAfter(audioElement, timeout) {
    setTimeout(() => {
      audioElement.currentTime = 0;
      audioElement.play();
    }, timeout);
  }

  const handleTempoChange = (e) => {
    setBeatLength(500 - e.target.value);
  };

  React.useEffect(() => {
    const handleKeyPress = (e) => {
      const audioElement = document.getElementById(e.key.toUpperCase());
      if (audioElement) {
        playAndSave(audioElement);
        setCurrentSound(audioElement.parentElement.id);
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return function cleanUp() {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [playAndSave]);

  const upOrDownInCombination = (id, rank, up) => {
    const currentlySelected = loops.find((loop) => loop.id === id);
    if (!currentlySelected) return;
    const currentIndex = loops.indexOf(currentlySelected);
    if (up) {
      if (currentIndex === loops.length - 1) return;
      setLoopCombination((prev) => {
        const newArray = [...prev];
        newArray[rank] = loops[currentIndex + 1].id;
        return newArray;
      });
    } else {
      if (currentIndex === 0) return;
      setLoopCombination((prev) => {
        const newArray = [...prev];
        newArray[rank] = loops[currentIndex - 1].id;
        return newArray;
      });
    }
  };

  const selectCombo = () => {
    setPlayingCombination(true);
  };

  const unselectCombo = () => {
    setPlayingCombination(false);
    setComboIndex(0);
  };

  // const clickAway = (e) => {
  //   if (!e.target.classList.contains('pattern-point')) {
  //     console.log('clicked away');
  //     if (anyPointsSelected) {
  //       setAnyPointsSelected(false);
  //     }
  //   }
  // }

  return (
    <VisualDrumPatternState>
    <React.Fragment>
      <div id="drum-machine" className="desktop">
        <h1 className="title">
          <span className="primary-color">Drum</span> Machine
        </h1>
        <LoopList
          loops={loops}
          currentLoopId={currentLoopId}
          selectLoop={selectLoop}
          makeNewLoop={makeNewLoop}
          deleteLoop={deleteLoop}
          handleLoopClick={handleLoopClick}
          unselectCombo={unselectCombo}
        />
        <div className="main-grid-drums">
          <Keyboard
            handleClick={handleClick}
            handleHover={handleHover}
            clearDisplay={clearDisplay}
            desktop={true}
            playing={playing}
            recording={recording}
            record={record}
            sound={currentSound}
            displayId={"display"}
          />
          <LoopCombiner
            loops={loops}
            loopCombination={loopCombination}
            upOrDownInCombination={upOrDownInCombination}
            selectCombo={selectCombo}
            playingCombination={playingCombination}
            comboIndex={comboIndex}
            playing={playing}
            beatLength={beatLength}
          />
        </div>
        <div className="main-grid-visualp">
          <VisualDrumPattern
            addedSoundsArray={addedSoundsArray}
            currentLoopId={currentLoopId}
            loops={loops}
            soundsAdded={addedSoundsArray.length > 0}
            discardRecord={discardRecord}
            playing={playing}
            beatLength={beatLength}
            loopEnd={loopEnd}
            setAddedSoundsArray={setAddedSoundsArray}
          />
        </div>
        <div className="bottom-bar flex flex-center flex-space-between px-1">
          <p className="flex-1">Loop</p>
          <Controls
            startStop={startStop}
            playing={playing}
            pulse={pulse}
            nextLoop={nextLoop}
            previousLoop={previousLoop}
          />
          <TempoSlider
            beatLength={beatLength}
            handleTempoChange={handleTempoChange}
          />
        </div>
      </div>

      <div id="drum-machine-mobile" className="mobile">
        <h1 className="title">
          <span className="primary-color">Drum</span> Machine
        </h1>
        {loopsListView ? (
          <LoopList
            loops={loops}
            currentLoopId={currentLoopId}
            selectLoop={selectLoop}
            makeNewLoop={makeNewLoop}
            deleteLoop={deleteLoop}
            handleLoopClick={handleLoopClick}
          />
        ) : (
          <React.Fragment>
            <Keyboard
              handleClick={handleClick}
              handleHover={handleHover}
              clearDisplay={clearDisplay}
              desktop={true}
              playing={playing}
              recording={recording}
              record={record}
              sound={currentSound}
              displayId={"display"}
              mobile
            />
            <VisualDrumPattern
            addedSoundsArray={addedSoundsArray}
            currentLoopId={currentLoopId}
            loops={loops}
            soundsAdded={addedSoundsArray.length > 0}
            discardRecord={discardRecord}
            playing={playing}
            beatLength={beatLength}
            loopEnd={loopEnd}
            setAddedSoundsArray={setAddedSoundsArray}
            />
            {/* <LoopDisplay currentLoopId={currentLoopId} loops={loops} /> */}
          </React.Fragment>
        )}
        <div className="bottom-bar flex flex-center flex-space-between px-1">
          <p className="flex-1">Loop</p>
          <Controls
            startStop={startStop}
            playing={playing}
            pulse={pulse}
            nextLoop={nextLoop}
            previousLoop={previousLoop}
          />
          <TempoSlider
            beatLength={beatLength}
            handleTempoChange={handleTempoChange}
          />
        </div>
      </div>
    </React.Fragment>
    </VisualDrumPatternState>
  );
};

export default App;
