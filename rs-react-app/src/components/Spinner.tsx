import './Spinner.scss';
import Pokebal from '../assets/pokeball.svg';

const Spinner = () => {
  return (
    <div className={'container'}>
      <div className={'spinner_wrapper'}>
        <img
          className="spinner"
          src={Pokebal}
          alt="Loading..."
          width="80"
          height="80"
        />
        <p>Loading...</p>
      </div>
    </div>
  );
};

export default Spinner;
