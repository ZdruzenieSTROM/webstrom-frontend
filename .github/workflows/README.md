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
- **Named containers**: Matches existing naming: `webstrom-test_webstrom-frontend_1` or `webstrom-prod_webstrom-frontend_1`
- **Compose-compatible labels**: Containers include Docker Compose labels for proper grouping in UIs
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

**Note**: We maintain the Docker Compose naming convention (`webstrom-test_webstrom-frontend_1`) and add compose labels for consistency with the existing backend and static services that still use Docker Compose. This ensures proper grouping in Docker UIs.

## Environment Configuration

| Environment | Container Name                    | Port | Backend Port | Domain        |
| ----------- | --------------------------------- | ---- | ------------ | ------------- |
| Test        | webstrom-test_webstrom-frontend_1 | 8922 | 8920         | test.strom.sk |
| Production  | webstrom-prod_webstrom-frontend_1 | 8932 | 8930         | strom.sk      |

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
- Container names match existing Docker Compose convention for consistency with backend and static services
- The `_1` suffix is kept to maintain compatibility with existing monitoring/management scripts

## Build Caching

The workflow uses **registry-based caching** for fast builds:

1. **Cache sources**: Previous builds and a dedicated cache image
2. **Smart Dockerfile layering**: Dependencies are cached separately from source code
3. **Result**: Yarn dependencies are only reinstalled when `package.json` or `yarn.lock` changes

Typical rebuild times:

- With cache hit (no dependency changes): ~30-60 seconds
- Without cache (first build or dependency changes): ~2-3 minutes
