import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Mangas from '../backend/mangas';
import User from '../backend/users';
import { SkeletonRow } from './SkeletonCard';

const UltimosLidos = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const getItems = async () => {
        setLoading(true);
        try {
            const readMangaIds = await User.getRecentlyRead();
            if (!readMangaIds || readMangaIds.length === 0) {
                setLoading(false);
                return;
            }

            const fetchedMangas = [];
            for (let id of readMangaIds.slice(0, 8)) {
                try {
                    const mangaDetail = await Mangas.getMangaById(id);
                    if (mangaDetail) fetchedMangas.push(mangaDetail);
                } catch(e) {}
            }
            setItems(fetchedMangas);
        } catch (Error) {
            console.log(Error);
        }
        setLoading(false);
    }

    useEffect(() => {
        getItems();
    }, []);

    if (!loading && items.length === 0) return null;

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
                <h3 style={{ fontSize: '1rem', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontWeight: 'bold' }}>
                    📚 Últimos Lidos
                </h3>
                <Link to="/historico" style={{ color: '#888', textDecoration: 'none', fontSize: '0.8rem' }}>
                    Ver Todos →
                </Link>
            </div>

            {loading ? (
                <SkeletonRow count={5} width="110px" height="160px" />
            ) : (
                <div style={{
                    display: 'flex',
                    overflowX: 'auto',
                    gap: '12px',
                    paddingBottom: '5px',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                }}>
                    {items.map((post) => (
                        <Link to={'/mangas/' + post.id} key={post.id} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', width: '110px', flexShrink: 0 }}>
                            <img
                                src={post.image}
                                alt={post.title}
                                style={{
                                    height: '160px',
                                    width: '110px',
                                    objectFit: 'cover',
                                    borderRadius: '10px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                    transition: 'transform 0.2s',
                                }}
                            />
                            <span style={{
                                color: '#ccc',
                                marginTop: '6px',
                                fontSize: '0.78rem',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                textAlign: 'center',
                            }}>
                                {post.title}
                            </span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export default UltimosLidos;
