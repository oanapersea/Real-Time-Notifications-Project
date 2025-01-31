import axios from 'axios';

// const USER_API_BASE_URL = "http://localhost/user";
const USER_API_BASE_URL = "http://localhost/user";
class UserService {

    getUsers(){
        return axios.get(USER_API_BASE_URL);
    }

    createUser(user) {
        return axios.post(USER_API_BASE_URL, user);
    }

    getUserById(userId) {
        const token = localStorage.getItem("token");
        console.log("Sending GET request to:", `${USER_API_BASE_URL}/${userId}`);
        console.log("Authorization Header:", `Bearer ${localStorage.getItem("token")}`);

        return axios.get(`${USER_API_BASE_URL}/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                console.log("Backend Response:", response);
                console.log("User Data:", response.data);
                return response;
            })
            .catch((error) => {
                if (error.response) {
                    console.error("Error Response Status:", error.response.status); // Log the status code
                    console.error("Error Response Data:", error.response.data); // Log the backend error message
                } else if (error.request) {
                    console.error("No Response Received:", error.request); // Log the request object
                } else {
                    console.error("Error Message:", error.message);
                }
                throw error;
            });
    }


    updateUser(user, userId){
        return axios.put(USER_API_BASE_URL + '/' + userId, user);
    }

    deleteUser(userId) {
        return axios.delete(USER_API_BASE_URL + '/' + userId);
    }

    login(loginRequest) {
        return axios.post(USER_API_BASE_URL + '/login', loginRequest)
    }

}

export default new UserService()