export interface ShareRequestDto {
  id: number;
  theme: string;
  question: string;
  status: string;
  toSend: string;
  createdAt: string;
  updatedAt: string;
  assignedUnitId: number | null;
  unitName: string | null;
}

export interface ShareResponseDto {
  id: number;
  authorId: number;
  comment: string;
  type: string;
  rating: number | null;
  createdAt: string;
}

export interface ShareAttachmentsDto {
  id: number;
  url: string;
  responseId: number | null;
  createdAt: string;
}

export interface ShareHistoryDto {
  id: number;
  oldStatus: string | null;
  newStatus: string | null;
  oldUnitId: number | null;
  newUnitId: number | null;
  type:
    | 'status_changed'
    | 'assignment_changed'
    | 'response_created'
    | 'attachment_uploaded'
    | null;
  createdAt: string;
}

export interface ShareApplicationDto {
  request: ShareRequestDto;
  responses: [] | ShareResponseDto[];
  attachments: [] | ShareAttachmentsDto[];
  history: [] | ShareHistoryDto[];
  expiresAt: any;
}
