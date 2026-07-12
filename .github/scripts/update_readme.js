#!/usr/bin/env node
import fs from 'fs';
import { execSync } from 'child_process';

const STATS_URL = process.env.STATS_URL || 'https://nubcoders.com/stats';
const README = 'README.md';
const START = '<!-- GITHUB_STATS_START -->';
const END = '<!-- GITHUB_STATS_END -->';

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function buildMd(stats) {
  const stars = stats.totalStars ?? 0;
  const commits = stats.totalCommits ?? 0;
  const prs = stats.prsMerged ?? 0;
  const repos = stats.totalRepos ?? 0;
  const followers = stats.followers ?? 0;

  const top = Array.isArray(stats.topLanguages) ? stats.topLanguages.slice(0, 7) : [];
  const langs = top
    .map((l) => `${l.name} ${Math.round((l.percentage) * 10) / 10}%`)
    .join(' · ');

  const lines = [
    '### GitHub activity',
    '',
    `**⭐ Stars** ${stars} &nbsp;·&nbsp; **📝 Commits** ${commits} &nbsp;·&nbsp; **✅ PRs merged** ${prs} &nbsp;·&nbsp; **📁 Public repos** ${repos} &nbsp;·&nbsp; **👥 Followers** ${followers}`,
  ];
  if (langs) {
    lines.push('');
    lines.push(`**Top languages:** ${langs}`);
  }

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
