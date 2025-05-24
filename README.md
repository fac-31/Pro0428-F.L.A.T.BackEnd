# F.L.A.T Backend

A backend service for the F.L.A.T application, combining Node.js/Express with Python FastAPI for AI-powered features.

## Prerequisites

- Node.js (v18 or higher)
- Python (v3.8 or higher)
- pip (Python package manager)

## Project Structure

```
.
├── src/
│   ├── python/           # Python FastAPI service
│   │   ├── server.py     # FastAPI server
│   │   └── user_preferences.py  # AI agent logic
│   ├── services/         # Node.js services
│   │   └── pythonService.ts  # Python service integration
│   ├── test/            # Test files
│   │   └── servers.test.ts  # Servers health check tests
│   ├── routes/          # Express route definitions
│   │   ├── ...
│   ├── controllers/     # Route controllers
│   │   ├── ...
│   ├── config/         # Database Configuration files
│   │   └── supabaseClient.ts
│   ├── app.ts          # Express app configuration
│   └── server.ts       # Express server entry point
├── package.json        # Node.js dependencies
└── requirements.txt    # Python dependencies
```

## Setup

1. Clone the repository:

```bash
git clone https://github.com/fac-31/Pro0428-F.L.A.T.BackEnd.git
cd Pro0428-F.L.A.T.BackEnd
```

2. Install dependencies:

```bash
npm install
```

This will automatically:

- Install all Node.js dependencies
- Install all Python dependencies (via postinstall script)

3. Create a `.env` file in the root directory:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key
PYTHON_API_URL=http://localhost:8000

# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Running the Application

The application consists of two services:

1. Node.js/Express server
2. Python FastAPI server

You can run both services with a single command:

```bash
npm run dev
```

Or run them separately:

```bash
npm run dev:node    # Run only the Express server
npm run dev:python  # Run only the Python server
```

## Testing

The project includes a server health check test that verifies both the Node.js and Python servers are running correctly:

```bash
npm test
```

This test will:

1. Check if the Python FastAPI server is running by sending a test message to the welcome endpoint
2. Check if the Node.js Express server is running by testing the database connection
3. Display the status of both servers

The test results will show:

- Whether each server is running
- Any error messages if the servers fail to respond
- A summary of the overall test status

## API Endpoints

### Node.js Express Server (Port 5000)

- `GET /api/test-db` - Test database connection
- `GET /users/:id` - Get user by ID
- `GET /users/create-user` - Create new user
- `GET /tenures/create-tenure` - Create new tenure
- `GET /houses/create-house` - Create new house
- `GET /bills/create-bill` - Create new bill
- `GET /contentedness/create-contentedness` - Create new contentedness entry
- `GET /cleaning/create-cleaning` - Create new cleaning entry
- `GET /emails/create-email` - Create new email

### Python FastAPI Server (Port 8000)

- `POST /api/welcome`

  - Handles welcome conversation with new housemates
  - Request body: `{ messages: [{ role: string, content: string }] }`

- `POST /api/preferences`
  - Updates and manages house preferences
  - Request body: `{ messages: [{ role: string, content: string }] }`

### Node.js Integration

The Node.js server communicates with the Python service using the `pythonService`:

```typescript
import { pythonService } from '../services/pythonService';

// Example usage in a route
const response = await pythonService.welcomeChat(messages);
```

## Development

- `npm run dev` - Start both servers
- `npm run check` - Check code formatting
- `npm run format` - Format code
- `npm run lint` - Run ESLint

## Troubleshooting

1. If Python dependencies fail to install:

```bash
pip install -r requirements.txt
```

2. If you get CORS errors:

- Check that the frontend URL is correctly set in `src/python/server.py`
- Ensure both servers are running on their expected ports

3. If the Python server fails to start:

- Verify Python and pip are installed
- Check that all Python dependencies are installed
- Ensure the OPENAI_API_KEY is set in your environment

4. If database connection fails:

- Verify Supabase credentials are correctly set in `.env`
- Check that the Supabase project is active
- Ensure the database tables are properly set up
