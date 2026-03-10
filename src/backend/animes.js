// src/backend/animes.js
import axios from 'axios';

const isDev = import.meta.env.DEV;

// When running `npx vercel dev`, the server natively handles both the React frontend and `/api` Serverless functions routing locally.
const API_URL = '/api/anime';



class Animes {
    static async getLatest() {
        try {
            const res = await axios.get(`${API_URL}?action=latest`);
            return res.data;
        } catch (err) {
            console.error("Anime getLatest error:", err);
            return [];
        }
    }

    static async search(query) {
        try {
            const res = await axios.get(`${API_URL}?action=search&query=${encodeURIComponent(query)}`);
            return res.data;
        } catch (err) {
            console.error("Anime search error:", err);
            return [];
        }
    }

    static async getDetails(slug) {
        try {
            const res = await axios.get(`${API_URL}?action=details&slug=${encodeURIComponent(slug)}`);
            return res.data;
        } catch (err) {
            console.error("Anime getDetails error:", err);
            return null;
        }
    }

    static async getEpisodeVideo(epUrl) {
        try {
            const res = await axios.get(`${API_URL}?action=video&epUrl=${encodeURIComponent(epUrl)}`);
            return res.data;
        } catch (err) {
            console.error("Anime getEpisodeVideo error:", err);
            return [];
        }
    }
}

export default Animes;
