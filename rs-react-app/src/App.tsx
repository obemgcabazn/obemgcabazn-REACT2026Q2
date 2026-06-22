import { Header } from './components/Header.tsx';
import { Routes, Route } from 'react-router';
import PokemonPage from './components/PokemonPage.tsx';
import About from './components/About.tsx';
import { NotFound } from './app/not-found.tsx';
import { PokemonDetails } from './components/PokemonDetails.tsx';
import Footer from './components/footer.tsx';

const App = () => {
  return (
    <>
      <Header />
      <div className="container mb-5">
        <Routes>
          <Route path="/" element={<PokemonPage />}>
            <Route index element={<PokemonDetails />} />
          </Route>
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
