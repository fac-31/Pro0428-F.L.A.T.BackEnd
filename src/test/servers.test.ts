import axios from 'axios';

const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8000';
const NODE_API_URL = process.env.NODE_API_URL || 'http://localhost:5000';

async function testPythonServer() {
  try {
    const response = await axios.post(`${PYTHON_API_URL}/api/welcome`, {
      messages: [{ role: 'user', content: "Hi! I'm moving in this week." }],
    });
    console.log('Python server is running!');
    console.log('Response:', response.data);
    return true;
  } catch (error) {
    console.error('Python server test failed:', error.message);
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
