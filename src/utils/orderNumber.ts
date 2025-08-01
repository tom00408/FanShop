import { db } from '../firebase';
import { doc, getDoc, setDoc, increment } from 'firebase/firestore';

// Funktion zum Generieren der nächsten Bestellnummer
export const generateOrderNumber = async (): Promise<string> => {
  try {
    // Referenz zum Counter-Dokument
    const counterRef = doc(db, 'counters', 'orderNumber');
    
    // Versuche das aktuelle Counter-Dokument zu lesen
    const counterDoc = await getDoc(counterRef);
    
    let currentNumber: number;
    
    if (counterDoc.exists()) {
      // Counter existiert bereits, erhöhe um 1
      currentNumber = counterDoc.data().currentNumber + 1;
    } else {
      // Counter existiert nicht, starte bei 1
      currentNumber = 1;
    }
    
    // Aktualisiere den Counter in Firestore
    await setDoc(counterRef, { currentNumber }, { merge: true });
    
    // Formatiere die Bestellnummer (z.B. "2024-0001")
    const year = new Date().getFullYear();
    const formattedNumber = currentNumber.toString().padStart(4, '0');
    
    return `${year}-${formattedNumber}`;
  } catch (error) {
    console.error('Fehler beim Generieren der Bestellnummer:', error);
    // Fallback: Zeitstempel-basierte Nummer
    const timestamp = Date.now();
    const year = new Date().getFullYear();
    return `${year}-${timestamp}`;
  }
};

// Alternative Funktion mit Atomic Increment (empfohlen für Produktionsumgebungen)
export const generateOrderNumberAtomic = async (): Promise<string> => {
  try {
    const counterRef = doc(db, 'counters', 'orderNumber');
    
    // Atomische Erhöhung des Counters
    await setDoc(counterRef, { currentNumber: increment(1) }, { merge: true });
    
    // Lese den neuen Wert
    const counterDoc = await getDoc(counterRef);
    const currentNumber = counterDoc.data()?.currentNumber || 1;
    
    // Formatiere die Bestellnummer
    const year = new Date().getFullYear();
    const formattedNumber = currentNumber.toString().padStart(4, '0');
    
    return `${year}-${formattedNumber}`;
  } catch (error) {
    console.error('Fehler beim Generieren der Bestellnummer:', error);
    // Fallback
    const timestamp = Date.now();
    const year = new Date().getFullYear();
    return `${year}-${timestamp}`;
  }
}; 