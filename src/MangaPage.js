import './App.css';
import './media.css';
import SideMenu from './components/sideMenu';
import Nav from './components/nav';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from 'react-router-dom';



function Manga() {
    const location = useLocation();
    const location2 = location.pathname.substring(9)
    console.log(location2)

    const [posts, setposts] = useState([]);

    const getposts = async () => {
        try {
            const response = await axios.get(
                "https://q4l8x4.deta.dev/pages/" + location2
            );



            const data = response.data.images;
            setposts(data)
        } catch (Error) {
            console.log(Error)
        }
    }

    useEffect(() => {
        getposts();
    }, []);



    const [title, setTitle] = useState('')

    var url = "https://q4l8x4.deta.dev/search/?q=" + posts.name

    
    const [Image, setImage] = useState([]);

    const getImage = async () => {
      try {
        const response = await axios.get(
          url
        );
  
  

        const data = response.data;
  
        setImage(data)
      } catch (Error) {
      }
    }

    return (
        <div>

            <div className='Black'></div>

            <SideMenu />
            <Nav />
            <div className='mainManga'>


                {posts.length === 0 ? <p>Carregando</p> : (
                    posts.map((post) => (
                        <img src={post.avif} key={post.avif} alt='NaN' className='PageManga' />
                    )))}
                <div id="disqus_thread"></div>
            </div>


        </div>

    )
    function totop(){
    document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  }
}



export default Manga;