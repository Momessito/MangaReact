import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import User from '../backend/users';

const ContinueReading = () => {
    const [lastRead, setLastRead] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const ids = await User.getRecentlyRead();
                if (ids && ids.length > 0) {
                    // Get the info from localStorage about last chapter
                    const lastChap = localStorage.getItem(`lastChapter_${ids[0]}`);
                    const lastTitle = localStorage.getItem(`lastTitle_${ids[0]}`);
                    const lastImg = localStorage.getItem(`lastImg_${ids[0]}`);
                    setLastRead({
                        mangaId: ids[0],
                        chapterId: lastChap,
                        title: lastTitle || 'Continuar lendo',
                        image: lastImg || '',
                    });
                }
            } catch (e) { console.log(e); }
        };
        load();
    }, []);

    if (!lastRead || !lastRead.chapterId) return null;

    return (
        <div style={{
            margin: '12px auto',
            width: '92%',
            maxWidth: '900px',
        }}>
            <Link
                to={`/mangas/${lastRead.mangaId}/capitulos/${lastRead.chapterId}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
            >
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    backgroundColor: 'rgba(139, 114, 142, 0.15)',
                    border: '1px solid var(--color2)',
                    borderRadius: '14px',
                    backdropFilter: 'blur(10px)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                }}>
                    {lastRead.image && (
                        <img
                            src={lastRead.image}
                            alt=""
                            style={{ width: '42px', height: '56px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                        />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color5)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            ▶ Continuar Lendo
                        </div>
                        <div style={{ fontSize: '0.95rem', color: 'white', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {lastRead.title}
                        </div>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="var(--color5)" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                    </svg>
                </div>
            </Link>
        </div>
    );
};

export default ContinueReading;
