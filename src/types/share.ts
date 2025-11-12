export type HistoryItem = {
  id: number;
  oldStatus: string | null;
  newStatus: string;
  oldUnitId: number | null;
  newUnitId: number | null;
  createdAt: string;
};

export type ResponseEntry = {
  id: number;
  authorId: number;
  comment: string;
  type: string;
  createdAt: string;
};

export type AttachmentEntry = {
  id: number;
  url: string;
  responseId: number | null;
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

  // дополнительные поля (опциональные)
  responses?: ResponseEntry[];
  attachments?: AttachmentEntry[];
};
