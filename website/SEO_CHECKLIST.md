# Quick SEO Checklist - CrackFrontend

## ✅ Automatic (No Action Needed)

These happen automatically on every build:

- [x] Sitemap generation (`sitemap.xml`)
- [x] Robots.txt generation
- [x] Content.json regeneration
- [x] Structured data (JSON-LD) on all pages
- [x] Meta tags (title, description, keywords)
- [x] OpenGraph and Twitter cards
- [x] Canonical URLs

## 🔄 When Adding New Content

**1. Create Markdown File**
```bash
# Add your file in the appropriate directory
/js/utils/new_utility.md
/dsa/arrays/new_problem.md
```

**2. Run Content Generation** (local testing)
```bash
cd website
npm run generate
```

**3. Verify in Dev**
```bash
npm run dev
# Visit http://localhost:3000/resource/[your-path]
```

**4. Commit & Push**
```bash
git add .
git commit -m "Add [topic] article"
git push
```

**5. Automatic on Deploy**
- Vercel automatically runs `npm run build`
- Build includes `npm run generate`
- Sitemap is regenerated
- New pages are indexed

## 🎯 For Better Rankings

### Content Quality
- [ ] Use target keywords in H1 (title)
- [ ] Include keyword in first paragraph
- [ ] Use related keywords in H2/H3 headings
- [ ] Write 1500+ words for in-depth articles
- [ ] Add practical code examples
- [ ] Include real interview questions

### Frontmatter Optimization
```markdown
---
title: Your SEO-Optimized Title
description: Compelling 150-char description with keywords
tags: javascript, interview, react
difficulty: medium
author: Your Name
date: 2026-05-20
---
```

### Internal Linking
- Link to 3-5 related articles within content
- Use descriptive anchor text (not "click here")
- Link from high-traffic pages to new content

## 📊 Monitoring (Google Search Console)

**Setup** (One-time)
1. Go to https://search.google.com/search-console
2. Add property: `https://crackfrontend.in`
3. Verify ownership (add code to `layout.tsx` line 79)
4. Submit sitemap: `https://crackfrontend.in/sitemap.xml`

**Weekly Checks**
- [ ] Check "Coverage" for indexing errors
- [ ] Review "Performance" for top queries
- [ ] Monitor "Enhancements" for mobile usability
- [ ] Check "Core Web Vitals" for page speed

## 🚀 Growth Tactics

### Keyword Strategy
Target these high-value search terms:
1. **"crack frontend interview"** - Brand keyword
2. **"[specific topic] interview questions"** - e.g., "react hooks interview questions"
3. **"how to [solve problem]"** - e.g., "how to implement debounce"
4. **"[topic] explained"** - e.g., "promises explained"

### Content Types to Add
- [ ] Interview question lists (20+ questions with answers)
- [ ] Step-by-step tutorials with code
- [ ] Comparison articles ("X vs Y")
- [ ] "Complete guide to [topic]" articles
- [ ] Cheat sheets and quick references

### Distribution
- [ ] Share on Twitter with relevant hashtags
- [ ] Post on LinkedIn with context
- [ ] Submit to Reddit r/webdev (with value, not spam)
- [ ] Cross-post to dev.to, Hashnode, Medium
- [ ] Answer Quora questions with links to relevant articles

## 🐛 Troubleshooting

### "My new article isn't showing up in search"
1. **Wait 1-2 weeks** - Google needs time to crawl
2. **Check indexing**: Search `site:crackfrontend.in your-article-title`
3. **Request indexing**: Use Google Search Console "URL Inspection"
4. **Verify sitemap**: Check if URL is in `sitemap.xml`

### "Sitemap isn't updating"
1. **Check build logs**: Verify `npm run generate` runs
2. **Clear cache**: Vercel edge cache may need clearing
3. **Verify timestamp**: Check `lastmod` in sitemap.xml
4. **Re-submit**: Submit sitemap again in Search Console

### "Rankings dropped"
1. **Check for errors**: Google Search Console > Coverage
2. **Review content**: Ensure quality hasn't decreased
3. **Check competition**: Others may have better content now
4. **Update content**: Refresh old articles with new information

## 📈 Success Metrics

Track these monthly:
- **Total Impressions** (goal: 10K → 50K → 100K)
- **Average Position** (goal: top 10 for key terms)
- **Click-Through Rate** (goal: 3% → 5% → 8%)
- **Total Indexed Pages** (goal: match total articles)
- **Top Landing Pages** (optimize these first)

## 🎓 Resources

- [SEO_GUIDE.md](./SEO_GUIDE.md) - Comprehensive SEO documentation
- [Google Search Console](https://search.google.com/search-console)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [PageSpeed Insights](https://pagespeed.web.dev/)

---

**Questions?** Check `SEO_GUIDE.md` or open an issue.
