import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000"; // Make sure this matches your backend

// ✅ Login API
export const login = async (email, password) => {
  return axios.post(`${API_BASE_URL}/auth/login`, { email, password });
};

// ✅ Signup API
export const signup = async (email, password) => {
  return axios.post(`${API_BASE_URL}/auth/signup`, { email, password });
};

// ✅ Request OTP for Password Reset
export const requestReset = async (email) => {
  return axios.post(`${API_BASE_URL}/auth/request-password-reset`, { email });
};

// ✅ Reset Password with OTP
export const resetPassword = async (email, otp, newPassword) => {
  return axios.post(`${API_BASE_URL}/auth/reset-password`, {
    email,
    otp,
    new_password: newPassword,
  });
};
