const LoopListItem = ({ loop, selectLoop, active, handleLoopClick }) => {
    return (
      <div
        className={`loop-list-item ${active && "active"}`}
        onClick={(e) => handleLoopClick(e, loop.id)}
      >
        <p>{loop.name}</p>
        {active && (
          <button className="btn btn-small loop-delete">
            <i className="fa-solid fa-trash no-pointer"></i>
          </button>
        )}
      </div>
    );
  };

export default LoopListItem;