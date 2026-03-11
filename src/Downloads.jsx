// src/Downloads.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Nav from './components/nav';
import SideMenu from './components/sideMenu';
import NavRead from './components/navRead';
import OfflineStorage from './backend/offlineStorage';

function Downloads() {
    const [chapters, setChapters] = useState([]);
    const [storage, setStorage] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const loadSaved = async () => {
        setLoading(true);
        const saved = await OfflineStorage.getSavedChapters();
        setChapters(saved);
        const usage = await OfflineStorage.getStorageUsage();
        setStorage(usage);
        setLoading(false);
    };

    useEffect(() => { loadSaved(); }, []);

    const handleDelete = async (chapterId, e) => {
        e.stopPropagation();
        if (confirm('Remover este capítulo dos downloads?')) {
            await OfflineStorage.deleteChapter(chapterId);
            loadSaved();
        }
    };

    // Group chapters by manga
    const grouped = chapters.reduce((acc, ch) => {
        if (!acc[ch.mangaId]) acc[ch.mangaId] = { title: ch.mangaTitle, image: ch.mangaImage, chapters: [] };
        acc[ch.mangaId].chapters.push(ch);
        return acc;
    }, {});

    return (
        <div style={{ minHeight: '100vh', color: 'white', paddingBottom: '80px', position: 'relative' }}>
            <Nav />
            <SideMenu />
            <div className='Black'></div>
            <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                    <h2 style={{ color: 'var(--color5)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                        </svg>
                        Downloads Offline
                    </h2>
                    {storage && (
                        <div style={{ fontSize: '0.8rem', color: '#888', backgroundColor: '#1e1e1e', padding: '8px 15px', borderRadius: '20px' }}>
                            📦 {storage.usedMB} MB usado de {storage.totalMB} MB
                        </div>
                    )}
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>Carregando...</div>
                ) : chapters.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#333" viewBox="0 0 16 16" style={{ marginBottom: '20px' }}>
                            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                        </svg>
                        <p style={{ color: '#666', fontSize: '1.1rem' }}>Nenhum capítulo salvo ainda</p>
                        <p style={{ color: '#555', fontSize: '0.9rem' }}>Abra um capítulo e toque no botão "Salvar Offline" para ler sem internet!</p>
                    </div>
                ) : (
                    Object.entries(grouped).map(([mangaId, manga]) => (
                        <div key={mangaId} style={{ marginBottom: '30px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                                <img
                                    src={manga.image}
                                    alt={manga.title}
                                    style={{ width: '50px', height: '70px', objectFit: 'cover', borderRadius: '8px' }}
                                />
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{manga.title}</h3>
                                    <small style={{ color: '#888' }}>{manga.chapters.length} capítulo(s) salvo(s)</small>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {manga.chapters.map(ch => (
                                    <div
                                        key={ch.id}
                                        onClick={() => navigate(`/offline/${ch.id}`)}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '12px 16px',
                                            backgroundColor: 'var(--color3)',
                                            borderRadius: '10px',
                                            cursor: 'pointer',
                                            transition: 'background 0.2s',
                                            border: '1px solid var(--color4)'
                                        }}
                                    >
                                        <div>
                                            <span style={{ fontWeight: 'bold', color: 'var(--color5)' }}>Cap. {ch.chapterNum}</span>
                                            {ch.chapterTitle && <span style={{ color: '#888', marginLeft: '10px' }}>— {ch.chapterTitle}</span>}
                                            <div style={{ fontSize: '0.75rem', color: '#555', marginTop: '4px' }}>
                                                {ch.pageCount} páginas • Salvo {new Date(ch.savedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div
                                            onClick={(e) => handleDelete(ch.id, e)}
                                            style={{
                                                padding: '6px 12px',
                                                backgroundColor: '#331111',
                                                color: '#ff6666',
                                                borderRadius: '6px',
                                                fontSize: '0.8rem',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Remover
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
            <NavRead />
        </div>
    );
}

export default Downloads;
