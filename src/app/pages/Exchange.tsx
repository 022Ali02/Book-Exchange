import React, { useState, useEffect } from 'react';
import { Send, CheckCircle, Clock, ArrowRightLeft, X, Check } from 'lucide-react';
import { exchangeService, Exchange as ExchangeType } from '../../services/exchangeService';
import { messageService, Message } from '../../services/messageService';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

export function Exchange() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming');
  const [exchanges, setExchanges] = useState<ExchangeType[]>([]);
  const [selectedExchange, setSelectedExchange] = useState<ExchangeType | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    loadExchanges();
  }, [activeTab]);

  useEffect(() => {
    if (selectedExchange) {
      loadMessages();
      const interval = setInterval(loadMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedExchange]);

  const loadExchanges = async () => {
    setLoading(true);
    try {
      const data = await exchangeService.getExchanges(activeTab);
      setExchanges(data);
    } catch (error: any) {
      toast.error('Ошибка загрузки обменов');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    if (!selectedExchange) return;

    try {
      const data = await messageService.getExchangeMessages(selectedExchange.id);
      setMessages(data);
    } catch (error: any) {
      console.error('Ошибка загрузки сообщений');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedExchange || !user) return;

    setSendingMessage(true);
    try {
      const receiverId =
        selectedExchange.requesterId === user.id
          ? selectedExchange.ownerId
          : selectedExchange.requesterId;

      await messageService.sendMessage({
        exchangeId: selectedExchange.id,
        receiverId,
        content: message.trim(),
      });

      setMessage('');
      loadMessages();
    } catch (error: any) {
      toast.error('Ошибка отправки сообщения');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleUpdateStatus = async (status: ExchangeType['status']) => {
    if (!selectedExchange) return;

    try {
      await exchangeService.updateExchangeStatus(selectedExchange.id, { status });
      toast.success('Статус обновлен');
      loadExchanges();
      setSelectedExchange(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Ошибка обновления статуса');
    }
  };

  const statusConfig = {
    pending: { label: 'Ожидание подтверждения', color: 'bg-amber-100 text-amber-800', icon: Clock },
    confirmed: { label: 'Встреча назначена', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    rejected: { label: 'Отклонено', color: 'bg-red-100 text-red-800', icon: X },
    completed: { label: 'Завершено', color: 'bg-blue-100 text-blue-800', icon: Check },
    cancelled: { label: 'Отменено', color: 'bg-gray-100 text-gray-800', icon: X },
  };

  return (
    <div className="min-h-screen py-8 px-4 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-serif text-4xl font-bold text-gray-900 mb-8">
          Центр обмена
        </h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Exchange List */}
          <div className="lg:col-span-1">
            {/* Tabs */}
            <div className="mb-4 flex gap-2">
              <button
                onClick={() => setActiveTab('incoming')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'incoming'
                    ? 'bg-[#006D77] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Входящие
              </button>
              <button
                onClick={() => setActiveTab('outgoing')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'outgoing'
                    ? 'bg-[#006D77] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Исходящие
              </button>
            </div>

            {/* Exchange Cards */}
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006D77]"></div>
              </div>
            ) : exchanges.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Нет обменов
              </div>
            ) : (
              <div className="space-y-3">
                {exchanges.map((exchange) => {
                  const StatusIcon = statusConfig[exchange.status].icon;
                  const partner =
                    activeTab === 'incoming' ? exchange.requester : exchange.owner;
                  const myBook =
                    activeTab === 'incoming' ? exchange.ownerBook : exchange.requesterBook;
                  const theirBook =
                    activeTab === 'incoming' ? exchange.requesterBook : exchange.ownerBook;

                  return (
                    <div
                      key={exchange.id}
                      onClick={() => setSelectedExchange(exchange)}
                      className={`bg-white rounded-lg border p-4 cursor-pointer transition-all ${
                        selectedExchange?.id === exchange.id
                          ? 'border-[#006D77] shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={myBook.cover}
                            alt={myBook.title}
                            className="w-12 h-16 object-cover rounded"
                          />
                          <ArrowRightLeft className="w-4 h-4 text-gray-400" />
                          <img
                            src={theirBook.cover}
                            alt={theirBook.title}
                            className="w-12 h-16 object-cover rounded"
                          />
                        </div>
                      </div>
                      <p className="font-medium text-gray-900 mb-1">{partner.name}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <StatusIcon className="w-4 h-4" />
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${statusConfig[exchange.status].color}`}
                        >
                          {statusConfig[exchange.status].label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(exchange.createdAt).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            {selectedExchange ? (
              <div className="bg-white rounded-lg border border-gray-200 h-[600px] flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#006D77] to-[#83C5BE] rounded-full flex items-center justify-center text-white font-semibold">
                        {(activeTab === 'incoming'
                          ? selectedExchange.requester.name
                          : selectedExchange.owner.name
                        ).charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {activeTab === 'incoming'
                            ? selectedExchange.requester.name
                            : selectedExchange.owner.name}
                        </p>
                        <div className="flex items-center gap-2">
                          {React.createElement(statusConfig[selectedExchange.status].icon, {
                            className: 'w-4 h-4',
                          })}
                          <span className="text-sm text-gray-600">
                            {statusConfig[selectedExchange.status].label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {selectedExchange.status === 'pending' && activeTab === 'incoming' && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleUpdateStatus('confirmed')}
                          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                          Подтвердить
                        </button>
                        <button
                          onClick={() => handleUpdateStatus('rejected')}
                          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                        >
                          Отклонить
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                  <div className="space-y-4">
                    {messages.map((msg) => {
                      const isMyMessage = msg.senderId === user?.id;
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`px-4 py-2 rounded-lg shadow-sm max-w-xs ${
                              isMyMessage
                                ? 'bg-[#006D77] text-white'
                                : 'bg-white text-gray-800'
                            }`}
                          >
                            <p>{msg.content}</p>
                            <span
                              className={`text-xs mt-1 block ${
                                isMyMessage ? 'text-gray-200' : 'text-gray-500'
                              }`}
                            >
                              {new Date(msg.createdAt).toLocaleTimeString('ru-RU', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-200">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Напишите сообщение..."
                      disabled={sendingMessage}
                      className="flex-1 px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006D77] disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={sendingMessage || !message.trim()}
                      className="px-6 py-2 bg-[#006D77] text-white rounded-lg hover:bg-[#005962] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                      Отправить
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 h-[600px] flex items-center justify-center">
                <p className="text-gray-500">Выберите обмен для просмотра чата</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
