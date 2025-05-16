const express = require('express');
const router = express.Router();
const pdfParse = require('pdf-parse');
const auth = require('../middleware/auth');

router.post('/parse', auth, async (req, res) => {
  if (!req.files || !req.files.resume) {
    return res.status(400).json({ msg: 'No resume file uploaded' });
  }

  const file = req.files.resume;

  try {
    let text = '';
    if (file.mimetype === 'application/pdf') {
      const pdf = await pdfParse(file.data);
      text = pdf.text;
    } else if (file.mimetype.includes('msword') || file.mimetype.includes('officedocument')) {
      // Mock doc/docx parsing (requires additional library like mammoth.js)
      text = 'Sample resume text from doc/docx';
    } else {
      return res.status(400).json({ msg: 'Unsupported file format' });
    }

    // Basic parsing logic for key fields
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
    const phoneRegex = /\b(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/;
    const techKeywords = ['JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'AWS', 'Docker', 'Kubernetes', 'SQL', 'MongoDB', 'TensorFlow'];
    const companyKeywords = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Indeed', 'LinkedIn'];

    const resumeData = {
      name: lines[0] || 'Unknown',
      email: lines.find(line => emailRegex.test(line))?.match(emailRegex)?.[0] || '',
      phone: lines.find(line => phoneRegex.test(line))?.match(phoneRegex)?.[0] || '',
      technologies: lines
        .flatMap(line => techKeywords.filter(tech => line.toLowerCase().includes(tech.toLowerCase())))
        .filter((v, i, a) => a.indexOf(v) === i),
      companies: lines
        .flatMap(line => companyKeywords.filter(comp => line.toLowerCase().includes(comp.toLowerCase())))
        .filter((v, i, a) => a.indexOf(v) === i),
    };

    res.json(resumeData);
  } catch (err) {
    console.error('Resume parsing error:', err.message);
    res.status(500).json({ msg: 'Failed to parse resume' });
  }
});

module.exports = router;