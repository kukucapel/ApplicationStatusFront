'use client';

import { useEffect, useRef, useState } from 'react';
import { Application } from '@/dtos/ApplicationDto';

export function useAppWS(token: string | null) {
  const [connected, setConnected] = useState(false);
  const applicationRef = useRef<Application[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    applicationRef.current = applications;
  }, [applications]);

  const connect = () => {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || '');
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      ws.send(JSON.stringify({ type: 'auth:jwt', payload: { token } }));
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

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

        case 'request:updated': {
          const { id } = msg.payload;

          setApplications((prev) => {
            const exists = prev.some((app) => app.id === id);
            return exists
              ? prev.map((app) => (app.id === id ? msg.payload : app))
              : [...prev, msg.payload];
          });

          break;
        }

        case 'request:removedFromUnit':
          setApplications((prev) =>
            prev.filter((app) => app.id !== msg.payload.id)
          );
          break;
      }
    };

    ws.onclose = () => {
      console.log('Disconnected');
      setConnected(false);

      if (!reconnectTimer.current) {
        reconnectTimer.current = setTimeout(() => {
          reconnectTimer.current = null;
          connect();
        }, 2000);
      }
    };
  };

  useEffect(() => {
    connect();
    return () => wsRef.current?.close();
  }, [token]);

  const send = (type: string, payload: any = {}) => {
    wsRef.current?.send(JSON.stringify({ type, payload }));
  };

  return { connected, applications, send };
}
