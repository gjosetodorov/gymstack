# Gymstack (Docker)

This project can be run locally using Docker Compose.

## Quick start

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:9999

## Notes

- Database data is stored in a named Docker volume (`db_data`).
- Uploaded files are stored on the host in `./uploads`.

## GitHub Actions CI/CD

On every push to `main`, the workflow in `.github/workflows/ci-cd.yml` builds and pushes Docker images for the backend and frontend.

### Required secrets

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

### Optional variables

- `PUBLIC_API_BASE_URL` (e.g., `https://your-domain.example:9999`)
- `APP_CORS_ALLOWED_ORIGINS` (e.g., `https://your-domain.example`)

### Optional deploy (CD)

If you want the deploy step to run, add the following secrets:

- `DEPLOY_HOST`
- `DEPLOY_USER`
- `DEPLOY_KEY` (SSH private key)
- `POSTGRES_PASSWORD`

The deploy step copies `docker-compose.prod.yml` to the server and runs `docker compose up -d` using the pushed image tag.
