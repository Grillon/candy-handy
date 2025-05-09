'use client';

type Props = {
	data: {
		id: string;
		titre: string;
		entreprise: string;
		poste: string;
		statut: string;
		date: string;
		contact: string;
		documents: string[];
		commentaires: string;
	};
	onEdit: () => void;
	onDelete: () => void;

};

export default function CandidateCard({ data, onEdit, onDelete }: Props) {
	return (
		<div className="p-4 border rounded shadow">
		<h2 className="text-xl font-semibold">{data.titre} – {data.entreprise}</h2>
		<p><strong>Poste :</strong> {data.poste}</p>
		<p><strong>Statut :</strong> {data.statut}</p>
		<p><strong>Date :</strong> {data.date}</p>
		<p><strong>Contact :</strong> {data.contact}</p>
		<p><strong>Documents :</strong> {data.documents.join(", ")}</p>
		<p><strong>Commentaires :</strong> {data.commentaires}</p>

		<button
		onClick={onEdit}
		className="mt-2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
		>
		✏️ Modifier
		</button>
		<button
		onClick={onDelete}
		className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
		>
		🗑️ Supprimer
		</button>
		</div>
	);
}

