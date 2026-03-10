import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Nav from './components/nav';
import SideMenu from './components/sideMenu';
import Mangas from './backend/mangas';
import User from './backend/users';
import Footer from './components/Footer';
import ReviewModal from './components/ReviewModal';
import axios from 'axios';
import OfflineStorage from './backend/offlineStorage';

const Chapters = () => {
    const location = useLocation();
    const mangaId = window.location.pathname.split("/")[2];
    var istrue = true

    const [posts, setposts] = useState([]);
    const [resultArray, setResultArray] = useState([]);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [savingAll, setSavingAll] = useState(false);
    const [saveProgress, setSaveProgress] = useState('');
    const [savedCount, setSavedCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortDesc, setSortDesc] = useState(true);
    const [isLoadingChapters, setIsLoadingChapters] = useState(true);

    // Check how many chapters are already saved
    useEffect(() => {
        const checkSaved = async () => {
            if (posts.length === 0) return;
            let count = 0;
            for (const ch of posts) {
                const saved = await OfflineStorage.isChapterSaved(ch.id);
                if (saved) count++;
            }
            setSavedCount(count);
        };
        checkSaved();
    }, [posts]);

    const saveAllOffline = async () => {
        if (savingAll || posts.length === 0) return;
        setSavingAll(true);

        const chaptersToSave = [...posts].reverse(); // save from first to last
        let done = 0;

        for (const chapter of chaptersToSave) {
            const chNum = chapter.attributes.chapter || '?';

            // Skip if already saved
            const alreadySaved = await OfflineStorage.isChapterSaved(chapter.id);
            if (alreadySaved) {
                done++;
                setSaveProgress(`Cap ${chNum} já salvo. (${done}/${chaptersToSave.length})`);
                continue;
            }

            setSaveProgress(`Baixando Cap ${chNum}... (${done + 1}/${chaptersToSave.length})`);

            try {
                // Get chapter image server
                const serverData = await Mangas.getChapterServer(chapter.id);
                if (!serverData || !serverData.chapter) {
                    done++;
                    continue;
                }

                const baseUrl = serverData.baseUrl;
                const hash = serverData.chapter.hash;
                const dataFiles = serverData.chapter.data;

                const pages = [];
                for (let i = 0; i < dataFiles.length; i++) {
                    setSaveProgress(`Cap ${chNum} — página ${i + 1}/${dataFiles.length} (${done + 1}/${chaptersToSave.length})`);
                    try {
                        const imgUrl = `${baseUrl}/data/${hash}/${dataFiles[i]}`;
                        const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(imgUrl)}`;
                        const response = await axios.get(proxyUrl, { responseType: 'arraybuffer' });
                        pages.push({ index: i, blob: response.data, type: 'image/jpeg' });
                    } catch (e) {
                        try {
                            const imgUrl = `${baseUrl}/data/${hash}/${dataFiles[i]}`;
                            const response = await axios.get(imgUrl, { responseType: 'arraybuffer' });
                            pages.push({ index: i, blob: response.data, type: 'image/jpeg' });
                        } catch (e2) {
                            console.error(`Skip page ${i + 1} of cap ${chNum}`);
                        }
                    }
                }

                await OfflineStorage.saveChapter({
                    mangaId,
                    mangaTitle: img.title || 'Mangá',
                    mangaImage: img.image || '',
                    chapterId: chapter.id,
                    chapterNum: chNum,
                    chapterTitle: chapter.attributes.title || '',
                    pages,
                });

                done++;
                setSavedCount(prev => prev + 1);
            } catch (err) {
                console.error(`Error saving chapter ${chNum}:`, err);
                done++;
            }
        }

        setSaveProgress(`✓ ${done} capítulos salvos!`);
        setTimeout(() => setSaveProgress(''), 4000);
        setSavingAll(false);
    };

    const getposts = async () => {
        try {
            setIsLoadingChapters(true);
            let limit = 500;
            let offset = 0;
            let allChapters = [];
            let hasMore = true;

            while (hasMore) {
                const response = await Mangas.getChapters(mangaId, offset);
                if (response && response.data && response.data.length > 0) {
                    allChapters = [...allChapters, ...response.data];
                    offset += limit;
                    if (response.data.length < limit) {
                        hasMore = false;
                    }
                } else {
                    hasMore = false;
                }
            }
            setposts(allChapters);
            setIsLoadingChapters(false);
        } catch (err) {
            console.error(err);
            setIsLoadingChapters(false);
        }
    }

    // Filter and Sort logic
    const filteredPosts = posts.filter(post => {
        const chapterNum = post.attributes.chapter || '';
        const chapterTitle = post.attributes.title || '';
        const searchUpper = searchTerm.toUpperCase();
        return chapterNum.toUpperCase().includes(searchUpper) || chapterTitle.toUpperCase().includes(searchUpper);
    });

    const sortedPosts = [...filteredPosts].sort((a, b) => {
        const numA = parseFloat(a.attributes.chapter) || 0;
        const numB = parseFloat(b.attributes.chapter) || 0;
        return sortDesc ? numB - numA : numA - numB;
    });

    function descer() {
        setSortDesc(!sortDesc);
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

                {/* Bulk Save Offline Button */}
                <div style={{ padding: '10px 15px', marginBottom: '10px' }}>
                    <div
                        onClick={savingAll ? undefined : saveAllOffline}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            padding: '14px 20px',
                            backgroundColor: (savedCount > 0 && savedCount >= posts.length) ? '#1a4a1a' : savingAll ? '#222' : '#00e6e6',
                            color: (savedCount > 0 && savedCount >= posts.length) ? '#4f4' : savingAll ? '#aaa' : '#000',
                            borderRadius: '12px',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            cursor: savingAll ? 'wait' : 'pointer',
                            transition: 'all 0.3s',
                            userSelect: 'none',
                            width: '100%',
                            boxSizing: 'border-box',
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                        </svg>
                        {savingAll
                            ? saveProgress
                            : (savedCount > 0 && savedCount >= posts.length)
                                ? `✓ Todos os ${posts.length} capítulos salvos offline`
                                : savedCount > 0
                                    ? `Salvar Todos Offline (${savedCount}/${posts.length} já salvos)`
                                    : `Salvar Todos os ${posts.length} Capítulos Offline`
                        }
                    </div>
                    {savingAll && (
                        <div style={{ marginTop: '8px', height: '4px', backgroundColor: '#333', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{
                                height: '100%',
                                backgroundColor: '#00e6e6',
                                borderRadius: '2px',
                                transition: 'width 0.3s',
                                width: posts.length > 0 ? `${(savedCount / posts.length) * 100}%` : '0%',
                            }} />
                        </div>
                    )}
                </div>
                <div className="Filter">
                    <div className=''>
                        <svg onClick={descer} style={{ cursor: 'pointer', transform: sortDesc ? 'none' : 'rotate(180deg)', transition: 'transform 0.3s' }} xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="var(--color2)" className="filterDown bi bi-arrow-down-up" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5zm-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5z" />
                        </svg>
                    </div>
                    <div className='filterI'><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="var(--color2)" className="bi bi-search" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                    </svg><input placeholder='Pesquisar...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} id='pesquisa' />
                    </div>

                </div>
                <div className='flexC' id='flexC'>

                    {isLoadingChapters ? <p id='load'>Carregando capítulos...</p> : sortedPosts.length === 0 ? <p id='load'>Nenhum capítulo encontrado</p> : (
                        sortedPosts.map((post) => {
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

}

export default Chapters;