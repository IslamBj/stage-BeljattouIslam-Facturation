import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const FactureForm = ({ code_s, facture, onClose, onSuccess }) => {
  const [numeroFacture, setNumeroFacture] = useState("");
  const [montant, setMontant] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [fichier, setFichier] = useState(null);
  const [messageSucces, setMessageSucces] = useState("");
  const [messageErreur, setMessageErreur] = useState("");

  useEffect(() => {
    if (facture) {
      setNumeroFacture(facture.invoice_number);
      setMontant(facture.amount);
      setDate(facture.date.split('T')[0]);
      setDescription(facture.description);
    }
  }, [facture]);

  const handleFileChange = (e) => {
    setFichier(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!code_s || !numeroFacture || !montant || !date) {
      setMessageErreur("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const formData = new FormData();
    formData.append("code_societe", code_s);
    formData.append("invoiceNumber", numeroFacture);
    formData.append("amount", montant);
    formData.append("date", date);
    formData.append("description", description);
    if (fichier) {
      formData.append("facture", fichier);
    }

    try {
      const url = facture ? `http://localhost:5000/api/factures/${facture.id}` : "http://localhost:5000/api/factures";
      const method = facture ? "put" : "post";

      await axios[method](url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessageSucces(facture ? "Facture modifiée avec succès !" : "Facture ajoutée avec succès !");
      onSuccess();
    } catch (error) {
      console.error("Erreur lors de l'ajout/modification de la facture :", error);
      setMessageErreur("Échec de l'ajout/modification de la facture.");
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow border-primary">
        <div className="card-header bg-primary text-white">
          <h4 className="card-title">{facture ? "Modifier une Facture" : "Ajouter une Facture"}</h4>
          <button className="btn btn-sm btn-light" onClick={onClose}>
            <FaTimes /> Fermer
          </button>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {messageSucces && <div className="alert alert-success">{messageSucces}</div>}
            {messageErreur && <div className="alert alert-danger">{messageErreur}</div>}

            <div className="mb-3">
              <label className="form-label">Numéro de Facture</label>
              <input
                type="text"
                value={numeroFacture}
                onChange={(e) => setNumeroFacture(e.target.value)}
                className="form-control"
                placeholder="Entrez le numéro de facture"
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
              <label className="form-label">Copie de la Facture</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="form-control"
                accept="image/*,application/pdf"
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              {facture ? "Modifier la Facture" : "Ajouter la Facture"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FactureForm;