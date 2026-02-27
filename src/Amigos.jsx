import React, { useState, useEffect, useRef } from 'react';
import Nav from './components/nav';
import SideMenu from './components/sideMenu';
import Social from './backend/social';
import Forum from './backend/forum';
import { Link } from 'react-router-dom';
import './bg.css';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

// ---------- FORUM POST CARD ----------
function PostCard({ post, currentUid }) {
    const [expanded, setExpanded] = useState(false);
    const [replies, setReplies] = useState([]);
    const [replyText, setReplyText] = useState('');
    const [sending, setSending] = useState(false);

    useEffect(() => {
        if (!expanded) return;
        const unsub = Forum.listenToReplies(post.id, setReplies);
        return () => unsub();
    }, [expanded, post.id]);

    const handleLike = () => Forum.toggleLike(post.id);

    const handleReply = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;
        setSending(true);
        await Forum.addReply(post.id, replyText);
        setReplyText('');
        setSending(false);
    };

    const liked = currentUid && (post.likes || []).includes(currentUid);
    const ts = post.timestamp?.toDate ? post.timestamp.toDate().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';

    return (
        <div style={{ backgroundColor: 'var(--color1)', borderRadius: '12px', border: '1px solid var(--color2)', overflow: 'hidden', marginBottom: '16px' }}>
            <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <Link to={`/perfil/${post.uid}`}>
                        <img src={post.avatar || 'https://pbs.twimg.com/media/FCvrblIX0AI6sMJ.jpg'} alt="av" style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color2)' }} />
                    </Link>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '5px' }}>
                            <Link to={`/perfil/${post.uid}`} style={{ fontWeight: 'bold', color: 'var(--color5)' }}>{post.nickname}</Link>
                            <span style={{ color: '#666', fontSize: '0.8rem' }}>{ts}</span>
                        </div>
                        <h3 style={{ margin: '8px 0 6px 0', color: 'white', fontSize: '1.1rem' }}>{post.title}</h3>
                        <p style={{ color: '#ccc', fontSize: '0.9rem', lineHeight: '1.4', margin: 0 }}>{post.body}</p>
                        {post.tags?.length > 0 && (
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
                                {post.tags.map(tag => (
                                    <span key={tag} style={{ backgroundColor: 'var(--color7)', padding: '2px 10px', borderRadius: '20px', fontSize: '0.75rem', color: 'var(--color2)', border: '1px solid var(--color2)' }}>#{tag}</span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '15px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <button onClick={handleLike} style={{ background: 'none', border: 'none', cursor: 'pointer', color: liked ? '#ff6b6b' : '#888', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem' }}>
                        {liked ? '❤️' : '🤍'} {(post.likes || []).length}
                    </button>
                    <button onClick={() => setExpanded(!expanded)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem' }}>
                        💬 {post.replyCount || 0} {expanded ? '▲' : '▼'}
                    </button>
                </div>
            </div>

            {expanded && (
                <div style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    {replies.map(r => (
                        <div key={r.id} style={{ display: 'flex', gap: '10px', marginBottom: '12px', alignItems: 'flex-start' }}>
                            <img src={r.avatar || 'https://pbs.twimg.com/media/FCvrblIX0AI6sMJ.jpg'} alt="av" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                            <div style={{ backgroundColor: 'var(--color1)', padding: '8px 12px', borderRadius: '8px', flex: 1 }}>
                                <span style={{ color: 'var(--color5)', fontWeight: 'bold', fontSize: '0.85rem' }}>{r.nickname}</span>
                                <p style={{ margin: '4px 0 0 0', color: '#ddd', fontSize: '0.85rem' }}>{r.body}</p>
                            </div>
                        </div>
                    ))}
                    {currentUid ? (
                        <form onSubmit={handleReply} style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                            <input
                                value={replyText}
                                onChange={e => setReplyText(e.target.value)}
                                placeholder="Escreve uma resposta..."
                                style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color2)', backgroundColor: 'var(--color6)', color: 'white' }}
                            />
                            <button type="submit" disabled={sending} style={{ padding: '8px 16px', backgroundColor: 'var(--color5)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>↑</button>
                        </form>
                    ) : <p style={{ color: '#888', fontSize: '0.85rem' }}>Faz login para responder.</p>}
                </div>
            )}
        </div>
    );
}

// ---------- CREATE POST MODAL ----------
function CreatePostModal({ onClose, onCreated }) {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [tagsRaw, setTagsRaw] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !body.trim()) return;
        setLoading(true);
        const tags = tagsRaw.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
        await Forum.createPost(title.trim(), body.trim(), tags);
        setLoading(false);
        onCreated();
        onClose();
    };

    return (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ backgroundColor: 'var(--color1)', borderRadius: '12px', border: '1px solid var(--color2)', padding: '24px', width: '100%', maxWidth: '500px', color: 'white' }}>
                <h2 style={{ marginBottom: '20px', color: 'var(--color5)' }}>✍️ Criar Post</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título do post..." required
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color2)', backgroundColor: 'var(--color6)', color: 'white' }} />
                    <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Conta a tua ideia, dúvida ou opinião..." required rows={5}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color2)', backgroundColor: 'var(--color6)', color: 'white', resize: 'vertical' }} />
                    <input value={tagsRaw} onChange={e => setTagsRaw(e.target.value)} placeholder="Tags: spoiler, discussão, recomendação (separadas por vírgula)"
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color2)', backgroundColor: 'var(--color6)', color: 'white' }} />
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={onClose} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#444', color: 'white', cursor: 'pointer' }}>Cancelar</button>
                        <button type="submit" disabled={loading} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--color5)', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>
                            {loading ? 'Publicando...' : 'Publicar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ---------- MAIN PAGE ----------
function Amigos() {
    const [activeTab, setActiveTab] = useState('forum');
    const [friends, setFriends] = useState([]);
    const [requests, setRequests] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [posts, setPosts] = useState([]);
    const [activityFeed, setActivityFeed] = useState([]);
    const [topMangas, setTopMangas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [currentUid, setCurrentUid] = useState(null);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, u => setCurrentUid(u?.uid || null));
        return () => unsub();
    }, []);

    // Real-time friends
    useEffect(() => {
        const unsubProfile = Social.listenToMyProfile(async (myProfile) => {
            if (myProfile) {
                const friendsData = await Social.getUsersProfiles(myProfile.friends || []);
                setFriends(friendsData);
                const reqData = await Social.getUsersProfiles(myProfile.friendRequests || []);
                setRequests(reqData);
            }
            setLoading(false);
        });
        return () => unsubProfile();
    }, []);

    // Real-time forum posts
    useEffect(() => {
        const unsub = Forum.listenToPosts(setPosts);
        return () => unsub();
    }, []);

    // Activity + Rankings
    useEffect(() => {
        Forum.getActivityFeed().then(setActivityFeed);
        Forum.getTopRatedMangas().then(setTopMangas);
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        const results = await Social.searchUsers(searchQuery);
        setSearchResults(results);
    };

    const handleSendRequest = async (uid) => {
        const success = await Social.sendFriendRequest(uid);
        if (success) alert('Pedido enviado!');
    };

    const handleAccept = async (uid) => {
        await Social.acceptFriendRequest(uid);
    };

    const handleDecline = async (uid) => {
        await Social.declineFriendRequest(uid);
    };

    const handleGoToChat = async (friendUid) => {
        const myUid = Social.getUid();
        const chatId = await Social.createOrGetChatRoom(myUid, friendUid);
        if (chatId) window.location.href = `/chat/${chatId}`;
    };

    const TABS = [
        { key: 'forum', label: '💬 Fórum' },
        { key: 'amigos', label: '👥 Amigos' },
        { key: 'feed', label: '📰 Feed' },
        { key: 'rankings', label: '🏆 Rankings' },
    ];

    const tabStyle = (key) => ({
        padding: '10px 20px', cursor: 'pointer', fontWeight: 'bold',
        borderRadius: '8px 8px 0 0', border: 'none',
        backgroundColor: activeTab === key ? 'var(--color2)' : 'transparent',
        color: activeTab === key ? 'white' : '#aaa',
        transition: '0.2s all'
    });

    return (
        <div className="app">
            <SideMenu />
            <Nav />
            <div className="Black"></div>

            <div style={{ marginTop: '80px', width: '94%', maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto', color: 'white', paddingBottom: '60px' }}>
                <h1 style={{ color: 'var(--color2)', marginBottom: '20px' }}>🌐 Comunidade</h1>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '4px', borderBottom: '2px solid var(--color2)', marginBottom: '24px', flexWrap: 'wrap' }}>
                    {TABS.map(t => (
                        <button key={t.key} style={tabStyle(t.key)} onClick={() => setActiveTab(t.key)}>{t.label}</button>
                    ))}
                </div>

                {/* ====== FORUM TAB ====== */}
                {activeTab === 'forum' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, color: 'var(--color5)' }}>Discussões Recentes</h2>
                            {currentUid && (
                                <button onClick={() => setShowCreate(true)} style={{ padding: '10px 20px', backgroundColor: 'var(--color5)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                                    + Novo Post
                                </button>
                            )}
                        </div>
                        {posts.length === 0 && <p style={{ color: '#888' }}>Nenhuma discussão ainda. Cria o primeiro post!</p>}
                        {posts.map(post => <PostCard key={post.id} post={post} currentUid={currentUid} />)}
                    </div>
                )}

                {/* ====== AMIGOS TAB ====== */}
                {activeTab === 'amigos' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* Search */}
                        <div style={{ backgroundColor: 'var(--color1)', padding: '20px', borderRadius: '10px', border: '1px solid var(--color2)' }}>
                            <h2>🔍 Procurar Utilizadores</h2>
                            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                                <input type="text" placeholder="Procurar por Nickname..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                    style={{ flex: 1, padding: '10px', borderRadius: '5px', border: 'none' }} />
                                <button type="submit" style={{ padding: '10px 20px', borderRadius: '5px', border: 'none', backgroundColor: 'var(--color2)', color: 'white', cursor: 'pointer' }}>Buscar</button>
                            </form>
                            {searchResults.length > 0 && (
                                <div style={{ marginTop: '16px', display: 'flex', gap: '12px', overflowX: 'auto', flexWrap: 'wrap' }}>
                                    {searchResults.map(user => (
                                        <div key={user.uid} style={{ textAlign: 'center', backgroundColor: 'var(--color7)', padding: '12px', borderRadius: '8px', minWidth: '130px' }}>
                                            <img src={user.img || 'https://pbs.twimg.com/media/FCvrblIX0AI6sMJ.jpg'} alt="av" style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', marginBottom: '8px' }} />
                                            <h4 style={{ margin: '0 0 8px 0', fontSize: '0.95rem' }}>{user.nickname}</h4>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <button onClick={() => handleSendRequest(user.uid)} style={{ padding: '4px 10px', borderRadius: '4px', border: 'none', backgroundColor: 'var(--color5)', color: 'white', cursor: 'pointer', fontSize: '0.8rem' }}>Adicionar</button>
                                                <Link to={`/perfil/${user.uid}`} style={{ fontSize: '0.8rem', color: 'lightblue' }}>Ver Perfil</Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Requests */}
                        {requests.length > 0 && (
                            <div style={{ backgroundColor: 'var(--color1)', padding: '20px', borderRadius: '10px', border: '1px solid var(--color2)' }}>
                                <h2>📨 Pedidos de Amizade ({requests.length})</h2>
                                <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {requests.map(req => (
                                        <div key={req.uid} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--color7)', padding: '10px', borderRadius: '8px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <img src={req.img || 'https://pbs.twimg.com/media/FCvrblIX0AI6sMJ.jpg'} alt="av" style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover' }} />
                                                <span style={{ fontWeight: 'bold' }}>{req.nickname}</span>
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button onClick={() => handleAccept(req.uid)} style={{ padding: '6px 14px', borderRadius: '5px', border: 'none', backgroundColor: 'green', color: 'white', cursor: 'pointer' }}>Aceitar</button>
                                                <button onClick={() => handleDecline(req.uid)} style={{ padding: '6px 14px', borderRadius: '5px', border: 'none', backgroundColor: 'red', color: 'white', cursor: 'pointer' }}>Recusar</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Friends list */}
                        <div style={{ backgroundColor: 'var(--color1)', padding: '20px', borderRadius: '10px', border: '1px solid var(--color2)' }}>
                            <h2>👥 Meus Amigos ({friends.length})</h2>
                            {loading && <p>Carregando...</p>}
                            {!loading && friends.length === 0 && <p style={{ color: '#888' }}>Ainda não tens amigos. Procura utilizadores acima!</p>}
                            <div style={{ marginTop: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                {friends.map(friend => (
                                    <div key={friend.uid} style={{ width: '140px', textAlign: 'center', backgroundColor: 'var(--color7)', padding: '14px', borderRadius: '10px' }}>
                                        <img src={friend.img || 'https://pbs.twimg.com/media/FCvrblIX0AI6sMJ.jpg'} alt="av" style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color2)', marginBottom: '8px' }} />
                                        <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem' }}>{friend.nickname}</h4>
                                        <button onClick={() => handleGoToChat(friend.uid)} style={{ padding: '4px', width: '100%', fontSize: '0.8rem', backgroundColor: 'var(--color2)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '4px' }}>💬 Chat</button>
                                        <Link to={`/perfil/${friend.uid}`} style={{ fontSize: '0.8rem', color: 'lightblue' }}>Ver Perfil</Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ====== FEED TAB ====== */}
                {activeTab === 'feed' && (
                    <div>
                        <h2 style={{ marginBottom: '20px', color: 'var(--color5)' }}>📰 Atividade Recente da Comunidade</h2>
                        {activityFeed.length === 0 && <p style={{ color: '#888' }}>Nenhuma atividade ainda.</p>}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {activityFeed.map(item => (
                                <div key={item.id} style={{ display: 'flex', gap: '14px', backgroundColor: 'var(--color1)', borderRadius: '10px', padding: '14px', border: '1px solid var(--color2)', alignItems: 'center' }}>
                                    <img src={item.mangaImage} alt={item.mangaTitle} style={{ width: '55px', height: '75px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }} />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ margin: 0, color: '#ccc', fontSize: '0.85rem' }}>
                                            Alguém avaliou <Link to={`/mangas/${item.mangaId}`} style={{ color: 'var(--color5)', fontWeight: 'bold' }}>{item.mangaTitle}</Link>
                                        </p>
                                        <div style={{ marginTop: '6px', fontSize: '1.1rem' }}>
                                            {Array(5).fill(0).map((_, i) => <span key={i} style={{ color: i < item.rating ? 'gold' : '#555' }}>★</span>)}
                                        </div>
                                        {item.comment && <p style={{ margin: '6px 0 0 0', color: '#aaa', fontSize: '0.85rem', fontStyle: 'italic' }}>"{item.comment}"</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ====== RANKINGS TAB ====== */}
                {activeTab === 'rankings' && (
                    <div>
                        <h2 style={{ marginBottom: '20px', color: 'var(--color5)' }}>🏆 Top Mangás pela Comunidade</h2>
                        {topMangas.length === 0 && <p style={{ color: '#888' }}>Ainda sem avaliações suficientes.</p>}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {topMangas.map((m, idx) => (
                                <Link to={`/mangas/${m.mangaId}`} key={m.mangaId} style={{ display: 'flex', gap: '15px', alignItems: 'center', backgroundColor: 'var(--color1)', borderRadius: '10px', padding: '12px', border: '1px solid var(--color2)', transition: '0.2s', textDecoration: 'none' }}>
                                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: idx === 0 ? 'gold' : idx === 1 ? 'silver' : idx === 2 ? '#cd7f32' : '#aaa', minWidth: '32px', textAlign: 'center' }}>
                                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                                    </span>
                                    <img src={m.mangaImage} alt={m.mangaTitle} style={{ width: '45px', height: '60px', objectFit: 'cover', borderRadius: '5px' }} />
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: 0, color: 'white' }}>{m.mangaTitle}</h4>
                                        <p style={{ margin: '4px 0 0 0', color: '#888', fontSize: '0.85rem' }}>{m.count} avaliação{m.count !== 1 ? 'ões' : ''}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{ fontSize: '1.4rem', color: 'gold' }}>★</span>
                                        <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'white' }}> {m.avg}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {showCreate && <CreatePostModal onClose={() => setShowCreate(false)} onCreated={() => { }} />}
        </div>
    );
}

export default Amigos;
