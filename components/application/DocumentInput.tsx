'use client';

import { useState } from "react";
import { Document } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import { DocumentList } from "./DocumentList";

interface DocumentInputProps {
  documents: Document[];
  onChange: (documents: Document[]) => void;
}

export function DocumentInput({ documents, onChange }: DocumentInputProps) {
  const [newTitle, setNewTitle] = useState("");
  const [newLink, setNewLink] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleAddDocument = () => {
    if (!newTitle) return;

    const updatedDocuments = [
      ...documents,
      { title: newTitle, link: newLink }
    ];
    
    onChange(updatedDocuments);
    setNewTitle("");
    setNewLink("");
    setSelectedFile(null);
  };

  const handleRemoveDocument = (index: number) => {
    const updatedDocuments = documents.filter((_, i) => i !== index);
    onChange(updatedDocuments);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setNewTitle(file.name);
    }
  };

  return (
    <div className="space-y-3">
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Titre du document"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <Input
              placeholder="Lien (URL)"
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
            />
          </div>
          <Button
            type="button"
            size="icon"
            onClick={handleAddDocument}
            disabled={!newTitle}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Ajouter un document</span>
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <FileText className="h-3 w-3 mr-1" />
              Choisir un fichier
            </Button>
            <Input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
            {selectedFile && (
              <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                {selectedFile.name}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="pt-2">
        <h3 className="text-sm font-medium mb-2">Documents ({documents.length})</h3>
        <DocumentList 
          documents={documents} 
          onRemove={handleRemoveDocument} 
        />
      </div>
    </div>
  );
}