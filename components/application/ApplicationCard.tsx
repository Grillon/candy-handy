'use client';

import { Application, Document } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { useState } from 'react';
import { DocumentList } from './DocumentList';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DocumentInput } from './DocumentInput';

interface ApplicationCardProps {
  application: Application;
  onEdit: (application: Application) => void;
  onDelete: (id: string) => void;
  onUpdateDocuments: (applicationId: string, documents: Document[]) => void;
}

export function ApplicationCard({ application, onEdit, onDelete, onUpdateDocuments }: ApplicationCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [isEditingDocuments, setIsEditingDocuments] = useState(false);

  const formattedDate = (() => {
    try {
      return format(new Date(application.date), 'dd MMMM yyyy', { locale: fr });
    } catch (e) {
      return application.date;
    }
  })();

  const handleDocumentsChange = (documents: Document[]) => {
    onUpdateDocuments(application.id, documents);
  };

  return (
    <Card className="transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg font-bold">{application.title}</CardTitle>
            <div className="flex flex-wrap gap-2 items-center">
              <StatusBadge status={application.status} />
              <span className="text-sm text-muted-foreground">
                {formattedDate}
              </span>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(application)}
              className="h-8 w-8"
            >
              <Edit2 className="h-4 w-4" />
              <span className="sr-only">Modifier</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(application.id)}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Supprimer</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Entreprise</p>
              <p className="text-sm">{application.company}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Poste</p>
              <p className="text-sm">{application.position}</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="w-full flex justify-between items-center h-8 p-0 mt-1"
            onClick={() => setExpanded(!expanded)}
          >
            <span className="text-xs">
              {expanded ? "Masquer les détails" : "Afficher plus"}
            </span>
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>

          {expanded && (
            <div className="space-y-3 pt-1 animate-accordion-down">
              {application.contact && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Contact</p>
                  <p className="text-sm">{application.contact}</p>
                </div>
              )}

              {application.comments && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Commentaires</p>
                  <p className="text-sm whitespace-pre-wrap">{application.comments}</p>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium text-muted-foreground">Documents</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingDocuments(!isEditingDocuments)}
                    className="h-6 px-2 text-xs"
                  >
                    {isEditingDocuments ? "Terminer" : "Modifier"}
                  </Button>
                </div>
                
                {isEditingDocuments ? (
                  <DocumentInput
                    documents={application.documents}
                    onChange={handleDocumentsChange}
                  />
                ) : (
                  <DocumentList 
                    documents={application.documents} 
                    onRemove={() => {}} 
                    readOnly={true} 
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}