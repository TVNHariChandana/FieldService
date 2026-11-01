
import { apiRequest } from "./api";

export const getWorkOrders = async () => {
    return await apiRequest("/work-orders");
};

export const getTechnicianWorkOrders = async (technicianId: number) => {
    return await apiRequest(`/work-orders/search/technician?technicianId=${technicianId}`);
};
export const getCustomerWorkOrders = async () => {
    return await apiRequest("/work-orders/my-work-orders");
};
