import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import BreweryDetail from './components/BreweryDetail';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/brewery/:id" element={<BreweryDetail />} />
      </Routes>
    </div>
  );
};

export default App;
