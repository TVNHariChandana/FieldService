
import { apiRequest } from "./api";

export interface ChatConversation {
    id: number;
    subject: string;
    workOrderId: number;
    createdAt: string;
}

export interface ChatMessage {
    id: number;
    conversationId: number;
    message: string;
    senderUsername: string;
    sentAt: string;
}

export async function getConversations(): Promise<ChatConversation[]> {
    return apiRequest("/api/chat/conversations");
}

export async function createConversation(
    workOrderId: number,
    subject: string
): Promise<ChatConversation> {
    return apiRequest("/api/chat/conversations", {
        method: "POST",
        body: JSON.stringify({ workOrderId, subject }),
    });
}

export async function getMessages(
    conversationId: number
): Promise<ChatMessage[]> {
    return apiRequest(
        `/api/chat/conversations/${conversationId}/messages`
    );
}

export async function sendMessage(
    conversationId: number,
    message: string
): Promise<ChatMessage> {
    return apiRequest(
        `/api/chat/conversations/${conversationId}/messages`,
        {
            method: "POST",
            body: JSON.stringify({ message }),
        }
    );
}
