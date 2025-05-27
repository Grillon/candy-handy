'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuidv4 } from 'uuid';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DocumentInput } from './DocumentInput';
import { Application, ApplicationStatus, Document } from '@/lib/types';

interface ApplicationFormProps {
  application?: Application;
  onSubmit: (application: Application) => void;
  onCancel: () => void;
}

const formSchema = z.object({
  title: z.string().min(1, { message: 'Le titre est requis' }),
  company: z.string().min(1, { message: 'L\'entreprise est requise' }),
  position: z.string().min(1, { message: 'Le poste est requis' }),
  date: z.string().min(1, { message: 'La date est requise' }),
  status: z.nativeEnum(ApplicationStatus),
  contact: z.string().optional(),
  // comments field removed, now handled separately
});

type FormValues = z.infer<typeof formSchema> & { documents: Document[] };

export function ApplicationForm({ application, onSubmit, onCancel }: ApplicationFormProps) {
  const [comments, setComments] = useState(application?.comments || []);
  const [newCommentDate, setNewCommentDate] = useState("");
  const [newCommentContent, setNewCommentContent] = useState("");

  const addComment = () => {
    if (newCommentDate && newCommentContent.trim()) {
      setComments([...comments, { date: newCommentDate, content: newCommentContent.trim() }]);
      setNewCommentDate("");
      setNewCommentContent("");
    }
  };
  const [documents, setDocuments] = useState<Document[]>(application?.documents || []);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: application?.title || '',
      company: application?.company || '',
      position: application?.position || '',
      date: application?.date || new Date().toISOString().slice(0, 10),
      status: application?.status || ApplicationStatus.TODO,
      contact: application?.contact || '',
      documents: application?.documents || [],
    },
  });

  const handleSubmit = (values: FormValues) => {
    const submittedApplication: Application = {
    id: application?.id || uuidv4(),
    ...values,
    contact: values.contact ?? '',
    comments,
    documents,
    };

    onSubmit(submittedApplication);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Entreprise</FormLabel>
                <FormControl>
                  <Input placeholder="Nom de l'entreprise" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Poste visé</FormLabel>
                <FormControl>
                  <Input placeholder="Poste visé" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Statut</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(ApplicationStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="contact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact</FormLabel>
              <FormControl>
                <Input placeholder="Nom, email, téléphone..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        <div>
          <FormLabel className="block mb-2">Documents</FormLabel>
<ul className="space-y-2 mb-2">
  {documents.map((doc, i) => (
    <li key={i} className="flex flex-col gap-2 border p-2 rounded bg-muted">
      <Input
        type="text"
        placeholder="Titre"
        value={doc.title}
        onChange={(e) => {
          const newDocs = [...documents];
          newDocs[i].title = e.target.value;
          setDocuments(newDocs);
        }}
      />
      <Input
        type="text"
        placeholder="Lien"
        value={doc.link}
        onChange={(e) => {
          const newDocs = [...documents];
          newDocs[i].link = e.target.value;
          setDocuments(newDocs);
        }}
      />
      <div className="flex justify-end">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-red-600 text-xs"
          onClick={() => {
            const newDocs = documents.filter((_, index) => index !== i);
            setDocuments(newDocs);
          }}
        >
          Supprimer
        </Button>
      </div>
    </li>
  ))}
</ul>

<Button
  type="button"
  onClick={() => setDocuments([...documents, { title: '', link: '' }])}
>
  Ajouter un document
</Button>

        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            {application ? 'Mettre à jour' : 'Créer'}
          </Button>
        </div>
<div className="mt-6">
  <h4 className="text-sm font-semibold text-muted-foreground">Commentaires</h4>
<ul className="space-y-2">
  {comments.map((comment, i) => (
    <li key={i} className="flex flex-col gap-2 border p-2 rounded bg-muted text-sm">
      <input
        type="date"
        value={comment.date}
        onChange={(e) => {
          const newComments = [...comments];
          newComments[i].date = e.target.value;
          setComments(newComments);
        }}
        className="rounded border border-input px-2 py-1 text-xs"
      />
      <Textarea
        value={comment.content}
        onChange={(e) => {
          const newComments = [...comments];
          newComments[i].content = e.target.value;
          setComments(newComments);
        }}
        className="resize-none"
      />
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          className="text-red-600 text-xs"
          onClick={() => {
            const newComments = comments.filter((_, index) => index !== i);
            setComments(newComments);
          }}
        >
          Supprimer
        </Button>
      </div>
    </li>
  ))}
</ul>

  <div className="mt-4 space-y-2">
    <input
      type="date"
      value={newCommentDate}
      onChange={(e) => setNewCommentDate(e.target.value)}
      className="w-full rounded border border-input bg-background px-2 py-1 text-sm"
    />
    <Textarea
      value={newCommentContent}
      onChange={(e) => setNewCommentContent(e.target.value)}
      placeholder="Ajouter un commentaire"
      className="resize-none"
    />
    <Button type="button" onClick={addComment} className="w-full">
      Ajouter
    </Button>
  </div>
</div>

      </form>
    </Form>
  );
}
