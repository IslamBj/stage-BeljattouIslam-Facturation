import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

function SocieteEditForm({ society, onUpdateSociety, onClose }) {
  if (typeof onUpdateSociety !== "function") {
    console.error("❌ ERREUR: onUpdateSociety n'est pas une fonction !")  ;}
  const [formData, setFormData] = useState({
    code_s: "",
    directorName: "",
    directorLastName: "",
    email: "",
    adresse: "",
    tel: "",
    MF: "",
    dateAjout: "",
    name: "",
    domain: "",
    image: null, // Contiendra le fichier sélectionné
    oldImage: "", // Stocke l'image actuelle
  });

  const [messageSucces, setMessageSucces] = useState("");
  const [messageErreur, setMessageErreur] = useState("");

  useEffect(() => {
    if (society) {
      setFormData({
        code_s: society.code_s,
        directorName: society.directorName,
        directorLastName: society.directorLastName,
        email: society.email,
        adresse: society.adresse,
        tel: society.tel,
        MF: society.MF,
        dateAjout: society.dateAjout,
        name: society.name,
        domain: society.domain,
        image: null, // Réinitialisé à null pour éviter l'erreur dans input file
        oldImage: society.image, // Stocke l'image actuelle
      });
    }
  }, [society]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleUpdateSociety = async (e) => {
    e.preventDefault();
    const formDataWithFile = new FormData();

    // Ajouter tous les champs sauf l'image
    Object.keys(formData).forEach((key) => {
      if (key !== "image" && key !== "oldImage") {
        formDataWithFile.append(key, formData[key]);
      }
    });

    // Vérifier si une nouvelle image a été sélectionnée
    if (formData.image) {
      formDataWithFile.append("image", formData.image);
    } else {
      formDataWithFile.append("image", formData.oldImage); // Conserver l'ancienne image
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/societies/${formData.code_s}`,
        formDataWithFile,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setMessageSucces("Société mise à jour avec succès!");
    
      // Vérifier que onUpdateSociety existe avant de l'appeler
      if (typeof onUpdateSociety === "function") {
        onUpdateSociety(response.data);
      } else {
        console.warn("⚠️ onUpdateSociety n'est pas défini !");
      }
    } catch (error) {
      setMessageErreur("Erreur lors de la mise à jour de la société");
      console.error(error);
    }
    
  };

  return (
    <div className="container mt-4">
      <div className="card shadow border-primary">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h4 className="card-title">Modifier la société</h4>
          <button className="btn btn-sm btn-light" onClick={onClose}>
            <FaTimes /> Fermer
          </button>
        </div>
        <div className="card-body" style={{ maxHeight: "550px", overflowY: "auto" }}>
          {messageSucces && <div className="alert alert-success">{messageSucces}</div>}
          {messageErreur && <div className="alert alert-danger">{messageErreur}</div>}
          <form onSubmit={handleUpdateSociety}>
            <div className="mb-3">
              <label className="form-label">Nom de la société</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Code</label>
              <input type="text" name="code_s" className="form-control" value={formData.code_s} disabled />
            </div>

            <div className="mb-3">
              <label className="form-label">Prénom du Directeur</label>
              <input
                type="text"
                name="directorName"
                className="form-control"
                value={formData.directorName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Nom du Directeur</label>
              <input
                type="text"
                name="directorLastName"
                className="form-control"
                value={formData.directorLastName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Adresse</label>
              <input
                type="text"
                name="adresse"
                className="form-control"
                value={formData.adresse}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Téléphone</label>
              <input
                type="text"
                name="tel"
                className="form-control"
                value={formData.tel}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">MF</label>
              <input
                type="text"
                name="MF"
                className="form-control"
                value={formData.MF}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Domaine</label>
              <input
                type="text"
                name="domain"
                className="form-control"
                value={formData.domain}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Image actuelle</label>
              <div>
                {formData.oldImage && (
                  <img src={formData.oldImage} alt="Aperçu" className="img-thumbnail" width="150" />
                )}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Nouvelle image (facultatif)</label>
              <input type="file" name="image" className="form-control" onChange={handleFileChange} />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Mettre à jour la société
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SocieteEditForm;
