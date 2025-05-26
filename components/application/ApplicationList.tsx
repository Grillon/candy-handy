'use client';

import { Application } from '@/lib/types';
import { ApplicationCard } from './ApplicationCard';
import type { Document } from '@/lib/types';


interface ApplicationListProps {
  applications: Application[];
  onEdit: (application: Application) => void;
  onDelete: (id: string) => void;
  onUpdateDocuments: (applicationId: string, documents: Document[]) => void;
}

export function ApplicationList({ applications, onEdit, onDelete, onUpdateDocuments }: ApplicationListProps) {
  if (applications.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 bg-muted/40 rounded-lg border border-dashed">
        <p className="text-muted-foreground">Aucune candidature à afficher</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <ApplicationCard
          key={application.id}
          application={application}
          onEdit={onEdit}
          onDelete={onDelete}
          onUpdateDocuments={onUpdateDocuments}
        />
      ))}
    </div>
  );
}
