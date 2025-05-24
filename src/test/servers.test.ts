import axios from 'axios';

const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8001';
const NODE_API_URL = process.env.NODE_API_URL || 'http://localhost:5000';

async function testPythonServer() {
  try {
    console.log('Attempting to connect to Python server at:', PYTHON_API_URL);
    
    // First test the simple test route
    const testResponse = await axios.get(`${PYTHON_API_URL}/api/test`);
    console.log('Basic server test:', testResponse.data);
    
    // Then test the welcome route
    const response = await axios.post(`${PYTHON_API_URL}/api/welcome`, {
      messages: [{ role: 'user', content: "Hi! I'm moving in this week." }],
    });
    console.log('Welcome route test:', response.data);
    return true;
  } catch (error) {
    console.error('\nPython server test failed with the following details:');
    if (axios.isAxiosError(error)) {
      console.error('Error Type: Axios Error');
      console.error('Status Code:', error.response?.status);
      console.error('Error Message:', error.message);
      console.error('Response Data:', error.response?.data);
      console.error('Request URL:', error.config?.url);
      console.error('Request Method:', error.config?.method);
      console.error('Request Headers:', error.config?.headers);
      console.error('Request Data:', error.config?.data);
      
      if (error.code === 'ECONNREFUSED') {
        console.error('\nConnection Refused: The Python server is not running or not accessible at', PYTHON_API_URL);
        console.error('Please ensure:');
        console.error('1. The Python server is started (npm run dev:python)');
        console.error('2. The server is running on port 8000');
        console.error('3. No firewall is blocking the connection');
      }
    } else {
      console.error('Error Type: Unknown Error');
      console.error('Error:', error);
    }
    return false;
  }
}

async function testNodeServer() {
  try {
    const response = await axios.get(`${NODE_API_URL}/api/test-db`);
    console.log('Node.js server is running!');
    console.log('Response:', response.data);
    return true;
  } catch (error) {
    console.error('Node.js server test failed:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('Starting server tests...\n');

  const pythonResult = await testPythonServer();
  const nodeResult = await testNodeServer();

  console.log('\nTest Results:');
  console.log('Python Server:', pythonResult ? 'Running' : 'Not Running');
  console.log('Node.js Server:', nodeResult ? 'Running' : 'Not Running');

  if (pythonResult && nodeResult) {
    console.log('\nAll servers are running properly!');
  } else {
    console.log('\nSome servers are not running properly. Please check the errors above.');
  }
}

runTests();
