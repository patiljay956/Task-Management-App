# 📁 Project Management App (Backend)

A robust backend for a Project Management System built using Node.js, Express, and MongoDB, featuring authentication, role-based access control, task and project management, file uploads with Cloudinary, and clean MVC architecture.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express

- **Database**: MongoDB with Mongoose ODM

- **Authentication**: JWT (JSON Web Tokens)

- **Validation**: express-validator

- **File Upload**: Multer + Cloudinary

- **Other Tools**: dotenv, cors

## 📂 Directory Structure

```
src/
│
├── app.js           # Initializes Express app and middleware
├── index.js         # Main server entry point
│
├── controllers/     # Route handler logic (controllers)
├── models/          # Mongoose schemas and models
├── routes/          # API route definitions
├── middlewares/     # Custom middleware: auth, validation, file uploads
├── utils/           # Utility functions: API responses, error handling, Cloudinary helpers
├── validators/      # Request validation logic (express-validator)
└── db/              # Database connection and configuration
```

- Clean separation of concerns for scalability and maintainability.
- Each folder focuses on a single responsibility (MVC pattern).
- Easily extendable for new features or modules.

## ✅ Features

- 🔐 Authentication: Register/Login with JWT-based secure sessions.

- 👥 Role Management: Admins, Project Admins, and Users.

- 📁 Project & Task Management:

    - Create/Edit/Delete Projects & Tasks.
    - Assign users to projects and tasks.
    - Attach files to tasks (uploaded via Cloudinary).

- 📎 Separate Attachment Upload Route: Keeps create/update task routes clean.

- 📝 Notes & Subtasks: Modular features with independent APIs.

- 🧪 Healthcheck API: Quick server status endpoint.

## Models

- **User**: Represents application users with authentication details.
- **Project**: Represents projects with details like name, description, and members.
- **ProjectMember**: Represents members of a project with roles.
- **Task**: Represents tasks within projects, including status and priority.
- **Subtask**: Represents subtasks within tasks.
- **Note**: Represents notes within projects for additional context.
- **Attachment**: Represents file attachments for tasks.

## 🏗️ Setup Instructions

1. **Clone the repository**:

    ```bash
    git clone <repository-url>
    ```

2. **Install dependencies**:

    ```bash
    cd <repository-folder>
    npm install
    ```

3. **Set up environment variables**:

    - Create a `.env` file in the root directory.
    - Add the necessary environment variables (refer to `.env.example`).

4. **Run the application**:

    ```bash
    npm start
    npm run dev # For development with nodemon
    ```

5. **Access the API**:
    - Open your browser or API client (like Postman) and navigate to `http://localhost:3000/api`.

## Utilities

### **Error Handling**

- `ApiError`: Custom error class for API errors.
- `asyncHandler`: Wrapper for handling asynchronous errors.

### **Mail Utility**

- `sendMail`: Sends transactional emails using Mailgen and Nodemailer.
- `emailVerificationMailGenerator`: Generates email verification content.
- `forgotPasswordMailGenContent`: Generates password reset email content.

### **File Upload**

- `uploadOnCloudinary`: Uploads files to Cloudinary.

---

## 📄 API Documentation for Project Management App

---

## 🛠️ Controllers and Routes

### **Auth Controller**

Handles user authentication and account management.

| Method | Endpoint                                 | Description                                  |
| ------ | ---------------------------------------- | -------------------------------------------- |
| POST   | `/api/v1/user/register`                  | Register a new user.                         |
| POST   | `/api/v1/user/login`                     | Login and get access/refresh tokens.         |
| GET    | `/api/v1/user/logout`                    | Logout the current user.                     |
| GET    | `/api/v1/user/verify-email`              | Verify user email using a token.             |
| POST   | `/api/v1/user/resend-verification-email` | Resend email verification link.              |
| POST   | `/api/v1/user/forgot-password-request`   | Request a password reset link.               |
| POST   | `/api/v1/user/reset-password`            | Reset forgotten password using a token.      |
| POST   | `/api/v1/user/refresh-access-token`      | Refresh access token using refresh token.    |
| GET    | `/api/v1/user/current-user`              | Get details of the currently logged-in user. |
| PATCH  | `/api/v1/user/change-password`           | Change the current user's password.          |

---

### **Project Controller**

Handles project creation, updates, and deletion.

| Method | Endpoint                     | Description                   |
| ------ | ---------------------------- | ----------------------------- |
| GET    | `/api/v1/project`            | Get all projects.             |
| GET    | `/api/v1/project/:projectId` | Get a specific project by ID. |
| POST   | `/api/v1/project`            | Create a new project.         |
| PATCH  | `/api/v1/project/:projectId` | Update a project by ID.       |
| DELETE | `/api/v1/project/:projectId` | Delete a project by ID.       |

---

### **Project Member Controller**

Handles project member management.

| Method | Endpoint                            | Description                          |
| ------ | ----------------------------------- | ------------------------------------ |
| GET    | `/api/v1/project/:projectId/member` | Get all members of a project.        |
| POST   | `/api/v1/project/:projectId/member` | Add a member to a project.           |
| DELETE | `/api/v1/project/:projectId/member` | Remove a member from a project.      |
| PATCH  | `/api/v1/project/:projectId/member` | Update a member's role in a project. |

---

### **Task Controller**

Handles task creation, updates, and deletion.

