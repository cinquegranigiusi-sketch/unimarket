import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home";
import DettaglioAnnuncio from "./DettaglioAnnuncio";
import PubblicaAnnuncio from "./PubblicaAnnuncio";
import Login from "./login";
import Registrati from "./Registrati";
import MieiAnnunci from "./pages/MieiAnnunci";
import Chat from "./Chat";
import Messaggi from "./Messaggi";
import Preferiti from "./Preferiti";
import { useEffect } from "react";
import socket from "./socket";

function App() {

  useEffect(() => {
    const utente = JSON.parse(localStorage.getItem("utente"));

    if (utente) {
      socket.emit("registerUser", utente.id);
    }
  }, []);

  return (
    <BrowserRouter>
  <Navbar />
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/pubblica" element={<PubblicaAnnuncio />} />
    <Route path="/miei-annunci" element={<MieiAnnunci />} />
    <Route path="/preferiti" element={<Preferiti />} />
    <Route path="/login" element={<Login />} />
    <Route path="/registrati" element={<Registrati />} />
    <Route path="/annuncio/:id" element={<DettaglioAnnuncio />} />
    <Route path="/chat/:annuncioId/:venditoreId" element={<Chat />} />
    <Route path="/messaggi/:annuncioId/:venditoreId" element={<Messaggi />} />
  </Routes>
</BrowserRouter>
  );
}

export default App;