// Debug configuration
console.log('=== Debug Information ===');
console.log('Environment:', process.env.NODE_ENV);
console.log('API URL from env:', process.env.REACT_APP_API_URL);
console.log('All REACT_APP_ variables:', Object.keys(process.env).filter(key => key.startsWith('REACT_APP_')));

export const debugInfo = {
  environment: process.env.NODE_ENV,
  apiUrl: process.env.REACT_APP_API_URL,
  allEnvVars: Object.keys(process.env).filter(key => key.startsWith('REACT_APP_'))
};
