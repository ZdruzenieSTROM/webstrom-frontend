# GitHub Actions Workflows

This directory contains our CI/CD workflows for automated deployment.

## Architecture

```
┌─────────────────────────┐     ┌─────────────────────────┐
│   deploy-test.yml       │     │   deploy-prod.yml       │
│   (12 lines)            │     │   (12 lines)            │
└───────────┬─────────────┘     └───────────┬─────────────┘
            │                               │
            └─────────────┬─────────────────┘
                          │
                          ▼
                ┌─────────────────────┐
                │ reusable-deploy.yml │
                │   (90 lines)        │
                │                     │
                │ • Build Docker image│
                │ • Push to GHCR      │
                │ • Deploy via Docker │
                └─────────────────────┘
```

## Workflows

### `deploy-test.yml` & `deploy-prod.yml`

Simple trigger workflows that call the reusable workflow with environment-specific parameters.

### `reusable-deploy.yml`

The main workflow that handles:

1. **Building** the Docker image with buildx
2. **Pushing** to GitHub Container Registry (ghcr.io)
3. **Deploying** to the server via SSH using `docker run`

## Key Features

- **No Docker Compose**: Uses direct `docker run` commands for simplicity
- **Named containers**: Containers are named `webstrom-frontend-test` or `webstrom-frontend-prod`
- **Zero-downtime deploys**: Old container is stopped/removed before starting new one
- **Environment-specific tags**: Images are tagged as `test-<sha>` or `prod-<sha>`
- **Automatic cleanup**: Old images are pruned after deployment
- **Error handling**: Deployment fails properly if any step fails

## Why No Docker Compose?

For single-container deployments, Docker Compose adds unnecessary complexity. Direct `docker run` commands are:

- Simpler and more direct
- Faster (no file parsing)
- Industry standard for single containers
- Easier to debug

## Environment Configuration

| Environment | Container Name         | Port | Backend Port | Domain        |
| ----------- | ---------------------- | ---- | ------------ | ------------- |
| Test        | webstrom-frontend-test | 8922 | 8920         | test.strom.sk |
| Production  | webstrom-frontend-prod | 8932 | 8930         | strom.sk      |

## Deployment Process

1. **Build**: Creates optimized Docker image
2. **Tag**: Tags with environment and commit SHA
3. **Push**: Uploads to GitHub Container Registry
4. **Deploy**: Runs on server with environment-specific config

## Notes

- Images are stored in GitHub Container Registry (free for public repos)
- The `compose-test.yaml` and `compose-prod.yaml` files are no longer used
- Containers run with `--network host` for direct network access
- Containers automatically restart on failure with `--restart always`
