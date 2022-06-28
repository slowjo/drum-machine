const LoopsTopBar = ({ makeNewLoop }) => {
    return (
      <div className="flex flex-center flex-space-between mb-1">
        <h2 className="mt-0">Your loops</h2>
        <button className="btn btn-round" onClick={makeNewLoop}>
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>
    );
  };

export default LoopsTopBar;