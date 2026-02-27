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
            // Se id for igual a "meu-perfil", vamos buscar o UID atual para a query
            let targetUid = id;
            if (id === 'me' || id === 'meu-perfil') {
                targetUid = Social.getUid();
            }

            if (!targetUid) {
                setLoading(false);
                return;
            }

            const usersData = await Social.getUsersProfiles([targetUid]);
            if (usersData && usersData.length > 0) {
                setProfile(usersData[0]);
            } else {
                // Tenta achar pelos dados do currenUser caso esteja acessando o proprio
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

    useEffect(() => {
        loadData();
    }, [id]);

    return (
        <div className="app">
            <SideMenu />
            <Nav />
            <div className="Black"></div>

            <div style={{ marginTop: '80px', width: '90%', marginLeft: 'auto', marginRight: 'auto', color: 'white', minHeight: '80vh' }}>
                {loading ? (
                    <p>Carregando perfil...</p>
                ) : !profile ? (
                    <p>Perfil não encontrado ou não tem permissões.</p>
                ) : (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', backgroundColor: 'var(--color1)', padding: '20px', borderRadius: '10px', border: '1px solid var(--color2)' }}>
                            <img
                                src={profile.img || 'https://pbs.twimg.com/media/FCvrblIX0AI6sMJ.jpg'}
                                alt="Avatar"
                                style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--color2)' }}
                            />
                            <div>
                                <h1 style={{ color: 'var(--color2)', margin: 0 }}>{profile.nickname || 'Usuario'}</h1>
                                <p style={{ margin: '5px 0' }}>Avaliações Registadas: <b>{reviews.length}</b></p>
                            </div>
                        </div>

                        <h2 style={{ color: 'var(--color2)', marginTop: '40px', marginBottom: '20px' }}>Mangás Avaliados ({reviews.length})</h2>

                        {reviews.length === 0 ? (
                            <p>Este utilizador ainda não fez nenhuma avaliação de mangá.</p>
                        ) : (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                                {reviews.map(rev => (
                                    <div key={rev.id} style={{ backgroundColor: 'var(--color1)', borderRadius: '10px', overflow: 'hidden', width: '300px', border: '1px solid var(--color2)' }}>
                                        <div style={{ display: 'flex', borderBottom: '1px solid var(--color2)' }}>
                                            <img src={rev.mangaImage} alt={rev.mangaTitle} style={{ width: '100px', height: '140px', objectFit: 'cover' }} />
                                            <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                <h4 style={{ fontSize: '1.1rem', margin: '0 0 10px 0' }}>{rev.mangaTitle}</h4>
                                                <div style={{ color: 'gold', fontSize: '1.2rem' }}>
                                                    {Array(5).fill(0).map((_, i) => (
                                                        <span key={i} style={{ color: i < rev.rating ? 'gold' : 'gray' }}>★</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ padding: '15px' }}>
                                            <p style={{ fontStyle: 'italic', fontSize: '0.9rem', color: '#ddd' }}>
                                                "{rev.comment || 'Sem comentário.'}"
                                            </p>
                                            <Link to={`/mangas/${rev.mangaId}`} style={{ display: 'block', marginTop: '15px', color: 'var(--color5)', textDecoration: 'underline' }}>Ver Mangá</Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default Profile;
