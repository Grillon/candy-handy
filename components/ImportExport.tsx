'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription 
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { parseCSV, convertToCSV, downloadCSV } from '@/lib/csv';
import { Application } from '@/lib/types';
import { Upload, Download, FileWarning, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface ImportExportProps {
  applications: Application[];
  onImport: (applications: Application[]) => void;
}

export function ImportExport({ applications, onImport }: ImportExportProps) {
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [csvData, setCsvData] = useState('');
  const [parseError, setParseError] = useState<string | null>(null);

  const handleExport = () => {
    downloadCSV(applications);
    toast.success('Export réussi !', {
      description: 'Vos candidatures ont été exportées avec succès.'
    });
  };

  const handleImport = () => {
    setParseError(null);
    try {
      if (!csvData.trim()) {
        setParseError('Les données CSV sont vides.');
        return;
      }
      
      const parsedData = parseCSV(csvData);
      
      if (parsedData.length === 0) {
        setParseError('Aucune candidature n\'a pu être importée. Vérifiez le format CSV.');
        return;
      }
      
      onImport(parsedData);
      setIsImportOpen(false);
      setCsvData('');
      
      toast.success(`Import réussi !`, {
        description: `${parsedData.length} candidature${parsedData.length > 1 ? 's' : ''} importée${parsedData.length > 1 ? 's' : ''}.`
      });
    } catch (error) {
      console.error('Import error:', error);
      setParseError('Format CSV invalide. Vérifiez le format et réessayez.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCsvData(event.target.result as string);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        onClick={handleExport}
      >
        <Download className="h-4 w-4" />
        <span>Exporter CSV</span>
      </Button>
      
      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Upload className="h-4 w-4" />
            <span>Importer CSV</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Importer des candidatures</DialogTitle>
            <DialogDescription>
              Collez vos données CSV ou téléchargez un fichier pour importer vos candidatures.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Button 
              variant="outline" 
              onClick={() => document.getElementById('csv-file')?.click()}
              className="w-full"
            >
              <FileWarning className="h-4 w-4 mr-2" />
              Choisir un fichier CSV
            </Button>
            <input
              id="csv-file"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileUpload}
            />
            
            <Textarea
              placeholder="Collez vos données CSV ici..."
              value={csvData}
              onChange={(e) => setCsvData(e.target.value)}
              rows={10}
              className="font-mono text-xs"
            />
            
            {parseError && (
              <div className="bg-destructive/10 p-3 rounded-md flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{parseError}</p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsImportOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleImport}>
              Importer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}