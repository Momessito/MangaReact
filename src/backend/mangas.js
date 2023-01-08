import axios from 'axios';

const baseUrl = "https://q4l8x4.deta.dev/";

class Mangas {

    constructor() { }

    static async getMangaById(id) {
        try {
            const url = `${baseUrl}manga/${id}`
            const response = await axios.get(url);

            console.log(response.data);
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

}

export default Mangas;