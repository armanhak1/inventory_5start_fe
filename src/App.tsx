import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { Item, ItemType, StatusColor, HistoryEntry } from './types';
import { inventoryRepository, isUsingApi, apiUrl } from './repository/InventoryRepository';
import './App.css';
import {
  generateId,
  filterBySearch,
  filterByStatus,
} from './utils/inventory';
import { downloadCSV, generateCSVFilename } from './utils/export';
import { useDebounce } from './hooks/useDebounce';
import { useToast } from './hooks/useToast';
import { TopNav } from './components/TopNav';
import { InventoryList } from './components/InventoryList';
import { AddItemFAB } from './components/AddItemFAB';
import { AddItemModal } from './components/AddItemModal';
import { StickySaveBar } from './components/StickySaveBar';
import { ToastContainer } from './components/Toast';
import { ConfirmDialog } from './components/ConfirmDialog';

const MAX_HISTORY = 50;

function App() {
  // Core state
  const [items, setItems] = useState<Item[]>([]);
  const [savedItems, setSavedItems] = useState<Item[]>([]);
  const [dirtyItemIds, setDirtyItemIds] = useState<Set<string>>(new Set());
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusColor | 'all'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [focusSearch, setFocusSearch] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);

  // Toast
  const { toasts, showToast, removeToast } = useToast();

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const [listHeight, setListHeight] = useState(600);

  // Load items from repository on mount
  useEffect(() => {
    let isMounted = true;
    
    const loadItems = async () => {
      try {
        setIsLoading(true);
        const loadedItems = await inventoryRepository.getAll();
        
        // Only update state if component is still mounted
        if (isMounted) {
          setItems(loadedItems);
          setSavedItems(loadedItems);
        }
      } catch (error) {
        console.error('Failed to load items:', error);
        if (isMounted) {
          showToast('Failed to load inventory', 'error');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadItems();
    
    // Cleanup function to prevent duplicate calls
    return () => {
      isMounted = false;
    };
  }, [showToast]);

  // Update list height based on window size
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const availableHeight = window.innerHeight - rect.top - (dirtyItemIds.size > 0 ? 80 : 20);
        setListHeight(Math.max(400, availableHeight));
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [dirtyItemIds.size]);

  // Debounced search
  const debouncedSearch = useDebounce(searchQuery, 200);

  // Filtered items
  const filteredItems = useMemo(() => {
    let result = items;
    result = filterBySearch(result, debouncedSearch);
    result = filterByStatus(result, statusFilter);
    return result;
  }, [items, debouncedSearch, statusFilter]);

  // Handle item value change
  const handleItemChange = useCallback((itemId: string, newValue: number) => {
    setItems(prev => {
      const updated = prev.map(item => {
        if (item.id === itemId) {
          // Add to history
          setHistory(prevHistory => {
            const entry: HistoryEntry = {
              itemId,
              previousValue: item.value,
              newValue,
              timestamp: new Date().toISOString(),
            };
            const newHistory = [...prevHistory, entry];
            return newHistory.slice(-MAX_HISTORY);
          });

          return {
            ...item,
            value: newValue,
            updatedAt: new Date().toISOString(),
          };
        }
        return item;
      });
      
      // Update dirty tracking
      setDirtyItemIds(prev => {
        const newSet = new Set(prev);
        const savedItem = savedItems.find(si => si.id === itemId);
        const currentItem = updated.find(ui => ui.id === itemId);
        
        if (savedItem && currentItem && savedItem.value !== currentItem.value) {
          newSet.add(itemId);
        } else {
          newSet.delete(itemId);
        }
        
        return newSet;
      });

      return updated;
    });
  }, [savedItems]);

  // Add new item
  const handleAddItem = useCallback(async (name: string, type: ItemType, value: number, notes?: string) => {
    try {
      // Use the proper addItem API method
      const newItem = await inventoryRepository.addItem({
        name,
        type,
        value,
        notes,
        updatedAt: new Date().toISOString(),
      });

      setItems(prev => [...prev, newItem]);
      setSavedItems(prev => [...prev, newItem]);
      showToast(`Added "${name}" successfully`, 'success');
    } catch (error) {
      console.error('Failed to add item:', error);
      showToast('Failed to add item', 'error');
    }
  }, [showToast]);

  // Save changes (only update items that changed)
  const handleSave = useCallback(async () => {
    try {
      // Update only the items that have changed
      const updatePromises = Array.from(dirtyItemIds).map(async (itemId) => {
        const item = items.find(i => i.id === itemId);
        if (item) {
          await inventoryRepository.updateItem(item.id, {
            value: item.value,
            updatedAt: new Date().toISOString(),
          });
        }
      });

      await Promise.all(updatePromises);
      setSavedItems(items);
      setDirtyItemIds(new Set());
      showToast(`Saved ${dirtyItemIds.size} ${dirtyItemIds.size === 1 ? 'change' : 'changes'}`, 'success');
    } catch (error) {
      console.error('Failed to save:', error);
      showToast('Failed to save changes', 'error');
    }
  }, [items, dirtyItemIds, showToast]);

  // Discard changes
  const handleDiscard = useCallback(() => {
    setItems(savedItems);
    setDirtyItemIds(new Set());
    setHistory([]);
    showToast('Changes discarded', 'info');
  }, [savedItems, showToast]);

  // Undo last change
  const handleUndo = useCallback(() => {
    if (history.length === 0) return;

    const lastEntry = history[history.length - 1];
    
    setItems(prev => prev.map(item => {
      if (item.id === lastEntry.itemId) {
        return {
          ...item,
          value: lastEntry.previousValue,
          updatedAt: new Date().toISOString(),
        };
      }
      return item;
    }));

    setHistory(prev => prev.slice(0, -1));

    // Update dirty tracking
    setDirtyItemIds(prev => {
      const newSet = new Set(prev);
      const savedItem = savedItems.find(si => si.id === lastEntry.itemId);
      
      if (savedItem && savedItem.value === lastEntry.previousValue) {
        newSet.delete(lastEntry.itemId);
      }
      
      return newSet;
    });

    showToast('Undone last change', 'info');
  }, [history, savedItems, showToast]);

  // Reset filters
  const handleReset = useCallback(() => {
    setSearchQuery('');
    setStatusFilter('all');
  }, []);

  // Handle delete click - show confirmation
  const handleDeleteClick = useCallback((itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      setItemToDelete(item);
      setDeleteConfirmOpen(true);
    }
  }, [items]);

  // Confirm delete
  const handleConfirmDelete = useCallback(async () => {
    if (!itemToDelete) return;

    try {
      await inventoryRepository.deleteItem(itemToDelete.id);
      setItems(prev => prev.filter(i => i.id !== itemToDelete.id));
      setSavedItems(prev => prev.filter(i => i.id !== itemToDelete.id));
      setDirtyItemIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemToDelete.id);
        return newSet;
      });
      showToast(`Deleted "${itemToDelete.name}" successfully`, 'success');
    } catch (error) {
      console.error('Failed to delete item:', error);
      showToast('Failed to delete item', 'error');
    } finally {
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    }
  }, [itemToDelete, showToast]);

  // Cancel delete
  const handleCancelDelete = useCallback(() => {
    setDeleteConfirmOpen(false);
    setItemToDelete(null);
  }, []);

  // Export to CSV
  const handleExportCSV = useCallback(() => {
    try {
      const filename = generateCSVFilename();
      downloadCSV(items, filename);
      showToast(`Exported ${items.length} items to CSV`, 'success');
    } catch (error) {
      console.error('Failed to export CSV:', error);
      showToast('Failed to export CSV', 'error');
    }
  }, [items, showToast]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S - Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (dirtyItemIds.size > 0) {
          handleSave();
        }
      }

      // Ctrl/Cmd + F - Focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setFocusSearch(true);
        setTimeout(() => setFocusSearch(false), 100);
      }

      // Escape - Clear search if focused
      if (e.key === 'Escape' && document.activeElement?.tagName === 'INPUT') {
        const input = document.activeElement as HTMLInputElement;
        if (input.type === 'text' && searchQuery) {
          setSearchQuery('');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dirtyItemIds.size, handleSave, searchQuery]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
      <TopNav
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onReset={handleReset}
        onExportCSV={handleExportCSV}
        itemCount={items.length}
        focusSearchShortcut={focusSearch}
      />

      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6" ref={containerRef}>
        <InventoryList
          items={filteredItems}
          dirtyItemIds={dirtyItemIds}
          onChange={handleItemChange}
          onDelete={handleDeleteClick}
          height={listHeight}
        />
      </main>

      <AddItemFAB onClick={() => setIsAddModalOpen(true)} />

      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddItem}
        existingItems={items}
      />

      <StickySaveBar
        dirtyCount={dirtyItemIds.size}
        onSave={handleSave}
        onDiscard={handleDiscard}
        onUndo={handleUndo}
        canUndo={history.length > 0}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        title="Delete Item?"
        message={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        type="danger"
      />
    </div>
  );
}

export default App;
