import { useChat } from '@/hooks/useChat';
import { Message } from '@/types/chat';
import { useEffect, useRef, useState } from 'react';
import { useFetcher } from 'react-router-dom';
import ChatHeader from '@/components/Chat/ChatHeader';
import { formatMessageTime } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import MessageInput from '@/components/Chat/MessageInput';

interface ActionData {
  messages?: Message[];
}

function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([]);

  const selectedUser = useChat().selectedUser;
  const auth = useAuth().auth;
  const chatMessages = useChat().messages;
  const subscribeToMessages = useChat().subscribeToMessages;
  const unsubscribeFromMessages = useChat().unsubscribeFromMessages;

  const fetcher = useFetcher<ActionData>({
    key: 'chat',
  });

  const messageEndRef = useRef<HTMLDivElement>(null);

  // Combine loader messages with socket messages
  useEffect(() => {
    if (fetcher.data?.messages) {
      setMessages(fetcher.data.messages); // Initialize with loader messages
    }
  }, [fetcher.data]);

  useEffect(() => {
    setMessages((prev) => {
      const newMessages = chatMessages.filter(
        (msg) => !prev.some((existing) => existing.id === msg.id)
      );
      return [...prev, ...newMessages];
    });
  }, [chatMessages]);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }, [messages]);

  // Subscribe and unsubscribe to socket messages
  useEffect(() => {
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [subscribeToMessages, unsubscribeFromMessages]);

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages?.map((message) => (
          <div
            key={message.id}
            className={`chat ${
              message.senderId === auth?.id ? 'chat-end' : 'chat-start'
            }`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === auth?.id
                      ? auth?.avatar || '/avatar.png'
                      : selectedUser?.avatar || '/avatar.png'
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.created_At)}
              </time>
            </div>
            <div
              className={`chat-bubble flex flex-col ${
                message.senderId === auth?.id
                  ? 'chat-bubble-primary'
                  : 'bg-base-200'
              }`}
            >
              {message.files && (
                <img
                  src={message.files}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && (
                <p
                  className={`${
                    message.senderId === auth?.id
                      ? 'text-primary-content'
                      : 'text-base-content'
                  }`}
                >
                  {message.text}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
}

export default ChatContainer;
