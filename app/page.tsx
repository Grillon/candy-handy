'use client';

import { useState, useEffect } from 'react';
import type { Document } from '@/lib/types';
import { Application, ApplicationStatus } from '@/lib/types';
import { getApplications, saveApplications, deleteApplication } from '@/lib/storage';
import { ApplicationForm } from '@/components/application/ApplicationForm';
import { ApplicationList } from '@/components/application/ApplicationList';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ImportExport } from '@/components/ImportExport';
import { CandyIcon } from '@/components/CandyIcon';
import { Plus, RefreshCw, Search } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle 
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Home() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [editingApplication, setEditingApplication] = useState<Application | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState<string>('10');
  const [currentPage, setCurrentPage] = useState(1);

  // Load applications from localStorage on initial mount
  useEffect(() => {
    const storedApplications = getApplications();
    setApplications(storedApplications);
    setIsLoading(false);
  }, []);

  const handleSaveApplication = (application: Application) => {
    let updatedApplications: Application[];
    
    if (editingApplication) {
      // Update existing application
      updatedApplications = applications.map(app => 
        app.id === application.id ? application : app
      );
      toast.success('Candidature mise à jour avec succès !');
    } else {
      // Add new application
      updatedApplications = [...applications, application];
      toast.success('Nouvelle candidature créée avec succès !');
    }
    
    setApplications(updatedApplications);
    saveApplications(updatedApplications);
    setIsFormOpen(false);
    setEditingApplication(null);
  };

  const handleEditApplication = (application: Application) => {
    setEditingApplication(application);
    setIsFormOpen(true);
  };

  const handleDeleteApplication = (id: string) => {
    const updatedApplications = deleteApplication(id);
    setApplications(updatedApplications);
    toast.success('Candidature supprimée avec succès !');
  };

const handleUpdateDocuments = (applicationId: string, updatedDocuments: any[]) => {
  const validatedDocuments: Document[] = updatedDocuments.map(doc => ({
    title: doc.title ?? '',
    link: doc.link ?? '',
  }));

  const updatedApplications = applications.map(app => {
    if (app.id === applicationId) {
      return { ...app, documents: validatedDocuments };
    }
    return app;
  });

  setApplications(updatedApplications);
  saveApplications(updatedApplications);
  toast.success('Documents mis à jour avec succès !');
};


  const handleImport = (importedApplications: Application[]) => {
    // Merge imported applications with existing ones (avoid duplicates by ID)
    const existingIds = new Set(applications.map(app => app.id));
    const newApplications = importedApplications.filter(app => !existingIds.has(app.id));
    
    const updatedApplications = [...applications, ...newApplications];
    setApplications(updatedApplications);
    saveApplications(updatedApplications);
  };

  const handleCreateNew = () => {
    setEditingApplication(null);
    setIsFormOpen(true);
  };

const filteredApplications = applications.filter(app => {
  const searchLower = searchQuery.toLowerCase();

  const commentsText = Array.isArray(app.comments)
    ? app.comments.map(c => `${c.date} ${c.content}`).join(' ')
    : '';

  return (
    app.title?.toLowerCase().includes(searchLower) ||
    app.company?.toLowerCase().includes(searchLower) ||
    app.position?.toLowerCase().includes(searchLower) ||
    app.contact?.toLowerCase().includes(searchLower) ||
    commentsText.toLowerCase().includes(searchLower)
  );
});


  const totalPages = pageSize === 'unlimited' ? 1 : Math.ceil(filteredApplications.length / Number(pageSize));
  const paginatedApplications = pageSize === 'unlimited' 
    ? filteredApplications 
    : filteredApplications.slice((currentPage - 1) * Number(pageSize), currentPage * Number(pageSize));

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CandyIcon className="h-6 w-6 text-pink-500" />
            <h1 className="text-xl font-bold">CandyHandy</h1>
          </div>
          <div className="flex items-center gap-2">
            <ImportExport 
              applications={applications} 
              onImport={handleImport} 
            />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Mes candidatures</h2>
          <Button onClick={handleCreateNew} className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            <span>Nouvelle candidature</span>
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={pageSize} onValueChange={setPageSize}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Éléments par page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 par page</SelectItem>
                <SelectItem value="50">50 par page</SelectItem>
                <SelectItem value="100">100 par page</SelectItem>
                <SelectItem value="unlimited">Tout afficher</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <RefreshCw className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <div>
              <ApplicationList
                applications={paginatedApplications}
                onEdit={handleEditApplication}
                onDelete={handleDeleteApplication}
                onUpdateDocuments={handleUpdateDocuments}
              />
              {pageSize !== 'unlimited' && totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Form modal */}
      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {editingApplication ? 'Modifier la candidature' : 'Nouvelle candidature'}
            </SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <ApplicationForm
              application={editingApplication || undefined}
              onSubmit={handleSaveApplication}
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
