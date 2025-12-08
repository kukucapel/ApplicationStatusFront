export interface ApplicationDetailDto {
  applicantId: number;
  assignedEmployeeId: number | null;
  assignedEmployee: {
    id: number;
    fio: string;
    email: string;
    role: string;
  } | null;
  assignedUnitId: number | null;
  createdAt: string;
  updatedAt: string;
  id: number;
  question: string;
  status: 'new' | 'in_progress' | 'completed' | 'closed';
  theme: string;
  toSend: string;
  assignedUnit?: { id: number; name: string };
  applicant: ApplicantDto;
  unitName: string;
}
export interface ApplicantDto {
  id: number;
  fio: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  postalCode1: string;
  postalCode2: string;
}

export interface ResponseDto {
  id: number;
  requestId: number;
  author_id: number;
  comment: string;
  type: string;
  created_at: string;
  author: Author;
  rating: number | null;
}

export interface Author {
  id: number;
  fio: string;
  email: string;
  unit_id: number;
}

export interface ResponseCreateDto {
  comment: string;
  type?: string;
}

export interface Application {
  applicantId: number;
  assignedEmployeeId: number | null;
  assignedUnitId: number | null;
  createdAt: string;
  id: number;
  question: string;
  status: 'new' | 'in_progress' | 'completed' | 'closed';
  theme: string;
  toSend: string;
  updatedAt: string;
  unitName: string | null;
}

export interface ApplicationUnitUpdate {
  assigned_unit_id: string | null;
}
