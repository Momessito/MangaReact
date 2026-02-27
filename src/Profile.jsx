import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Nav from './components/nav';
import SideMenu from './components/sideMenu';
import Footer from './components/Footer';
import Social from './backend/social';
import Reviews from './backend/reviews';

function Profile() {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            let targetUid = id;
            if (id === 'me' || id === 'meu-perfil') {
                targetUid = Social.getUid();
            }
            if (!targetUid) { setLoading(false); return; }

            const usersData = await Social.getUsersProfiles([targetUid]);
            if (usersData && usersData.length > 0) {
                setProfile(usersData[0]);
            } else {
                const me = await Social.getMyProfileData();
                if (me) setProfile({ uid: targetUid, ...me });
            }

            const userReviews = await Reviews.getUserReviews(targetUid);
            setReviews(userReviews);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => { loadData(); }, [id]);

    if (loading) return (
        <div className="app">
            <SideMenu /><Nav /><div className="Black"></div>
            <p style={{ color: 'white', marginTop: '100px', textAlign: 'center' }}>Carregando perfil...</p>
        </div>
    );

    if (!profile) return (
        <div className="app">
            <SideMenu /><Nav /><div className="Black"></div>
            <p style={{ color: 'white', marginTop: '100px', textAlign: 'center' }}>Perfil não encontrado.</p>
        </div>
    );

    const accent = profile.accentColor || 'var(--color2)';
    const bannerUrl = profile.banner || '';
    const bgUrl = profile.background || '';
    const bio = profile.bio || '';

    return (
        <div className="app" style={bgUrl ? { backgroundImage: `url(${bgUrl})`, backgroundSize: 'cover', backgroundAttachment: 'fixed', backgroundPosition: 'center' } : {}}>
            <SideMenu />
            <Nav />
            <div className="Black"></div>

            <div style={{ minHeight: '100vh', paddingBottom: '60px' }}>
                {/* BANNER */}
                <div style={{
                    marginTop: '60px',
                    width: '100%',
                    height: '220px',
                    backgroundColor: accent,
                    backgroundImage: bannerUrl ? `url(${bannerUrl})` : `linear-gradient(135deg, ${accent}88, ${accent})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                }}>
                    {/* Avatar on banner */}
                    <img
                        src={profile.img || 'https://pbs.twimg.com/media/FCvrblIX0AI6sMJ.jpg'}
                        alt="Avatar"
                        style={{
                            position: 'absolute', bottom: '-55px', left: '40px',
                            width: '110px', height: '110px', borderRadius: '50%',
                            objectFit: 'cover', border: `4px solid ${accent}`,
                            boxShadow: '0 4px 15px rgba(0,0,0,0.6)',
                            zIndex: 1
                        }}
                    />
                </div>

                {/* Profile header info */}
                <div style={{
                    width: '90%', maxWidth: '900px', margin: '0 auto',
                    backgroundColor: 'rgba(26,29,61,0.85)', borderRadius: '0 0 12px 12px',
                    padding: '70px 40px 25px 40px', border: `1px solid ${accent}22`,
                    backdropFilter: 'blur(10px)', marginTop: 0
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '10px' }}>
                        <div>
                            <h1 style={{ color: accent, margin: 0, fontSize: '2rem' }}>{profile.nickname || 'Utilizador'}</h1>
                            {bio && <p style={{ color: '#ccc', marginTop: '8px', maxWidth: '500px', lineHeight: '1.5' }}>{bio}</p>}
                            <div style={{ display: 'flex', gap: '20px', marginTop: '12px', flexWrap: 'wrap' }}>
                                <span style={{ backgroundColor: `${accent}33`, padding: '4px 12px', borderRadius: '20px', color: accent, fontSize: '0.9rem', border: `1px solid ${accent}55` }}>
                                    ⭐ {reviews.length} Avaliações
                                </span>
                            </div>
                        </div>
                        {(id === 'me' || id === 'meu-perfil') && (
                            <Link to="/config" style={{ backgroundColor: accent, color: 'white', padding: '8px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                ✏️ Editar Perfil
                            </Link>
                        )}
                    </div>
                </div>

                {/* Reviews section */}
                <div style={{ width: '90%', maxWidth: '900px', margin: '30px auto 0 auto' }}>
                    <h2 style={{ color: accent, marginBottom: '20px', borderBottom: `2px solid ${accent}44`, paddingBottom: '10px' }}>
                        📚 Mangás Avaliados ({reviews.length})
                    </h2>

                    {reviews.length === 0 ? (
                        <div style={{ backgroundColor: 'rgba(26,29,61,0.8)', borderRadius: '10px', padding: '30px', textAlign: 'center', color: '#888' }}>
                            <p>Nenhuma avaliação ainda. Começa a ler e avalia os teus mangás!</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                            {reviews.map(rev => (
                                <div key={rev.id} style={{ backgroundColor: 'rgba(26,29,61,0.85)', borderRadius: '12px', overflow: 'hidden', border: `1px solid ${accent}33`, backdropFilter: 'blur(8px)', transition: '0.2s transform', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
                                    <div style={{ display: 'flex' }}>
                                        <img src={rev.mangaImage} alt={rev.mangaTitle} style={{ width: '90px', height: '125px', objectFit: 'cover', flexShrink: 0 }} />
                                        <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                            <h4 style={{ fontSize: '1rem', margin: '0 0 8px 0', color: 'white' }}>{rev.mangaTitle}</h4>
                                            <div style={{ fontSize: '1.2rem' }}>
                                                {Array(5).fill(0).map((_, i) => (
                                                    <span key={i} style={{ color: i < rev.rating ? 'gold' : '#555' }}>★</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    {rev.comment && (
                                        <div style={{ padding: '12px', borderTop: `1px solid ${accent}22` }}>
                                            <p style={{ fontStyle: 'italic', fontSize: '0.85rem', color: '#bbb', margin: 0 }}>"{rev.comment}"</p>
                                        </div>
                                    )}
                                    <div style={{ padding: '8px 12px', textAlign: 'right' }}>
                                        <Link to={`/mangas/${rev.mangaId}`} style={{ color: accent, fontSize: '0.8rem', textDecoration: 'underline' }}>Ver Mangá →</Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Profile;
