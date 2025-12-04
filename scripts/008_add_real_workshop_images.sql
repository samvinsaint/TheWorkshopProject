-- Add real workshop images from uploaded files

-- Full-Stack Web Development Workshop
UPDATE workshops 
SET 
  image_url = '/images/full-stack-20web-20development-20workshop.png'
WHERE title = 'Full-Stack Web Development Workshop';

-- High-Performance System Design
UPDATE workshops 
SET 
  image_url = '/images/high-performance-20system-20design.png'
WHERE title = 'High-Performance System Design';

-- AI and Machine Learning Fundamentals
UPDATE workshops 
SET 
  image_url = '/images/ai-20and-20machine-20learning-20fundamentals.png'
WHERE title = 'AI and Machine Learning Fundamentals';

-- Cloud Architecture with AWS
UPDATE workshops 
SET 
  image_url = '/images/cloud-20architecture-20with-20aws.png'
WHERE title = 'Cloud Architecture with AWS';

-- DevOps Best Practices
UPDATE workshops 
SET 
  image_url = '/images/devops-20best-20practices.png'
WHERE title = 'DevOps Best Practices';
