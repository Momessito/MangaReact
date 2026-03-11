import React from 'react';
import { Link } from 'react-router-dom';
import Nav from './components/nav';
import SideMenu from './components/sideMenu';

function NotFound() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Nav />
            <SideMenu />
            <div className='Black'></div>
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 20px',
                textAlign: 'center',
                color: 'white'
            }}>
                <div style={{
                    fontSize: '120px',
                    fontWeight: '900',
                    lineHeight: 1,
                    background: 'linear-gradient(135deg, var(--color5), var(--color2))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '10px'
                }}>
                    404
                </div>

                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '10px' }}>
                    Página não encontrada
                </div>

                <p style={{ color: '#888', maxWidth: '400px', marginBottom: '30px' }}>
                    Parece que você se perdeu numa dungeon sem saída... 
                    Esta página não existe ou foi removida.
                </p>

                <div style={{
                    fontSize: '80px',
                    marginBottom: '30px',
                    animation: 'float 3s ease-in-out infinite'
                }}>
                    📖💨
                </div>

                <Link to="/" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '14px 30px',
                    backgroundColor: 'var(--color5)',
                    color: 'white',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    boxShadow: '0 4px 15px rgba(238, 141, 122, .3)',
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146z" />
                    </svg>
                    Voltar à Home
                </Link>

                <style>{`
                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-15px); }
                    }
                `}</style>
            </div>
        </div>
    );
}

export default NotFound;
