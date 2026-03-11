import React, { useState, useEffect } from 'react';

function InstallBanner() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        // Don't show if already installed or dismissed
        if (window.matchMedia('(display-mode: standalone)').matches) return;
        if (localStorage.getItem('pwa-install-dismissed')) return;

        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowBanner(true);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const result = await deferredPrompt.userChoice;
        if (result.outcome === 'accepted') {
            setShowBanner(false);
        }
        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        setShowBanner(false);
        localStorage.setItem('pwa-install-dismissed', 'true');
    };

    if (!showBanner) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '70px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 30px)',
            maxWidth: '500px',
            backgroundColor: 'var(--color6)',
            border: '1px solid var(--color2)',
            borderRadius: '16px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            zIndex: 9999,
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            animation: 'slideUp 0.4s ease-out',
        }}>
            <div style={{ fontSize: '32px', flexShrink: 0 }}>📱</div>

            <div style={{ flex: 1 }}>
                <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.95rem' }}>
                    Instale o Yūsha!
                </div>
                <div style={{ color: '#aaa', fontSize: '0.8rem', marginTop: '2px' }}>
                    Acesse offline e leia direto da tela inicial
                </div>
            </div>

            <button
                onClick={handleInstall}
                style={{
                    padding: '8px 18px',
                    backgroundColor: 'var(--color5)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    flexShrink: 0
                }}
            >
                Instalar
            </button>

            <button
                onClick={handleDismiss}
                style={{
                    background: 'none',
                    border: 'none',
                    color: '#666',
                    cursor: 'pointer',
                    fontSize: '18px',
                    padding: '0 5px',
                    flexShrink: 0
                }}
            >
                ✕
            </button>

            <style>{`
                @keyframes slideUp {
                    from { transform: translateX(-50%) translateY(100px); opacity: 0; }
                    to { transform: translateX(-50%) translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}

export default InstallBanner;
