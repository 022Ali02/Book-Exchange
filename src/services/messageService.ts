import api from './api';

export interface Message {
  id: string;
  exchangeId: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  receiver: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
}

export interface SendMessageData {
  exchangeId: string;
  receiverId: string;
  content: string;
}

export const messageService = {
  async sendMessage(data: SendMessageData): Promise<Message> {
    const response = await api.post('/messages', data);
    return response.data;
  },

  async getExchangeMessages(exchangeId: string): Promise<Message[]> {
    const response = await api.get(`/messages/exchange/${exchangeId}`);
    return response.data;
  },
};
