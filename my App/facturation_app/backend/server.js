const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

// Serve static files from "public/uploads"
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "bdfacturation",
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'public', 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

// Login API
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Missing email or password" });
  }
  const query = "SELECT * FROM admin WHERE email = ? AND password = ?";
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error("Error during login:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
    if (results.length > 0) {
      res.json({ success: true, message: "Login successful" });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });
});

// Update admin profile
app.put("/api/admin", (req, res) => {
  const { oldEmail, newEmail, newPassword } = req.body;

 
    const query = `
      UPDATE admin 
      SET email = ?, password = ?
      WHERE email = ? ;
    `;

    db.query(query, [newEmail || oldEmail, newPassword, oldEmail], (err, result) => {
      if (err) {
        console.error("Error updating profile:", err);
        return res.status(500).json({ error: "Error updating profile" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ message: "Profile updated successfully" });
    });
  }
);



// Get all societies
app.get("/api/societies", (req, res) => {
  const query = "SELECT * FROM societes";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching societies:", err);
      return res.status(500).json({ error: "Error fetching societies" });
    }

    const societiesWithFullImagePaths = results.map(society => ({
      ...society,
      image: society.image ? `http://localhost:5000/uploads/${society.image}` : null
    }));

    res.json(societiesWithFullImagePaths);
  });
});

// Add new society
app.post("/api/societies", upload.single('image'), (req, res) => {
  const societyData = req.body;
  const imagePath = req.file ? req.file.filename : null;

  // Check if the society code or email already exists
  const checkQuery = "SELECT * FROM societes WHERE code_s = ? OR email = ?";
  db.query(checkQuery, [societyData.code_s, societyData.email], (err, results) => {
    if (err) {
      console.error("Error checking society code or email:", err);
      return res.status(500).json({ error: "Error checking society code or email" });
    }

    if (results.length > 0) {
      const duplicateCode = results.some((row) => row.code_s === societyData.code_s);
      const duplicateEmail = results.some((row) => row.email === societyData.email);

      if (duplicateCode && duplicateEmail) {
        return res.status(400).json({ error: "Society code and email already exist" });
      } else if (duplicateCode) {
        return res.status(400).json({ error: "Society code already exists" });
      } else if (duplicateEmail) {
        return res.status(400).json({ error: "Email already exists" });
      }
    }

    // If the code_s and email are unique, proceed with the insert
    const insertQuery = `
      INSERT INTO societes 
      (name, domain, directorName, directorLastName, code_s, email, tel, adresse, MF, image, valid, dateAjout) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW())
    `;
    const values = [
      societyData.name,
      societyData.domain,
      societyData.directorName,
      societyData.directorLastName,
      societyData.code_s,
      societyData.email,
      societyData.tel,
      societyData.adresse,
      societyData.MF,
      imagePath
    ];

    db.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error("Error adding society:", err);
        return res.status(500).json({ error: "Error adding society" });
      }
      res.json({
        ...societyData,
        id: result.insertId,
        image: imagePath ? `http://localhost:5000/uploads/${imagePath}` : null
      });
    });
  });
});

// Add new facture
app.post("/api/factures", upload.single('facture'), (req, res) => {
  const { code_societe, invoiceNumber, amount, date, description } = req.body;
  const facturePath = req.file ? req.file.filename : null;

  // Validate required fields
  if (!code_societe || !invoiceNumber || !amount || !date) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Check if the invoice number already exists
  const checkQuery = "SELECT * FROM factures WHERE invoice_number = ?";
  db.query(checkQuery, [invoiceNumber], (err, results) => {
    if (err) {
      console.error("Error checking invoice number:", err);
      return res.status(500).json({ error: "Error checking invoice number" });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: "Invoice number already exists" });
    }

    // If the invoice number is unique, proceed with the insert
    const insertQuery = `
      INSERT INTO factures (society_code, invoice_number, amount, date, description, facture, date_ajout, valid) 
      VALUES (?, ?, ?, ?, ?, ?, NOW(), 1)
    `;
    db.query(insertQuery, [code_societe, invoiceNumber, amount, date, description, facturePath], (err, result) => {
      if (err) {
        console.error("Error adding facture:", err);
        return res.status(500).json({ error: "Error adding facture" });
      }
      res.json({ message: "Facture added successfully", id: result.insertId });
    });
  });
});

