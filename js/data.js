/* ==========================================================================
   PORTFOLIO DATA STORE — MANPREET CHAUDHARY
   Research Intern @ IIT Roorkee, Dept. of CSE | Systems & Full-Stack Developer
   ========================================================================== */

export const PORTFOLIO_DATA = {
  profile: {
    name: "Manpreet Chaudhary",
    shortName: "Manpreet",
    heroHeadline: "Engineering Autonomy & Resilient Systems",
    role: "Research Intern @ IIT Roorkee, Dept. of CSE | Systems & Full-Stack Developer",
    mentor: "Dr. Neetesh Kumar (Associate Professor, Dept. of CSE, IIT Roorkee)",
    institution: "Indian Institute of Technology Roorkee (IIT Roorkee)",
    department: "Department of Computer Science & Engineering",
    startDate: "July 6, 2026",
    status: "Ongoing",
    tagline: "Contributing to the Autonomous Drone Development research project under Dr. Neetesh Kumar at IIT Roorkee (Dept. of CSE). Engineering resilient distributed platforms, edge systems, and intelligent software architectures.",
    bioShort: "Research Intern at IIT Roorkee contributing to the Autonomous Drone Development project under Dr. Neetesh Kumar, and engineering high-impact full-stack digital platforms.",
    bioFull: [
      "I am a systems and full-stack developer based at the Indian Institute of Technology Roorkee (IIT Roorkee), working at the intersection of aerial robotics autonomy, computer vision, and resilient distributed platforms.",
      "Under the supervision of Dr. Neetesh Kumar (Associate Professor, Department of Computer Science & Engineering), I contribute to the Autonomous Drone Development research project, engineering autonomous flight pipelines, spatial localization modules, and real-time telemetry streaming.",
      "Beyond robotics, I architect production-grade web platforms — from international symposium portals with automated payment pipelines and AI-driven validation, to high-performance faculty research hubs and financial quantitative modeling."
    ],
    stats: [
      { label: "Research Institution", value: "IIT Roorkee", highlight: true },
      { label: "Faculty Advisor", value: "Dr. Neetesh Kumar", highlight: false },
      { label: "Core Research Initiative", value: "Autonomous Drone Development", highlight: true },
      { label: "Edge Platform Latency", value: "< 24ms", highlight: false }
    ],
    location: "Roorkee, Uttarakhand, India",
    socials: {
      linkedin: "https://www.linkedin.com/in/manpreet-chaudhary-238244279/",
      github: "https://github.com",
      email: "manpreet.chaudhary@cse.iitr.ac.in",
      phone: "+91 93685 03531"
    }
  },

  droneResearchDetails: {
    title: "Autonomous Drone Development",
    subtitle: "Aerial Robotics Research under Dr. Neetesh Kumar (Dept. of CSE, IIT Roorkee)",
    advisor: "Dr. Neetesh Kumar, Associate Professor (Dept. of CSE, IIT Roorkee)",
    hardware: "Companion Computer + Flight Controller (PX4) + Intel RealSense D455",
    pipelineStages: [
      {
        step: "01",
        name: "Visual Fiducial & Marker Tracking",
        tech: "ArUco Markers & OpenCV",
        desc: "Precision pose estimation and orientation calculation relative to structured landing pads and waypoints without satellite signals."
      },
      {
        step: "02",
        name: "Mono-Camera Triangulation",
        tech: "Epipolar Geometry & Feature Matching",
        desc: "Calculating 3D Euclidean coordinates from continuous monocular video frames using trigonometric parallax and camera calibration matrices."
      },
      {
        step: "03",
        name: "Deep Keypoint Localization",
        tech: "YOLOPoint Neural Network",
        desc: "Real-time edge inference generating dense, illumination-invariant visual keypoints for continuous visual odometry across dynamic environments."
      },
      {
        step: "04",
        name: "Active Depth Sensor Fusion",
        tech: "Intel RealSense D455",
        desc: "Extended sensor suite with active infrared stereo depth cameras, providing metric depth maps up to 6 meters for obstacle avoidance."
      }
    ]
  },

  projects: [
    {
      id: "workshop-secure-6g",
      title: "AI for Secure 6G Workshop Platform",
      category: "Full-Stack & Fintech Architecture",
      featured: true,
      tagline: "Official symposium portal with Razorpay payments, Google Drive/Sheets sync, OTP verification & AI ID card check.",
      description: "Architected and delivered the complete production platform for the 'AI for Secure 6G' workshop at IIT Roorkee, welcoming international researchers and delegates.",
      fullDescription: "An end-to-end full-stack registration and delegate management infrastructure. Integrated Razorpay payment gateway with automated webhooks, real-time Google Sheets & Google Drive asset sync for delegate submissions, phone and email OTP verification, and an AI-based ID card validation module to verify student and academic credentials on the fly.",
      techStack: ["Next.js", "TypeScript", "Node.js", "Razorpay Webhooks", "Google Sheets API", "AI ID Validation", "Tailwind CSS"],
      metrics: [
        { label: "Payment Pipeline", value: "Razorpay Webhooks" },
        { label: "Verification", value: "OTP + AI ID Check" },
        { label: "Cloud Sync", value: "Google Drive API" }
      ],
      liveUrl: "https://workshop-website-git-main-solitude1.vercel.app/index.html",
      githubUrl: "https://github.com",
      highlights: [
        "Automated registration pipeline handling high-volume conference traffic",
        "Dual-factor OTP verification preventing spam and duplicate enrollments",
        "AI-driven visual verification of institutional ID cards",
        "Instant reconciliation of registration fees via Razorpay webhooks"
      ],
      gradient: "linear-gradient(135deg, rgba(37, 99, 235, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%)",
      accentColor: "#2563eb"
    },
    {
      id: "dr-neetesh-kumar-portfolio",
      title: "Dr. Neetesh Kumar's Official Faculty Portal",
      category: "Academic Research Platform",
      featured: true,
      tagline: "Official faculty portfolio & doctoral research hub with interactive prototype slideshow.",
      description: "Designed and engineered the official academic portfolio and research laboratory portal for Dr. Neetesh Kumar (Associate Professor, Dept. of CSE, IIT Roorkee).",
      fullDescription: "A comprehensive faculty portal cataloging ongoing research in Autonomous Vehicle Systems, Intelligent Transportation Systems (ITS), Post-Quantum Cryptography, and Cloud Computing. Features a bespoke design system, structured publication archives, doctoral scholar registries, funded research grant tracking, and an interactive prototype slideshow showcase.",
      techStack: ["Next.js", "TypeScript", "Interactive Slideshow", "Tailwind CSS", "Systems Design"],
      metrics: [
        { label: "Institution", value: "IIT Roorkee CSE" },
        { label: "Lab Focus", value: "Autonomous Systems & ITS" },
        { label: "Performance", value: "100/100 Lighthouse" }
      ],
      liveUrl: "https://neeteshkumar.vercel.app/team.html",
      githubUrl: "https://github.com",
      highlights: [
        "Custom design system optimized for high academic legibility and speed",
        "Interactive prototype slideshow showcasing laboratory vehicles and sensors",
        "Structured publication archives indexed by IEEE and ACM formats",
        "Zero-cold-start edge distribution with sub-24ms global response time"
      ],
      gradient: "linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(99, 102, 241, 0.15) 100%)",
      accentColor: "#3b82f6"
    },
    {
      id: "autonomous-drone-development",
      title: "Autonomous Drone Development",
      category: "Robotics & Autonomous Systems",
      featured: true,
      tagline: "Autonomous aerial robotics research initiative under Dr. Neetesh Kumar at IIT Roorkee.",
      description: "Core autonomous aerial robotics research under Dr. Neetesh Kumar, engineering autonomous flight pipelines, spatial localization modules, and sensor telemetry streaming.",
      fullDescription: "A multi-stage spatial localization and navigation architecture designed for unmanned aerial vehicles. Integrates mono-camera trigonometric triangulation with ArUco fiducials, real-time edge inference via YOLOPoint keypoint detectors, and dense 3D point-cloud depth estimation using an Intel RealSense D455 companion sensor for closed-loop flight control.",
      techStack: ["C++", "Python", "ROS2", "YOLOPoint", "ArUco Markers", "Intel RealSense D455", "OpenCV", "Telemetry"],
      metrics: [
        { label: "Research Lab", value: "IIT Roorkee (CSE)" },
        { label: "Vision Suite", value: "YOLOPoint + D455" },
        { label: "Control Loop", value: "< 24ms Real-Time" }
      ],
      liveUrl: "drone-research.html",
      githubUrl: "https://github.com",
      highlights: [
        "Monocular triangulation algorithm for real-time visual distance estimation",
        "YOLOPoint neural keypoint extractor tuned for low-latency embedded inference",
        "Integration of Intel RealSense D455 stereo depth sensor for 3D spatial mapping",
        "High-reliability telemetry pipeline broadcasting flight state to ground control"
      ],
      gradient: "linear-gradient(135deg, rgba(74, 124, 89, 0.2) 0%, rgba(37, 99, 235, 0.1) 100%)",
      accentColor: "#4a7c59"
    },
    {
      id: "stock-market-prediction",
      title: "Stock Market Quantitative Prediction Model",
      category: "Machine Learning & Quantitative Analytics",
      featured: true,
      tagline: "Exploratory data analysis & predictive forecasting pipeline in Python and scikit-learn.",
      description: "End-to-end financial predictive modeling and statistical analytics pipeline built in Python for time-series equity forecasting and volatility modeling.",
      fullDescription: "A quantitative finance machine learning pipeline. Utilizes pandas and NumPy for comprehensive exploratory data analysis (EDA), cleaning historical ticker feeds, and synthesizing technical indicators (Simple/Exponential Moving Averages, RSI, MACD, Bollinger Bands). Deploys scikit-learn regression models, Random Forests, and Gradient Boosting algorithms for directional price forecasting.",
      techStack: ["Python", "scikit-learn", "pandas", "NumPy", "Matplotlib", "Seaborn", "Time-Series"],
      metrics: [
        { label: "Modeling", value: "scikit-learn Ensembles" },
        { label: "Data Pipeline", value: "pandas & NumPy EDA" },
        { label: "Domain", value: "Quantitative Finance" }
      ],
      liveUrl: "https://github.com",
      githubUrl: "https://github.com",
      highlights: [
        "Rigorous exploratory data analysis with correlation heatmaps and trend plots",
        "Feature engineering including moving average convergence and volatility bands",
        "Comparative benchmark evaluation across Linear Regression, RF, and GBDT",
        "Modular Python architecture with reproducible Jupyter notebook pipelines"
      ],
      gradient: "linear-gradient(135deg, rgba(201, 138, 99, 0.25) 0%, rgba(245, 158, 11, 0.15) 100%)",
      accentColor: "#c98a63"
    },
    {
      id: "interactive-wide-portfolio",
      title: "Wide-Format Reactive Portfolio Architecture",
      category: "Interactive Systems & UI Engineering",
      featured: true,
      tagline: "Full-stack portfolio engine featuring cursor spotlight reveal, 120fps 3D gyroscope, and directional scroll motion.",
      description: "The platform you are viewing right now — engineered from first principles with wide-format layout breathing room, cursor flashlight mechanics, and pure CSS 3D interactivity.",
      fullDescription: "An expansive personal digital identity platform designed to scale gracefully from mobile devices to ultrawide 1440p+ desktop displays. Features a real-time cursor-following spotlight reveal mechanic, a 120 FPS GPU-accelerated 3D gyroscope centerpiece with cursor parallax tilt and interactive nodes, and a multi-directional scroll observer.",
      techStack: ["Vanilla JS (ES Modules)", "CSS 3D Engine", "IntersectionObserver", "Canvas Particles", "Node.js Server"],
      metrics: [
        { label: "Animation Engine", value: "120 FPS GPU Composite" },
        { label: "Mechanic", value: "Cursor Spotlight Aura" },
        { label: "Screen Support", value: "Mobile to Ultrawide" }
      ],
      liveUrl: "http://localhost:3001",
      githubUrl: "https://github.com",
      highlights: [
        "Zero-framework vanilla architecture achieving lightning-fast initial load",
        "Dynamic 3D gyroscope tilting in real-time with mouse cursor parallax",
        "Interactive cursor-spotlight reveal mechanic with mobile scroll fallback",
        "Multi-directional choreographed scroll reveals with spring easing"
      ],
      gradient: "linear-gradient(135deg, rgba(37, 99, 235, 0.25) 0%, rgba(16, 185, 129, 0.15) 100%)",
      accentColor: "#2563eb"
    }
  ],

  experience: [
    {
      id: "iit-roorkee-internship",
      role: "Research Intern",
      organization: "Indian Institute of Technology Roorkee (IIT Roorkee)",
      mentor: "Dr. Neetesh Kumar, Associate Professor, Dept. of Computer Science & Engineering",
      location: "Roorkee, Uttarakhand, India",
      period: "July 6, 2026 — Present (Ongoing)",
      status: "Active",
      summary: "Formulating software autonomy pipelines for GPS-denied drone navigation and engineering digital research platforms.",
      bullets: [
        "Formulating and developing autonomous flight and navigation software modules for unmanned aerial vehicles (UAVs) under Dr. Neetesh Kumar.",
        "Engineering GPS-denied localization pipelines using mono-camera triangulation, ArUco fiducials, YOLOPoint keypoints, and Intel RealSense D455 depth cameras.",
        "Streaming real-time telemetry, sensor state estimation, and spatial logs between drone companion computers and ground stations.",
        "Architecting academic platform infrastructures supporting international department symposiums and faculty research dissemination."
      ],
      skills: ["Autonomous UAVs", "IIT Roorkee", "C++", "Python", "ROS2", "YOLOPoint", "Intel RealSense D455", "Systems Architecture"]
    },
    {
      id: "platform-engineer-symposia",
      role: "Lead Platform & Infrastructure Developer",
      organization: "Academic Workshops & Symposia Platforms",
      location: "IIT Roorkee / Remote",
      period: "2024 — Present",
      status: "Active",
      summary: "Engineered scalable digital infrastructure for large-scale technical workshops and international academic meetings.",
      bullets: [
        "Architected the official IIT Roorkee 'AI for Secure 6G' workshop website with Razorpay payment webhooks and automated verification.",
        "Engineered Dr. Neetesh Kumar's official faculty research hub with interactive prototype showcases and publication indexing.",
        "Leveraged Next.js and Vercel edge networks to achieve sub-24ms international response times and zero cold-start latency.",
        "Instituted GPU-accelerated responsive design patterns delivering fluid aesthetics without layout thrashing."
      ],
      skills: ["Next.js", "TypeScript", "Razorpay API", "Google Drive API", "Tailwind CSS", "Vercel Edge"]
    }
  ],

  certifications: [
    {
      id: "cert-oracle-ai",
      title: "Oracle Cloud Infrastructure 2024 AI Foundations Associate",
      issuer: "Oracle University",
      date: "2024 — 2025 • Verified Credential",
      credentialUrl: "https://www.linkedin.com/in/manpreet-chaudhary-238244279/",
      desc: "Foundational AI/ML architectures, large language models, computer vision primitives, and automated ML pipelines on OCI.",
      skills: ["Artificial Intelligence", "Machine Learning", "Oracle Cloud", "AI Foundations"],
      icon: "cpu"
    },
    {
      id: "cert-deloitte-cyber",
      title: "Cybersecurity Job Simulation Credential",
      issuer: "Deloitte (Forage)",
      date: "2024 • Verified Credential",
      credentialUrl: "https://www.linkedin.com/in/manpreet-chaudhary-238244279/",
      desc: "Real-world incident response, cyber threat intelligence, packet analysis, malware classification, and remediation strategy.",
      skills: ["Threat Analysis", "Incident Response", "Network Security", "TCP/IP"],
      icon: "shield"
    },
    {
      id: "cert-fullstack-bootcamp",
      title: "Full-Stack Web Development Bootcamp",
      issuer: "Industry Accredited Program",
      date: "2024 — 2025 • Verified Credential",
      credentialUrl: "https://www.linkedin.com/in/manpreet-chaudhary-238244279/",
      desc: "Comprehensive full-stack engineering: React/Next.js, Node.js, Express, REST APIs, asynchronous database transactions, and cloud deployment.",
      skills: ["HTML5/CSS3", "JavaScript/TypeScript", "Node.js", "REST APIs"],
      icon: "server"
    },
    {
      id: "cert-autonomous-systems",
      title: "Autonomous Systems & Robotics Engineering",
      issuer: "Advanced Robotics & UAV Autonomy",
      date: "2025 — 2026 • Verified Credential",
      credentialUrl: "https://www.linkedin.com/in/manpreet-chaudhary-238244279/",
      desc: "Advanced foundations in state estimation, path planning heuristics, ROS2 message architectures, and closed-loop robotic control.",
      skills: ["Autonomous UAVs", "ROS2", "Computer Vision", "Telemetry"],
      icon: "drone"
    }
  ],

  skillsCategories: [
    {
      id: "python-robotics",
      domain: "Python & Autonomous Robotics",
      icon: "drone",
      desc: "Core autonomy, vision algorithms, and flight telemetry for unmanned aerial systems.",
      skills: [
        "Python (Scientific & Systems)",
        "Autonomous UAV Control",
        "ROS / ROS2 Architecture",
        "YOLOPoint Keypoint Detection",
        "ArUco Fiducial Triangulation",
        "Intel RealSense D455 Vision",
        "OpenCV & Point Clouds",
        "Telemetry Streaming Pipelines"
      ]
    },
    {
      id: "networking-systems",
      domain: "TCP/IP & Systems Fundamentals",
      icon: "network",
      desc: "Low-level networking, communication protocols, edge execution, and OS internals.",
      skills: [
        "TCP/IP & Networking Protocols",
        "Socket Programming",
        "Linux CLI & Shell Scripting",
        "Edge Compute & Caching",
        "Serial UART / I2C Protocols",
        "Embedded Companion Computers",
        "Data Structures & Algorithms",
        "Systems Latency Profiling"
      ]
    },
    {
      id: "fullstack-engineering",
      domain: "Full-Stack Web Architecture",
      icon: "layout",
      desc: "End-to-end production web applications, edge runtimes, and fintech integrations.",
      skills: [
        "Next.js (App Router)",
        "TypeScript",
        "Node.js & Express",
        "Razorpay Payment Webhooks",
        "Google Sheets & Drive APIs",
        "Tailwind CSS & Design Systems",
        "GPU-Accelerated CSS 3D",
        "High-Performance Web UI"
      ]
    },
    {
      id: "cybersecurity-threat",
      domain: "Cybersecurity & Threat Analysis",
      icon: "shield",
      desc: "Threat intelligence, packet inspection, incident response, and security posture.",
      skills: [
        "Cyber Threat Analysis",
        "Malware Behavior Inspection",
        "Incident Response Playbooks",
        "Packet Analysis & Wireshark",
        "Vulnerability Assessment",
        "Auth & OTP Verification",
        "OWASP Security Guidelines",
        "Secure Systems Design"
      ]
    }
  ]
};
