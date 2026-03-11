import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <div style={{
            backgroundColor: 'rgba(0,0,0,0.3)',
            borderTop: '1px solid var(--color4)',
            padding: '40px 20px 30px',
            marginTop: '40px',
            color: '#888'
        }}>
            <div style={{
                maxWidth: '900px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '30px'
            }}>
                {/* Brand */}
                <div>
                    <h3 style={{ color: 'white', fontSize: '1.3rem', marginBottom: '10px' }}>
                        Yūsha
                    </h3>
                    <p style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
                        Leia mangás e assista animes, tudo em um só lugar. 100% gratuito.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 style={{ color: 'var(--color5)', fontSize: '0.95rem', marginBottom: '12px' }}>Navegação</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <li><Link to="/" style={{ color: '#888', textDecoration: 'none', fontSize: '0.85rem' }}>🏠 Início</Link></li>
                        <li><Link to="/recentes" style={{ color: '#888', textDecoration: 'none', fontSize: '0.85rem' }}>📚 Recentes</Link></li>
                        <li><Link to="/Populares" style={{ color: '#888', textDecoration: 'none', fontSize: '0.85rem' }}>🔥 Populares</Link></li>
                        <li><Link to="/animes" style={{ color: '#888', textDecoration: 'none', fontSize: '0.85rem' }}>🎬 Animes</Link></li>
                        <li><Link to="/downloads" style={{ color: '#888', textDecoration: 'none', fontSize: '0.85rem' }}>📥 Downloads</Link></li>
                    </ul>
                </div>

                {/* Social */}
                <div>
                    <h4 style={{ color: 'var(--color5)', fontSize: '0.95rem', marginBottom: '12px' }}>Comunidade</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <li><Link to="/amigos" style={{ color: '#888', textDecoration: 'none', fontSize: '0.85rem' }}>👥 Amigos</Link></li>
                        <li><Link to="/favoritos" style={{ color: '#888', textDecoration: 'none', fontSize: '0.85rem' }}>⭐ Favoritos</Link></li>
                        <li><Link to="/config" style={{ color: '#888', textDecoration: 'none', fontSize: '0.85rem' }}>⚙️ Configurações</Link></li>
                        <li><Link to="/historico" style={{ color: '#888', textDecoration: 'none', fontSize: '0.85rem' }}>📜 Histórico</Link></li>
                    </ul>
                </div>
            </div>

            {/* Bottom bar */}
            <div style={{
                borderTop: '1px solid rgba(255,255,255,0.05)',
                marginTop: '30px',
                paddingTop: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px',
                fontSize: '0.8rem'
            }}>
                <span>© {new Date().getFullYear()} Yūsha. All rights reserved.</span>
                <span style={{ color: '#555' }}>v2.0 • PWA Enabled</span>
            </div>
        </div>
    );
}

export default Footer;