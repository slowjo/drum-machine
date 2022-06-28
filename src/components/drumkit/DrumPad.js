const DrumPad = (props) => {
    return (
      <button
        id={props.pad.sound}
        className={`btn ${props.desktop ? "drum-pad" : "drum-pad-mobile"}`}
        onMouseEnter={props.handleHover}
        onMouseLeave={props.clearDisplay}
        onFocus={props.handleHover}
      >
        <p>{props.mobile ? props.pad.sound : props.pad.letter}</p>
        <audio
          className="clip"
          src={props.pad.url}
          preload="auto"
          id={props.pad.letter}
        />
      </button>
    );
  };

  export default DrumPad;