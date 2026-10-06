/**
 * ============================================================================
 * AuthPortal - Dynamic Authentication & Secure Dashboard System
 * Vanilla JavaScript (ES6+), Zero Dependencies, GitHub Pages Ready
 * ============================================================================
 */

(function () {
  'use strict';

  // Storage Keys
  const STORAGE_USERS = 'authportal_registered_users';
  const STORAGE_SESSION = 'authportal_active_session';
  const STORAGE_THEME = 'authportal_theme';

  // Blood Group Medical Compatibility Knowledge Base
  const BLOOD_DATA = {
    'O-': {
      rh: 'Rh Negative',
      badge: 'Universal Red Cell Donor',
      summary: 'Can donate red blood cells to any recipient of any blood group.',
      donateTo: 'All Types (Universal)',
      receiveFrom: 'O- only'
    },
    'O+': {
      rh: 'Rh Positive',
      badge: 'Most Common Donor Type',
      summary: 'Vital donor type compatible with all positive blood groups.',
      donateTo: 'O+, A+, B+, AB+',
      receiveFrom: 'O+, O-'
    },
    'A+': {
      rh: 'Rh Positive',
      badge: 'High Demand Type',
      summary: 'One of the most common blood groups for hospital transfusions.',
      donateTo: 'A+, AB+',
      receiveFrom: 'A+, A-, O+, O-'
    },
    'A-': {
      rh: 'Rh Negative',
      badge: 'Universal Platelet Donor',
      summary: 'Key donor for emergency transfusions and platelets.',
      donateTo: 'A+, A-, AB+, AB-',
      receiveFrom: 'A-, O-'
    },
    'B+': {
      rh: 'Rh Positive',
      badge: 'Important Group',
      summary: 'Crucial for matching and plasma treatments.',
      donateTo: 'B+, AB+',
      receiveFrom: 'B+, B-, O+, O-'
    },
    'B-': {
      rh: 'Rh Negative',
      badge: 'Rare Blood Type',
      summary: 'Found in only ~1.5% of donors worldwide.',
      donateTo: 'B+, B-, AB+, AB-',
      receiveFrom: 'B-, O-'
    },
    'AB+': {
      rh: 'Rh Positive',
      badge: 'Universal Recipient',
      summary: 'Can safely receive red blood cells from any blood type!',
      donateTo: 'AB+ only',
      receiveFrom: 'All Types (Universal)'
    },
    'AB-': {
      rh: 'Rh Negative',
      badge: 'Rarest Blood Type',
      summary: 'Rarest blood group (~0.6% of population); universal plasma donor.',
      donateTo: 'AB+, AB-',
      receiveFrom: 'AB-, A-, B-, O-'
    }
  };

  // DOM Elements
  const elements = {
    // App sections
    authSection: document.getElementById('auth-section'),
    dashboardSection: document.getElementById('dashboard-section'),
    
    // Auth Views & Tabs
    tabLogin: document.getElementById('tab-login'),
    tabRegister: document.getElementById('tab-register'),
    viewLogin: document.getElementById('view-login'),
    viewRegister: document.getElementById('view-register'),
    authAlert: document.getElementById('auth-alert'),
    authAlertMsg: document.getElementById('auth-alert-message'),
    gotoRegisterBtn: document.getElementById('goto-register-btn'),
    gotoLoginBtn: document.getElementById('goto-login-btn'),
    demoCredsBtn: document.getElementById('demo-credentials-btn'),

    // Forms
    loginForm: document.getElementById('login-form'),
    loginEmail: document.getElementById('login-email'),
    loginPassword: document.getElementById('login-password'),
    loginEmailErr: document.getElementById('login-email-error'),
    loginPassErr: document.getElementById('login-password-error'),

    registerForm: document.getElementById('register-form'),
    regName: document.getElementById('reg-fullname'),
    regEmail: document.getElementById('reg-email'),
    regMobile: document.getElementById('reg-mobile'),
    regBlood: document.getElementById('reg-bloodgroup'),
    regPass: document.getElementById('reg-password'),
    regTerms: document.getElementById('reg-terms'),
    regNameErr: document.getElementById('reg-fullname-error'),
    regEmailErr: document.getElementById('reg-email-error'),
    regMobileErr: document.getElementById('reg-mobile-error'),
    regBloodErr: document.getElementById('reg-bloodgroup-error'),
    regPassErr: document.getElementById('reg-password-error'),
    strBars: [
      document.getElementById('str-bar-1'),
      document.getElementById('str-bar-2'),
      document.getElementById('str-bar-3')
    ],
    strLabel: document.getElementById('strength-label'),

    // Dashboard Elements
    dashWelcomeName: document.getElementById('dash-welcome-name'),
    dashAvatar: document.getElementById('dash-avatar'),
    dashUserId: document.getElementById('dash-user-id'),
    dashFullName: document.getElementById('dash-fullname'),
    dashEmail: document.getElementById('dash-email'),
    dashMobile: document.getElementById('dash-mobile'),
    dashBloodGroup: document.getElementById('dash-bloodgroup'),
    dashBloodRh: document.getElementById('dash-bloodgroup-rh'),
    dashDonorBadge: document.getElementById('dash-donor-badge'),
    dashDonorSummary: document.getElementById('dash-donor-summary'),
    dashCreatedAt: document.getElementById('dash-created-at'),
    compatDonateTo: document.getElementById('compat-donate-to'),
    compatReceiveFrom: document.getElementById('compat-receive-from'),
    logoutBtn: document.getElementById('logout-btn'),

    // Stats & Registry
    usersPill: document.getElementById('users-pill'),
    registeredCountText: document.getElementById('registered-count-text'),
    statTotalUsers: document.getElementById('stat-total-users'),
    registeredUsersList: document.getElementById('registered-users-list'),
    clearAllDataBtn: document.getElementById('clear-all-data-btn'),

    // Theme & Helpers
    themeToggleBtn: document.getElementById('theme-toggle-btn'),
    themeIconSun: document.getElementById('theme-icon-sun'),
    themeIconMoon: document.getElementById('theme-icon-moon'),
    toastContainer: document.getElementById('toast-container'),

    // Emergency Modal
    medicalModal: document.getElementById('medical-modal'),
    closeModalBtn: document.getElementById('close-modal-btn'),
    modalDismissBtn: document.getElementById('modal-dismiss-btn'),
    modalPrintBtn: document.getElementById('modal-print-btn'),
    printEmergencyCardBtn: document.getElementById('print-emergency-card-btn'),
    modalName: document.getElementById('modal-name'),
    modalBlood: document.getElementById('modal-blood'),
    modalBloodBadge: document.getElementById('modal-blood-badge'),
    modalPhone: document.getElementById('modal-phone'),
    modalEmail: document.getElementById('modal-email')
  };

  /**
   * ==========================================================================
   * LOCAL STORAGE REPOSITORY FUNCTIONS
   * ==========================================================================
   */
  
  /**
   * Retrieve all registered users from localStorage.
   * Starts strictly empty ([]) if no accounts have been registered yet.
   */
  function getRegisteredUsers() {
    try {
      const raw = localStorage.getItem(STORAGE_USERS);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Error loading users from localStorage:', e);
      return [];
    }
  }

  /**
   * Save updated user list into localStorage.
   */
  function saveRegisteredUsers(users) {
    try {
      localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
      updateUserStatsUI();
    } catch (e) {
      console.error('Error saving users to localStorage:', e);
      showToast('Storage quota exceeded or unavailable', 'error');
    }
  }

  /**
   * Retrieve currently authenticated session.
   */
  function getActiveSession() {
    try {
      const raw = localStorage.getItem(STORAGE_SESSION);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  /**
   * Save currently authenticated session.
   */
  function setActiveSession(user) {
    try {
      localStorage.setItem(STORAGE_SESSION, JSON.stringify(user));
    } catch (e) {
      console.error('Error setting session:', e);
    }
  }

  /**
   * Clear currently active session.
   */
  function clearActiveSession() {
    localStorage.removeItem(STORAGE_SESSION);
  }

  /**
   * ==========================================================================
   * TOAST NOTIFICATION & FEEDBACK ENGINE
   * ==========================================================================
   */
  function showToast(message, type = 'info', duration = 3500) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
    } else if (type === 'error') {
      iconSvg = '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
    } else {
      iconSvg = '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
    }

    toast.innerHTML = `${iconSvg}<span class="toast-msg">${message}</span>`;
    elements.toastContainer.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 350);
    }, duration);
  }

  function showInlineAlert(message, type = 'error') {
    elements.authAlert.className = `alert-banner ${type}`;
    elements.authAlertMsg.textContent = message;
    elements.authAlert.classList.remove('hide');

    const card = document.querySelector('.auth-card');
    if (card && type === 'error') {
      card.classList.remove('shake');
      void card.offsetWidth; // Force reflow
      card.classList.add('shake');
    }
  }

  function hideInlineAlert() {
    elements.authAlert.classList.add('hide');
    elements.authAlertMsg.textContent = '';
  }

  /**
   * ==========================================================================
   * VALIDATION UTILITIES
   * ==========================================================================
   */
  function isValidEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).trim().toLowerCase());
  }

  function isValidMobile(mobile) {
    // Allows 7 to 15 digits, optional leading +
    const cleaned = mobile.replace(/[\s\-\(\)]/g, '');
    return /^\+?[0-9]{7,15}$/.test(cleaned);
  }

  function calculatePasswordStrength(pass) {
    if (!pass) return { score: 0, text: 'Minimum 6 characters', color: 'var(--text-muted)' };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass)) score++;
    if (pass.length >= 10 && /[^A-Za-z0-9]/.test(pass)) score++;

    if (score === 1) return { score: 1, text: 'Weak (add numbers/capitals)', color: 'var(--danger)' };
    if (score === 2) return { score: 2, text: 'Medium strength', color: 'var(--warning)' };
    if (score === 3) return { score: 3, text: 'Strong password', color: 'var(--success)' };
    return { score: 0, text: 'Minimum 6 characters', color: 'var(--text-muted)' };
  }

  function getInitials(name) {
    if (!name) return '--';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function clearErrors() {
    hideInlineAlert();
    const errorSpans = document.querySelectorAll('.field-error');
    errorSpans.forEach(el => el.textContent = '');
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(el => el.classList.remove('is-invalid', 'is-valid'));
  }

  /**
   * ==========================================================================
   * VIEW & TAB MANAGEMENT
   * ==========================================================================
   */
  function switchAuthTab(targetTab) {
    clearErrors();
    if (targetTab === 'login') {
      elements.tabLogin.classList.add('active');
      elements.tabLogin.setAttribute('aria-selected', 'true');
      elements.tabRegister.classList.remove('active');
      elements.tabRegister.setAttribute('aria-selected', 'false');

      elements.viewLogin.classList.add('active');
      elements.viewRegister.classList.remove('active');
      elements.loginEmail.focus();
    } else {
      elements.tabRegister.classList.add('active');
      elements.tabRegister.setAttribute('aria-selected', 'true');
      elements.tabLogin.classList.remove('active');
      elements.tabLogin.setAttribute('aria-selected', 'false');

      elements.viewRegister.classList.add('active');
      elements.viewLogin.classList.remove('active');
      elements.regName.focus();
    }
  }

  function renderView(viewName) {
    if (viewName === 'dashboard') {
      elements.authSection.classList.add('hide');
      elements.dashboardSection.classList.remove('hide');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      elements.dashboardSection.classList.add('hide');
      elements.authSection.classList.remove('hide');
      switchAuthTab(viewName === 'register' ? 'register' : 'login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /**
   * ==========================================================================
   * USER REGISTRATION HANDLER
   * ==========================================================================
   */
  function handleRegistration(e) {
    e.preventDefault();
    clearErrors();

    const fullName = elements.regName.value.trim();
    const email = elements.regEmail.value.trim().toLowerCase();
    const mobile = elements.regMobile.value.trim();
    const bloodGroup = elements.regBlood.value;
    const password = elements.regPass.value;
    const termsAccepted = elements.regTerms.checked;

    let hasError = false;

    // 1. Full Name Validation
    if (!fullName) {
      elements.regNameErr.textContent = 'Please enter your full name.';
      elements.regName.classList.add('is-invalid');
      hasError = true;
    } else if (fullName.length < 2) {
      elements.regNameErr.textContent = 'Full name must be at least 2 characters.';
      elements.regName.classList.add('is-invalid');
      hasError = true;
    } else {
      elements.regName.classList.add('is-valid');
    }

    // 2. Email Validation
    if (!email) {
      elements.regEmailErr.textContent = 'Please enter your email address.';
      elements.regEmail.classList.add('is-invalid');
      hasError = true;
    } else if (!isValidEmail(email)) {
      elements.regEmailErr.textContent = 'Please enter a valid email format (e.g., user@domain.com).';
      elements.regEmail.classList.add('is-invalid');
      hasError = true;
    } else {
      elements.regEmail.classList.add('is-valid');
    }

    // 3. Mobile Number Validation
    if (!mobile) {
      elements.regMobileErr.textContent = 'Please enter your mobile phone number.';
      elements.regMobile.classList.add('is-invalid');
      hasError = true;
    } else if (!isValidMobile(mobile)) {
      elements.regMobileErr.textContent = 'Please enter a valid mobile number (7-15 digits).';
      elements.regMobile.classList.add('is-invalid');
      hasError = true;
    } else {
      elements.regMobile.classList.add('is-valid');
    }

    // 4. Blood Group Validation (Strict check for A+, A-, B+, B-, O+, O-, AB+, AB-)
    const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
    if (!bloodGroup || !validBloodGroups.includes(bloodGroup)) {
      elements.regBloodErr.textContent = 'Please select your valid blood group from the list.';
      elements.regBlood.classList.add('is-invalid');
      hasError = true;
    } else {
      elements.regBlood.classList.add('is-valid');
    }

    // 5. Password Validation
    if (!password) {
      elements.regPassErr.textContent = 'Please create a secure password.';
      elements.regPass.classList.add('is-invalid');
      hasError = true;
    } else if (password.length < 6) {
      elements.regPassErr.textContent = 'Password must be at least 6 characters long.';
      elements.regPass.classList.add('is-invalid');
      hasError = true;
    } else {
      elements.regPass.classList.add('is-valid');
    }

    // 6. Terms
    if (!termsAccepted) {
      showInlineAlert('Please accept the browser local storage confirmation.', 'error');
      hasError = true;
    }

    if (hasError) {
      showInlineAlert('Please correct the highlighted fields above.', 'error');
      return;
    }

    // Check if user already exists
    const users = getRegisteredUsers();
    const existing = users.find(u => u.email === email);
    if (existing) {
      elements.regEmail.classList.add('is-invalid');
      elements.regEmailErr.textContent = 'An account with this email is already registered.';
      showInlineAlert('This email is already in use. Please sign in or use another email.', 'error');
      return;
    }

    // Create New User Object
    const newUser = {
      id: 'USR-' + Math.floor(100000 + Math.random() * 900000),
      fullName: fullName,
      email: email,
      mobile: mobile,
      bloodGroup: bloodGroup,
      password: password, // Stored locally per requirement
      createdAt: new Date().toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      })
    };

    // Save to localStorage
    users.push(newUser);
    saveRegisteredUsers(users);

    // Reset Form
    elements.registerForm.reset();
    resetPasswordMeter();

    // Success Feedback & Automatic smooth transition to Login
    showToast(`Account created for ${newUser.fullName}! You can now sign in.`, 'success', 4000);
    switchAuthTab('login');
    elements.loginEmail.value = newUser.email;
    elements.loginPassword.focus();
    showInlineAlert('Account registered successfully! Please enter your password to sign in.', 'success');
  }

  /**
   * ==========================================================================
   * USER LOGIN HANDLER
   * ==========================================================================
   */
  function handleLogin(e) {
    e.preventDefault();
    clearErrors();

    const email = elements.loginEmail.value.trim().toLowerCase();
    const password = elements.loginPassword.value;

    let hasError = false;

    if (!email) {
      elements.loginEmailErr.textContent = 'Please enter your registered email address.';
      elements.loginEmail.classList.add('is-invalid');
      hasError = true;
    } else if (!isValidEmail(email)) {
      elements.loginEmailErr.textContent = 'Please enter a valid email format.';
      elements.loginEmail.classList.add('is-invalid');
      hasError = true;
    }

    if (!password) {
      elements.loginPassErr.textContent = 'Please enter your password.';
      elements.loginPassword.classList.add('is-invalid');
      hasError = true;
    }

    if (hasError) {
      showInlineAlert('Please enter both email and password.', 'error');
      return;
    }

    // Validate against localStorage registered users
    const users = getRegisteredUsers();

    if (users.length === 0) {
      showInlineAlert('No registered accounts found in localStorage. Please create an account first.', 'error');
      elements.loginEmail.classList.add('is-invalid');
      return;
    }

    const matchedUser = users.find(u => u.email === email);

    if (!matchedUser) {
      elements.loginEmail.classList.add('is-invalid');
      elements.loginEmailErr.textContent = 'No account associated with this email.';
      showInlineAlert('Invalid email address. Please check your credentials or register.', 'error');
      return;
    }

    if (matchedUser.password !== password) {
      elements.loginPassword.classList.add('is-invalid');
      elements.loginPassErr.textContent = 'Incorrect password.';
      showInlineAlert('Incorrect password. Please try again.', 'error');
      return;
    }

    // Successful Login!
    setActiveSession(matchedUser);
    elements.loginForm.reset();
    showToast(`Welcome back, ${matchedUser.fullName}!`, 'success');
    loadDashboard(matchedUser);
  }

  /**
   * ==========================================================================
   * SECURE DASHBOARD LOADER
   * ==========================================================================
   */
  function loadDashboard(user) {
    // Populate User Details
    elements.dashWelcomeName.textContent = user.fullName;
    elements.dashAvatar.textContent = getInitials(user.fullName);
    elements.dashUserId.textContent = `ID: ${user.id || '#SEC-821'}`;
    elements.dashFullName.textContent = user.fullName;
    elements.dashEmail.textContent = user.email;
    elements.dashMobile.textContent = user.mobile;
    elements.dashCreatedAt.textContent = user.createdAt || 'Active';

    // Populate Blood Group Details
    const bg = user.bloodGroup || 'O+';
    elements.dashBloodGroup.textContent = bg;

    const medicalInfo = BLOOD_DATA[bg] || {
      rh: 'Unknown',
      badge: 'Donor Registered',
      summary: 'Blood group details stored in profile.',
      donateTo: 'Consult physician',
      receiveFrom: 'Consult physician'
    };

    elements.dashBloodRh.textContent = medicalInfo.rh;
    elements.dashDonorBadge.textContent = medicalInfo.badge;
    elements.dashDonorSummary.textContent = medicalInfo.summary;
    elements.compatDonateTo.textContent = medicalInfo.donateTo;
    elements.compatReceiveFrom.textContent = medicalInfo.receiveFrom;

    // Render View
    renderView('dashboard');
    updateUserStatsUI();
  }

  /**
   * ==========================================================================
   * USER LOGOUT HANDLER
   * ==========================================================================
   */
  function handleLogout() {
    clearActiveSession();
    clearErrors();
    showToast('Signed out successfully. Session ended.', 'info');
    renderView('login');
  }

  /**
   * ==========================================================================
   * UI SYNC & STATS HELPERS
   * ==========================================================================
   */
  function updateUserStatsUI() {
    const users = getRegisteredUsers();
    const count = users.length;

    if (elements.registeredCountText) {
      elements.registeredCountText.textContent = `${count} Registered`;
    }
    if (elements.statTotalUsers) {
      elements.statTotalUsers.textContent = count;
    }

    // Update Directory List inside storage card
    if (elements.registeredUsersList) {
      if (count === 0) {
        elements.registeredUsersList.innerHTML = `
          <div class="empty-users-hint">
            No registered users in localStorage yet. Sign up to add the first profile!
          </div>
        `;
      } else {
        elements.registeredUsersList.innerHTML = users.map(u => `
          <div class="user-item-pill">
            <div class="user-item-left">
              <div class="user-item-avatar">${getInitials(u.fullName)}</div>
              <div>
                <span class="user-item-name">${escapeHtml(u.fullName)}</span>
                <span class="user-item-email">${escapeHtml(u.email)}</span>
              </div>
            </div>
            <div class="user-item-blood" title="Blood Group">${escapeHtml(u.bloodGroup)}</div>
          </div>
        `).join('');
      }
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function resetPasswordMeter() {
    elements.strBars.forEach(b => {
      b.style.backgroundColor = 'var(--border-color)';
    });
    elements.strLabel.textContent = 'Minimum 6 characters';
    elements.strLabel.style.color = 'var(--text-muted)';
  }

  function updatePasswordMeter(value) {
    const res = calculatePasswordStrength(value);
    elements.strLabel.textContent = res.text;
    elements.strLabel.style.color = res.color;

    elements.strBars.forEach((bar, idx) => {
      if (idx < res.score) {
        bar.style.backgroundColor = res.color;
      } else {
        bar.style.backgroundColor = 'var(--border-color)';
      }
    });
  }

  /**
   * ==========================================================================
   * THEME MANAGEMENT
   * ==========================================================================
   */
  function initTheme() {
    const savedTheme = localStorage.getItem(STORAGE_THEME) || 'dark';
    applyTheme(savedTheme);
  }

  function applyTheme(theme) {
    if (theme === 'light') {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
      elements.themeIconSun.classList.add('hide');
      elements.themeIconMoon.classList.remove('hide');
    } else {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
      elements.themeIconSun.classList.remove('hide');
      elements.themeIconMoon.classList.add('hide');
    }
    localStorage.setItem(STORAGE_THEME, theme);
  }

  function toggleTheme() {
    const isLight = document.body.classList.contains('light-theme');
    applyTheme(isLight ? 'dark' : 'light');
  }

  /**
   * ==========================================================================
   * EMERGENCY MEDICAL CARD MODAL & PRINT
   * ==========================================================================
   */
  function openMedicalModal() {
    const session = getActiveSession();
    if (!session) return;

    elements.modalName.textContent = session.fullName;
    elements.modalBlood.textContent = session.bloodGroup;
    elements.modalBloodBadge.textContent = session.bloodGroup;
    elements.modalPhone.textContent = session.mobile;
    elements.modalEmail.textContent = session.email;

    elements.medicalModal.classList.remove('hide');
  }

  function closeMedicalModal() {
    elements.medicalModal.classList.add('hide');
  }

  /**
   * ==========================================================================
   * EVENT LISTENERS BINDING
   * ==========================================================================
   */
  function bindEvents() {
    // Tab Clicks
    elements.tabLogin.addEventListener('click', () => switchAuthTab('login'));
    elements.tabRegister.addEventListener('click', () => switchAuthTab('register'));
    elements.gotoRegisterBtn.addEventListener('click', () => switchAuthTab('register'));
    elements.gotoLoginBtn.addEventListener('click', () => switchAuthTab('login'));
    elements.demoCredsBtn.addEventListener('click', () => switchAuthTab('register'));

    // Forms
    elements.loginForm.addEventListener('submit', handleLogin);
    elements.registerForm.addEventListener('submit', handleRegistration);

    // Logout
    elements.logoutBtn.addEventListener('click', handleLogout);

    // Theme Toggle
    elements.themeToggleBtn.addEventListener('click', toggleTheme);

    // Password Toggles
    document.querySelectorAll('.password-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const input = document.getElementById(targetId);
        const openIcon = btn.querySelector('.eye-open');
        const closedIcon = btn.querySelector('.eye-closed');

        if (input.type === 'password') {
          input.type = 'text';
          openIcon.classList.add('hide');
          closedIcon.classList.remove('hide');
        } else {
          input.type = 'password';
          openIcon.classList.remove('hide');
          closedIcon.classList.add('hide');
        }
      });
    });

    // Real-time password strength meter
    elements.regPass.addEventListener('input', (e) => {
      updatePasswordMeter(e.target.value);
    });

    // Copy to clipboard buttons
    document.querySelectorAll('.copy-field-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-copy');
        const targetEl = document.getElementById(targetId);
        if (!targetEl) return;
        const text = targetEl.textContent;

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(() => {
            showToast(`Copied "${text}" to clipboard!`, 'info', 2000);
          }).catch(() => {
            fallbackCopy(text);
          });
        } else {
          fallbackCopy(text);
        }
      });
    });

    function fallbackCopy(text) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        showToast(`Copied to clipboard!`, 'info', 2000);
      } catch (err) {
        showToast('Unable to copy', 'error');
      }
      document.body.removeChild(ta);
    }

    // Clear all records (Simulation of clean reset)
    elements.clearAllDataBtn.addEventListener('click', () => {
      if (confirm('Clear all stored user accounts from localStorage? This will reset the application to a completely empty state.')) {
        localStorage.removeItem(STORAGE_USERS);
        clearActiveSession();
        updateUserStatsUI();
        showToast('All records cleared! Storage is completely empty.', 'info');
        renderView('login');
      }
    });

    // Medical ID Modal
    elements.printEmergencyCardBtn.addEventListener('click', openMedicalModal);
    elements.closeModalBtn.addEventListener('click', closeMedicalModal);
    elements.modalDismissBtn.addEventListener('click', closeMedicalModal);
    elements.modalPrintBtn.addEventListener('click', () => {
      window.print();
    });

    elements.medicalModal.addEventListener('click', (e) => {
      if (e.target === elements.medicalModal) {
        closeMedicalModal();
      }
    });

    // Set copyright year dynamically
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
  }

  /**
   * ==========================================================================
   * APPLICATION INITIALIZATION
   * ==========================================================================
   */
  function init() {
    initTheme();
    bindEvents();
    updateUserStatsUI();

    // Check for existing active session
    const activeSession = getActiveSession();
    if (activeSession) {
      // Validate that active session user still exists in registered list
      const users = getRegisteredUsers();
      const exists = users.find(u => u.email === activeSession.email);
      if (exists) {
        loadDashboard(exists);
        return;
      } else {
        clearActiveSession();
      }
    }

    // Default to clean login view
    renderView('login');
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
