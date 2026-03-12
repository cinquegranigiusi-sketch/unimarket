import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Home() {
  const [annunci, setAnnunci] = useState([]);
  const [preferiti, setPreferiti] = useState([]);
  const [filtroCitta, setFiltroCitta] = useState("");
  const [filtroUniversita, setFiltroUniversita] = useState("");

  const utente = JSON.parse(localStorage.getItem("utente"));

  // Recupera la query di ricerca dalla navbar
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchQuery = params.get("q") || "";

  // Carica tutti gli annunci
  useEffect(() => {
    fetch("https://unimarket-itwd.onrender.com/annunci")
      .then(res => res.json())
      .then(data => setAnnunci(data))
      .catch(err => console.log(err));
  }, []);

  // Carica preferiti dell'utente
  useEffect(() => {
    if (!utente) return;
    fetch(`https://unimarket-itwd.onrender.com/preferiti/${utente.id}`)
      .then(res => res.json())
      .then(data => setPreferiti(data))
      .catch(err => console.log(err));
  }, [utente]);

  // Funzione per aggiungere/rimuovere dai preferiti
  const togglePreferito = (annuncioId) => {
    if (!utente) return alert("Devi fare il login!");
    const isPreferito = preferiti.includes(annuncioId);

    if (isPreferito) {
      fetch("https://unimarket-itwd.onrender.com/preferiti", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ utente_id: utente.id, annuncio_id: annuncioId })
      }).then(() => setPreferiti(prev => prev.filter(id => id !== annuncioId)));
    } else {
      fetch("https://unimarket-itwd.onrender.com/preferiti", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ utente_id: utente.id, annuncio_id: annuncioId })
      }).then(() => setPreferiti(prev => [...prev, annuncioId]));
    }
  };

  // Filtra annunci combinando ricerca globale + filtri avanzati
  const annunciFiltrati = annunci.filter((annuncio) => {
    // Tutti i campi da cercare
    const campi = [
      annuncio.titolo || "",
      annuncio.descrizione || "",
      annuncio.categoria || "",
      annuncio.citta || "",
      annuncio.universita || ""
    ].map(c => c.toLowerCase());

    // Parole della query di ricerca separate
    const queryParole = searchQuery.toLowerCase().trim().split(" ").filter(p => p !== "");

    // Ogni parola della query deve comparire in almeno un campo
    const matchRicerca = queryParole.every(parola =>
      campi.some(campo => campo.includes(parola))
    );

    // Filtri avanzati (Città e Università)
    const matchCitta = filtroCitta
      ? (annuncio.citta || "").toLowerCase().includes(filtroCitta.toLowerCase())
      : true;
    const matchUniversita = filtroUniversita
      ? (annuncio.universita || "").toLowerCase().includes(filtroUniversita.toLowerCase())
      : true;

    return matchRicerca && matchCitta && matchUniversita;
  });

  return (
    <div style={{ backgroundColor: "#cfdee2", minHeight: "100vh", padding: "40px 20px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ marginBottom: "10px" }}>
           Trova quello che cerchi 🎓
        </h1>

        <p style={{ color: "#5153d1", marginBottom: "30px" }}>
           Il marketplace per studenti universitari
        </p>

        {/* FILTRI AVANZATI */}
        <div style={{ marginBottom: "30px", display: "flex", gap: "15px", flexWrap: "wrap" }}>
          <input
            placeholder="Città"
            value={filtroCitta}
            onChange={(e) => setFiltroCitta(e.target.value)}
            style={{ padding: "8px", flex: "1", minWidth: "150px" }}
          />
          <input
            placeholder="Università"
            value={filtroUniversita}
            onChange={(e) => setFiltroUniversita(e.target.value)}
            style={{ padding: "8px", flex: "1", minWidth: "150px" }}
          />
        </div>

        <p style={{ marginBottom: "20px", color: "#666" }}>
          {annunciFiltrati.length} annunci trovati
        </p>

        {annunciFiltrati.length === 0 && (
          <p style={{ fontSize: "18px", color: "#555" }}>
             Nessun annuncio trovato 😕
          </p>
        )}

        {/* GRIGLIA ANNUNCI */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "25px"
        }}>
          {annunciFiltrati.map((annuncio) => {
            const isFav = preferiti.includes(annuncio.id);
            return (
              <Link
                to={`/annuncio/${annuncio.id}`}
                key={annuncio.id}
                style={{ textDecoration: "none", color: "black" }}
              >
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 2px 6px rgba(14, 13, 13, 0.4)",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    position: "relative"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)";
                  }}
                >
                  {/* CUORE PREFERITI */}
                  <div
                    onClick={(e) => { e.preventDefault(); togglePreferito(annuncio.id); }}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      fontSize: "24px",
                      color: isFav ? "red" : "white",
                      cursor: "pointer",
                      textShadow: "0 0 5px black",
                      zIndex: 5
                    }}
                  >
                    {isFav ? "♥" : "♡"}
                  </div>

                  {annuncio.immagine && (
                    <img
                      src={`https://unimarket-itwd.onrender.com/uploads/${annuncio.immagine}`}
                      alt={annuncio.titolo}
                      style={{ width: "100%", height: "180px", objectFit: "cover" }}
                    />
                  )}

                  <div style={{ padding: "15px", display: "flex", flexDirection: "column", flex: 1 }}>
                    <h3 style={{ margin: "0 0 8px 0", fontSize: "18px" }}>{annuncio.titolo}</h3>
                    <p style={{ fontWeight: "bold", fontSize: "20px", color: "#181717", margin: "0 0 10px 0" }}>
                      {annuncio.prezzo}€
                    </p>
                    <p style={{ color: "#555", margin: "0 0 5px 0", fontSize: "14px" }}>{annuncio.citta}</p>
                    <p style={{ color: "#181717", margin: "0", fontSize: "12px" }}>{annuncio.universita}</p>
                  </div>
                </div>

          <div style={{
            marginTop: "60px",
            padding: "20px",
            textAlign: "center",
            color: "#555",
            borderTop: "1px solid #ccc"
          }}>
            © 2026 UniMarket — Marketplace per studenti universitari
          </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Home;