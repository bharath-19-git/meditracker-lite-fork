# MediTrack Lite - Real-Time Clinic Appointment and Prescription Tracker

## Project Overview
MediTrack Lite is a comprehensive clinic management system built with the MERN stack that streamlines appointment scheduling and prescription tracking for small medical clinics. The application supports two user roles: Patients and Doctors, each with specific functionalities and access controls.

## Features

### ✅ **Complete Weeks Implementation Verification**

### **Week 1: Role-Based User Authentication System** ✅
- ✅ Registration form with name, email, password, and role (Patient/Doctor)
- ✅ Email uniqueness validation and @meditrack.local domain restriction
- ✅ Password hashing with bcrypt (no plain-text storage)
- ✅ Login form with credential verification
- ✅ Role-based session handling with JWT
- ✅ Logout mechanism with session clearing
- ✅ Protected routes preventing cross-role access

### **Week 2: Appointment Booking Feature for Patients** ✅
- ✅ Patient-only appointment booking form
- ✅ Doctor selection from available list
- ✅ Date and time selection (9:00 AM - 5:00 PM slots)
- ✅ Health concern notes (max 200 characters)
- ✅ Appointment saved with "Pending" status
- ✅ Patient association and timestamp recording
- ✅ Maximum 2 appointments per day per patient restriction
- ✅ Shared pending appointments view (reverse chronological order)

### **Week 3: Doctor Appointment Acceptance** ✅
- ✅ Doctor-only pending appointments view
- ✅ "Accept" button for each pending appointment
- ✅ Status change from "Pending" to "Confirmed"
- ✅ Doctor assignment to appointment
- ✅ Accepted appointments hidden from other doctors
- ✅ "My Appointments" page for doctors
- ✅ Race condition prevention with atomic updates

### **Week 4: Appointment Status Updates and Prescriptions** ✅
- ✅ Status transition system: Confirmed → In Progress → Completed
- ✅ Only assigned doctor can update appointment status
- ✅ Prescription entry for completed appointments
- ✅ Medicine name, dosage, and frequency tracking
- ✅ Patient access to appointment status and prescriptions
- ✅ Patient restriction from updating appointment statuses

### **Week 5: Feedback System and Profile Dashboard** ✅
- ✅ Patient feedback submission for completed appointments
- ✅ Rating system (1-5 scale) with optional comments (max 150 characters)
- ✅ One feedback per appointment restriction
- ✅ Patient profile dashboard with appointment history
- ✅ Doctor performance dashboard with feedback and average ratings
- ✅ Access control for appointment details and feedback forms

### **Week 6: UI/UX and Documentation** ✅
- ✅ Consistent navigation system (Login/Logout, Dashboard, Appointments, Profile)
- ✅ Tailwind CSS styling for enhanced visual layout
- ✅ Toast notifications for user feedback (login, logout, appointments, feedback)
- ✅ Organized project structure with separated components
- ✅ Comprehensive README.md with setup instructions and features
- ✅ Error boundaries and loading states
- ✅ Responsive design for all screen sizes

## Technology Stack

### Frontend
- **React.js** - User interface library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Tailwind CSS** - Utility-first CSS framework
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin resource sharing

## Project Structure

