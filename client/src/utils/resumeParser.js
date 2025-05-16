// Placeholder for client-side resume handling; actual parsing moved to server
export const prepareResumeData = (file) => {
  if (!file) {
    throw new Error('No file provided');
  }
  if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
    throw new Error('Unsupported file format');
  }
  return file;
};