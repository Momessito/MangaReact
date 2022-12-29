import Search from './search';
import Burgers from './burger';
import '../App.css';
import '../media.css';
import React from "react"
import Logo from '../Logo.png'
import { Link } from 'react-router-dom';

function Nav(){
return(
    <div>
    <nav className='nav1'>
    <div className='Logo'>
      <img src='https://images.vexels.com/media/users/3/157555/isolated/preview/2b48b29abd18febe3b1f92a85913ce39-icone-de-livro-simples.png' alt='Logo' height='30px' />
    </div>
    <Link to="/"><img className='logo-img' src={Logo}/></Link>
    <div className='texts3'>
      <h2 className='a' >Mangás</h2>
      <h2 className='a' >Categorias</h2>
      <h2 className='a' >Comunidade</h2>
    </div>
    <Search />
   <Link to='/Login'> <svg id='Login' xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-person-fill-down" viewBox="0 0 16 16">
  <path d="M12.5 9a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Zm.354 5.854 1.5-1.5a.5.5 0 0 0-.708-.708l-.646.647V10.5a.5.5 0 0 0-1 0v2.793l-.646-.647a.5.5 0 0 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0ZM11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
  <path d="M2 13c0 1 1 1 1 1h5.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.544-3.393C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4Z"/>
</svg></Link>
    <Burgers />
  </nav>
  <div style={{width : '100%',height : '60px'}}></div>
  <nav id='nav2'>
    <h2 onClick={function descer1(){    document.body.scrollTop = 0;
  document.documentElement.scrollTop =0;}}>Destaques</h2>
    <div className='wr' ></div>
    <h2 onClick={function descer2(){    document.body.scrollTop = 2000;
  document.documentElement.scrollTop =1200;}}>Mais Lidos Da Semana</h2>
    <div className='wr'></div>
    <h2 onClick={function descer2(){    document.body.scrollTop = 2000;
  document.documentElement.scrollTop =700;}}>Mangas mais lidos</h2>
    <div className='wr'></div>
    <h2 onClick={function descer2(){    document.body.scrollTop = 2000;
  document.documentElement.scrollTop =500;}}>Recém adicionados</h2>
    <div className='wr'></div>
    <h2 onClick={function descer2(){    document.body.scrollTop = 2000;
  document.documentElement.scrollTop =2000;}}>Bem avaliados</h2>
  </nav>
  </div>
)

function slider(){


}}

export default Nav