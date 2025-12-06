# Comprehensive Guide: Deploying Next.js to cPanel (Application Manager)

This guide covers the **complete workflow** for hosting a Next.js application on a cPanel/WHM server using **Phusion Passenger (Application Manager)**. 

This is the industry-standard way to host Node.js on cPanel when the "Setup Node.js App" (CloudLinux) selector is not available.

---

## Phase 1: Server Setup (WHM Root Admin)

*Ignore this phase if you are a standard user and your specific server is already configured.*

If you are the server administrator, you must enable Node.js support first.

1.  **Install Dependencies via EasyApache 4:**
    *   Log in to **WHM** as root.
    *   Go to **EasyApache 4** -> **Customize**.
    *   **Apache Modules:** Search for and enable **`mod_passenger`**.
    *   **Additional Packages:** Search for and enable **`nodejs20`** (and `nodejs18` as backup).
    *   **Review** and **Provision**.

2.  **Enable Application Manager:**
    *   In WHM, go to **Feature Manager**.
    *   Edit the `default` feature list.
    *   Search for **Application Manager** and check the box to enable it.
    *   Save.

---

## Phase 2: Local Project Preparation

Before uploading, prepare your code to be compatible with cPanel's Passenger.

### 1. Create the Startup File (`app.js`)
cPanel Application Manager strictly expects the entry file to be named `app.js`.

Create a file named `app.js` in your project root with this content:

```javascript
/* app.js */
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;
// initialize next.js
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
```

### 2. Build the Project
Run the build command locally to generate the optimized `.next` folder.
```bash
npm run build
```

### 3. ZIP the Project
Create a ZIP file containing **ONLY** these items:
*   `app.js`
*   `.next` (Folder)
*   `public` (Folder)
*   `package.json`
*   `next.config.mjs` (or .js)
*   `.env.local` (If you have environment variables)

> **CRITICAL:** Do **NOT** include `node_modules` in the ZIP. We will install them on the server to prevent errors.

---

## Phase 3: Deployment on cPanel

### 1. Clean File Structure
Do not upload files directly to `public_html` mixed with other files.
1.  Go to **File Manager**.
2.  Click **+ Folder** in the home directory (`/home/username/`).
3.  Name it exactly as your domain or app name, e.g., `sigitechnologies.cloud`.

### 2. Upload and Extract
1.  Open the folder you just created.
2.  **Upload** your project ZIP.
3.  **Extract** it properly.
    *   *Check:* You should see `app.js` and `package.json` directly in this folder.

### 3. Install Dependencies (Terminal)
This is the most important step. Without this, the app crashes.
1.  Go to **cPanel Terminal**.
2.  Navigate to your app folder:
    ```bash
    cd sigitechnologies.cloud
    ```
3.  Install dependencies:
    ```bash
    npm install --production
    ```

### 4. Register in Application Manager
1.  Go to **cPanel -> Application Manager**.
2.  Click **Register Application**.
3.  **Application Name:** `nextjs` (or any name).
4.  **Deployment Domain:** Select your main domain (e.g., `sigitechnologies.cloud`).
5.  **Application Path:** Enter the folder name you created (e.g., `sigitechnologies.cloud`).
6.  **Deployment Environment:** `Production`.
7.  Click **Deploy**.

---

## Phase 4: Verification & Troubleshooting

### The "Hello World" Test
If your app crashes with a 500 error, verify the server is working by temporarily replacing `app.js` with this simple test code:

```javascript
/* Simple Test app.js */
const http = require('http');
const port = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
  res.end('Hello! Application Manager is working!');
});
server.listen(port);
```
If this works, your server setup is perfect, and the issue is likely in your React code or missing `node_modules`.

### Checking Logs
If the site fails, **NEVER** guess. Check the log:
1.  Go to File Manager -> Your App Folder.
2.  Look for **`stderr.log`**.
3.  View the content to see the exact error message.

### Common Issues
*   **Missing `.next` folder**: You forgot to upload the build.
*   **Missing `node_modules`**: You forgot to run `npm install` on the server.
*   **Wrong Startup File**: You named it `server.js` but Application Manager is looking for `app.js`.
