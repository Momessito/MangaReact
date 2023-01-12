import Nav from './components/nav';
import SideMenu from './components/sideMenu';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Mangas from './backend/mangas';
import './bg.css'


function Favoritos() {
    
    const [items, setitems] = useState([]);
  

    const getItems = async () => {
      try {
  
        const data = await Mangas.getFavorites();
        setitems(data)
      } catch (Error) {
        console.log(Error)
      }
    }

    useEffect(() => {
        getItems();
      }, []);

    return(
        <div className='app'>
            <SideMenu />
            <Nav />
            <div className='Black'></div>
<div className='favoritos'>
            {items == null ||items.length == 0 ?         
    <div className='categories2'>Nenhum Manga Adicionado... <img src="https://64.media.tumblr.com/5e3b8ef08a53e3c054717129e345db59/d68a5dee2d650b34-9c/s400x600/875f3686901573006d0c0e984a0430634680498d.jpg" /> </div> : (
      items.map((post) => (
        <div className='categories' key={post.id}>
          <Link to={'/mangas/' + post.id}>
            <img src={post.image} className='carroselImg' alt={post.id} />
            <h6 className='bottom-title'>{post.title}</h6>
            <h6 className='bottom-author'>{post.chapters_count}</h6>
            <h6 className='bottom-author'>{post.author}</h6>
          </Link>
        </div>
      )))}
      </div>
        </div>
    )
}

export default Favoritos