\`\`\`
meditrack-lite/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── appointmentController.js
│   │   └── feedbackController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Appointment.js
│   │   └── Feedback.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── appointments.js
│   │   └── feedback.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Layout.jsx
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── Patient/
│   │   │   │   ├── BookAppointment.jsx
│   │   │   │   ├── PatientDashboard.jsx
│   │   │   │   └── FeedbackForm.jsx
│   │   │   ├── Doctor/
│   │   │   │   ├── DoctorDashboard.jsx
│   │   │   │   ├── PendingAppointments.jsx
│   │   │   │   └── MyAppointments.jsx
│   │   │   └── Shared/
│   │   │       └── AppointmentsList.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   └── constants.js
│   │   ├── App.jsx
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── tailwind.config.js
└── README.md
\`\`\`

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory:**
   \`\`\`bash
   cd backend
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   npm install express mongoose bcryptjs jsonwebtoken cors dotenv express-validator nodemon
   \`\`\`

3. **Environment Variables:**
   Create a `.env` file in the backend directory:
   \`\`\`env
   MONGO_URI=mongodb://localhost:27017/meditrack
   JWT_SECRET=5c526e780b2fc47f49ea59c4820d9429f46b6e6c13057287d32172cdd7e4b6d5
   PORT=5000
   NODE_ENV=development
   \`\`\`

4. **Start MongoDB:**
   - Make sure MongoDB is running on your system
   - For Windows: Start MongoDB service
   - For Mac/Linux: `sudo systemctl start mongod` or `brew services start mongodb-community`

5. **Start the backend server:**
   \`\`\`bash
   npm run dev
   \`\`\`
   The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   \`\`\`bash
   cd frontend
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   npm install react react-dom react-router-dom axios react-hot-toast react-scripts tailwindcss autoprefixer postcss
   \`\`\`

3. **Environment Variables:**
   Create a `.env` file in the frontend directory:
   \`\`\`env
   REACT_APP_API_URL=http://localhost:5000/api
   \`\`\`

4. **Start the frontend development server:**
   \`\`\`bash
   npm start
   \`\`\`
   The frontend will run on `http://localhost:3000`

### Database Setup

1. **MongoDB Local Setup:**
   - Install MongoDB Community Edition from https://www.mongodb.com/try/download/community
   - Start MongoDB service
   - The application will automatically create the required collections

2. **MongoDB Atlas Setup (Alternative):**
   - Create a MongoDB Atlas account at https://www.mongodb.com/atlas
   - Create a new cluster
   - Get your connection string
   - Update the `MONGO_URI` in your `.env` file with the Atlas connection string

### Complete Setup Process

1. **Clone or download the project**
2. **Backend setup:**
   \`\`\`bash
   cd backend
   npm install
   # Create .env file with the variables above
   npm run dev
   \`\`\`

3. **Frontend setup (in a new terminal):**
   \`\`\`bash
   cd frontend
   npm install
   # Create .env file with the variables above
   npm start
   \`\`\`

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

### Test Users

You can create test users with these email formats:
- Patient: `patient1@meditrack.local`
- Doctor: `doctor1@meditrack.local`

Remember: Only emails ending with `@meditrack.local` are accepted!

## 🚀 **Quick Start Guide**

### **Step 1: Environment Setup**
\`\`\`bash
# Backend environment variables (.env in backend folder)
MONGO_URI=mongodb://localhost:27017/meditrack
JWT_SECRET=5c526e780b2fc47f49ea59c4820d9429f46b6e6c13057287d32172cdd7e4b6d5
PORT=5000
NODE_ENV=development

# Frontend environment variables (.env in frontend folder)
REACT_APP_API_URL=http://localhost:5000/api
\`\`\`

### **Step 2: Backend Setup**
\`\`\`bash
cd backend
npm install
npm run seed  # Optional: Create sample data
npm run dev   # Start development server
\`\`\`

### **Step 3: Frontend Setup**
\`\`\`bash
cd frontend
npm install
npm start     # Start React development server
\`\`\`

### **Step 4: Access Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/api/health

### **Step 5: Test with Sample Data**
After running `npm run seed`, you can login with:

**Doctors:**
- john.smith@meditrack.local / password123
- sarah.johnson@meditrack.local / password123
- michael.brown@meditrack.local / password123

**Patients:**
- alice.wilson@meditrack.local / password123
- bob.davis@meditrack.local / password123
- carol.martinez@meditrack.local / password123

## 🔧 **Additional Setup Commands**

### **Database Management**
\`\`\`bash
# Seed sample data
cd backend && npm run seed

# Connect to MongoDB shell
mongo meditrack

# View collections
show collections

# Clear all data (if needed)
db.users.deleteMany({})
db.appointments.deleteMany({})
db.feedbacks.deleteMany({})
\`\`\`

### **Development Commands**
\`\`\`bash
# Backend development with auto-reload
cd backend && npm run dev

# Frontend development server
cd frontend && npm start

# Build frontend for production
cd frontend && npm run build

# Run both frontend and backend concurrently (optional)
# Install concurrently: npm install -g concurrently
concurrently "cd backend && npm run dev" "cd frontend && npm start"
\`\`\`

### **Testing the Application**
1. **Register new users** with @meditrack.local emails
2. **Login as Patient** → Book appointments
3. **Login as Doctor** → Accept and manage appointments
4. **Test the complete workflow** from booking to feedback
5. **Verify role-based access** by trying to access restricted pages

## Usage Guide

### For Patients

1. **Registration:**
   - Register with email ending in `@meditrack.local`
   - Select "Patient" as role
   - Complete profile information

2. **Booking Appointments:**
   - Navigate to "Book Appointment"
   - Select preferred doctor
   - Choose date and time (9 AM - 5 PM)
   - Add health concern description
   - Submit appointment request

3. **Managing Appointments:**
   - View appointment status in dashboard
   - Access prescriptions after appointment completion
   - Submit feedback for completed appointments

### For Doctors

1. **Registration:**
   - Register with email ending in `@meditrack.local`
   - Select "Doctor" as role
   - Complete profile information

2. **Managing Appointments:**
   - View pending appointments
   - Accept appointment requests
   - Update appointment status (Confirmed → In Progress → Completed)
   - Add prescriptions for completed appointments

3. **Performance Tracking:**
   - View feedback and ratings from patients
   - Monitor appointment history
   - Track average rating performance

## 📱 **Application Features Overview**

### **For Patients:**
- 🔐 Secure registration and login
- 📅 Book appointments with preferred doctors
- 👀 View appointment status and history
- 💊 Access prescriptions after completion
- ⭐ Submit feedback and ratings
- 📊 Personal dashboard with appointment tracking

### **For Doctors:**
- 🔐 Secure registration and login
- 📋 View and accept pending appointments
- 🔄 Update appointment status workflow
- 💊 Add prescriptions for completed appointments
- 📈 Performance dashboard with ratings
- 👥 Manage patient appointments efficiently

### **System Features:**
- 🛡️ Role-based access control
- 🔒 JWT authentication with secure sessions
- 📧 Email domain validation (@meditrack.local)
- ⚡ Real-time updates and notifications
- 📱 Responsive design for all devices
- 🎨 Modern UI with Tailwind CSS
- 🔄 Race condition prevention
- 📊 Comprehensive data validation

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id/accept` - Accept appointment
- `PUT /api/appointments/:id/status` - Update appointment status
- `PUT /api/appointments/:id/prescription` - Add prescription

