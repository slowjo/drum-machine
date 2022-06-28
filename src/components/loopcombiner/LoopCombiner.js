import LoopCombinerElement from './LoopCombinerElement';
import PlayButton from '../controls/PlayButton';

const LoopCombiner = ({
    loops,
    loopCombination,
    upOrDownInCombination,
    selectCombo,
    playingCombination,
    comboIndex,
    playing,
    beatLength,
  }) => {
    return (
      <div
        className={`loop-combiner-container ${playingCombination && "active"}`}
        onClick={selectCombo}
      >
        <div className="flex flex-center flex-space-between">
          <h2 className="mt-0">Combine Your Loops</h2>
          <PlayButton />
        </div>
        <div className="loop-combiner">
          {[0, 1, 2, 3].map((item) => (
            <LoopCombinerElement
              key={item}
              loops={loops}
              loopId={loopCombination[item]}
              upOrDownInCombination={upOrDownInCombination}
              rank={item}
              comboIndex={comboIndex}
              playing={playing}
              playingCombination={playingCombination}
              beatLength={beatLength}
            />
          ))}
        </div>
      </div>
    );
  };

export default LoopCombiner;