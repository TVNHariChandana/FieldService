import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import { apiRequest } from "../services/api";

interface SupportTicket {
    id: number;
    subject: string;
    description: string;
    customerId: number;
    customerName: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

interface SupportMessage {
    id: number;
    ticketId: number;
    senderId: number;
    senderUsername: string;
    senderRole: string;
    message: string;
    createdAt: string;
}

function Support() {
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [selectedTicket, setSelectedTicket] =
        useState<SupportTicket | null>(null);
    const [messages, setMessages] = useState<SupportMessage[]>([]);

    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");
    const [newMessage, setNewMessage] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const role = localStorage.getItem("role")?.toUpperCase();
    const isManager = role === "MANAGER";
    const [searchParams] = useSearchParams();
    const supportTicketId = searchParams.get("id");
    async function loadTickets() {
        setLoading(true);
        setError("");

        try {
            const endpoint = isManager
                ? "/api/support/tickets"
                : "/api/support/tickets/my-tickets";

            const data = (await apiRequest(endpoint)) as SupportTicket[];
            setTickets(data);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to load support tickets."
            );
        } finally {
            setLoading(false);
        }
    }

    async function createTicket(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            await apiRequest("/api/support/tickets", {
                method: "POST",
                body: JSON.stringify({ subject, description }),
            });

            setSubject("");
            setDescription("");
            setSuccess("Support ticket created successfully!");
            await loadTickets();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to create ticket."
            );
        }
    }

    async function openTicket(ticket: SupportTicket) {
        setSelectedTicket(ticket);
        setError("");
        setSuccess("");

        try {
            const data = (await apiRequest(
                `/api/support/tickets/${ticket.id}/messages`
            )) as SupportMessage[];

            setMessages(data);
        } catch (err) {
            setMessages([]);
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to load messages."
            );
        }
    }

    async function sendMessage(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!selectedTicket || !newMessage.trim()) return;

        setError("");
        setSuccess("");

        try {
            await apiRequest(
                `/api/support/tickets/${selectedTicket.id}/messages`,
                {
                    method: "POST",
                    body: JSON.stringify({ message: newMessage }),
                }
            );

            setNewMessage("");
            await openTicket(selectedTicket);
            setSuccess("Message sent successfully!");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to send message."
            );
        }
    }

    async function updateStatus(status: string) {
        if (!selectedTicket) return;

        setError("");
        setSuccess("");

        try {
            const updated = (await apiRequest(
                `/api/support/tickets/${selectedTicket.id}/status?status=${status}`,
                { method: "PUT" }
            )) as SupportTicket;

            setSelectedTicket(updated);
            setSuccess("Ticket status updated successfully!");
            await loadTickets();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to update status."
            );
        }
    }

    useEffect(() => {
        loadTickets();
    }, []);

    useEffect(() => {
        if (!supportTicketId || tickets.length === 0) {
            return;
        }

        const ticket = tickets.find(
            (item) => item.id === Number(supportTicketId)
        );

        if (ticket) {
            void openTicket(ticket);
        } else {
            setError(`Support ticket #${supportTicketId} was not found.`);
        }
    }, [supportTicketId, tickets]);useEffect(() => {
        loadTickets();
    }, []);

    useEffect(() => {
        if (!supportTicketId || tickets.length === 0) {
            return;
        }

        const ticket = tickets.find(
            (item) => item.id === Number(supportTicketId)
        );

        if (ticket) {
            void openTicket(ticket);
        } else {
            setError(`Support ticket #${supportTicketId} was not found.`);
        }
    }, [supportTicketId, tickets]);

    return (
        <div className="app-layout">
            <Navbar />

            <main className="main-content">
                <div className="page-header">
                    <div>
                        <h1>Support Center</h1>
                        <p>
                            {isManager
                                ? "Manage customer support requests."
                                : "Create a ticket and communicate with our support team."}
                        </p>
                    </div>
                </div>

                {error && <p role="alert">{error}</p>}
                {success && <p>{success}</p>}

                {!isManager && (
                    <div className="form-card">
                        <h2>Create Support Ticket</h2>

                        <form onSubmit={createTicket}>
                            <div>
                                <label>Subject</label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) =>
                                        setSubject(e.target.value)
                                    }
                                    maxLength={255}
                                    required
                                />
                            </div>

                            <div>
                                <label>Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    maxLength={2000}
                                    rows={4}
                                    required
                                />
                            </div>

                            <button type="submit">
                                Submit Ticket
                            </button>
                        </form>
                    </div>
                )}

                <div className="form-card">
                    <h2>
                        {isManager
                            ? "All Support Tickets"
                            : "My Support Tickets"}
                    </h2>

                    {loading ? (
                        <p>Loading tickets...</p>
                    ) : tickets.length === 0 ? (
                        <p>No support tickets found.</p>
                    ) : (
                        tickets.map((ticket) => (
                            <div
                                key={ticket.id}
                                className="form-card"
                            >
                                <h3>
                                    #{ticket.id} - {ticket.subject}
                                </h3>

                                {isManager && (
                                    <p>
                                        Customer: {ticket.customerName}
                                    </p>
                                )}

                                <p>{ticket.description}</p>
                                <p>Status: {ticket.status}</p>

                                <button
                                    type="button"
                                    onClick={() => openTicket(ticket)}
                                >
                                    View Conversation
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {selectedTicket && (
                    <div className="form-card">
                        <h2>
                            Conversation - Ticket #{selectedTicket.id}
                        </h2>

                        <button
                            type="button"
                            onClick={() => {
                                setSelectedTicket(null);
                                setMessages([]);
                            }}
                        >
                            Close Conversation
                        </button>

                        <p>Status: {selectedTicket.status}</p>

                        {isManager && (
                            <div>
                                <label>Update Status</label>
                                <select
                                    value={selectedTicket.status}
                                    onChange={(e) =>
                                        updateStatus(e.target.value)
                                    }
                                >
                                    <option value="OPEN">OPEN</option>
                                    <option value="IN_PROGRESS">
                                        IN_PROGRESS
                                    </option>
                                    <option value="RESOLVED">
                                        RESOLVED
                                    </option>
                                    <option value="CLOSED">CLOSED</option>
                                </select>
                            </div>
                        )}

                        <div>
                            {messages.length === 0 ? (
                                <p>No messages yet.</p>
                            ) : (
                                messages.map((message) => (
                                    <div key={message.id}>
                                        <strong>
                                            {message.senderUsername} (
                                            {message.senderRole})
                                        </strong>

                                        <p>{message.message}</p>

                                        <small>
                                            {new Date(
                                                message.createdAt
                                            ).toLocaleString()}
                                        </small>
                                    </div>
                                ))
                            )}
                        </div>

                        <form onSubmit={sendMessage}>
                            <label>Reply</label>
                            <textarea
                                value={newMessage}
                                onChange={(e) =>
                                    setNewMessage(e.target.value)
                                }
                                maxLength={2000}
                                rows={3}
                                required
                            />

                            <button type="submit">
                                Send Message
                            </button>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Support;
