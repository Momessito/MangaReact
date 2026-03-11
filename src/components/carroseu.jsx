import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Mangas from '../backend/mangas';

const Items = () => {
  const [items, setItems] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await Mangas.getRecents();
        setItems(data || []);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (items.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((c) => (c === items.length - 1 ? 0 : c + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [items.length]);

  if (items.length === 0) {
    return (
      <div style={{
        backgroundColor: 'rgba(30, 30, 46, 0.7)',
        borderRadius: '14px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
      }}>
        <div className="skeleton-pulse" style={{ width: '100%', height: '320px', borderRadius: '12px' }} />
        <div className="skeleton-pulse" style={{ width: '60%', height: '16px' }} />
        <div className="skeleton-pulse" style={{ width: '40%', height: '12px' }} />
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
  }

  const current = items[activeIndex];
  const isAdult = current.categories && current.categories.some(c => c === 'Hentai' || c === 'Ecchi');

  return (
    <div style={{
      backgroundColor: 'rgba(30, 30, 46, 0.7)',
      borderRadius: '14px',
      border: '1px solid rgba(255,255,255,0.04)',
      padding: '16px',
      overflow: 'hidden',
    }}>
      {/* Cover Image */}
      <Link to={`/mangas/${current.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ position: 'relative', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
          <img
            src={current.image}
            alt={current.title}
            style={{
              width: '100%',
              height: '340px',
              objectFit: 'cover',
              borderRadius: '12px',
              transition: 'opacity 0.5s',
              filter: isAdult ? 'blur(4px)' : 'none',
            }}
          />

          {/* Chapter badge */}
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'var(--color5)',
            padding: '4px 10px',
            borderRadius: '8px',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            backdropFilter: 'blur(5px)',
          }}>
            Cap.{current.chapters_count || '?'}
          </div>

          {/* NEW badge */}
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            backgroundColor: '#ff3b30',
            color: 'white',
            padding: '3px 8px',
            borderRadius: '8px',
            fontSize: '0.65rem',
            fontWeight: 'bold',
          }}>
            NEW
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={(e) => { e.preventDefault(); setActiveIndex(i => i === 0 ? items.length - 1 : i - 1); }}
            style={{
              position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)',
              backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', border: 'none',
              borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
              backdropFilter: 'blur(5px)',
            }}
          >‹</button>
          <button
            onClick={(e) => { e.preventDefault(); setActiveIndex(i => i === items.length - 1 ? 0 : i + 1); }}
            style={{
              position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
              backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', border: 'none',
              borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
              backdropFilter: 'blur(5px)',
            }}
          >›</button>
        </div>

        {/* Title & Author */}
        <h4 style={{
          margin: '12px 0 4px',
          fontSize: '0.95rem',
          fontWeight: '700',
          color: 'white',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {current.title}
        </h4>
        <span style={{ fontSize: '0.78rem', color: '#888' }}>
          {current.author || 'MangaDex'}
        </span>
      </Link>

      {/* Dots Navigation */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '12px' }}>
        {items.slice(0, 8).map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            style={{
              width: i === activeIndex ? '20px' : '8px',
              height: '8px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: i === activeIndex ? 'var(--color5)' : 'rgba(255,255,255,0.2)',
              cursor: 'pointer',
              transition: 'all 0.3s',
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default Items;