import axios from 'axios';
import newsData from '../../data/news.json';

const API_URL = 'https://api.example.com/news'; // Replace with your actual API endpoint

export const fetchNews = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching news:', error);
        throw error;
    }
};

export const fetchLocalNews = () => {
    return newsData;
};