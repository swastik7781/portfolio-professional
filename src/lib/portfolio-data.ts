export const personalInfo = {
  name: "Swastik Bhardwaj",
  title: "Full-Stack Developer",
  taglines: ["Full-Stack Developer", "MERN Stack", "Spring Boot", "Problem Solver"],
  bio: "I'm a full-stack developer who builds production-ready web applications with clean architecture. I care about performance, scalability, and writing code that other engineers actually enjoy reading. Currently pursuing B.Tech in Computer Science with a 9.38 CGPA.",
  github: "https://github.com/swastikbhardwaj",
  linkedin: "https://linkedin.com/in/swastikbhardwaj",
  email: "swastikbhardwaj@example.com",
  resumeUrl: "#",
  profilePic: "/profile.jpg",
};

export const stats = [
  { label: "CGPA", value: "9.38" },
  { label: "Lines of Code", value: "40,000+" },
  { label: "Projects", value: "5+" },
  { label: "Internship", value: "CodeBest" },
];

export const skillCategories = [
  {
    name: "Frontend",
    skills: [
      { name: "React", proficiency: 90 },
      { name: "Angular", proficiency: 75 },
      { name: "HTML/CSS", proficiency: 95 },
      { name: "JavaScript", proficiency: 90 },
      { name: "TypeScript", proficiency: 80 },
    ],
  },
  {
    name: "Backend",
    skills: [
      { name: "Node.js", proficiency: 85 },
      { name: "Express.js", proficiency: 85 },
      { name: "Spring Boot", proficiency: 70 },
      { name: "REST APIs", proficiency: 90 },
    ],
  },
  {
    name: "Languages",
    skills: [
      { name: "C", proficiency: 80 },
      { name: "C++", proficiency: 85 },
      { name: "Python", proficiency: 75 },
      { name: "Java", proficiency: 80 },
    ],
  },
  {
    name: "Database",
    skills: [
      { name: "MongoDB", proficiency: 85 },
      { name: "PostgreSQL", proficiency: 75 },
      { name: "MySQL", proficiency: 80 },
    ],
  },
  {
    name: "Tools",
    skills: [
      { name: "Git", proficiency: 90 },
      { name: "GitHub", proficiency: 90 },
      { name: "VS Code", proficiency: 95 },
      { name: "Postman", proficiency: 85 },
    ],
  },
];

export type ProjectCategory = "All" | "Full Stack" | "Machine Learning";

export const projects = [
  {
    title: "Campus Management System (ERP)",
    description: "A comprehensive ERP solution for managing campus operations including student records, attendance, grades, and administrative tasks with role-based access control.",
    tech: ["React", "Node.js", "Express.js", "MongoDB"],
    category: "Full Stack" as ProjectCategory,
    github: "https://github.com/swastikbhardwaj",
    live: "#",
  },
  {
    title: "CR Election System",
    description: "Full-stack voting platform with real-time result tracking, secure authentication, and live vote counting dashboard for class representative elections.",
    tech: ["React", "Node.js", "Express.js", "MongoDB"],
    category: "Full Stack" as ProjectCategory,
    github: "https://github.com/swastikbhardwaj",
    live: "#",
  },
  {
    title: "Employee Management System",
    description: "Enterprise-grade employee management with JWT authentication, CRUD operations, role-based dashboards, and RESTful API architecture.",
    tech: ["React", "Node.js", "Express.js", "MongoDB", "JWT"],
    category: "Full Stack" as ProjectCategory,
    github: "https://github.com/swastikbhardwaj",
    live: "#",
  },
  {
    title: "Library Management System",
    description: "Clean and functional library management interface for tracking books, members, and borrowing records with search and filter capabilities.",
    tech: ["HTML", "CSS", "JavaScript"],
    category: "Full Stack" as ProjectCategory,
    github: "https://github.com/swastikbhardwaj",
    live: "#",
  },
  {
    title: "Dynamic Retail Demand Forecasting",
    description: "Machine learning pipeline using LSTM neural networks to predict retail demand patterns, helping businesses optimize inventory and reduce waste.",
    tech: ["Python", "TensorFlow", "LSTM", "Pandas"],
    category: "Machine Learning" as ProjectCategory,
    github: "https://github.com/swastikbhardwaj",
    live: "#",
  },
];

export const experiences = [
  {
    role: "Spring Boot & Angular Training",
    company: "Training Program",
    date: "June – July 2025",
    description: "Intensive training on enterprise Java development with Spring Boot framework and Angular frontend, building full-stack enterprise applications.",
    tech: ["Spring Boot", "Angular", "Java", "TypeScript"],
  },
  {
    role: "MERN Stack Developer Intern",
    company: "CodeBest",
    date: "June – July 2024",
    description: "Built production features using the MERN stack. Developed RESTful APIs, implemented authentication systems, and collaborated with senior developers on client projects.",
    tech: ["MongoDB", "Express.js", "React", "Node.js"],
  },
  {
    role: "Major Project Development",
    company: "Academic",
    date: "2025",
    description: "Led development of Campus Management System ERP as major project, handling full-stack architecture, database design, and deployment.",
    tech: ["React", "Node.js", "MongoDB", "Express.js"],
  },
];

export const testimonials = [
  {
    name: "T. Sribatsa Patro",
    role: "Mentor & Guide",
    company: "",
    quote: "Swastik demonstrates exceptional problem-solving skills and a strong understanding of full-stack development. His ability to architect clean solutions and deliver production-ready code is impressive for his experience level.",
    rating: 5,
  },
  {
    name: "Abhijeet Dash",
    role: "Colleague & Collaborator",
    company: "",
    quote: "Working with Swastik was a great experience. He brings both technical depth and a collaborative mindset to every project. His code quality and attention to detail consistently exceeded expectations.",
    rating: 5,
  },
];

export const certifications = [
  { title: "MERN Stack Development", issuer: "CodeBest", year: "2024" },
  { title: "Spring Boot & Angular Training", issuer: "Training Program", year: "2025" },
];
