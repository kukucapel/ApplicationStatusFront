export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

export const loginUser = async (data: LoginFormData) => {
  //доделать
  console.log('Login');
};

export const registerUser = async (data: RegisterFormData) => {
  //доделать
  console.log('Register');
};
