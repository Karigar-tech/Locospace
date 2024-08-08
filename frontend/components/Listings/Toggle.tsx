'use client'

import React from 'react';
import style from './toggle.module.css';

interface ToggleProps {
    view: 'listings' | 'threads';
    setView: React.Dispatch<React.SetStateAction<'listings' | 'threads'>>;
}

const ToggleButton: React.FC<ToggleProps> = ({ view, setView }) => {
    return (
        <div className={style.gradientBarContainer}>
            <div className={style.gradientBar}></div>
            <div className={style.toggleContainer}>
                <button
                    className={`${style.toggleButton} ${style.listings} ${view === 'listings' ? style.active : ''}`}
                    onClick={() => setView('listings')}
                >
                    Listings
                </button>
                <button
                    className={`${style.toggleButton} ${style.threads} ${view === 'threads' ? style.active : ''}`}
                    onClick={() => setView('threads')}
                >
                    Threads
                </button>
            </div>
        </div>
    );
}

export default ToggleButton;
