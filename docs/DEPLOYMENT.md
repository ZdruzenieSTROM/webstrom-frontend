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

| Environment | Trigger                    | Domain        | Port | Container Name                  |
| ----------- | -------------------------- | ------------- | ---- | ------------------------------- |
| Test        | Manual (workflow_dispatch) | test.strom.sk | 8922 | webstrom-test_webstrom-frontend |
| Production  | Manual (workflow_dispatch) | strom.sk      | 8932 | webstrom-prod_webstrom-frontend |

## Bridge networks

Test uses `webstrom-test-network`; production uses `webstrom-prod-network`.
Each environment has its own Docker bridge network. Both the backend
and frontend deployment workflows ensure it exists before replacing containers;
whichever deploys first creates it. Creation tolerates the other workflow creating
it concurrently. Neither workflow deletes the network. Docker retains it across
container replacements and host restarts.

| Connection                 | Test address                                     | Production address                               |
| -------------------------- | ------------------------------------------------ | ------------------------------------------------ |
| Host nginx to frontend     | `127.0.0.1:8922` → container port `3000`         | `127.0.0.1:8932` → container port `3000`         |
| Host nginx to backend      | `127.0.0.1:8920` → container port `8000`         | `127.0.0.1:8930` → container port `8000`         |
| Frontend server to backend | `http://backend:8000` on `webstrom-test-network` | `http://backend:8000` on `webstrom-prod-network` |

Next.js binds to `0.0.0.0:3000` inside its isolated container; the published host
port is restricted to localhost. Browser API calls continue through nginx, and
forwarded host/protocol headers remain `test.strom.sk` / `strom.sk` and `https`. No nginx
or PostgreSQL configuration changes are needed.

For the first migration of each environment, deploy the matching backend branch
**before** the frontend branch. The old host-networked frontend can still use the
published backend port,
but the new frontend requires the backend's `backend` network alias. For rollback
to host networking, roll back the frontend first, then the backend. Redeploying an
older image alone does not restore the old network settings: use the corresponding
older deployment workflow as well.

The workflows retain independent releases using an explicitly shared network.
This follows Docker's [user-defined bridge network guidance](https://docs.docker.com/engine/network/drivers/bridge/)
and [localhost port publishing](https://docs.docker.com/engine/network/port-publishing/).
Containerizing the shared nginx would require broader proxy and TLS changes, so nginx
remains on the host.

## Docker Image Tags

Images are tagged with the following pattern:

- `ghcr.io/zdruzeniestrom/webstrom-frontend:{env}-{sha}` - Specific version
- `ghcr.io/zdruzeniestrom/webstrom-frontend:{env}-latest` - Latest version
- `ghcr.io/zdruzeniestrom/webstrom-frontend:buildcache` - Build cache

Where:

- `{env}` is either `test` or `prod`
- `{sha}` is the first 7 characters of the git commit SHA

## Environment Variables

The frontend container receives these environment variables:

| Variable             | Description              | Test Example    | Production Example | Required |
| -------------------- | ------------------------ | --------------- | ------------------ | -------- |
| `PORT`               | Frontend server port     | `3000`          | `3000`             | Yes      |
| `HOSTNAME`           | Container listen address | `0.0.0.0`       | `0.0.0.0`          | Yes      |
| `BE_PROTOCOL`        | Backend protocol         | `http`          | `http`             | Yes      |
| `BE_HOSTNAME`        | Backend hostname         | `backend`       | `backend`          | Yes      |
| `BE_PORT`            | Backend port             | `8000`          | `8000`             | Yes      |
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
docker logs webstrom-test_webstrom-frontend  # Test
docker logs webstrom-prod_webstrom-frontend  # Production

# Restart container
docker restart webstrom-test_webstrom-frontend  # Test
docker restart webstrom-prod_webstrom-frontend  # Production

# Stop container
docker stop webstrom-test_webstrom-frontend  # Test
docker stop webstrom-prod_webstrom-frontend  # Production
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
docker stop webstrom-test_webstrom-frontend
docker rm webstrom-test_webstrom-frontend
docker run -d \
  --name webstrom-test_webstrom-frontend \
  --label "com.docker.compose.project=webstrom-test" \
  --label "com.docker.compose.service=webstrom-frontend" \
  --network webstrom-test-network \
  --publish 127.0.0.1:8922:3000 \
  --restart always \
  -e PORT=3000 \
  -e HOSTNAME=0.0.0.0 \
  -e BE_PROTOCOL=http \
  -e BE_HOSTNAME=backend \
  -e BE_PORT=8000 \
  -e BE_FORWARDED_HOST=test.strom.sk \
  -e BE_FORWARDED_PROTO=https \
  -e DEBUG_SERVER=false \
  ghcr.io/zdruzeniestrom/webstrom-frontend:test-{previous-sha}
```

## Troubleshooting

### Container not starting

Check logs:

```bash
docker logs webstrom-test_webstrom-frontend  # Test
docker logs webstrom-prod_webstrom-frontend  # Production
```

### Network issues

Verify the container uses `webstrom-test-network` or `webstrom-prod-network` for its environment:

```bash
docker inspect webstrom-test_webstrom-frontend | grep NetworkMode
```

### Environment variables

Check current environment variables:

```bash
docker exec webstrom-test_webstrom-frontend env | grep -E '^(PORT|BE_|DEBUG_)'
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
