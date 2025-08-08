import { useCallback, useEffect, useState } from "react";
import { supabase } from "../utils/hooks/supabase";

const MESSAGES_TABLE = "messages";

export function useRealtimeChat({ roomName, username }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from(MESSAGES_TABLE)
        .select("*")
        .eq("room", roomName)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error loading messages:", error);
      } else {
        setMessages(data);
      }
    };

    fetchMessages();
  }, [roomName]);

  useEffect(() => {
    const channel = supabase.channel(`room-${roomName}`).on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: MESSAGES_TABLE,
        filter: `room=eq.${roomName}`,
      },
      (payload) => {
        setMessages((current) => [...current, payload.new]);
      }
    );

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomName]);

  const deleteFirstRow = async () => {
    const { data, error: fetchError } = await supabase
      .from(MESSAGES_TABLE)
      .select("*")
      .order("id", { ascending: true })
      .limit(1);

    if (fetchError) {
      console.error("Error fetching first row:", fetchError);
      return;
    }

    const { error: deleteError } = await supabase
      .from(MESSAGES_TABLE)
      .delete()
      .eq("id", data[0].id);

    if (deleteError) {
      console.error("Error deleting first row:", deleteError);
    }
  };

  const sendMessage = useCallback(async (content, user) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        content,
        user_email: user,
        room: "global_room",
        created_at: new Date().toISOString(),
      },
    ]);

    await deleteFirstRow();

    if (error) {
      console.error("Send message error:", error);
    }
  }, []);

  return { messages, sendMessage };
}
