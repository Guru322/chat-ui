import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  AppBar, 
  Toolbar, 
  Paper,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { ollamaService } from '../services/OllamaService';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Array<{text: string, isUser: boolean}>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [streamingMessage, setStreamingMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Scroll to bottom whenever messages change or streaming message updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    // Add user message to chat
    setMessages(prev => [...prev, { text: message, isUser: true }]);
    setIsLoading(true);
    setStreamingMessage(''); // Reset streaming message
    
    try {
      // Call the Ollama API service with streaming updates
      await ollamaService.sendMessage(
        message,
        (text, done) => {
          // Update the streaming message as chunks arrive
          setStreamingMessage(text);
          
          // When streaming is complete, add the final message to the chat
          if (done) {
            setMessages(prev => [...prev, { text, isUser: false }]);
            setStreamingMessage('');
            setIsLoading(false);
          }
        }
      );
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message to chat
      setMessages(prev => [...prev, { 
        text: "Sorry, there was an error communicating with the AI service. Please try again.", 
        isUser: false 
      }]);
      setStreamingMessage('');
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 'bold',
              textAlign: 'center'
            }}
          >
            Guru's Ollama Server
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container 
        maxWidth="md" 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          py: isMobile ? 1 : 2,
          px: isMobile ? 1 : 2
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'hidden',
            mb: isMobile ? 1 : 2,
            borderRadius: 2,
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)'
          }}
        >
          <Box sx={{ 
            flexGrow: 1, 
            overflow: 'auto', 
            p: isMobile ? 1.5 : 2,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <MessageList 
              messages={messages} 
              isLoading={isLoading} 
              streamingMessage={streamingMessage}
            />
            <div ref={messagesEndRef} />
          </Box>
          
          <Box sx={{ 
            p: isMobile ? 1.5 : 2, 
            borderTop: 1, 
            borderColor: 'divider',
            backgroundColor: 'background.paper'
          }}>
            <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ChatInterface;
