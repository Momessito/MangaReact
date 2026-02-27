import './App.css';
import './media.css';
import SideMenu from './components/sideMenu';
import NavRead from './components/navRead';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from 'react-router-dom';
import Footer from './components/Footer';
import Mangas from './backend/mangas';
import User from './backend/users';
import ReviewModal from './components/ReviewModal';
import ChapterComments from './components/ChapterComments';

function Manga() {
    const { id: location, chap: location2 } = useParams();

    const [isFullscreen, setIsFullscreen] = useState(false);
    const [posts, setposts] = useState([]);
    const [chapi, setchapi] = useState([]);

    const [next, setnext] = useState("");
    const [chap, setchap] = useState({});
    const [mangaInfo, setMangaInfo] = useState({});
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    const getposts = async () => {
        try {
            // at-home/server and chapter endpoints are called DIRECTLY from browser.
            // MangaDex CDN detects server-side proxy and serves a DRM placeholder — so never proxy these.
            const response = await axios.get(
                `https://api.mangadex.org/at-home/server/${location2}`
            );

            const baseUrl = response.data.baseUrl;
            const hash = response.data.chapter.hash;
            const dataFiles = response.data.chapter.data;

            const mappedImages = dataFiles.map((filename, index) => ({
                id: index,
                url: `${baseUrl}/data/${hash}/${filename}`
            }));

            const chapInfoRes = await axios.get(`https://api.mangadex.org/chapter/${location2}`);
            const chapData = chapInfoRes.data.data;

            setposts(mappedImages);
            setchap(chapData.attributes || {});

            // Fetch chapter feed to determine next/prev chapter
            const feedRes = await Mangas.getChapters(location);
            if (feedRes && feedRes.data) {
                const chapters = feedRes.data;
                const currentIndex = chapters.findIndex(c => c.id === location2);

                // MangaDex feed is usually descending order, meaning next chapter is index - 1
                if (currentIndex >= 0) {
                    // Try to find the next chapter with a higher chapter number
                    const currentChapNum = parseFloat(chapData.attributes.chapter);
                    const nextChap = chapters.slice().reverse().find(c => parseFloat(c.attributes.chapter) > currentChapNum);

                    if (nextChap) {
                        setnext(nextChap.id);
                    } else {
                        setnext(""); // No next chapter
                    }
                }
            }

        } catch (Error) {
            console.log("Error loading chapter data from MangaDex:", Error);
        }
    }

    const getChapters = async () => {
        // We handle the feed inside getposts to determine the Next Chapter button.
        // If we still need to populate `chapi` for a dropdown or list:
        try {
            const result = await Mangas.getChapters(location);
            if (result && result.data) {
                setchapi(result.data);
            }
        } catch (err) {
            console.error(err);
        }
    }

    const lido = async () => {
        try {
            const favo = await User.markMangaRead(location, location2);
            console.log(favo);
        } catch (Error) {
            console.log(Error);
        }
    }

    const loadMangaInfo = async () => {
        try {
            const data = await Mangas.getMangaById(location);
            if (data) setMangaInfo(data);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getposts();
        getChapters();
        lido();
        loadMangaInfo();
    }, [location, location2]);

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    }

    const handleImageClick = (e) => {
        const root = document.getElementById('root');
        if (root) {
            root.scrollBy({
                top: window.innerHeight * 0.75,
                behavior: 'smooth'
            });
        }
    }

    return (
        <div>
            <div className='Black'></div>
            <SideMenu />
            <NavRead />

            <div className='mainManga'>
                <div className='flex'>
                    <h1 id='Title'>Capitulo: {chap.chapter_number}</h1>
                    <div className='fullscreen' onClick={toggleFullscreen}>
                        <div id='fullscreen1' style={{ display: isFullscreen ? 'none' : 'block' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" className="bi bi-fullscreen" viewBox="0 0 16 16">
                                <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z" />
                            </svg>
                        </div>

                        <div id='fullscreen2' style={{ display: isFullscreen ? 'block' : 'none' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" className="bi bi-fullscreen-exit" viewBox="0 0 16 16">
                                <path d="M5.5 0a.5.5 0 0 1 .5.5v4A1.5 1.5 0 0 1 4.5 6h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5zm5 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 10 4.5v-4a.5.5 0 0 1 .5-.5zM0 10.5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 6 11.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zm10 1a1.5 1.5 0 0 1 1.5-1.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {posts.length === 0 ? <p id='load'>Carregando</p> : (
                    posts.map((post) => (
                        <img
                            src={post.url}
                            key={post.id}
                            alt='Page'
                            className='PageManga'
                            style={{ width: isFullscreen ? '100%' : '100%', cursor: 'pointer', userSelect: 'none', WebkitTapHighlightColor: 'transparent' }}
                            onClick={handleImageClick}
                        />
                    ))
                )}

                <button
                    className='btne'
                    id='btne'
                    onClick={() => { if (!next) setIsReviewModalOpen(true); }}
                    style={!next ? { backgroundColor: 'var(--color5)', color: 'white', border: '1px solid var(--color2)', cursor: 'pointer' } : {}}
                >
                    {next ? (
                        <Link reloadDocument to={`/mangas/${location}/capitulos/${next}`}>Proximo capitulo</Link>
                    ) : (
                        'Chegaste ao fim! Avaliar Mangá'
                    )}
                </button>
                <div id="disqus_thread"></div>
            </div>

            <ChapterComments mangaId={location} chapterId={location2} />

            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                mangaId={location}
                mangaTitle={mangaInfo.title || 'Mangá'}
                mangaImage={mangaInfo.image || 'https://pbs.twimg.com/media/FCvrblIX0AI6sMJ.jpg'}
            />

            <Footer />
        </div>
    );
}

export default Manga;