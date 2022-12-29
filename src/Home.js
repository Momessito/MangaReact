import './App.css';
import './media.css';
import SideMenu from './components/sideMenu';
import Nav from './components/nav';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Categories from './components/dragCat';
import List from './components/api';
import MostReaded from './apitest';
import Top from './components/carroseu';
import Top2 from './components/Top';
import Footer from './components/Footer';
import MyGallery from './components/carros';

function Home() {
  var isH = false

  return (

    <div className="App">
      <div className='BackTope' onClick={totop}>
        <svg className='Totop' xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-arrow-down-right" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M14 13.5a.5.5 0 0 1-.5.5h-6a.5.5 0 0 1 0-1h4.793L2.146 2.854a.5.5 0 1 1 .708-.708L13 12.293V7.5a.5.5 0 0 1 1 0v6z"/>
</svg>
</div>
      <div className='Black'></div>

      <SideMenu />
      <Nav />
<div className='carro'>
<MyGallery />
<div className='ScrollTexts'>Categorias</div>
<Categories /> 
</div>
      <div className='all'>
        <div className='all2'>
          <List />
          <button id='carregar' onClick={carregar}>Carregar Mais</button>
        </div>
        <div className='all2'>
          <MostReaded />
          <button id='carregard' onClick={carregar2}>Carregar Mais</button>
          <div className='Top'>
            <h1>Mais lidos da semana</h1>
          <Top/>

          </div>
          <Top2 />
          <button id='carregarb' onClick={carregar3}>Carregar Mais</button>
        </div>
      </div>
      <div>
      </div>

      <Footer/>

    </div>
  );

  function carregar() {
    var background = document.getElementById('Container');
    var button = document.getElementById('carregar')

    if (isH === false) {
      isH = true
      background.style.height = 'auto'
      button.innerText = 'Carregar Menos'
    } else {
      isH = false
      background.style.height = '200vh'
      button.innerText = 'Carregar Mais'

    }
  }

  function carregar2() {
    var background = document.getElementById('Container2');
    var button = document.getElementById('carregard')

    if (isH === false) {
      isH = true
      background.style.height = 'auto'
      button.innerText = 'Carregar Menos'
    } else {
      isH = false
      background.style.height = '50vh'
      button.innerText = 'Carregar Mais'

    }
  }
  function carregar3() {
    var background = document.getElementById('Container3');
    var button = document.getElementById('carregarb')

    if (isH === false) {
      isH = true
      background.style.height = 'auto'
      button.innerText = 'Carregar Menos'
    } else {
      isH = false
      background.style.height = '73vh'
      button.innerText = 'Carregar Mais'

    }
  }
  function totop(){
    document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  }
}


export default Home;
