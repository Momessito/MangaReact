import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Mangas from "../backend/mangas";

const List = () => {

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
        <div className="Container" id="Container">
            <div className="Last">            <h1>Últimos Mangás adicionados</h1> 
            <div className="Last2">Hoje</div>
            </div>


            {posts.length === 0 ?
            <p>Carregando</p> : (
                posts.map((post) => (

                    <div onLoad={categorias} key={post.id} className='itemC'>
                        <Link to={'/mangas/' + post.id} key={post.id} >
                            <div className="img-hover">
                            <img alt='logo' src={post.image} id='imagemca' />
                            </div>

                            <div className="textsC" id="textsC">
                                <h3>{post.title}</h3>
                                <h4>{post.author}</h4>
                                <h6 className="cap" href='home'>Cap: {post.chapters_count}</h6>
                                <div className="config">
                                    <div className="cat" id="cat" >
                                        <p className="at" href='home'><span role="img" aria-label=''>⭐{post.score}</span> </p>
                                        {post.categories.map((category) => (
                                            <h5 id='categories'>{category}</h5>))}
                                    </div></div>
                            </div>

                        </Link>

                    </div>
                )))}

        </div>
    )

    function categorias(prop) {
        var a = prop.target.parentElement.parentElement.getElementsByTagName('div')[3].getElementsByTagName('h5')[0]
        var b = prop.target.parentElement.parentElement.getElementsByTagName('div')[3].getElementsByTagName('h5')[1]
        var c = prop.target.parentElement.parentElement.getElementsByTagName('div')[3].getElementsByTagName('h5')[2]
        if (a.innerHTML === 'Hentai' || a.innerHTML === 'Ecchi' || b.innerHTML === 'Hentai' || b.innerHTML === 'Ecchi' || c.innerHTML === 'Hentai' || c.innerHTML === 'Ecchi') {
            prop.target.style.filter = 'blur(4px)'

        }
    }


}

export default List;



