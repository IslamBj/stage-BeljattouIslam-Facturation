import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const RecuForm = ({ code_s, recu, onClose, onSuccess }) => {
  const [numeroRecu, setNumeroRecu] = useState("");
  const [montant, setMontant] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [recuCopier, setRecuCopier] = useState(null);
  const [messageSucces, setMessageSucces] = useState("");
  const [messageErreur, setMessageErreur] = useState("");

  useEffect(() => {
    if (recu) {
      setNumeroRecu(recu.numero_recu);
      setMontant(recu.montant);
      setDate(recu.date.split('T')[0]);
      setDescription(recu.description);
    }
  }, [recu]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!code_s || !numeroRecu || !montant || !date) {
      setMessageErreur("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const formData = new FormData();
    formData.append("code_societe", code_s);
    formData.append("numero_recu", numeroRecu);
    formData.append("amount", montant);
    formData.append("date", date);
    formData.append("description", description);
    if (recuCopier) {
      formData.append("recuCopier", recuCopier);
    }

    try {
      const url = recu ? `http://localhost:5000/api/recus/${recu.numero_recu}` : "http://localhost:5000/api/recus";
      const method = recu ? "put" : "post";

      await axios[method](url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessageSucces(recu ? "Reçu modifié avec succès !" : "Reçu ajouté avec succès !");
      onSuccess();
    } catch (error) {
      console.error("Erreur lors de l'ajout/modification du reçu :", error);
      setMessageErreur("Échec de l'ajout/modification du reçu.");
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow border-primary">
        <div className="card-header bg-primary text-white">
          <h4 className="card-title">{recu ? "Modifier un Reçu" : "Ajouter un Reçu"}</h4>
          <button className="btn btn-sm btn-light" onClick={onClose}>
            <FaTimes /> Fermer
          </button>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {messageSucces && <div className="alert alert-success">{messageSucces}</div>}
            {messageErreur && <div className="alert alert-danger">{messageErreur}</div>}

            <div className="mb-3">
              <label className="form-label">Numéro de Reçu</label>
              <input
                type="text"
                value={numeroRecu}
                onChange={(e) => setNumeroRecu(e.target.value)}
                className="form-control"
                placeholder="Entrez le numéro de reçu"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Montant</label>
              <input
                type="number"
                value={montant}
                onChange={(e) => setMontant(e.target.value)}
                className="form-control"
                placeholder="Entrez le montant"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-control"
                placeholder="Description optionnelle"
              ></textarea>
            </div>

            <div className="mb-3">
              <label className="form-label">Copie du Reçu (Image)</label>
              <input
                type="file"
                onChange={(e) => setRecuCopier(e.target.files[0])}
                className="form-control"
                accept="image/*"
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              {recu ? "Modifier le Reçu" : "Ajouter le Reçu"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RecuForm;