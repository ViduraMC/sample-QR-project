import axios from 'axios';

// Get API URL from env, or default to localhost
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface EventResponse {
  id: number;
  title: string;
  description: string;
  dateTime: string;
  location: string;
  organizer: string;
  category: string;
  ticketPrice: number;
  qrHash?: string;
  signature?: string;
  createdAt: string;
  updatedAt: string;
}

export const eventsApi = {
  // Create an event
  create: async (data: any) => {
    const res = await apiClient.post<EventResponse>('/events', data);
    return res.data;
  },

  // Get all events
  getAll: async () => {
    const res = await apiClient.get<EventResponse[]>('/events');
    return res.data;
  },

  // Get event by ID
  getById: async (id: number) => {
    const res = await apiClient.get<EventResponse>(`/events/${id}`);
    return res.data;
  },

  // Get event by Hash and Signature (Public QR Scan endpoint)
  getByHash: async (hash: string, signature: string) => {
    const res = await apiClient.get<EventResponse>(`/events/scan/${hash}?sig=${signature}`);
    return res.data;
  },

  // Update Event
  update: async (id: number, data: any) => {
    const res = await apiClient.put<EventResponse>(`/events/${id}`, data);
    return res.data;
  },

  // Delete Event
  delete: async (id: number) => {
    const res = await apiClient.delete(`/events/${id}`);
    return res.data;
  }
};
