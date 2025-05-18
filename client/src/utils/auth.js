import axios from 'axios';

export const checkAuth = async () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (err) {
    localStorage.removeItem('token');
    return false;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};