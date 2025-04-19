// packages/shared/src/types/User.ts
export interface User {
  id: number | string;
  name: string;
  email: string;
  password?: string; // Passwort sollte optional sein und evtl. nie ans Frontend gesendet werden
  initials?: string; // Kann im Backend oder Frontend generiert werden
  picture?: string; // Optional
  phone?: string; // Optional
  isUser: boolean; // Unterscheidung Kontakt vs. anmeldbarer Benutzer
}