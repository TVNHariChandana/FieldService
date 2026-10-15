INSERT  IGNORE INTO user_auth
(username, email, phone, password, role)
VALUES
    ('manager1', 'manager@fieldservice.com', '9876543210',
     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
     'MANAGER'),

    ('dispatcher1', 'dispatcher@fieldservice.com', '9876543211',
     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
     'DISPATCHER'),

    ('technician1', 'technician@fieldservice.com', '9876543212',
     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
     'TECHNICIAN'),

    ('customer1', 'customer@fieldservice.com', '9876543213',
     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
     'CUSTOMER');