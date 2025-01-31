import axios from 'axios';

const token = localStorage.getItem("token");

const ChatService = {
    getAllMessages: async () => {
        const response = await axios.get("http://localhost/chats", {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },
    getMessagesForUser: async (userId) => {
        const response = await axios.get(`http://localhost/chats/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
};

export default ChatService;
