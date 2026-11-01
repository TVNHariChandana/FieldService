import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";

interface Notification {
    id: number;
    title: string;
    message: string;
    type: string;
    relatedEntityId: number | null;
    isRead: boolean;
    createdAt: string;
}

function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const loadNotifications = async () => {
        try {
            setLoading(true);

            const [notificationData, countData] = await Promise.all([
                apiRequest("/api/notifications"),
                apiRequest("/api/notifications/unread-count")
            ]);

            setNotifications(notificationData);
            setUnreadCount(Number(countData.unreadCount));
        } catch (error) {
            console.error("Failed to load notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotifications();

        const interval = setInterval(loadNotifications, 30000);

        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id: number) => {
        try {
            await apiRequest(`/api/notifications/${id}/read`, {
                method: "PUT"
            });

            await loadNotifications();
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await apiRequest("/api/notifications/mark-all-read", {
                method: "PUT"
            });

            await loadNotifications();
        } catch (error) {
            console.error("Failed to mark all as read:", error);
        }
    };
    const handleNotificationClick = async (notification: Notification) => {
        if (!notification.isRead) {
            await markAsRead(notification.id);
        }

        setIsOpen(false);

        if (notification.type.startsWith("WORK_ORDER")) {
            if (notification.relatedEntityId !== null) {
                navigate(`/work-orders?id=${notification.relatedEntityId}`);
            }
        } else if (notification.type.startsWith("SUPPORT")) {
            if (notification.relatedEntityId !== null) {
                navigate(`/support?id=${notification.relatedEntityId}`);
            } else {
                navigate("/support");
            }
        } else if (notification.type === "SERVICE_REQUEST") {
            navigate("/dashboard");
        }
    };
    return (
        <div className="notification-container">
            <button
                className="notification-bell"
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen) loadNotifications();
                }}
                aria-label="Notifications"
            >
                🔔

                {unreadCount > 0 && (
                    <span className="notification-badge">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="notification-header">
                        <h3>Notifications</h3>

                        {unreadCount > 0 && (
                            <button onClick={markAllAsRead}>
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="notification-list">
                        {loading && notifications.length === 0 ? (
                            <p className="notification-empty">Loading...</p>
                        ) : notifications.length === 0 ? (
                            <p className="notification-empty">
                                No notifications yet.
                            </p>
                        ) : (
                            notifications.map((notification) => (
                                <button
                                    key={notification.id}
                                    className={`notification-item ${
                                        notification.isRead ? "read" : "unread"
                                    }`}
                                    onClick={() =>
                                        handleNotificationClick(notification)
                                    }
                                >
                                    <div className="notification-item-title">
                                        <strong>{notification.title}</strong>
                                        {!notification.isRead && (
                                            <span className="unread-dot" />
                                        )}
                                    </div>

                                    <p>{notification.message}</p>

                                    <small>
                                        {new Date(
                                            notification.createdAt
                                        ).toLocaleString()}
                                    </small>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default NotificationBell;