// Add new receipt
app.post("/api/recus", upload.single('recuCopier'), (req, res) => {
  const { code_societe, numero_recu, amount, date, description } = req.body;
  const recuCopierPath = req.file ? req.file.filename : '';

  // Validate required fields
  if (!code_societe || !numero_recu || !amount || !date) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Check if the receipt number already exists
  const checkQuery = "SELECT * FROM recus WHERE numero_recu = ?";
  db.query(checkQuery, [numero_recu], (err, results) => {
    if (err) {
      console.error("Error checking receipt number:", err);
      return res.status(500).json({ error: "Error checking receipt number" });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: "Receipt number already exists" });
    }

    // If the receipt number is unique, proceed with the insert
    const insertQuery = `
      INSERT INTO recus (code_societe, numero_recu, montant, date, description, recu_copier, date_a, valid) 
      VALUES (?, ?, ?, ?, ?, ?, NOW(), 1)
    `;
    db.query(insertQuery, [code_societe, numero_recu, amount, date, description, recuCopierPath], (err, result) => {
      if (err) {
        console.error("Error adding recu:", err);
        return res.status(500).json({ error: "Error adding recu" });
      }
      res.json({ message: "Recu added successfully", id: result.insertId });
    });
  });
});

// Fetch invoices for a specific society
app.get("/api/factures", (req, res) => {
  const { society_code } = req.query;
  const query = society_code
    ? "SELECT * FROM factures WHERE society_code = ?"
    : "SELECT * FROM factures";
  db.query(query, [society_code], (err, results) => {
    if (err) {
      console.error("Error fetching invoices:", err);
      return res.status(500).json({ error: "Error fetching invoices" });
    }
    res.json(results);
  });
});

// Fetch receipts for a specific society
app.get("/api/recus", (req, res) => {
  const { code_societe } = req.query;
  const query = code_societe
    ? "SELECT * FROM recus WHERE code_societe = ?"
    : "SELECT * FROM recus";
  db.query(query, [code_societe], (err, results) => {
    if (err) {
      console.error("Error fetching receipts:", err);
      return res.status(500).json({ error: "Error fetching receipts" });
    }
    res.json(results);
  });
});

