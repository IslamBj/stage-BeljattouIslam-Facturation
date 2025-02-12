import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function AjouterSocieteForm({ onAddSociety }) {
  const [formData, setFormData] = useState({
    code_s: "",
    directorName: "",
    directorLastName: "",
    email: "",
    adresse: "",
    tel: "",
    MF: "",
    dateAjout: new Date().toISOString().slice(0, 10), // Default: today
    name: "",
    domain: "",
    montant: "",
    image: null,
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleAddSociety = async (e) => {
    e.preventDefault();

    const formDataWithFile = new FormData();

    // Append all fields except the image
    Object.keys(formData).forEach((key) => {
      if (key !== "image") {
        formDataWithFile.append(key, formData[key]);
      }
    });

    // Append the image file if it exists
    if (formData.image) {
      formDataWithFile.append("image", formData.image);
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/societies",
        formDataWithFile,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Call the parent callback with the new society
      onAddSociety(response.data);

      // Reset the form
      setFormData({
        code_s: "",
        directorName: "",
        directorLastName: "",
        email: "",
        adresse: "",
        tel: "",
        MF: "",
        dateAjout: new Date().toISOString().slice(0, 10),
        name: "",
        domain: "",
        montant: "0",
        image: null,
      });

      setErrorMessage(""); // Clear any previous error messages
      alert("Société ajoutée avec succès !");
    } catch (error) {
      console.error("Erreur :", error);
      setErrorMessage(
        error.response?.data?.error || "Échec de l'ajout de la société. Veuillez réessayer."
      );
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow border-primary">
        <div className="card-header bg-primary text-white">
          <h4 className="card-title">Ajouter une nouvelle société</h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleAddSociety}>
          <div className="mb-3">
              <label className="form-label">Nom de la société</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                placeholder="Entrez le nom de la société"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Code</label>
              <input
                type="text"
                name="code_s"
                className="form-control"
                value={formData.code_s}
                onChange={handleChange}
                placeholder="Entrez le code de la société"
                required
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Prénom du Directeur</label>
                <input
                  type="text"
                  name="directorName"
                  className="form-control"
                  value={formData.directorName}
                  onChange={handleChange}
                  placeholder="Entrez le prénom du directeur"
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Nom du Directeur</label>
                <input
                  type="text"
                  name="directorLastName"
                  className="form-control"
                  value={formData.directorLastName}
                  onChange={handleChange}
                  placeholder="Entrez le nom du directeur"
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                placeholder="Entrez l'adresse email"
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
                placeholder="Entrez l'adresse"
                required
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Téléphone</label>
                <input
                  type="text"
                  name="tel"
                  className="form-control"
                  value={formData.tel}
                  onChange={handleChange}
                  placeholder="Entrez le numéro de téléphone"
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">MF</label>
                <input
                  type="text"
                  name="MF"
                  className="form-control"
                  value={formData.MF}
                  onChange={handleChange}
                  placeholder="Entrez le MF"
                  required
                />
              </div>
            </div>

            

            <div className="row">
              <div className=" mb-3">
                <label className="form-label">Domaine</label>
                <input
                  type="text"
                  name="domain"
                  className="form-control"
                  value={formData.domain}
                  onChange={handleChange}
                  placeholder="Entrez le domaine"
                  required
                />
              </div>
              
            </div>

            <div className="mb-3">
              <label className="form-label">Télécharger une image</label>
              <input
                type="file"
                name="image"
                className="form-control"
                onChange={handleFileChange}
              />
            </div>

            {errorMessage && (
              <div className="alert alert-danger" role="alert">
                {errorMessage}
              </div>
            )}

            <button type="submit" className="btn btn-primary w-100">
              Ajouter la société
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AjouterSocieteForm;