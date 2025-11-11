// types/share.ts
export type HistoryItem = {
  id: number;
  oldStatus: string | null;
  newStatus: string;
  oldUnitId: number | null;
  newUnitId: number | null;
  createdAt: string;
};

export type ShareApi = {
  request: {
    id: number;
    theme: string;
    question: string;
    status: string;
    toSend: string | null;
    createdAt: string;
    updatedAt: string;
    assignedUnitId: number | null;
    unitName: string | null;
  };
  history: HistoryItem[];
  expiresAt: string | null;
};
