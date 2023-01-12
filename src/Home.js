import './App.css';
import './media.css';
import SideMenu from './components/sideMenu';
import Nav from './components/nav';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import List from './components/api';
import Top from './components/carroseu';
import Top2 from './components/Top';
import Footer from './components/Footer';
import MyGallery from './components/carros';
import Categories from './components/dragCat';
import Mangas from './backend/mangas';
import {Adsense} from '@ctrl/react-adsense';

function Home() {
  var isH = false


  const getposts = async () => {
    try {
      const data = await Mangas.getMangaById('1');
    } catch (Error) {
      console.log(Error)
    }
  }
  getposts()


  return (

    <div className="App">
      <div className='BackTope' onClick={totop}>
        <svg className='Totop bi bi-arrow-down-right' xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M14 13.5a.5.5 0 0 1-.5.5h-6a.5.5 0 0 1 0-1h4.793L2.146 2.854a.5.5 0 1 1 .708-.708L13 12.293V7.5a.5.5 0 0 1 1 0v6z" />
        </svg>
      </div>
      <div className='Black'></div>

      <SideMenu />
      <Nav />
      <nav id='nav2'>
        <h2 onClick={function descer1() {
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
        }}>Destaques</h2>
        <div className='wr' ></div>
        <h2 onClick={function descer2() {
          document.body.scrollTop = 2000;
          document.documentElement.scrollTop = 1200;
        }}>Favoritos</h2>
        <div className='wr'></div>
        <h2 onClick={function descer2() {
          document.body.scrollTop = 2000;
          document.documentElement.scrollTop = 700;
        }}>Últimos adicionados</h2>
        <div className='wr'></div>
        <h2 onClick={function descer2() {
          document.body.scrollTop = 2000;
          document.documentElement.scrollTop = 500;
        }}>Populares</h2>
        <div className='wr'></div>
        <h2 onClick={function descer2() {
          document.body.scrollTop = 2000;
          document.documentElement.scrollTop = 2000;
        }}>Mais Lidos</h2>
      </nav>
      <div className='carro'>
        <MyGallery />
      </div>
      <Categories />

      <div className='all'>
        <div className='all2' id='down-animation1'>
          <List />
          <button id='carregar' className='carregar-mais' onClick={carregar}>Carregar Mais</button>
        </div>
        <div className='all2' id='down-animation2'>
          <div className='Top'>
          <div className="Last3">            <h1>Populares</h1> 
            </div>
            <Top />

          </div>
          <Adsense
  client="ca-pub-3330889871238840"
  slot="5815353327"
  style={{ display: 'block' , marginLeft: '40px'}}
  layout="in-article"
  format="fluid"
/>
          <Top2 />
          <button id='carregarb' className='carregar-mais' onClick={carregar3}>Carregar Mais</button>

        </div>
      </div>
      <div>
      </div>

      <Footer />

    </div>
  );

  function carregar() {
    var background = document.getElementById('Container');
    var button = document.getElementById('carregar')

    if (isH === false) {
      isH = true
      background.style.height = 'auto'
      document.documentElement.scrollTop = 0;
      document.getElementById('down-animation1').style.animation = 'scale-in-ver-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both'

      button.innerText = 'Carregar Menos'
    } else {
      isH = false
      background.style.height = '200vh'
      button.innerText = 'Carregar Mais'
      document.getElementById('down-animation1').style.animation = 'scale-in-ver-bottom2 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both'

    }
  }
  function carregar3() {
    var background = document.getElementById('Container3');
    var button = document.getElementById('carregarb')

    if (isH === false) {
      isH = true
      document.documentElement.scrollTop = 0;
      document.getElementById('down-animation2').style.animation = 'scale-in-ver-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both'
      background.style.height = 'auto'
      button.innerHTML = 'Carregar Menos'
    } else {
      isH = false
      document.getElementById('down-animation2').style.animation = 'scale-in-ver-bottom2 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both'
      background.style.height = '90vh'
      button.innerHTML = 'Carregar Mais'

    }
  }
  function totop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
}


export default Home;
