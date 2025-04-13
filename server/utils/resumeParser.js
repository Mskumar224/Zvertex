const fs = require('fs').promises;

const techList = [
  'JavaScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'PHP', 'Go', 'Swift', 'Kotlin',
  'TypeScript', 'SQL', 'R', 'MATLAB', 'Scala', 'Perl', 'Haskell', 'Lua', 'Rust', 'Dart',
  'Elixir', 'Clojure', 'F#', 'Groovy', 'PowerShell', 'Shell', 'HTML', 'CSS', 'React',
  'Angular', 'Vue.js', 'Node.js', 'Django', 'Flask', 'Spring', 'ASP.NET', 'Laravel',
  'Ruby on Rails', 'Express.js', 'FastAPI', 'TensorFlow', 'PyTorch', 'Keras', 'Scikit-learn',
  'Pandas', 'NumPy', 'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'Ansible',
  'Jenkins', 'Git', 'Linux', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Oracle', 'SQL Server',
  'Cassandra', 'Elasticsearch', 'Prometheus', 'Grafana',
];

const parseResume = async (filePath) => {
  try {
    // Mock parsing (replace with real parser like pdf2json or docx-parser)
    const content = await fs.readFile(filePath, 'utf8');
    const technologies = techList.filter((tech) =>
      content.toLowerCase().includes(tech.toLowerCase())
    );
    return technologies;
  } catch (err) {
    console.error('Resume parsing error:', err);
    return [];
  }
};

module.exports = { parseResume };