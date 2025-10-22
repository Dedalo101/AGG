// This file exports utility functions that assist with various tasks throughout the application, such as formatting dates or filtering data.

export const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

export const filterNewsByCategory = (newsArray, category) => {
    return newsArray.filter(newsItem => newsItem.category === category);
};

export const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};