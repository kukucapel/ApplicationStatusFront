export interface ShareRequestDto {
  id: number;
  theme: string;
  question: string;
  status: string;
  created_at: string;
  updated_at: string;
  expires_at: string;
  to_position: {
    id: number;
    title: {
      id: number;
      name: string;
      kind: string;
    };
    employee: {
      id: number;
      fio: string;
    };
    unit: {
      id: number;
      unit_name: string;
      path: string;
    };
  };
}

export interface ShareResponseDto {
  id: number;
  author_user_id: number;
  comment: string;
  type: string;
  rating: number | null;
  created_at: string;
}

export interface ShareAttachmentsDto {
  id: number;
  url: string;
  response_id: number | null;
  created_at: string;
}

export interface ShareHistoryDto {
  id: number;
  old_status: string | null;
  new_status: string | null;
  old_unitId: number | null;
  new_unitId: number | null;
  type:
    | 'status_changed'
    | 'assignment_changed'
    | 'response_created'
    | 'attachment_uploaded'
    | null;
  created_at: string;
}

export interface ShareApplicationDto {
  request: ShareRequestDto;
  responses: [] | ShareResponseDto[];
  attachments: [] | ShareAttachmentsDto[];
  history: [] | ShareHistoryDto[];
  expires_at: any;
}
