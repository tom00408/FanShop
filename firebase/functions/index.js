import functions from 'firebase-functions';
import admin from 'firebase-admin';

admin.initializeApp();

const db = admin.firestore();



// Firestore-Trigger bei neuer Bestellung
export const rechnungsEmail = functions.firestore
  .document('bestellungen/{bestellungsId}')
  .onCreate(async (snapshot, context) => {
    const order = snapshot.data();

    if (!order?.email) {
      console.error("Keine gültige Bestellung oder E-Mail vorhanden");
      return;
    }

    // Log-Eintrag zur Kontrolle
    await db.collection("log").add({
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      info: `Neue Bestellung von ${order.email}`,
      bestellungsId: context.params.bestellungsId,
    });

    console.log(`E-Mail an ${order.email} vorbereitet.`);
  });
