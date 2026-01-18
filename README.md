# Lab 3 - Scan & Fix Vulnerable Code (OWASP Juice Shop)

This repository contains my work for **Lab 3: Scan & Fix vulnerable code**, based on the OWASP Juice Shop project.

## Project Setup

### 1) Clone repository
```bash
git clone https://github.com/juice-shop/juice-shop.git
cd juice-shop
```

### 2) Install dependencies
```bash
npm install
```

### 3) Start application
```bash
npm start
```

The application should be available at:
- http://localhost:3000

---

## Static Analysis (Semgrep)

### Run scan
```bash
semgrep scan --config auto
```

### Scan results
- Before fixes: **41 findings**
- After fixes: **38 findings**

---

## Fixes Implemented

### 1) SQL Injection (routes/search.ts)
**Issue:** User input was concatenated directly into a SQL query (risk of SQL injection).  
**Fix:** Replaced string concatenation with a parameterized query using Sequelize `replacements`.

File modified:
- `routes/search.ts`

---

### 2) Path Traversal / Unsafe File Access (routes/fileServer.ts)
**Issue:** User-controlled file name was used to build file paths, potentially allowing path traversal.  
**Fix:** Restricted file names to prevent `/` and `\`, and served files using `sendFile` with a fixed `root` directory.

File modified:
- `routes/fileServer.ts`

---

### 3) Redirect Hardening (routes/redirect.ts)
**Issue:** Redirect target URL was user-controlled (risk of open redirect patterns).  
**Fix:** Hardened validation logic by parsing the target with `URL`, enforcing `https` only, and keeping allowlist validation.

File modified:
- `routes/redirect.ts`

---

## Branch
All changes are available in:
- `feature/sast-fixes`
