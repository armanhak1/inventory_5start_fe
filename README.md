# 5 Star Care - Inventory Management Frontend

Professional inventory management system for rehabilitation centers.

## 🚀 Features

- ✅ **Full CRUD Operations** - Add, edit, delete inventory items
- ✅ **Real-time Search** - Filter items instantly
- ✅ **Status Filters** - In Stock, Low Stock, Out of Stock
- ✅ **CSV Export** - Download inventory data
- ✅ **Mobile Responsive** - Works on all devices
- ✅ **Delete Confirmation** - Prevent accidental deletions
- ✅ **Auto-save** - Changes tracked and saved efficiently
- ✅ **Color-coded Status** - Visual indicators for stock levels

## 🛠️ Tech Stack

- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Styling
- **MongoDB** - Database (via backend API)

## 📦 Installation

```bash
npm install
```

## 🔧 Configuration

Update `src/config.ts` with your backend API URL:

```typescript
export const config = {
  API_URL: 'http://localhost:3000/api',
  USE_API: true,
};
```

## 🚀 Development

```bash
npm run dev
```

Opens on http://localhost:5173

## 🏗️ Build for Production

```bash
npm run build
```

## 📊 Inventory Data

The app manages 39+ rehabilitation center inventory items including:
- Cleaning supplies
- Medical items
- Paper products
- Guest supplies
- Equipment & more

## 🎨 UI Features

- Mobile-first responsive design
- Touch-friendly controls
- Color-coded status indicators (red/yellow/green)
- Search and filter capabilities
- CSV export functionality
- Delete confirmation dialogs
- Toast notifications
- Keyboard shortcuts (Cmd/Ctrl+S to save, Cmd/Ctrl+F to search)

## 🔌 Backend Connection

Requires the 5 Star Care backend API running on port 3000.

Backend repository: [Add your backend repo URL]

## 📱 Mobile Support

Optimized for:
- iOS Safari
- Chrome Mobile
- Android browsers
- Tablets

## 🎯 Usage

1. **View Items** - Scroll through your inventory
2. **Add Item** - Click the blue + button
3. **Edit Value** - Click any quantity or percentage to modify
4. **Delete Item** - Click the red X button (with confirmation)
5. **Search** - Type in the search bar
6. **Filter** - Click status filter buttons
7. **Export** - Click green "Export CSV" button
8. **Save Changes** - Click "Save Changes" when editing

## 📄 License

MIT

## 🙏 Credits

Built with ❤️ for 5 Star Care Rehabilitation Center
