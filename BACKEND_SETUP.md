# Backend Setup Instructions

## Add these files to your `5star_be` Express project:

### 1. Create `/routes/inventory.js`

```javascript
const express = require('express');
const router = express.Router();

// Mock data store (in-memory for now)
let inventoryItems = [
  {
    id: '1',
    name: 'Wheelchairs',
    type: 'qty',
    value: 5,
    notes: 'Standard manual wheelchairs',
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    name: 'Walkers',
    type: 'qty',
    value: 12,
    notes: 'Adjustable height walkers',
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    name: 'Hand Sanitizer',
    type: 'pct',
    value: 25,
    notes: '70% alcohol-based sanitizer',
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    name: 'Medical Gloves',
    type: 'qty',
    value: 0,
    notes: 'Latex-free examination gloves',
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '5',
    name: 'Bandages',
    type: 'qty',
    value: 2,
    notes: 'Assorted sizes',
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '6',
    name: 'Physical Therapy Gel',
    type: 'pct',
    value: 75,
    notes: 'Ultrasound gel for PT sessions',
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString()
  },
  {
    id: '7',
    name: 'Crutches',
    type: 'qty',
    value: 8,
    notes: 'Adjustable aluminum crutches',
    updatedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString()
  },
  {
    id: '8',
    name: 'Resistance Bands',
    type: 'qty',
    value: 15,
    notes: 'Various resistance levels',
    updatedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString()
  },
  {
    id: '9',
    name: 'Ice Packs',
    type: 'qty',
    value: 0,
    notes: 'Reusable gel ice packs',
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '10',
    name: 'Massage Oil',
    type: 'pct',
    value: 45,
    notes: 'Therapeutic massage oil',
    updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  }
];

// GET all items
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: inventoryItems
  });
});

// GET single item
router.get('/:id', (req, res) => {
  const item = inventoryItems.find(i => i.id === req.params.id);
  if (!item) {
    return res.status(404).json({
      success: false,
      message: 'Item not found'
    });
  }
  res.json({
    success: true,
    data: item
  });
});

// POST create new item
router.post('/', (req, res) => {
  const { name, type, value, notes } = req.body;
  
  // Validation
  if (!name || !type || value === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Name, type, and value are required'
    });
  }
  
  const newItem = {
    id: Date.now().toString(),
    name,
    type,
    value,
    notes,
    updatedAt: new Date().toISOString()
  };
  
  inventoryItems.push(newItem);
  
  res.status(201).json({
    success: true,
    data: newItem
  });
});

// PUT update item
router.put('/:id', (req, res) => {
  const index = inventoryItems.findIndex(i => i.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Item not found'
    });
  }
  
  const { name, type, value, notes } = req.body;
  
  inventoryItems[index] = {
    ...inventoryItems[index],
    ...(name && { name }),
    ...(type && { type }),
    ...(value !== undefined && { value }),
    ...(notes !== undefined && { notes }),
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    data: inventoryItems[index]
  });
});

// PUT bulk update (for saving multiple changes)
router.put('/bulk/update', (req, res) => {
  const { items } = req.body;
  
  if (!Array.isArray(items)) {
    return res.status(400).json({
      success: false,
      message: 'Items must be an array'
    });
  }
  
  // Replace all items
  inventoryItems = items.map(item => ({
    ...item,
    updatedAt: new Date().toISOString()
  }));
  
  res.json({
    success: true,
    data: inventoryItems
  });
});

// DELETE item
router.delete('/:id', (req, res) => {
  const index = inventoryItems.findIndex(i => i.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Item not found'
    });
  }
  
  inventoryItems.splice(index, 1);
  
  res.json({
    success: true,
    message: 'Item deleted successfully'
  });
});

module.exports = router;
```

### 2. Update your main server file (e.g., `server.js` or `app.js`)

```javascript
const express = require('express');
const cors = require('cors');
const inventoryRoutes = require('./routes/inventory');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Your Vite dev server
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/inventory', inventoryRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Five Star Care API is running' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

### 3. Install required dependencies

```bash
cd 5star_be
npm install express cors
```

### 4. Start your backend server

```bash
node server.js
# or if you have nodemon:
nodemon server.js
```

## API Endpoints

- `GET /api/inventory` - Get all items
- `GET /api/inventory/:id` - Get single item
- `POST /api/inventory` - Create new item
- `PUT /api/inventory/:id` - Update item
- `PUT /api/inventory/bulk/update` - Bulk update all items
- `DELETE /api/inventory/:id` - Delete item

## Test the API

```bash
# Get all items
curl http://localhost:3000/api/inventory

# Create an item
curl -X POST http://localhost:3000/api/inventory \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Item","type":"qty","value":10,"notes":"Test"}'
```

