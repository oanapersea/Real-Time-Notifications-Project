    import React, { useState, useEffect, useRef } from "react";
    import SockJS from "sockjs-client";
    import { Stomp } from "@stomp/stompjs";
    import axios from "axios";
    import { withRouter } from "react-router-dom";
    import ChatService from "../services/ChatService";
    import { v4 as uuidv4 } from 'uuid';


    const Chat = ({ match }) => {
        const [messages, setMessages] = useState([]);
        const [messagesInput, setMessagesInput] = useState({});
        const [username, setUsername] = useState("");
        const [role, setRole] = useState("");
        const [userMapping, setUserMapping] = useState({});
        const stompClientRef = useRef(null);
        const [typingStatus, setTypingStatus] = useState({});
        const [readReceipts, setReadReceipts] = useState({});
        const [adminEmail, setAdminEmail] = useState("");


        useEffect(() => {
            const token = localStorage.getItem("token");
            if (!token) {
                window.location.href = "/login";
            } else {
                axios
                    .get("http://localhost/user/me", {
                        headers: {Authorization: `Bearer ${token}`},
                    })
                    .then((response) => {
                        setUsername(response.data.email);
                        setRole(response.data.role);
                    })
                    .catch((err) => {
                        console.error("Error fetching user details:", err);
                    });
            }
        }, []);

        useEffect(() => {
            const fetchUserDetails = async () => {
                try {
                    const response = await axios.get("http://localhost/user", {
                        headers: {Authorization: `Bearer ${localStorage.getItem("token")}`},
                    });

                    const mapping = response.data.reduce((map, user) => {
                        map[user.id] = user.email;
                        return map;
                    }, {});
                    setUserMapping(mapping);
                } catch (error) {
                    console.error("Error fetching user details:", error);
                }
            };

            fetchUserDetails();
        }, []);

        useEffect(() => {
            const fetchAdminEmail = async () => {
                try {
                    const response = await axios.get("http://localhost/user/admin/email", {
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                    });

                    if (response.status === 200 && response.data.email) {
                        setAdminEmail(response.data.email);
                    } else {
                        console.error("Failed to fetch admin email");
                    }
                } catch (error) {
                    console.error("Error fetching admin email:", error);
                }
            };

            fetchAdminEmail();
        }, []);


        useEffect(() => {
            if (username && role && Object.keys(userMapping).length > 0) {
                fetchMessages();
            }
        }, [username, role, userMapping]);

        useEffect(() => {
            const token = localStorage.getItem("token");

            if (!token || !username || !role) return;

            const stompClient = Stomp.over(() => new SockJS(`http://localhost/ws?token=${token}`));
            stompClientRef.current = stompClient;

            stompClient.heartbeat.outgoing = 20000;
            stompClient.heartbeat.incoming = 20000;
            stompClient.reconnectDelay = 5000;

            stompClient.connect(
                {Authorization: `Bearer ${token}`},
                () => {

                    stompClient.subscribe("/topic/messages", (message) => {
                        try {
                            const receivedMessage = JSON.parse(message.body);

                            if (role === "admin") {
                                handleAdminMessage(receivedMessage);
                            } else if (role === "user") {
                                handleUserMessage(receivedMessage);
                            }
                        } catch (err) {
                            console.error("Error processing WebSocket message:", err);
                        }
                    });


                        stompClient.subscribe("/topic/notifications", (message) => {
                            try {
                                const notificationMessage = JSON.parse(message.body);

                                if (notificationMessage.type === "READ") {
                                    const {sender, id} = notificationMessage;
                                    showReadReceipt(sender, id);
                                } else if (notificationMessage.type === "TYPING") {
                                    const {sender} = notificationMessage;
                                    showTypingNotification(sender);
                                }
                            } catch (err) {
                                console.error("Error processing admin notification:", err);
                            }
                        });


                },
                (error) => {
                    console.error("WebSocket connection error:", error);
                }
            );

            return () => {
                if (stompClient) {
                    stompClient.disconnect(() => {
                    });
                }
            };
        }, [username, role, userMapping]);



        const normalizeMessages = (allMessages, role) => {


            const groupedMessages = allMessages.reduce((groups, msg) => {

                let chatPartnerEmail = null;

                if (msg.admin === true) {
                    chatPartnerEmail = msg.recipient;
                } else {
                    chatPartnerEmail = msg.sender;

                }

                if (msg.sender === username && msg.recipient === username) {
                    return groups;
                }


                if (!chatPartnerEmail) {

                    chatPartnerEmail = 'Unknown';
                }

                if (!groups[chatPartnerEmail]) {
                    groups[chatPartnerEmail] = {
                        userEmail: chatPartnerEmail,
                        messages: [],
                    };
                }

                const messageId = msg.id || uuidv4();
                const userId=msg.userId;
                groups[chatPartnerEmail].messages.push({
                    id: messageId,
                    sender: msg.sender,
                    recipient: msg.recipient,
                    content: msg.content,
                    read: msg.read || false,

                });



                return groups;
            }, {});

            return Object.values(groupedMessages);
        };

        const fetchMessages = async () => {
            try {
                const allMessages = await ChatService.getAllMessages();
                const normalizedMessages = normalizeMessages(allMessages, role);


                setMessages(normalizedMessages);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        const handleAdminMessage = (receivedMessage) => {
            if (receivedMessage.type === "CHAT") {
                if (
                    receivedMessage.recipient === username ||
                    userMapping[receivedMessage.recipient] === username
                ) {

                    if (receivedMessage.sender === username) {
                        return;
                    }

                    setMessages((prev) => {
                        const messageExists = prev.some(chat =>
                            chat.messages.some(msg => msg.id === receivedMessage.id)
                        );

                        if (messageExists) {
                            return prev;
                        }

                        const chatPartnerEmail = receivedMessage.sender;

                        const chatIndex = prev.findIndex(
                            (c) => c.userEmail === chatPartnerEmail
                        );

                        if (chatIndex !== -1) {
                            const updatedChat = {...prev[chatIndex]};
                            updatedChat.messages = [
                                ...updatedChat.messages,
                                {
                                    id: receivedMessage.id || uuidv4(),
                                    sender: receivedMessage.sender,
                                    recipient: receivedMessage.recipient,
                                    content: receivedMessage.content,
                                    read: false,
                                },
                            ];
                            const updatedMessages = [...prev];
                            updatedMessages[chatIndex] = updatedChat;
                            return updatedMessages;
                        } else {
                            return [
                                ...prev,
                                {
                                    userEmail: chatPartnerEmail,
                                    messages: [
                                        {
                                            id: receivedMessage.id || uuidv4(),
                                            sender: receivedMessage.sender,
                                            recipient: receivedMessage.recipient,
                                            content: receivedMessage.content,
                                            read: false,
                                        },
                                    ],
                                },
                            ];
                        }
                    });


                }
            }
        };

        const handleUserMessage = (receivedMessage) => {
            if (receivedMessage.type === "CHAT") {
                if (
                    receivedMessage.recipient === username ||
                    receivedMessage.sender === username
                ) {

                    if (receivedMessage.sender === username) {
                        return;
                    }

                    setMessages((prev) => {
                        const messageExists = prev.some(chat =>
                            chat.messages.some(msg => msg.id === receivedMessage.id)
                        );

                        if (messageExists) {
                            return prev;
                        }

                        const chatPartnerEmail = adminEmail;

                        const chatIndex = prev.findIndex(
                            (c) => c.userEmail === chatPartnerEmail
                        );

                        if (chatIndex !== -1) {
                            const updatedChat = {...prev[chatIndex]};
                            updatedChat.messages = [
                                ...updatedChat.messages,
                                {
                                    id: receivedMessage.id || uuidv4(),
                                    sender: receivedMessage.sender,
                                    recipient: receivedMessage.recipient,
                                    content: receivedMessage.content,
                                    read: false,
                                },
                            ];
                            const updatedMessages = [...prev];
                            updatedMessages[chatIndex] = updatedChat;
                            return updatedMessages;
                        } else {
                            return [
                                ...prev,
                                {
                                    userEmail: chatPartnerEmail,
                                    messages: [
                                        {
                                            id: receivedMessage.id || uuidv4(),
                                            sender: receivedMessage.sender,
                                            recipient: receivedMessage.recipient,
                                            content: receivedMessage.content,
                                            read: false,
                                        },
                                    ],
                                },
                            ];
                        }
                    });

                }
            }
        };


        const showTypingNotification = (senderEmail) => {
            setTypingStatus(prev => ({
                ...prev,
                [senderEmail]: true,
            }));

            setTimeout(() => {
                setTypingStatus(prev => ({
                    ...prev,
                    [senderEmail]: false,
                }));
            }, 3000);
        };

        const showReadReceipt = (senderEmail, messageId) => {
            setReadReceipts(prev => ({
                ...prev,
                [messageId]: true,
            }));

            setTimeout(() => {
                setReadReceipts(prev => ({
                    ...prev,
                    [messageId]: false,
                }));
            }, 5000);
        };

        const handleInputChange = (userEmail, value) => {
            if (stompClientRef.current && username && userEmail) {
                if (username !== userEmail) {
                    const typingMessage = {
                        sender: username,
                        recipient: userEmail,
                        type: "TYPING",
                    };

                    stompClientRef.current.send("/app/chat.typing", {}, JSON.stringify(typingMessage));
                }
            }

            setMessagesInput((prev) => ({
                ...prev,
                [userEmail]: value,
            }));
        };

        const sendMessage = (recipient) => {
            if (stompClientRef.current && messagesInput[recipient]) {
                const messageId = uuidv4();

                const chatMessage = {
                    id: messageId,
                    sender: username,
                    recipient: recipient,
                    content: messagesInput[recipient],
                    type: "CHAT",
                };

                setMessages((prev) => {
                    const updatedMessages = [...prev];
                    const chat = updatedMessages.find((c) => c.userEmail === recipient);
                    if (chat) {
                        chat.messages.push({
                            id: messageId,
                            sender: username,
                            recipient: recipient,
                            content: messagesInput[recipient],
                            read: false,
                        });
                    } else {
                        updatedMessages.push({
                            userEmail: recipient,
                            messages: [
                                {
                                    id: messageId,
                                    sender: username,
                                    recipient: recipient,
                                    content: messagesInput[recipient],
                                    read: false,
                                },
                            ],
                        });
                    }
                    return updatedMessages;

                });

                stompClientRef.current.send("/app/chat.SendMessage", {}, JSON.stringify(chatMessage));

                setMessagesInput((prev) => ({
                    ...prev,
                    [recipient]: "",
                }));

            }
        };

        const sendReadReceiptForMessage = (recipientEmail, messageId, username) => {
            if (stompClientRef.current && username && recipientEmail && messageId) {
                const readMessage = {
                    id: messageId,
                    sender: recipientEmail,
                    recipient: username,
                    type: "READ",
                    content: "Message read",
                };

                stompClientRef.current.send("/app/chat.read", {}, JSON.stringify(readMessage));
            }
        };

        const markMessagesAsRead = (chat) => {
            chat.messages.forEach(msg => {
                if (!msg.read && msg.sender !== username) {
                    sendReadReceiptForMessage(chat.userEmail, msg.id, msg.sender);
                    setMessages(prev => prev.map(c => {
                        if (c.userEmail === chat.userEmail) {
                            return {
                                ...c,
                                messages: c.messages.map(m => m.id === msg.id ? {...m, read: true} : m)
                            };
                        }
                        return c;
                    }));
                }
            });
        };


        const messageContainersRef = useRef({});

        useEffect(() => {
            const handleWindowFocus = () => {

                Object.keys(messageContainersRef.current).forEach((userEmail) => {
                    const chat = messages.find((c) => c.userEmail === userEmail);
                    if (chat) {
                        markMessagesAsRead(chat);
                    }
                });
            };

            if (messages && messages.length > 0) {
                window.addEventListener("focus", handleWindowFocus);
            }

            return () => {
                window.removeEventListener("focus", handleWindowFocus);
            };
        }, [messages]);


        const filteredMessages =
            role === "user"
                ? messages.flatMap((chat) =>
                    chat.messages.filter(
                        (msg) =>
                            (msg.recipient && msg.recipient === username) ||
                            (msg.sender && msg.sender === username)
                    )
                )
                : role === "admin"
                    ? messages.flatMap((chat) =>
                        chat.messages.filter(
                            (msg) =>
                                (msg.recipient && msg.recipient === username) ||
                                (msg.sender && msg.sender === username)
                        )
                    )
                    : [];

        return (
            <div className="container py-4">
                {role === "admin" && (
                    <div>
                        <h3>Admin Chat</h3>

                        {messages.map((chat) => (
                            <div key={chat.userEmail} className="mb-4">
                                {/* Typing Notification Above Chat */}
                                {typingStatus[chat.userEmail] && (
                                    <div className="alert alert-info mb-2" role="alert">
                                        {chat.userEmail} is typing...
                                    </div>
                                )}

                                {/* Chat Header */}
                                <h5>Chat with {chat.userEmail}</h5>

                                {/* Chat Messages */}
                                <div
                                    className="border rounded p-3"
                                    style={{ height: "300px", overflowY: "scroll" }}
                                    ref={(el) => {
                                        if (el && chat.userEmail) {
                                            messageContainersRef.current[chat.userEmail] = el;
                                        } else {
                                        }
                                    }}                                >
                                    {chat.messages.map((msg) => {
                                        const isMyMessage = msg.sender === username;

                                        return (
                                            <div key={msg.id} style={{ position: "relative" }}>
                                                {/* -- */}
                                                <strong>{isMyMessage ? adminEmail : chat.userEmail}: </strong>
                                                {msg.content}

                                                {/* read */}
                                                {isMyMessage && readReceipts[msg.id] && (
                                                    <span
                                                        className="text-success"
                                                        style={{ marginLeft: "10px" }}
                                                    >
                                            ✓✓
                                        </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Chat Input */}
                                <div className="d-flex mt-2">
                                    <input
                                        type="text"
                                        value={messagesInput[chat.userEmail] || ""}
                                        onChange={(e) => handleInputChange(chat.userEmail, e.target.value)}
                                        className="form-control me-2"
                                        placeholder="Type a message..."
                                    />
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => sendMessage(chat.userEmail)}
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}


                {role === "user" && (
                    <div>
                        <h3>Chat with Admin</h3>

                        {/* Typing Notification Above Chat */}
                        {typingStatus[adminEmail] && (
                            <div className="alert alert-info mb-2" role="alert">
                                Admin is typing...
                            </div>
                        )}

                        {/* Chat Messages */}
                        <div
                            className="border rounded p-3 mb-3"
                            style={{height: "300px", overflowY: "scroll"}}
                            ref={(el) => (messageContainersRef.current[adminEmail] = el)}
                        >
                            {filteredMessages.map((msg) => {

                                const isMyMessage = msg.sender === username;

                                return (
                                    <div key={msg.id} style={{position: "relative"}}>
                                        <strong>{msg.sender}: </strong>
                                        {msg.content}

                                        {/* ticks */}
                                        {isMyMessage && readReceipts[msg.id] && (
                                            <span className="text-success" style={{marginLeft: "10px"}}>
                        ✓✓
                      </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Chat Input */}
                        <div className="d-flex">
                            <input
                                type="text"
                                value={messagesInput[adminEmail] || ""}
                                onChange={(e) => handleInputChange(adminEmail, e.target.value)}
                                className="form-control me-2"
                                placeholder="Type a message..."
                            />
                            <button
                                className="btn btn-primary"
                                onClick={() => sendMessage(adminEmail)}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    };

        export default withRouter(Chat);

