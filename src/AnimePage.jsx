// src/AnimePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './components/Top';
import NavRead from './components/navRead';
import AnimesAPI from './backend/animes';

function AnimePage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [anime, setAnime] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            const data = await AnimesAPI.getDetails(slug);
            setAnime(data);
            setLoading(false);
        };
        fetchDetails();
    }, [slug]);

    if (loading) {
        return (
            <div style={{ backgroundColor: '#111', minHeight: '100vh', color: 'white', paddingTop: '80px', textAlign: 'center' }}>
                <Header />
                Carregando detalhes do anime...
                <NavRead />
            </div>
        );
    }

    if (!anime) {
        return (
            <div style={{ backgroundColor: '#111', minHeight: '100vh', color: 'white', paddingTop: '80px', textAlign: 'center' }}>
                <Header />
                Anime não encontrado.
                <button onClick={() => navigate('/animes')} style={{ marginLeft: '10px', padding: '5px 10px' }}>Voltar</button>
                <NavRead />
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#111', minHeight: '100vh', color: 'white', paddingBottom: '80px' }}>
            <Header />
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
                <button
                    onClick={() => navigate('/animes')}
                    style={{ background: 'none', border: 'none', color: '#00e6e6', cursor: 'pointer', marginBottom: '20px', fontSize: '1rem' }}
                >
                    &larr; Voltar para Explorar
                </button>

                <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 300px', maxWidth: '300px' }}>
                        <img
                            src={anime.image}
                            alt={anime.title}
                            style={{ width: '100%', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}
                        />
                        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#1e1e1e', borderRadius: '10px' }}>
                            <h4 style={{ color: '#00e6e6', margin: '0 0 10px 0' }}>Informações</h4>
                            <p style={{ margin: '5px 0', fontSize: '0.9rem' }}>{anime.info}</p>
                            <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#ffd700' }}>⭐ Score: {anime.score || 'N/A'}</p>
                        </div>
                    </div>

                    <div style={{ flex: '2 1 400px' }}>
                        <h1 style={{ color: '#5288e5', margin: '0 0 20px 0', fontSize: '2.5rem' }}>{anime.title}</h1>
                        <div style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
                            <h3 style={{ margin: '0 0 10px 0', color: '#ccc' }}>Sinopse</h3>
                            <p style={{ lineHeight: '1.6', color: '#bbb' }}>{anime.synopsis}</p>
                        </div>

                        <h2 style={{ color: '#00e6e6', borderBottom: '2px solid #333', paddingBottom: '10px' }}>Episódios</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px', marginTop: '20px' }}>
                            {anime.episodes && anime.episodes.length > 0 ? (
                                anime.episodes.map((ep, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => navigate(`/anime/${slug}/play`, { state: { epUrl: ep.url, epTitle: ep.label, animeTitle: anime.title } })}
                                        style={{
                                            padding: '10px',
                                            backgroundColor: '#2a2a2a',
                                            border: '1px solid #444',
                                            borderRadius: '5px',
                                            color: '#fff',
                                            cursor: 'pointer',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseOver={(e) => e.target.style.backgroundColor = '#5288e5'}
                                        onMouseOut={(e) => e.target.style.backgroundColor = '#2a2a2a'}
                                    >
                                        {ep.label}
                                    </button>
                                ))
                            ) : (
                                <p>Nenhum episódio encontrado.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <NavRead />
        </div>
    );
}

export default AnimePage;
