import React from 'react';
import MarketStats from '../components/MarketStats';

const MarketAnalysis = () => {
    return (
        <div className="market-analysis">
            <h1>Market Analysis</h1>
            <p>Welcome to the Market Analysis page. Here you will find in-depth analysis of the current market trends, statistics, and insights.</p>
            <MarketStats />
            {/* Additional content such as charts and detailed statistics can be added here */}
        </div>
    );
};

export default MarketAnalysis;