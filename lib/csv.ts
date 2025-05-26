import { Application, ApplicationStatus, Document } from './types';

const DOCUMENT_TITLE_LINK_SEPARATOR = '|||';
const DOCUMENT_SEPARATOR = ';';

export function parseDocumentsString(documentsString: string): Document[] {
  if (!documentsString) return [];
  
  return documentsString.split(DOCUMENT_SEPARATOR)
    .filter(docStr => docStr.includes(DOCUMENT_TITLE_LINK_SEPARATOR))
    .map(docStr => {
      const [title, link] = docStr.split(DOCUMENT_TITLE_LINK_SEPARATOR);
      return { title, link };
    });
}

export function stringifyDocuments(documents: Document[]): string {
  return documents
    .map(doc => `${doc.title}${DOCUMENT_TITLE_LINK_SEPARATOR}${doc.link}`)
    .join(DOCUMENT_SEPARATOR);
}

export function convertToCSV(applications: Application[]): string {
  if (applications.length === 0) return '';
  
  // Define headers
  const headers = [
    'id', 'title', 'company', 'position', 'date', 
    'status', 'contact', 'comments', 'documents'
  ];
  
  const csvRows = [
    headers.join(','),
    ...applications.map(app => {
      const documentsString = stringifyDocuments(app.documents);
      return [
        app.id,
        `"${app.title.replace(/"/g, '""')}"`,
        `"${app.company.replace(/"/g, '""')}"`,
        `"${app.position.replace(/"/g, '""')}"`,
        app.date,
        app.status,
        `"${(app.contact || '').replace(/"/g, '""')}"`,
        `"${(app.comments || '').replace(/"/g, '""')}"`,
        `"${documentsString.replace(/"/g, '""')}"`
      ].join(',');
    })
  ];
  
  return csvRows.join('\n');
}

export function parseCSV(csvString: string): Application[] {
  const rows = csvString.split('\n');
  if (rows.length <= 1) return [];
  
  // Skip the header row
  return rows.slice(1)
    .filter(row => row.trim())
    .map(row => {
      const values: string[] = [];
      let insideQuotes = false;
      let currentValue = '';
      
      for (let i = 0; i < row.length; i++) {
        const char = row[i];
        
        if (char === '"') {
          if (i + 1 < row.length && row[i + 1] === '"') {
            // Handle escaped quote
            currentValue += '"';
            i++; // Skip next quote
          } else {
            // Toggle quote state
            insideQuotes = !insideQuotes;
          }
        } else if (char === ',' && !insideQuotes) {
          // End of value
          values.push(currentValue);
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      
      // Add the last value
      values.push(currentValue);
      
      const [id, title, company, position, date, status, contact, comments, documentsString] = values;
      
      return {
        id,
        title,
        company,
        position,
        date,
        status: status as ApplicationStatus,
        contact: contact || '',
        comments: comments || '',
        documents: parseDocumentsString(documentsString)
      };
    });
}

export function downloadCSV(applications: Application[]): void {
  if (typeof window === 'undefined') return;
  
  const csvContent = convertToCSV(applications);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `candyhandy-export-${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}