import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Mangas from '../backend/mangas';

const MyGallery = () => {
  const [items, setItems] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const data = await Mangas.getMostRead();
      if (data) setItems(data.slice(0, 7));
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

  if (items.length === 0) return (
    <div style={{
      height: '380px',
      width: '100%',
      borderRadius: '16px',
      overflow: 'hidden',
    }}>
      <div className="skeleton-pulse" style={{ width: '100%', height: '100%' }} />
      <style>{`
        @keyframes shimmer {
          0% { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .skeleton-pulse {
          background: linear-gradient(90deg, #1e1e2e 25%, #2a2a3e 50%, #1e1e2e 75%);
          background-size: 800px 100%;
          animation: shimmer 1.5s infinite ease-in-out;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '380px',
      overflow: 'hidden',
      borderRadius: '16px',
      boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
    }}>
      {items.map((post, index) => (
        <div
          key={post.id}
          style={{
            position: 'absolute',
            top: 0, left: 0,
            width: '100%', height: '100%',
            opacity: index === activeIndex ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out',
            zIndex: index === activeIndex ? 1 : 0
          }}
        >
          <Link to={`/mangas/${post.id}`}>
            <img
              src={post.image}
              alt={post.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 20%',
              }}
            />
            {/* Gradient overlay */}
            <div style={{
              position: 'absolute',
              bottom: 0, left: 0,
              width: '100%',
              padding: '80px 30px 25px',
              background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)',
              color: 'white',
            }}>
              <h2 style={{
                margin: '0 0 8px',
                fontWeight: '800',
                fontSize: '1.6rem',
                textShadow: '2px 2px 6px rgba(0,0,0,0.8)',
              }}>
                {post.title}
              </h2>
              <p style={{
                margin: 0,
                fontSize: '0.85rem',
                color: '#d0d0d0',
                textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
                maxWidth: '80%',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
                {post.description ? post.description.substring(0, 180) + '...' : 'Clica para ver detalhes'}
              </p>
            </div>
          </Link>
        </div>
      ))}

      {/* Navigation Dots */}
      <div style={{
        position: 'absolute',
        bottom: '18px',
        right: '25px',
        zIndex: 10,
        display: 'flex',
        gap: '8px',
      }}>
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            style={{
              width: index === activeIndex ? '22px' : '10px',
              height: '10px',
              borderRadius: '5px',
              border: 'none',
              backgroundColor: index === activeIndex ? 'var(--color5)' : 'rgba(255,255,255,0.4)',
              padding: 0,
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
            }}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => setActiveIndex(i => i === 0 ? items.length - 1 : i - 1)}
        style={{
          position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)',
          zIndex: 10, backgroundColor: 'rgba(0,0,0,0.4)', color: 'white',
          border: 'none', borderRadius: '50%', width: '38px', height: '38px',
          cursor: 'pointer', fontSize: '1.3rem', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background-color 0.2s',
        }}
      >‹</button>
      <button
        onClick={() => setActiveIndex(i => i === items.length - 1 ? 0 : i + 1)}
        style={{
          position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)',
          zIndex: 10, backgroundColor: 'rgba(0,0,0,0.4)', color: 'white',
          border: 'none', borderRadius: '50%', width: '38px', height: '38px',
          cursor: 'pointer', fontSize: '1.3rem', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background-color 0.2s',
        }}
      >›</button>
    </div>
  );
}

export default MyGallery;
