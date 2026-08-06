# GitHub Growth Plan — Phased Execution

Derived from `github_audit.md`. Six phases, sequenced so each unlocks the next.
Goal (6 months): 100+ followers, 2–3 repos at 50+ stars, one framework repo at 500+.

---

## Phase 0 — Unblock (Day 1, ~2 hrs) ✅ COMPLETE

Nothing else matters until these are fixed. All are minutes-scale.

- [x] Add MIT `LICENSE` to original repos: nub-coders, MAGISK-FLASHER-V2, nginx-proxy, nubdt, CppGram
  - ⚠️ Correction: Phase 0 also added LICENSE to `quote-api` and `update_payload_extractor`, but both are **forks of unlicensed upstreams** — claiming a new copyright holder over someone else's code is misattribution. Both LICENSE files were **removed** (quote-api `fcd01b7`, update_payload_extractor `1d0324d`).
- [x] Fix portfolio description — remove false "Drizzle ORM" claim, add React/Express
- [x] Add topics to OTPBOT and re-play (currently zero — invisible in search)
- [x] Fill GitHub bio (one-line value prop)
- [x] Drop 3 redundant "portfolio" topic variants on nub-coders

**Exit criteria:** Every *original* repo has a LICENSE; forks correctly inherit their upstream's (absent) license rather than a fabricated one; every repo has ≥6 topics; profile bio non-empty. ✅ Met.

---

## Phase 1 — Make Projects Usable (Week 1, ~12 hrs) ✅ COMPLETE

Projects exist but users can't figure out how to use them.

