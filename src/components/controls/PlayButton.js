const PlayButton = ({ startStop, style, playing }) => {
    return (
        <button
            className="btn btn-round start"
            onClick={startStop}
            style={style}
        >
            {playing ? (
            <i className="fa-solid fa-stop"></i>
            ) : (
            <i className="fa-solid fa-play"></i>
            )}
        </button>
    );
};

export default PlayButton;

PlayButton.defaultProps = {
    playing: false,
    startStop: () => {},
    style: {},
}