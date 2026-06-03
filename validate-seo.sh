#!/bin/bash

# SEO Validation Script for CrackFrontend
# This script validates that all SEO configurations are working correctly

echo "🔍 CrackFrontend SEO Validation"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get script directory and change to repository root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "1️⃣ Checking robots.txt configuration..."
if [ -f "website/public/robots.txt" ]; then
    echo -e "${RED}❌ FAIL: Static robots.txt found in public/ directory${NC}"
    echo "   This file shadows the dynamic Next.js route!"
    echo "   Delete: website/public/robots.txt"
else
    echo -e "${GREEN}✅ PASS: No static robots.txt (using dynamic route)${NC}"
fi

echo ""
echo "2️⃣ Checking dynamic robots route..."
if [ -f "website/app/robots.ts" ]; then
    echo -e "${GREEN}✅ PASS: Dynamic robots.ts found${NC}"
    if grep -q "sitemap.*crackfrontend.in/sitemap.xml" website/app/robots.ts; then
        echo -e "${GREEN}✅ PASS: Sitemap URL configured${NC}"
    else
        echo -e "${YELLOW}⚠️  WARNING: Check sitemap URL in robots.ts${NC}"
    fi
else
    echo -e "${RED}❌ FAIL: Missing website/app/robots.ts${NC}"
fi

echo ""
echo "3️⃣ Checking sitemap configuration..."
if [ -f "website/app/sitemap.ts" ]; then
    echo -e "${GREEN}✅ PASS: Dynamic sitemap.ts found${NC}"
else
    echo -e "${RED}❌ FAIL: Missing website/app/sitemap.ts${NC}"
fi

if [ -f "website/public/sitemap.xml" ]; then
    URL_COUNT=$(grep -c "<loc>" website/public/sitemap.xml)
    echo -e "${GREEN}✅ PASS: Static sitemap.xml generated with $URL_COUNT URLs${NC}"
else
    echo -e "${RED}❌ FAIL: Missing website/public/sitemap.xml${NC}"
fi

echo ""
echo "4️⃣ Checking Google verification..."
if grep -q "googlea0eeb32e8b967aa2" website/app/layout.tsx; then
    echo -e "${GREEN}✅ PASS: Google verification code in layout.tsx${NC}"
else
    echo -e "${RED}❌ FAIL: Missing Google verification in layout.tsx${NC}"
fi

if [ -f "website/public/googlea0eeb32e8b967aa2.html" ]; then
    echo -e "${GREEN}✅ PASS: Google verification HTML file exists${NC}"
else
    echo -e "${YELLOW}⚠️  WARNING: Missing verification HTML file${NC}"
fi

echo ""
echo "5️⃣ Checking canonical URLs..."
PAGES_TO_CHECK=(
    "website/app/layout.tsx"
    "website/app/library/page.tsx"
    "website/app/about/page.tsx"
    "website/app/contact/page.tsx"
    "website/app/privacy/page.tsx"
    "website/app/terms/page.tsx"
)

CANONICAL_MISSING=0
for page in "${PAGES_TO_CHECK[@]}"; do
    if [ -f "$page" ]; then
        if grep -q "canonical" "$page"; then
            echo -e "${GREEN}✅ $page${NC}"
        else
            echo -e "${RED}❌ $page (missing canonical)${NC}"
            CANONICAL_MISSING=$((CANONICAL_MISSING + 1))
        fi
    fi
done

if [ $CANONICAL_MISSING -eq 0 ]; then
    echo -e "${GREEN}✅ PASS: All pages have canonical URLs${NC}"
else
    echo -e "${RED}❌ FAIL: $CANONICAL_MISSING pages missing canonical URLs${NC}"
fi

echo ""
echo "6️⃣ Checking structured data..."
if [ -f "website/src/lib/structured-data.ts" ]; then
    echo -e "${GREEN}✅ PASS: Structured data library exists${NC}"
else
    echo -e "${RED}❌ FAIL: Missing structured-data.ts${NC}"
fi

if grep -q "generateWebSiteSchema" website/app/page.tsx; then
    echo -e "${GREEN}✅ PASS: Homepage has structured data${NC}"
else
    echo -e "${RED}❌ FAIL: Homepage missing structured data${NC}"
fi

echo ""
echo "7️⃣ Checking metadata..."
if grep -q "metadataBase" website/app/layout.tsx; then
    echo -e "${GREEN}✅ PASS: metadataBase configured${NC}"
else
    echo -e "${RED}❌ FAIL: Missing metadataBase${NC}"
fi

if grep -q "openGraph" website/app/layout.tsx; then
    echo -e "${GREEN}✅ PASS: OpenGraph metadata configured${NC}"
else
    echo -e "${RED}❌ FAIL: Missing OpenGraph metadata${NC}"
fi

echo ""
echo "================================"
echo "📊 Summary"
echo "================================"
echo ""
echo "To complete SEO setup:"
echo "1. Deploy these changes to production"
echo "2. Submit sitemap to Google Search Console"
echo "3. Request indexing for key pages"
echo "4. Monitor crawl errors and fix issues"
echo ""
echo "Useful commands:"
echo "  cd website && npm run build    # Build with SEO"
echo "  cd website && npm run generate # Regenerate sitemap"
echo ""
echo "✅ Validation complete!"
