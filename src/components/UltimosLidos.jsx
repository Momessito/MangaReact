import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Mangas from '../backend/mangas';
import User from '../backend/users';

const UltimosLidos = () => {
    const [items, setItems] = useState([]);

    const getItems = async () => {
        try {
            const readMangaIds = await User.getRecentlyRead();
            if (!readMangaIds || readMangaIds.length === 0) return;

            const fetchedMangas = [];
            // Cap to top 6 to prevent slow loads
            for (let id of readMangaIds.slice(0, 6)) {
                const mangaDetail = await Mangas.getMangaById(id);
                if (mangaDetail) fetchedMangas.push(mangaDetail);
            }
            setItems(fetchedMangas);
        } catch (Error) {
            console.log(Error);
        }
    }

    useEffect(() => {
        getItems();
    }, []);

    if (items.length === 0) return null;

    return (
        <div style={{ padding: '20px', backgroundColor: 'var(--color1)', borderRadius: '10px', marginTop: '20px', width: '90%', marginLeft: '50%', transform: 'translate(-50%)', border: '1px solid var(--color2)' }}>
            <h1 style={{ color: 'white', fontSize: '24px', marginBottom: '15px' }}>Últimos Lidos</h1>
            <div style={{ display: 'flex', overflowX: 'auto', gap: '15px', paddingBottom: '10px', flexDirection: 'row' }} className="scrollH">
                {items.map((post) => (
                    <div className='categories' key={post.id} style={{ minWidth: '140px', flex: '0 0 auto', margin: 0, border: 'none', backgroundColor: 'transparent', padding: 0 }}>
                        <Link to={'/mangas/' + post.id}>
                            <img src={post.image} className='carroselImg' alt={post.id} style={{ height: '200px', width: '100%', objectFit: 'cover', borderRadius: '5px' }} />
                            <h6 className='bottom-title' style={{ color: 'white', marginTop: '8px', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'center' }}>{post.title}</h6>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UltimosLidos;
