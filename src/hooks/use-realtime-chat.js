import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../utils/hooks/supabase';

const MESSAGES_TABLE = 'messages';

const prompt = [
  {
    role: "system",
    content: "act crazy all caps"
  }];

async function fetchInitialMessage() {
  const response = await getChat(prompt);
  // const message = response.choices[0].message;
  // console.log("message: ", message);
  const content = response.choices[0].message.content;
  console.log("content: ", content);

  return content;
}



export function useRealtimeChat({ roomName, username }) {
  const [messages, setMessages] = useState([]);

 useEffect(() => {
  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from(MESSAGES_TABLE)
      .select('*')
      .eq('room', roomName)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error loading messages:', error);
    } else {
      console.log('Initial fetch messages:', data.length);
      setMessages(data);
    }
  };

  fetchMessages();
}, [roomName]);

useEffect(() => {
  const channel = supabase
    .channel(`room-${roomName}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: MESSAGES_TABLE,
        filter: `room=eq.${roomName}`,
      },
      (payload) => {
        // console.log('✅ Realtime message received:', payload.new);
        setMessages((current) => [...current, payload.new]);
      }
    )
    .on('error', (error) => {
      console.error('❌ Supabase channel error:', error); 
    })
    .subscribe((status) => {
      console.log('📡 Subscription status:', status);
    });

  return () => {
    supabase.removeChannel(channel);
  };
}, [roomName]);





  // 3. Insert a new message into messages
  const sendMessage = useCallback(
    async (content, user = username) => {
      const { error } = await supabase.from(MESSAGES_TABLE).insert({
        content,
        user_email: user,
        room: roomName,
      });

      if (error) {
        console.error('Send message error:', error);
      }
    },
    [roomName, username]
  );

  return { messages, sendMessage };
}
