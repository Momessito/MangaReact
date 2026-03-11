import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Nav from './components/nav';
import SideMenu from './components/sideMenu';
import Footer from './components/Footer';
import Social from './backend/social';
import Reviews from './backend/reviews';
import User from './backend/users';

function Profile() {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [favCount, setFavCount] = useState(0);
    const [readCount, setReadCount] = useState(0);

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

            // Try to get favorites count
            try {
                const favs = await User.getFavorites();
                setFavCount(favs ? favs.length : 0);
            } catch(e) {}

            // Try to get recently read count
            try {
                const read = await User.getRecentlyRead();
                setReadCount(read ? read.length : 0);
            } catch(e) {}
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => { loadData(); }, [id]);

    const isMe = id === 'me' || id === 'meu-perfil';

    // Loading skeleton
    if (loading) return (
        <div style={{ minHeight: '100vh', color: 'white' }}>
            <SideMenu /><Nav /><div className="Black"></div>
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '80px 20px 20px' }}>
                <div className="skeleton-pulse" style={{ width: '100%', height: '200px', borderRadius: '16px', marginBottom: '20px' }} />
                <div className="skeleton-pulse" style={{ width: '60%', height: '28px', marginBottom: '12px' }} />
                <div className="skeleton-pulse" style={{ width: '40%', height: '16px' }} />
                <style>{`@keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}.skeleton-pulse{background:linear-gradient(90deg,#1e1e2e 25%,#2a2a3e 50%,#1e1e2e 75%);background-size:800px 100%;animation:shimmer 1.5s infinite ease-in-out;border-radius:8px}`}</style>
            </div>
        </div>
    );

    if (!profile) return (
        <div style={{ minHeight: '100vh', color: 'white' }}>
            <SideMenu /><Nav /><div className="Black"></div>
            <div style={{ textAlign: 'center', paddingTop: '150px' }}>
                <p style={{ fontSize: '3rem' }}>😢</p>
                <h2>Perfil não encontrado</h2>
                <Link to="/" style={{ color: 'var(--color5)', textDecoration: 'underline' }}>Voltar à Home</Link>
            </div>
        </div>
    );

    const accent = profile.accentColor || '#8B728E';
    const bannerUrl = profile.banner || '';
    const bgUrl = profile.background || '';
    const bio = profile.bio || '';
    const badge = profile.badgeEmoji || '🎮';
    const nameEffect = profile.nameEffect || 'none';
    const cardStyle = profile.cardStyle || 'glass';
    const layout = profile.profileLayout || 'centered';
    const spotlight = profile.spotlightManga || null;

    // Name effect styles
    const nameStyles = {
        none: {},
        glow: { textShadow: `0 0 20px ${accent}, 0 0 40px ${accent}66` },
        gradient: { background: `linear-gradient(90deg, ${accent}, #ffc107, ${accent})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundSize: '200% auto', animation: 'gradientShift 3s ease infinite' },
        rainbow: { background: 'linear-gradient(90deg, #ff0000, #ff8000, #ffff00, #00ff00, #0080ff, #8000ff, #ff0080)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundSize: '400% auto', animation: 'gradientShift 4s ease infinite' },
    };

    // Card background styles
    const cardBg = {
        glass: { backgroundColor: 'rgba(30,30,46,0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)' },
        solid: { backgroundColor: '#1e1e2e', border: `1px solid ${accent}33` },
        neon: { backgroundColor: 'rgba(30,30,46,0.9)', border: `2px solid ${accent}`, boxShadow: `0 0 15px ${accent}44, inset 0 0 15px ${accent}11` },
        minimal: { backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.08)' },
    };

    const cardCss = cardBg[cardStyle] || cardBg.glass;

    return (
        <div style={{
            minHeight: '100vh', color: 'white',
            ...(bgUrl ? { backgroundImage: `url(${bgUrl})`, backgroundSize: 'cover', backgroundAttachment: 'fixed', backgroundPosition: 'center' } : {}),
        }}>
            <SideMenu />
            <Nav />
            <div className="Black"></div>

            {/* Gradient animation keyframe */}
            <style>{`@keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}`}</style>

            {/* Banner */}
            <div style={{
                width: '100%', height: '240px',
                backgroundImage: bannerUrl ? `url(${bannerUrl})` : `linear-gradient(135deg, ${accent}88, ${accent}33, #171724)`,
                backgroundSize: 'cover', backgroundPosition: 'center',
                position: 'relative',
            }}>
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: '100px',
                    background: bgUrl ? 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' : 'linear-gradient(to top, #171724, transparent)',
                }} />
            </div>

            {/* Profile Content */}
            <div style={{
                maxWidth: '900px', margin: '0 auto', padding: '0 20px',
                marginTop: '-70px', position: 'relative', zIndex: 2,
            }}>
                {/* Profile Card */}
                <div style={{
                    ...cardCss, borderRadius: '20px', padding: '30px',
                    display: 'flex', gap: '20px',
                    flexDirection: layout === 'centered' ? 'column' : 'row',
                    alignItems: layout === 'centered' ? 'center' : 'flex-start',
                    textAlign: layout === 'centered' ? 'center' : 'left',
                }}>
                    {/* Avatar */}
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                        <img
                            src={profile.img || 'https://pbs.twimg.com/media/FCvrblIX0AI6sMJ.jpg'}
                            alt="Avatar"
                            style={{
                                width: '110px', height: '110px', borderRadius: '50%',
                                objectFit: 'cover', border: `4px solid ${accent}`,
                                boxShadow: `0 6px 20px ${accent}44`,
                            }}
                        />
                        <span style={{
                            position: 'absolute', bottom: '-2px', right: '-2px',
                            fontSize: '1.5rem', animation: 'float 2s ease-in-out infinite',
                        }}>{badge}</span>
                    </div>

                    {/* Name & Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <h1 style={{
                            margin: '0 0 4px', fontSize: '1.8rem', fontWeight: '800',
                            ...nameStyles[nameEffect],
                        }}>
                            {profile.nickname || 'Visitante'}
                        </h1>
                        {bio && <p style={{ color: '#aaa', margin: '0 0 14px', lineHeight: '1.5', fontSize: '0.9rem', maxWidth: '500px', ...(layout === 'centered' ? { marginLeft: 'auto', marginRight: 'auto' } : {}) }}>{bio}</p>}

                        {/* Stats */}
                        <div style={{
                            display: 'flex', gap: '10px', flexWrap: 'wrap',
                            justifyContent: layout === 'centered' ? 'center' : 'flex-start',
                        }}>
                            <div style={{
                                backgroundColor: `${accent}22`, border: `1px solid ${accent}44`,
                                padding: '8px 16px', borderRadius: '12px', textAlign: 'center',
                            }}>
                                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: accent }}>{reviews.length}</div>
                                <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase' }}>Avaliações</div>
                            </div>
                            <div style={{
                                backgroundColor: 'rgba(255,193,7,0.1)', border: '1px solid rgba(255,193,7,0.25)',
                                padding: '8px 16px', borderRadius: '12px', textAlign: 'center',
                            }}>
                                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffc107' }}>{favCount}</div>
                                <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase' }}>Favoritos</div>
                            </div>
                            <div style={{
                                backgroundColor: 'rgba(76,175,80,0.1)', border: '1px solid rgba(76,175,80,0.25)',
                                padding: '8px 16px', borderRadius: '12px', textAlign: 'center',
                            }}>
                                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#4caf50' }}>{readCount}</div>
                                <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase' }}>Lidos</div>
                            </div>
                        </div>

                        {/* Edit button */}
                        {isMe && (
                            <Link to="/config" style={{
                                display: 'inline-block', marginTop: '16px',
                                padding: '10px 24px', backgroundColor: accent,
                                color: 'white', borderRadius: '10px', fontWeight: 'bold',
                                fontSize: '0.85rem', textDecoration: 'none',
                                transition: 'transform 0.2s',
                            }}>
                                ✏️ Editar Perfil
                            </Link>
                        )}
                    </div>
                </div>

                {/* Spotlight Manga */}
                {spotlight && spotlight.id && (
                    <div style={{ marginTop: '20px' }}>
                        <h3 style={{ color: '#888', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
                            ⭐ Mangá Favorito em Destaque
                        </h3>
                        <Link to={`/mangas/${spotlight.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div style={{
                                ...cardCss, borderRadius: '16px',
                                display: 'flex', gap: '16px', padding: '16px',
                                transition: 'transform 0.2s',
                            }}>
                                <img
                                    src={spotlight.image}
                                    alt={spotlight.title}
                                    style={{ width: '80px', height: '110px', objectFit: 'cover', borderRadius: '10px', boxShadow: `0 4px 12px ${accent}33` }}
                                />
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <h4 style={{ margin: '0 0 6px', fontSize: '1.1rem', fontWeight: '700' }}>{spotlight.title}</h4>
                                    <span style={{ color: '#888', fontSize: '0.8rem' }}>Mangá em destaque no perfil</span>
                                </div>
                            </div>
                        </Link>
                    </div>
                )}

                {/* Reviews Section */}
                <div style={{ marginTop: '24px', marginBottom: '30px' }}>
                    <h3 style={{
                        color: accent, fontSize: '0.85rem', textTransform: 'uppercase',
                        letterSpacing: '1px', marginBottom: '14px',
                        borderBottom: `2px solid ${accent}33`, paddingBottom: '8px',
                    }}>
                        📚 Avaliações ({reviews.length})
                    </h3>

                    {reviews.length === 0 ? (
                        <div style={{
                            ...cardCss, borderRadius: '16px', padding: '40px',
                            textAlign: 'center',
                        }}>
                            <p style={{ fontSize: '2rem', marginBottom: '8px' }}>📖</p>
                            <p style={{ color: '#666', margin: 0 }}>
                                {isMe ? 'Ainda não avaliaste nenhum mangá.' : 'Este utilizador ainda não fez avaliações.'}
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
                            {reviews.map(rev => (
                                <Link to={`/mangas/${rev.mangaId}`} key={rev.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div style={{
                                        ...cardCss, borderRadius: '14px', overflow: 'hidden',
                                        transition: 'transform 0.2s',
                                    }}>
                                        <div style={{ display: 'flex', gap: '12px', padding: '14px' }}>
                                            <img
                                                src={rev.mangaImage}
                                                alt={rev.mangaTitle}
                                                style={{ width: '65px', height: '90px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                                            />
                                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>
                                                <h4 style={{ fontSize: '0.9rem', margin: '0 0 6px', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {rev.mangaTitle}
                                                </h4>
                                                <div style={{ display: 'flex', gap: '2px', marginBottom: '6px' }}>
                                                    {Array(5).fill(0).map((_, i) => (
                                                        <span key={i} style={{ color: i < rev.rating ? '#ffc107' : '#333', fontSize: '1rem' }}>★</span>
                                                    ))}
                                                </div>
                                                {rev.comment && (
                                                    <p style={{ fontStyle: 'italic', fontSize: '0.78rem', color: '#888', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                        "{rev.comment}"
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
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
