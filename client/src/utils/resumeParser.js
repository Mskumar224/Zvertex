export const parseResume = (file) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: file.name.split('.')[0],
        phone: '123-456-7890',
        technologies: ['JavaScript', 'React', 'Node.js'],
      });
    }, 1000);
  });
};