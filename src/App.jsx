import './App.css';
import './media.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Home from './Home'
import Login from './Login'
import Manga from './MangaPage'
import Chapters from './Chapters';
import Config from './Config';
import Favoritos from './Favoritos';
import Recentes from './Recentes';
import MostRead from './MostRead';
import Popular from './Popular';

import Amigos from './Amigos';
import Chat from './Chat';
import Profile from './Profile';
import AccessGate from './components/AccessGate';

function App() {

  return (
    <AccessGate>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mangas/:id/capitulos/:chap" element={<Manga />} />
          <Route path='/mangas/:id' element={<Chapters />} />
          <Route path='/config' element={<Config />} />
          <Route path='/favoritos' element={<Favoritos />} />
          <Route path='/Recentes' element={<Recentes />} />
          <Route path='/Populares' element={<Popular />} />
          <Route path='/mais-lidos' element={<MostRead />} />
          <Route path='/amigos' element={<Amigos />} />
          <Route path='/chat/:id' element={<Chat />} />
          <Route path='/perfil/:id' element={<Profile />} />
        </Routes>
      </Router>
    </AccessGate>
  )
}


export default App;
