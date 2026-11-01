# FieldService – Field Service Management System

## Project Overview

FieldService is a web-based Field Service Management System developed to manage work orders, technicians, customers, parts inventory, and service operations efficiently.

The system helps managers and dispatchers assign work orders, technicians manage assigned tasks, and customers confirm completed services.

## Technologies Used

**Backend**
- Java
- Spring Boot
- Spring Security
- Spring Data JPA
- REST APIs
- Maven

**Frontend**
- React
- JavaScript
- HTML
- CSS

**Database**
- MySQL

**Development Tools**
- IntelliJ IDEA
- Visual Studio Code
- Postman
- Git and GitHub

## Main Features

- User registration and login
- Role-based access control
- Work order creation and management
- Technician assignment
- Work order status tracking
- Work order history
- Customer management
- Parts and inventory management
- Technician time logging
- SLA tracking
- Dashboard and work order statistics

## User Roles

1. **Manager:** Manages work orders and oversees service operations.
2. **Dispatcher:** Assigns work orders to technicians.
3. **Technician:** Views assigned work orders and updates their progress.
4. **Customer:** Views service progress and confirms completed work.

## Project Structure

```text
FieldService/
├── src/
│   └── main/
│       ├── java/
│       └── resources/
├── frontend/
├── .mvn/
├── Dockerfile
├── mvnw
├── mvnw.cmd
└── README.md
```

## Installation and Setup

### Backend Setup

1. Clone the repository.
2. Open the project in IntelliJ IDEA.
3. Configure MySQL database credentials in `application.properties`.
4. Create the required MySQL database.
5. Run the Spring Boot application.

### Frontend Setup

1. Open the frontend folder in VS Code.
2. Install dependencies using:

```bash
npm install
```

3. Start the frontend using the appropriate development command configured in `package.json`.

## API Testing

Postman is used to test REST APIs, including authentication, work orders, technician assignments, inventory, and dashboard operations.

## GitHub Repository

https://github.com/TVNHariChandana/FieldService

## Conclusion

FieldService provides an integrated solution for managing field service operations through a role-based web application, REST APIs, and a MySQL database.