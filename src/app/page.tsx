/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from "react";
import CandidateForm from "@/components/candidate-form";
import CandidateCard from "@/components/candidate-card";

import { saveAs } from 'file-saver';



function generateId(entreprise: string) {
  return `${Date.now()}-${entreprise.toLowerCase().replace(/\s+/g, '-')}`;
}

export default function CandyHandy() {
  const [candidatures, setCandidatures] = useState<any[]>([]);
  const [form, setForm] = useState({
    id: "",
    titre: "",
    entreprise: "",
    poste: "",
    statut: "À faire",
    date: new Date().toISOString().split("T")[0],
    contact: "",
    documents: "",
    commentaires: "",
  });

useEffect(() => {
  const saved = localStorage.getItem("candidatures");
  if (saved) {
    try {
      setCandidatures(JSON.parse(saved));
    } catch {
      console.warn("Données invalides dans localStorage, nettoyage automatique");
      localStorage.removeItem("candidatures");
    }
  }
}, []);

useEffect(() => {
  localStorage.setItem("candidatures", JSON.stringify(candidatures));
}, [candidatures]);


const exportToCSV = () => {
  if (candidatures.length === 0) return;

  const headers = Object.keys(candidatures[0]).filter(k => k !== 'id');
  const rows = candidatures.map((c) =>
    headers.map((h) =>
      Array.isArray(c[h]) ? `"${c[h].join(';')}"` : `"${String(c[h]).replace(/"/g, '""')}"`
    ).join(',')
  );

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, 'candidatures.csv');
};

const importFromCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target?.result as string;
    const [headerLine, ...lines] = text.split('\n');
    const headers = headerLine.split(',');

    const newCandidatures = lines
      .filter(line => line.trim())
      .map(line => {
        const values = line.split(',').map(v => v.replace(/^"|"$/g, '').replace(/""/g, '"'));
        const obj: any = { id: `${Date.now()}-${Math.random().toString(36).substring(2, 8)}` };
        headers.forEach((h, i) => {
          const value = values[i] ?? '';
          obj[h] = h === 'documents' ? value.split(';').map(v => v.trim()) : value;
        });
        return obj;
      });

    setCandidatures(prev => [...prev, ...newCandidatures]);
  };

  reader.readAsText(file);
};

  const handleChange = (e: React.ChangeEvent<any>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdate = () => {
    const docsArray = form.documents.split(",").map((s) => s.trim());
    if (form.id) {
      // mode édition
      setCandidatures(prev =>
        prev.map(c => c.id === form.id ? { ...form, documents: docsArray } : c)
      );
    } else {
      // création
      const id = generateId(form.entreprise);
      setCandidatures(prev => [...prev, { ...form, id, documents: docsArray }]);
    }

    // reset
    setForm({
      id: "",
      titre: "",
      entreprise: "",
      poste: "",
      statut: "À faire",
      date: new Date().toISOString().split("T")[0],
      contact: "",
      documents: "",
      commentaires: "",
    });
  };

  const handleDelete = (id: string) => {
  setCandidatures(prev => prev.filter(c => c.id !== id));
};


  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">CandyHandy 🍬</h1>
      <CandidateForm form={form} onChange={handleChange} onSubmit={handleAddOrUpdate} isEditing={!!form.id} />
      <div className="space-y-4 pt-6">
        {candidatures.map((c) => (
          <CandidateCard key={c.id} data={c} onEdit={() => setForm({ ...c, documents: c.documents.join(", ") })} onDelete={() => handleDelete(c.id)} />
        ))}
      </div>
      <button onClick={exportToCSV} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
  📤 Exporter CSV
</button>
<label className="block mt-4">
  <span className="text-sm font-medium">📥 Importer CSV</span>
  <input
    type="file"
    accept=".csv"
    onChange={importFromCSV}
    className="mt-1 block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
               file:rounded file:border-0 file:text-sm file:font-semibold
               file:bg-gray-100 file:text-blue-700 hover:file:bg-gray-200"
  />
</label>


    </div>
  );

}



