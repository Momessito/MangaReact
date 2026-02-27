import React, { useState, useEffect, useRef } from 'react';
import Nav from './components/nav';
import SideMenu from './components/sideMenu';
import Social from './backend/social';
import { useParams, Link } from 'react-router-dom';
import './bg.css';

function Chat() {
    const { id: chatId } = useParams();
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const myUid = Social.getUid();
    const bottomRef = useRef(null);

    useEffect(() => {
        if (!chatId) return;

        // Firebase real-time subscription
        const unsubscribe = Social.listenToMessages(chatId, (newMessages) => {
            setMessages(newMessages);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [chatId]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        await Social.sendMessage(chatId, inputText);
        setInputText('');
    };

    return (
        <div className="app">
            <SideMenu />
            <Nav />
            <div className="Black"></div>

            <div style={{ marginTop: '80px', width: '90%', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto', height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column', color: 'white' }}>

                {/* Header */}
                <div style={{ padding: '15px 20px', backgroundColor: 'var(--color1)', borderRadius: '10px 10px 0 0', border: '1px solid var(--color2)', borderBottom: 'none', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <Link to="/amigos" style={{ textDecoration: 'none', color: 'var(--color5)', fontSize: '1.2rem' }}>&larr; Voltar</Link>
                    <h2 style={{ margin: 0 }}>Chat Direto</h2>
                </div>

                {/* Messages List */}
                <div style={{ flex: 1, backgroundColor: 'var(--color6)', padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', borderLeft: '1px solid var(--color2)', borderRight: '1px solid var(--color2)' }}>

                    {messages.length === 0 && (
                        <p style={{ textAlign: 'center', marginTop: '20px', color: 'gray' }}>Mande a sua primeira mensagem!</p>
                    )}

                    {messages.map((msg, index) => {
                        const isMe = msg.senderId === myUid;
                        return (
                            <div key={msg.id || index} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '70%', display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                                <div style={{
                                    padding: '10px 15px',
                                    borderRadius: '15px',
                                    backgroundColor: isMe ? 'var(--color2)' : 'var(--color1)',
                                    color: 'white',
                                    borderBottomRightRadius: isMe ? '0' : '15px',
                                    borderBottomLeftRadius: isMe ? '15px' : '0'
                                }}>
                                    {msg.text}
                                </div>
                                {msg.timestamp && <small style={{ fontSize: '0.7rem', color: 'gray', marginTop: '5px' }}>{new Date(msg.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>}
                            </div>
                        );
                    })}
                    <div ref={bottomRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSend} style={{ display: 'flex', padding: '15px', backgroundColor: 'var(--color1)', borderRadius: '0 0 10px 10px', border: '1px solid var(--color2)', borderTop: 'none', gap: '10px' }}>
                    <input
                        type="text"
                        placeholder="Escreva uma mensagem..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        style={{ flex: 1, padding: '12px', borderRadius: '25px', border: 'none', outline: 'none', backgroundColor: 'var(--color7)', color: 'white' }}
                    />
                    <button type="submit" style={{ padding: '0 25px', borderRadius: '25px', border: 'none', backgroundColor: 'var(--color5)', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>Enviar</button>
                </form>

            </div>
        </div>
    );
}

export default Chat;
