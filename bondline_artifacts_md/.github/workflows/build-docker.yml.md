```yaml
name: build-docker
on: [push, workflow_dispatch]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - name: Build & push API
        uses: docker/build-push-action@v5
        with:
          context: ./services/api
          push: true
          tags: ghcr.io/${{ github.repository }}/api:latest
```
