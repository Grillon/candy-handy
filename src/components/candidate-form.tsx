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
        <input name="documents" placeholder="Documents (séparés par virgules)" value={form.documents} onChange={onChange} className="p-2 border rounded col-span-2" />
        <textarea name="commentaires" placeholder="Commentaires" value={form.commentaires} onChange={onChange} className="p-2 border rounded col-span-2" />
      </div>
      <button onClick={onSubmit} className={`px-4 py-2 text-white rounded ${isEditing ? "bg-yellow-600 hover:bg-yellow-700" : "bg-blue-600 hover:bg-blue-700"}`}>
        {isEditing ? "💾 Mettre à jour" : "➕ Ajouter"}
      </button>
    </div>
  );
}

