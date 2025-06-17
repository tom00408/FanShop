import Client from 'ssh2-sftp-client';
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Lade .env Datei
dotenv.config();

// Überprüfe ob alle benötigten Umgebungsvariablen vorhanden sind
const requiredEnvVars = ['SFTP_USER', 'SFTP_PASSWORD', 'SFTP_HOST'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('Fehlende Umgebungsvariablen:', missingEnvVars.join(', '));
  console.error('Bitte erstellen Sie eine .env Datei mit den folgenden Variablen:');
  console.error('SFTP_USER=dein_sftp_benutzer');
  console.error('SFTP_PASSWORD=dein_sftp_passwort');
  console.error('SFTP_HOST=deine_sftp_domain');
  console.error('SFTP_REMOTE_ROOT=/public_html (optional)');
  process.exit(1);
}

const sftp = new Client();

const config = {
  host: process.env.SFTP_HOST,
  port: 22,
  username: process.env.SFTP_USER,
  password: process.env.SFTP_PASSWORD,
  readyTimeout: 10000,
  retries: 3,
  retry_factor: 2,
  retry_minTimeout: 2000
};

console.log("Starte Deployment...");
console.log(`Verbinde mit ${process.env.SFTP_HOST} als ${process.env.SFTP_USER}`);

async function deploy() {
  try {
    await sftp.connect(config);
    console.log('Verbindung hergestellt, starte Upload...');

    const localPath = process.cwd() + "/dist";
    const remotePath = process.env.SFTP_REMOTE_ROOT || "/";

    // Lösche alte Dateien
    console.log('Lösche alte Dateien...');
    await sftp.rmdir(remotePath, true);
    await sftp.mkdir(remotePath, true);

    // Upload neue Dateien
    console.log('Lade neue Dateien hoch...');
    await sftp.uploadDir(localPath, remotePath);

    console.log('Deployment erfolgreich abgeschlossen!');
  } catch (err) {
    console.error('Deployment fehlgeschlagen:', err);
    process.exit(1);
  } finally {
    sftp.end();
  }
}

deploy(); 