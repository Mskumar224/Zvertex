import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import './Dashboard.css';

interface UserData {
  email: string;
  subscription: string;
  phone: string | null;
  resumePaths: string[];
  linkedinProfile: string | null;
  coverLetter: string | null;
  technology: string | null;
  selectedCompanies: string[];
  jobsAppliedCount: number;
  scraperPreferences: {
    jobBoards: string[];
    frequency: string;
    location: string;
  };
}

interface ErrorResponse {
  message?: string;
  errorCode?: string;
}

const Dashboard = () => {
  const [userData, setUserData] = useState<UserData>({
    email: '',
    subscription: '',
    phone: null,
    resumePaths: [],
    linkedinProfile: null,
    coverLetter: null,
    technology: null,
    selectedCompanies: [],
    jobsAppliedCount: 0,
    scraperPreferences: { jobBoards: ['Indeed'], frequency: 'daily', location: 'United States' },
  });
  const [formData, setFormData] = useState({
    phone: '',
    linkedinProfile: '',
    coverLetter: '',
    technology: '',
  });
  const [error, setError] = useState('');
  const [needsPhoneUpdate, setNeedsPhoneUpdate] = useState(false);
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axios.get('https://zvertexai-orzv.onrender.com/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data.user);
        setNeedsPhoneUpdate(response.data.needs_phone_update);
        if (response.data.needs_phone_update) {
          alert('Please update your phone number in your profile.');
        }
        setFormData({
          phone: response.data.user.phone || '',
          linkedinProfile: response.data.user.linkedinProfile || '',
          coverLetter: response.data.user.coverLetter || '',
          technology: response.data.user.technology || '',
        });
      } catch (err) {
        const error = err as AxiosError<ErrorResponse>;
        setError(error.response?.data?.message || 'Failed to fetch dashboard data');
        if (error.response?.data?.errorCode === 'missing_phone') {
          setNeedsPhoneUpdate(true);
          alert('Please update your phone number in your profile.');
        }
      }
    };
    if (token) fetchDashboard();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'https://zvertexai-orzv.onrender.com/api/update-profile',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserData((prev) => ({
        ...prev,
        phone: response.data.user.phone,
        linkedinProfile: response.data.user.linkedinProfile,
        coverLetter: response.data.user.coverLetter,
        technology: response.data.user.technology,
      }));
      setNeedsPhoneUpdate(!response.data.user.phone);
      alert('Profile updated successfully');
      setError('');
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      setError(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!token) {
    return <div>Please log in to view your dashboard.</div>;
  }

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      {error && <p className="error">{error}</p>}
      {needsPhoneUpdate && (
        <p className="warning">Please update your phone number to continue using all features.</p>
      )}

      <h3>Profile</h3>
      <div className="profile-display">
        <p><strong>Email:</strong> {userData.email || 'Not set'}</p>
        <p><strong>Subscription:</strong> {userData.subscription || 'Not set'}</p>
        <p><strong>Phone:</strong> {userData.phone || 'Not set'}</p>
        <p><strong>LinkedIn:</strong> {userData.linkedinProfile || 'Not set'}</p>
        <p><strong>Cover Letter:</strong> {userData.coverLetter || 'Not set'}</p>
        <p><strong>Technology:</strong> {userData.technology || 'Not set'}</p>
        <p><strong>Companies:</strong> {userData.selectedCompanies.join(', ') || 'None'}</p>
        <p><strong>Jobs Applied:</strong> {userData.jobsAppliedCount}</p>
        <p><strong>Scraper Preferences:</strong></p>
        <ul>
          <li>Job Boards: {userData.scraperPreferences.jobBoards.join(', ')}</li>
          <li>Frequency: {userData.scraperPreferences.frequency}</li>
          <li>Location: {userData.scraperPreferences.location}</li>
        </ul>
      </div>

      <h3>Update Profile</h3>
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label htmlFor="phone">Phone (+1234567890)</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone (+1234567890)"
          />
        </div>
        <div className="form-group">
          <label htmlFor="linkedinProfile">LinkedIn Profile</label>
          <input
            type="text"
            id="linkedinProfile"
            name="linkedinProfile"
            value={formData.linkedinProfile}
            onChange={handleChange}
            placeholder="LinkedIn Profile"
          />
        </div>
        <div className="form-group">
          <label htmlFor="coverLetter">Cover Letter</label>
          <textarea
            id="coverLetter"
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleChange}
            placeholder="Cover Letter"
          />
        </div>
        <div className="form-group">
          <label htmlFor="technology">Technology</label>
          <input
            type="text"
            id="technology"
            name="technology"
            value={formData.technology}
            onChange={handleChange}
            placeholder="Technology"
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default Dashboard;