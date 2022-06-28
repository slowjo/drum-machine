const LoopDisplay = ({ currentLoopId, loops }) => {
    const currentLoop = loops.find((loop) => loop.id === currentLoopId);
  
    return <div className="loop-display">{currentLoop.name}</div>;
  };

export default LoopDisplay;