'use client';

import { Document } from "@/lib/types";
import { Trash2, ExternalLink, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocumentListProps {
  documents: Document[];
  onRemove: (index: number) => void;
  readOnly?: boolean;
}

export function DocumentList({ documents, onRemove, readOnly = false }: DocumentListProps) {
  if (documents.length === 0) {
    return <p className="text-sm text-muted-foreground italic">Aucun document</p>;
  }

  return (
    <ul className="space-y-2">
      {documents.map((doc, index) => (
        <li 
          key={index} 
          className="flex items-center justify-between bg-muted/50 p-2 rounded-md group"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="font-medium text-sm truncate">{doc.title}</span>
          </div>
          
          <div className="flex items-center gap-1">
            {doc.link && (
              <a 
                href={doc.link.startsWith('http') ? doc.link : `https://${doc.link}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">Open link</span>
              </a>
            )}
            
            {!readOnly && (
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onRemove(index)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
                <span className="sr-only">Remove document</span>
              </Button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}