# Frontend (React)

## Overview
This is the React-based frontend for the Expense Tracker application. It interacts with a Django REST API to provide users with a responsive interface for managing budgets, expenses, and salary periods.

---

## Features
- User login and registration
- JWT authentication stored in localStorage
- Dashboard displaying:
  - Total salary
  - Total expenses
  - Remaining balance
- Create, edit, and delete budgets and expenses
- Password reset functionality using Sendgrid 
- Image upload using Cloudinary

---

## Tech Stack
- React (Vite)
- JavaScript (ES6)
- Fetch API
- React Router
- LocalStorage (for JWT)

---

## Architecture

The frontend follows a component-based architecture:

- **Pages**  
  Main views such as Home, Login, Register, Profile

- **Components**  
  Reusable UI elements

- **Auth Context**  
  Manages authentication state globally

- **API Layer**  
  Handles communication with backend endpoints

---

## Key Technical Decisions

### JWT Authentication
JWT was used to support backend and frontend, allowing secure communication between services.

### Token-Based Password Reset 
A token based password reset used in backend and frontend implemented to mimic real world authentication flows.

### Protected API Calls
All secure endpoints include the Authorization header:

```text
Authorization: Bearer <token>

```

### 1. Install dependencies 
```bash
npm install
```

### 2. Run app
```bash
npm run dev 
```

## Deployment 
The frontend is deployed using Render:
Live App: https://expense-tracker-system-1-dhpr.onrender.com

## Challenges  & Solutions 
Issue: Unauthorised API calls (401 errors)
- Fixed by ensuring JWT token was included in all requests

Issue: Token expiration 
- Resolved by re-authentication flow 

Issue: Environment variables not loading 
- Fixed by using VITE_prefix and restarting dev server 
