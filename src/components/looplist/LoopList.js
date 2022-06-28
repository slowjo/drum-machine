import LoopsTopBar from './LoopsTopBar';
import LoopListItem from './LoopListItem';

const LoopList = ({
    loops,
    currentLoopId,
    selectLoop,
    makeNewLoop,
    handleLoopClick,
    unselectCombo
  }) => {
    return (
      <div className="loop-list" onClick={unselectCombo}>
        <LoopsTopBar makeNewLoop={makeNewLoop} />
        <div className="loop-list-loops">
          {loops.map((loop) => (
            <LoopListItem
              key={loop.id}
              loop={loop}
              selectLoop={selectLoop}
              active={currentLoopId === loop.id}
              handleLoopClick={handleLoopClick}
            />
          ))}
        </div>
      </div>
    );
  };

export default LoopList;