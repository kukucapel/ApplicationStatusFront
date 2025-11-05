'use client';

import { useEffect, useRef, useState } from 'react';

export function useAppWS(
  token:
    | string
    | null = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJhQGEuYSIsImZpbyI6ImEiLCJpYXQiOjE3NjE4MzYyMjV9.3D3clUogPJOsFWrNDuGlfO-eMd6QMiLQxBgDzGYwFBU'
) {
  const [connected, setConnected] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!token) return;
    console.log(token);
    const ws = new WebSocket('ws://localhost:5000/api/v1/requests/ws');
    wsRef.current = ws;
    ws.onopen = () => {
      console.log('Connected');
      setConnected(true);
      // авторизуемся
      ws.send(JSON.stringify({ type: 'auth:jwt', payload: { token } }));
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      switch (msg.type) {
        case 'auth:ok':
          console.log('Авторизован:', msg.payload.userId);
          break;

        case 'requests:list':
          setItems(msg.payload.items);
          break;

        case 'error':
          console.error('Ошибка:', msg.payload);
          break;

        default:
          console.log('Получено:', msg);
      }
    };

    ws.onclose = () => {
      console.log('Disconnected');
      setConnected(false);
    };

    return () => ws.close();
  }, [token]);
  const send = (type: string, payload: any = {}) => {
    wsRef.current?.send(JSON.stringify({ type, payload }));
  };

  return { connected, items, send };
}
