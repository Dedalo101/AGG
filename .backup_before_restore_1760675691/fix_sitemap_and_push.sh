#!/usr/bin/env bash
set -u

WORK=/workspaces/AGG
S="$WORK/sitemap.xml"
INDEX="$WORK/index.html"
ROBOTS="$WORK/robots.txt"
mkdir -p "$WORK"

# backups
[ -f "$S" ] && cp -a "$S" "$S.bak.$(date +%s)" || true
[ -f "$INDEX" ] && cp -a "$INDEX" "$INDEX.bak.$(date +%s)" || true

# write clean sitemap.xml
cat > "$S" <<XML
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://agg.homes/</loc>
    <lastmod>2025-10-17</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
XML

# remove obvious injected shell/command text from index.html (best-effort)
if [ -f "$INDEX" ]; then
  # remove lines containing common paste artifacts
  sed -i.bak -E /bash
