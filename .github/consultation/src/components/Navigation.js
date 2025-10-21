import React from 'react';
import { Link } from 'react-router-dom';
import './components.css';

const Navigation = () => {
    return (
        <nav className="navigation">
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/market-analysis">Market Analysis</Link>
                </li>
                <li>
                    <Link to="/about">About</Link>
                </li>
                <li>
                    <Link to="/news">News</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navigation;