| Method | Endpoint                                                      | Description                      |
| ------ | ------------------------------------------------------------- | -------------------------------- |
| GET    | `/api/v1/project/:projectId/tasks`                            | Get all tasks for a project.     |
| POST   | `/api/v1/project/:projectId/tasks`                            | Create a new task for a project. |
| GET    | `/api/v1/project/:projectId/tasks/:taskId`                    | Get a specific task by ID.       |
| PATCH  | `/api/v1/project/:projectId/tasks/:taskId`                    | Update a task by ID.             |
| DELETE | `/api/v1/project/:projectId/tasks/:taskId`                    | Delete a task by ID.             |
| PATCH  | `/api/v1/project/:projectId/tasks/:taskId/status-or-priority` | Update task status or priority.  |
| PATCH  | `/api/v1/project/:projectId/tasks/:taskId/attachments`        | Upload attachments for a task.   |

---

### **Subtask Controller**

Handles subtasks within tasks.

| Method | Endpoint                             | Description                      |
| ------ | ------------------------------------ | -------------------------------- |
| GET    | `/api/v1/subtask/:taskId`            | Get all subtasks for a task.     |
| POST   | `/api/v1/subtask/:taskId`            | Create a new subtask for a task. |
| PATCH  | `/api/v1/subtask/:taskId/:subtaskId` | Update a subtask by ID.          |
| DELETE | `/api/v1/subtask/:taskId/:subtaskId` | Delete a subtask by ID.          |

---

### **Note Controller**

Handles notes within projects.

| Method | Endpoint                          | Description                      |
| ------ | --------------------------------- | -------------------------------- |
| GET    | `/api/v1/note/:projectId`         | Get all notes for a project.     |
| POST   | `/api/v1/note/:projectId`         | Create a new note for a project. |
| GET    | `/api/v1/note/:projectId/:noteId` | Get a specific note by ID.       |
| PATCH  | `/api/v1/note/:projectId/:noteId` | Update a note by ID.             |
| DELETE | `/api/v1/note/:projectId/:noteId` | Delete a note by ID.             |

---

### **HealthCheck Controller**

Provides server health status.

| Method | Endpoint              | Description                 |
| ------ | --------------------- | --------------------------- |
| GET    | `/api/v1/healthcheck` | Check server health status. |

---

## 🛠️ Models

### **User Model**

Represents a user in the system.

| Field                     | Type    | Description                               |
| ------------------------- | ------- | ----------------------------------------- |
| `name`                    | String  | User's full name.                         |
| `avatar`                  | Object  | User's avatar (URL and local path).       |
| `username`                | String  | Unique username.                          |
| `email`                   | String  | User's email address.                     |
| `password`                | String  | Hashed password.                          |
| `isEmailVerified`         | Boolean | Email verification status.                |
| `emailVerificationToken`  | String  | Token for email verification.             |
| `emailVerificationExpiry` | Date    | Expiry date for email verification token. |
| `forgotPasswordToken`     | String  | Token for password reset.                 |
| `forgotPasswordExpiry`    | Date    | Expiry date for password reset token.     |
| `refreshToken`            | String  | Refresh token for authentication.         |

---

### **Project Model**

Represents a project in the system.

| Field         | Type     | Description                                    |
| ------------- | -------- | ---------------------------------------------- |
| `name`        | String   | Project name.                                  |
| `description` | String   | Project description.                           |
| `createdBy`   | ObjectId | Reference to the user who created the project. |

---

### **Project Member Model**

Represents a member of a project.

| Field     | Type     | Description                      |
| --------- | -------- | -------------------------------- |
| `user`    | ObjectId | Reference to the user.           |
| `project` | ObjectId | Reference to the project.        |
| `role`    | String   | Role of the user in the project. |

---

### **Task Model**

Represents a task within a project.

| Field         | Type     | Description                                  |
| ------------- | -------- | -------------------------------------------- |
| `title`       | String   | Task title.                                  |
| `description` | String   | Task description.                            |
| `project`     | ObjectId | Reference to the project.                    |
| `assignedTo`  | ObjectId | Reference to the user assigned to the task.  |
| `assignedBy`  | ObjectId | Reference to the user who assigned the task. |
| `status`      | String   | Task status (e.g., TODO, IN_PROGRESS, DONE). |
| `priority`    | String   | Task priority (e.g., LOW, MEDIUM, HIGH).     |
| `attachments` | Array    | List of attachments for the task.            |

---

### **Subtask Model**

Represents a subtask within a task.

| Field         | Type     | Description                                    |
| ------------- | -------- | ---------------------------------------------- |
| `title`       | String   | Subtask title.                                 |
| `task`        | ObjectId | Reference to the parent task.                  |
| `isCompleted` | Boolean  | Completion status of the subtask.              |
| `createdBy`   | ObjectId | Reference to the user who created the subtask. |

---

### **Note Model**

Represents a note within a project.

| Field       | Type     | Description                                 |
| ----------- | -------- | ------------------------------------------- |
| `project`   | ObjectId | Reference to the project.                   |
| `createdBy` | ObjectId | Reference to the user who created the note. |
| `content`   | String   | Content of the note.                        |

---

## 📌 Notes

- Task attachments are handled via a dedicated route.

- Clean async error handling using custom asyncHandler and ApiError.

- Includes global error middleware and validation logic.

- Separation of concern is maintained using controllers, middlewares, utils, and models.

## 🙋‍♂️ Author

- **Jay Patil**
- **Email:** [patiljay956@gmail.com](mailto:patiljay956@gmail.com)
- **GitHub:** [https://github.com/patiljay956](https://github.com/patiljay956)
- **LinkedIn:** [https://linkedin.com/in/patiljay956](https://linkedin.com/in/patiljay956)

## Let me know when you want

- A Postman collection for testing.
- Docker setup for containerization.
- Setup instructions for production deployment.
- Additional features or modules.
