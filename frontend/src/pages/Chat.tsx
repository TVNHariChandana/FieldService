
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
    getConversations,
    createConversation,
    getMessages,
    sendMessage,
    type ChatConversation,
    type ChatMessage,
} from "../services/chatService";


function Chat() {
    const [conversations, setConversations] = useState<ChatConversation[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [selectedConversation, setSelectedConversation] =
        useState<ChatConversation | null>(null);

    const [workOrderId, setWorkOrderId] = useState("");
    const [subject, setSubject] = useState("");
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const currentUsername = localStorage.getItem("username") || "";

    const loadConversations = async () => {
        try {
            const data = await getConversations();
            setConversations(data);
            setError("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load conversations.");
        } finally {
            setLoading(false);
        }
    };

    const loadMessages = async (conversation: ChatConversation) => {
        setSelectedConversation(conversation);
        setMessages([]);
        try {
            const data = await getMessages(conversation.id);
            setMessages(data);
            setError("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load messages.");
        }
    };

    useEffect(() => {
        void loadConversations();
    }, []);
    useEffect(() => {
        if (!selectedConversation) return;

        const intervalId = window.setInterval(async () => {
            try {
                const data = await getMessages(selectedConversation.id);
                setMessages(data);
            } catch (err) {
                console.error("Failed to refresh messages:", err);
            }
        }, 3000);

        return () => window.clearInterval(intervalId);
    }, [selectedConversation]);
    const handleCreateConversation = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const id = Number(workOrderId);
        if (!Number.isInteger(id) || id <= 0 || !subject.trim()) {
            setError("Enter a valid work order ID and conversation subject.");
            return;
        }

        try {
            const conversation = await createConversation(id, subject.trim());
            setWorkOrderId("");
            setSubject("");
            await loadConversations();
            await loadMessages(conversation);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create conversation.");
        }
    };

    const handleSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!selectedConversation || !newMessage.trim()) return;

        try {
            const sent = await sendMessage(
                selectedConversation.id,
                newMessage.trim()
            );
            setMessages((previous) => [...previous, sent]);
            setNewMessage("");
            setError("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to send message.");
        }
    };

    return (
        <div className="app-layout">
            <Navbar />

            <main className="main-content chat-page">
                <div className="page-header">
                    <div>
                        <h1>Chat & Conversations</h1>
                        <p>Discuss work orders with your service team.</p>
                    </div>
                    <button
                        className="secondary-btn"
                        type="button"
                        onClick={() => void loadConversations()}
                    >
                        Refresh
                    </button>
                </div>

                {error && <p className="chat-error" role="alert">{error}</p>}

                <div className="chat-layout">
                    <section className="dashboard-card chat-sidebar">
                        <h2>New Conversation</h2>

                        <form onSubmit={handleCreateConversation} className="chat-create-form">
                            <label htmlFor="chat-work-order">Work order ID</label>
                            <input
                                id="chat-work-order"
                                type="number"
                                min="1"
                                value={workOrderId}
                                onChange={(event) => setWorkOrderId(event.target.value)}
                                placeholder="e.g. 7"
                                required
                            />

                            <label htmlFor="chat-subject">Subject</label>
                            <input
                                id="chat-subject"
                                value={subject}
                                onChange={(event) => setSubject(event.target.value)}
                                placeholder="e.g. Work order update"
                                maxLength={150}
                                required
                            />

                            <button className="primary-btn" type="submit">
                                Create Conversation
                            </button>
                        </form>

                        <div className="chat-conversation-list">
                            <h2>Conversations</h2>

                            {loading ? (
                                <p>Loading conversations...</p>
                            ) : conversations.length === 0 ? (
                                <p>No conversations yet.</p>
                            ) : (
                                conversations.map((conversation) => (
                                    <button
                                        type="button"
                                        key={conversation.id}
                                        className={`chat-conversation-item ${
                                            selectedConversation?.id === conversation.id
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={() => void loadMessages(conversation)}
                                    >
                                        <strong>{conversation.subject}</strong>
                                        <span>Work order #{conversation.workOrderId}</span>
                                        <small>
                                            {new Date(conversation.createdAt).toLocaleString()}
                                        </small>
                                    </button>
                                ))
                            )}
                        </div>
                    </section>

                    <section className="dashboard-card chat-main">
                        {selectedConversation ? (
                            <>
                                <div className="chat-main-header">
                                    <h2>{selectedConversation.subject}</h2>
                                    <p>Work order #{selectedConversation.workOrderId}</p>
                                </div>

                                <div className="chat-messages">
                                    {messages.length === 0 ? (
                                        <p className="chat-empty">No messages yet. Start the conversation!</p>
                                    ) : (
                                        messages.map((message) => (
                                            <div
                                                key={message.id}
                                                className={`chat-message ${
                                                    message.senderUsername === currentUsername
                                                        ? "mine"
                                                        : "theirs"
                                                }`}
                                            >
                                                <strong>{message.senderUsername}</strong>
                                                <p>{message.message}</p>
                                                <small>
                                                    {new Date(message.sentAt).toLocaleString()}
                                                </small>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <form className="chat-send-form" onSubmit={handleSendMessage}>
                                    <input
                                        value={newMessage}
                                        onChange={(event) => setNewMessage(event.target.value)}
                                        placeholder="Type a message..."
                                        maxLength={2000}
                                        aria-label="Message"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        className="primary-btn"
                                        disabled={!newMessage.trim()}
                                    >
                                        Send
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="chat-placeholder">
                                <h2>Select a conversation</h2>
                                <p>Choose a conversation from the list or create a new one.</p>
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}

export default Chat;
