import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import Nav from './components/nav';
import SideMenu from './components/sideMenu';

const Chapters = () => {
    const location = useLocation();
    const location2 = location.pathname.substring(7)
    var istrue = true

    const [posts, setposts] = useState([]);
    const baseUrl = "https://q4l8x4.deta.dev/";

    async function getChapters(id, page) {
        const url = `${baseUrl}chapters/${id}/${page}`;

        try {
            const response = await axios.get(url);
            return response.data;
        } catch (err) {
            console.log(err);
        }
    }

    const getposts = async () => {
        try {
            let result = [];
            for (let page = 1; ; page++) {
                let chapters = await getChapters(location2, page);
                if (chapters.length > 0) {
                    result = result.concat(chapters);
                    continue;
                }
                break;
            }
            setposts(result);
        } catch (err) {
            console.error(err);
        }
    }
    useEffect(() => {
        getposts();
    }, []);

    //Image 

    const [img, setimg] = useState([]);

    const getimg = async () => {
        try {
            const url = `${baseUrl}manga/${location2}`
            const response = await axios.get(url);

            const data = response.data;
            console.log(response)

            setimg(data)
        } catch (Error) {
            console.log(Error)
        }
    }
    useEffect(() => {
        getimg();
    }, []);


    return (

        <div>
            <SideMenu />

            <Nav />
            <div className='Black'></div>

            <div className='chapter-visual'>
                <img width='300px' src={img.image} alt={img.id} />
                <div>
                    <h1>{img.title}</h1>
                    <h2>Autor: {img.author}</h2>
                    <h4>Descrição: {img.description}</h4>
                </div>
            </div>
            <div className="Filter">
                <div className='' >
                    <svg onClick={descer} xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="filterDown bi bi-arrow-down-up" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5zm-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5z" />
                    </svg>
                </div>
                <div className='filterI'><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
</svg><input value='' placeholder='Pesquisar...'/>
                </div>

            </div>
            <div className='flexC' id='flexC'>

                {posts.length === 0 ? <p id='load'>Carregando</p> : (
                    posts.map((post) => (
                        <Link to={'/chapter/' + post.release_id} key={post.release_id}>
                            <div className='ChaptersCard' id='ChaptersCard'>
                                <h2>{post.name}</h2>
                                <h4>{post.number} {post.chapter_name}</h4>
                                <small>{post.date}</small>
                            </div>
                            <div className='wr2'></div>
                        </Link>
                    )))}
            </div>
        </div>
    )

    function descer() {
        if (istrue === true) {
            document.getElementById('flexC').style.flexDirection = 'column-reverse'
            document.getElementById('flexC').style.animation = 'scale-in-ver-bottom 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both'
            istrue = false
        } else {
            document.getElementById('flexC').style.flexDirection = 'column'
            document.getElementById('flexC').style.animation = 'scale-in-bottom 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both'
            istrue = true
        }
    }
}

export default Chapters;