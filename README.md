# Ekart

Shop + admin on GitHub Pages. API on Render (free). Database on MongoDB Atlas (free M0).

## Live

- Shop: https://sureshit57.github.io/ekart/
- Admin: https://sureshit57.github.io/ekart/admin/
- API: https://ekart-api.onrender.com

Render free instances sleep when idle. The first request after sleep can take about a minute.

## Local

```bash
cd server && npm install && npm start
cd client && npm install && npm run dev
cd admin && npm install && npm run dev
```

MongoDB local: `mongodb://127.0.0.1:27017/ekart`

## GitHub Pages + Render

1. Create a free Atlas cluster. Network access `0.0.0.0/0`. Copy `MONGODB_URI`.
2. In Render, create a Blueprint from this repo (`render.yaml`). Set `MONGODB_URI`.
3. Repo **Settings → Pages → GitHub Actions**.
4. If the Render URL is not `https://ekart-api.onrender.com`, set GitHub Actions variable `VITE_API_URL` to `https://YOUR-SERVICE.onrender.com/api` and re-run the Pages workflow.

Register on the shop. Create an admin with:

```bash
curl -X POST https://ekart-api.onrender.com/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"name":"Admin","email":"admin@ekart.local","password":"admin123","address":"Store","role":"admin"}'
```
