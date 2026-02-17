import React from 'react';
import { createRoot } from 'react-dom/client';

// Get the app root element
const appRoot = document.getElementById('app');

// Render your React component
const root = createRoot(appRoot);
root.render(<h1>Hello, world</h1>);