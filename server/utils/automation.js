const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const parseResume = async (resumeFile) => {
  try {
    // Simulate resume parsing (replace with actual PDF/text parsing logic)
    const resumeData = {
      name: 'John Doe', // Extracted from resume
      phone: '123-456-7890',
      technologies: ['JavaScript', 'Python', 'React'],
      email: 'john.doe@example.com',
    };
    return resumeData;
  } catch (err) {
    console.error('Resume parsing error:', err.message);
    return {};
  }
};

module.exports = { parseResume };