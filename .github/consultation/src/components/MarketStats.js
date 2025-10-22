import React from 'react';

const MarketStats = () => {
    const stats = [
        { label: 'Prijsstijging 2024', value: '+8.5%' },
        { label: 'Gemiddelde m² prijs', value: '€3,200' },
        { label: 'Internationale kopers', value: '65%' },
        { label: 'Gemiddeld rendement', value: '4.2%' },
    ];

    return (
        <div className="market-stats">
            <h3>🏖️ Marktstatistieken</h3>
            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-item">
                        <div className="stat-number">{stat.value}</div>
                        <div>{stat.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MarketStats;