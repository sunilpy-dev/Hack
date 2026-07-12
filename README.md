# 🚀 AssetFlow - Enterprise Asset & Resource Management System

> A centralized Enterprise Asset & Resource Management System designed to streamline the management of organizational assets, shared resources, maintenance, audits, and employee operations.

---

# 📖 Overview

AssetFlow is a modern ERP-inspired web application that helps organizations efficiently manage their physical assets and shared resources from a single platform.

Instead of managing laptops, meeting rooms, projectors, maintenance requests, and audits through spreadsheets, emails, and paper records, AssetFlow digitizes the entire workflow.

The system provides secure role-based access, complete asset lifecycle tracking, booking management, maintenance workflows, audit management, and real-time dashboards.

---

# 🎯 Problem Statement

Organizations often struggle with:

- Tracking who currently owns an asset
- Double booking of meeting rooms
- Missing maintenance records
- Lack of audit history
- Poor visibility into asset utilization
- Manual approvals through emails and spreadsheets
- No centralized reporting

AssetFlow solves these challenges by providing a single source of truth for all organizational assets and shared resources.

---

# 💡 Solution

AssetFlow provides:

- Enterprise Asset Management
- Shared Resource Booking
- Employee Management
- Department Management
- Maintenance Management
- Asset Allocation Tracking
- Asset Transfer Workflow
- Audit Management
- Notification System
- Activity Logging
- Role-Based Access Control (RBAC)
- Reporting & Analytics

---

# 🏢 System Architecture

```
Frontend (React + Vite)
        │
        ▼
REST API
        │
        ▼
Node.js + Express Backend
        │
        ▼
PostgreSQL Database
```

---

# 👥 User Roles

The application uses Role-Based Access Control (RBAC).

## 👑 Admin

Responsible for managing the entire organization.

### Permissions

- Manage employees
- Manage departments
- Assign roles
- Configure system
- Manage assets
- Manage resources
- Create audits
- View reports
- View activity logs

---

## 🏢 Department Head

Responsible for managing one department.

### Permissions

- View department employees
- Approve department requests
- Monitor department assets
- View department reports

---

## 💻 Asset Manager

Responsible for all physical assets.

### Permissions

- Register assets
- Allocate assets
- Approve returns
- Manage transfers
- Retire assets
- Upload documents
- View allocation history

---

## 🏠 Resource Manager

Responsible for shared resources.

### Permissions

- Create resource types
- Manage meeting rooms
- Manage vehicles
- Manage laboratories
- Approve bookings
- Configure resource availability

---

## 🔧 Maintenance Technician

Responsible for repairing assets.

### Permissions

- Accept assigned jobs
- Update repair status
- Upload repair reports
- Close maintenance requests

---

## 📝 Auditor

Responsible for organizational audits.

### Permissions

- Verify assets
- Record discrepancies
- Generate audit reports

---

## 👤 Employee

Standard organization user.

### Permissions

- View allocated assets
- Book resources
- Raise maintenance requests
- Request asset returns
- Request asset transfers
- View notifications

---

# 🔄 User Lifecycle

Unlike public applications, AssetFlow is an internal enterprise platform.

Employees cannot create their own accounts.

The flow is:

```
Company hires employee
        │
        ▼
Admin creates employee
        │
        ▼
System creates login account
        │
        ▼
Temporary password generated
        │
        ▼
Employee logs in
        │
        ▼
Change password
        │
        ▼
Access dashboard
```

---

# 📦 Asset Lifecycle

Every asset follows a complete lifecycle.

```
Purchased
      │
Registered
      │
Available
      │
Allocated
      │
Returned
      │
Available
      │
Maintenance
      │
Available
      │
Retired
      │
Disposed
```

Every status transition is permanently recorded.

---

# 🏢 Shared Resource Workflow

Resources include:

- Meeting Rooms
- Conference Halls
- Vehicles
- Laboratories
- Projectors
- Training Rooms

