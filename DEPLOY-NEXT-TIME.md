# KoruzApi: deploy on VPS

Same style as CatalogApi.

## Paths

| What | Path |
|------|------|
| Source | `/var/www/KoruzApi` |
| Runtime (publish) | `/var/www/KoruzApi/publish` |
| SQLite data | `/var/www/KoruzApi_Data` |
| Port | `127.0.0.1:5140` |
| systemd | `koruzapi.service` |

## First-time setup

```bash
# 1) Clone
mkdir -p /var/www
cd /var/www
git clone https://github.com/IConanEdogawa/bronto.git KoruzApi

# 2) Data directory
mkdir -p /var/www/KoruzApi_Data
chmod 755 /var/www/KoruzApi_Data

# 3) Publish
cd /var/www/KoruzApi/KoruzApi
mkdir -p /var/www/KoruzApi/publish
/root/.dotnet/dotnet publish KoruzApi.csproj -c Release -o /var/www/KoruzApi/publish

# 4) systemd
cp /var/www/KoruzApi/deploy/koruzapi.service /etc/systemd/system/koruzapi.service
# Edit passwords in the unit if needed:
# nano /etc/systemd/system/koruzapi.service
systemctl daemon-reload
systemctl enable koruzapi
systemctl start koruzapi
systemctl status koruzapi --no-pager -l

# 5) nginx (optional, when domain is ready)
cp /var/www/KoruzApi/deploy/nginx-koruzapi.conf /etc/nginx/sites-available/koruzapi
# Edit YOUR_DOMAIN
nano /etc/nginx/sites-available/koruzapi
ln -s /etc/nginx/sites-available/koruzapi /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
# HTTPS:
# certbot --nginx -d YOUR_DOMAIN -d www.YOUR_DOMAIN
```

## Next-time deploy (after code changes)

```bash
cd /var/www/KoruzApi
git pull --ff-only origin main

cd /var/www/KoruzApi/KoruzApi
mkdir -p /var/www/KoruzApi/publish
/root/.dotnet/dotnet publish KoruzApi.csproj -c Release -o /var/www/KoruzApi/publish

sudo systemctl restart koruzapi
sudo systemctl status koruzapi --no-pager -l
```

## Verify

```bash
curl -s http://127.0.0.1:5140/api/sitecontent | head
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:5140/admin-login.html
```

## Important rules

- Do not run from `bin/Debug` or `bin/Release` — only from `publish/`.
- Keep Kestrel on `127.0.0.1:5140`, not `0.0.0.0`.
- Put real admin passwords in systemd Environment vars, not in git.
- Data stays in `/var/www/KoruzApi_Data` (survives republish).
