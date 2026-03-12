import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

function PubblicaAnnuncio() {

  const [titolo, setTitolo] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [prezzo, setPrezzo] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null); // anteprima

  // gestione file
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);

      // creiamo l’anteprima
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const pubblica = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("titolo", titolo);
    formData.append("descrizione", descrizione);
    formData.append("prezzo", prezzo);
    if (file) formData.append("immagine", file);

    try {
      await axios.post("http://localhost:3001/annunci", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Annuncio pubblicato!");

      // reset
      setTitolo("");
      setDescrizione("");
      setPrezzo("");
      setFile(null);
      setPreview(null);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={pubblica}>
      <h2>Pubblica Annuncio</h2>

      <input
        placeholder="Titolo oggetto"
        value={titolo}
        onChange={(e) => setTitolo(e.target.value)}
      />
      <br />

      <textarea
        placeholder="Descrizione"
        value={descrizione}
        onChange={(e) => setDescrizione(e.target.value)}
      />
      <br />

      <input
        placeholder="Prezzo"
        value={prezzo}
        onChange={(e) => setPrezzo(e.target.value)}
      />
      <br />

      <input type="file" onChange={handleFileChange} />
      <br />

      {/* Mostriamo l’anteprima */}
      {preview && (
        <div>
          <p>Anteprima immagine:</p>
          <img src={preview} alt="anteprima" style={{ width: "200px" }} />
        </div>
      )}

      <button type="submit">Pubblica</button>
    </form>
  );
}

export default PubblicaAnnuncio;
