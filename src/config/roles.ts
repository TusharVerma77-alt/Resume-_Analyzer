import type { JobRole } from '../types/resume';

export const INITIAL_ROLES: JobRole[] = [
  {
    id: 'fullstack-engineer',
    title: 'Full Stack Engineer',
    department: 'Engineering',
    level: 'Senior',
    requiredSkills: ['React', 'TypeScript', 'Node.js', 'REST API', 'GraphQL', 'SQL', 'Git', 'Docker'],
    preferredSkills: ['Next.js', 'PostgreSQL', 'Redis', 'AWS', 'TailwindCSS', 'Jest', 'CI/CD'],
    sectionKeywords: {
      skills: ['React', 'TypeScript', 'Node.js', 'Express', 'HTML5', 'CSS3', 'PostgreSQL', 'MongoDB'],
      experience: ['Developed scalable frontend components', 'Architected backend REST API', 'Optimized database query response time', 'Led team code reviews'],
      education: ['Computer Science', 'Software Engineering', 'Information Technology', 'B.S.', 'M.S.'],
      projects: ['Full stack web application', 'Real-time dashboard', 'Authentication workflow', 'Cloud deployment'],
      certifications: ['AWS Certified Developer', 'Full Stack Web Development', 'Meta Frontend Certification']
    }
  },
  {
    id: 'backend-engineer',
    title: 'Backend Engineer',
    department: 'Engineering',
    level: 'Senior',
    requiredSkills: ['Java', 'Python', 'Go', 'Microservices', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes'],
    preferredSkills: ['Kafka', 'gRPC', 'AWS Lambda', 'DynamoDB', 'System Design', 'CI/CD'],
    sectionKeywords: {
      skills: ['Java', 'Spring Boot', 'Python', 'Go', 'Golang', 'PostgreSQL', 'Redis', 'Kafka', 'Docker'],
      experience: ['Designed high-throughput microservices', 'Managed database migrations', 'Reduced API latency by 40%', 'Implemented gRPC contracts'],
      education: ['Computer Science', 'Distributed Systems', 'B.S.', 'M.S.'],
      projects: ['Event-driven order pipeline', 'Low latency caching layer', 'Microservice migration'],
      certifications: ['AWS Certified Solutions Architect', 'CKA Kubernetes Administrator']
    }
  },
  {
    id: 'frontend-engineer',
    title: 'Frontend Engineer',
    department: 'Engineering',
    level: 'Mid',
    requiredSkills: ['JavaScript', 'TypeScript', 'React', 'HTML5', 'CSS3', 'State Management', 'Webpack/Vite'],
    preferredSkills: ['Next.js', 'TailwindCSS', 'Redux Toolkit', 'Zustand', 'Web Vitals', 'Cypress'],
    sectionKeywords: {
      skills: ['React', 'TypeScript', 'JavaScript (ES6+)', 'HTML/CSS', 'Redux', 'TailwindCSS', 'Vite'],
      experience: ['Built responsive user interfaces', 'Optimized Core Web Vitals', 'Implemented accessible WCAG standards', 'Migrated legacy jQuery to React'],
      education: ['Computer Science', 'Human Computer Interaction', 'B.S.'],
      projects: ['Design system library', 'Single page app dashboard', 'Performance optimization'],
      certifications: ['Meta Frontend Developer', 'React Certification']
    }
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist / ML Engineer',
    department: 'Data & AI',
    level: 'Senior',
    requiredSkills: ['Python', 'SQL', 'PyTorch', 'TensorFlow', 'Scikit-learn', 'Pandas', 'NumPy', 'Data Visualization'],
    preferredSkills: ['LLM Fine-tuning', 'LangChain', 'Vector Databases', 'Milvus', 'Pinecone', 'MLOps', 'Docker'],
    sectionKeywords: {
      skills: ['Python', 'PyTorch', 'TensorFlow', 'SQL', 'Scikit-learn', 'Pandas', 'MLOps', 'LangChain'],
      experience: ['Trained classification ML models', 'Fine-tuned Large Language Models', 'Built feature engineering pipeline', 'Deployed models to production'],
      education: ['Data Science', 'Machine Learning', 'Statistics', 'Computer Science', 'Ph.D.', 'M.S.'],
      projects: ['Sentiment analysis model', 'RAG AI Assistant', 'Predictive analytics engine'],
      certifications: ['AWS Machine Learning Specialty', 'TensorFlow Developer Certificate']
    }
  },
  {
    id: 'product-manager',
    title: 'Technical Product Manager',
    department: 'Product',
    level: 'Senior',
    requiredSkills: ['Product Roadmap', 'Agile/Scrum', 'User Research', 'SQL', 'A/B Testing', 'Stakeholder Management'],
    preferredSkills: ['Jira', 'Mixpanel', 'Figma', 'PRD Writing', 'Technical Architecture', 'SaaS Metrics'],
    sectionKeywords: {
      skills: ['Roadmap Planning', 'Agile', 'Scrum', 'User Stories', 'PRD', 'SQL', 'A/B Testing', 'Data Analytics'],
      experience: ['Defined product vision and quarterly roadmap', 'Increased DAU by 25%', 'Led cross-functional team of 10 engineers', 'Conducted user interviews'],
      education: ['Business Administration', 'Computer Science', 'B.S.', 'MBA'],
      projects: ['SaaS platform redesign', 'Mobile app launch', 'Growth monetization initiative'],
      certifications: ['Certified Scrum Product Owner (CSPO)', 'PMP']
    }
  }
];
