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
		documents: { titre: string; lien: string }[];
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
		<p><strong>Documents :</strong></p>
		<ul className="list-disc ml-5 space-y-1">
		{data.documents.map((doc, i) => {
			const isURL = doc.lien.startsWith("http://") || doc.lien.startsWith("https://");
			return (
				<li key={i} className="flex gap-2 items-start">
				<span>{isURL ? "🔗" : "📂"}</span>
				{isURL ? (
					<a href={doc.lien} target="_blank" rel="noopener noreferrer" className="underline text-blue-600 dark:text-blue-300 hover:text-blue-400">
					{doc.titre || doc.lien}
					</a>
				) : (
				<div>
				<span className="text-grey-300">{doc.titre}</span>
				{doc.lien && (
					<span className="ml-1 text-gray-300 text-sm">({doc.lien})</span>
				)}
				</div>
				)}
				</li>
			);
		})}
		</ul>

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

