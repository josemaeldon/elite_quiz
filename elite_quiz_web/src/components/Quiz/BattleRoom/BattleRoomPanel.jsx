"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { t } from "@/utils";
import { useSelector } from "react-redux";
import {
  createBattleRoomApi,
  getBattleMessages,
  getBattleState,
  joinBattleRoomApi,
  sendBattleMessage,
} from "@/api/apiRoutes";

const parsePayload = (payload) => {
  if (!payload) return {};
  if (typeof payload === "string") {
    try {
      return JSON.parse(payload);
    } catch (error) {
      return { message: payload };
    }
  }
  return payload;
};

const BattleRoomPanel = ({
  title,
  description,
  metadata = {},
  defaultCategory = 1,
  maxPlayers = 4,
  mode = "",
}) => {
  const user = useSelector((state) => state.User?.data);
  const isLoggedIn = useSelector((state) => state.User?.isLogin);
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [entryCoin, setEntryCoin] = useState(0);
  const [pending, setPending] = useState(false);
  const [payload, setPayload] = useState("");
  const [error, setError] = useState(null);
  const [categoryId, setCategoryId] = useState(defaultCategory);
  const eventSourceRef = useRef(null);
  const messageIdsRef = useRef(new Set());

  const roomId = useMemo(() => room?.room_id, [room]);

  const parseStreamPayload = (event) => {
    if (!event?.data) {
      return null;
    }
    try {
      const parsed = JSON.parse(event.data);
      return parsed?.payload ?? null;
    } catch (parseError) {
      console.error("Erro ao decodificar evento SSE", parseError);
      return null;
    }
  };

  const appendMessage = (message) => {
    if (!message?.id || messageIdsRef.current.has(message.id)) {
      return;
    }
    messageIdsRef.current.add(message.id);
    setMessages((previous) => [
      ...previous,
      { ...message, payload: parsePayload(message.payload) },
    ]);
  };

  const upsertParticipant = (participant) => {
    if (!participant?.user_id) {
      return;
    }
    setParticipants((previous) => {
      const index = previous.findIndex((item) => item.user_id === participant.user_id);
      if (index > -1) {
        const updated = [...previous];
        updated[index] = { ...updated[index], ...participant };
        return updated;
      }
      return [...previous, participant];
    });
  };

  const handleRoomEvent = (event) => {
    const payload = parseStreamPayload(event);
    if (payload) {
      setRoom(payload);
    }
  };

  const handleParticipantEvent = (event) => {
    const payload = parseStreamPayload(event);
    if (payload) {
      upsertParticipant(payload);
    }
  };

  const handleMessageEvent = (event) => {
    const payload = parseStreamPayload(event);
    if (payload) {
      appendMessage(payload);
    }
  };

  const fetchState = async () => {
    if (!roomId) return;
    const response = await getBattleState({ room_id: roomId });
    if (!response?.error) {
      setRoom(response?.data?.room ?? room);
      setParticipants(response?.data?.participants ?? []);
    }
  };

  const fetchMessages = async () => {
    if (!roomId) return;
    const response = await getBattleMessages({ room_id: roomId, limit: 20 });
    if (!response?.error) {
      const formatted = (response?.messages ?? []).map((item) => ({
        ...item,
        payload: parsePayload(item.payload),
      }));
      messageIdsRef.current = new Set(formatted.map((item) => item.id));
      setMessages(formatted);
    }
  };

  useEffect(() => {
    if (!roomId) {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      messageIdsRef.current = new Set();
      return;
    }

    messageIdsRef.current = new Set();
    fetchState();
    fetchMessages();

    const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/$/, "");
    const apiPrefix = baseUrl ? `${baseUrl}/api` : "/api";
    const streamUrl = `${apiPrefix}/BattleRoom/stream?room_id=${encodeURIComponent(roomId)}`;

    let source = null;
    try {
      source = new EventSource(streamUrl);
      eventSourceRef.current = source;
      source.addEventListener("room_created", handleRoomEvent);
      source.addEventListener("participant_joined", handleParticipantEvent);
      source.addEventListener("message", handleMessageEvent);
      source.onerror = (streamError) => {
        console.error("Erro no stream de batalha", streamError);
      };
    } catch (streamError) {
      console.error("Erro ao iniciar stream de batalha", streamError);
    }

    return () => {
      if (source) {
        source.close();
      }
      if (eventSourceRef.current === source) {
        eventSourceRef.current = null;
      }
    };
  }, [roomId]);

  const resetRoom = () => {
    setRoom(null);
    setParticipants([]);
    setMessages([]);
  };

  const handleCreate = async () => {
    if (!isLoggedIn) return;
    setPending(true);
    setError(null);
    const response = await createBattleRoomApi({
      owner_id: user?.id,
      category_id: Number(categoryId) || defaultCategory,
      entry_coin: Number(entryCoin) || 0,
      max_players: maxPlayers,
      metadata: JSON.stringify({ ...metadata, mode }),
    });
    setPending(false);
    if (response?.error) {
      setError(response.message || t("unable_to_create_room"));
      return;
    }
    resetRoom();
    setRoom(response?.data ?? null);
  };

  const handleJoin = async () => {
    if (!roomId || !isLoggedIn) return;
    setPending(true);
    const response = await joinBattleRoomApi({
      room_id: roomId,
      user_id: user?.id,
    });
    setPending(false);
    if (response?.error) {
      setError(response.message || t("unable_to_join"));
    } else {
      fetchState();
    }
  };

  const handleSend = async () => {
    if (!roomId || !payload.trim()) return;
    setPending(true);
    const response = await sendBattleMessage({
      room_id: roomId,
      sender_id: user?.id,
      message: payload.trim(),
      is_text: true,
    });
    setPending(false);
    setPayload("");
    if (response?.error) {
      setError(response.message || t("unable_to_send_message"));
    } else {
      fetchMessages();
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-3xl font-semibold mb-4">{title}</h2>
        <p className="mb-4">{description}</p>
        <a href="/auth/login" className="text-primary-color font-semibold">
          {t("go_to_login") || "Ir para o login"}
        </a>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow p-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="text-sm text-muted">{description}</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="number"
              min="0"
              className="w-full sm:w-32 px-3 py-2 border rounded"
              value={entryCoin}
              onChange={(event) => setEntryCoin(event.target.value)}
              placeholder={t("entry_coin") || "Entrada"}
            />
            <Button variant="login" onClick={handleCreate} loading={pending}>
              {t("create_room")}
            </Button>
            {roomId && (
              <Button variant="outline" onClick={handleJoin} loading={pending}>
                {t("join_room")}
              </Button>
            )}
          </div>
        </header>
        {error && <div className="text-red-600 text-sm mt-3">{error}</div>}
        {room && (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <section>
              <h3 className="font-semibold text-sm uppercase text-muted">
                {t("room_info")}
              </h3>
              <p>
                <strong>{t("room_id")}:</strong> {room.room_id}
              </p>
              <p>
                <strong>{t("room_code")}:</strong> {room.room_code}
              </p>
              <p>
                <strong>{t("status")}:</strong> {room.status}
              </p>
            </section>
            <section>
              <h3 className="font-semibold text-sm uppercase text-muted">
                {t("participants")}
              </h3>
              <ul className="space-y-2 mt-2">
                {participants.map((participant) => (
                  <li
                    key={`${participant.user_id}-${participant.room_id}`}
                    className="flex items-center justify-between rounded border px-3 py-2"
                  >
                    <span>{participant.name || participant.user_id}</span>
                    <span className="text-xs font-semibold">
                      {participant.role}
                    </span>
                  </li>
                ))}
                {participants.length === 0 && (
                  <li className="text-sm text-muted">{t("waiting_for_players")}</li>
                )}
              </ul>
            </section>
          </div>
        )}
        {roomId && (
          <div className="mt-6">
            <h3 className="font-semibold text-sm uppercase text-muted">{t("chat")}</h3>
            <div className="border rounded p-4 max-h-60 overflow-y-auto">
              {messages.map((message) => (
                <div key={message.id} className="mb-2">
                  <p className="text-sm font-semibold">{message.name}</p>
                  <p className="text-xs text-muted">{message.created_at}</p>
                  <p className="text-sm">
                    {message.payload?.message?.message ?? message.payload?.message ?? t("empty_message")}
                  </p>
                </div>
              ))}
              {messages.length === 0 && (
                <p className="text-xs text-muted">{t("no_messages_yet")}</p>
              )}
            </div>
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                className="flex-1 px-3 py-2 border rounded"
                value={payload}
                onChange={(event) => setPayload(event.target.value)}
                placeholder={t("write_message") || "Escreva uma mensagem"}
              />
              <Button variant="login" onClick={handleSend} loading={pending}>
                {t("send")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BattleRoomPanel;
