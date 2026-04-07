// Placeholder auth middleware
// In a real app, this would verify JWT and attach user to req.user
export const authMiddleware = (req, res, next) => {
  // For now, mock a user
  req.user = {
    id: '64f1a2b3c4d5e6f7a8b9c0d1', // Mock user ID
    collegeId: '64f1a2b3c4d5e6f7a8b9c0d2', // Mock college ID
    name: 'Test User'
  };
  next();
};
