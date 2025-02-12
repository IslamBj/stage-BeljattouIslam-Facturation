import React, { useState, useEffect } from "react";
import { FaBuilding, FaGlobe, FaInfoCircle, FaTrash, FaFileInvoiceDollar, FaReceipt, FaPrint, FaEye, FaTimes, FaEdit } from "react-icons/fa";
import axios from "axios";
import FactureForm from "./FactureForm";
import RecuForm from "./RecuForm";
import SocieteEditForm from "./SocieteEditForm";
import "bootstrap/dist/css/bootstrap.min.css";

const Company = ({ society, onDeleteSociety, onAddFacture, onAddRecu, onUpdateSociety }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [factures, setFactures] = useState([]);
  const [recus, setRecus] = useState([]);
  const [totals, setTotals] = useState({
    totalInvoices: 0,
    totalPayments: 0,
    remainingAmount: 0,
  });
  const [showFactureForm, setShowFactureForm] = useState(false);
  const [showRecuForm, setShowRecuForm] = useState(false);
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [selectedFacture, setSelectedFacture] = useState(null);
  const [selectedRecu, setSelectedRecu] = useState(null);

  useEffect(() => {
    fetchTotals();
  }, [society.code_s]);

  const fetchTotals = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/societies/${society.code_s}/totals`);
      setTotals(response.data);
    } catch (error) {
      console.error("Error fetching totals:", error);
    }
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
    if (!showDetails) {
      fetchInvoicesAndReceipts();
    }
  };

  const fetchInvoicesAndReceipts = async () => {
    try {
      const invoicesResponse = await axios.get(`http://localhost:5000/api/factures?society_code=${society.code_s}`);
      setFactures(invoicesResponse.data);

      const receiptsResponse = await axios.get(`http://localhost:5000/api/recus?code_societe=${society.code_s}`);
      setRecus(receiptsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDeleteSociety = async () => {
    if (window.confirm("Voulez-vous activer/désactiver cette société ?")) {
      try {
        const response = await axios.patch(`http://localhost:5000/api/societies/${society.code_s}`);
  
        // Check if the response contains the new valid value
        if (response.data.valid !== undefined) {
          onDeleteSociety(society.code_s); // Update UI
          fetchTotals(); // Update totals
  
          alert(`Société ${response.data.valid === 0 ? "désactivée" : "réactivée"} avec succès !`);
        } else {
          throw new Error("Réponse du serveur invalide");
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour :", error.response?.data || error.message);
        
      }
    }
  };
  
  
  

  const handleAddFacture = () => {
    setShowFactureForm(true);
  };

  const handleAddRecu = () => {
    setShowRecuForm(true);
  };

  const handleModifyCompany = () => {
    setShowCompanyForm(true);
  };

  const handleModifyFacture = (facture) => {
    setSelectedFacture(facture);
    setShowFactureForm(true);
  };

  const handleModifyRecu = (Recu) => {
    setSelectedRecu(Recu);
    setShowRecuForm(true);
  };
  const handleChangeImage = () => {
    setShowCompanyForm(false);
    setUpdateImageForm(true); 
  };
  

  const handleDeleteFacture = async (id) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        await axios.delete(`http://localhost:5000/api/factures/${id}`);
        fetchInvoicesAndReceipts();  // This should refetch the data after deletion
        alert("Invoice deleted successfully!");
      } catch (error) {
        console.error("Error deleting invoice:", error);
        alert("Failed to delete invoice. Please try again later.");
      }
    }
  };
  

  const handleDeleteRecu = async (id) => {
    if (window.confirm("Are you sure you want to delete this receipt?")) {
      try {
        await axios.patch(`http://localhost:5000/api/recus/${id}`);
        fetchInvoicesAndReceipts();
        alert("Receipt deleted successfully!");
      } catch (error) {
        console.error("Error deleting receipt:", error);
        alert("Failed to delete receipt. Please try again later.");
      }
    }
  };

  const handleViewCopie = (filePath) => {
    if (filePath) {
      window.open(`http://localhost:5000/uploads/${filePath}`, "_blank");
    } else {
      alert("No file available for this record.");
    }
  };

  const getBorderColor = () => {
    if (totals.remainingAmount > 0) return "red";
    if (totals.remainingAmount < 0) return "green";
    return "orange";
  };

  const getTextColor = (amount) => {
    if (amount > 0) return "red";
    if (amount < 0) return "green";
    return "orange";
  };

  return (
    <div>
      {(showFactureForm || showRecuForm || showCompanyForm) && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {showFactureForm && (
            <FactureForm
              code_s={society.code_s}
              facture={selectedFacture}
              onClose={() => {
                setShowFactureForm(false);
                setSelectedFacture(null);
              }}
              onSuccess={() => {
                fetchInvoicesAndReceipts();
                setShowFactureForm(false);
              }}
            />
          )}
          {showRecuForm && (
            <RecuForm
              code_s={society.code_s}
              recu={selectedRecu}
              onClose={() => {
                setShowRecuForm(false);
                setSelectedRecu(null);
              }}
              onSuccess={() => {
                fetchInvoicesAndReceipts();
                setShowRecuForm(false);
              }}
            />
          )}
          {showCompanyForm && (
            <SocieteEditForm
              society={society}
              onClose={() => setShowCompanyForm(false)}
              onSuccess={() => {
                onUpdateSociety();
                setShowCompanyForm(false);
              }}
            />
          )}
        </div>
      )}

      <div
        className="card mb-3 shadow-sm"
        style={{
          borderRadius: '15px',
          borderBottom: `5px solid ${getBorderColor()}`,
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
        onClick={toggleDetails}
      >
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              {society.image && (
                <img
                  src={society.image}
                  alt={`Logo de ${society.name}`}
                  className="me-3 "
                  style={{ width: "80px", height: "80px", objectFit: "cover" , borderRadius: "15px"}}
                />
              )}
              <div>
                <h5 className="card-title mb-0" style={{ color: "#1e3a8a" }}>
                  <FaBuilding className="me-2" /> {society.name}
                </h5>
                <p className="card-text text-muted mb-0">
                  <FaGlobe className="me-2" /> {society.domain}
                </p>
                <p className="card-text text-muted">
                  <FaInfoCircle className="me-2" /> {society.code_s}
                </p>
              </div>
            </div>

            <div className="text-end" style={{width: "40%", }}>
              
              <p className="card-text mb-0" style={{width: "100%", }}>
                <strong style={{ color: "#1e3a8a" }}>Total Factures :</strong>{" "}
                <span style={{ color: "red" ,fontSize: "10px" }}>{totals.totalInvoices} €</span>
              </p>
              <p className="card-text mb-0"  style={{width: "100%", }}>
                <strong style={{ color: "#1e3a8a" , textAlign: "left"}}>Reste à Payer :</strong>{" "}
                <span style={{ color: getTextColor(totals.remainingAmount) ,fontSize: "30px" , textAlign: "right"}}>{totals.remainingAmount} €</span>
              </p>
              <p className="card-text mb-0"  style={{width: "100%", }}>
                <strong style={{ color: "#1e3a8a" , textAlign: "left"}}>Déjà Payé :</strong>{" "}
                <span style={{ color: "green" ,fontSize: "10px" , textAlign: "right"}}>{totals.totalPayments} €</span>
              </p>
              
            </div>
          </div>

          {showDetails && (
          <div className="mt-3 d-flex gap-2">
            <button className="btn btn-primary btn-sm" onClick={handleAddFacture}>
              <FaFileInvoiceDollar className="me-2" /> Ajouter Facture
            </button>
            <button className="btn btn-success btn-sm" onClick={handleAddRecu}>
              <FaReceipt className="me-2" /> Ajouter Reçu
            </button>
            <button className="btn btn-warning btn-sm" onClick={handleModifyCompany}>
              <FaEdit className="me-2" /> Modifier Société
            </button>
            <button className="btn btn-danger btn-sm" onClick={handleDeleteSociety}>
              <FaTrash className="me-2" /> Supprimer Société
            </button>
            <button className="btn btn-info btn-sm" onClick={() => window.print()}>
              <FaPrint className="me-2" /> Imprimer Statistiques
            </button>

            
          </div>
        )}

          {showDetails && (
            <div className="mt-4 p-3" style={{ background: "#f5f5f5", borderRadius: "8px" }}>
              <h6 style={{ color: "#1e3a8a" }}>
                <FaFileInvoiceDollar className="me-2" /> Factures
              </h6>
              <ul className="list-group">
                {factures.filter((facture) => facture.valid === 1).map((facture) => (
                  <li key={facture.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <strong>Numéro :</strong> {facture.invoice_number} <br />
                      <strong>Montant :</strong> {facture.amount} € <br />
                      <strong>Date :</strong> {new Date(facture.date).toLocaleDateString()}
                    </div>
                    <div>
                      <button className="btn btn-info btn-sm me-2" onClick={() => handleViewCopie(facture.facture)}>
                        <FaEye /> Voir Copie
                      </button>
                      <button className="btn btn-warning btn-sm me-2" onClick={() => handleModifyFacture(facture)}>
                        <FaEdit /> Modifier
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteFacture(facture.id)}>
                        <FaTimes /> Supprimer
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <h6 className="mt-4" style={{ color: "#1e3a8a" }}>
                <FaReceipt className="me-2" /> Reçus
              </h6>
              <ul className="list-group">
                {recus.filter((recu) => recu.valid === 1).map((recu) => (
                  <li key={recu.numero_recu} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <strong>Numéro :</strong> {recu.numero_recu} <br />
                      <strong>Montant :</strong> {recu.montant} € <br />
                      <strong>Date :</strong> {new Date(recu.date).toLocaleDateString()}
                    </div>
                    <div>
                      <button className="btn btn-info btn-sm me-2" onClick={() => handleViewCopie(recu.recu_copier)}>
                        <FaEye /> Voir Copie
                      </button>
                      <button className="btn btn-warning btn-sm me-2" onClick={() => handleModifyRecu(recu)}>
                        <FaEdit /> Modifier
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteRecu(recu.numero_recu)}>
                        <FaTimes /> Supprimer
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Company;