export interface NewApplicationFormData {
  full_name?: string;
  email?: string;
  phone?: string;
  registration_address?: string;
  registration_postal_code?: string;
  residence_address?: string;
  residence_postal_code?: string;
  recipient?: string;
  subject?: string;
  description?: string;
}

export const createApplication = async (data: NewApplicationFormData) => {
  //доделать
  console.log('Create');
};
