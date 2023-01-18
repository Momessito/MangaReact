import Nav from './components/nav';
import SideMenu from './components/sideMenu';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Mangas from './backend/mangas';
import './bg.css'


function Recentes() {

    const [posts, setposts] = useState([]);

    const getposts = async () => {
        try {
            const data = await Mangas.getRecents();
            setposts(data)
            console.log(data)
        } catch (Error) {
            console.log(Error)
        }
    }

    useEffect(() => {
        getposts();
    }, []);

  return (
    <div className='app'>
      <SideMenu />
      <Nav />
      <div className='Black'></div>
      <h1 style={{color: 'white',width: '100%',borderBottom: '3px solid white', paddingBottom: '15px'}}>Ultimos mangas Atualizados</h1>
      {posts.length === 0 ?
            <p>Carregando</p> : (
                posts.map((post) => (
                    <div key={post.id} className='itemCR' style={{width: '100% !important'}}>
                        <Link to={'/mangas/' + post.id} >
                            <div className="img-hover-rec">
                            <img alt='logo' src={post.image} id='imagemca' />
                            <button data-text="Awesome" class="button">
    <span class="actual-text">&nbsp;Ler Agora&nbsp;</span>
    <span class="hover-text" aria-hidden="true">&nbsp;Ler Agora&nbsp;</span>
</button>

                            </div>

                            <div className="recentes" id="">
                                <h3>{post.title}</h3>
                                <h4>{post.author}</h4>
                                <h6 className="" href='home'>Cap: {post.chapters_count}</h6>
                                <p className='descr'>{post.description}</p>
                                <div className="">
                                    <div className="cat" id="cat" >
                                        <p className="at" href='home'><span role="img" aria-label=''>⭐{post.score}</span> </p>
                                        {post.categories.map((category) => (
                                            <h5 id='categories' key={category}>{category}</h5>))}
                                    </div></div>
                            </div>
                        </Link>

                    </div>
                )))}
    </div>
  )
}

export default Recentes