# Deployment Guide

This guide covers the deployment process for the webstrom-frontend application.

## Overview

The frontend is deployed using GitHub Actions workflows that:

1. Build Docker images using the official `docker/build-push-action@v6`
2. Push images to GitHub Container Registry (ghcr.io)
3. Deploy to server.strom.sk via SSH
4. Run containers with appropriate configuration

## Architecture

The deployment uses a reusable workflow pattern:

- **Reusable workflow**: `.github/workflows/reusable-deploy.yml` - Contains all build and deployment logic
- **Environment workflows**: Call the reusable workflow with environment-specific parameters
  - `.github/workflows/deploy-test.yml` - Test environment deployment
  - `.github/workflows/deploy-prod.yml` - Production environment deployment

## Environments

| Environment | Trigger                    | Domain        | Port | Container Name                    |
| ----------- | -------------------------- | ------------- | ---- | --------------------------------- |
| Test        | Manual (workflow_dispatch) | test.strom.sk | 8922 | webstrom-test_webstrom-frontend_1 |
| Production  | Manual (workflow_dispatch) | strom.sk      | 8932 | webstrom-prod_webstrom-frontend_1 |

## Docker Image Tags

Images are tagged with the following pattern:

- `ghcr.io/zdrueniestrom/webstrom-frontend:{env}-{sha}` - Specific version
- `ghcr.io/zdrueniestrom/webstrom-frontend:{env}-latest` - Latest version
- `ghcr.io/zdrueniestrom/webstrom-frontend:buildcache` - Build cache

Where:

- `{env}` is either `test` or `prod`
- `{sha}` is the first 7 characters of the git commit SHA

## Environment Variables

The frontend container receives these environment variables:

| Variable             | Description              | Test Example    | Production Example | Required |
| -------------------- | ------------------------ | --------------- | ------------------ | -------- |
| `PORT`               | Frontend server port     | `8922`          | `8932`             | Yes      |
| `BE_PROTOCOL`        | Backend protocol         | `http`          | `http`             | Yes      |
| `BE_HOSTNAME`        | Backend hostname         | `localhost`     | `localhost`        | Yes      |
| `BE_PORT`            | Backend port             | `8920`          | `8930`             | Yes      |
| `BE_FORWARDED_HOST`  | X-Forwarded-Host header  | `test.strom.sk` | `strom.sk`         | Yes      |
| `BE_FORWARDED_PROTO` | X-Forwarded-Proto header | `https`         | `https`            | Yes      |
| `DEBUG_SERVER`       | Enable debug logging     | `false`         | `false`            | No       |

## Deployment Workflow

### Manual Deployment (Current Setup)

Both test and production deployments are triggered manually:

1. Go to GitHub Actions → Deploy Test/Production Environment
2. Click "Run workflow"
3. Select the branch and click "Run workflow"
4. GitHub Actions will:
   - Build the Docker image using `docker/build-push-action@v6`
   - Push to ghcr.io with appropriate tags
   - Deploy to server via SSH
   - Replace the running container

### Build Process

The build uses Docker's official GitHub Actions:

- `docker/setup-buildx-action@v3` - Sets up Docker Buildx
- `docker/login-action@v3` - Authenticates with GitHub Container Registry
- `docker/build-push-action@v6` - Builds and pushes the image with caching

### Caching Strategy

The build process uses multiple cache sources for optimal performance:

- **Registry cache**: Dedicated cache image (`buildcache` tag)
- **Latest image cache**: Previous builds' inline cache
- **Inline cache**: Cache metadata embedded in the image layers (`BUILDKIT_INLINE_CACHE=1`)

## Server Access

The deployment uses SSH to `webstrom@server.strom.sk`. The SSH key is stored as a GitHub secret `WEBSTROM_DEPLOY_SSH_PRIVATE_KEY`.

## Container Management

Containers follow Docker Compose naming conventions for compatibility:

```bash
# View running containers
docker ps | grep webstrom

# View logs
docker logs webstrom-test_webstrom-frontend_1  # Test
docker logs webstrom-prod_webstrom-frontend_1  # Production

# Restart container
docker restart webstrom-test_webstrom-frontend_1  # Test
docker restart webstrom-prod_webstrom-frontend_1  # Production

# Stop container
docker stop webstrom-test_webstrom-frontend_1  # Test
docker stop webstrom-prod_webstrom-frontend_1  # Production
```

## Container Labels

Containers are labeled for organization:

- `com.docker.compose.project`: Project name (e.g., `webstrom-test`)
- `com.docker.compose.service`: Service name (always `webstrom-frontend`)

## Rollback

To rollback to a previous version:

1. Find the previous image tag in GitHub Packages (ghcr.io)
2. SSH to the server: `ssh webstrom@server.strom.sk`
3. Run the container with the previous image:

```bash
# Test environment example
docker stop webstrom-test_webstrom-frontend_1
docker rm webstrom-test_webstrom-frontend_1
docker run -d \
  --name webstrom-test_webstrom-frontend_1 \
  --label "com.docker.compose.project=webstrom-test" \
  --label "com.docker.compose.service=webstrom-frontend" \
  --network host \
  --restart always \
  -e PORT=8922 \
  -e BE_PROTOCOL=http \
  -e BE_HOSTNAME=localhost \
  -e BE_PORT=8920 \
  -e BE_FORWARDED_HOST=test.strom.sk \
  -e BE_FORWARDED_PROTO=https \
  -e DEBUG_SERVER=false \
  ghcr.io/zdrueniestrom/webstrom-frontend:test-{previous-sha}
```

## Troubleshooting

### Container not starting

Check logs:

```bash
docker logs webstrom-test_webstrom-frontend_1  # Test
docker logs webstrom-prod_webstrom-frontend_1  # Production
```

### Network issues

Verify the container is using host network:

```bash
docker inspect webstrom-test_webstrom-frontend_1 | grep NetworkMode
```

### Environment variables

Check current environment variables:

```bash
docker exec webstrom-test_webstrom-frontend_1 env | grep -E '^(PORT|BE_|DEBUG_)'
```

### GitHub Actions issues

1. Check workflow runs in the Actions tab
2. Verify secrets are set correctly:
   - `WEBSTROM_DEPLOY_SSH_PRIVATE_KEY` - SSH key for deployment
   - `GITHUB_TOKEN` - Automatically provided for registry access

### Registry access

The workflows use GitHub Container Registry (ghcr.io). Images are public and can be pulled without authentication.

## Future Improvements

- [ ] Enable automatic deployment on push to main branch (currently commented out)
- [ ] Add health checks to ensure zero-downtime deployments
- [ ] Implement automatic rollback on deployment failure
- [ ] Add deployment notifications (Slack/Discord)
