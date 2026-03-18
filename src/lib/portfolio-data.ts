export const personalInfo = {
  name: "Swastik Bhardwaj",
  title: "Full Stack Developer",
  tagline: "Full Stack Developer building structured digital systems.",
  taglines: ["Full-Stack Developer", "MERN Stack", "Spring Boot", "Problem Solver"],
  bio: "I build production-ready web applications with clean architecture and intentional design. I care about performance, scalability, and writing code that other engineers actually enjoy reading. Currently pursuing B.Tech in Computer Science (6th Semester) at Silicon University with a CGPA of 9.31.",
  philosophy: "I believe great software is the result of clear thinking, not clever tricks. I write systems that are easy to understand, easy to extend, and hard to break.",
  github: "https://github.com/swastik7781",
  linkedin: "https://www.linkedin.com/in/swastik-bhardwaj-02963937a/",
  email: "swastikbhardwaj457@gmail.com",
  resumeUrl: "/resume.pdf",
  profilePic: "/profile.jpg",
  location: "Bhubaneswar, India",
};

export const stats = [
  { label: "CGPA", value: "9.31" },
  { label: "Lines of Code", value: "40K+" },
  { label: "Projects Built", value: "6+" },
  { label: "Learning Spirit", value: "∞" },
];

export const achievements = [
  "Maintained 9.31 CGPA throughout B.Tech in Computer Science at Silicon University",
  "Built and deployed a full Campus ERP system as major academic project",
  "Completed MERN Stack internship at CodeBeat with production deployments",
  "Scored 90% in Joy of Computing with Python (NPTEL Certification)",
];

export const skillCategories = [
  {
    name: "Frontend",
    skills: [
      { name: "React", proficiency: 90, icon: "react" },
      { name: "Angular", proficiency: 75, icon: "angular" },
      { name: "HTML5", proficiency: 95, icon: "html5" },
      { name: "CSS3", proficiency: 92, icon: "css3" },
      { name: "JavaScript", proficiency: 90, icon: "javascript" },
      { name: "TypeScript", proficiency: 80, icon: "typescript" },
    ],
  },
  {
    name: "Backend",
    skills: [
      { name: "Node.js", proficiency: 85, icon: "nodejs" },
      { name: "Express.js", proficiency: 85, icon: "express" },
      { name: "Spring Boot", proficiency: 70, icon: "spring" },
      { name: "REST APIs", proficiency: 90, icon: "api" },
    ],
  },
  {
    name: "Languages",
    skills: [
      { name: "C", proficiency: 80, icon: "c" },
      { name: "JavaScript", proficiency: 90, icon: "javascript" },
      { name: "Python", proficiency: 75, icon: "python" },
      { name: "Java", proficiency: 80, icon: "java" },
    ],
  },
  {
    name: "Database",
    skills: [
      { name: "MongoDB", proficiency: 85, icon: "mongodb" },
      { name: "PostgreSQL", proficiency: 75, icon: "postgresql" },
      { name: "MySQL", proficiency: 80, icon: "mysql" },
    ],
  },
  {
    name: "Tools",
    skills: [
      { name: "Git", proficiency: 90, icon: "git" },
      { name: "GitHub", proficiency: 90, icon: "github" },
      { name: "VS Code", proficiency: 95, icon: "vscode" },
      { name: "Postman", proficiency: 85, icon: "postman" },
      { name: "Eclipse IDE", proficiency: 80, icon: "eclipse" },
    ],
  },
];

export type ProjectCategory = "All" | "Full Stack" | "Machine Learning";

