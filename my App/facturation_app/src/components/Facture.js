import React from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

const Facture = ({ factures = [], onEdit, onDelete }) => {
  
  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cette facture ?");
    if (confirmDelete) {
      onDelete(id);
    }
  };

  return (
    <div className="mt-4">
      <h6 style={{ color: "#1e3a8a" }}>Liste des Factures</h6>
      {factures.length > 0 ? (
        factures.map((facture) => (
          <div
            key={facture.id}
            className="card mb-3 shadow-sm"
            style={{ border: "1px solid #e0e0e0", borderRadius: "8px" }}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="mb-0">
                    <strong>Numéro Facture :</strong> {facture.invoice_number || "N/A"}
                  </p>
                  <p className="mb-0">
                    <strong>Montant :</strong> {facture.amount ? `${facture.amount} €` : "Non défini"}
                  </p>
                  <p className="mb-0">
                    <strong>Date :</strong> {facture.date ? new Date(facture.date).toLocaleDateString() : "Non définie"}
                  </p>
                  <p className="mb-0">
                    <strong>Description :</strong> {facture.description || "Aucune description"}
                  </p>
                </div>
                <div>
                  <button
                    className="btn btn-outline-primary me-2"
                    onClick={() => onEdit(facture.id)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn btn-outline-danger me-2"
                    onClick={() => handleDelete(facture.id)}
                  >
                    <FaTrash />
                  </button>
                  {facture.facture && (
                    <button
                      className="btn btn-outline-info"
                      onClick={() => window.open(`http://localhost:5000/uploads/${facture.facture}`, '_blank')}
                    >
                      <FaEye />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>Aucune facture trouvée.</p>
      )}
    </div>
  );
};

export default Facture;
