import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Nav from './components/nav';
import SideMenu from './components/sideMenu';
import Footer from './components/Footer';
import Mangas from './backend/mangas';
import { SkeletonGrid } from './components/SkeletonCard';

const GENRES = [
    { id: 'action', name: '⚔️ Ação', tag: '391b0423-d847-456f-aff0-8b0cfc03066b' },
    { id: 'adventure', name: '🗺️ Aventura', tag: '87cc87cd-a395-47af-b27a-93258283bbc6' },
    { id: 'comedy', name: '😂 Comédia', tag: '4d32cc48-9f00-4cca-9b5a-a839f0764984' },
    { id: 'drama', name: '🎭 Drama', tag: 'b9af3a63-f058-46de-a9a0-e0c13906197a' },
    { id: 'fantasy', name: '🧙 Fantasia', tag: 'cdc58593-87dd-415e-bbc0-2ec27bf404cc' },
    { id: 'horror', name: '👻 Horror', tag: 'cdad7e68-1419-41dd-bdce-27753074a640' },
    { id: 'romance', name: '❤️ Romance', tag: '423e2eae-a7a2-4a8b-ac03-a8351462d71d' },
    { id: 'sci-fi', name: '🚀 Sci-Fi', tag: '256c8bd9-4904-4f7b-a3a0-b9c3f3ae20e5' },
    { id: 'sliceoflife', name: '🌸 Slice of Life', tag: 'e5301a23-ebd9-49dd-a0cb-2add944c7fe9' },
    { id: 'sports', name: '⚽ Esportes', tag: '69964a64-2f90-4d33-beeb-f3ed2875eb4c' },
    { id: 'supernatural', name: '👁️ Sobrenatural', tag: 'eabc5b4c-6aff-42f3-b657-3e90cbd00b75' },
    { id: 'thriller', name: '😰 Thriller', tag: '07251805-a27e-4d59-b488-f0bfbec15168' },
    { id: 'isekai', name: '🌀 Isekai', tag: 'ace04997-f6bd-436e-b261-779182193d3d' },
    { id: 'martial-arts', name: '🥋 Artes Marciais', tag: '799c202e-7daa-44eb-9cf7-8a3c0441531e' },
    { id: 'mystery', name: '🔍 Mistério', tag: 'ee968100-4191-4968-93d3-f82d72be7e46' },
    { id: 'psychological', name: '🧠 Psicológico', tag: '3b60b75c-a2d7-4860-ab56-05f391bb889c' },
];

function Generos() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [mangas, setMangas] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const activeTag = searchParams.get('tag') || '';
    const activeGenreName = GENRES.find(g => g.tag === activeTag)?.name || 'Todos';

    const loadByTag = async (tagId) => {
        setLoading(true);
        try {
            const data = await Mangas.getByTag(tagId);
            setMangas(data || []);
        } catch (err) {
            console.error(err);
            setMangas([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (activeTag) {
            loadByTag(activeTag);
        } else {
            setMangas([]);
        }
    }, [activeTag]);

    const selectGenre = (tag) => {
        setSearchParams({ tag });
    };

    return (
        <div style={{ minHeight: '100vh', color: 'white' }}>
            <Nav />
            <SideMenu />
            <div className='Black'></div>

            <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
                <h2 style={{ color: 'var(--color5)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M6 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-1 0a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0z" />
                        <path d="M2 1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 1 6.586V2a1 1 0 0 1 1-1zm0 5.586 7 7L13.586 9l-7-7H2v4.586z" />
                    </svg>
                    Gêneros {activeTag && `— ${activeGenreName}`}
                </h2>

                {/* Genre Pills */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    marginBottom: '25px'
                }}>
                    {GENRES.map(genre => (
                        <button
                            key={genre.id}
                            onClick={() => selectGenre(genre.tag)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '20px',
                                border: activeTag === genre.tag ? '2px solid var(--color5)' : '1px solid var(--color4)',
                                backgroundColor: activeTag === genre.tag ? 'var(--color5)' : 'var(--color3)',
                                color: activeTag === genre.tag ? 'white' : '#ccc',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                fontWeight: activeTag === genre.tag ? 'bold' : 'normal',
                                transition: 'all 0.2s',
                            }}
                        >
                            {genre.name}
                        </button>
                    ))}
                </div>

                {/* Results */}
                {!activeTag ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>
                        <div style={{ fontSize: '64px', marginBottom: '20px' }}>🏷️</div>
                        <p style={{ fontSize: '1.1rem' }}>Selecione um gênero acima</p>
                        <p style={{ fontSize: '0.9rem', color: '#555' }}>Encontre mangás pela categoria que mais gosta!</p>
                    </div>
                ) : loading ? (
                    <SkeletonGrid count={12} columns={3} />
                ) : mangas.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>
                        <p>Nenhum mangá encontrado para este gênero em PT-BR</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                        gap: '15px'
                    }}>
                        {mangas.map(manga => (
                            <Link
                                key={manga.id}
                                to={`/mangas/${manga.id}`}
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                <div style={{
                                    borderRadius: '10px',
                                    overflow: 'hidden',
                                    transition: 'transform 0.2s',
                                    cursor: 'pointer'
                                }}>
                                    <img
                                        src={manga.image}
                                        alt={manga.title}
                                        style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '10px' }}
                                    />
                                    <h4 style={{
                                        color: 'white',
                                        fontSize: '0.85rem',
                                        marginTop: '8px',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {manga.title}
                                    </h4>
                                    <div style={{ color: '#888', fontSize: '0.75rem' }}>
                                        ⭐ {manga.score || '?'}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default Generos;
