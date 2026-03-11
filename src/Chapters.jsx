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

    const [posts, setposts] = useState([]);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [savingAll, setSavingAll] = useState(false);
    const [saveProgress, setSaveProgress] = useState('');
    const [savedCount, setSavedCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortDesc, setSortDesc] = useState(true);
    const [isLoadingChapters, setIsLoadingChapters] = useState(true);
    const [isFav, setIsFav] = useState(false);
    const [img, setimg] = useState({});
    const [showDesc, setShowDesc] = useState(false);

    // Check saved count
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
        const chaptersToSave = [...posts].reverse();
        let done = 0;
        for (const chapter of chaptersToSave) {
            const chNum = chapter.attributes.chapter || '?';
            const alreadySaved = await OfflineStorage.isChapterSaved(chapter.id);
            if (alreadySaved) { done++; setSaveProgress(`Cap ${chNum} já salvo. (${done}/${chaptersToSave.length})`); continue; }
            setSaveProgress(`Baixando Cap ${chNum}... (${done + 1}/${chaptersToSave.length})`);
            try {
                const serverData = await Mangas.getChapterServer(chapter.id);
                if (!serverData || !serverData.chapter) { done++; continue; }
                const baseUrl = serverData.baseUrl;
                const hash = serverData.chapter.hash;
                const dataFiles = serverData.chapter.data;
                const pages = [];
                for (let i = 0; i < dataFiles.length; i++) {
                    setSaveProgress(`Cap ${chNum} — pág ${i + 1}/${dataFiles.length} (${done + 1}/${chaptersToSave.length})`);
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
                        } catch (e2) { console.error(`Skip page ${i + 1}`); }
                    }
                }
                await OfflineStorage.saveChapter({
                    mangaId, mangaTitle: img.title || 'Mangá', mangaImage: img.image || '',
                    chapterId: chapter.id, chapterNum: chNum, chapterTitle: chapter.attributes.title || '', pages,
                });
                done++;
                setSavedCount(prev => prev + 1);
            } catch (err) { console.error(err); done++; }
        }
        setSaveProgress(`✓ ${done} capítulos salvos!`);
        setTimeout(() => setSaveProgress(''), 4000);
        setSavingAll(false);
    };

    const getposts = async () => {
        try {
            setIsLoadingChapters(true);
            let offset = 0, allChapters = [], hasMore = true;
            while (hasMore) {
                const response = await Mangas.getChapters(mangaId, offset);
                if (response && response.data && response.data.length > 0) {
                    allChapters = [...allChapters, ...response.data];
                    offset += 500;
                    if (response.data.length < 500) hasMore = false;
                } else { hasMore = false; }
            }
            setposts(allChapters);
        } catch (err) { console.error(err); }
        setIsLoadingChapters(false);
    }

    const filteredPosts = posts.filter(post => {
        const chapterNum = post.attributes.chapter || '';
        const chapterTitle = post.attributes.title || '';
        const s = searchTerm.toUpperCase();
        return chapterNum.toUpperCase().includes(s) || chapterTitle.toUpperCase().includes(s);
    });

    const sortedPosts = [...filteredPosts].sort((a, b) => {
        const numA = parseFloat(a.attributes.chapter) || 0;
        const numB = parseFloat(b.attributes.chapter) || 0;
        return sortDesc ? numB - numA : numA - numB;
    });

    const favoritar = async () => {
        try {
            await User.addFavorite(img.title, mangaId);
            setIsFav(true);
        } catch (e) { console.log(e); }
    }

    const removerfav = async () => {
        try {
            await User.removeFavorite(mangaId);
            setIsFav(false);
        } catch (e) { console.log(e); }
    }

    const isfavor = async () => {
        try {
            const f = await User.isFavorited(mangaId);
            setIsFav(f != null);
        } catch (e) { console.log(e); }
    }

    const getimg = async () => {
        const data = await Mangas.getMangaById(mangaId);
        setimg(data || {});
    }

    useEffect(() => { getimg(); getposts(); isfavor(); }, []);

    const share = () => {
        if (navigator.share) {
            navigator.share({ title: img.title || 'Yūsha', text: `Leia ${img.title} no Yūsha!`, url: window.location.href });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copiado!');
        }
    };

    return (
        <div style={{ minHeight: '100vh', color: 'white' }}>
            <SideMenu />
            <Nav />
            <div className='Black'></div>

            {/* Hero Banner */}
            <div style={{
                position: 'relative',
                width: '100%',
                height: '350px',
                overflow: 'hidden',
            }}>
                <img
                    src={img.image}
                    alt=""
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center 20%',
                        filter: 'blur(8px) brightness(0.4)',
                        transform: 'scale(1.1)',
                    }}
                />
                <div style={{
                    position: 'absolute',
                    bottom: 0, left: 0, right: 0,
                    display: 'flex',
                    gap: '24px',
                    alignItems: 'flex-end',
                    padding: '0 5% 30px',
                    background: 'linear-gradient(to top, rgba(23,23,36,1) 0%, transparent 100%)',
                }}>
                    {/* Cover Image */}
                    <img
                        src={img.image}
                        alt={img.title}
                        style={{
                            width: '140px',
                            height: '200px',
                            objectFit: 'cover',
                            borderRadius: '12px',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.5)',
                            border: '3px solid rgba(255,255,255,0.1)',
                            flexShrink: 0,
                        }}
                    />
                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0, paddingBottom: '5px' }}>
                        <h1 style={{ margin: '0 0 6px', fontSize: '1.6rem', fontWeight: '800', textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
                            {img.title}
                        </h1>
                        {img.author && <p style={{ margin: '0 0 8px', color: '#aaa', fontSize: '0.9rem' }}>Por {img.author}</p>}
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                            {img.score && (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(255,193,7,0.15)', color: '#ffc107', padding: '4px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                    ⭐ {img.score}
                                </span>
                            )}
                            <span style={{ backgroundColor: 'var(--color5)', color: 'white', padding: '4px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                {posts.length} Capítulos
                            </span>
                            {img.categories && img.categories.slice(0, 3).map(c => (
                                <span key={c} style={{ padding: '3px 10px', backgroundColor: 'rgba(139,114,142,0.25)', border: '1px solid rgba(139,114,142,0.3)', borderRadius: '12px', fontSize: '0.7rem', color: '#c4b5c9' }}>
                                    {c}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div style={{ padding: '16px 5%', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                    onClick={isFav ? removerfav : favoritar}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px',
                        backgroundColor: isFav ? 'rgba(255,193,7,0.15)' : 'rgba(30,30,46,0.7)',
                        color: isFav ? '#ffc107' : '#ccc',
                        border: isFav ? '1px solid rgba(255,193,7,0.3)' : '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', transition: 'all 0.2s',
                    }}
                >
                    {isFav ? '★ Favoritado' : '☆ Favoritar'}
                </button>
                <button
                    onClick={() => setIsReviewModalOpen(true)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px',
                        backgroundColor: 'rgba(238,141,122,0.15)', color: 'var(--color5)',
                        border: '1px solid rgba(238,141,122,0.3)', borderRadius: '10px',
                        cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem',
                    }}
                >
                    ⭐ Avaliar
                </button>
                <button
                    onClick={share}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px',
                        backgroundColor: 'rgba(30,30,46,0.7)', color: '#ccc',
                        border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px',
                        cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem',
                    }}
                >
                    🔗 Compartilhar
                </button>
            </div>

            {/* Description */}
            {img.description && (
                <div style={{ padding: '0 5%', marginBottom: '16px' }}>
                    <div style={{
                        backgroundColor: 'rgba(30,30,46,0.7)',
                        borderRadius: '14px',
                        border: '1px solid rgba(255,255,255,0.04)',
                        padding: '16px',
                    }}>
                        <p style={{
                            margin: 0, color: '#aaa', fontSize: '0.85rem', lineHeight: '1.6',
                            display: '-webkit-box', WebkitLineClamp: showDesc ? 999 : 3,
                            WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        }}>
                            {img.description}
                        </p>
                        <button
                            onClick={() => setShowDesc(!showDesc)}
                            style={{ background: 'none', border: 'none', color: 'var(--color5)', cursor: 'pointer', fontSize: '0.8rem', padding: '8px 0 0', fontWeight: 'bold' }}
                        >
                            {showDesc ? 'Mostrar menos ▲' : 'Ver mais ▼'}
                        </button>
                    </div>
                </div>
            )}

            {/* Bulk Save Offline */}
            <div style={{ padding: '0 5%', marginBottom: '16px' }}>
                <div
                    onClick={savingAll ? undefined : saveAllOffline}
                    style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                        padding: '14px 20px',
                        backgroundColor: (savedCount > 0 && savedCount >= posts.length) ? 'rgba(76,175,80,0.15)' : savingAll ? 'rgba(30,30,46,0.7)' : 'rgba(238,141,122,0.15)',
                        color: (savedCount > 0 && savedCount >= posts.length) ? '#4caf50' : savingAll ? '#888' : 'var(--color5)',
                        border: `1px solid ${(savedCount > 0 && savedCount >= posts.length) ? 'rgba(76,175,80,0.3)' : 'rgba(238,141,122,0.3)'}`,
                        borderRadius: '12px', fontWeight: 'bold', fontSize: '0.9rem',
                        cursor: savingAll ? 'wait' : 'pointer', transition: 'all 0.3s', userSelect: 'none',
                    }}
                >
                    📥 {savingAll ? saveProgress
                        : (savedCount > 0 && savedCount >= posts.length) ? `✓ Todos os ${posts.length} salvos`
                        : savedCount > 0 ? `Salvar Offline (${savedCount}/${posts.length} salvos)`
                        : `Salvar Todos os ${posts.length} Capítulos`}
                </div>
                {savingAll && (
                    <div style={{ marginTop: '8px', height: '4px', backgroundColor: 'rgba(30,30,46,0.7)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', backgroundColor: 'var(--color5)', borderRadius: '2px', transition: 'width 0.3s', width: posts.length > 0 ? `${(savedCount / posts.length) * 100}%` : '0%' }} />
                    </div>
                )}
            </div>

            {/* Search & Sort Controls */}
            <div style={{ padding: '0 5%', marginBottom: '12px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{
                    flex: 1, display: 'flex', alignItems: 'center', gap: '8px',
                    backgroundColor: 'rgba(30,30,46,0.7)', borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.04)', padding: '10px 14px',
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#888" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                    </svg>
                    <input
                        placeholder='Buscar capítulo...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ background: 'none', border: 'none', color: 'white', outline: 'none', fontSize: '0.9rem', flex: 1 }}
                    />
                </div>
                <button
                    onClick={() => setSortDesc(!sortDesc)}
                    style={{
                        padding: '10px 14px', backgroundColor: 'rgba(30,30,46,0.7)',
                        border: '1px solid rgba(255,255,255,0.04)', borderRadius: '10px',
                        color: '#ccc', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold',
                        transition: 'transform 0.3s',
                    }}
                >
                    {sortDesc ? '↓ Desc' : '↑ Asc'}
                </button>
            </div>

            {/* Chapters List */}
            <div style={{ padding: '0 5% 20px' }}>
                {isLoadingChapters ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="skeleton-pulse" style={{ width: '100%', height: '56px', borderRadius: '12px' }} />
                        ))}
                        <style>{`
                            @keyframes shimmer { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
                            .skeleton-pulse { background: linear-gradient(90deg, #1e1e2e 25%, #2a2a3e 50%, #1e1e2e 75%); background-size: 800px 100%; animation: shimmer 1.5s infinite ease-in-out; border-radius: 8px; }
                        `}</style>
                    </div>
                ) : sortedPosts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                        <p style={{ fontSize: '1.1rem' }}>Nenhum capítulo encontrado</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {sortedPosts.map((post) => (
                            <Link to={'/mangas/' + mangaId + '/capitulos/' + post.id} key={post.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '14px 16px',
                                    backgroundColor: 'rgba(30,30,46,0.7)',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255,255,255,0.04)',
                                    transition: 'background-color 0.2s',
                                    cursor: 'pointer',
                                }}>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: '600', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            Cap. {post.attributes.chapter || (post.attributes.title || 'Único')}
                                            {post.attributes.chapter && post.attributes.title ? ` — ${post.attributes.title}` : ''}
                                        </div>
                                    </div>
                                    <span style={{ color: '#666', fontSize: '0.75rem', flexShrink: 0, marginLeft: '12px' }}>
                                        {new Date(post.attributes.publishAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                mangaId={mangaId}
                mangaTitle={img.title}
                mangaImage={img.image}
            />
            <Footer />
        </div>
    );
}

export default Chapters;