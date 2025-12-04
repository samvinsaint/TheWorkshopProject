-- Update workshops with actual themed images
UPDATE workshops 
SET image_url = '/placeholder.svg?height=200&width=400' 
WHERE title LIKE '%Web Development%';

UPDATE workshops 
SET image_url = '/placeholder.svg?height=200&width=400' 
WHERE title LIKE '%System Design%';

UPDATE workshops 
SET image_url = '/placeholder.svg?height=200&width=400' 
WHERE title LIKE '%Machine Learning%';

UPDATE workshops 
SET image_url = '/placeholder.svg?height=200&width=400' 
WHERE title LIKE '%AWS%';

UPDATE workshops 
SET image_url = '/placeholder.svg?height=200&width=400' 
WHERE title LIKE '%DevOps%';
