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

    // Group chapters by manga
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

    const latestMangas = Object.values(grouped).slice(0, 10);

    return (
        <div style={{
            margin: '12px auto',
            width: '92%',
            maxWidth: '900px',
            padding: '16px 20px',
            backgroundColor: 'rgba(23, 23, 36, 0.6)',
            borderRadius: '16px',
            border: '1px solid var(--color4)',
            backdropFilter: 'blur(10px)',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--color5)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontWeight: 'bold' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                        <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                    </svg>
                    Meus Downloads
                </h3>
                <Link to="/downloads" style={{ color: '#888', textDecoration: 'none', fontSize: '0.8rem', transition: 'color 0.2s' }}>
                    Ver Todos →
                </Link>
            </div>

            <div style={{
                display: 'flex',
                overflowX: 'auto',
                gap: '12px',
                paddingBottom: '5px',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
            }}>
                {latestMangas.map((manga) => (
                    <Link to="/downloads" key={manga.id} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', width: '90px', flexShrink: 0 }}>
                        <div style={{ position: 'relative' }}>
                            <img
                                src={manga.image || '/vite.svg'}
                                alt={manga.title}
                                style={{
                                    width: '90px',
                                    height: '128px',
                                    objectFit: 'cover',
                                    borderRadius: '10px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                }}
                            />
                            <div style={{
                                position: 'absolute',
                                top: '4px',
                                right: '4px',
                                backgroundColor: 'var(--color5)',
                                color: 'white',
                                borderRadius: '6px',
                                padding: '2px 6px',
                                fontSize: '0.65rem',
                                fontWeight: 'bold',
                            }}>
                                {manga.total}
                            </div>
                        </div>
                        <span style={{
                            marginTop: '6px',
                            fontSize: '0.75rem',
                            color: '#ccc',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            textAlign: 'center',
                        }}>
                            {manga.title}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default HomeDownloads;
