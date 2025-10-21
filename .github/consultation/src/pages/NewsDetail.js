import React from 'react';
import { useParams } from 'react-router-dom';
import newsData from '../../data/news.json';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './NewsDetail.css';

const NewsDetail = () => {
    const { id } = useParams();
    const article = newsData.find(item => item.id === parseInt(id));

    if (!article) {
        return <div>Article not found</div>;
    }

    return (
        <div className="news-detail">
            <Header />
            <div className="news-content">
                <h1>{article.title}</h1>
                <p className="date">{new Date(article.date).toLocaleDateString()}</p>
                <div className="content" dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>
            <Footer />
        </div>
    );
};

export default NewsDetail;