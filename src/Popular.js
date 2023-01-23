import Nav from './components/nav';
import SideMenu from './components/sideMenu';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Mangas from './backend/mangas';
import './bg.css'
import axios from 'axios';


function Popular() {

    const [posts, setposts] = useState([]);

    const getposts = async () => {
        try {
            const response = await axios.get(
                "https://q4l8x4.deta.dev/mostread/week"
              );
        
        
        
              const data = response.data;
        
              setposts(data)
        } catch (Error) {
            console.log(Error)
        }
    }

    useEffect(() => {
        getposts();
    }, []);

  return (
    <div className='appRecents'>
      <SideMenu />
      <Nav />
      <div className='Black'></div>
      <h1 className='RecentsTitle' style={{color: 'white',width: '100%',borderBottom: '3px solid white', paddingBottom: '15px'}}>Ultimos mangas Atualizados</h1>
      {posts.length === 0 ?
            <p>Carregando</p> : (
                posts.map((post) => (
                    <div key={post.id} className=''>
                        <Link to={'/mangas/' + post.id} >
                            <div className="RecentsCard">
                                <div className='RecentsImage'>
                            <img alt='logo' src={post.image} id='imagemca' />
                    </div>
                            <h2 className='RecentsChap'>Cap {post.chapters_count}</h2>

                            <div className="RecentsDesc" id="">
                                <h3>{post.title}</h3>
                                <p className='descr'>{post.description}</p>

                                <div className="RatingRecents">
                                        <h5 className="" href='home'><span role="img" aria-label=''>⭐{post.score}</span> </h5>

                                        {post.categories.map((category) => (
                                        <h5 id='' key={category}>{category}</h5>))}
                                    </div>
                            </div>
                            </div>
                        </Link>

                    </div>
                )))}
    </div>
  )
}

export default Popular