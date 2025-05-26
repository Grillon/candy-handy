export enum ApplicationStatus {
  TODO = "À faire",
  SENT = "Envoyé",
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
  comments: string;
  documents: Document[];
}