# Appwrite connection setup

If you see **"Could not reach server"** or **"Failed to fetch"** when signing up or logging in, the browser is blocking requests to Appwrite (usually CORS). Follow these steps so the app can connect.

## 1. Add your app URL in Appwrite Console

1. Open **[Appwrite Cloud](https://cloud.appwrite.io/)** and sign in.
2. Select your project (the one with ID `69aeeeef002294858f1e`).
3. Go to **Overview** (or **Settings**).
4. Under **Platform** (or **Client**), click **Add platform** → **Web app**.
5. Add **two** hostnames (one per platform if needed):
   - **Hostname 1:** `127.0.0.1`  
     (Do not add `http://` or `:5500` — only the hostname.)
   - **Hostname 2:** `localhost`
6. Save.

## 2. Use the same URL in the browser

- If you added `127.0.0.1`, open the app at **http://127.0.0.1:5500** (or your port).
- If you added `localhost`, open the app at **http://localhost:5500**.

The URL in the address bar must match the hostname you added (either `127.0.0.1` or `localhost`).

## 3. Check project region and endpoint

The app uses the **Frankfurt (FRA)** endpoint: `https://fra.cloud.appwrite.io/v1`.

- In Appwrite Console, check your project’s **region**.
- If the project is **not** in Frankfurt, update the endpoint in **Frontend/js/appwrite.js**:
  - NYC: `https://nyc.cloud.appwrite.io/v1`
  - Sydney: `https://syd.cloud.appwrite.io/v1`
  - Or use the global endpoint: `https://cloud.appwrite.io/v1`

## 4. Collection permissions

For sign up and login to work, the **users** collection must allow unauthenticated access:

1. In your project, go to **Databases** → **users** collection.
2. Open **Settings** or **Permissions**.
3. Ensure **Create** and **Read** are allowed for role **any** (or **guests**).

After these steps, sign up and login should connect to Appwrite. If you still see "Could not reach server", try the global endpoint in step 3 and reload the app.
