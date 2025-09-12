#!/usr/bin/env node
import { readFile, writeFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';

const repoEnv = process.env.GITHUB_REPOSITORY || '';
const ownerEnv = process.env.GITHUB_REPOSITORY_OWNER || (repoEnv.split('/')[0] || '');
let [owner, repo] = repoEnv.includes('/') ? repoEnv.split('/') : [ownerEnv, ''];

function detectOwnerRepoFromContent(content) {
  let detectedOwner = '';
  let detectedRepo = '';

  const profileMatch = content.match(/https:\/\/github\.com\/([\w-]+)/);
  if (profileMatch) detectedOwner = profileMatch[1];

  const repoBadgeMatch = content.match(/img\.shields\.io\/github\/(?:issues|issues-pr|commit-activity)\/y?\/([\w-]+)\/([\w.-]+)/);
  if (repoBadgeMatch) {
    detectedOwner = repoBadgeMatch[1] || detectedOwner;
    detectedRepo = repoBadgeMatch[2] || detectedRepo;
  }

  const statsUserMatch = content.match(/github-readme-stats\.vercel\.app\/api\?[^\s\"]*?username=([^&\s\"]+)/);
  if (statsUserMatch && !detectedOwner) detectedOwner = statsUserMatch[1];

  const streakUserMatch = content.match(/github-readme-streak-stats\.herokuapp\.com\/\?[^\s\"]*?user=([^&\s\"]+)/);
  if (streakUserMatch && !detectedOwner) detectedOwner = streakUserMatch[1];

  return { detectedOwner, detectedRepo };
}

function replacerFactory(owner, repo) {
  const patterns = [
    // github-readme-stats username param
    {
      re: /(github-readme-stats\.vercel\.app\/api\?[^\s\"]*?username=)([^&\s\"]+)/g,
      replace: `$1${owner}`,
    },
    // streak stats user param
    {
      re: /(github-readme-streak-stats\.herokuapp\.com\/\?[^\s\"]*?user=)([^&\s\"]+)/g,
      replace: `$1${owner}`,
    },
    // komarev profile views username param
    {
      re: /(komarev\.com\/ghpvc\/\?[^\s\"]*?username=)([^&\s\"]+)/g,
      replace: `$1${owner}`,
    },
    // Shields: stars for user
    {
      re: /(img\.shields\.io\/github\/stars\/)([\w-]+)/g,
      replace: `$1${owner}`,
    },
    // Shields: issues-pr for repo
    {
      re: /(img\.shields\.io\/github\/issues-pr\/)([\w-]+)\/([\w.-]+)/g,
      replace: `$1${owner}/${repo}`,
    },
    // Shields: issues for repo
    {
      re: /(img\.shields\.io\/github\/issues\/)([\w-]+)\/([\w.-]+)/g,
      replace: `$1${owner}/${repo}`,
    },
    // Shields: commit-activity for repo
    {
      re: /(img\.shields\.io\/github\/commit-activity\/y\/)([\w-]+)\/([\w.-]+)/g,
      replace: `$1${owner}/${repo}`,
    },
    // GitHub profile link
    {
      re: /(https:\/\/github\.com\/)([\w-]+)\/?(\)|\]|\s|\/)*/g,
      replace: (_m, p1) => `${p1}${owner}/`,
    },
  ];

  return (content) => patterns.reduce((acc, { re, replace }) => acc.replace(re, replace), content);
}

function buildDynamicStatsBlock(owner, repo) {
  const starsBadge = `![Total Stars](https://img.shields.io/github/stars/${owner}?affiliations=OWNER&label=Total%20Stars&color=yellow)`;
  const commitsBadge = repo
    ? `![Total Commits (last 12 months)](https://img.shields.io/github/commit-activity/y/${owner}/${repo}?label=Total%20Commits&color=blue)`
    : '';
  const prsBadge = repo
    ? `![PRs](https://img.shields.io/github/issues-pr/${owner}/${repo}?label=PRs&color=blueviolet)`
    : '';
  const issuesBadge = repo
    ? `![Issues](https://img.shields.io/github/issues/${owner}/${repo}?label=Issues&color=red)`
    : '';
  const contributedBadge = `![Contributed to](https://img.shields.io/badge/dynamic/json?color=orange&label=Contributed%20to&query=%24.total&url=https%3A%2F%2Fapi.github.com%2Fusers%2F${owner}%2Frepos)`;

  const lines = [
    '- ' + starsBadge,
  ];
  if (commitsBadge) lines.push('- ' + commitsBadge);
  if (prsBadge) lines.push('- ' + prsBadge);
  if (issuesBadge) lines.push('- ' + issuesBadge);
  lines.push('- ' + contributedBadge);

  return ['<!-- STATS_START -->', ...lines, '<!-- STATS_END -->'].join('\n');
}

async function fileExists(p) {
  try {
    await access(p, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function processReadme(readmePath) {
  if (!(await fileExists(readmePath))) return { path: readmePath, changed: false };

  let content = await readFile(readmePath, 'utf8');
  const original = content;

  // Determine owner/repo if not provided via env
  if (!owner) {
    const { detectedOwner, detectedRepo } = detectOwnerRepoFromContent(content);
    if (detectedOwner) owner = detectedOwner;
    if (!repo && detectedRepo) repo = detectedRepo;
  }

  // Safe fallbacks if detection failed
  if (!owner) owner = 'nub-coders';
  if (!repo) repo = 'nub-coders';

  // Replace usernames and repo paths in badges/images/links
  if (owner) {
    const replace = replacerFactory(owner, repo);
    content = replace(content);
  }

  // Update the STATS block if markers exist
  const startTag = '<!-- STATS_START -->';
  const endTag = '<!-- STATS_END -->';
  if (content.includes(startTag) && content.includes(endTag) && owner) {
    const block = buildDynamicStatsBlock(owner, repo);
    const blockRe = new RegExp(
      `${startTag.replace(/[.*+?^${}()|[\]\\]/g, r => `\\${r}`)}[\s\S]*?${endTag.replace(/[.*+?^${}()|[\]\\]/g, r => `\\${r}`)}`,
      'm'
    );
    content = content.replace(blockRe, block);
  }

  if (content !== original) {
    await writeFile(readmePath, content, 'utf8');
    return { path: readmePath, changed: true };
  }
  return { path: readmePath, changed: false };
}

async function main() {
  const targets = [
    path.join('README.md'),
    path.join('portfolio', 'README.md'),
  ];

  const results = [];
  for (const t of targets) {
    // eslint-disable-next-line no-await-in-loop
    results.push(await processReadme(t));
  }

  const summary = results.map(r => `${r.path}: ${r.changed ? 'updated' : 'no changes'}`).join('\n');
  console.log(summary);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