export const projects = [
  {
    title: "Portfolio Website",
    description: "This very portfolio — engineered with React, TypeScript, Framer Motion, and Tailwind CSS. Features a command palette, visitor personalization, custom cursor, easter eggs, and a production-grade contact system.",
    tech: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Vite"],
    category: "Full Stack" as ProjectCategory,
    github: "https://github.com/swastik7781/portfolio-professional.git",
    live: "https://swastikbhardwaj.vercel.app",
    featured: true,
  },
  {
    title: "Campus Management System (ERP)",
    description: "A comprehensive ERP solution for managing campus operations — student records, attendance, grades, and administrative workflows — with role-based access control and a clean dashboard interface.",
    tech: ["React", "Node.js", "Express.js", "MongoDB"],
    category: "Full Stack" as ProjectCategory,
    github: "https://github.com/Campus-Management-System/ERP-System.git",
    live: "#",
    featured: true,
  },
  {
    title: "CR Election System",
    description: "Full-stack voting platform with real-time result tracking, secure authentication, and a live vote-counting dashboard for class representative elections.",
    tech: ["HTML", "CSS", "Java Servlet (JSP)", "Apache Tomcat"],
    category: "Full Stack" as ProjectCategory,
    github: "https://github.com/swastik7781/cr_election.git",
    live: "https://cr-election-xsfa.vercel.app/",
    featured: true,
  },
  {
    title: "Employee Management System",
    description: "Enterprise-grade employee management with JWT authentication, full CRUD operations, role-based dashboards, and a clean RESTful API architecture.",
    tech: ["React", "Node.js", "Express.js", "MongoDB", "JWT"],
    category: "Full Stack" as ProjectCategory,
    github: "https://github.com/swastik7781/Employee-Management-System.git",
    live: "#",
    featured: false,
  },
  {
    title: "Library Management System",
    description: "Clean, functional library management interface for tracking books, members, and borrowing records — with search, filter, and overdue tracking capabilities.",
    tech: ["HTML", "CSS", "JavaScript"],
    category: "Full Stack" as ProjectCategory,
    github: "https://github.com/swastik7781/Library-Management-System.git",
    live: "https://silicon-library-management-system.vercel.app",
    featured: false,
  },
  {
    title: "Dynamic Retail Demand Forecasting",
    description: "Advanced machine learning pipeline using Random Forest and Decision Trees to predict retail sales and classify holiday impacts with 91% R² and 86% accuracy.",
    tech: ["Python", "NumPy", "Pandas", "Seaborn", "Matplotlib"],
    category: "Machine Learning" as ProjectCategory,
    github: "https://github.com/Dynamic-Retail-Demand-Forecasting-ML/Dynamic-Retail-Demand-Forecasting.git",
    live: "https://bigdaddyproject.vercel.app",
    featured: true,
  },
  {
    title: "NewsFlow - News WebApp",
    description: "A fully responsive and modern News Website Dashboard built using React, React Router, and Tailwind CSS. This application simulates a real-world news platform where users can explore different categories of news through a structured and visually appealing interface.",
    tech: ["React", "React Router", "Tailwind CSS"],
    category: "Full Stack" as ProjectCategory,
    github: "https://github.com/swastik7781/News-Web-App",
    live: "https://swastiknews.vercel.app/",
    featured: false,
  },
];

// Timeline items for About section — chronological order
export const timelineItems = [
  {
    type: "education",
    date: "2020-21",
    title: "10th from K.V. No.1 BBSR",
    subtitle: "AISSE — 96.00%",
    description: "Completed schooling at Kendriya Vidyalaya No.1 Bhubaneswar with 96% in AISSE (CBSE Board).",
  },
  {
    type: "education",
    date: "2022-23",
    title: "12th from K.V. No.1 BBSR",
    subtitle: "AISSCE — 91.00%",
    description: "Completed higher secondary at Kendriya Vidyalaya No.1 Bhubaneswar with 91% in AISSCE (CBSE Board).",
  },
  {
    type: "education",
    date: "2023 – Present",
    title: "B.Tech in Computer Science & Engineering",
    subtitle: "Silicon University · CGPA: 9.31 · 6th Semester",
    description: "Pursuing a rigorous CSE curriculum with a focus on data structures, algorithms, and software engineering. Currently in 6th semester (3rd year).",
  },
  {
    type: "work",
    date: "Jun – Jul 2024",
    title: "MERN Stack Developer Intern",
    subtitle: "CodeBeat",
    description: "Built production features, developed RESTful APIs, and implemented authentication systems on client projects using the MERN stack.",
  },
  {
    type: "work",
    date: "Jun – Jul 2025",
    title: "Spring Boot & Angular Training",
    subtitle: "Enterprise Development",
    description: "Intensive enterprise Java training — layered architecture, dependency injection, and reactive Angular frontends.",
  },
  {
    type: "project",
    date: "2025",
    title: "Major Project — Campus ERP",
    subtitle: "Academic (B.Tech CSE)",
    description: "Led full-stack development of a Campus Management ERP as the major academic project. Handled architecture design, database modeling, API development, and deployment.",
  },
  {
    type: "work",
    date: "Jan 13, 2026 – Apr 20, 2026",
    title: "AI Powered AR/VR aided Computer Vision Builder",
    subtitle: "IIT Delhi Program",
    description: "Enrolled in an advanced course focused on building AI-powered AR/VR applications with computer vision integration, exploring cutting-edge technologies in augmented and virtual environments.",
  },
];

