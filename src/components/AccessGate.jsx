import React, { useState, useEffect } from 'react';

// Change this password to whatever you and your friends want
const ACCESS_CODE = 'yusha2025';
const STORAGE_KEY = 'yusha_access_granted';

function AccessGate({ children }) {
    const [granted, setGranted] = useState(false);
    const [input, setInput] = useState('');
    const [error, setError] = useState(false);
    const [shake, setShake] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === ACCESS_CODE) {
            setGranted(true);
        }
        setChecking(false);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() === ACCESS_CODE) {
            localStorage.setItem(STORAGE_KEY, ACCESS_CODE);
            setGranted(true);
        } else {
            setError(true);
            setShake(true);
            setInput('');
            setTimeout(() => setShake(false), 600);
            setTimeout(() => setError(false), 2000);
        }
    };

    if (checking) return null;
    if (granted) return children;

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: 'linear-gradient(135deg, #1a1d3d, #171724, #0d0d1a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Poppins', sans-serif"
        }}>
            <div style={{
                textAlign: 'center', padding: '40px 36px',
                backgroundColor: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(139,114,142,0.3)',
                borderRadius: '20px',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                width: '90%', maxWidth: '360px',
                animation: shake ? 'shake 0.5s' : 'none'
            }}>
                {/* Logo / Icon */}
                <div style={{
                    width: '72px', height: '72px', borderRadius: '50%',
                    backgroundColor: '#8B728E', margin: '0 auto 20px auto',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2rem', boxShadow: '0 0 30px rgba(139,114,142,0.5)'
                }}>
                    📚
                </div>

                <h1 style={{ color: '#EE8D7A', fontSize: '1.6rem', marginBottom: '6px' }}>YŪSHA</h1>
                <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '30px' }}>
                    Acesso restrito — só para convidados
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <input
                        type="password"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Código de acesso..."
                        autoFocus
                        style={{
                            padding: '14px 18px', borderRadius: '10px',
                            border: `1px solid ${error ? '#ff6b6b' : 'rgba(139,114,142,0.4)'}`,
                            backgroundColor: 'rgba(255,255,255,0.06)',
                            color: 'white', fontSize: '1rem', textAlign: 'center',
                            letterSpacing: '3px', outline: 'none',
                            transition: '0.2s border'
                        }}
                    />
                    {error && (
                        <p style={{ color: '#ff6b6b', margin: 0, fontSize: '0.85rem' }}>
                            ❌ Código incorreto
                        </p>
                    )}
                    <button type="submit" style={{
                        padding: '14px', borderRadius: '10px',
                        border: 'none', backgroundColor: '#8B728E',
                        color: 'white', fontSize: '1rem', fontWeight: 'bold',
                        cursor: 'pointer', transition: '0.2s',
                    }}>
                        Entrar →
                    </button>
                </form>
            </div>

            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    20% { transform: translateX(-8px); }
                    40% { transform: translateX(8px); }
                    60% { transform: translateX(-6px); }
                    80% { transform: translateX(6px); }
                }
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
            `}</style>
        </div>
    );
}

export default AccessGate;
