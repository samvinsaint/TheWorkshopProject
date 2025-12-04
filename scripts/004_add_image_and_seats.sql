-- Add image_url column to workshops table
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add seats column to registrations table to store selected seats
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS seats TEXT[] DEFAULT '{}';

-- Update existing workshops with placeholder images
UPDATE workshops SET image_url = '/placeholder.svg?height=200&width=400' WHERE title LIKE '%Web Development%';
UPDATE workshops SET image_url = '/placeholder.svg?height=200&width=400' WHERE title LIKE '%System Design%';
UPDATE workshops SET image_url = '/placeholder.svg?height=200&width=400' WHERE title LIKE '%Machine Learning%';
UPDATE workshops SET image_url = '/placeholder.svg?height=200&width=400' WHERE title LIKE '%AWS%';
UPDATE workshops SET image_url = '/placeholder.svg?height=200&width=400' WHERE title LIKE '%DevOps%';
