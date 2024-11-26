import { useRef, useState } from 'react';
import { Image, Send, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useFetcher } from 'react-router-dom';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import { Message } from '@/types/chat';
import { sendMessage } from '@/routes/Home/actions/chatAction';

const MessageInput = () => {
  const selectedUser = useChat().selectedUser;
  const setMessage = useChat().setMessage;
  const auth = useAuth().auth;
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(
    null
  );

  const fetcher = useFetcher({
    key: 'chat',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files) return;

    const file = files[0];

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5 MB limit
      toast.error('File size exceeds 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    const messageInput = (e.target as HTMLFormElement).text.value.trim();
    const attachmentFile = (e.target as HTMLFormElement).attachment.files[0];

    if (!messageInput) {
      // toast.error('Please enter a message or select an image');
      return;
    }

    const formData = new FormData(e.target as HTMLFormElement);
    if (attachmentFile !== undefined) {
      formData.set('attachment', attachmentFile);
    } else {
      formData.delete('attachment');
    }
    formData.append('senderId', String(auth?.id));
    formData.append('receiverId', String(selectedUser?.id));

    // Create a new message object for optimistic update
    const newMessage: Message = {
      id: Math.random() * 5,
      senderId: auth?.id ?? 0,
      receiverId: selectedUser?.id ?? 0,
      text: messageInput,
      files: imagePreview as string,
      created_At: new Date(),
      updated_At: new Date(),
    };

    // Optimistically update chat messages
    setMessage(newMessage);

    try {
      await sendMessage(formData, { id: String(selectedUser?.id) });

      // Clear form
      formRef.current?.reset();
      formData.forEach((_, key) => {
        formData.delete(key);
      });
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    }
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview as string}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <fetcher.Form
        ref={formRef}
        onSubmit={handleSendMessage}
        className="flex items-center gap-2"
      >
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            name="text"
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            name="attachment"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? 'text-emerald-500' : 'text-zinc-400'}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-circle"
          disabled={fetcher.state !== 'idle'}
        >
          <Send size={22} />
        </button>
      </fetcher.Form>
    </div>
  );
};
export default MessageInput;
