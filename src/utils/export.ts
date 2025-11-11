import type { Item } from '../types';

/**
 * Convert items array to CSV format
 */
export function convertToCSV(items: Item[]): string {
  if (items.length === 0) {
    return 'No data to export';
  }

  // CSV Headers
  const headers = ['ID', 'Item Name', 'Type', 'Value', 'Notes', 'Updated At'];
  
  // CSV Rows
  const rows = items.map(item => [
    item.id,
    `"${item.name.replace(/"/g, '""')}"`, // Escape quotes in name
    item.type === 'qty' ? 'Quantity' : 'Percentage',
    item.value,
    item.notes ? `"${item.notes.replace(/"/g, '""')}"` : '', // Escape quotes in notes
    item.updatedAt
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  return csvContent;
}

/**
 * Download CSV file
 */
export function downloadCSV(items: Item[], filename: string = 'inventory-export.csv'): void {
  try {
    // Convert items to CSV
    const csvContent = convertToCSV(items);
    
    // Create blob
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create download link
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log(`✅ Exported ${items.length} items to ${filename}`);
  } catch (error) {
    console.error('Failed to export CSV:', error);
    throw new Error('Failed to export CSV');
  }
}

/**
 * Generate filename with timestamp
 */
export function generateCSVFilename(): string {
  const now = new Date();
  const timestamp = now.toISOString()
    .replace(/T/, '_')
    .replace(/\..+/, '')
    .replace(/:/g, '-');
  
  return `5-star-care-inventory_${timestamp}.csv`;
}

