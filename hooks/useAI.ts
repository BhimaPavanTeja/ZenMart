import { useState, useEffect } from 'react';
import { AIAssistantMessage, Product } from '@/types';
import { AIService } from '@/services/aiService';
import { StorageUtils } from '@/utils/storage';

export function useAI(products: Product[]) {
  const [messages, setMessages] = useState<AIAssistantMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const aiService = AIService.getInstance();

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    const savedMessages = await StorageUtils.getAIMessages();
    setMessages(savedMessages);
  };

  const sendMessage = async (content: string) => {
    const userMessage: AIAssistantMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const response = await aiService.processMessage(content, products);
      
      const assistantMessage: AIAssistantMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      await StorageUtils.saveAIMessages(finalMessages);
    } catch (error) {
      console.error('Error processing AI message:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRecommendations = (limit: number = 5) => {
    return aiService.getPersonalizedRecommendations(products, limit);
  };

  const trackProductView = (productId: string, timeSpent?: number) => {
    aiService.trackProductView(productId, timeSpent);
  };

  const trackSearch = (query: string) => {
    aiService.trackSearch(query);
  };

  const clearMessages = async () => {
    setMessages([]);
    await StorageUtils.saveAIMessages([]);
  };

  return {
    messages,
    loading,
    sendMessage,
    getRecommendations,
    trackProductView,
    trackSearch,
    clearMessages,
  };
}