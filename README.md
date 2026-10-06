# Lifeline - Blood Availability & Emergency Donor System

A complete web and Android application featuring a secure user authentication system, real-time donor directory, emergency availability status toggle, and blood compatibility intelligence.

Built with **HTML5, CSS3, and Vanilla JavaScript** with **zero external dependencies**, ready to run directly in any modern browser, publish to **GitHub Pages**, or install as an Android app.

---

## 🩸 Core Features

### 1. User Registration (`registerPage`)
- **Required Fields**:
  - **Full Name**
  - **Email Address** (format validated, unique email verification)
  - **Mobile Number** (strict 10-digit validation: `[0-9]{10}`)
  - **Blood Group** (Dropdown: `A+`, `A-`, `B+`, `B-`, `O+`, `O-`, `AB+`, `AB-`)
  - **Password** (min 6 characters)
- **Local Persistence**: Saved locally via browser `localStorage`.
- **Zero Pre-loaded Data**: Starts completely empty so you can test registration from scratch.

### 2. User Authentication (`loginPage`)
- Validates credentials against registered users in `localStorage`.
- Context-sensitive error handling and smooth redirection into the secure dashboard.

### 3. Secure Dashboard (`dashboardPage`)
- **Profile Overview**: Displays Full Name, Email, 10-digit Mobile Number, and blood badge.
- **Available for Emergency? Toggle**: 
  - Real-time switch toggle allowing donors to set their emergency availability.
  - Updates availability in both active session and the persistent donor directory.
- **Transfusion Compatibility Info**: Dynamic guide indicating donor and recipient compatibility (e.g. O- universal red cell donor, AB+ universal recipient).
- **Donor Network & Search (`action-card`)**:
  - Filter donors by specific Blood Group or "All Blood Groups".
  - Filter by "Show emergency available only".
  - Interactive donor cards with direct `tel:` call link.
  - Live stats: Total Registered Donors vs Emergency Ready.
- **Functional Logout & Reset**: Clear session or test resetting all local records.

---

## 🌐 Deploying to GitHub Pages

1. Push this repository to GitHub.
2. In your GitHub repository, open **Settings** > **Pages**.
3. Under **Branch**, select `main` (or `master`) and directory `/ (root)`.
4. Click **Save**. Your site will be published at `https://<username>.github.io/<repo>/`!
