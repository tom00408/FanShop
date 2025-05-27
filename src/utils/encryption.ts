import CryptoJS from 'crypto-js';

// Der Verschlüsselungsschlüssel wird aus den Umgebungsvariablen gelesen
// In der Entwicklung: Erstellen Sie eine .env-Datei im Root-Verzeichnis mit:
// VITE_ENCRYPTION_KEY=IhrGeheimerSchluessel
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'fallback-key-not-secure';

if (!import.meta.env.VITE_ENCRYPTION_KEY) {
  console.warn('WARNUNG: Kein Verschlüsselungsschlüssel in den Umgebungsvariablen gefunden. Verwende unsicheren Fallback-Schlüssel.');
}

// Typen für die Verschlüsselung
type SensitiveData = string | number | boolean | object;
type OrderData = {
  name: string;
  address: string;
  email: string;
  team: string;
  status: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    size: string | null;
  }>;
  total: number;
  createdAt: Date;
};

export const encryptData = (data: SensitiveData): string => {
  const jsonString = JSON.stringify(data);
  return CryptoJS.AES.encrypt(jsonString, ENCRYPTION_KEY).toString();
};

export const decryptData = (encryptedData: string): SensitiveData => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
  const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedString);
};

// Funktion zum Verschlüsseln sensibler Daten in einem Objekt
export const encryptSensitiveData = (data: OrderData): OrderData => {
  const sensitiveFields = ['name', 'address', 'email', 'team'] as const;
  const encryptedData = { ...data };

  sensitiveFields.forEach(field => {
    if (data[field]) {
      encryptedData[field] = encryptData(data[field]);
    }
  });

  return encryptedData;
}; 