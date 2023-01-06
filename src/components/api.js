import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';

const List = () => {

    const [posts, setposts] = useState([]);

    const getposts = async () => {
        try {
            const response = await axios.get(
                "https://q4l8x4.deta.dev/recent"
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
        <div className="Container" id="Container">
            <h1>Últimos Mangás adicionados</h1>

            {posts.length === 0 ? <p>Carregando</p> : (
                posts.map((post) => (

                    <div onLoad={categorias} key={post.id} className='itemC'>
                        <Link to={'/manga/'+post.id} key={post.id} >

                            <img alt='logo' src={post.image} id='imagemca' />
                            <div className="textsC" id="textsC">
                                <h3>{post.title}</h3>
                                <h4>{post.author}</h4>
                                <h6 className="cap" href='home'>Cap: {post.chapters_count}</h6>
                                <div className="config">
                                    <div className="cat" id="cat" >
                                        <p className="at" href='home'><span role="img" aria-label=''>⭐{post.score}</span> </p>
                                        <h5 id='categories'>{post.categories[1]}</h5>
                                        <h5 id='categories'>{post.categories[2]}</h5>
                                        <h5 id='categories'>{post.categories[3]}</h5>
                                    </div></div>
                            </div>

                        </Link>

                    </div>
                )))}

        </div>
    )

    function categorias(prop) {
        var a = prop.target.parentElement.getElementsByTagName('div')[0].getElementsByTagName('div')[0].getElementsByTagName('div')[0].getElementsByTagName('h5')[0]
        var b = prop.target.parentElement.getElementsByTagName('div')[0].getElementsByTagName('div')[0].getElementsByTagName('div')[0].getElementsByTagName('h5')[1]
        var c = prop.target.parentElement.getElementsByTagName('div')[0].getElementsByTagName('div')[0].getElementsByTagName('div')[0].getElementsByTagName('h5')[2]
        if (a.innerHTML === 'Hentai' || a.innerHTML === 'Ecchi' || b.innerHTML === 'Hentai' || b.innerHTML === 'Ecchi' || c.innerHTML === 'Hentai' || c.innerHTML === 'Ecchi') {
            prop.target.style.filter = 'blur(4px)'

        }
    }


}

export default List;