Booking Flow

```
Employee

↓

Select Resource

↓

Choose Date & Time

↓

Availability Check

↓

Booking Created

↓

Notification Sent

↓

Booking Completed
```

PostgreSQL prevents overlapping bookings using database constraints.

---

# 🔧 Maintenance Workflow

```
Employee

↓

Raise Maintenance Request

↓

Asset Manager Approval

↓

Assign Technician

↓

Repair

↓

Inspection

↓

Asset Available Again
```

---

# 📋 Audit Workflow

```
Admin Creates Audit

↓

Assign Auditor

↓

Physical Verification

↓

Verified

Missing

Damaged

↓

Audit Report
```

---

# 🔐 Authentication

The application uses JWT Authentication.

Features

- Secure Login
- Forgot Password
- Reset Password
- Password Hashing
- Role-Based Access
- Session Management

---

# 🔑 Role-Based Access Control

Permissions are managed dynamically.

Examples

```
asset.create

asset.update

asset.allocate

resource.book

maintenance.approve

audit.create

employee.promote

department.manage
```

Roles determine which permissions each user receives.

---

# 🗄 Database

The application uses PostgreSQL.

Database design follows:

- Third Normal Form (3NF)
- Append-only history
- Foreign Key Constraints
- Partial Indexes
- GiST Constraints
- Full Activity Logging
- Optimized Indexing

Modules

- Authentication
- Organization
- Assets
- Allocations
- Resources
- Bookings
- Maintenance
- Audits
- Notifications
- Activity Logs

---

# 📊 Dashboard

Different users receive different dashboards.

Admin

- Organization KPIs
- Department Summary
- Asset Statistics
- Reports

Employee

- My Assets
- My Bookings
- Notifications

Asset Manager

- Asset Allocation
- Maintenance
- Transfers

Resource Manager

- Today's Bookings
- Resource Utilization

Technician

- Assigned Repairs

Auditor

- Assigned Audits

---

# 📈 Features

### Organization

- Department Management
- Employee Directory
- Role Assignment

### Asset Management

- Asset Registration
- QR Code Support
- Asset Categories
- Asset Documents
- Asset Allocation
- Asset Transfers
- Asset History

### Resource Management

- Dynamic Resource Types
- Booking Calendar
- Availability Checking

### Maintenance

- Maintenance Requests
- Technician Assignment
- Repair Tracking

### Audit

- Audit Cycles
- Audit Reports
- Discrepancy Tracking

### Notifications

- Real-time Notifications
- Booking Alerts
- Maintenance Alerts
- Audit Alerts

### Activity Logs

Every important action is recorded.

Examples

- Login
- Asset Allocation
- Booking Creation
- Maintenance Approval
- Audit Completion

---

# 🛠 Tech Stack

## Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios

## Backend

- Node.js
- Express.js
- JWT
- bcrypt
- Multer

## Database

- PostgreSQL

---

# 🔒 Security

- JWT Authentication
- Password Hashing
- RBAC
- Parameterized Queries
- Input Validation
- Activity Logging
- Soft Deletes
- Transaction Support

---

# 📁 Project Structure

```
client/
│
├── src/
├── components/
├── pages/
├── services/

backend/
│
├── src/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── routes/
│   ├── middleware/
│   ├── validators/
│   ├── config/
│   └── utils/

database/
│
├── sql/
├── seed/
└── documentation/
```

---

# 🚀 Future Enhancements

- QR Code Scanning
- RFID Integration
- Mobile Application
- Email Notifications
- SMS Alerts
- AI-powered Asset Utilization
- Predictive Maintenance
- Multi-tenant SaaS Support
- Single Sign-On (SSO)
- Analytics Dashboard

---

# 👨‍💻 Team

Developed as part of a Hackathon project to demonstrate enterprise-grade software architecture, scalable backend design, and modern full-stack development practices.

---

# 📜 License

This project is created for educational and hackathon purposes.