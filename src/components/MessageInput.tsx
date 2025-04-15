import React, { useState } from 'react';
import { Box, TextField, IconButton, useTheme, useMediaQuery } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState<string>('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex' }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Type your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={isLoading}
        sx={{ mr: 1 }}
        InputProps={{
          sx: {
            borderRadius: 2,
            fontSize: isMobile ? '0.9rem' : '1rem',
            py: isMobile ? 0.5 : 1,
          },
        }}
      />
      <IconButton 
        color="primary" 
        type="submit" 
        disabled={isLoading || !message.trim()} 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'background.paper',
          '&:hover': {
            bgcolor: 'primary.dark',
          },
          '&.Mui-disabled': {
            bgcolor: 'action.disabledBackground',
            color: 'action.disabled',
          },
          borderRadius: 2,
          width: isMobile ? 48 : 56,
          height: isMobile ? 48 : 56,
          minWidth: isMobile ? 48 : 56,
        }}
      >
        <SendIcon fontSize={isMobile ? "small" : "medium"} />
      </IconButton>
    </Box>
  );
};

export default MessageInput;
