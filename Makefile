# ASM Investments — landing site tasks.
# Prereqs: Node 22+ and pnpm (run: corepack enable).
# Run `make` (or `make help`) to list targets.

PKG := pnpm

.DEFAULT_GOAL := help
.PHONY: help install dev build preview serve check assets clean reinstall

help: ## List available targets
	@grep -hE '^[a-zA-Z_-]+:.*## ' $(MAKEFILE_LIST) | sort | sed -E 's/:.*## /|/' | awk -F'|' '{printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies (pnpm)
	$(PKG) install

dev: ## Start the dev server with hot reload (http://localhost:4321)
	$(PKG) dev

build: ## Production build: type-check + build into dist/
	$(PKG) build

preview: build ## Build for production, then serve it locally to preview
	$(PKG) preview --host

serve: ## Serve the existing production build without rebuilding
	$(PKG) preview --host

check: ## Type-check only (astro check)
	$(PKG) check

assets: ## Regenerate placeholder favicons + OG image from the brand monogram
	node scripts/gen-assets.mjs

clean: ## Remove build output and Astro cache (dist/, .astro/)
	rm -rf dist .astro

reinstall: clean ## Clean, remove node_modules, and reinstall
	rm -rf node_modules
	$(PKG) install
