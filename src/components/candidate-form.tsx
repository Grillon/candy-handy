/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

type Props = {
  form: any;
  onChange: (e: React.ChangeEvent<any>) => void;
  onSubmit: () => void;
  isEditing: boolean;
};

const STATUTS = ["À faire", "Envoyé", "Entretien", "Refusé", "Accepté"];

export default function CandidateForm({ form, onChange, onSubmit, isEditing }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="titre" placeholder="Titre" value={form.titre} onChange={onChange} className="p-2 border rounded" />
        <input name="entreprise" placeholder="Entreprise" value={form.entreprise} onChange={onChange} className="p-2 border rounded" />
        <input name="poste" placeholder="Poste" value={form.poste} onChange={onChange} className="p-2 border rounded" />
        <select name="statut" value={form.statut} onChange={onChange} className="p-2 border rounded">
          {STATUTS.map(s => <option key={s}>{s}</option>)}
        </select>
        <input name="date" type="date" value={form.date} onChange={onChange} className="p-2 border rounded" />
        <input name="contact" placeholder="Contact" value={form.contact} onChange={onChange} className="p-2 border rounded" />
        <textarea name="commentaires" placeholder="Commentaires" value={form.commentaires} onChange={onChange} className="p-2 border rounded col-span-2" />
      </div>

      <div className="col-span-2 space-y-2">
        <label className="font-medium text-sm">📎 Documents</label>
        {form.documents.map((doc: { titre: string; lien: string }, index: number) => (

          <div key={index} className="flex flex-col md:flex-row gap-2 items-start md:items-center">
            <input
              type="text"
              placeholder="Titre"
              value={doc.titre}
              onChange={(e) => {
                const newDocs = [...form.documents];
                newDocs[index].titre = e.target.value;
                onChange({ target: { name: "documents", value: newDocs } } as any);
              }}
              className="flex-1 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Lien ou chemin"
              value={doc.lien}
              onChange={(e) => {
                const newDocs = [...form.documents];
                newDocs[index].lien = e.target.value;
                onChange({ target: { name: "documents", value: newDocs } } as any);
              }}
              className="flex-1 p-2 border rounded"
            />
	    <input
  type="file"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) {
      const newDocs = [...form.documents];
      newDocs[index].lien = file.name;
      onChange({ target: { name: "documents", value: newDocs } } as any);
    }
  }}
  className="text-sm"
/>

            <button
              type="button"
              onClick={() => {
                const newDocs = [...form.documents];
                newDocs.splice(index, 1);
                onChange({ target: { name: "documents", value: newDocs } } as any);
              }}
              className="text-red-600 hover:text-red-800"
            >
              🗑️
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            onChange({ target: { name: "documents", value: [...form.documents, { titre: "", lien: "" }] } } as any);
          }}
          className="mt-1 px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
        >
          ➕ Ajouter un document
        </button>
      </div>

      <button onClick={onSubmit} className={`px-4 py-2 text-white rounded ${isEditing ? "bg-yellow-600 hover:bg-yellow-700" : "bg-blue-600 hover:bg-blue-700"}`}>
        {isEditing ? "💾 Mettre à jour" : "➕ Ajouter"}
      </button>
    </div>
  );
}

