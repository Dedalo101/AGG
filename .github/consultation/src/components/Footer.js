import React from 'react';

const Footer = () => {
    return (
        <footer style={{ background: '#2c3e50', color: 'white', padding: '2rem 0', textAlign: 'center', marginTop: '3rem' }}>
            <div className="container">
                <p>&copy; {new Date().getFullYear()} AGG Homes - Costa del Sol Vastgoedexperts</p>
                <p style={{ marginTop: '0.5rem' }}>
                    <a href="/consultation/" style={{ color: '#d4af37' }}>Vastgoed Blog</a> | 
                    <a href="/nl/consultatie/" style={{ color: '#d4af37' }}>Consultatie</a> | 
                    <a href="/nl/" style={{ color: '#d4af37' }}>Home</a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;