import axios from 'axios';

const baseUrl = "https://9h2vaj.deta.dev";

class User {

    constructor() { }

    // USER
    static async login(email, password) {
        try {
            const url = `${baseUrl}/login/`;
            const response = await axios.post(url, {
                email: email,
                password: password
            });
            localStorage.setItem('token', response.data.token);
            return response;
        } catch (err) {
            console.log(err);
        }
    }

    static async getUser() {
        try {
            const url = `${baseUrl}/users/`;
            const token = localStorage.getItem('token');
            const user = await axios.get(url, {
                headers: {
                    "x-acess-token": token,
                }
            });
            return user;
        } catch (err) {
            console.log(err);
        }
    }

    static async createUser(nickname, email, password) {
        try {
            const url = `${baseUrl}/users/`;
            const response = await axios.post(url, {
                nickname: nickname,
                email: email,
                password: password
            });
            return response;
        } catch (err) {
            console.log(err);
        }
    }

    static async editUser(user) {
        const { nickname, img, email } = user;
        try {
            const url = `${baseUrl}/users/`;
            const token = localStorage.getItem('token');
            const body = {
                "nickname": nickname,
                "img": img,
                "email": email
            }
            const response = await axios.put(url, body, {
                headers: {
                    "x-acess-token": token
                }
            });
            return response;
        } catch (err) {
            console.log(err);
        }
    }

    static async editPassword(old_password, new_password) {
        try {
            const url = `${baseUrl}/userpassword/`;
            const body = {
                "old_password": old_password,
                "new_password": new_password
            }
            const token = localStorage.getItem('token');
            const response = await axios.put(url, body, {
                headers: {
                    "x-acess-token": token
                }
            });
            return response;
        } catch (err) {
            console.log(err);
        }
    }

    static async Exit() {
        try {
            console.log('saiu');
            localStorage.setItem('token', '');

        } catch (err) {
            console.log(err);
        }
    }

    // FAVORITE
    static async addFavorite(name, id) {
        try {
            const url = `${baseUrl}/favorites/`;
            const body = {
                "name": name,
                "manga_id": id
            }
            const token = localStorage.getItem('token');
            const response = await axios.post(url, body, {
                headers: {
                    "x-acess-token": token
                }
            });
            return response;
        } catch (err) {
            console.log(err);
        }
    }

    static async removeFavorite(id) {
        try {
            const url = `${baseUrl}/favorites/${id}/`;
            const token = localStorage.getItem('token');
            const response = await axios.delete(url, {
                headers: {
                    "x-acess-token": token
                }
            });
            return response;
        } catch (err) {
            console.log(err);
        }
    }

    static async getFavorites() {
        try {
            const url = `${baseUrl}/favorites/`;
            const token = localStorage.getItem('token');
            const response = await axios.get(url, {
                headers: {
                    "x-acess-token": token
                }
            });
            return response;
        } catch (err) {
            console.log(err);
        }
    }

    static async isFavorited(id) {
        try {
            const response = await this.getFavorites();
            const size = response.data.items.length;
            for (let i = 0; i < size; i++){
                const mangaId = response.data.items[i].manga_id;
                const key = response.data.items[i].key;
                if (mangaId == id) return key;
            }
            return null;
        } catch (err) {
            console.log(err);
        }
    }
}

export default User;