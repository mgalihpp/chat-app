export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  text: string;
  files: string | null;
  created_At: Date;
  updated_At: Date;
}
