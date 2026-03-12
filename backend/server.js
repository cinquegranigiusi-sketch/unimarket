const express = require("express");
const cors = require("cors");
const multer = require("multer");
const db = require("./db");
const http = require("http");
const { Server } = require("socket.io");
const bcrypt = require("bcrypt");

const app = express();
const server = http.createServer(app);

// --- CONFIGURAZIONE SOCKET.IO ---
const io = new Server(server, {
  cors: { origin: "http://localhost:5173" }, // frontend React
});

io.on("connection", (socket) => {
  console.log("Nuovo utente connesso:", socket.id);

  socket.on("registerUser", (userId) => {
    socket.join(userId);
  });

  socket.on("sendMessage", (data) => {
    const { mittente_id, destinatario_id, annuncio_id, messaggio } = data;
    io.to(destinatario_id).emit("newMessage", { mittente_id, destinatario_id, annuncio_id, messaggio });
  });

  socket.on("disconnect", () => {
    console.log("Utente disconnesso:", socket.id);
  });
});

// --- MIDDLEWARE ---
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// --- UPLOAD IMMAGINI ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// --- SERVIRE IMMAGINI ---
app.use("/uploads", express.static("uploads"));

// --- ROUTE DI TEST ---
app.get("/", (req, res) => res.send("UniMarket server attivo"));

// --- ANNUNCI ---
app.get("/annunci", (req, res) => {
  db.query("SELECT * FROM listings", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

app.post("/annunci", upload.single("immagine"), (req, res) => {
  const { titolo, descrizione, prezzo, categoria, universita, citta } = req.body;
  const utente_id = 1; // ID utente loggato
  const immagine = req.file ? req.file.filename : null;

  const sql = `
    INSERT INTO listings 
    (titolo, descrizione, prezzo, categoria, universita, citta, utente_id, immagine)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [titolo, descrizione, prezzo, categoria, universita, citta, utente_id, immagine], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "Annuncio creato!" });
  });
});

app.put("/annunci/:id", upload.single("immagine"), (req, res) => {
  const annuncioId = req.params.id;
  const { titolo, descrizione, prezzo, categoria, universita, citta } = req.body;
  const immagine = req.file ? req.file.filename : null;

  const sql = immagine
    ? `UPDATE listings SET titolo=?, descrizione=?, prezzo=?, categoria=?, universita=?, citta=?, immagine=? WHERE id=?`
    : `UPDATE listings SET titolo=?, descrizione=?, prezzo=?, categoria=?, universita=?, citta=? WHERE id=?`;

  const params = immagine
    ? [titolo, descrizione, prezzo, categoria, universita, citta, immagine, annuncioId]
    : [titolo, descrizione, prezzo, categoria, universita, citta, annuncioId];

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "Annuncio aggiornato!" });
  });
});

app.delete("/annunci/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM listings WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "Annuncio eliminato" });
  });
});

// --- UTENTI ---
app.post("/registrati", async (req, res) => {
  const { nome, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO utenti (nome, email, password) VALUES (?, ?, ?)";
    db.query(sql, [nome, email, hashedPassword], (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") return res.status(400).json({ message: "Email già registrata" });
        return res.status(500).json(err);
      }
      res.json({ message: "Utente registrato con successo!" });
    });
  } catch (error) {
    res.status(500).json({ message: "Errore durante la registrazione" });
  }
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM utenti WHERE email = ?";
  db.query(sql, [email], async (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length === 0) return res.status(401).json({ message: "Email non trovata" });

    const user = result[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Password errata" });

    res.json(user);
  });
});

// --- MESSAGGI ---
app.post("/messaggi", (req, res) => {
  const { mittente_id, destinatario_id, annuncio_id, messaggio } = req.body;
  const sql = "INSERT INTO messaggi (mittente_id, destinatario_id, annuncio_id, messaggio) VALUES (?, ?, ?, ?)";
  db.query(sql, [mittente_id, destinatario_id, annuncio_id, messaggio], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "Messaggio inviato" });
    io.to(destinatario_id).emit("newMessage", { mittente_id, destinatario_id, annuncio_id, messaggio });
  });
});

app.get("/messaggi/:annuncioId/:utente1/:utente2", (req, res) => {
  const { annuncioId, utente1, utente2 } = req.params;
  const sql = `
    SELECT * FROM messaggi
    WHERE annuncio_id = ?
    AND ((mittente_id = ? AND destinatario_id = ?) OR (mittente_id = ? AND destinatario_id = ?))
    ORDER BY creato_il ASC
  `;
  db.query(sql, [annuncioId, utente1, utente2, utente2, utente1], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

// --- PREFERITI ---
app.post("/preferiti", (req, res) => {
  const { utente_id, annuncio_id } = req.body;
  const sql = "INSERT IGNORE INTO preferiti (utente_id, annuncio_id) VALUES (?, ?)";
  db.query(sql, [utente_id, annuncio_id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "Annuncio aggiunto ai preferiti!" });
  });
});

app.delete("/preferiti", (req, res) => {
  const { utente_id, annuncio_id } = req.body;
  const sql = "DELETE FROM preferiti WHERE utente_id = ? AND annuncio_id = ?";
  db.query(sql, [utente_id, annuncio_id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "Annuncio rimosso dai preferiti!" });
  });
});

// Lista preferiti di un utente con tutti i dettagli degli annunci
app.get("/preferiti/:utente_id", (req, res) => {
  const utente_id = req.params.utente_id;
  const sql = `
    SELECT l.*
    FROM listings l
    JOIN preferiti p ON l.id = p.annuncio_id
    WHERE p.utente_id = ?
  `;
  db.query(sql, [utente_id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

const path = require('path');

// --- SERVE FRONTEND IN PRODUZIONE ---
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// --- AVVIO SERVER ---
const PORT = process.env.PORT || 3001; // usa la porta assegnata dal provider, altrimenti 3001 in locale
server.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT} con Socket.io`);
});