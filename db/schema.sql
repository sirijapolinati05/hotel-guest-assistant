-- db/schema.sql

-- Drop existing tables to allow for easy resets
DROP TABLE IF EXISTS room_inventory;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS policies;
DROP TABLE IF EXISTS amenities;
DROP TABLE IF EXISTS hotels;

-- Create tables
CREATE TABLE hotels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    check_in_time TIME NOT NULL,
    check_out_time TIME NOT NULL
);

CREATE TABLE amenities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    max_guests INTEGER NOT NULL,
    beds VARCHAR(255) NOT NULL,
    price_per_night INTEGER NOT NULL -- Storing as integer (rupees)
);

CREATE TABLE room_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_count INTEGER NOT NULL,
    booked_count INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT unique_room_date UNIQUE (room_id, date)
);

-- Seed Data

INSERT INTO hotels (id, name, address, check_in_time, check_out_time)
VALUES (
    '11111111-1111-1111-1111-111111111111', 
    'Simplotel Grand Hotel', 
    '123 MG Road, Bangalore, Karnataka, India', 
    '14:00:00', 
    '11:00:00'
);

INSERT INTO amenities (hotel_id, name) VALUES
('11111111-1111-1111-1111-111111111111', 'Swimming Pool'),
('11111111-1111-1111-1111-111111111111', 'Gym'),
('11111111-1111-1111-1111-111111111111', 'Spa'),
('11111111-1111-1111-1111-111111111111', 'Free Wi-Fi'),
('11111111-1111-1111-1111-111111111111', 'Parking'),
('11111111-1111-1111-1111-111111111111', 'Restaurant');

INSERT INTO policies (hotel_id, category, description) VALUES
('11111111-1111-1111-1111-111111111111', 'Cancellation', 'Free cancellation up to 24 hours before check-in.'),
('11111111-1111-1111-1111-111111111111', 'Pets', 'Pets are not allowed.'),
('11111111-1111-1111-1111-111111111111', 'Smoking', 'Smoking is not permitted inside guest rooms.'),
('11111111-1111-1111-1111-111111111111', 'Breakfast', 'Breakfast is served from 7:00 AM to 10:30 AM and is included with eligible bookings.');

INSERT INTO rooms (id, hotel_id, name, max_guests, beds, price_per_night) VALUES
('22222222-2222-2222-2222-222222222221', '11111111-1111-1111-1111-111111111111', 'Deluxe Room', 2, 'King Bed', 5000),
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Executive Room', 3, 'King Bed + Sofa Bed', 7000),
('22222222-2222-2222-2222-222222222223', '11111111-1111-1111-1111-111111111111', 'Family Suite', 4, 'King Bed + 2 Single Beds', 8500);

-- Generate some inventory for the next 30 days starting from '2026-09-01' to '2026-10-31'
DO $$
DECLARE
    curr_date DATE := '2026-09-01';
    end_date DATE := '2026-10-31';
    r_id UUID;
BEGIN
    WHILE curr_date <= end_date LOOP
        -- Deluxe Rooms: 10 total
        INSERT INTO room_inventory (room_id, date, total_count, booked_count)
        VALUES ('22222222-2222-2222-2222-222222222221', curr_date, 10, floor(random() * 5));
        
        -- Executive Rooms: 5 total
        INSERT INTO room_inventory (room_id, date, total_count, booked_count)
        VALUES ('22222222-2222-2222-2222-222222222222', curr_date, 5, floor(random() * 3));
        
        -- Family Suites: 2 total
        INSERT INTO room_inventory (room_id, date, total_count, booked_count)
        VALUES ('22222222-2222-2222-2222-222222222223', curr_date, 2, floor(random() * 2));
        
        curr_date := curr_date + interval '1 day';
    END LOOP;
END $$;
