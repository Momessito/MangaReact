import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Nav from './components/nav';
import SideMenu from './components/sideMenu';
import Footer from './components/Footer';
import User from './backend/users';
import Mangas from './backend/mangas';

function Historico() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const loadHistory = async () => {
        setLoading(true);
        try {
            const readIds = await User.getRecentlyRead();
            if (!readIds || readIds.length === 0) {
                setItems([]);
                setLoading(false);
                return;
            }

            const mangas = [];
            for (let id of readIds) {
                try {
                    const m = await Mangas.getMangaById(id);
                    if (m) mangas.push(m);
                } catch (e) { }
            }
            setItems(mangas);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => { loadHistory(); }, []);

    return (
        <div style={{ minHeight: '100vh', color: 'white' }}>
            <Nav />
            <SideMenu />
            <div className='Black'></div>

            <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="var(--color5)" viewBox="0 0 16 16">
                        <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483zm.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1 .025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.29.346-.594.486-.908l.914.405c-.16.36-.345.706-.555 1.038l-.845-.535zm-.964 1.205c.122-.122.239-.248.35-.378l.758.653a8.073 8.073 0 0 1-.401.432l-.707-.707z" />
                        <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0v1z" />
                        <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z" />
                    </svg>
                    <h2 style={{ margin: 0, color: 'var(--color5)' }}>Histórico de Leitura</h2>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
                        <svg width="50" height="50" viewBox="0 0 50 50" style={{ animation: 'spin 1s linear infinite' }}>
                            <circle cx="25" cy="25" r="20" fill="none" stroke="var(--color5)" strokeWidth="4" strokeLinecap="round" strokeDasharray="90 150" />
                            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                        </svg>
                    </div>
                ) : items.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px' }}>
                        <div style={{ fontSize: '64px', marginBottom: '20px' }}>📖</div>
                        <p style={{ color: '#666', fontSize: '1.1rem' }}>Nenhum mangá lido ainda</p>
                        <p style={{ color: '#555', fontSize: '0.9rem' }}>Comece a ler e seu histórico aparecerá aqui!</p>
                        <Link to="/" style={{ display: 'inline-block', marginTop: '20px', padding: '12px 24px', backgroundColor: 'var(--color5)', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
                            Explorar Mangás
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {items.map((manga) => (
                            <div
                                key={manga.id}
                                onClick={() => navigate(`/mangas/${manga.id}`)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px',
                                    padding: '12px 16px',
                                    backgroundColor: 'var(--color3)',
                                    border: '1px solid var(--color4)',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s',
                                }}
                            >
                                <img
                                    src={manga.image}
                                    alt={manga.title}
                                    style={{ width: '50px', height: '70px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                                />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {manga.title}
                                    </div>
                                    <div style={{ color: '#888', fontSize: '0.85rem', marginTop: '4px' }}>
                                        {manga.author || 'Autor desconhecido'} • ⭐ {manga.score || '?'}
                                    </div>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#555" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                                </svg>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default Historico;
