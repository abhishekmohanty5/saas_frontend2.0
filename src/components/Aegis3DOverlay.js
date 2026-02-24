import React, { useEffect, useState } from 'react';

const Aegis3DOverlay = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({
                x: (e.clientX / window.innerWidth - 0.5) * 40,
                y: (e.clientY / window.innerHeight - 0.5) * 40
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 0,
            overflow: 'hidden'
        }}>
            {/* Drifting 3D Orbs */}
            <div style={{
                position: 'absolute',
                top: '15%',
                left: '10%',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
                filter: 'blur(80px)',
                transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)`,
                transition: 'transform 0.2s ease-out'
            }} />

            <div style={{
                position: 'absolute',
                bottom: '20%',
                right: '5%',
                width: '500px',
                height: '500px',
                background: 'radial-gradient(circle, rgba(162, 89, 255, 0.06) 0%, transparent 70%)',
                filter: 'blur(100px)',
                transform: `translate(${mousePos.x * -0.3}px, ${mousePos.y * -0.3}px)`,
                transition: 'transform 0.2s ease-out'
            }} />

            {/* Floating Prismatic Shards (Small, subtle) */}
            <div style={{
                position: 'absolute',
                top: '40%',
                left: '25%',
                width: '2px',
                height: '60px',
                background: 'linear-gradient(to bottom, transparent, rgba(59, 130, 246, 0.4), transparent)',
                transform: `translate(${mousePos.x * 1.2}px, ${mousePos.y * 1.2}px) rotate(15deg)`,
                opacity: 0.3
            }} />

            <div style={{
                position: 'absolute',
                top: '70%',
                right: '30%',
                width: '1px',
                height: '100px',
                background: 'linear-gradient(to bottom, transparent, rgba(162, 89, 255, 0.3), transparent)',
                transform: `translate(${mousePos.x * 0.8}px, ${mousePos.y * 0.8}px) rotate(-10deg)`,
                opacity: 0.2
            }} />

            {/* Global Perspective Grid Overlay (Very faint) */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0,0,0,0.03) 1px, transparent 0)`,
                backgroundSize: '100px 100px',
                opacity: 0.4,
                perspective: '1000px',
                transform: 'rotateX(5deg)',
                transformOrigin: 'top'
            }} />
        </div>
    );
};

export default Aegis3DOverlay;
