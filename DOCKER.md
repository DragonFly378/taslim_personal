# Docker Setup for Taslim

This document provides instructions for running Taslim using Docker and Docker Compose.

## Architecture

The Docker setup includes three services:

1. **web** - Next.js application (exposed on port 3000)
2. **db** - MySQL 8.0 database (internal only, not exposed to host)
3. **adminer** - Database management UI (internal only, optional)

### Network Security

- **Published Ports**: Only the main web application is exposed on port **3000**
- **Internal Services**: Database (MySQL) and Adminer are accessible only within the Docker network
- **Network Isolation**: All services communicate via the `taslim-network` bridge network

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+

## Quick Start

### 1. Environment Setup

Copy the Docker environment template:

```bash
cp .env.docker .env
```

Edit `.env` and update the following:

- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `NEXTAUTH_URL` - Set to your production domain (or keep `http://localhost:3000` for local)
- Add OAuth credentials if needed (Google, GitHub)

### 2. Start the Application

Build and start all services:

```bash
docker compose up -d
```

Or use npm scripts:

```bash
npm run docker:up
```

### 3. Access the Application

- **Application**: http://localhost:3000
- **Health Check**: http://localhost:3000/api/health

### 4. View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f web
docker compose logs -f db
```

## Database Management

### Access Database Internally

The database is only accessible from within the Docker network. To connect:

**Option 1: Using Adminer (Recommended)**

Uncomment the ports section in `docker-compose.yml`:

```yaml
adminer:
  ports:
    - "8080:8080"
```

Then restart:

```bash
docker compose restart adminer
```

Access Adminer at: http://localhost:8080

- **System**: MySQL
- **Server**: db
- **Username**: taslim
- **Password**: taslim123
- **Database**: taslim

**Option 2: Using Docker Exec**

```bash
docker compose exec db mysql -u taslim -ptaslim123 taslim
```

**Option 3: Port Forwarding (Temporary)**

```bash
docker compose exec db bash
# Inside container
mysql -u taslim -ptaslim123 taslim
```

### Run Migrations

Migrations run automatically when the web container starts. To run manually:

```bash
docker compose exec web npx prisma db push
```

### Seed Database

```bash
docker compose exec web npm run db:seed
```

## Development Workflow

### Rebuild After Code Changes

```bash
docker compose down
docker compose build
docker compose up -d
```

Or use the npm script:

```bash
npm run docker:build
docker compose up -d
```

### View Real-time Logs

```bash
docker compose logs -f web
```

### Stop Services

```bash
docker compose down
```

### Stop and Remove Volumes (Clean Slate)

```bash
docker compose down -v
```

## Production Deployment

### 1. Update Environment Variables

```bash
# .env
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="<generate-secure-secret>"
DATABASE_URL="mysql://taslim:taslim123@db:3306/taslim"
```

### 2. Build for Production

```bash
docker compose build --no-cache
```

### 3. Deploy

```bash
docker compose up -d
```

### 4. Enable HTTPS

Use a reverse proxy like Nginx or Traefik:

**Example with Nginx:**

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Troubleshooting

### Container Won't Start

Check logs:

```bash
docker compose logs web
docker compose logs db
```

### Database Connection Issues

Verify database is healthy:

```bash
docker compose ps
```

The `db` service should show as `healthy`.

Check database connectivity:

```bash
docker compose exec db mysqladmin ping -h localhost -u root -ppassword
```

### Port Already in Use

Change the published port in `docker-compose.yml`:

```yaml
web:
  ports:
    - "3001:3000"  # Use port 3001 instead
```

### Reset Everything

```bash
docker compose down -v
docker compose build --no-cache
docker compose up -d
```

## Useful Commands

### Check Service Status

```bash
docker compose ps
```

### Restart Specific Service

```bash
docker compose restart web
```

### Execute Commands in Container

```bash
# Shell access
docker compose exec web sh

# Run Prisma commands
docker compose exec web npx prisma studio
```

### View Resource Usage

```bash
docker stats
```

### Inspect Network

```bash
docker network inspect taslim-network
```

## Configuration Reference

### Service Ports

| Service | Internal Port | Published Port | Notes |
|---------|---------------|----------------|-------|
| web     | 3000          | 3000           | Main application |
| db      | 3306          | Not exposed    | Internal only |
| adminer | 8080          | Not exposed    | Optional, can be enabled |

### Environment Variables

See `.env.docker` for all available configuration options.

### Volumes

- `taslim-mysql-data` - Persistent MySQL data storage

## Security Best Practices

1. **Change Default Passwords**: Update MySQL passwords in production
2. **Use Strong Secrets**: Generate NEXTAUTH_SECRET with `openssl rand -base64 32`
3. **Enable HTTPS**: Always use HTTPS in production
4. **Firewall Rules**: Only expose port 3000 (or your custom port)
5. **Regular Updates**: Keep Docker images and dependencies updated
6. **Database Backups**: Implement regular backup strategy

## Backup and Restore

### Backup Database

```bash
docker compose exec db mysqldump -u taslim -ptaslim123 taslim > backup.sql
```

### Restore Database

```bash
docker compose exec -T db mysql -u taslim -ptaslim123 taslim < backup.sql
```

## Support

For issues and questions:
- Check logs: `docker compose logs -f`
- Verify health: http://localhost:3000/api/health
- Review environment variables in `.env`
