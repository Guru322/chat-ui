import React, { useEffect, useState } from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';

interface Message {
  text: string;
  isUser: boolean;
}

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  streamingMessage: string;
  isTyping: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  isLoading, 
  streamingMessage, 
  isTyping 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ flexGrow: 1, overflowY: 'auto', padding: 2 }}>
      {messages.length === 0 ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%',
          opacity: 0.7,
          flexDirection: 'column',
          p: 2
        }}>
          <Typography 
            variant={isMobile ? "body1" : "h6"} 
            align="center"
            sx={{ mb: 1 }}
          >
            Welcome to Guru's Ollama Server
          </Typography>
          <Typography 
            variant="body2" 
            align="center"
            color="text.secondary"
          >
            Start a conversation with Guru's AI model
          </Typography>
        </Box>
      ) : (
        messages.map((message, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: message.isUser ? 'flex-end' : 'flex-start',
              mb: 2,
            }}
          >
            <Box
              sx={{
                maxWidth: isMobile ? '85%' : '75%',
                p: isMobile ? 1.5 : 2,
                borderRadius: 2,
                bgcolor: message.isUser ? 'primary.main' : 'background.paper',
                color: message.isUser ? 'primary.contrastText' : 'text.primary',
                boxShadow: 1,
                wordBreak: 'break-word',
              }}
            >
              <Typography 
                variant="body1" 
                sx={{ 
                  whiteSpace: 'pre-wrap',
                  fontSize: isMobile ? '0.9rem' : '1rem'
                }}
              >
                {message.text}
              </Typography>
            </Box>
          </Box>
        ))
      )}

      {/* Display streaming message with typing effect */}
      {(isLoading || streamingMessage) && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            mb: 2,
          }}
        >
          <Box
            sx={{
              maxWidth: isMobile ? '85%' : '75%',
              p: isMobile ? 1.5 : 2,
              borderRadius: 2,
              bgcolor: 'background.paper',
              boxShadow: 1,
              wordBreak: 'break-word'
            }}
          >
            <Typography 
              variant="body1" 
              sx={{ 
                whiteSpace: 'pre-wrap',
                fontSize: isMobile ? '0.9rem' : '1rem'
              }}
            >
              {streamingMessage}
              {/* Show blinking cursor when waiting for first character or while typing */}
              {(isLoading && !streamingMessage) || isTyping ? (
                <span className="typing-cursor blink">▋</span>
              ) : null}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default MessageList;
