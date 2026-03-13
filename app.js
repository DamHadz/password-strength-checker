/* ═══════════════════════════════════════
   PASSGUARD — app.js
   Password Strength Checker Logic
═══════════════════════════════════════ */

// ─── COMMON PASSWORDS LIST (top 100 subset) ────────────────
const COMMON_PASSWORDS = new Set([
  'password','password1','password123','123456','12345678','123456789',
  'qwerty','abc123','password!','iloveyou','admin','welcome','monkey',
  'dragon','master','1234567','sunshine','princess','letmein','login',
  'hello','shadow','1234','111111','000000','pass','test','admin123',
  'root','passw0rd','pa$$word','p@ssword','p@$$word','qwerty123',
  'qwerty1','q1w2e3r4','q1w2e3r4t5','zxcvbnm','asdfgh','asdfghjkl',
  'football','baseball','hockey','batman','superman','michael','charlie',
  'lovely','jennifer','jessica','thomas','password2','password3',
  'trustno1','mustang','solo','hello123','internet','pass1234',
  '1q2w3e4r','1qaz2wsx','qazwsx','123qwe','123abc','1111','2222',
  '9999','4321','7777','6666','11111111','22222222','12345',
  'access','goddess','hunter2','donald','monkey123','flower',
  'number1','pass123','computer','cookie','cheese','orange',
  'banana','purple','rainbow','chocolate','butter','shadow123',
]);

// ─── DICTIONARY WORDS (common words to detect) ────────────────
const DICTIONARY_WORDS = [
  'love','hate','name','home','work','life','time','year','hand','face',
  'door','help','play','show','open','keep','look','make','come','good',
  'great','thank','happy','best','blue','gold','dark','fire','moon','star',
  'bird','fish','bear','lion','wolf','frog','horse','apple','house','chair',
  'table','water','light','night','black','white','green','small','large',
  'super','hyper','mega','ultra','power','speed','force','storm','thunder',
];

// ─── DOM REFS ──────────────────────────────────────────────────
const passwordInput   = document.getElementById('passwordInput');
const toggleVisBtn    = document.getElementById('toggleVisibility');
const charCountEl     = document.getElementById('charCount');
const strengthSection = document.getElementById('strengthSection');
const strengthBadge   = document.getElementById('strengthBadge');
const meterFill       = document.getElementById('meterFill');
const crackTimeEl     = document.getElementById('crackTime');
const entropyEl       = document.getElementById('entropy');
const charSetEl       = document.getElementById('charSet');
const scoreDisplayEl  = document.getElementById('scoreDisplay');
const issuesSection   = document.getElementById('issuesSection');
const issuesList      = document.getElementById('issuesList');
const suggestionsSection = document.getElementById('suggestionsSection');
const suggestionsList = document.getElementById('suggestionsList');
const themeToggle     = document.getElementById('themeToggle');
const toggleIcon      = document.getElementById('toggleIcon');
const toggleLabel     = document.getElementById('toggleLabel');
const generateBtn     = document.getElementById('generateBtn');
const generatedOutput = document.getElementById('generatedOutput');
const generatedPwEl   = document.getElementById('generatedPassword');
const copyBtn         = document.getElementById('copyBtn');
const useBtn          = document.getElementById('useBtn');
const lengthSlider    = document.getElementById('lengthSlider');
const lengthVal       = document.getElementById('lengthVal');
const toast           = document.getElementById('toast');

document.getElementById('year').textContent = new Date().getFullYear();

// ─── THEME TOGGLE ─────────────────────────────────────────────
let currentTheme = localStorage.getItem('theme') || 'dark';
applyTheme(currentTheme);

function applyTheme(theme) {
  document.body.setAttribute('data-theme', theme);
  if (theme === 'light') {
    toggleIcon.textContent = '🌙';
    toggleLabel.textContent = 'Dark Mode';
  } else {
    toggleIcon.textContent = '☀️';
    toggleLabel.textContent = 'Light Mode';
  }
  currentTheme = theme;
  localStorage.setItem('theme', theme);
}

