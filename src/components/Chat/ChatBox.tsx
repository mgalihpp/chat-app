import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import Message from "./Message";
import { db } from "@/lib/firebase";
import {
  Timestamp,
  addDoc,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useParams } from "react-router-dom";

interface Message {
  uid: string;
  content: string;
  recipientId: string;
  sendId: string;
  timestamp: Date;
}

export default function ChatBox() {
  const [message, setMessage] = useState("");
  const { uid } = useParams();
  const [data, setData] = useState<Message[]>([]);
  const user = useSelector((state: RootState) => state.auth.user);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      where("recipientId", "in", [uid, user?.uid && user.uid]),
      where("sendId", "in", [uid, user?.uid && user.uid])
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedData: Message[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();

        const timestamp = data.timestamp as Timestamp;
        const time: Date = timestamp.toDate();

        fetchedData.push({
          uid: doc.id,
          ...data,
          timestamp: time,
        } as Message);
      });
      setData(fetchedData);
    });

    return () => unsubscribe();
  }, [user?.uid, uid]); // Empty dependency array to run the effect only once

  useEffect(() => {
    scrollToBottom();
  }, [data]);

  const sendMessage = async () => {
    if (!user) throw new Error("UNAUTHORIZED");

    const messageRef = collection(db, "messages");
    await addDoc(messageRef, {
      content: message,
      sendId: user?.uid,
      recipientId: uid,
      timestamp: new Date(),
    });

    setMessage("");
  };

  return (
    <div className="relative flex flex-col h-[calc(100vh-(68px+36px))] w-full">
      {/* Messages container */}
      <div className="bg-background/20 flex flex-col-reverse gap-2 p-4 flex-grow overflow-y-auto">
        {/* Someone's messages */}
        <div className="flex flex-col gap-2">
          {data
            .sort(
              (a, b) =>
                new Date(a.timestamp).getTime() -
                new Date(b.timestamp).getTime()
            )
            .map((message) => (
              <div
                key={message.uid}
                className={cn("flex flex-col gap-2", {
                  "items-start": message.sendId !== user?.uid,
                  "items-end": message.sendId === user?.uid,
                })}
              >
                <Message
                  isUserMessage={message.sendId === user?.uid}
                  message={message.content}
                  time={message.timestamp}
                />
              </div>
            ))}
          {/* Dummy div to serve as the scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>
      {/* Input field and send button */}
      <div className="bg-secondary px-4 py-2 flex-shrink-0">
        <div className="flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full block rounded-md mr-4 p-3 text-primary focus:outline-none focus:ring placeholder:text-primary bg-background/10"
            placeholder="Type your message..."
          />
          <Button onClick={sendMessage} size="lg">
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
