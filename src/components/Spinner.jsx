import icon from "../assets/pokemon-icon.png";

const Spinner = () => {
  return (
    <div className="loader">
      <img src={icon} alt="pokemon icon" />
    </div>
  );
};

export default Spinner;
