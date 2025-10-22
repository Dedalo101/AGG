import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MarketStats from '../components/MarketStats';
import NewsCard from '../components/NewsCard';
import newsData from '../../data/news.json';

const Home = () => {
    return (
        <div>
            <Header />
            <main>
                <h1>Welcome to the Costa del Sol Real Estate Blog</h1>
                <p>Your source for the latest news and insights on the real estate market.</p>
                <MarketStats />
                <section>
                    <h2>Latest News</h2>
                    <div className="news-grid">
                        {newsData.map((newsItem) => (
                            <NewsCard key={newsItem.id} news={newsItem} />
                        ))}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Home;