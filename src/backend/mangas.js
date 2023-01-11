import axios from 'axios';
import User from './users';

const baseUrl = "https://q4l8x4.deta.dev/";
class Mangas {

    constructor() { }

    static async getMangaById(id) {
        try {
            const url = `${baseUrl}manga/${id}`
            const response = await axios.get(url);
            return response.data;
        } catch (Error) {
            console.log(Error)
        }
    }

    static async getChapters(id, page) {
        try {
            const url = `${baseUrl}chapters/${id}/${page}`;
            const response = await axios.get(url);
            return response.data;
        } catch (err) {
            console.log(err);
        }
    }

    static async search(manga_name) {
        try {
            const url = `${baseUrl}search/?q=${manga_name}/`
            const response = await axios.get(url);
            return response.data;
        } catch (err) {
            console.log(err);
        }
    }

    static async getRecents(){
        try {
            const url = `${baseUrl}recent/`;
            const response = await axios.get(url);
            return response.data;
        } catch (err) {
            console.log(err);
        }
    }

    static async getFavorites(){
        try {
            let result = [];
            const resFav = await User.getFavorites();
            for (let i = 0; i < resFav.data.count; i++) {
                const manga_id = resFav.data.items[i].manga_id;
                const manga = await this.getMangaById(manga_id);
                result.push(manga);
            }
            return result;
        } catch (err) {
            console.log(err);
        }
    }

}

export default Mangas;