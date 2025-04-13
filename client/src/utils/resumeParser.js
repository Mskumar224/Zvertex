export const parseResume = async (file) => {
    // Mock resume parsing (replace with real parsing library like pdf2json or docx-parser)
    const technologies = [
      'JavaScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'Go', 'TypeScript', 'PHP', 'Swift',
      'Kotlin', 'React', 'Angular', 'Vue.js', 'Node.js', 'Django', 'Flask', 'Spring', 'AWS', 'Azure',
    ];
    const extracted = {
      name: 'John Doe', // Placeholder
      email: 'john.doe@example.com', // Placeholder
      phone: '123-456-7890', // Placeholder
      technologies: technologies.slice(0, Math.floor(Math.random() * 5) + 1),
      experience: 'Software Engineer at Tech Corp', // Placeholder
    };
    return extracted;
  };