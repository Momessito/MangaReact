// src/OfflineReader.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavRead from './components/navRead';
import OfflineStorage from './backend/offlineStorage';

function OfflineReader() {
    const { chapterId } = useParams();
    const navigate = useNavigate();
    const [chapter, setChapter] = useState(null);
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const saved = await OfflineStorage.getSavedChapters();
                const ch = saved.find(c => c.id === chapterId);
                setChapter(ch);

                const pageData = await OfflineStorage.getChapterPages(chapterId);
                // Convert blobs to object URLs
                const urls = pageData.map(p => ({
                    index: p.index,
                    url: URL.createObjectURL(new Blob([p.blob], { type: p.type })),
                }));
                setPages(urls);
            } catch (err) {
                console.error('Error loading offline chapter:', err);
            }
            setLoading(false);
        };
        load();

        // Cleanup object URLs on unmount
        return () => {
            pages.forEach(p => URL.revokeObjectURL(p.url));
        };
    }, [chapterId]);

    const handleImageClick = () => {
        const root = document.getElementById('root');
        if (root) {
            root.scrollBy({ top: window.innerHeight * 0.75, behavior: 'smooth' });
        }
    };

    if (loading) {
        return (
            <div style={{ backgroundColor: '#000', minHeight: '100vh', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Carregando capítulo offline...
            </div>
        );
    }

    if (!chapter) {
        return (
            <div style={{ backgroundColor: '#000', minHeight: '100vh', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                <p>Capítulo não encontrado nos downloads.</p>
                <button onClick={() => navigate('/downloads')} style={{ padding: '10px 20px', backgroundColor: '#00e6e6', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Voltar aos Downloads
                </button>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#000', minHeight: '100vh' }}>
            <NavRead />

            <div style={{ maxWidth: isFullscreen ? '100%' : '900px', margin: '0 auto', padding: isFullscreen ? '0' : '10px' }}>
                {/* Header */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 15px', backgroundColor: '#111', borderRadius: '10px',
                    marginBottom: '10px', flexWrap: 'wrap', gap: '10px'
                }}>
                    <div>
                        <div style={{ color: '#00e6e6', fontWeight: 'bold', fontSize: '0.95rem' }}>{chapter.mangaTitle}</div>
                        <div style={{ color: '#888', fontSize: '0.85rem' }}>
                            Cap. {chapter.chapterNum}
                            {chapter.chapterTitle && ` — ${chapter.chapterTitle}`}
                            <span style={{ marginLeft: '10px', color: '#4a4', fontSize: '0.75rem' }}>● OFFLINE</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div
                            onClick={() => navigate('/downloads')}
                            style={{ padding: '6px 14px', backgroundColor: '#222', color: '#ccc', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
                        >
                            ← Downloads
                        </div>
                        <div
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            style={{ padding: '6px 14px', backgroundColor: '#222', color: '#ccc', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
                        >
                            {isFullscreen ? '⊟ Normal' : '⊞ Tela Cheia'}
                        </div>
                    </div>
                </div>

                {/* Pages */}
                {pages.map((page) => (
                    <img
                        key={page.index}
                        src={page.url}
                        alt={`Página ${page.index + 1}`}
                        style={{
                            width: '100%',
                            display: 'block',
                            cursor: 'pointer',
                            userSelect: 'none',
                            WebkitTapHighlightColor: 'transparent',
                        }}
                        onClick={handleImageClick}
                    />
                ))}

                {/* Footer */}
                <div style={{
                    textAlign: 'center', padding: '30px', color: '#555',
                    fontSize: '0.9rem', borderTop: '1px solid #222', marginTop: '20px',
                }}>
                    Fim do capítulo {chapter.chapterNum} • Lido offline 📖
                    <div style={{ marginTop: '15px' }}>
                        <button
                            onClick={() => navigate('/downloads')}
                            style={{ padding: '10px 25px', backgroundColor: '#00e6e6', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            Voltar aos Downloads
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OfflineReader;