themeToggle.addEventListener('click', () => {
  applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

// ─── SHOW/HIDE PASSWORD ────────────────────────────────────────
let isVisible = false;
toggleVisBtn.addEventListener('click', () => {
  isVisible = !isVisible;
  passwordInput.type = isVisible ? 'text' : 'password';
  toggleVisBtn.title = isVisible ? 'Hide password' : 'Show password';
  const svg = document.getElementById('eyeIcon');
  if (isVisible) {
    svg.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>';
  } else {
    svg.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
  }
});

// ─── PASSWORD ANALYSIS ────────────────────────────────────────
function analyzePassword(pw) {
  const len = pw.length;
  const hasUpper   = /[A-Z]/.test(pw);
  const hasLower   = /[a-z]/.test(pw);
  const hasNumber  = /[0-9]/.test(pw);
  const hasSpecial = /[^A-Za-z0-9]/.test(pw);
  const isCommon   = COMMON_PASSWORDS.has(pw.toLowerCase());
  const hasDictWord = DICTIONARY_WORDS.some(w => pw.toLowerCase().includes(w) && w.length >= 4);
  const hasRepeats = /(.)\1{2,}/.test(pw);
  const hasSequential = /(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789|qwe|wer|ert|rty|tyu|yui|uio|iop|asd|sdf|dfg|fgh|ghj|hjk|jkl|zxc|xcv|cvb|vbn|bnm)/i.test(pw);

  // Character set size
  let charSetSize = 0;
  if (hasLower) charSetSize += 26;
  if (hasUpper) charSetSize += 26;
  if (hasNumber) charSetSize += 10;
  if (hasSpecial) charSetSize += 32;

  // Entropy calculation
  const entropy = charSetSize > 0 ? Math.log2(Math.pow(charSetSize, len)) : 0;

  // Score (0–100)
  let score = 0;
  if (len >= 8)  score += 10;
  if (len >= 12) score += 15;
  if (len >= 16) score += 15;
  if (len >= 20) score += 10;
  if (hasUpper)   score += 10;
  if (hasLower)   score += 10;
  if (hasNumber)  score += 10;
  if (hasSpecial) score += 15;
  if (entropy > 50) score += 5;
  if (isCommon)    score -= 40;
  if (hasDictWord) score -= 10;
  if (hasRepeats)  score -= 10;
  if (hasSequential) score -= 10;
  if (len < 6)   score -= 30;
  score = Math.max(0, Math.min(100, score));

  // Crack time estimate (assuming 10B guesses/sec offline)
  const guessesPerSec = 1e10;
  const combinations = charSetSize > 0 ? Math.pow(charSetSize, len) : 1;
  const seconds = combinations / guessesPerSec;
  let crackTime;
  if (isCommon) crackTime = 'Instantly';
  else if (seconds < 1) crackTime = 'Instantly';
  else if (seconds < 60) crackTime = `${Math.round(seconds)} seconds`;
  else if (seconds < 3600) crackTime = `${Math.round(seconds / 60)} minutes`;
  else if (seconds < 86400) crackTime = `${Math.round(seconds / 3600)} hours`;
  else if (seconds < 2592000) crackTime = `${Math.round(seconds / 86400)} days`;
  else if (seconds < 31536000) crackTime = `${Math.round(seconds / 2592000)} months`;
  else if (seconds < 31536000 * 1000) crackTime = `${Math.round(seconds / 31536000)} years`;
  else if (seconds < 31536000 * 1e9) crackTime = `${(seconds / 31536000).toExponential(1)} years`;
  else crackTime = 'Centuries+';

  // Strength label
  let strength, strengthClass;
  if (score < 30)       { strength = 'Weak';        strengthClass = 'weak'; }
  else if (score < 55)  { strength = 'Medium';      strengthClass = 'medium'; }
  else if (score < 80)  { strength = 'Strong';      strengthClass = 'strong'; }
  else                  { strength = 'Very Strong';  strengthClass = 'vstrong'; }

  // Meter %
  const meterPct = Math.max(5, score);

  // Issues
  const issues = [];
  if (isCommon) issues.push('This is one of the most commonly used passwords — change it immediately');
  if (len < 8) issues.push('Password is too short (minimum 8 characters recommended)');
  if (len >= 8 && len < 12) issues.push('Password is short — 12+ characters significantly improves security');
  if (!hasUpper) issues.push('No uppercase letters detected');
  if (!hasLower) issues.push('No lowercase letters detected');
  if (!hasNumber) issues.push('No numbers detected');
  if (!hasSpecial) issues.push('No special characters (!, @, #, $, etc.) detected');
  if (hasRepeats) issues.push('Repeated characters detected (e.g. "aaa", "111") — avoid these');
  if (hasSequential) issues.push('Sequential pattern detected (e.g. "abc", "123", "qwerty")');
  if (hasDictWord) issues.push('Contains a common dictionary word — this is easier to guess');

  // Suggestions
  const suggestions = [];
  if (!hasSpecial) suggestions.push('Add special characters like !, @, #, $, %, ^, & to dramatically increase strength');
  if (len < 12) suggestions.push('Increase length to at least 12–16 characters for strong protection');
  if (!hasUpper || !hasLower) suggestions.push('Mix uppercase and lowercase letters throughout the password');
  if (!hasNumber) suggestions.push('Sprinkle in numbers, but avoid predictable sequences like "123"');
  if (hasDictWord) suggestions.push('Replace dictionary words with random character sequences or abbreviations');
  if (isCommon || hasRepeats || hasSequential) suggestions.push('Try a passphrase: 4 random words joined by symbols, e.g. "Sun!Boat7Forest#Lamp"');
  if (score >= 75 && suggestions.length === 0) suggestions.push('Excellent! Use a password manager to store it securely and enable 2FA on all accounts');

  return {
    len, hasUpper, hasLower, hasNumber, hasSpecial,
    isCommon, hasDictWord, hasRepeats, hasSequential,
    charSetSize, entropy, score, strength, strengthClass,
    meterPct, crackTime, issues, suggestions
  };
}

// ─── UPDATE UI ─────────────────────────────────────────────────
function updateUI(pw) {
  if (!pw) {
    strengthSection.style.display = 'none';
    charCountEl.textContent = '0 characters';
    return;
  }

  const a = analyzePassword(pw);
  charCountEl.textContent = `${a.len} character${a.len !== 1 ? 's' : ''}`;
  strengthSection.style.display = 'block';

  // Strength badge
  strengthBadge.textContent = a.strength;
  strengthBadge.className = `strength-badge badge-${a.strengthClass}`;

  // Meter color
  const colors = {
    weak: '#ff4757',
    medium: '#ffa502',
    strong: '#2ed573',
    vstrong: '#00e5ff'
  };
  meterFill.style.width = a.meterPct + '%';
  meterFill.style.background = colors[a.strengthClass];

  // Stats
  crackTimeEl.textContent = a.crackTime;
  entropyEl.textContent = `${Math.round(a.entropy)} bits`;
  charSetEl.textContent = `${a.charSetSize} chars`;
  scoreDisplayEl.textContent = `${a.score}/100`;

  // Issues
  issuesList.innerHTML = '';
  if (a.issues.length > 0) {
    issuesSection.style.display = 'block';
    a.issues.forEach(issue => {
      const li = document.createElement('li');
      li.textContent = issue;
      issuesList.appendChild(li);
    });
  } else {
    issuesSection.style.display = 'none';
  }

  // Suggestions
  suggestionsList.innerHTML = '';
  if (a.suggestions.length > 0) {
    suggestionsSection.style.display = 'block';
    a.suggestions.forEach(s => {
      const li = document.createElement('li');
      li.textContent = s;
      suggestionsList.appendChild(li);
    });
  } else {
    suggestionsSection.style.display = 'none';
  }

  // Checklist
  const checks = [
    { id: 'check-length',  pass: a.len >= 12,       label: 'At least 12 characters' },
    { id: 'check-upper',   pass: a.hasUpper,         label: 'Uppercase letters (A–Z)' },
    { id: 'check-lower',   pass: a.hasLower,         label: 'Lowercase letters (a–z)' },
    { id: 'check-number',  pass: a.hasNumber,        label: 'Numbers (0–9)' },
    { id: 'check-special', pass: a.hasSpecial,       label: 'Special characters (!@#$...)' },
    { id: 'check-common',  pass: !a.isCommon,        label: 'Not a common password' },
    { id: 'check-repeat',  pass: !a.hasRepeats,      label: 'No repeated patterns' },
  ];

  checks.forEach(c => {
    const el = document.getElementById(c.id);
    if (!el) return;
    el.className = `check-item ${c.pass ? 'pass' : 'fail'}`;
    const icon = c.pass ? '✓' : '✗';
    el.innerHTML = `<span class="check-icon">${icon}</span> ${c.label}`;
  });

  // GA event
  if (typeof gtag !== 'undefined') {
    gtag('event', 'password_strength_checked', {
      event_category: 'tool',
      event_label: a.strength,
      value: a.score
    });
  }
}

// Listen for input
passwordInput.addEventListener('input', () => updateUI(passwordInput.value));

// ─── PASSWORD GENERATOR ────────────────────────────────────────
const CHARS = {
  upper:   'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower:   'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{}|;:,.<>?'
};

lengthSlider.addEventListener('input', () => {
  lengthVal.textContent = lengthSlider.value;
});

function generatePassword() {
  const length  = parseInt(lengthSlider.value);
  const useUpper   = document.getElementById('inclUpper').checked;
  const useLower   = document.getElementById('inclLower').checked;
  const useNumbers = document.getElementById('inclNumbers').checked;
  const useSymbols = document.getElementById('inclSymbols').checked;

  let pool = '';
  const guaranteed = [];

  if (useUpper)   { pool += CHARS.upper;   guaranteed.push(CHARS.upper[Math.floor(Math.random() * CHARS.upper.length)]); }
  if (useLower)   { pool += CHARS.lower;   guaranteed.push(CHARS.lower[Math.floor(Math.random() * CHARS.lower.length)]); }
  if (useNumbers) { pool += CHARS.numbers; guaranteed.push(CHARS.numbers[Math.floor(Math.random() * CHARS.numbers.length)]); }
  if (useSymbols) { pool += CHARS.symbols; guaranteed.push(CHARS.symbols[Math.floor(Math.random() * CHARS.symbols.length)]); }

  if (!pool) { pool = CHARS.lower + CHARS.upper + CHARS.numbers; }

  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);

  let pw = guaranteed.join('');
  for (let i = guaranteed.length; i < length; i++) {
    pw += pool[arr[i] % pool.length];
  }

  // Shuffle
  const shuffleArr = new Uint32Array(pw.length);
  crypto.getRandomValues(shuffleArr);
  pw = pw.split('').sort((_, __, i = shuffleArr[Math.random() * shuffleArr.length | 0]) => i % 2 - 0.5).join('');
  // Simpler shuffle:
  pw = pw.split('').sort(() => Math.random() - 0.5).join('');

  return pw;
}

generateBtn.addEventListener('click', () => {
  const pw = generatePassword();
  generatedPwEl.textContent = pw;
  generatedOutput.style.display = 'flex';

  if (typeof gtag !== 'undefined') {
    gtag('event', 'password_generated', { event_category: 'tool' });
  }
});

copyBtn.addEventListener('click', () => {
  const pw = generatedPwEl.textContent;
  copyToClipboard(pw);
});

useBtn.addEventListener('click', () => {
  const pw = generatedPwEl.textContent;
  passwordInput.value = pw;
  if (isVisible) passwordInput.type = 'text';
  updateUI(pw);
  passwordInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
  passwordInput.focus();
});

// ─── COPY TO CLIPBOARD ─────────────────────────────────────────
function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(showToast);
  } else {
    const el = document.createElement('textarea');
    el.value = text;
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    showToast();
  }
}

function showToast() {
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}
