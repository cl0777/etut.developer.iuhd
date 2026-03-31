# Ubuntu 20.04 deployment (Bilim Portal)

## 1. System packages

```bash
sudo apt update
sudo apt install -y nginx postgresql postgresql-contrib ufw curl git build-essential
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

## 2. PostgreSQL

```bash
sudo -u postgres createuser --interactive   # app user
sudo -u postgres createdb bilim_portal
```

Set `DATABASE_URL` in `backend/.env` (see `backend/.env.example`).

## 3. Application

```bash
cd /var/www
sudo git clone <your-repo> bilim-portal
cd bilim-portal/backend
cp .env.example .env
# edit .env: DATABASE_URL, JWT_SECRET, CORS_ORIGIN=https://your-domain
npm ci
npx prisma generate
npx prisma migrate deploy   # or prisma db push for first deploy
npx prisma db seed
npm run build
```

## 4. Frontend build

```bash
cd /var/www/bilim-portal/frontend
# Optional: VITE_API_URL=https://your-domain  (empty if same-origin /api)
npm ci
npm run build
sudo mkdir -p /var/www/bilim-portal/frontend/dist
# copy dist to web root if different from repo path
```

## 5. PM2 (zero-downtime friendly)

```bash
cd /var/www/bilim-portal
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup   # follow printed instructions
```

Use `pm2 reload bilim-api` after deploys for graceful restart.

## 6. Nginx

```bash
sudo cp deploy/nginx-bilim-portal.example.conf /etc/nginx/sites-available/bilim-portal
sudo ln -sf /etc/nginx/sites-available/bilim-portal /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

HTTPS: `sudo apt install certbot python3-certbot-nginx` then `sudo certbot --nginx`.

## 7. Firewall (UFW)

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status verbose
```

## 8. SSH hardening (summary)

- Disable password auth if using keys; set `PasswordAuthentication no` in `sshd_config`.
- Use fail2ban or similar for brute-force protection.
- Keep system packages updated.
