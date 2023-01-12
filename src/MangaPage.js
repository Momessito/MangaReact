import './App.css';
import './media.css';
import SideMenu from './components/sideMenu';
import NavRead from './components/navRead';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import Footer from './components/Footer';
import Mangas from './backend/mangas';

function Manga() {
    const location2 = window.location.pathname.split("/")[4];
    const location = window.location.pathname.split("/")[2];



    var istrue = true
    const [posts, setposts] = useState([]);
    const [chapi, setchapi] = useState([]);

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


    const getChapters = async () => {
        try {
            let result = [];
            for (let page = 1; ; page++) {
                let chapters = await Mangas.getChapters(location, page);
                if (chapters.length > 0) {
                    result = result.concat(chapters);
                    setchapi(result);
                    continue;
                }
                break;
            }
        } catch (err) {
            console.error(err);
        }
    }
    useEffect(() => {
        getChapters();
    }, []);


    useEffect(() => {
        getposts();
    }, []);




    return (
        <div>

            <div className='Black'></div>

            <SideMenu />
            <NavRead />
            <div className='BackTope' onClick={totop}>
                <svg className='Totop bi bi-arrow-down-right' xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M14 13.5a.5.5 0 0 1-.5.5h-6a.5.5 0 0 1 0-1h4.793L2.146 2.854a.5.5 0 1 1 .708-.708L13 12.293V7.5a.5.5 0 0 1 1 0v6z" />
                </svg>
            </div>
            <div className='mainManga' onLoad={last}>
                <div className='flex'>


                    <h1 id='Title'>Capitulo: {chap.chapter_number}</h1>














                    <div className='fullscreen' onClick={aumentar}>
                        <div id='fullscreen1'>                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" className="bi bi-fullscreen" viewBox="0 0 16 16">
                            <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z" />
                        </svg></div>

                        <div id='fullscreen2'>      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" className="bi bi-fullscreen-exit" viewBox="0 0 16 16">
                            <path d="M5.5 0a.5.5 0 0 1 .5.5v4A1.5 1.5 0 0 1 4.5 6h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5zm5 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 10 4.5v-4a.5.5 0 0 1 .5-.5zM0 10.5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 6 11.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zm10 1a1.5 1.5 0 0 1 1.5-1.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4z" />
                        </svg></div></div>

                </div>
                {posts.length === 0 ? <p id='load'>Carregando</p> : (
                    posts.map((post) => (
                        <img src={post.avif} key={post.legacy} alt='NaN' className='PageManga' id='PageManga' />
                    )))}
                <button className='btne' id='btne'><Link reloadDocument to={'/chapter/' + next}>Proximo capitulo</Link></button>
                <div id="disqus_thread"></div>
            </div>

            <Footer />
        </div>

    )

    function last() {
        if(next == ''){
            document.getElementById('btne').innerHTML = 'Ultimo Capitulo!'
            document.getElementById("btne").disabled = true;
        }
    }

    function aumentar() {
        if (istrue === true) {
            var page = document.getElementsByTagName('img')
            for (let index = 2; index < page.length; index++) {
                var page2 = document.getElementsByTagName('img')[index];
                console.log(page2);
                page2.style.width = '70%';
            }
            document.getElementById('fullscreen1').style.opacity = '0'
            document.getElementById('fullscreen2').style.opacity = '1'

            istrue = false


        } else if (istrue === false) {
            var page4 = document.getElementsByTagName('img')
            for (let index = 2; index < page4.length; index++) {
                var page3 = document.getElementsByTagName('img')[index];
                console.log(page3);
                page3.style.width = '30%';
            }
            document.getElementById('fullscreen1').style.opacity = '1'
            document.getElementById('fullscreen2').style.opacity = '0'
            istrue = true
        }
    }
    function totop() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
}



export default Manga;