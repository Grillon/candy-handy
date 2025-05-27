export enum ApplicationStatus {
  TODO = "À faire",
  RECEIVED = "Reçu",
  SENT = "Envoyé",
  POSITIONED = "Positioné",
  INTERVIEW = "Entretien",
  ACCEPTED = "Accepté",
  REJECTED = "Refusé"
}

export interface Document {
  title: string;
  link: string;
}

export interface Application {
  id: string;
  title: string;
  company: string;
  position: string;
  date: string;
  status: ApplicationStatus;
  contact: string;
  comments: {
  date: string;
  content: string;
}[];
  documents: Document[];
}
