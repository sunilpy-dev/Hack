import morgan from 'morgan';

// Simple custom morgan configuration
const logger = morgan(':method :url :status :res[content-length] - :response-time ms');

export default logger;
