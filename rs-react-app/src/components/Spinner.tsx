import './Spinner.scss';
import Image from 'next/image';
import pokeball from '../assets/pokeball.svg';

const Spinner = () => {
  return (
    <div className="spinner_wrapper">
      <Image
        className="spinner"
        src={pokeball}
        alt="Loading..."
        width={80}
        height={80}
      />
      <p>Loading...</p>
    </div>
  );
};

export default Spinner;
