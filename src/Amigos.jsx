import React, { useState, useEffect } from 'react';
import Nav from './components/nav';
import SideMenu from './components/sideMenu';
import Social from './backend/social';
import { Link } from 'react-router-dom';
import './bg.css';

function Amigos() {
    const [friends, setFriends] = useState([]);
    const [requests, setRequests] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = Social.listenToMyProfile(async (myProfile) => {
            if (myProfile) {
                // Load accepted friends
                const friendsData = await Social.getUsersProfiles(myProfile.friends || []);
                setFriends(friendsData);

                // Load incoming friend requests
                const reqData = await Social.getUsersProfiles(myProfile.friendRequests || []);
                setRequests(reqData);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        const results = await Social.searchUsers(searchQuery);
        setSearchResults(results);
    };

    const handleSendRequest = async (uid) => {
        const success = await Social.sendFriendRequest(uid);
        if (success) {
            alert('Pedido enviado com sucesso!');
        } else {
            alert('Erro ao enviar pedido.');
        }
    };

    const handleAccept = async (uid) => {
        const success = await Social.acceptFriendRequest(uid);
        if (success) {
            alert('Amizade aceite!');
            // It will auto-refresh thanks to the reactive listener 
        }
    };

    const handleDecline = async (uid) => {
        const success = await Social.declineFriendRequest(uid);
        // It will auto-refresh thanks to the reactive listener
    };

    const handleGoToChat = async (friendUid) => {
        const myUid = Social.getUid();
        const chatId = await Social.createOrGetChatRoom(myUid, friendUid);
        if (chatId) {
            window.location.href = `/chat/${chatId}`;
        }
    };

    return (
        <div className="app">
            <SideMenu />
            <Nav />
            <div className="Black"></div>

            <div style={{ marginTop: '80px', width: '90%', marginLeft: 'auto', marginRight: 'auto', color: 'white' }}>
                <h1 style={{ color: 'var(--color2)', marginBottom: '20px' }}>Comunidade & Amigos</h1>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

                    {/* Search Section */}
                    <div style={{ backgroundColor: 'var(--color1)', padding: '20px', borderRadius: '10px', border: '1px solid var(--color2)' }}>
                        <h2>Procurar Utilizadores</h2>
                        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                            <input
                                type="text"
                                placeholder="Procurar por Nickname..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ flex: 1, padding: '10px', borderRadius: '5px', border: 'none' }}
                            />
                            <button type="submit" style={{ padding: '10px 20px', borderRadius: '5px', border: 'none', backgroundColor: 'var(--color2)', color: 'white', cursor: 'pointer' }}>Buscar</button>
                        </form>

                        {searchResults.length > 0 && (
                            <div style={{ marginTop: '20px', display: 'flex', gap: '15px', overflowX: 'auto' }}>
                                {searchResults.map(user => (
                                    <div key={user.uid} style={{ textAlign: 'center', backgroundColor: 'var(--color7)', padding: '15px', borderRadius: '5px', minWidth: '150px' }}>
                                        <img src={user.img || 'https://pbs.twimg.com/media/FCvrblIX0AI6sMJ.jpg'} alt="avatar" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} />
                                        <h4 style={{ margin: '10px 0', fontSize: '1rem' }}>{user.nickname}</h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                            <button onClick={() => handleSendRequest(user.uid)} style={{ padding: '5px 10px', borderRadius: '3px', border: 'none', backgroundColor: 'var(--color5)', color: 'white', cursor: 'pointer' }}>Adicionar</button>
                                            <Link to={`/perfil/${user.uid}`} style={{ fontSize: '0.8rem', color: 'lightblue', textDecoration: 'underline' }}>Ver Perfil</Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Friend Requests Section */}
                    {requests.length > 0 && (
                        <div style={{ backgroundColor: 'var(--color1)', padding: '20px', borderRadius: '10px', border: '1px solid var(--color2)' }}>
                            <h2>Pedidos de Amizade Pendentes</h2>
                            <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {requests.map(req => (
                                    <div key={req.uid} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--color7)', padding: '10px', borderRadius: '5px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <img src={req.img || 'https://pbs.twimg.com/media/FCvrblIX0AI6sMJ.jpg'} alt="avatar" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                                            <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{req.nickname}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button onClick={() => handleAccept(req.uid)} style={{ padding: '8px 15px', borderRadius: '5px', border: 'none', backgroundColor: 'green', color: 'white', cursor: 'pointer' }}>Aceitar</button>
                                            <button onClick={() => handleDecline(req.uid)} style={{ padding: '8px 15px', borderRadius: '5px', border: 'none', backgroundColor: 'red', color: 'white', cursor: 'pointer' }}>Recusar</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Friends List Section */}
                    <div style={{ backgroundColor: 'var(--color1)', padding: '20px', borderRadius: '10px', border: '1px solid var(--color2)', marginBottom: '50px' }}>
                        <h2>Meus Amigos</h2>
                        {loading && <p>Carregando...</p>}
                        {!loading && friends.length === 0 ? (
                            <p style={{ marginTop: '10px' }}>Ainda não tens amigos na tua lista.</p>
                        ) : (
                            <div style={{ marginTop: '20px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                                {friends.map(friend => (
                                    <div key={friend.uid} style={{ width: '150px', textAlign: 'center', backgroundColor: 'var(--color7)', padding: '15px', borderRadius: '10px' }}>
                                        <img src={friend.img || 'https://pbs.twimg.com/media/FCvrblIX0AI6sMJ.jpg'} alt="avatar" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color2)' }} />
                                        <h4 style={{ margin: '15px 0 5px 0', fontSize: '1.2rem' }}>{friend.nickname}</h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '10px' }}>
                                            <button onClick={() => handleGoToChat(friend.uid)} style={{ padding: '5px', fontSize: '0.8rem', backgroundColor: 'var(--color2)', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Chat</button>
                                            <Link to={`/perfil/${friend.uid}`} style={{ fontSize: '0.8rem', color: 'lightblue', textDecoration: 'underline' }}>Ver Perfil</Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Amigos;
