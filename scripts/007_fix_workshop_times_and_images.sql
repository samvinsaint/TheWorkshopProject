-- Fix workshop times and add images

-- Full-Stack Web Development Workshop - 50 seats at 8 AM
UPDATE workshops 
SET 
  start_time = (CURRENT_DATE + INTERVAL '7 days' + TIME '08:00:00'),
  image_url = '/placeholder.svg?height=200&width=400'
WHERE title = 'Full-Stack Web Development Workshop';

-- High-Performance System Design - 30 seats at 10 AM  
UPDATE workshops 
SET 
  start_time = (CURRENT_DATE + INTERVAL '14 days' + TIME '10:00:00'),
  image_url = '/placeholder.svg?height=200&width=400'
WHERE title = 'High-Performance System Design';

-- AI and Machine Learning Fundamentals - 40 seats at 12 PM
UPDATE workshops 
SET 
  start_time = (CURRENT_DATE + INTERVAL '21 days' + TIME '12:00:00'),
  image_url = '/placeholder.svg?height=200&width=400'
WHERE title = 'AI and Machine Learning Fundamentals';

-- Cloud Architecture with AWS - 25 seats at 2 PM
UPDATE workshops 
SET 
  start_time = (CURRENT_DATE + INTERVAL '30 days' + TIME '14:00:00'),
  image_url = '/placeholder.svg?height=200&width=400'
WHERE title = 'Cloud Architecture with AWS';

-- DevOps Best Practices - 35 seats at 4 PM
UPDATE workshops 
SET 
  start_time = (CURRENT_DATE + INTERVAL '45 days' + TIME '16:00:00'),
  image_url = '/placeholder.svg?height=200&width=400'
WHERE title = 'DevOps Best Practices';
