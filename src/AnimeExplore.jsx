// src/AnimeExplore.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/Top';
import NavRead from './components/navRead';
import AnimesAPI from './backend/animes';

function AnimeExplore() {
    const [latestAnimes, setLatestAnimes] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLatest = async () => {
            setLoading(true);
            const data = await AnimesAPI.getLatest();
            setLatestAnimes(data);
            setLoading(false);
        };
        fetchLatest();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }
        setSearching(true);
        const results = await AnimesAPI.search(query);
        setSearchResults(results);
        setSearching(false);
    };

    const renderGrid = (items) => {
        const safeItems = Array.isArray(items) ? items : [];
        return (
            <div style={gridStyle}>
                {safeItems.map((anime, index) => (
                    <div
                        key={index}
                        style={cardStyle}
                        onClick={() => navigate(`/anime/${anime.slug}`)}
                    >
                        <div style={{ position: 'relative' }}>
                            <img
                                src={anime.image}
                                alt={anime.title}
                                style={imageStyle}
                                loading="lazy"
                            />
                            <div style={overlayStyle}>
                                <h3 style={titleStyle}>{anime.title}</h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div style={{ backgroundColor: '#111', minHeight: '100vh', color: 'white', paddingBottom: '80px' }}>
            <Header />
            <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                    <h2 style={{ color: '#00e6e6', margin: 0 }}>Explorar Animes</h2>

                    <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '400px' }}>
                        <input
                            type="text"
                            placeholder="Buscar animes..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            style={searchInputStyle}
                        />
                        <button type="submit" style={searchButtonStyle} disabled={searching}>
                            {searching ? '...' : 'Buscar'}
                        </button>
                    </form>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px' }}>Carregando animes mais recentes...</div>
                ) : searchResults.length > 0 ? (
                    <>
                        <h3 style={{ marginBottom: '15px' }}>Resultados para "{query}"</h3>
                        {renderGrid(searchResults)}
                    </>
                ) : query && !searching ? (
                    <div style={{ textAlign: 'center', padding: '50px' }}>Nenhum anime encontrado para "{query}".</div>
                ) : (
                    <>
                        <h3 style={{ marginBottom: '15px' }}>Últimos Atualizados</h3>
                        {renderGrid(latestAnimes)}
                    </>
                )}
            </div>

            <NavRead />
        </div>
    );
}

// Inline styles for quick layout, matching MangaReact's dark theme
const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '20px',
};

const cardStyle = {
    backgroundColor: '#1e1e1e',
    borderRadius: '10px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
};

const imageStyle = {
    width: '100%',
    height: '225px',
    objectFit: 'cover',
    display: 'block',
};

const overlayStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
    padding: '10px',
};

const titleStyle = {
    margin: 0,
    fontSize: '0.9rem',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    color: '#fff',
};

const searchInputStyle = {
    flex: 1,
    padding: '10px 15px',
    borderRadius: '20px',
    border: '1px solid #333',
    backgroundColor: '#222',
    color: 'white',
    outline: 'none',
};

const searchButtonStyle = {
    padding: '10px 20px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#00e6e6',
    color: '#000',
    fontWeight: 'bold',
    cursor: 'pointer',
};

export default AnimeExplore;
