import React, { useEffect, useState } from 'react';

const SectionDivider = () => {
    const [scrollOffset, setScrollOffset] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY;
            setScrollOffset(scrolled * 0.15); // Adjust speed
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div style={{
            height: '120px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            background: 'var(--white)',
            overflow: 'hidden',
            zIndex: 1
        }}>
            {/* The Vertical Conduit */}
            <div style={{
                width: '1px',
                height: '100%',
                background: 'linear-gradient(to bottom, rgba(37, 99, 235, 0.2), rgba(37, 99, 235, 0.05))',
                position: 'relative'
            }}>
                {/* Traveling Data Packet */}
                <div style={{
                    position: 'absolute',
                    top: '-20px',
                    left: '-1px',
                    width: '3px',
                    height: '24px',
                    background: 'var(--gold)',
                    borderRadius: '4px',
                    boxShadow: '0 0 15px var(--gold)',
                    transform: `translateY(${scrollOffset % 140}px)`,
                    opacity: 0.8
                }} />
            </div>

            {/* Glowing Focal Point */}
            <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--gold)',
                boxShadow: '0 0 20px var(--gold)',
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                opacity: 0.4
            }} />
        </div>
    );
};

export default SectionDivider;
