# 🚀 Quick Start Guide - Full Stack Setup

## Backend Setup (5star_be)

### 1. Navigate to your backend project
```bash
cd /path/to/5star_be
```

### 2. Create the inventory routes file
Create a new file: `routes/inventory.js` with the content from `BACKEND_SETUP.md`

### 3. Update your main server file
Add these lines to your `server.js` or `app.js`:

```javascript
const express = require('express');
const cors = require('cors');
const inventoryRoutes = require('./routes/inventory');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/inventory', inventoryRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

### 4. Install dependencies
```bash
npm install express cors
```

### 5. Start the backend
```bash
node server.js
# or with nodemon:
nodemon server.js
```

Your backend should now be running on `http://localhost:3000`

---

## Frontend Setup (this project)

### 1. Configure API connection
Open `src/config.ts` and ensure:
```typescript
export const config = {
  API_URL: 'http://localhost:3000/api',
  USE_API: true, // Set to true to use backend API
};
```

### 2. Start the frontend
```bash
npm run dev
```

Your frontend should now be running on `http://localhost:5173`

---

## Testing the Connection

1. **Start Backend**: Make sure your backend is running on port 3000
2. **Start Frontend**: Make sure your frontend is running on port 5173
3. **Check Connection**: You should see a success toast saying "Connected to API: http://localhost:3000/api"
4. **Test Features**:
   - View mock data (10 pre-loaded items)
   - Add new items
   - Update quantities/percentages
   - Save changes (syncs to backend)
   - Search and filter items

---

## Switching Between API and LocalStorage

### To use API (Backend):
In `src/config.ts`:
```typescript
export const config = {
  API_URL: 'http://localhost:3000/api',
  USE_API: true,
};
```

### To use LocalStorage (Offline):
In `src/config.ts`:
```typescript
export const config = {
  API_URL: 'http://localhost:3000/api',
  USE_API: false, // Changed to false
};
```

---

## Mock Data Included

The backend comes with 10 sample items:
- Wheelchairs (5 units) - In Stock
- Walkers (12 units) - In Stock
- Hand Sanitizer (25%) - Low Stock
- Medical Gloves (0 units) - Out of Stock
- Bandages (2 units) - Low Stock
- Physical Therapy Gel (75%) - In Stock
- Crutches (8 units) - In Stock
- Resistance Bands (15 units) - In Stock
- Ice Packs (0 units) - Out of Stock
- Massage Oil (45%) - In Stock

---

## Troubleshooting

### CORS Error
Make sure your backend has CORS enabled for `http://localhost:5173`

### API Not Connecting
1. Check backend is running on port 3000
2. Check `src/config.ts` has correct API_URL
3. Check browser console for errors

### Port Conflicts
- Backend default: 3000 (change in server.js if needed)
- Frontend default: 5173 (Vite will auto-increment if taken)

---

## API Endpoints

- `GET /api/inventory` - Get all items
- `POST /api/inventory` - Create new item
- `PUT /api/inventory/:id` - Update item
- `PUT /api/inventory/bulk/update` - Save all changes
- `DELETE /api/inventory/:id` - Delete item
- `GET /api/health` - Health check

---

## Next Steps

1. Replace in-memory storage with a database (MongoDB, PostgreSQL, etc.)
2. Add authentication and user management
3. Add data validation with Joi or Zod
4. Deploy backend and frontend
5. Update API_URL in config for production

Enjoy! 🎉

