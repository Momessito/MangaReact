import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Nav from './components/nav';
import SideMenu from './components/sideMenu';
import Mangas from './backend/mangas';
import User from './backend/users';
import Footer from './components/Footer';
import ReviewModal from './components/ReviewModal';

const Chapters = () => {
    const location = useLocation();
    const mangaId = window.location.pathname.split("/")[2];
    var istrue = true

    const [posts, setposts] = useState([]);
    const [resultArray, setResultArray] = useState([]);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    const getposts = async () => {
        try {
            let result = [];
            // Just get the first massive batch (up to 100). Or handle proper pagination if needed.
            // MangaDex feed returns { data: [...chapters] }
            const response = await Mangas.getChapters(mangaId, 0);
            if (response && response.data) {
                setposts(response.data);
            }
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        getimg();
        getposts();
        isfavor();
    }, []);

    //Image 

    const [img, setimg] = useState([]);



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
            var deletar = await User.removeFavorite(mangaId)
            document.querySelector('.favo').style.display = 'none';
            document.querySelector('.favo2').style.display = 'flex';
            console.log(deletar);

        } catch (Error) {
            console.log(Error)
        }
    }


    const getimg = async () => {
        const data = await Mangas.getMangaById(mangaId);
        setimg(data)
    }


    return (

        <div>
            <SideMenu />
            <Nav />
            <div className='Black'></div>
            <div className='allchapters'>
                <div className='chapter-visual'>
                    <div>
                        <img src={img.image} alt={img.id} />

                    </div>



                    <div className='favo3' onClick={() => setIsReviewModalOpen(true)} style={{ marginLeft: '50%', backgroundColor: 'var(--color5)', color: 'white', border: '1px solid var(--color2)' }}>Avaliar Manga
                        <svg id='favosvg3' xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star-half" viewBox="0 0 16 16">
                            <path d="M5.354 5.119 7.538.792A.52.52 0 0 1 8 .5c.183 0 .366.097.465.292l2.184 4.327 4.898.696A.54.54 0 0 1 16 6.32a.55.55 0 0 1-.17.445l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256a.5.5 0 0 1-.146.05c-.342.06-.668-.254-.6-.642l.83-4.73L.173 6.765a.55.55 0 0 1-.17-.445.54.54 0 0 1 .446-.506l4.898-.696zM8 12.027a.5.5 0 0 1 .232.056l3.686 1.894-.694-3.957a.56.56 0 0 1 .162-.505l2.907-2.77-4.052-.576a.53.53 0 0 1-.393-.288L8 2.223v9.804z" />
                        </svg>
                    </div>

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
                    </svg><input placeholder='Pesquisar...' id='pesquisa' onKeyUp={pesquisar} />
                    </div>

                </div>
                <div className='flexC' id='flexC'>

                    {posts.length === 0 ? <p id='load'>Carregando</p> : (
                        posts.map((post) => {
                            const readStatus = false; // Add User checking layer if needed
                            return (
                                <Link to={'/mangas/' + mangaId + '/capitulos/' + post.id} key={post.id} >
                                    <div className='ChaptersCard' id='ChaptersCard' >
                                        <h4 id='capit' >
                                            <span>Capitulo: </span>
                                            {post.attributes.chapter ? post.attributes.chapter : (post.attributes.title || 'Único')}
                                            {post.attributes.chapter && post.attributes.title ? ` - ${post.attributes.title}` : ''}
                                        </h4>
                                        <small>{new Date(post.attributes.publishAt).toLocaleDateString()}</small>
                                    </div>
                                    <div className='wr2'></div>
                                </Link>
                            )
                        }))}

                </div>
            </div>
            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                mangaId={mangaId}
                mangaTitle={img.title}
                mangaImage={img.image}
            />
            <Footer />
        </div >
    )

    function lido(id) {
        var lido = id.nativeEvent.path[1].getElementsByTagName('p')[0].innerHTML
        if (lido === 'false') {

        } else {
            var element = id.nativeEvent.path[1].getElementsByTagName('div')[0].style.backgroundColor = 'var(--color6)'
            var elementB = id.nativeEvent.path[1].getElementsByTagName('div')[0].style.border = '1px solid var(--color2)'
        }
    }

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