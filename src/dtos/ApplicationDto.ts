export interface ApplicationDetailDto {
  id: number;
  status: 'new' | 'in_progress' | 'completed' | 'closed';
  theme: string;
  question: string;
  createdAt: string;
  updatedAt: string;
  toPosition: {
    employee: {
      fio: string;
      login: string;
    };
    id: number;
    kind: string;
    title: {
      id: number;
      name: string;
      kind: string;
    };
    unit: {
      id: number;
      unit_name: string;
      path: string;
    } | null;
  };
  assignedUserId: number;
  assignedUser: {
    id: number;
    fio: string;
    email: string;
    role: string;
  } | null;

  applicant: ApplicantDto;
}
export interface ApplicantDto {
  id: number;
  fio: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  postal_code1: string;
  postal_code2: string;
}

export interface ResponseDto {
  id: number;
  request_id: number;
  author_user_id: number;
  comment: string;
  type: string;
  created_at: string;
  author: Author;
  rating: number | null;
  attachments: AttachmentDto[];
}
export interface AttachmentDto {
  id: number;
  url: string;
  uploaded_by_user_id: number;
  created_at: string;
}
export interface Author {
  id: number;
  fio: string;
  email: string;
  unit_id: number;
}

export interface ResponseCreateDto {
  comment: string | null;
  type?: string;
}

export interface Application {
  applicant: {
    id: number;
    fio: string;
  };
  assignedUser: {
    employee: {
      id: number;
      fio: string;
      role: string;
    } | null;
    id: number;
    login: string;
    role: string;
  } | null;
  createdAt: string;
  id: number;
  question: string;
  status: 'new' | 'in_progress' | 'closed';
  theme: string;
  toPosition: {
    employee: {
      fio: string;
      login: string;
    };
    id: number;
    kind: string;
    title: string;
    unit: {
      id: number;
      unit_name: string;
      path: string;
    } | null;
  };
  updatedAt: string;
}

export interface ApplicationUnitUpdate {
  assigned_unit_id: string | null;
}
