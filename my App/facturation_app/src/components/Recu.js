import React from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

const Recu = ({ recus, onEdit, onDelete }) => {
  return (
    <div className="mt-4">
      <h6 style={{ color: "#1e3a8a" }}>Liste des Reçus</h6>
      {recus.length > 0 ? (
        recus.map((recu) => (
          <div
            key={recu.numero_recu}
            className="card mb-3 shadow-sm"
            style={{ border: "1px solid #e0e0e0", borderRadius: "8px" }}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="mb-0">
                    <strong>Numéro Reçu :</strong> {recu.numero_recu}
                  </p>
                  <p className="mb-0">
                    <strong>Montant :</strong> {recu.montant} €
                  </p>
                  <p className="mb-0">
                    <strong>Date :</strong> {new Date(recu.date).toLocaleDateString()}
                  </p>
                  <p className="mb-0">
                    <strong>Description :</strong> {recu.description}
                  </p>
                </div>
                <div>
                  <button
                    className="btn btn-outline-primary me-2"
                    onClick={() => onEdit(recu.numero_recu)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn btn-outline-danger me-2"
                    onClick={() => onDelete(recu.numero_recu)}
                  >
                    <FaTrash />
                  </button>
                  {recu.recu_copier && (
                    <button
                      className="btn btn-outline-info"
                      onClick={() => window.open(`http://localhost:5000/uploads/${recu.recu_copier}`, '_blank')}
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
        <p>Aucun reçu trouvé.</p>
      )}
    </div>
  );
};

export default Recu;