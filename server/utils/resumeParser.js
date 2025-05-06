const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const parseResume = async (file) => {
  try {
    const fileType = file.mimetype;
    const fileSize = file.size;
    console.log('Parsing resume:', { fileType, fileSize });

    let text;
    if (fileType === 'application/pdf') {
      const pdfData = await pdfParse(file.data, { max: 20 }); // Limit to 20 pages
      text = pdfData.text;
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const docData = await mammoth.extractRawText({ buffer: file.data });
      text = docData.value;
    } else {
      throw new Error('Unsupported file format. Please upload a PDF or DOCX file.');
    }

    return { text, parsedAt: new Date() };
  } catch (error) {
    console.error('Resume parsing error:', error.message);
    throw new Error('Failed to parse resume: ' + error.message);
  }
};

module.exports = { parseResume };