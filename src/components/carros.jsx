import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Mangas from '../backend/mangas';

const MyGallery = () => {
  const [items, setItems] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const data = await Mangas.getMostRead();
      if (data) setItems(data.slice(0, 7)); // Top 7 for main banner
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (items.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((current) => (current === items.length - 1 ? 0 : current + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [items.length]);

  if (items.length === 0) return <div style={{ height: '400px', width: '100%', backgroundColor: '#111' }}></div>;

  return (
    <div style={{ position: 'relative', width: '100%', height: '400px', overflow: 'hidden', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
      {items.map((post, index) => (
        <div
          key={post.id}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: index === activeIndex ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out',
            zIndex: index === activeIndex ? 1 : 0
          }}
        >
          <Link to={`/mangas/${post.id}`}>
            <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }} />
            <div style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              width: '100%',
              padding: '60px 30px 30px',
              background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0) 100%)',
              color: 'white',
              textAlign: 'left'
            }}>
              <h2 style={{ margin: '0 0 10px 0', textShadow: '2px 2px 4px rgba(0,0,0,0.9)', fontWeight: '800', fontSize: '2rem' }}>{post.title}</h2>
              <p style={{ margin: 0, fontSize: '15px', color: '#eaeaea', textShadow: '1px 1px 3px rgba(0,0,0,0.9)', maxWidth: '80%' }}>
                {post.description ? post.description.substring(0, 200) + '...' : 'Sem descrição disponível. Clica para ver detalhes.'}
              </p>
            </div>
          </Link>
        </div>
      ))}

      {/* Navigation Bullets */}
      <div style={{ position: 'absolute', bottom: '20px', right: '30px', zIndex: 2, display: 'flex', gap: '10px' }}>
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              border: '2px solid white',
              backgroundColor: index === activeIndex ? 'white' : 'transparent',
              padding: 0,
              cursor: 'pointer',
              transition: 'background-color 0.3s',
              boxShadow: '0 2px 4px rgba(0,0,0,0.6)'
            }}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default MyGallery;
