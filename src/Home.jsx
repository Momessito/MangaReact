import './App.css';
import './media.css';
import SideMenu from './components/sideMenu';
import Nav from './components/nav';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import List from './components/api';
import Top from './components/carroseu';
import Top2 from './components/Top';
import Footer from './components/Footer';
import MyGallery from './components/carros';
import Categories from './components/dragCat';
import UltimosLidos from './components/UltimosLidos';
import HomeDownloads from './components/HomeDownloads';
import ContinueReading from './components/ContinueReading';
import { Link } from 'react-router-dom';

function Home() {
  const [showMore1, setShowMore1] = useState(false);
  const [showMore2, setShowMore2] = useState(false);

  const toggleMore1 = () => {
    setShowMore1(!showMore1);
    if (!showMore1) {
      document.documentElement.scrollTop = 0;
    }
  };

  const toggleMore2 = () => {
    setShowMore2(!showMore2);
    if (!showMore2) {
      document.documentElement.scrollTop = 0;
    }
  };

  const totop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  const animation1Style = {
    animation: showMore1 ? 'scale-in-ver-top 0.1s cubic-bezier(0.250, 0.460, 0.450, 0.940) both' : 'scale-in-ver-bottom2 0.1s cubic-bezier(0.250, 0.460, 0.450, 0.940) both'
  };

  const animation2Style = {
    animation: showMore2 ? 'scale-in-ver-top 0.1s cubic-bezier(0.250, 0.460, 0.450, 0.940) both' : 'scale-in-ver-bottom2 0.1s cubic-bezier(0.250, 0.460, 0.450, 0.940) both'
  };

  return (
    <div className="App">
      {/* Scroll to top button */}
      <div className='BackTope' onClick={totop} style={{
        position: 'fixed', bottom: '20px', right: '20px',
        backgroundColor: 'var(--color6)', padding: '10px',
        borderRadius: '50%', cursor: 'pointer', zIndex: 1000,
        boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
        border: '1px solid var(--color4)',
      }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="var(--color5)" className="bi bi-arrow-up" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z" />
        </svg>
      </div>

      <div className='Black'></div>

      {/* 1. NAVBAR */}
      <SideMenu />
      <Nav />

      {/* 2. HERO CAROUSEL */}
      <div className='carro'>
        <MyGallery />
      </div>

      {/* 3. CONTINUE READING (compact, 1 line) */}
      <ContinueReading />

      {/* 4. DOWNLOADS OFFLINE (compact row) */}
      <HomeDownloads />

      {/* 5. ÚLTIMOS LIDOS (horizontal scroll in a glass card) */}
      <UltimosLidos />

      {/* 6. MAIN TWO-COLUMN LAYOUT: Últimos Mangás + Populares */}
      <div className='all'>
        <div className='all2' id='down-animation1' style={animation1Style}>
          <List isExpanded={showMore1} />
          <button id='carregar' className='carregar-mais' onClick={toggleMore1}>
            {showMore1 ? 'Carregar Menos' : 'Carregar Mais'}
          </button>
        </div>
        <div className='all2' id='down-animation2' style={animation2Style}>
          <div className='Top'>
            <div className="Last3">
              <Link to={'/Populares'}><h1>Populares</h1> </Link>
            </div>
            <Top />
          </div>

          <Top2 isExpanded={showMore2} />
          <button id='carregarb' className='carregar-mais' onClick={toggleMore2}>
            {showMore2 ? 'Carregar Menos' : 'Carregar Mais'}
          </button>
        </div>
      </div>

      {/* 7. FAVORITOS (collapsible) */}
      <Categories />

      {/* 8. FOOTER */}
      <Footer />
    </div>
  );
}

export default Home;
