import React, { useEffect, useState } from 'react'
import ScrollContainer from 'react-indiana-drag-scroll'
import { Link } from 'react-router-dom';
import Mangas from '../backend/mangas';

function Categories() {
  const [items, setitems] = useState([]);
  

  const getItems = async () => {
    try {

      const datae = await Mangas.getFavorites();
      setitems(datae)
    } catch (Error) {
      console.log(Error)
    }
  }

  useEffect(() => {
    getItems();
  }, []);

  var istrue = true
  function minimize(){
    if(istrue === true){
      document.querySelector('.scrollH2').style.display = 'none'
      document.querySelector('.scrollH').style.height = '40px'
      document.querySelector('.scrollH').style.padding = '0'
      document.querySelector('.scrollH').style.paddingLeft = '10px'
      document.getElementById('minimize').style.rotate = '180deg'
      istrue = false
    }else{
      document.querySelector('.scrollH2').style.display = 'flex'
      document.querySelector('.scrollH').style.height = '300px'
      document.querySelector('.scrollH').style.padding = '10px'
      document.querySelector('.scrollH').style.paddingTop = '40px'
      document.getElementById('minimize').style.rotate = '0deg'
      istrue = true
    }
  }

  function newChapter(){
  }

  return (<ScrollContainer className="scroll-container scrollH">
    <svg onClick={minimize} id='minimize' xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="white" className="bi bi-arrow-up-short" viewBox="0 0 16 16">
      <path fillRule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z" />
    </svg>
    <div className='textScroll'><Link to={'/favoritos'}>Favoritos</Link></div>
    <div className='scrollH2'>
    {items == null ||items.length == 0 ?         
    <div className='categories2'>Nenhum Manga Adicionado... <img src="https://64.media.tumblr.com/5e3b8ef08a53e3c054717129e345db59/d68a5dee2d650b34-9c/s400x600/875f3686901573006d0c0e984a0430634680498d.jpg" /> </div> : (
      items.map((post) => (
        <div className='categories' key={post.id} onLoad={newChapter}>
          <Link to={'/mangas/' + post.id}>
            <img src={post.image} className='carroselImg' alt={post.id} />
            <h6 className='bottom-title'>{post.title}</h6>
            <h6 className='bottom-author'>{post.author}</h6>
          </Link>
        </div>
      )))}
      </div>
  </ScrollContainer>)

}

export default Categories