- [x] Add command reference to nub-music-bot README (commit ae0a9ec)
- [x] Split nubmail docs (already complete from prior session — 97 lines, docs/ folder has 8 .md files)
- [x] Add troubleshooting section to nginx-proxy (commit f80b4fb)
- [x] Add local dev setup to nub-coders README (commit 125d809)
- [x] Document GitHub token scopes for portfolio (commit f7f9626 — corrected to `repo, read:user` only)
- [x] quote-api: fixed 9× domain typos, rewrote description, corrected topics (commit 8f79054). Also removed misattributed LICENSE (commit fcd01b7 — fork can't claim new copyright)
- [x] Add usage examples to kixer (commit 0f8805b)

**Exit criteria:** Every repo README has quick start + usage section. New user can run each project without reading code. ✅ Met.

---

## Phase 2 — Add Visual Proof (Week 2, ~10 hrs)

Text-only READMEs don't convert. Show, don't tell.

**Needed assets** (capture manually, I can't screenshot/record):
- [ ] Screenshot portfolio homepage (https://nubcoders.com — hero section + selected work), add to nub-coders README
- [ ] Screenshot nubmail dashboard (https://mails.nubcoders.com — main interface with domain/email list), add to nubmail README
- [ ] Record GIF: Magisk patcher bot interaction (send boot.img → version picker → patched result)
- [ ] Record GIF: kixer terminal demo (run kixer.py, show size prompt + generation speed for length 2-3)
- [ ] Create diagram: nubmail email flow (SMTP in → PostgreSQL → IMAP/webmail/API out) — can use mermaid or draw.io
- [ ] Screenshot: what the Halvo/Heroku deploy buttons produce (final deployed interface)

**Exit criteria:** Top 5 repos have hero image or GIF in README. Visual proof of quality.

---

## Phase 3 — Community Infrastructure (Week 3, ~8 hrs) ✅ COMPLETE

Signal that contributions are welcome and issues will be handled.

**Completed for nub-music-bot (`6aefffc`), nubmail (`5caa24a`), and nub-userbot (`caf22f4`):**
- ✅ GitHub Discussions enabled (all three — verified `has_discussions=true`)
- ✅ Issue templates (bug report + feature request, 8 valid YAML files total)
- ✅ Issue config (Telegram support link)
- ✅ PR templates (3 repos, checklist verified against real scripts)
- ✅ CONTRIBUTING.md (setup, structure, testing, PR guidelines — all fact-checked)
- ✅ Badges (nub-music-bot: 5 added; nubmail: last-commit added; nub-userbot: already had them)

**Exit criteria:** Repos look maintained. Contributors know how to participate. ✅ Met.

---

## Phase 4 — External Visibility (Week 4, ~6 hrs)

Get outside GitHub's walls. Go where the audience is.

- [ ] Submit nubmail to awesome-selfhosted
- [ ] Submit nginx-proxy to awesome-docker
- [ ] Submit nub-music-bot to awesome-telegram
- [ ] Submit portfolio to awesome-portfolio-websites
- [ ] Post nubmail on r/selfhosted with setup guide
- [ ] Post nginx-proxy on r/docker with use case explanation
- [ ] Cross-link: add "Featured in awesome-X" badges to READMEs once accepted

**Exit criteria:** 4 awesome list PRs submitted. 2 Reddit posts live. First external backlinks.

---

## Phase 5 — Storytelling (Weeks 5-6, ~20 hrs)

Transform project lists into case studies. Tell the full story.

### Portfolio Site Changes

- [ ] Add blog section to nubcoders.com (route, component, layout)
- [ ] Design blog post template (code syntax highlighting, images, TOC)

### Case Studies (add to portfolio projects section)

- [ ] **Halvo case study** (500 words)
  - Problem: Deploying Docker apps requires server + nginx + SSL + monitoring
  - Approach: GitHub webhook → clone → build → deploy pipeline with live logs
  - Outcome: One-click deploys, terminal-style UI, real-time container stats
  - Tech: TypeScript, Docker API, WebSocket, React

- [ ] **NubMail case study** (500 words)
  - Problem: Self-hosted email needs SMTP/IMAP/webmail + DNS + certs
  - Approach: Next.js frontend + custom SMTP/IMAP server + DKIM automation
  - Outcome: Add domain → send/receive email in <5 minutes
  - Tech: Node.js, PostgreSQL, Nodemailer, DNS-01 ACME

- [ ] **YT-DLP API case study** (400 words)
  - Problem: Extracting YouTube streams requires keeping yt-dlp updated, handling rate limits
  - Approach: Async Python API with token auth, per-IP rate limiting, nginx SSL automation
  - Outcome: 10k+ API calls/month, 99.9% uptime
  - Tech: Python, yt-dlp, nginx, Docker

**Exit criteria:** Portfolio projects tell problem → solution → outcome. Visitors understand your thinking, not just your tech stack.

---

## Phase 6 — Content Marketing (Weeks 7-8, ~24 hrs)

Write to teach, rank in search, drive traffic back to GitHub.

### Blog Posts (add to portfolio blog)

- [ ] **"Building a Self-Hosted Email Platform with Next.js"** (2000 words)
  - SMTP/IMAP protocol basics
  - Docker compose setup
  - DKIM/SPF configuration
  - Troubleshooting deliverability
  - Link to nubmail repo throughout

- [ ] **"Telegram Music Bot Architecture: Lessons Learned"** (1800 words)
  - Voice chat streaming challenges
  - Queue management patterns
  - yt-dlp integration best practices
  - Scaling from 10 → 1000 concurrent groups
  - Link to nub-music-bot repo

- [ ] **"Docker Reverse Proxy with Automated SSL"** (1500 words)
  - Why nginx-proxy + ACME companion
  - Virtual host routing explained
  - Common cert issuance failures
  - Wildcard vs per-domain certs
  - Link to nginx-proxy repo

### Distribution

- [ ] Post blog links to r/selfhosted, r/telegram, r/docker (match post to subreddit)
- [ ] Share on Twitter/X (create @nubcoders account first)
- [ ] Submit to HackerNews "Show HN" (start with most unique: nubmail)

**Exit criteria:** 3 blog posts published. 1000+ combined views. 5+ backlinks to GitHub repos.

---

## Phase 7 — Framework Extraction (Weeks 9-12, ~50 hrs)

Single-purpose bot → framework = 10x audience.

### Create nub-music-bot-framework (new repo)

- [ ] Extract core plugin system from nub-music-bot
- [ ] Create plugin interface (on_command, on_callback, on_message hooks)
- [ ] Document plugin API with examples
- [ ] Include 5 reference plugins: YouTube, queue, admin, lyrics, playlist
- [ ] Write comprehensive docs (getting started, plugin development, deployment)
- [ ] Add comparison table: vs telegraf, vs pyTelegramBotAPI, vs python-telegram-bot
- [ ] Emphasize "built for music bots" niche

### Original nub-music-bot becomes reference implementation

- [ ] Update README: "Built with nub-music-bot-framework"
- [ ] Link prominently to framework repo
- [ ] Explain: use this if you want music bot; use framework if you want to build your own

### Launch Strategy

- [ ] Blog post: "Why I Extracted a Telegram Music Bot Framework"
- [ ] Post on r/python, r/telegram
- [ ] Submit to Hacker News "Show HN"
- [ ] Add to awesome-telegram
- [ ] Monitor forks, respond to first issues quickly

**Exit criteria:** Framework repo live with full docs. 200+ stars in first month. nub-music-bot fork-to-star ratio normalizes.

---

## Phase 8 — Product Hunt & Video (Weeks 13-14, ~16 hrs)

Launch portfolio externally. Show instead of describe.

### Product Hunt Launch

- [ ] Prepare portfolio site polish (testimonials if any, performance audit)
- [ ] Create Product Hunt listing (title, tagline, description, images)
- [ ] Record 1-min demo video (portfolio navigation, live projects, contact form)
- [ ] Launch on Product Hunt (Tuesday-Thursday 12:01 AM PST optimal)
- [ ] Monitor and respond to comments throughout launch day

### YouTube Content

- [ ] Record nubmail setup walkthrough (5-8 minutes)
- [ ] Record music bot deployment tutorial (8-10 minutes)
- [ ] Edit videos, add captions, create thumbnails
- [ ] Upload to YouTube with SEO-optimized titles/descriptions
- [ ] Link videos in repo READMEs

**Exit criteria:** Portfolio launched on PH with 200+ upvotes. 2 YouTube videos live with 500+ combined views.

---

## Phase 9 — Organization Structure (Weeks 15-16, ~12 hrs)

Move from personal repos to professional organization.

### Create nubcoders Organization

- [ ] Create GitHub organization @nubcoders
- [ ] Design organization profile README
- [ ] Set up teams (core, contributors)
- [ ] Move top 5 repos to organization (keep redirects)
- [ ] Update all links in portfolio site
- [ ] Add organization logo/avatar

### Benefits

- Professional structure signal
- Team collaboration infrastructure
- Cleaner repo URLs (github.com/nubcoders/project vs github.com/nub-coders/project)
- Separation of personal vs project identity

**Exit criteria:** Organization live with 5+ repos, professional README, redirects working.

---

## Phase 10 — Documentation Site (Weeks 17-18, ~20 hrs)

Centralize all documentation at docs.nubcoders.com.

### Build Docs Site

- [ ] Choose framework (VitePress or Docusaurus)
- [ ] Set up docs.nubcoders.com subdomain
- [ ] Migrate documentation from individual READMEs
- [ ] Add tutorial sections for each major project
- [ ] Add API reference for framework
- [ ] Add troubleshooting knowledge base
- [ ] Deploy (Vercel/Netlify/Cloudflare Pages)

### Structure

```
docs.nubcoders.com/
  getting-started/
  nubmail/
    quick-start
    configuration
    deployment
    troubleshooting
  music-bot-framework/
    installation
    plugin-development
    api-reference
  nginx-proxy/
    setup
    ssl-configuration
  blog/
    (link to portfolio blog)
```

**Exit criteria:** Comprehensive docs site live, linked from all repos.

---

## Phase 11 — Sustained Promotion (Weeks 19-24, ongoing)

Maintain momentum with consistent content and community engagement.

### Twitter/X Presence

- [ ] Create @nubcoders account
- [ ] Write introduction thread (who, what projects, why self-hosting matters)
- [ ] Post project showcases (1-2x per week)
- [ ] Engage with Docker, Telegram, self-hosting communities
- [ ] Share blog posts when published

### Additional Blog Posts

- [ ] "Docker Reverse Proxy Setup with Automated SSL" (1500 words)
- [ ] "Telegram Bot Framework Comparison: When to Choose What" (1800 words)
- [ ] "Self-Hosting in 2026: My Complete Stack" (2000 words)
- [ ] "From 0 to 100 GitHub Stars: What Actually Worked" (retrospective)

### Community Engagement

- [ ] Answer questions in GitHub Discussions
- [ ] Respond to Reddit comments/questions
- [ ] Monitor HackerNews mentions
- [ ] Help users in relevant Discord/Slack communities
- [ ] Feature user success stories

**Exit criteria:** Active Twitter presence, 1 blog post per month, responsive community engagement.

---

## Success Metrics & Checkpoints

### Month 3 Checkpoint

**Target:**
- 30+ GitHub followers (from 20)
- 100+ combined stars across all repos
- 3 blog posts published
- 5+ awesome list inclusions
- 2000+ monthly portfolio visitors

**If behind:** Double down on visual assets and external promotion (Reddit, HN).

### Month 6 Final Review

**Target:**
- 100+ GitHub followers
- 2-3 repos with 50+ stars
- 1 framework repo with 500+ stars
- 5000+ monthly portfolio visitors
- Top 3 Google results for target keywords
- 10+ backlinks to GitHub repos

**Success Indicators:**
- Organic issue submissions from external users
- Unsolicited stars/forks from developers you don't know
- Blog posts getting shared without your promotion
- Inbound collaboration requests

---

## Critical Success Factors

### What Will Make This Work

1. **Consistency** — Weekly execution beats sporadic bursts
2. **Visual proof** — Screenshots/GIFs convert skeptics instantly
3. **Storytelling** — Case studies > feature lists
4. **Distribution** — Content without promotion = invisible
5. **Responsiveness** — Fast replies to first issues/PRs build community

### What Will Derail This

1. **Perfectionism** — "I'll write that blog post when..." = never ships
2. **Feature creep** — Adding features instead of marketing existing ones
3. **Ignoring metrics** — Not tracking what drives stars/traffic
4. **Solo isolation** — Not engaging with communities where users are
5. **Abandoning after slow start** — Growth compounds; month 1 feels slow, month 6 accelerates

---

## Emergency Pivots

### If Stars Aren't Growing After 3 Months

**Diagnose:**
- Are READMEs still text-only? → Add screenshots immediately
- Are you posting to Reddit/HN? → External promotion is non-negotiable
- Is documentation still overwhelming? → Simplify to 5-line quick starts

**Action:**
- Pick ONE repo, make it visually perfect (screenshots, demo GIF, case study)
- Launch it on Product Hunt + Reddit same week
- Measure what converts (stars per visitor)
- Replicate winning formula across other repos

### If Traffic Isn't Converting to Stars

**Diagnose:**
- Check README bounce rate (analytics)
- Are visitors scrolling or leaving immediately?
- Is quick start actually quick (< 5 commands)?

**Action:**
- A/B test README structure (hero image first vs feature list first)
- Add "⭐ Star this repo if it helped" CTA
- Embed demo GIF above the fold

---

## Time Investment Summary

| Phase | Duration | Hours | Cumulative |
|-------|----------|-------|------------|
| Phase 0: Unblock | Day 1 | 2 | 2 |
| Phase 1: Usability | Week 1 | 12 | 14 |
| Phase 2: Visuals | Week 2 | 10 | 24 |
| Phase 3: Community | Week 3 | 8 | 32 |
| Phase 4: External | Week 4 | 6 | 38 |
| Phase 5: Storytelling | Weeks 5-6 | 20 | 58 |
| Phase 6: Content | Weeks 7-8 | 24 | 82 |
| Phase 7: Framework | Weeks 9-12 | 50 | 132 |
| Phase 8: Product Hunt | Weeks 13-14 | 16 | 148 |
| Phase 9: Organization | Weeks 15-16 | 12 | 160 |
| Phase 10: Docs Site | Weeks 17-18 | 20 | 180 |
| Phase 11: Ongoing | Weeks 19-24 | ~4/week | 204 |

**Total: ~200 hours over 6 months (7-8 hours/week)**

---

## Next Steps

1. **Start Phase 0 today** — Add licenses, fix descriptions (2 hours)
2. **Schedule Phase 1** — Block 2 hours, 6x over next week
3. **Order screenshots** — Week 2 is visual assets; prep now (identify what to capture)
4. **Bookmark communities** — Reddit, awesome lists you'll submit to

**The audit is done. The plan is clear. Now execute.**
