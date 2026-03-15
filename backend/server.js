const express = require("express");
const cors = require("cors");
const multer = require("multer");
const db = require("./db");
const http = require("http");
const { Server } = require("socket.io");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");

const app = express();
const server = http.createServer(app);

// crea la cartella uploads se non esiste
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- CARTELLA IMMAGINI ---
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- UPLOAD IMMAGINI ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// --- TEST SERVER ---
app.get("/test", (req, res) => {
  res.send("Server UniMarket attivo!");
});

// =========================
// ANNUNCI
// =========================

app.get("/annunci", (req, res) => {
  db.query("SELECT * FROM listings", (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    res.json(result);
  });
});

app.post("/annunci", upload.single("immagine"), (req, res) => {

  const { titolo, descrizione, prezzo, categoria, universita, citta } = req.body;
  const utente_id = 1;
  const immagine = req.file ? req.file.filename : null;

  const sql = `
  INSERT INTO listings
  (titolo, descrizione, prezzo, categoria, universita, citta, utente_id, immagine)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql,
    [titolo, descrizione, prezzo, categoria, universita, citta, utente_id, immagine],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Annuncio creato!" });
    }
  );
});

app.delete("/annunci/:id", (req, res) => {

  const id = req.params.id;

  db.query("DELETE FROM listings WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "Annuncio eliminato" });
  });

});

// =========================
// LOGIN
// =========================

app.post("/login", (req, res) => {

  const { email, password } = req.body;

  const sql = "SELECT * FROM utenti WHERE email = ?";

  db.query(sql, [email], async (err, result) => {

    if (err) return res.status(500).send(err);

    if (result.length === 0) {
      return res.status(401).json({ message: "Email non trovata" });
    }

    const user = result[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Password errata" });
    }

    res.json(user);

  });

});

// =========================
// SOCKET.IO CHAT
// =========================

const io = new Server(server, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {

  console.log("Utente connesso:", socket.id);

  socket.on("registerUser", (userId) => {
    socket.join(userId);
  });

  socket.on("sendMessage", (data) => {

    const { mittente_id, destinatario_id, annuncio_id, messaggio } = data;

    io.to(destinatario_id).emit("newMessage", {
      mittente_id,
      destinatario_id,
      annuncio_id,
      messaggio
    });

  });

  socket.on("disconnect", () => {
    console.log("Utente disconnesso:", socket.id);
  });

});

// =========================
// AVVIO SERVER
// =========================

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log("Server avviato sulla porta " + PORT);
});
