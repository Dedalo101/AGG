#!/usr/bin/env bash
set -u

WORK=/workspaces/AGG
CNAME_DOMAIN="agg.homes"
SITEMAP_PATH="sitemap.xml"

# helpers
info(){ printf "%s\n" "$*"; }
warn(){ printf "WARN: %s\n" "$*"; }
err(){ printf "ERROR: %s\n" "$*" >&2; }

# determine repo owner/repo from git remote
REMOTE="$(git -C "$WORK" remote get-url origin 2>/dev/null || true)"
if [ -z "$REMOTE" ]; then
  err "No git origin remote found in $WORK. Ensure repository is connected to GitHub."
else
  OWNER_REPO="$(printf "%s" "$REMOTE" | sed -E "s#^(git@github.com:|https://github.com/)?([^/]+/[^/.]+).*#\2#")"
  info "Repo: $OWNER_REPO (remote: $REMOTE)"
fi

# ensure CNAME file in repo root matches domain
CNAME_FILE="$WORK/CNAME"
if [ -f "$CNAME_FILE" ]; then
  CURRENT_CNAME="$(tr -d rn < "$CNAME_FILE" || true)"
else
  CURRENT_CNAME=""
fi

if [ "$CURRENT_CNAME" != "$CNAME_DOMAIN" ]; then
  info "Updating CNAME -> $CNAME_DOMAIN (backup saved if existed)"
  [ -f "$CNAME_FILE" ] && cp -a "$CNAME_FILE" "$CNAME_FILE.bak.$(date +%s)" || true
  printf "%s\n" "$CNAME_DOMAIN" > "$CNAME_FILE"
  cd "$WORK" || exit 0
  git init >/dev/null 2>&1 || true
  git add CNAME >/dev/null 2>&1 || true
  git commit -m "Ensure CNAME -> $CNAME_DOMAIN" >/dev/null 2>&1 || true
  git config pull.rebase false >/dev/null 2>&1 || true
  if git remote get-url origin >/dev/null 2>&1; then
    git fetch origin >/dev/null 2>&1 || true
    git pull --no-rebase -s recursive -X theirs origin main >/dev/null 2>&1 || true
    git push origin main >/dev/null 2>&1 || warn "git push failed or not configured"
  else
    warn "No origin remote to push CNAME to."
  fi
else
  info "CNAME already set to $CNAME_DOMAIN"
fi

# configure GitHub Pages custom domain via gh if available
if command -v gh >/dev/null 2>&1 && [ -n "$OWNER_REPO" ]; then
  if gh auth status >/dev/null 2>&1; then
    info "Checking GitHub Pages config via gh..."
    gh api "repos/$OWNER_REPO/pages" 2>/dev/null || true
    # attempt to set custom domain (best-effort)
    info "Setting Pages custom domain to $CNAME_DOMAIN (best-effort)"
    gh api -X PUT "repos/$OWNER_REPO/pages" -f cname="$CNAME_DOMAIN" >/dev/null 2>&1 || warn "gh api failed to set pages cname (maybe not permitted)"
  else
    warn "gh is installed but not authenticated (gh auth login required to update Pages)."
  fi
else
  warn "gh not available or repo unknown — cannot update GitHub Pages settings automatically."
fi

# DNS checks
info "DNS: A records for $CNAME_DOMAIN"
dig +short "$CNAME_DOMAIN" A || true
info "DNS: CNAME for $CNAME_DOMAIN"
dig +short "$CNAME_DOMAIN" CNAME || true
info "DNS: NS for $CNAME_DOMAIN"
dig +short "$CNAME_DOMAIN" NS || true

# detect Cloudflare by nameserver
NS_LIST="$(dig +short "$CNAME_DOMAIN" NS | tr n 
