# Task Prioritization API

Task Prioritization API is a backend application built with Node.js and Express to manage tasks efficiently, including automatic prioritization based on due dates and criticality.

## Features

- **CRUD Operations:** Create, read, update, and delete tasks.
- **Task Prioritization:** Tasks are automatically assigned a priority based on due date and critical status.
- **Validation:** Uses `express-validator` to validate task input data.
- **Sorting:** Implements merge sort to sort tasks by priority or due date.
- **Testing:** Uses `jest` and `supertest` for tests.
- **In-memory Database for Testing:** Uses `mongodb-memory-server` for efficient testing.
- **Openai for sentiment analysis:** Uses openai's API to add sentiment analysis to task descriptions.

## Setup Instructions

### Prerequisites
- Node.js installed (>= 14.x)
- MongoDB instance running (if using a real database)

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/task-prioritization-api.git
   cd task-prioritization-api
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file (if needed) and configure environment variables.
4. Start the development server:
   ```sh
   npm run dev
   ```
5. Run tests:
   ```sh
   npm test
   ```

## API Routes

### Retrieve all tasks
```http
GET /tasks
```

### Retrieve a specific task
```http
GET /tasks/:taskId
```

### Create a new task
```http
POST /tasks
```
**Request Body:**
```json
{
  "title": "Task Title",
  "description": "Task Description",
  "dueDate": "2025-02-10",
  "isCompleted": false
}
```

### Update a task
```http
PUT /tasks/:taskId
```
**Request Body:**
```json
{
  "title": "Updated Title",
  "isCompleted": true
}
```

### Delete a task
```http
DELETE /tasks/:taskId
```

## Future Improvements
- **User Authentication:** Implement authentication to support multiple users.
- **Advanced Filtering & Pagination:** Enhance task retrieval with filters and pagination.
- **Task Dependencies:** Allow tasks to depend on each other for better workflow management.
- **Notifications:** Send reminders for upcoming due dates.
- **Find more uses for sentiment analysis:** Brainstorm more uses for sentiment, could be used for filtering.

## External Libraries & Tools Used

- Express - Backend framework 
- Mongoose - MongoDB ORM 
- express-validator - Input validation
- dotenv - Environment variable management
- jest - Testing framework
- supertest - API testing
- mongodb-memory-server - In-memory MongoDB for testing
- nodemon - Auto-reloading during development
- openai - Used for sentiment analysis

---

Made by Andrey Kunev

