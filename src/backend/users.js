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
}

export default User;