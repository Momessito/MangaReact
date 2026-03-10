// src/AnimePlayer.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Header from './components/Top';
import NavRead from './components/navRead';
import AnimesAPI from './backend/animes';

function AnimePlayer() {
    const { slug } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // We pass epUrl and titles via React Router state
    const { epUrl, epTitle, animeTitle } = location.state || {};

    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState('');

    useEffect(() => {
        if (!epUrl) {
            navigate(`/anime/${slug}`);
            return;
        }

        const fetchVideo = async () => {
            setLoading(true);
            const data = await AnimesAPI.getEpisodeVideo(epUrl);
            setVideos(data);
            if (data && data.length > 0) {
                // Auto-select HD or the first available
                const hd = data.find(v => v.quality.includes('HD') || v.quality.includes('720') || v.quality.includes('1080'));
                setSelectedVideo(hd ? hd.url : data[0].url);
            }
            setLoading(false);
        };
        fetchVideo();
    }, [epUrl, slug, navigate]);

    return (
        <div style={{ backgroundColor: '#000', minHeight: '100vh', color: 'white', paddingBottom: '80px' }}>
            <Header />
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
                <button
                    onClick={() => navigate(`/anime/${slug}`)}
                    style={{ background: 'none', border: 'none', color: '#00e6e6', cursor: 'pointer', marginBottom: '15px', fontSize: '1rem', padding: 0 }}
                >
                    &larr; Voltar para Episódios
                </button>

                <h2 style={{ color: '#5288e5', margin: '0 0 5px 0' }}>{animeTitle}</h2>
                <h4 style={{ color: '#ccc', margin: '0 0 20px 0' }}>{epTitle}</h4>

                {loading ? (
                    <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: '10px' }}>
                        Carregando vídeo...
                    </div>
                ) : videos.length > 0 ? (
                    <>
                        <div style={{ width: '100%', backgroundColor: '#111', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 5px 20px rgba(0,0,0,0.5)' }}>
                            <video
                                src={selectedVideo}
                                controls
                                autoPlay
                                style={{ width: '100%', maxHeight: '600px', display: 'block' }}
                            >
                                Seu navegador não suporta vídeos HTML5.
                            </video>
                        </div>

                        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <span style={{ color: '#888' }}>Qualidade:</span>
                            {videos.map((vid, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedVideo(vid.url)}
                                    style={{
                                        padding: '5px 15px',
                                        backgroundColor: selectedVideo === vid.url ? '#5288e5' : '#222',
                                        border: '1px solid #444',
                                        borderRadius: '5px',
                                        color: '#fff',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {vid.quality}
                                </button>
                            ))}
                        </div>
                    </>
                ) : (
                    <div style={{ padding: '20px', backgroundColor: '#330000', color: '#ffcccc', borderRadius: '5px', textAlign: 'center' }}>
                        Vídeo indisponível ou offline.
                    </div>
                )}
            </div>
            <NavRead />
        </div>
    );
}

export default AnimePlayer;
