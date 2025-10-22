import React from 'react';
import Navigation from './Navigation';

const Header = () => {
    return (
        <header className="header">
            <h1 className="site-title">Costa del Sol Real Estate Blog</h1>
            <Navigation />
        </header>
    );
};

export default Header;