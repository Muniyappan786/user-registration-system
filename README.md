# AuthPortal - Dynamic Authentication & Secure Dashboard System

A production-grade web application featuring user registration, client-side persistence via `localStorage`, credential authentication, and an interactive Secure Profile Dashboard with specialized Blood Group ID and medical donor insights.

Built entirely with **HTML5**, **CSS3**, and **Vanilla JavaScript (ES6+)** with **zero external dependencies**. Ready to publish instantly on **GitHub Pages** or run natively inside Android via WebView.

---

## 🚀 Key Features

### 1. User Registration (Sign Up)
- **Required Fields:**
  - **Full Name** (validated)
  - **Email Address** (regex format validation, unique check)
  - **Password** (minimum 6 characters, live strength meter, show/hide toggle)
  - **Mobile Number** (7–15 digits, international format supported)
  - **Blood Group Dropdown:** Full medical spectrum: `A+`, `A-`, `B+`, `B-`, `O+`, `O-`, `AB+`, `AB-`.
- **Session & Storage:** Stored directly into browser `localStorage` as structured records.
- **Empty-by-Default:** Starts completely empty with **zero pre-loaded mock accounts**, guaranteeing an authentic fresh experience.

### 2. User Login (Sign In)
- **Authentication:** Validates entered Email & Password against local accounts.
- **Security Feedback:** Friendly error messaging with animated shake effect on mismatch.
- **Instant Redirection:** Smoothly transitions into the secure dashboard upon successful validation.

### 3. Secure Dashboard
- **Profile Overview:** Displays Full Name, Email, Mobile Number, Member ID, and Account Created timestamp.
- **Explicit Blood Group Card:** 
  - Dynamic Rh-factor details
  - Universal donor/recipient classification badges
  - Red blood cell donor compatibility matrix ("Can Donate To" / "Can Receive From")
  - Printable / Downloadable Emergency Medical ID Card modal
- **Logout Action:** Securely clears current session and redirects back to Sign In.
- **Storage Management:** Live registry counter and clean "Reset / Clear All Records" option to test empty state anytime.

### 4. Technical Architecture
- **Single-Page Application (SPA):** Hashless fluid view switching.
- **Modern UI/UX:** Glassmorphism, smooth CSS transitions, dark/light mode toggle.
- **Zero Dependencies:** No frameworks or CDNs required; fully functional offline.

---

## 🌐 Deploy to GitHub Pages

1. Push this repository to GitHub.
2. In your repository, go to **Settings** > **Pages**.
3. Under **Branch**, select `main` (or `master`) and folder `/ (root)`.
4. Click **Save**. Your site will be live immediately!