// Modify an invoice
app.put("/api/factures/:id", upload.single('facture'), (req, res) => {
  const { id } = req.params;
  const { invoiceNumber, amount, date, description, existingImage } = req.body;
  const facturePath = req.file ? req.file.filename : existingImage;

  const updateQuery = `
    UPDATE factures 
    SET invoice_number = ?, amount = ?, date = ?, description = ?, facture = ?
    WHERE id = ?
  `;

  db.query(
    updateQuery,
    [invoiceNumber, amount, date, description, facturePath, id],
    (err, result) => {
      if (err) {
        console.error("Error updating invoice:", err);
        return res.status(500).json({ error: "Error updating invoice" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Invoice not found" });
      }
      res.json({ message: "Invoice updated successfully" });
    }
  );
});

// Delete an invoice
app.delete("/api/factures/:id", (req, res) => {
  const { id } = req.params;
  const query = "UPDATE factures SET valid = 0 WHERE id = ?";  // Mark invoice as invalid instead of deleting
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting invoice:", err);
      return res.status(500).json({ error: "Error deleting invoice" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    res.json({ message: "Invoice deleted successfully" });
  });
});

// Delete a receipt
app.delete("/api/recus/:numero_recu", (req, res) => {
  const { numero_recu } = req.params;
  const query = "UPDATE recus SET valid = 0 WHERE numero_recu = ?"; // Soft delete
  db.query(query, [numero_recu], (err, result) => {
    if (err) {
      console.error("Error deleting receipt:", err);
      return res.status(500).json({ error: "Error deleting receipt" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Receipt not found" });
    }
    res.json({ message: "Receipt deleted successfully" });
  });
});

// Modify a receipt
app.patch("/api/recus/:numero_recu", upload.single('recuCopier'), (req, res) => {
  const { numero_recu } = req.params;
  const { amount, date, description, existingImage } = req.body;
  const recuCopierPath = req.file ? req.file.filename : existingImage;

  const updateQuery = `
    UPDATE recus 
    SET montant = ?, date = ?, description = ?, recu_copier = ?
    WHERE numero_recu = ?
  `;

  db.query(
    updateQuery,
    [amount, date, description, recuCopierPath, numero_recu],
    (err, result) => {
      if (err) {
        console.error("Error updating receipt:", err);
        return res.status(500).json({ error: "Error updating receipt" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Receipt not found" });
      }
      res.json({ message: "Receipt updated successfully" });
    }
  );
});

// Update company
app.put("/api/societies/:code_s", upload.single("image"), (req, res) => {
  const { code_s } = req.params;
  const {
    name,
    domain,
    directorName,
    directorLastName,
    email,
    tel,
    adresse,
    MF,
    existingImage,
  } = req.body;

  // Handle file upload
  let image;
  if (req.file) {
    // If a new file is uploaded, use its filename
    image = req.file.filename;
  } else if (existingImage) {
    // If no new file is uploaded, keep the existing image
    image = existingImage;
  } else {
    // If no file is provided and no existing image, set image to null
    image = null;
  }

  // Build the SQL query
  const query = `
    UPDATE societes 
    SET name = ?, domain = ?, directorName = ?, directorLastName = ?, email = ?, 
        tel = ?, adresse = ?, MF = ? ${image ? ", image = ?" : ""}
    WHERE code_s = ?
  `;

  // Parameters to pass to the query
  const params = image
    ? [name, domain, directorName, directorLastName, email, tel, adresse, MF, image, code_s]
    : [name, domain, directorName, directorLastName, email, tel, adresse, MF, code_s];

  // Execute the query
  db.query(query, params, (err, result) => {
    if (err) {
      console.error("❌ Error updating society:", err);
      return res.status(500).json({ error: "Error updating society" });
    }

    // Check if a row was modified
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Society not found" });
    }

    res.json({ message: "✅ Society updated successfully", image });
  });
});

// Calculate total amounts for a society
app.get("/api/societies/:code/totals", (req, res) => {
  const { code } = req.params;

  // Fetch total invoices
  const invoiceQuery = "SELECT SUM(amount) AS totalInvoices FROM factures WHERE society_code = ? and valid = 1";
  db.query(invoiceQuery, [code], (err, invoiceResults) => {
    if (err) {
      console.error("Error calculating total invoices:", err);
      return res.status(500).json({ error: "Error calculating total invoices" });
    }

    // Fetch total receipts
    const receiptQuery = "SELECT SUM(montant) AS totalPayments FROM recus WHERE code_societe = ? and valid = 1";
    db.query(receiptQuery, [code], (err, receiptResults) => {
      if (err) {
        console.error("Error calculating total payments:", err);
        return res.status(500).json({ error: "Error calculating total payments" });
      }

      const totalInvoices = invoiceResults[0].totalInvoices || 0;
      const totalPayments = receiptResults[0].totalPayments || 0;
      const remainingAmount = totalInvoices - totalPayments;

      res.json({
        totalInvoices,
        totalPayments,
        remainingAmount,
      });
    });
  });
});

// Delete society (soft delete)
app.patch("/api/societies/:code_s", (req, res) => {
  const code_societe = req.params.code_s;

  // First, check the current 'valid' status
  const checkQuery = "SELECT valid FROM societes WHERE code_s = ?";
  db.query(checkQuery, [code_societe], (err, results) => {
    if (err) {
      console.error("❌ Error checking society status:", err);
      return res.status(500).json({ error: "Error checking society status" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Society not found" });
    }

    const currentValid = results[0].valid;
    const newValid = currentValid === 1 ? 0 : 1; // Toggle valid value

    console.log(`🔄 Toggling society ${code_societe} from ${currentValid} to ${newValid}`);

    // Update the 'valid' status
    const updateQuery = "UPDATE societes SET valid = ? WHERE code_s = ?";
    db.query(updateQuery, [newValid, code_societe], (updateErr, updateResult) => {
      if (updateErr) {
        console.error("❌ Error updating society status:", updateErr);
        return res.status(500).json({ error: "Error updating society status" });
      }

      console.log(`✅ Society ${code_societe} updated successfully to ${newValid}`);
      res.json({ message: `Society ${newValid === 0 ? "deactivated" : "reactivated"} successfully`, valid: newValid });
    });
  });
});

// Create public/uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
} 

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});