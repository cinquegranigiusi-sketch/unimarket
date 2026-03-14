import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function Chat() {

  const { annuncioId, venditoreId } = useParams();

  const utente = JSON.parse(localStorage.getItem("utente"));

  const [messaggi, setMessaggi] = useState([]);
  const [testo, setTesto] = useState("");

  if (!utente) {
    return <div style={{ padding: "40px" }}>Devi fare il login per usare la chat</div>;
  }

  useEffect(() => {

    const caricaMessaggi = () => {

      axios
        .get(`https://unimarket-1-n0al.onrender.com/messaggi/${annuncioId}/${utente.id}/${venditoreId}`)
        .then(res => setMessaggi(res.data))
        .catch(err => console.log(err));

    };

    caricaMessaggi();

    const interval = setInterval(caricaMessaggi, 2000); // aggiorna ogni 2 secondi

    return () => clearInterval(interval);

  }, [annuncioId, venditoreId, utente.id]);



  const inviaMessaggio = async () => {

    if (!testo.trim()) return;

    try {

      await axios.post("https://unimarket-1n0al.onrender.com/messaggi", {
        mittente_id: utente.id,
        destinatario_id: venditoreId,
        annuncio_id: annuncioId,
        messaggio: testo
      });

      setMessaggi([
        ...messaggi,
        {
          mittente_id: utente.id,
          messaggio: testo
        }
      ]);

      setTesto("");

    } catch (err) {
      console.log(err);
    }

  };



  return (

    <div style={{ maxWidth: "700px", margin: "auto", padding: "40px" }}>

      <h2>Chat con venditore</h2>

      <div
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          height: "300px",
          overflowY: "scroll",
          marginBottom: "20px"
        }}
      >

        {messaggi.map((m, i) => (

          <div
            key={i}
            style={{
              textAlign: m.mittente_id === utente.id ? "right" : "left",
              marginBottom: "10px"
            }}
          >
            {m.messaggio}
          </div>

        ))}

      </div>

      <input
        value={testo}
        onChange={(e) => setTesto(e.target.value)}
        placeholder="Scrivi un messaggio..."
        style={{ width: "80%", padding: "10px" }}
      />

      <button
        onClick={inviaMessaggio}
        style={{
          padding: "10px",
          marginLeft: "10px"
        }}
      >
        Invia
      </button>

    </div>

  );
}

export default Chat;