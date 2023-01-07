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

    const getposts = async () => {
        try {
            const response = await axios.get(
                "https://q4l8x4.deta.dev/pages/" + location2

            );


            const data = response.data.images;
            const prox = response.data.next_chapter.release_id

            setposts(data)
            setnext(prox)
        } catch (Error) {
            console.log(Error)
        }

    }



    useEffect(() => {
        getposts();
    }, []);
    let size
    function load() {
        var size = document.getElementById('sizeT')

        size.innerHTML = '30%'
        size = size.innerHTML
    }
    function big() {
        alert('foi')
        var size = document.getElementById('sizeT')
        var page = document.getElementById('PageManga').style.width
        page = page + '10%'
    }
    function small() {

    }
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
                <div className='Size'>
                    <svg xmlns="http://www.w3.org/2000/svg" onClick={small} width="32" height="32" fill="currentColor" class="bi bi-caret-left" viewBox="0 0 16 16">
                        <path d="M10 12.796V3.204L4.519 8 10 12.796zm-.659.753-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753z" />
                    </svg>
                    <h5 id='sizeT'>Size</h5>
                    <svg xmlns="http://www.w3.org/2000/svg" onClick={big} width="32" height="32" fill="currentColor" class="bi bi-caret-right" viewBox="0 0 16 16">
                        <path d="M6 12.796V3.204L11.481 8 6 12.796zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z" />
                    </svg>
                </div>
                {posts.length === 0 ? <p id='load'>Carregando</p> : (
                    posts.map((post) => (
                        <img src={post.avif} key={post.avif} onLoad={load} alt='NaN' className='PageManga' id='PageManga' />
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