### Feedback
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback/doctor/:doctorId` - Get doctor feedback

## Key Features Implementation

### Security Features
- Password hashing using bcrypt
- JWT token-based authentication
- Role-based access control
- Input validation and sanitization
- Protected routes and middleware

### Business Logic
- Email domain validation (@meditrack.local)
- Appointment limit enforcement (2 per day per patient)
- Status workflow validation
- Race condition prevention for appointment acceptance
- One feedback per appointment restriction

### User Experience
- Responsive design with Tailwind CSS
- Real-time toast notifications
- Intuitive navigation system
- Role-specific dashboards
- Clean, professional interface

## Known Limitations

1. **Email Domain Restriction:** Only @meditrack.local emails are accepted
2. **Time Slots:** Limited to 9 AM - 5 PM business hours
3. **Appointment Limit:** Maximum 2 appointments per day per patient
4. **Single Feedback:** One feedback submission per appointment
5. **Status Flow:** Unidirectional status progression only

## Future Enhancements

- Real-time notifications using WebSocket
- Email notifications for appointment updates
- Advanced search and filtering
- Appointment rescheduling functionality
- Multi-clinic support
- Mobile application
- Integration with external calendar systems
- Advanced reporting and analytics

## Deployment

### Local Development
The application is configured for local development with hot reloading and development tools.

### Production Deployment
For production deployment:
1. Build the React frontend: `npm run build`
2. Configure environment variables for production
3. Use PM2 or similar process manager for the backend
4. Set up reverse proxy with Nginx
5. Configure SSL certificates
6. Use MongoDB Atlas for database hosting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please create an issue in the GitHub repository or contact the development team.

---

**MediTrack Lite** - Streamlining healthcare management, one appointment at a time.
