import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Nav from './components/nav';
import SideMenu from './components/sideMenu';
import Mangas from './backend/mangas';
import User from './backend/users';
import Footer from './components/Footer';

const Chapters = () => {
    const location = useLocation();
    const mangaId = window.location.pathname.split("/")[2];
    var istrue = true

    const [posts, setposts] = useState([]);
    const [resultArray, setResultArray] = useState([]);

    const getposts = async () => {
        try {
            let result = [];
            for (let page = 1; ; page++) {
                const response = await Mangas.getChapters(mangaId, page);
                const chapters = response.data.chapters;
                if (chapters.length > 0) {
                    result = result.concat(chapters);
                    setposts(result);
                    continue;
                }
                break;
            }
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        getimg();
        getposts();
        lido();
    }, []);

    //Image 

    const [img, setimg] = useState([]);

    const getimg = async () => {
        const data = await Mangas.getMangaById(mangaId);
        setimg(data)

    }

    const favoritar = async () => {
        try {

            var title = document.getElementById('TitleManga').innerHTML;
            await User.addFavorite(title, mangaId)
            document.querySelector('.favo').style.display = 'flex';
            document.querySelector('.favo2').style.display = 'none';
        } catch (Error) {
            console.log(Error)
        }
    }
    var favo
    const isfavor = async () => {
        try {
            favo = await User.isFavorited(mangaId)

            if (favo != null) {
                
                document.querySelector('.favo').style.display = 'flex';
                document.querySelector('.favo2').style.display = 'none';

            } else {
                document.querySelector('.favo').style.display = 'none';
                document.querySelector('.favo2').style.display = 'flex';
            }
            return favo
        } catch (Error) {
            console.log(Error)
        }
    }

    const removerfav = async () => {
        try {
            var sample2 = await isfavor();
            var deletar = await User.removeFavorite(sample2)
            document.querySelector('.favo').style.display = 'none';
            document.querySelector('.favo2').style.display = 'flex';
            console.log(deletar);

        } catch (Error) {
            console.log(Error)
        }
    }
    


    const lido = async () => {

        try {
            var ret = await User.listMangaRead(mangaId)
            var retd = ret.data
            return retd
            
        } catch (Error) {
            console.log(Error)
        }
        
    }

    const checkRead = async () => {
        try {
            let data = await lido()
            let history = data
            
            var chap = document.getElementById('flexC').childNodes
            for (let i = 0; i < chap.length; i++) {
                const element2 = chap[i];
                console.log(element2)
                
                for (let index = 0; index < history.count; index++) {
                    const element = history.items[index].cap_id;     
    
    
                }
            }

        } catch (error) {
            
        }
    }

    return (

        <div>
            <SideMenu />
            <Nav />
            <div className='Black'></div>
            <div className='allchapters'>
                <div className='chapter-visual' onLoad={isfavor}>
                    <img width='300px' src={img.image} alt={img.id} />
                    <div className='favo' onClick={removerfav}>Remover
                        <svg id='favosvg2' xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star-fill" viewBox="0 0 16 16">
                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                        </svg>
                    </div>
                    <div className='favo2' onClick={favoritar}>Favoritar

                        <svg id='favosvg1' xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star" viewBox="0 0 16 16">
                            <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
                        </svg>
                    </div>

                    <div className='info'>
                        <h1 id='TitleManga'>{img.title}</h1>
                        <h2>Autor: {img.author}</h2>
                        <h3 className='score'>Nota: {img.score}⭐</h3>
                        <h4>Descrição: {img.description}</h4>
                    </div>
                </div>
                <div className="Filter">
                    <div className=''>
                        <svg onClick={descer} xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="var(--color2)" className="filterDown bi bi-arrow-down-up" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5zm-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5z" />
                        </svg>
                    </div>
                    <div className='filterI'><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="var(--color2)" className="bi bi-search" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                    </svg><input placeholder='Pesquisar...' id='pesquisa' onKeyUp={pesquisar}/>
                    </div>

                </div>
                <div className='flexC' id='flexC'>

                    {posts.length === 0 ? <p id='load'>Carregando</p> : (
                        posts.map((post) => (
                            <Link to={'/mangas/'+mangaId+'/capitulos/' + post.release_id}  key={post.release_id}>
                                <h1 style={{display: 'none'}} >{post.release_id}</h1>
                                <div className='ChaptersCard' id='ChaptersCard'>
                                    <h4 id='capit'><span>Capitulo: </span>{post.number} {post.chapter_name}</h4>
                                    
                                    <small>{post.date}</small>
                                </div>
                                <div className='wr2'></div>
                            </Link>
                        )))}
                </div>
            </div>
            <Footer />
        </div>
    )
    


    function pesquisar() {

      }


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