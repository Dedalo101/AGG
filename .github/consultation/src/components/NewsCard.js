import React from 'react';

const NewsCard = ({ title, date, description }) => {
    return (
        <div className="news-card">
            <h3 className="news-title">{title}</h3>
            <p className="news-date">{date}</p>
            <p className="news-description">{description}</p>
        </div>
    );
};

export default NewsCard;