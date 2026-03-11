import React from 'react';

const shimmerStyle = `
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
.skeleton-pulse-light {
  background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
  background-size: 800px 100%;
  animation: shimmer 1.5s infinite ease-in-out;
  border-radius: 8px;
}
`;

export const SkeletonCard = ({ width = '140px', height = '200px', style = {} }) => (
    <>
        <style>{shimmerStyle}</style>
        <div style={{ width, flexShrink: 0, ...style }}>
            <div className="skeleton-pulse" style={{ width: '100%', height, borderRadius: '8px' }} />
            <div className="skeleton-pulse" style={{ width: '80%', height: '14px', marginTop: '8px' }} />
            <div className="skeleton-pulse" style={{ width: '50%', height: '10px', marginTop: '6px' }} />
        </div>
    </>
);

export const SkeletonRow = ({ count = 5, width = '140px', height = '200px' }) => (
    <div style={{ display: 'flex', gap: '15px', overflowX: 'hidden', padding: '10px 0' }}>
        {Array.from({ length: count }).map((_, i) => (
            <SkeletonCard key={i} width={width} height={height} />
        ))}
    </div>
);

export const SkeletonChapterList = ({ count = 8 }) => (
    <>
        <style>{shimmerStyle}</style>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px' }}>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="skeleton-pulse" style={{ width: '100%', height: '50px', borderRadius: '10px' }} />
            ))}
        </div>
    </>
);

export const SkeletonGrid = ({ count = 8, columns = 4 }) => (
    <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: '15px',
        padding: '10px'
    }}>
        {Array.from({ length: count }).map((_, i) => (
            <SkeletonCard key={i} width="100%" height="200px" />
        ))}
    </div>
);

export default SkeletonCard;
