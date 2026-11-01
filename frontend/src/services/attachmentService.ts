
import { apiRequest,API_BASE_URL } from "./api";

export interface Attachment {
    id: number;
    fileName: string;
    contentType: string;
    storagePath: string;
    sizeOfFile: number;
    cloudinaryId: string;
    uploadedAt: string;
}
export async function uploadAttachment(
    workOrderId: number,
    file: File
): Promise<Attachment> {
    const formData = new FormData();
    formData.append("file", file);

    return apiRequest(
        `/attachment/upload/work-order/${workOrderId}`,
        {
            method: "POST",
            body: formData,
        }
    );
}
export function getAttachmentDownloadUrl(
    attachmentId: number
): string {
    return `${API_BASE_URL}/attachment/cloudDownload/${attachmentId}`;
}

export async function downloadAttachment(
    attachmentId: number,
    fileName: string
): Promise<void> {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Please log in again to download this file.");
    }

    const response = await fetch(
        getAttachmentDownloadUrl(attachmentId),
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = blobUrl;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
}

export async function getAttachment(
    attachmentId: number
): Promise<Attachment> {
    return apiRequest(`/attachment/${attachmentId}`);
}

export async function deleteAttachment(
    attachmentId: number
): Promise<string> {
    return apiRequest(`/attachment/delete/${attachmentId}`, {
        method: "DELETE",
    });
}

