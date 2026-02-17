export const mockCourses = [
  {
    id: 1,
    image:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
    status: 'Draft',
    category: 'Compliance',
    title: 'Enterprise Security Awareness',
    description:
      'Essential security practices for all employees. Learn how to identify phishing attempts, secure your devices, and protect company data.',
    duration: '45mins',
    trainees: 24,
    deliveryMode: 'Online',
    isMandatory: true,
    categoryTag: 'compliance',
    modules: [
      {
        id: 'm1',
        type: 'video',
        title: 'Introduction to Information Security',
        description:
          'Overview of key concepts and why security matters to everyone.',
        duration: '12 mins',
        completed: true,
        showDownload: true,
      },
      {
        id: 'm2',
        type: 'video',
        title: 'Introduction to Information Security',
        description:
          'Overview of key concepts and why security matters to everyone.',
        duration: '12 mins',
        completed: true,
        showDownload: true,
      },
      {
        id: 'm3',
        type: 'video',
        title: 'Introduction to Information Security',
        description:
          'Overview of key concepts and why security matters to everyone.',
        duration: '12 mins',
        completed: true,
        showDownload: true,
      },
      {
        id: 'm4',
        type: 'pdf',
        title: 'Company Security Policy',
        description:
          'Read the official acceptable use policy for IT resources.',
        duration: '12 mins',
        completed: true,
        showDownload: true,
      },
    ],
  },
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    status: 'Active',
    category: 'Soft Skills',
    title: 'Leadership Fundamentals',
    description:
      'Build core leadership capabilities for effective team management and communication.',
    duration: '2 Days',
    trainees: 24,
    deliveryMode: 'Hybrid',
    isMandatory: false,
    categoryTag: 'compliance',
    modules: [],
  },
  {
    id: 3,
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    status: 'Active',
    category: 'Compliance',
    title: 'Workplace Safety 2025',
    description:
      'Mandatory workplace safety training and best practices for 2025.',
    duration: '45mins',
    trainees: 24,
    deliveryMode: 'In-Person',
    isMandatory: true,
    categoryTag: 'compliance',
    modules: [],
  },
  {
    id: 4,
    image:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
    status: 'Active',
    category: 'Compliance',
    title: 'Workplace Safety 2025',
    description:
      'Mandatory workplace safety training and best practices for 2025.',
    duration: '45mins',
    trainees: 24,
    deliveryMode: 'In-Person',
    isMandatory: true,
    categoryTag: 'compliance',
    modules: [],
  },
  {
    id: 5,
    image:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
    status: 'Draft',
    category: 'Compliance',
    title: 'Enterprise Security Awareness',
    description: 'Essential security practices for all employees.',
    duration: '45mins',
    trainees: 24,
    deliveryMode: 'Online',
    isMandatory: true,
    categoryTag: 'compliance',
    modules: [],
  },
  {
    id: 6,
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    status: 'Active',
    category: 'Soft Skills',
    title: 'Leadership Fundamentals',
    description:
      'Build core leadership capabilities for effective team management and communication.',
    duration: '2 Days',
    trainees: 24,
    deliveryMode: 'Hybrid',
    isMandatory: false,
    categoryTag: 'compliance',
    modules: [],
  },
  {
    id: 7,
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    status: 'Active',
    category: 'Soft Skills',
    title: 'Leadership Fundamentals',
    description:
      'Build core leadership capabilities for effective team management and communication.',
    duration: '2 Days',
    trainees: 24,
    deliveryMode: 'Hybrid',
    isMandatory: false,
    categoryTag: 'compliance',
    modules: [],
  },
  {
    id: 8,
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    status: 'Active',
    category: 'Soft Skills',
    title: 'Leadership Fundamentals',
    description:
      'Build core leadership capabilities for effective team management and communication.',
    duration: '2 Days',
    trainees: 24,
    deliveryMode: 'Hybrid',
    isMandatory: false,
    categoryTag: 'compliance',
    modules: [],
  },
];

