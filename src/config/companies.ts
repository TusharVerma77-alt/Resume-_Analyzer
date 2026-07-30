import type { Company } from '../types/resume';

export const INITIAL_COMPANIES: Company[] = [
  {
    id: 'google',
    name: 'Google',
    industry: 'Technology & Cloud',
    description: 'High emphasis on algorithms, scalable system design, leadership metrics, and Go/Python/C++.',
    scoringWeights: {
      keywordMatchWeight: 35,
      experienceWeight: 25,
      educationWeight: 10,
      skillsWeight: 20,
      formattingWeight: 10,
    },
    atsKeywords: [
      { category: 'System Architecture', keywords: ['Distributed Systems', 'Scalability', 'Microservices', 'Kubernetes', 'gRPC', 'Cloud Architecture'], weight: 9 },
      { category: 'Algorithms & CS', keywords: ['Data Structures', 'Algorithms', 'Optimization', 'Concurrency', 'Big-O Analysis'], weight: 10 },
      { category: 'Leadership & Impact', keywords: ['Impact', 'Scale', 'Mentorship', 'Cross-functional', 'Metrics Driven', 'Launched'], weight: 8 },
      { category: 'Tech Stack', keywords: ['Python', 'Go', 'Golang', 'Java', 'C++', 'TypeScript', 'React', 'GCP', 'Google Cloud'], weight: 7 },
    ],
    cultureFitKeywords: ['Googley', 'User First', 'Bias for Action', 'Scale', 'Data-driven', 'Innovation']
  },
  {
    id: 'jpmorgan',
    name: 'JP Morgan Chase & Co.',
    industry: 'Financial Services & Banking',
    description: 'Focuses on financial domain knowledge, high-frequency low-latency systems, security, Java, Spring Boot, and compliance.',
    scoringWeights: {
      keywordMatchWeight: 40,
      experienceWeight: 25,
      educationWeight: 15,
      skillsWeight: 10,
      formattingWeight: 10,
    },
    atsKeywords: [
      { category: 'Backend & Finance Tech', keywords: ['Java', 'Spring Boot', 'Kafka', 'SQL', 'Oracle', 'Microservices', 'REST API', 'Multithreading'], weight: 10 },
      { category: 'Finance & Compliance', keywords: ['Risk Management', 'Compliance', 'Fintech', 'Payment Gateway', 'Low Latency', 'Trading Systems'], weight: 9 },
      { category: 'DevOps & Security', keywords: ['CI/CD', 'Jenkins', 'Docker', 'OAuth2', 'Cybersecurity', 'AWS', 'TDD'], weight: 8 }
    ],
    cultureFitKeywords: ['Integrity', 'Client First', 'Operational Excellence', 'Risk Management', 'Agile']
  },
  {
    id: 'deloitte',
    name: 'Deloitte',
    industry: 'Consulting & Professional Services',
    description: 'Emphasizes client consulting, digital transformation, project management, AWS/Azure cloud migrations, and stakeholder management.',
    scoringWeights: {
      keywordMatchWeight: 30,
      experienceWeight: 30,
      educationWeight: 15,
      skillsWeight: 15,
      formattingWeight: 10,
    },
    atsKeywords: [
      { category: 'Consulting & Strategy', keywords: ['Digital Transformation', 'Client Delivery', 'Stakeholder Management', 'Business Analysis', 'Requirements Gathering', 'Agile Scrum'], weight: 10 },
      { category: 'Cloud & Tech Solutions', keywords: ['AWS', 'Azure', 'Salesforce', 'SAP', 'Data Analytics', 'PowerBI', 'Tableau', 'Python'], weight: 9 },
      { category: 'Project Leadership', keywords: ['Scrum Master', 'PMP', 'Risk Mitigation', 'Change Management', 'Budgeting', 'KPIs'], weight: 8 }
    ],
    cultureFitKeywords: ['Collaborative', 'Client Value', 'Inclusive', 'Strategic Thinking', 'Agility']
  },
  {
    id: 'amazon',
    name: 'Amazon',
    industry: 'E-commerce & Cloud Services (AWS)',
    description: 'Heavy focus on Amazon Leadership Principles (Customer Obsession, Ownership, Deliver Results) and AWS technologies.',
    scoringWeights: {
      keywordMatchWeight: 35,
      experienceWeight: 30,
      educationWeight: 5,
      skillsWeight: 20,
      formattingWeight: 10,
    },
    atsKeywords: [
      { category: 'AWS Cloud', keywords: ['AWS', 'Lambda', 'DynamoDB', 'S3', 'EC2', 'CloudFormation', 'Serverless', 'ECS', 'SQS'], weight: 10 },
      { category: 'Engineering Leadership', keywords: ['Customer Obsession', 'Ownership', 'Bias for Action', 'Deliver Results', 'Frugality', 'Deep Dive'], weight: 10 },
      { category: 'Software Development', keywords: ['Java', 'Python', 'System Design', 'CI/CD', 'Automated Testing', 'NoSQL', 'Distributed Systems'], weight: 9 }
    ],
    cultureFitKeywords: ['Customer Obsession', 'Ownership', 'Invent and Simplify', 'Are Right A Lot', 'Deliver Results']
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    industry: 'Technology & Enterprise Software',
    description: 'Values C#, .NET Core, Azure, TypeScript, React, open source contribution, and empowering users.',
    scoringWeights: {
      keywordMatchWeight: 35,
      experienceWeight: 25,
      educationWeight: 15,
      skillsWeight: 15,
      formattingWeight: 10,
    },
    atsKeywords: [
      { category: 'Microsoft Ecosystem', keywords: ['C#', '.NET', '.NET Core', 'Azure', 'TypeScript', 'React', 'Office 365', 'Visual Studio'], weight: 10 },
      { category: 'Engineering Practices', keywords: ['Clean Code', 'Design Patterns', 'Unit Testing', 'CI/CD', 'Azure DevOps', 'Security'], weight: 8 }
    ],
    cultureFitKeywords: ['Growth Mindset', 'Customer Orientation', 'Diverse & Inclusive', 'One Microsoft']
  }
];
