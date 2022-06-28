const Display = (props) => {
    return (
      <div className="flex-1 flex flex-center text-l" id={props.id}>
        {props.sound}
      </div>
    );
  };

export default Display;