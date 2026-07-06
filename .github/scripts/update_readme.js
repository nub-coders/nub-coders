#!/usr/bin/env node
import fs from 'fs';
import { execSync } from 'child_process';

const STATS_URL = process.env.STATS_URL || 'https://deplox.nubcoder.com/stats';
const README = 'README.md';
const START = '<!-- GITHUB_STATS_START -->';
const END = '<!-- GITHUB_STATS_END -->';

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function buildMd(stats) {
  const user = stats.username || 'user';
  const stars = stats.totalStars ?? 0;
  const commits = stats.totalCommits ?? 0;
  const prs = stats.prsMerged ?? 0;
  const repos = stats.totalRepos ?? 0;

  const langColor = {
    TypeScript: '3178c6', Python: '3572A5', JavaScript: 'f7df1e', HTML: 'e34c26', CSS: '0284c7', Dockerfile: '2496ED', Shell: '4EAA25', Rust: 'b7410e', 'C++': '1572B6', React: '0891b2', Vue: '41b883', 'Next.js': '000000'
  };

  const lines = [];
  lines.push('<div align="center">');
  lines.push('');
  lines.push('## 📊 GITHUB STATS');
  lines.push('');
  lines.push('</div>');
  lines.push('');
  lines.push('<div align="center">');
  lines.push("  <img src=\"https://capsule-render.vercel.app/api?type=rect&color=0d1117&height=3&section=header&render=true\" width=\"60%\" />");
  lines.push('</div>');
  lines.push('');
  lines.push('');
  lines.push('<div align="center">');
  lines.push('');
  lines.push(`![Stars](https://img.shields.io/badge/⭐%20Stars-${stars}-f72585?style=for-the-badge&labelColor=1a1a2e)`);
  lines.push(`![Commits](https://img.shields.io/badge/📝%20Commits-${commits}-a78bfa?style=for-the-badge&labelColor=1a1a2e)`);
  lines.push(`![PRs](https://img.shields.io/badge/✅%20PRs%20Merged-${prs}-0078d4?style=for-the-badge&labelColor=1a1a2e)`);
  lines.push(`![Repos](https://img.shields.io/badge/📁%20Repos-${repos}-4cc9f0?style=for-the-badge&labelColor=1a1a2e)`);
  lines.push(`![Followers](https://img.shields.io/github/followers/${user}?label=Followers&style=for-the-badge&color=4cc9f0&labelColor=1a1a2e)`);
  lines.push('');
  lines.push('</div>');
  lines.push('');
  lines.push('<div align="center">');
  lines.push('');
  lines.push('**🌐 Top Languages**');
  lines.push('');
  const top = Array.isArray(stats.topLanguages) ? stats.topLanguages.slice(0, 7) : [];
  top.forEach((l) => {
    const name = l.name;
    const pct = (Math.round((l.percentage) * 10) / 10).toString();
    const color = langColor[name] ?? '333333';
    lines.push(`![${name}](https://img.shields.io/badge/${encodeURIComponent(name)}-${encodeURIComponent(pct)}%25-${color}?style=flat-square)`);
  });
  lines.push('');
  lines.push('</div>');
  lines.push('');
  lines.push('<div align="center">\n  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,14,20&height=120&section=footer&animation=fadeIn" width="100%" />\n</div>');

  return lines.join('\n');
}

async function run() {
  console.log(`Fetching stats from ${STATS_URL}`);
  let stats;
  try {
    stats = await fetchJson(STATS_URL);
  } catch (err) {
    console.error('Failed to fetch stats:', err?.message ?? err);
    process.exit(1);
  }

  const md = buildMd(stats);

  let readme = '';
  try {
    readme = fs.readFileSync(README, 'utf8');
  } catch (err) {
    console.error('Failed to read README.md:', err?.message ?? err);
    process.exit(1);
  }

  const startIdx = readme.indexOf(START);
  const endIdx = readme.indexOf(END);
  let newReadme;

  // Prefer to replace an existing marked block
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    newReadme = readme.slice(0, startIdx + START.length) + '\n\n' + md + '\n\n' + readme.slice(endIdx);

    // Also remove any earlier manual `## 📊 GITHUB STATS` block to avoid duplicates
    const manualHeaderIdx = readme.indexOf('## 📊 GITHUB STATS');
    if (manualHeaderIdx !== -1 && manualHeaderIdx < startIdx) {
      const manualDivStart = readme.lastIndexOf('<div align="center">', manualHeaderIdx);
      const footerImg = 'https://capsule-render.vercel.app/api?type=waving';
      const manualFooterIdx = readme.indexOf(footerImg, manualHeaderIdx);
      if (manualDivStart !== -1 && manualFooterIdx !== -1) {
        const manualClose = readme.indexOf('</div>', manualFooterIdx);
        const manualDivEnd = manualClose !== -1 ? manualClose + '</div>'.length : manualFooterIdx;
        if (manualDivEnd > manualDivStart) {
          // manual block is before the marked block so indices are safe to remove from newReadme
          newReadme = newReadme.slice(0, manualDivStart) + newReadme.slice(manualDivEnd);
        }
      }
    }
  } else {
    // If no marked block, try to find an earlier manual `## 📊 GITHUB STATS` section
    const headerIdx = readme.indexOf('## 📊 GITHUB STATS');
    if (headerIdx !== -1) {
      // find the containing <div align="center"> that precedes the header
      const divStart = readme.lastIndexOf('<div align="center">', headerIdx);
      // find the footer image that typically follows the stats block (capsule wave)
      const footerImg = 'https://capsule-render.vercel.app/api?type=waving';
      const footerIdx = readme.indexOf(footerImg, headerIdx);
      let divEnd = -1;
      if (footerIdx !== -1) {
        // find the closing </div> after the footer image
        const closeDiv = readme.indexOf('</div>', footerIdx);
        divEnd = closeDiv !== -1 ? closeDiv + '</div>'.length : footerIdx;
      }

      if (divStart !== -1 && divEnd !== -1 && divEnd > divStart) {
        newReadme = readme.slice(0, divStart) + '\n\n' + START + '\n\n' + md + '\n\n' + END + '\n' + readme.slice(divEnd);
      } else {
        // fallback: append markers at end
        newReadme = readme + '\n\n' + START + '\n\n' + md + '\n\n' + END + '\n';
      }
    } else {
      // append markers if no header found
      newReadme = readme + '\n\n' + START + '\n\n' + md + '\n\n' + END + '\n';
    }
  }

  if (newReadme === readme) {
    console.log('README.md already up to date; nothing to commit.');
    return;
  }

  fs.writeFileSync(README, newReadme, 'utf8');

  try {
    execSync('git config user.name "github-actions[bot]"');
    execSync('git config user.email "github-actions[bot]@users.noreply.github.com"');
    execSync('git add README.md');
    execSync('git commit -m "chore: update GitHub stats [skip ci]"');
    execSync('git push');
    console.log('Updated README.md and pushed changes.');
  } catch (err) {
    console.error('Git commit/push failed:', err?.message ?? err);
    process.exit(1);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
