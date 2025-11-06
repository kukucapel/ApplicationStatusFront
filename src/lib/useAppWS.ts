'use client';

import { useEffect, useRef, useState } from 'react';

export interface Application {
  applicant_id: number;
  assigned_employee_id: number | null;
  assigned_unit_id: number | null;
  created_at: string;
  id: number;
  question: string;
  status: 'new' | 'in_progress' | 'completed' | 'closed';
  theme: string;
  to_send: string;
  updated_at: string;
}

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

    const ws = new WebSocket('ws://localhost:5000/api/v1/requests/ws');
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
        case 'request:status:changed':
          const { id, new_status } = msg.payload;

          setApplications((prev) =>
            prev.map((app) =>
              app.id === id ? { ...app, status: new_status } : app
            )
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
