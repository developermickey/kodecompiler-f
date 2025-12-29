// src/mockApi.js
export const fetchInterviews = async () => {
  // Simulate API delay (like a real API call)
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return your interview data
  return [
    {
      id: 1,
      company: 'Druva',
      role: 'Staff Software Engineer',
      location: 'Pune',
      difficulty: 'Easy',
      experienceLevel: '7 years experience',
      rounds: 'Coding Question, Technical Round - 1, Technical Round - 2',
      date: 'October 21',
      helpful: 8,
      status: 'Offer Received',
      views: 2847,
      author: 'Anonymous',
      questionsAsked: 'Details will be added soon...',
      overallExperience: 'Details will be added soon...'
    },
    {
      id: 2,
      company: 'Google',
      role: 'Software Engineer',
      location: 'Bangalore',
      difficulty: 'Hard',
      experienceLevel: '3-5 years',
      rounds: 'Coding Question, Technical Round - 1, Technical Round - 2, HR Round',
      date: 'December 10, 2024',
      helpful: 142,
      status: 'Selected',
      views: 2847,
      author: 'Anonymous',
      questionsAsked: 'Details will be added soon...',
      overallExperience: 'Details will be added soon...'
    },
    {
      id: 3,
      company: 'Microsoft',
      role: 'SDE II',
      location: 'Hyderabad',
      difficulty: 'Medium',
      experienceLevel: '2-4 years',
      rounds: 'Online Assessment, Technical Round - 1, Technical Round - 2, Managerial Round',
      date: 'December 8, 2024',
      helpful: 98,
      status: 'Selected',
      views: 1923,
      author: 'Anonymous',
      questionsAsked: 'Details will be added soon...',
      overallExperience: 'Details will be added soon...'
    },
    {
      id: 4,
      company: 'Amazon',
      role: 'Software Development Engineer',
      location: 'Pune',
      difficulty: 'Medium',
      experienceLevel: '1-3 years',
      rounds: 'Coding Round, Technical Round - 1, Technical Round - 2, Bar Raiser Round',
      date: 'December 5, 2024',
      helpful: 167,
      status: 'Offer Received',
      views: 3124,
      author: 'Anonymous',
      questionsAsked: 'Details will be added soon...',
      overallExperience: 'Details will be added soon...'
    },
    {
      id: 5,
      company: 'Meta',
      role: 'Frontend Engineer',
      location: 'Gurgaon',
      difficulty: 'Hard',
      experienceLevel: '4-6 years',
      rounds: 'Phone Screen, Coding Round, System Design, Behavioral Round',
      date: 'December 3, 2024',
      helpful: 203,
      status: 'Selected',
      views: 4156,
      author: 'Anonymous',
      questionsAsked: 'Details will be added soon...',
      overallExperience: 'Details will be added soon...'
    },
    {
      id: 6,
      company: 'Adobe',
      role: 'Software Engineer',
      location: 'Noida',
      difficulty: 'Hard',
      experienceLevel: '2-4 years',
      rounds: 'Online Test, Technical Round - 1, Technical Round - 2',
      date: 'November 25, 2024',
      helpful: 134,
      status: 'Offer Received',
      views: 2634,
      author: 'Anonymous',
      questionsAsked: 'Details will be added soon...',
      overallExperience: 'Details will be added soon...'
    }
  ];
};