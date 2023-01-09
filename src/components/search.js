import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


const Search = () => {
    const [title, setTitle] = useState('')
    var nome = title.toString()
    var url = "https://q4l8x4.deta.dev/search/?q=" + nome

    
    const [posts, setPosts] = useState([]);

    const getPosts = async () => {
      try {
        const response = await axios.get(
          url
        );
  
  

        const data = response.data;
  
        setPosts(data)
      } catch (Error) {
      }
    }
    



  return <div>
     <div>
  <svg id='search' onClick={ativar} xmlns="http://www.w3.org/2000/svg" height="45px" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
      </svg>
      <div id='Bigsearch'>
      <svg xmlns="http://www.w3.org/2000/svg" height="20px" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
      </svg>
          <input placeholder='O que voce procura?' autoComplete="off"  id="textoInput" 
          onChange={event => setTitle(event.target.value)}
          value={title}
          onKeyPress={getPosts}
        name="message"/>
      </div>
      <div className='Black2'></div>
      <div className='Black3'></div>

      </div>

<div className='titleCanvas' id="titleCanvas">
      {posts === false ? <div><img  src="https://icon-library.com/images/sad-face-icon-png/sad-face-icon-png-6.jpg" id="error" alt="NaN"/> <br /> <h1>Nenhum manga encontrado</h1></div> : (
    posts.map((search) => (
<Link reloadDocument key={search.id_serie} to={'/manga/'+search.id_serie} >
      <div  className='titleCanvasX'>
               <img src={search.cover_thumb} alt={search.name} />
               <div className="Texts">
        <h1>{search.name}</h1>
        <h2>{search.author}</h2>
        <h3>Score: {search.score}⭐</h3>
        <h4> {search.description}</h4>
            </div>
            </div>
            </Link>
    )
    )
    
  )

  }
</div>

</div>


function ativar(){
    document.getElementById('Bigsearch').style.display = 'flex'
    document.getElementById('titleCanvas').style.visibility = 'visible'
    document.getElementById('Bigsearch').style.width = 'auto'
    var search = document.getElementById('Bigsearch')
    var canvas = document.getElementById('titleCanvas')
    var black = document.querySelector('.Black2')
    black.style.backgroundColor = 'rgba(0, 0, 0, 0.288)'
    black.style.visibility = 'visible'



      black.addEventListener('mouseover',function(){
        search.style.width = 'auto'
        canvas.style.visibility = 'hidden'
        black.style.visibility = 'hidden'
        black.style.backgroundColor = 'rgba(0, 0, 0, 0)'
        search.style.display = 'none'
    })
}



}






export default Search