export const experiences = [
  {
    role: "AI Powered AR/VR aided Computer Vision Builder",
    company: "IIT Delhi Program",
    date: "Jan 13, 2026 – Apr 20, 2026",
    description: "Enrolled in an advanced course focused on building AI-powered AR/VR applications with computer vision integration, exploring cutting-edge technologies in augmented and virtual environments.",
    tech: ["AI", "AR/VR", "Computer Vision"],
  },
  {
    role: "Major Project — Campus ERP",
    company: "Academic (B.Tech CSE)",
    date: "2025",
    description: "Led full-stack development of a Campus Management ERP as the major academic project. Handled architecture design, database modeling, API development, and deployment.",
    tech: ["React", "Node.js", "MongoDB", "Express.js"],
  },
  {
    role: "Spring Boot & Angular Training",
    company: "Enterprise Development",
    date: "Jun – Jul 2025",
    description: "Intensive enterprise Java development training with Spring Boot and Angular. Built full-stack enterprise applications with layered architecture, dependency injection, and reactive frontend patterns.",
    tech: ["Spring Boot", "Angular", "Java", "TypeScript"],
  },
  {
    role: "MERN Stack Developer Intern",
    company: "CodeBeat",
    date: "Jun – Jul 2024",
    description: "Built production features using the MERN stack. Developed RESTful APIs, implemented JWT authentication systems, and collaborated with senior developers on client-facing projects.",
    tech: ["MongoDB", "Express.js", "React", "Node.js"],
  },
];

export const testimonials = [
  {
    name: "Auroshikha Tripathy",
    role: "Ex-Senior Developer at Owision",
    company: "",
    quote: "Swastik has an incredible ability to break down complex problems into clean, elegant solutions. His dedication to writing maintainable code and his eye for design make him stand out as a developer.",
    rating: 5,
    photo: "/photos/auroshikha.png",
    portfolio: "https://auroshikhatripathyportfolio.vercel.app/",
  },
  {
    name: "T. Sribatsa Patro",
    role: "Ex Developer at Rumango pvt ltd",
    company: "",
    quote: "Swastik demonstrates exceptional problem-solving skills and a strong understanding of full-stack development. His ability to architect clean solutions and deliver production-ready code is impressive for his experience level.",
    rating: 5,
    photo: "/photos/sribatsa.png",
    portfolio: "https://sribatsa.vercel.app/",
  },
  {
    name: "Abhijeet Dash",
    role: "Intern at IIT Ropar",
    company: "",
    quote: "Working with Swastik was a great experience. He brings both technical depth and a collaborative mindset to every project. His code quality and attention to detail consistently exceeded expectations.",
    rating: 5,
    photo: "/photos/abhijeet.jpg",
    portfolio: "https://abhijeet-dash.vercel.app/",
  },
  {
    name: "Khushi Tiwari",
    role: "Developer at Penthara Technologies",
    company: "",
    quote: "Swastik is an extraordinarily talented developer. His focus on creating structured, scalable, and beautifully designed digital systems makes him a standout engineer. He constantly delivers above and beyond requirements.",
    rating: 5,
    photo: "/photos/khushi.jpeg",
  },
];

export const certifications = [
  {
    title: "MERN Stack Development",
    issuer: "CodeBeat",
    year: "2024",
    file: "/certificates/mern.pdf"
  },
  {
    title: "Spring Boot & Angular Training",
    issuer: "Enterprise Program",
    year: "2025",
    file: "/certificates/springboot.pdf"
  },
  {
    title: "Joy of Computing with Python",
    issuer: "NPTEL",
    year: "2024",
    score: "90%",
    file: "/certificates/nptel-python.pdf"
  },
];
