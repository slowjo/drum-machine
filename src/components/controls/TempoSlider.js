const TempoSlider = ({ beatLength, handleTempoChange }) => {
    return (
      <div className="tempo-slider flex-1">
        <input
          type="range"
          id="tempo"
          name="tempo"
          min="0"
          max="200"
          step="10"
          value={500 - beatLength}
          onChange={handleTempoChange}
        />
        <label htmlFor="tempo">Tempo</label>
      </div>
    );
  };

export default TempoSlider;