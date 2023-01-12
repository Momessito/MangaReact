import './App.css';
import './media.css';
import { BrowserRouter as Router, Routes,Route} from 'react-router-dom'

import Home from './Home'
import Login from './Login'
import Manga from './MangaPage'
import Chapters from './Chapters';
import Config from './Config';
import Favoritos from './Favoritos';

function App() {
  

return(
  // rotas
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/chapter/:id" element={<Manga />} />
      <Route path='/manga/:id' element={<Chapters />} />
      <Route path='/config' element={<Config />} />
      <Route path='/favoritos' element={<Favoritos />} />
    </Routes>
  </Router>
)
}


export default App;
