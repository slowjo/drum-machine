const LoopCombinerElement = ({
    loops,
    loopId,
    upOrDownInCombination,
    rank,
    comboIndex,
    playing,
    playingCombination,
    beatLength,
  }) => {
    const selectedLoop = loops.find((loop) => loop.id === loopId);
  
    const handleClick = (e, up) => {
      upOrDownInCombination(loopId, rank, up);
    };
  
    return (
      <div
        className={`loop-combiner-element flex flex-center flex-space-between ${
          comboIndex === rank && playing && playingCombination && "active"
        }`}
      >
        <button onClick={(e) => handleClick(e, false)} className="btn">
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <p>{selectedLoop.name}</p>
        <button onClick={(e) => handleClick(e, true)} className="btn">
          <i className="fa-solid fa-chevron-right"></i>
        </button>
        <div className={`loop-combiner-progress ${comboIndex === rank && playing && playingCombination && "active"}`} style={comboIndex === rank && playing && playingCombination ? { transitionDuration: `${beatLength * 4}ms` } : {}}></div>
      </div>
    );
  };

export default LoopCombinerElement;