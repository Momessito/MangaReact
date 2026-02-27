import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import {
    collection, addDoc, onSnapshot, orderBy, query,
    serverTimestamp, deleteDoc, doc
} from 'firebase/firestore';

function ChapterComments({ mangaId, chapterId }) {
    const [comments, setComments] = useState([]);
    const [text, setText] = useState('');
    const [sending, setSending] = useState(false);
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);

    // Listen for auth and fetch user profile
    useEffect(() => {
        const unsub = auth.onAuthStateChanged(async (firebaseUser) => {
            setUser(firebaseUser);
            if (firebaseUser) {
                try {
                    const { doc: firestoreDoc, getDoc } = await import('firebase/firestore');
                    const snap = await getDoc(firestoreDoc(db, 'users', firebaseUser.uid));
                    if (snap.exists()) setUserData(snap.data());
                } catch (e) { }
            } else {
                setUserData(null);
            }
        });
        return () => unsub();
    }, []);

    // Listen to real-time comments for this chapter
    useEffect(() => {
        if (!mangaId || !chapterId) return;
        const colRef = collection(db, 'chapter_comments', `${mangaId}_${chapterId}`, 'comments');
        const q = query(colRef, orderBy('timestamp', 'asc'));
        const unsub = onSnapshot(q, (snap) => {
            const list = [];
            snap.forEach(d => list.push({ id: d.id, ...d.data() }));
            setComments(list);
        });
        return () => unsub();
    }, [mangaId, chapterId]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!text.trim() || !user) return;
        setSending(true);
        try {
            const colRef = collection(db, 'chapter_comments', `${mangaId}_${chapterId}`, 'comments');
            await addDoc(colRef, {
                uid: user.uid,
                nickname: userData?.nickname || user.email?.split('@')[0] || 'Anónimo',
                avatar: userData?.img || '',
                text: text.trim(),
                timestamp: serverTimestamp()
            });
            setText('');
        } catch (err) {
            console.error(err);
        }
        setSending(false);
    };

    const handleDelete = async (commentId, commentUid) => {
        if (!user || user.uid !== commentUid) return;
        try {
            const commentRef = doc(db, 'chapter_comments', `${mangaId}_${chapterId}`, 'comments', commentId);
            await deleteDoc(commentRef);
        } catch (err) {
            console.error(err);
        }
    };

    const formatTime = (ts) => {
        if (!ts) return '';
        const date = ts.toDate ? ts.toDate() : new Date(ts);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div style={{
            width: '90%', maxWidth: '700px', margin: '30px auto 60px auto',
            backgroundColor: 'var(--color1)', borderRadius: '12px',
            border: '1px solid var(--color2)', padding: '20px', color: 'white'
        }}>
            <h3 style={{ marginBottom: '20px', color: 'var(--color2)', borderBottom: '1px solid var(--color2)', paddingBottom: '10px' }}>
                💬 Comentários do Capítulo ({comments.length})
            </h3>

            {/* Comment list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '400px', overflowY: 'auto', marginBottom: '20px' }}>
                {comments.length === 0 && (
                    <p style={{ color: '#888', fontSize: '0.9rem' }}>Ainda não há comentários. Sê o primeiro!</p>
                )}
                {comments.map(c => (
                    <div key={c.id} style={{
                        display: 'flex', gap: '12px', alignItems: 'flex-start',
                        backgroundColor: 'var(--color6)', padding: '12px', borderRadius: '8px'
                    }}>
                        <img
                            src={c.avatar || 'https://pbs.twimg.com/media/FCvrblIX0AI6sMJ.jpg'}
                            alt="avatar"
                            style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color2)', flexShrink: 0 }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '5px' }}>
                                <span style={{ fontWeight: 'bold', color: 'var(--color5)', fontSize: '0.95rem' }}>{c.nickname}</span>
                                <span style={{ color: '#888', fontSize: '0.75rem' }}>{formatTime(c.timestamp)}</span>
                            </div>
                            <p style={{ margin: '6px 0 0 0', fontSize: '0.9rem', wordBreak: 'break-word', lineHeight: '1.4' }}>{c.text}</p>
                            {user && user.uid === c.uid && (
                                <button onClick={() => handleDelete(c.id, c.uid)}
                                    style={{ marginTop: '6px', background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '0.75rem', padding: 0 }}>
                                    🗑️ Apagar
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input */}
            {user ? (
                <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                    <img
                        src={userData?.img || 'https://pbs.twimg.com/media/FCvrblIX0AI6sMJ.jpg'}
                        alt="my avatar"
                        style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color2)', flexShrink: 0 }}
                    />
                    <textarea
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder="Escreve um comentário sobre este capítulo..."
                        rows={2}
                        style={{
                            flex: 1, backgroundColor: 'var(--color6)', border: '1px solid var(--color2)',
                            borderRadius: '8px', padding: '10px', color: 'white', resize: 'none', fontSize: '0.9rem'
                        }}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
                    />
                    <button type="submit" disabled={sending || !text.trim()} style={{
                        backgroundColor: 'var(--color5)', color: 'white', border: 'none',
                        borderRadius: '8px', padding: '10px 16px', cursor: 'pointer',
                        fontWeight: 'bold', flexShrink: 0, opacity: sending || !text.trim() ? 0.5 : 1
                    }}>
                        {sending ? '...' : '↑'}
                    </button>
                </form>
            ) : (
                <p style={{ color: '#888', textAlign: 'center', fontSize: '0.9rem' }}>
                    <a href="/login" style={{ color: 'var(--color5)' }}>Faz login</a> para comentar.
                </p>
            )}
        </div>
    );
}

export default ChapterComments;
