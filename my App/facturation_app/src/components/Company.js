import React, { useState, useEffect, useCallback } from "react";
import { FaBuilding, FaGlobe, FaInfoCircle, FaTrash, FaFileInvoiceDollar, FaReceipt, FaPrint, FaEye, FaTimes, FaEdit, FaChevronDown, FaChevronUp, FaArchive } from "react-icons/fa";
import axios from "axios";
import FactureForm from "./FactureForm";
import RecuForm from "./RecuForm";
import SocieteEditForm from "./SocieteEditForm";
import "bootstrap/dist/css/bootstrap.min.css";

const Company = ({ society, onDeleteSociety, onUpdateSociety}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [factures, setFactures] = useState([]);
  const [recus, setRecus] = useState([]);
  const [showArchived, setShowArchived] = useState(false); // Toggle between active and archived lists
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
  const [expandedFactureId, setExpandedFactureId] = useState(null);
  const [expandedRecuId, setExpandedRecuId] = useState(null);

  const fetchTotals = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/societies/${society.code_s}/totals`);
      setTotals(response.data);
    } catch (error) {
      console.error("Error fetching totals:", error);
    }
  }, [society.code_s]);

  useEffect(() => {
    fetchTotals();
  }, [fetchTotals]);

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

  const toggleArchived = () => {
    setShowArchived(!showArchived); // Toggle between active and archived lists
  };

  const getFilteredFactures = () => {
    return factures.filter((facture) => showArchived ? facture.valid === 0 : facture.valid === 1);
  };

  const getFilteredRecus = () => {
    return recus.filter((recu) => showArchived ? recu.valid === 0 : recu.valid === 1);
  };

  const handleDeleteSociety = async () => {
    if (window.confirm("Voulez-vous activer/désactiver cette société ?")) {
      try {
        const response = await axios.patch(`http://localhost:5000/api/societies/${society.code_s}`);

        if (response.data.valid !== undefined) {
          onDeleteSociety(society.code_s);
          fetchTotals();
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

  const handleModifyRecu = (recu) => {
    setSelectedRecu(recu);
    setShowRecuForm(true);
  };

  const handleDeleteFacture = async (id) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        await axios.delete(`http://localhost:5000/api/factures/${id}`);
        fetchInvoicesAndReceipts();
        alert("Invoice deleted successfully!");
      } catch (error) {
        console.error("Error deleting invoice:", error);
        alert("Failed to delete invoice. Please try again later.");
      }
    }
  };

  const handleDeleteRecu = async (numero_recu) => {
    if (window.confirm("Are you sure you want to delete this receipt?")) {
      try {
        await axios.delete(`http://localhost:5000/api/recus/${numero_recu}`);
        fetchInvoicesAndReceipts(); // Refresh data
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

  

  const getTextColor = (amount) => {
    if (amount > 0) return "red";
    if (amount < 0) return "green";
    return "orange";
  };

  const getBackgroundColor = () => {
    if (totals.remainingAmount > 0) return "linear-gradient(to right, #ffffff, #ffcccc)";
    if (totals.remainingAmount < 0) return "linear-gradient(to right, #ffffff, #ccffcc)";
    return "#ffffff";
  };

  const toggleFactureDetails = (id) => {
    setExpandedFactureId(expandedFactureId === id ? null : id);
  };

  const toggleRecuDetails = (numero_recu) => {
    setExpandedRecuId(expandedRecuId === numero_recu ? null : numero_recu);
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

      {/* List View */}
      <div
        className="card mb-3 shadow-sm"
        style={{
          borderRadius: '15px',
          borderLeft: `10px solid #1e3a8a`,
          background: getBackgroundColor(),
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
        </div>
      </div>

      {/* Detailed View */}
      {showDetails && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000, // Ensure this is lower than the form window's z-index
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "10px",
              paddingTop: 0 ,
              borderRadius: "8px",
              width: "93%",
              maxHeight: "90vh",
              overflowY: "auto",
              position: "relative", // Ensure the modal content is positioned relative
            }}
          >
            {/* Fixed Header Section */}
            <div
              className="d-flex justify-content-between align-items-center mb-3"
              style={{
                position: "sticky", // Make the header sticky
                top: 0, // Stick to the top of the modal
                backgroundColor: "white", // Match the background color
                zIndex: 1, // Ensure it stays above the scrolling content
                padding: "10px 10px", // Add some padding for spacing
                borderBottom: "3px solid rgb(57, 37, 231)", // Optional: Add a border for separation
              }}
            >
              {society.image && (
                <div className="text-center">
                  <img
                    src={society.image}
                    alt={`Logo de ${society.name}`}
                    style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "15px" }}
                  />
                </div>
              )}
              <h3>
                {society.name} 
                
              </h3>
              <h3>
                <span style={{ color: getTextColor(totals.remainingAmount) }}>
                    {totals.remainingAmount} €
                </span>
              </h3>
              <button className="btn btn-danger" onClick={toggleDetails}>
                <FaTimes /> Fermer
              </button>
            </div>

            {/* Rest of the Modal Content */}
            <div style={{ marginTop: "80px" }}> {/* Add margin to avoid overlap with the fixed header */}
              {/* Company Details Section */}
              <div className="mt-3 p-3" style={{ background: "#f5f5f5", borderRadius: "8px" }}>
                <h6 style={{ color: "#1e3a8a" }}>
                  <FaInfoCircle className="me-2" /> Détails de la Société
                </h6>
                <div className="row">
                  <div className="col-md-6">
                    <p style={{ marginBottom: "0.25rem" }}><strong>Nom :</strong> {society.name}</p>
                    <p style={{ marginBottom: "0.25rem" }}><strong>Domaine :</strong> {society.domain}</p>
                    <p style={{ marginBottom: "0.25rem" }}><strong>Code Société :</strong> {society.code_s}</p>
                    <p style={{ marginBottom: "0.25rem" }}><strong>Directeur :</strong> {society.directorName} {society.directorLastName}</p>
                    <p style={{ marginBottom: "0.25rem" }}><strong>Email :</strong> {society.email}</p>
                  </div>
                  <div className="col-md-6">
                    <p style={{ marginBottom: "0.25rem" }}><strong>Téléphone :</strong> {society.tel}</p>
                    <p style={{ marginBottom: "0.25rem" }}><strong>Adresse :</strong> {society.adresse}</p>
                    <p style={{ marginBottom: "0.25rem" }}><strong>Matricule Fiscale :</strong> {society.MF}</p>
                    <p style={{ marginBottom: "0.25rem" }}><strong>Statut :</strong> {society.valid === 1 ? "Actif" : "Inactif"}</p>
                    <p style={{ marginBottom: "0.25rem" }}><strong>Date d'ajout :</strong> {new Date(society.dateAjout).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Buttons Section */}
              <div className="mt-3 d-flex gap-2">
                <button className="btn btn-primary btn-sm" onClick={handleAddFacture}>
                  <FaFileInvoiceDollar className="me-2" /> Ajouter Facture
                </button>
                <button className="btn btn-primary btn-sm" onClick={handleAddRecu}>
                  <FaReceipt className="me-2" /> Ajouter Reçu
                </button>
                <button className="btn btn-primary btn-sm" onClick={handleModifyCompany}>
                  <FaEdit className="me-2" /> Modifier Société
                </button>
                <button className="btn btn-primary btn-sm" onClick={handleDeleteSociety}>
                  <FaTrash className="me-2" /> Supprimer Société
                </button>
                <button 
  className="btn btn-primary btn-sm" 
  onClick={() => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print ${society.name}</title>
          <style>
            body { font-family: Arial, sans-serif; }
            h1 { color: #1e3a8a; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>${society.name} - Statistiques</h1>
          <table>
            <tr>
              <th>Total Factures</th>
              <th>Reste à Payer</th>
              <th>Déjà Payé</th>
            </tr>
            <tr>
              <td>${totals.totalInvoices} €</td>
              <td style="color: ${getTextColor(totals.remainingAmount)};">${totals.remainingAmount} €</td>
              <td style="color: green;">${totals.totalPayments} €</td>
            </tr>
          </table>
          <h2>Factures</h2>
          <table>
            <tr>
              <th>Numéro</th>
              <th>Montant</th>
              <th>Date</th>
            </tr>
            ${getFilteredFactures().map(facture => `
              <tr>
                <td>${facture.invoice_number}</td>
                <td>${facture.amount} €</td>
                <td>${new Date(facture.date).toLocaleDateString()}</td>
              </tr>
            `).join('')}
          </table>
          <h2>Reçus</h2>
          <table>
            <tr>
              <th>Numéro</th>
              <th>Montant</th>
              <th>Date</th>
            </tr>
            ${getFilteredRecus().map(recu => `
              <tr>
                <td>${recu.numero_recu}</td>
                <td>${recu.montant} €</td>
                <td>${new Date(recu.date).toLocaleDateString()}</td>
              </tr>
            `).join('')}
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }}
  style={{
    backgroundColor: '#1e3a8a',
    border: 'none',
    borderRadius: '5px',
    padding: '8px 16px',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  }}
  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0f2c6d'}
  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1e3a8a'}
>
  <FaPrint className="me-2" /> Imprimer Statistiques
</button>
                <button className="btn btn-primary btn-sm" onClick={toggleArchived}>
                  <FaArchive className="me-2" /> {showArchived ? "Afficher Actifs" : "Afficher Archivés"}
                </button>
              </div>

              {/* Factures Section */}
              <div className="mt-4 p-3" style={{ background: "#f5f5f5", borderRadius: "8px" }}>
                <h6 style={{ color: "#1e3a8a" }}>
                  <FaFileInvoiceDollar className="me-2" /> {showArchived ? "Factures Archivées" : "Factures Actives"}
                </h6>
                <ul className="list-group">
                  {getFilteredFactures().map((facture) => (
                    <li key={facture.id} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <p style={{ marginBottom: "0.25rem" }}><strong>Numéro :</strong> {facture.invoice_number}</p>
                          <p style={{ marginBottom: "0.25rem" }}><strong>Montant :</strong> {facture.amount} €</p>
                          <p style={{ marginBottom: "0.25rem" }}><strong>Date :</strong> {new Date(facture.date).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <button className="btn btn-info btn-sm me-2" onClick={() => toggleFactureDetails(facture.id)}>
                            {expandedFactureId === facture.id ? <FaChevronUp /> : <FaChevronDown />} Détails
                          </button>
                          {!showArchived && (
                            <>
                              <button className="btn btn-warning btn-sm me-2" style={{ marginRight: "5px" }} onClick={() => handleModifyFacture(facture)}>
                                <FaEdit /> Modifier
                              </button>
                              <button className="btn btn-danger btn-sm" style={{ marginRight: "5px" }} onClick={() => handleDeleteFacture(facture.id)}>
                                <FaTimes /> Supprimer
                              </button>
                            </>
                          )}
                          <button className="btn btn-secondary btn-sm" style={{ marginRight: "5px" }} onClick={() => handleViewCopie(facture.facture)}>
                            <FaEye /> Voir copie
                          </button>
                        </div>
                      </div>
                      {expandedFactureId === facture.id && (
                        <div className="mt-2" style={{ marginTop: "0.25rem" }}>
                          <p style={{ marginBottom: "0.25rem" }}><strong>Code Société :</strong> {facture.society_code}</p>
                          <p style={{ marginBottom: "0.25rem" }}><strong>Description :</strong> {facture.description}</p>
                          <p style={{ marginBottom: "0.25rem" }}><strong>Date d'ajout :</strong> {new Date(facture.date_ajout).toLocaleDateString()}</p>
                          <p style={{ marginBottom: "0" }}><strong>Statut :</strong> {facture.valid === 1 ? "Actif" : "Inactif"}</p>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recus Section */}
              <div className="mt-4 p-3" style={{ background: "#f5f5f5", borderRadius: "8px" }}>
                <h6 style={{ color: "#1e3a8a" }}>
                  <FaReceipt className="me-2" /> {showArchived ? "Reçus Archivés" : "Reçus Actifs"}
                </h6>
                <ul className="list-group">
                  {getFilteredRecus().map((recu) => (
                    <li key={recu.numero_recu} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <p style={{ marginBottom: "0.25rem" }}><strong>Numéro :</strong> {recu.numero_recu}</p>
                          <p style={{ marginBottom: "0.25rem" }}><strong>Montant :</strong> {recu.montant} €</p>
                          <p style={{ marginBottom: "0.25rem" }}><strong>Date :</strong> {new Date(recu.date).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <button className="btn btn-info btn-sm me-2" onClick={() => toggleRecuDetails(recu.numero_recu)}>
                            {expandedRecuId === recu.numero_recu ? <FaChevronUp /> : <FaChevronDown />} Détails
                          </button>
                          {!showArchived && (
                            <>
                              <button className="btn btn-warning btn-sm me-2" style={{ marginRight: "5px" }} onClick={() => handleModifyRecu(recu)}>
                                <FaEdit /> Modifier
                              </button>
                              <button className="btn btn-danger btn-sm" style={{ marginRight: "5px" }} onClick={() => handleDeleteRecu(recu.numero_recu)}>
                                <FaTimes /> Supprimer
                              </button>
                            </>
                          )}
                          <button className="btn btn-secondary btn-sm" style={{ marginRight: "5px" }} onClick={() => handleViewCopie(recu.recu_copier)}>
                            <FaEye /> Voir copie
                          </button>
                        </div>
                      </div>
                      {expandedRecuId === recu.numero_recu && (
                        <div className="mt-2" style={{ marginTop: "0.25rem" }}>
                          <p style={{ marginBottom: "0.25rem" }}><strong>Code Société :</strong> {recu.code_societe}</p>
                          <p style={{ marginBottom: "0.25rem" }}><strong>Description :</strong> {recu.description}</p>
                          <p style={{ marginBottom: "0.25rem" }}><strong>Date d'ajout :</strong> {new Date(recu.date_a).toLocaleDateString()}</p>
                          
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Overlay */}
      {(showFactureForm || showRecuForm || showCompanyForm) && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 2000, // Higher z-index to ensure it appears above the company details window
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
    </div>
  );
};

export default Company;