import './App.css';
import './media.css';
import SideMenu from './components/sideMenu';
import Nav from './components/nav';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Manga() {
    const location = useLocation();
    const location2 = location.pathname.substring(9)

    const [posts, setposts] = useState([]);
    const [next, setnext] = useState([]);
    const [chap, setchap] = useState([]);

    const getposts = async () => {
        try {
            const response = await axios.get(
                "https://q4l8x4.deta.dev/pages/" + location2

            );

            const chap = response.data
            const data = response.data.images;
            const prox = response.data.next_chapter.release_id

            setposts(data)
            setnext(prox)
            setchap(chap)
        } catch (Error) {
            console.log(Error)
        }

    }


    useEffect(() => {
        getposts();
    }, []);

    return (
        <div>

            <div className='Black'></div>

            <SideMenu />
            <Nav />
            <div className='BackTope' onClick={totop}>
                <svg className='Totop bi bi-arrow-down-right' xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M14 13.5a.5.5 0 0 1-.5.5h-6a.5.5 0 0 1 0-1h4.793L2.146 2.854a.5.5 0 1 1 .708-.708L13 12.293V7.5a.5.5 0 0 1 1 0v6z" />
                </svg>
            </div>
            <div className='mainManga'>
                <h1 id='Title'>Capitulo: {chap.chapter_number}</h1>
                {posts.length === 0 ? <p id='load'>Carregando</p> : (
                    posts.map((post) => (
                        <img src={post.legacy} key={post.avif} alt='NaN' className='PageManga' id='PageManga' />
                    )))}
                <button className='btne'><Link reloadDocument to={'/chapter/' + next}>Proximo capitulo</Link></button>
                <div id="disqus_thread"></div>
            </div>


        </div>

    )
    function totop() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
}



export default Manga;