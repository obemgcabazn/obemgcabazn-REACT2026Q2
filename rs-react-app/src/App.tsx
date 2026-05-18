import { Header } from './components/Header.tsx';
import { Routes, Route } from 'react-router';
import PokemonPage from './components/PokemonPage.tsx';
import About from './components/About.tsx';
import { NotFound } from './components/NotFound.tsx';

const App = () => {
  return (
    <>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<PokemonPage />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
