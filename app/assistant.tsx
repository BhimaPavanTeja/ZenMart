import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Send, Sparkles, Bot, Trash2 } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { AIAssistantMessage } from '@/types';
import { Colors } from '@/constants/Colors';
import { sampleProducts } from '@/data/products';
import { useAI } from '@/hooks/useAI';

interface MessageBubbleProps {
  message: AIAssistantMessage;
  index: number;
}

function ProductRecommendation({ productId }: { productId: string }) {
  const product = sampleProducts.find(p => p.id === productId);
  
  if (!product) return null;
  
  return (
    <TouchableOpacity 
      onPress={() => router.push(`/product/${product.id}`)}
      style={styles.productCard}
    >
      <Image source={{ uri: product.images[0] }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productBrand}>{product.brand}</Text>
        <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
}

function parseMessageContent(content: string) {
  // Check if message contains product recommendations
  const productPattern = /• (.+?) - \$(\d+\.?\d*) \((.+?)\)/g;
  const matches = [...content.matchAll(productPattern)];
  
  if (matches.length > 0) {
    const products = matches.map(match => {
      const [, name, price, brand] = match;
      return sampleProducts.find(p => 
        p.name === name && 
        p.price === parseFloat(price) && 
        p.brand === brand
      );
    }).filter(Boolean);
    
    return { hasProducts: true, products, text: content };
  }
  
  return { hasProducts: false, products: [], text: content };
}
function MessageBubble({ message, index }: MessageBubbleProps) {
  const isUser = message.type === 'user';
  const parsedContent = parseMessageContent(message.content);
  
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50)}
      style={[
        styles.messageBubble,
        isUser ? styles.userMessage : styles.assistantMessage,
      ]}
    >
      {!isUser && (
        <View style={styles.botIcon}>
          <Bot size={16} color={Colors.primary[600]} />
        </View>
      )}
      <View style={[styles.messageContent, isUser ? styles.userContent : styles.assistantContent]}>
        <Text style={[styles.messageText, isUser ? styles.userText : styles.assistantText]}>
          {parsedContent.text}
        </Text>
        
        {/* Show product cards for recommendations */}
        {!isUser && parsedContent.hasProducts && (
          <View style={styles.productsContainer}>
            {parsedContent.products.map((product, idx) => (
              <ProductRecommendation key={`${product?.id}-${idx}`} productId={product?.id || ''} />
            ))}
          </View>
        )}
        
        <Text style={[styles.messageTime, isUser ? styles.userTime : styles.assistantTime]}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </Animated.View>
  );
}

export default function AIAssistantScreen() {
  const [inputText, setInputText] = useState('');
  const { messages, loading, sendMessage, clearMessages } = useAI(sampleProducts);
  const flatListRef = useRef<FlatList>(null);

  const handleSendMessage = async () => {
    if (inputText.trim() && !loading) {
      await sendMessage(inputText.trim());
      setInputText('');
      // Auto-scroll to bottom after sending
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const suggestedMessages = [
    "Recommend products for me",
    "Show me electronics under $200",
    "What's in my cart?",
    "Compare headphones",
    "Find eco-friendly products",
  ];

  const handleClearChat = () => {
    clearMessages();
  };

  const renderMessage = ({ item, index }: { item: AIAssistantMessage; index: number }) => (
    <MessageBubble message={item} index={index} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <View style={styles.headerIcon}>
              <Sparkles size={20} color={Colors.primary[600]} />
            </View>
            <View>
              <Text style={styles.headerTitle}>AI Shopping Assistant</Text>
              <Text style={styles.headerSubtitle}>Get personalized help</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleClearChat} style={styles.clearButton}>
            <Trash2 size={20} color={Colors.error} />
          </TouchableOpacity>
        </Animated.View>

        {/* Messages */}
        <View style={styles.messagesContainer}>
          {messages.length === 0 ? (
            <Animated.View entering={FadeInDown.delay(200)} style={styles.welcomeContainer}>
              <View style={styles.welcomeIcon}>
                <Bot size={48} color={Colors.primary[600]} />
              </View>
              <Text style={styles.welcomeTitle}>Hi! I'm your AI shopping assistant</Text>
              <Text style={styles.welcomeText}>
                I can help you find products, compare items, track your orders, and provide personalized recommendations based on your preferences.
              </Text>
              
              <View style={styles.suggestedContainer}>
                <Text style={styles.suggestedTitle}>Try asking me:</Text>
                {suggestedMessages.map((suggestion, index) => (
                  <Animated.View key={index} entering={FadeInRight.delay(300 + index * 100)}>
                    <TouchableOpacity
                      onPress={() => setInputText(suggestion)}
                      style={styles.suggestionButton}
                    >
                      <Text style={styles.suggestionText}>{suggestion}</Text>
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </View>
            </Animated.View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.messagesList}
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />
          )}
        </View>

        {/* Input Area */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Ask me anything about shopping..."
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              placeholderTextColor={Colors.text.muted}
            />
            <TouchableOpacity
              onPress={handleSendMessage}
              style={[styles.sendButton, (!inputText.trim() || loading) && styles.sendButtonDisabled]}
              disabled={!inputText.trim() || loading}
            >
              <Send size={20} color={!inputText.trim() || loading ? Colors.text.muted : '#fff'} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    marginRight: 16,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.text.muted,
    marginTop: 2,
  },
  clearButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.surface,
  },
  messagesContainer: {
    flex: 1,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  welcomeIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  suggestedContainer: {
    width: '100%',
  },
  suggestedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  suggestionButton: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  suggestionText: {
    fontSize: 16,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  messagesList: {
    padding: 20,
    paddingBottom: 0,
  },
  messageBubble: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  assistantMessage: {
    justifyContent: 'flex-start',
  },
  botIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  messageContent: {
    maxWidth: '80%',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userContent: {
    backgroundColor: Colors.primary[500],
    borderBottomRightRadius: 4,
  },
  assistantContent: {
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#fff',
  },
  assistantText: {
    color: Colors.text.primary,
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
  },
  userTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  assistantTime: {
    color: Colors.text.muted,
  },
  productsContainer: {
    marginTop: 12,
    gap: 8,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
    resizeMode: 'cover',
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  productBrand: {
    fontSize: 12,
    color: Colors.text.muted,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary[600],
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
    backgroundColor: Colors.background,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: Colors.surface,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.neutral[300],
  },
});