export const courses = [
  {
    id: 1,
    title: 'Leadership Fundamentals',
    category: 'Compliance',
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    type: 'Mandatory',
    status: 'In Progress',
    progress: 45,
    dueDate: '14 days',
        completionDate: '',

  },
  {
    id: 2,
    title: 'Effective Communication',
    category: 'Soft Skills',
    image:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
    type: 'Mandatory',
    status: 'In Progress',
    progress: 45,
    dueDate: '14 days',
        completionDate: '',

  },
  {
    id: 3,
    title: 'Enterprise Security Awareness',
    category: 'Compliance',
    image:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
    type: 'Optional',
    status: 'Not Started',
    progress: 0,
    dueDate: '14 days',
        completionDate: '',

  },
  {
    id: 4,
    title: 'Time Management Mastery',
    category: 'Soft Skills',
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    type: 'Optional',
    status: 'Completed',
    progress: 100,
    dueDate: '',
    completionDate: '2 days ago',
  },
  {
    id: 5,
    title: 'Leadership Fundamentals',
    category: 'Compliance',
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    type: 'Mandatory',
    status: 'In Progress',
    progress: 45,
    dueDate: '14 days',
    completionDate: '',
  },
  {
    id: 6,
    title: 'Effective Communication',
    category: 'Soft Skills',
    image:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
    type: 'Mandatory',
    status: 'In Progress',
    progress: 80,
    dueDate: '14 days',
    completionDate: '',
  },
  {
    id: 7,
    title: 'Enterprise Security Awareness',
    category: 'Compliance',
    image:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
    type: 'Optional',
    status: 'Not Started',
    progress: 0,
    dueDate: '14 days',
    completionDate: '',
  },
  {
    id: 8,
    title: 'Time Management Mastery',
    category: 'Soft Skills',
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    type: 'Optional',
    status: 'Completed',
    progress: 100,
    dueDate: '',
    completionDate: '2 days ago',
  }
];

export const requestedCoursesData = [
  {
    id: 1,
    image:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
    status: 'Pending',
    category: 'Compliance',
    title: 'Enterprise Security Awareness',
    description:
      'Essential security practices for all employees. Learn how to identify phishing attempts, secure your devices, and protect company data.',
    duration: '45mins',
    trainees: 24,
    deliveryMode: 'Online',
    isMandatory: true,
    categoryTag: 'compliance',
    modules: [
      {
        id: 'm1',
        type: 'video',
        title: 'Introduction to Information Security',
        description:
          'Overview of key concepts and why security matters to everyone.',
        duration: '12 mins',
        completed: true,
        showDownload: true,
      },
      {
        id: 'm2',
        type: 'video',
        title: 'Introduction to Information Security',
        description:
          'Overview of key concepts and why security matters to everyone.',
        duration: '12 mins',
        completed: true,
        showDownload: true,
      },
      {
        id: 'm3',
        type: 'video',
        title: 'Introduction to Information Security',
        description:
          'Overview of key concepts and why security matters to everyone.',
        duration: '12 mins',
        completed: true,
        showDownload: true,
      },
      {
        id: 'm4',
        type: 'pdf',
        title: 'Company Security Policy',
        description:
          'Read the official acceptable use policy for IT resources.',
        duration: '12 mins',
        completed: true,
        showDownload: true,
      },
    ],
  },
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    status: 'Pending',
    category: 'Soft Skills',
    title: 'Leadership Fundamentals',
    description:
      'Build core leadership capabilities for effective team management and communication.',
    duration: '2 Days',
    trainees: 24,
    deliveryMode: 'Hybrid',
    isMandatory: false,
    categoryTag: 'compliance',
    modules: [],
  },
  {
    id: 3,
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    status: 'Approved',
    category: 'Compliance',
    title: 'Workplace Safety 2025',
    description:
      'Mandatory workplace safety training and best practices for 2025.',
    duration: '45mins',
    trainees: 24,
    deliveryMode: 'In-Person',
    isMandatory: true,
    categoryTag: 'compliance',
    modules: [],
  },
  {
    id: 4,
    image:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
    status: 'Rejected',
    category: 'Compliance',
    title: 'Workplace Safety 2025',
    description:
      'Mandatory workplace safety training and best practices for 2025.',
    duration: '45mins',
    trainees: 24,
    deliveryMode: 'In-Person',
    isMandatory: true,
    categoryTag: 'compliance',
    modules: [],
  },
  {
    id: 5,
    image:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
    status: 'Pending',
    category: 'Compliance',
    title: 'Enterprise Security Awareness',
    description: 'Essential security practices for all employees.',
    duration: '45mins',
    trainees: 24,
    deliveryMode: 'Online',
    isMandatory: true,
    categoryTag: 'compliance',
    modules: [],
  },
  {
    id: 6,
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    status: 'Approved',
    category: 'Soft Skills',
    title: 'Leadership Fundamentals',
    description:
      'Build core leadership capabilities for effective team management and communication.',
    duration: '2 Days',
    trainees: 24,
    deliveryMode: 'Hybrid',
    isMandatory: false,
    categoryTag: 'compliance',
    modules: [],
  },
  {
    id: 7,
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    status: 'Rejected',
    category: 'Soft Skills',
    title: 'Leadership Fundamentals',
    description:
      'Build core leadership capabilities for effective team management and communication.',
    duration: '2 Days',
    trainees: 24,
    deliveryMode: 'Hybrid',
    isMandatory: false,
    categoryTag: 'compliance',
    modules: [],
  },
  {
    id: 8,
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    status: 'Pending',
    category: 'Soft Skills',
    title: 'Leadership Fundamentals',
    description:
      'Build core leadership capabilities for effective team management and communication.',
    duration: '2 Days',
    trainees: 24,
    deliveryMode: 'Hybrid',
    isMandatory: false,
    categoryTag: 'compliance',
    modules: [],
  },
];