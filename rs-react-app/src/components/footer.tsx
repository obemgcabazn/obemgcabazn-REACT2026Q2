import './footer.scss';
import useStore from '../store/store.tsx';

const Footer = () => {
  const { selectedPokemons, clearPokemons } = useStore();
  return (
    selectedPokemons.length && (
      <footer className="footer">
        <div className="container">
          <div>
            Total selected pokemons: <span>{selectedPokemons.length}</span>
          </div>
          <button className="button__main" onClick={clearPokemons}>
            Unselect all
          </button>
          <button className="button__main">Download</button>
        </div>
      </footer>
    )
  );
};

export default Footer;
