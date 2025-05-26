import { Application } from './types';

const STORAGE_KEY = 'candyhandy-applications';

export function getApplications(): Application[] {
  if (typeof window === 'undefined') return [];
  
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (!storedData) return [];
  
  try {
    return JSON.parse(storedData);
  } catch (error) {
    console.error('Failed to parse applications from localStorage:', error);
    return [];
  }
}

export function saveApplications(applications: Application[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
  } catch (error) {
    console.error('Failed to save applications to localStorage:', error);
  }
}

export function addApplication(application: Application): Application[] {
  const applications = getApplications();
  const updatedApplications = [...applications, application];
  saveApplications(updatedApplications);
  return updatedApplications;
}

export function updateApplication(updatedApplication: Application): Application[] {
  const applications = getApplications();
  const updatedApplications = applications.map(app => 
    app.id === updatedApplication.id ? updatedApplication : app
  );
  saveApplications(updatedApplications);
  return updatedApplications;
}

export function deleteApplication(id: string): Application[] {
  const applications = getApplications();
  const updatedApplications = applications.filter(app => app.id !== id);
  saveApplications(updatedApplications);
  return updatedApplications;
}