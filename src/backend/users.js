import axios from 'axios';

const baseUrl = "https://9h2vaj.deta.dev";

class User {

    constructor() { }

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

    static async getUser(){
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
}

export default User;