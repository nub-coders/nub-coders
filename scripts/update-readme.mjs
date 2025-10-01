#!/usr/bin/env node
import { readFile, writeFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import https from 'node:https';

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

async function fetchPrivateInclusiveStats(owner) {
  const token = process.env.GH_STATS_TOKEN || process.env.GITHUB_TOKEN || '';
  if (!token) return undefined;

  const query = `
    query {
      viewer {
        login
        contributionsCollection {
          totalCommitContributions
          restrictedContributionsCount
          totalIssueContributions
          totalPullRequestContributions
          totalPullRequestReviewContributions
          contributionCalendar { totalContributions }
        }
        repositories(ownerAffiliations: OWNER, isFork: false, privacy: PUBLIC, first: 100) {
          totalCount
          nodes { stargazerCount primaryLanguage { name } }
        }
        privateRepos: repositories(ownerAffiliations: OWNER, isFork: false, privacy: PRIVATE, first: 100) {
          totalCount
          nodes { stargazerCount }
        }
      }
    }
  `;

  const postData = JSON.stringify({ query });

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'User-Agent': 'nub-coders-stats-script',
      'Content-Length': Buffer.byteLength(postData),
    },
  };

  const body = await new Promise((resolve, reject) => {
    const req = https.request('https://api.github.com/graphql', options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });

  const json = JSON.parse(body);
  if (json.errors) return undefined;
  const v = json.data?.viewer;
  if (!v) return undefined;

  const publicStars = (v.repositories.nodes || []).reduce((sum, r) => sum + (r?.stargazerCount || 0), 0);
  const privateStars = (v.privateRepos.nodes || []).reduce((sum, r) => sum + (r?.stargazerCount || 0), 0);
  const totalStars = publicStars + privateStars;
  const totalRepos = (v.repositories.totalCount || 0) + (v.privateRepos.totalCount || 0);
  const commitsPublic = v.contributionsCollection.totalCommitContributions || 0;
  const commitsPrivate = v.contributionsCollection.restrictedContributionsCount || 0;
  const totalCommits = commitsPublic + commitsPrivate;
  const totalIssues = v.contributionsCollection.totalIssueContributions || 0;
  const totalPRs = v.contributionsCollection.totalPullRequestContributions || 0;
  const totalReviews = v.contributionsCollection.totalPullRequestReviewContributions || 0;
  const totalContributions = v.contributionCalendar.totalContributions || 0;

  return {
    login: v.login,
    totalStars,
    totalRepos,
    totalCommits,
    totalIssues,
    totalPRs,
    totalReviews,
    totalContributions,
  };
}

function formatNumber(n) {
  try { return Intl.NumberFormat('en-US').format(n); } catch { return String(n); }
}

async function buildDynamicStatsBlock(owner, repo) {
  const stats = await fetchPrivateInclusiveStats(owner);
  if (stats) {
    const lines = [
      `- Total Stars (all repos): ${formatNumber(stats.totalStars)}`,
      `- Total Repositories: ${formatNumber(stats.totalRepos)}`,
      `- Total Commits (incl. private): ${formatNumber(stats.totalCommits)}`,
      `- Total PRs: ${formatNumber(stats.totalPRs)}`,
      `- Total Issues: ${formatNumber(stats.totalIssues)}`,
      `- Code Reviews: ${formatNumber(stats.totalReviews)}`,
      `- Contributions (last year): ${formatNumber(stats.totalContributions)}`,
    ];
    return ['<!-- STATS_START -->', ...lines, '<!-- STATS_END -->'].join('\n');
  }

  // Fallback (no token): use badges/cards (public-only aggregation by providers)
  const starsBadge = `![Total Stars](https://img.shields.io/github/stars/${owner}?affiliations=OWNER&label=Total%20Stars&color=yellow)`;
  const topLangs = `![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=${owner}&layout=compact&theme=tokyonight)`;
  const lines = [
    '- ' + starsBadge,
    '- ' + topLangs,
  ];
  return ['<!-- STATS_START -->', ...lines, '', '<!-- STATS_END -->'].join('\n');
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
    const block = await buildDynamicStatsBlock(owner, repo);
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
