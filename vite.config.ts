name: Deploy Lovable Game

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: |
          npx vite build --base=/voxel-neighborhood/
          mkdir -p _site
          GAME_DIR=$(find . -maxdepth 3 -name "index.html" -not -path "./node_modules/*" -not -path "./_site/*" -printf "%h\n" | head -n 1)
          echo "Found game in: $GAME_DIR"
          cp -r "$GAME_DIR"/* _site/
      - uses: actions/upload-pages-artifact@v3
        with:
          path: _site
      - id: deployment
        uses: actions/deploy-pages@v4
