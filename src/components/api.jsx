import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Mangas from "../backend/mangas";
import { SkeletonRow } from './SkeletonCard';

const List = ({ isExpanded }) => {
    const [posts, setposts] = useState([]);

    const getposts = async () => {
        try {
            const data = await Mangas.getRecents();
            setposts(data);
        } catch (Error) {
            console.log(Error);
        }
    }

    useEffect(() => {
        getposts();
    }, []);

    return (
        <div className="Container" id="Container" style={{ height: isExpanded ? 'auto' : '200vh' }}>
            <div className="Last">
                <Link to={'/recentes'}><h1>Últimos Mangás</h1></Link>
                <div className="Last2">Hoje</div>
            </div>

            {posts.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '10px 0' }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} style={{ display: 'flex', gap: '14px', padding: '14px', backgroundColor: 'rgba(30,30,46,0.7)', borderRadius: '14px' }}>
                            <div className="skeleton-pulse" style={{ width: '80px', height: '110px', borderRadius: '10px', flexShrink: 0 }} />
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
                                <div className="skeleton-pulse" style={{ width: '70%', height: '16px' }} />
                                <div className="skeleton-pulse" style={{ width: '40%', height: '12px' }} />
                                <div className="skeleton-pulse" style={{ width: '50px', height: '24px', borderRadius: '6px' }} />
                                <div style={{ display: 'flex', gap: '6px' }}>
                                    <div className="skeleton-pulse" style={{ width: '45px', height: '14px' }} />
                                    <div className="skeleton-pulse" style={{ width: '55px', height: '14px' }} />
                                    <div className="skeleton-pulse" style={{ width: '50px', height: '14px' }} />
                                </div>
                            </div>
                        </div>
                    ))}
                    <style>{`
                        @keyframes shimmer {
                            0% { background-position: -400px 0; }
                            100% { background-position: 400px 0; }
                        }
                        .skeleton-pulse {
                            background: linear-gradient(90deg, #1e1e2e 25%, #2a2a3e 50%, #1e1e2e 75%);
                            background-size: 800px 100%;
                            animation: shimmer 1.5s infinite ease-in-out;
                            border-radius: 8px;
                        }
                    `}</style>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {posts.map((post) => {
                        const isAdult = post.categories && post.categories.some(c => c === 'Hentai' || c === 'Ecchi');

                        return (
                            <Link to={'/mangas/' + post.id} key={post.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div style={{
                                    display: 'flex',
                                    gap: '14px',
                                    padding: '14px',
                                    backgroundColor: 'rgba(30, 30, 46, 0.7)',
                                    borderRadius: '14px',
                                    border: '1px solid rgba(255,255,255,0.04)',
                                    transition: 'transform 0.2s, background-color 0.2s',
                                    cursor: 'pointer',
                                }}>
                                    {/* Cover Image */}
                                    <img
                                        alt={post.title}
                                        src={post.image}
                                        style={{
                                            width: '80px',
                                            height: '110px',
                                            objectFit: 'cover',
                                            borderRadius: '10px',
                                            flexShrink: 0,
                                            filter: isAdult ? 'blur(4px)' : 'none',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                        }}
                                    />

                                    {/* Info */}
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '6px', minWidth: 0 }}>
                                        <h3 style={{
                                            margin: 0,
                                            fontSize: '0.95rem',
                                            fontWeight: '700',
                                            color: 'white',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}>
                                            {post.title}
                                        </h3>

                                        <span style={{ fontSize: '0.78rem', color: '#888', margin: 0 }}>
                                            By {post.author || 'Autor Desconhecido'}
                                        </span>

                                        {/* Chapter + Rating Row */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span style={{
                                                display: 'inline-block',
                                                padding: '3px 10px',
                                                backgroundColor: 'var(--color5)',
                                                color: 'white',
                                                borderRadius: '6px',
                                                fontSize: '0.72rem',
                                                fontWeight: 'bold',
                                            }}>
                                                Cap: {post.chapters_count || '?'}
                                            </span>

                                            <span style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '3px',
                                                backgroundColor: 'rgba(255,193,7,0.15)',
                                                color: '#ffc107',
                                                padding: '3px 8px',
                                                borderRadius: '6px',
                                                fontSize: '0.72rem',
                                                fontWeight: 'bold',
                                            }}>
                                                ⭐ {post.score}
                                            </span>
                                        </div>

                                        {/* Genre Pills */}
                                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '2px' }}>
                                            {post.categories && post.categories.slice(0, 3).map((cat) => (
                                                <span key={cat} style={{
                                                    padding: '2px 8px',
                                                    backgroundColor: 'rgba(139, 114, 142, 0.25)',
                                                    border: '1px solid rgba(139, 114, 142, 0.3)',
                                                    borderRadius: '10px',
                                                    fontSize: '0.65rem',
                                                    color: '#c4b5c9',
                                                    fontWeight: '500',
                                                }}>
                                                    {cat}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    )
}

export default List;
