import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import Nav from './components/nav';
import SideMenu from './components/sideMenu';

const Chapters = () => {
    const location = useLocation();
    const location2 = location.pathname.substring(7)
    const number = 0
    const [posts, setposts] = useState([]);

    const getposts = async () => {
        try {
            const response = await axios.get(
                "https://q4l8x4.deta.dev/chapters/" + location2
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

    //Image 

    const [img, setimg] = useState([]);

    const getimg = async () => {
        try {
            const response = await axios.get(
                "https://q4l8x4.deta.dev/manga/" + location2
            );

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

    <div className='flexC'>
            {posts.length === 0 ? <p>Carregando</p> : (
                posts.map((post) => (
                    <Link to={'/chapter/' + post.release_id} key={post.release_id}>
                        <div className='ChaptersCard'>
                            <h2>{post.name}</h2>
                            <h4>{post.number} {post.chapter_name}</h4>
                            <small>{post.date}</small>
                        </div>
                        <div className='wr2'></div>
                    </Link>
                )))}
                </div>
                <button onClick={carregar} id='btn'>Carregar mais</button>
        </div>


    )

    function carregar(){
        getposts();
        number = 2
    }
}

export default Chapters;