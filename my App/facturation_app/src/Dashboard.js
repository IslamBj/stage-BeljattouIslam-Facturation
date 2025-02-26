import React, { useState, useEffect } from "react";
import axios from "axios";
import AddSocietyForm from "./components/AddSocietyForm";
import Company from "./components/Company";
import ManageProfile from "./components/ManageProfile"; // Import the new component

const Dashboard = ({ activeSection }) => {
  const [societies, setSocieties] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({
    email: "admin@example.com",
    password: "password123",
  });

  // Charger les sociétés au montage du composant
  useEffect(() => {
    const fetchSocieties = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/societies");
        setSocieties(response.data);
      } catch (error) {
        setErrorMessage("Échec du chargement des sociétés");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSocieties();
  }, []);

  // Ajouter une nouvelle société
  const handleAddSociety = (newSociety) => {
    setSocieties((prev) => [...prev, newSociety]);
  };

  // Mettre à jour le profil
  const handleUpdateProfile = (updatedProfile) => {
    setUser(updatedProfile);
  };

  return (
    <div className="dashboard-container">
      <h2 className="text-center">Tableau de bord des Sociétés</h2>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      {/* Formulaires et Sections */}
      {activeSection === "addSociety" && <AddSocietyForm onAddSociety={handleAddSociety} />}

      {activeSection === "showList" && (
        <div className="container mt-4">
          {isLoading ? (
            <p>Chargement...</p>
          ) : (
            <div>
              {societies.filter((society) => society.valid === 1).length > 0 ? (
                societies
                  .filter((society) => society.valid === 1)
                  .map((society) => (
                    <Company key={society.code_s} society={society} />
                  ))
              ) : (
                <p>Aucune société trouvée.</p>
              )}
            </div>
          )}
        </div>
      )}

      {activeSection === "showArchive" && (
        <div className="container mt-4">
          <h5 className="text-center">Sociétés Archivées</h5>
          {societies.length > 0 ? (
            <div>
              {societies.filter((society) => society.valid === 0).map((society) => (
                <Company key={society.code_s} society={society} />
              ))}
            </div>
          ) : (
            <p>Aucune société trouvée dans l'archive.</p>
          )}
        </div>
      )}

      {activeSection === "manageProfile" && (
        <ManageProfile user={user} onUpdateProfile={handleUpdateProfile} />
      )}
    </div>
  );
};

export default Dashboard;