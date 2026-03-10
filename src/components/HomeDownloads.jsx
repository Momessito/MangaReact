import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import OfflineStorage from '../backend/offlineStorage';

const HomeDownloads = () => {
    const [chapters, setChapters] = useState([]);

    useEffect(() => {
        const load = async () => {
            const saved = await OfflineStorage.getSavedChapters();
            setChapters(saved);
        };
        load();
    }, []);

    if (chapters.length === 0) return null;

    // Group chapters by manga to display on home simply
    const grouped = chapters.reduce((acc, ch) => {
        if (!acc[ch.mangaId]) {
            acc[ch.mangaId] = {
                id: ch.mangaId,
                title: ch.mangaTitle,
                image: ch.mangaImage,
                total: 0
            };
        }
        acc[ch.mangaId].total += 1;
        return acc;
    }, {});

    const latestMangas = Object.values(grouped).slice(0, 10); // Show max 10 different mangas

    return (
        <div style={{ marginTop: '20px', marginBottom: '20px', padding: '0 10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h1 style={{ fontSize: '1.2rem', color: '#00e6e6', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                        <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                    </svg>
                    Meus Downloads (Offline)
                </h1>
                <Link to="/downloads" style={{ color: '#888', textDecoration: 'none', fontSize: '0.9rem' }}>
                    Ver Todos →
                </Link>
            </div>

            <div style={{
                display: 'flex',
                overflowX: 'auto',
                gap: '15px',
                padding: '10px 0',
                scrollbarWidth: 'none', // Firefox
                msOverflowStyle: 'none' // IE/Edge
            }}>
                {latestMangas.map((manga) => (
                    <Link to="/downloads" key={manga.id} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', width: '110px', flexShrink: 0 }}>
                        <div style={{ position: 'relative' }}>
                            <img
                                src={manga.image || '/vite.svg'}
                                alt={manga.title}
                                style={{ width: '110px', height: '160px', objectFit: 'cover', borderRadius: '8px' }}
                            />
                            <div style={{
                                position: 'absolute',
                                top: '5px',
                                right: '5px',
                                backgroundColor: 'rgba(0,0,0,0.8)',
                                color: '#00e6e6',
                                borderRadius: '4px',
                                padding: '2px 6px',
                                fontSize: '0.75rem',
                                fontWeight: 'bold'
                            }}>
                                {manga.total} Cap
                            </div>
                        </div>
                        <h4 style={{ margin: '5px 0 0 0', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {manga.title}
                        </h4>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default HomeDownloads;
