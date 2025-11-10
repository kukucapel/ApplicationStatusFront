'use client';

import { useEffect, useRef, useState } from 'react';
import { Application } from '@/dtos/ApplicationDto';

export function useAppWS(token: string | null) {
  const [connected, setConnected] = useState(false);
  const applicationRef = useRef<Application[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    applicationRef.current = applications;
  }, [applications]);
  useEffect(() => {
    // if (!token) return;

    const ws = new WebSocket('ws://localhost:5000/api/v1/user/requests/ws');
    wsRef.current = ws;
    ws.onopen = () => {
      console.log('Connected');
      setConnected(true);
      ws.send(JSON.stringify({ type: 'auth:jwt', payload: { token } }));
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      // console.log('WS message type:', msg.type);

      switch (msg.type) {
        case 'auth:ok':
          console.log('Id:', msg.payload.userId);
          break;
        case 'request:created':
          setApplications((prev) => [...prev, msg.payload.newApplication[0]]);
          break;
        case 'requests:list':
          setApplications(msg.payload.items);
          break;
        case 'error':
          console.error('Ошибка:', msg.payload);
          break;
        case 'request:updated':
          const { id } = msg.payload;

          setApplications((prev) => {
            const exists = prev.some((app) => app.id === id);
            if (exists) {
              // обновляем существующую заявку
              return prev.map((app) =>
                app.id === id ? { ...msg.payload } : app
              );
            } else {
              // добавляем новую заявку
              return [...prev, { ...msg.payload }];
            }
          });
          break;
        case 'request:removedFromUnit':
          setApplications((prev) =>
            prev.filter((app) => app.id !== msg.payload.id)
          );
          break;
        default:
        // console.log('Получено:', msg);
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

  return { connected, applications, send };
}
