-- Insert sample workshops for testing high-concurrency registration
INSERT INTO workshops (title, description, total_quota, start_time, is_active) VALUES
(
  'Full-Stack Web Development Workshop',
  'Learn modern web development with Next.js, React, and TypeScript. Build production-ready applications with best practices.',
  50,
  NOW() + INTERVAL '7 days',
  true
),
(
  'High-Performance System Design',
  'Master the art of designing scalable systems. Learn about load balancing, caching, database optimization, and more.',
  30,
  NOW() + INTERVAL '14 days',
  true
),
(
  'AI and Machine Learning Fundamentals',
  'Introduction to AI and ML concepts. Hands-on exercises with popular frameworks and real-world applications.',
  40,
  NOW() + INTERVAL '21 days',
  true
),
(
  'Cloud Architecture with AWS',
  'Deep dive into cloud infrastructure. Learn to build, deploy, and manage applications on AWS cloud platform.',
  25,
  NOW() + INTERVAL '30 days',
  true
),
(
  'DevOps Best Practices',
  'Master CI/CD pipelines, containerization with Docker, orchestration with Kubernetes, and monitoring strategies.',
  35,
  NOW() + INTERVAL '45 days',
  true
);
