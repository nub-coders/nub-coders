#!/usr/bin/env node
import { readFile, writeFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
// Node 18+ has global fetch; if not present, user should run on Node 18+

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

async function fetchGraphQL(token, query, variables = {}) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`GitHub GraphQL error: ${res.status} ${res.statusText} - ${text}`);
  }
  const json = await res.json();
  if (json.errors) {
    throw new Error(`GitHub GraphQL errors: ${JSON.stringify(json.errors)}`);
  }
  return json.data;
}

async function collectOwnerWideStats(owner) {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
  if (!token) return null;

  // We can only get private contributions if the token belongs to the same user
  const viewerData = await fetchGraphQL(token, `query { viewer { login } }`);
  const viewerLogin = viewerData?.viewer?.login || '';
  const isSelf = viewerLogin.toLowerCase() === String(owner).toLowerCase();
  if (!isSelf) return null;

  const from = '2008-01-01T00:00:00Z';
  const to = new Date().toISOString();

  // Sum stars across all owned repositories (public + private), excluding forks
  let starsTotal = 0;
  let repoCountPublic = 0;
  let repoCountPrivate = 0;
  let cursor = null;
  for (;;) {
    const data = await fetchGraphQL(
      token,
      `query($owner: String!, $after: String) {
        user(login: $owner) {
          repositories(ownerAffiliations: OWNER, isFork: false, first: 100, after: $after) {
            totalCount
            pageInfo { hasNextPage endCursor }
            nodes { stargazerCount isPrivate }
          }
        }
      }`,
      { owner, after: cursor }
    );
    const repos = data?.user?.repositories;
    if (!repos) break;
    for (const r of repos.nodes || []) {
      starsTotal += Number(r.stargazerCount || 0);
      if (r.isPrivate) repoCountPrivate += 1; else repoCountPublic += 1;
    }
    if (repos.pageInfo?.hasNextPage) {
      cursor = repos.pageInfo.endCursor;
    } else {
      break;
    }
  }

  // Contributions across entire timeline (approx) including private
  const contrib = await fetchGraphQL(
    token,
    `query($owner: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $owner) {
        contributionsCollection(from: $from, to: $to) {
          totalCommitContributions
          totalIssueContributions
          totalPullRequestContributions
          totalPullRequestReviewContributions
          totalRepositoryContributions
          restrictedContributionsCount
        }
      }
    }`,
    { owner, from, to }
  );

  const c = contrib?.user?.contributionsCollection || {};
  const totals = {
    starsTotal,
    repositoriesTotal: repoCountPublic + repoCountPrivate,
    repositoriesPrivate: repoCountPrivate,
    repositoriesPublic: repoCountPublic,
    totalCommitContributions: Number(c.totalCommitContributions || 0) + Number(c.restrictedContributionsCount || 0),
    totalIssueContributions: Number(c.totalIssueContributions || 0),
    totalPullRequestContributions: Number(c.totalPullRequestContributions || 0),
    totalPullRequestReviewContributions: Number(c.totalPullRequestReviewContributions || 0),
    totalRepositoryContributions: Number(c.totalRepositoryContributions || 0),
  };
  return totals;
}

function buildDynamicStatsBlock(owner, repo, stats) {
  // If authenticated owner-wide stats are available, render detailed figures
  if (stats) {
    const lines = [
      `- Total Stars (owned repos): ${stats.starsTotal}`,
      `- Repositories: ${stats.repositoriesTotal} (public: ${stats.repositoriesPublic}, private: ${stats.repositoriesPrivate})`,
      `- Commits (incl. private): ${stats.totalCommitContributions}`,
      `- Pull Requests: ${stats.totalPullRequestContributions}`,
      `- Issues: ${stats.totalIssueContributions}`,
      `- Code Reviews: ${stats.totalPullRequestReviewContributions}`,
      `- Repos Created: ${stats.totalRepositoryContributions}`,
    ];
    return ['<!-- STATS_START -->', ...lines, '<!-- STATS_END -->'].join('\n');
  }

  // Fallback: public badges/cards
  const statsCard = `![GitHub Stats](https://github-readme-stats.vercel.app/api?username=${owner}&show_icons=true&theme=tokyonight&count_private=true)`;
  const langsCard = `![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=${owner}&layout=compact&theme=tokyonight)`;
  return ['<!-- STATS_START -->', statsCard, langsCard, '<!-- STATS_END -->'].join('\n');
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
    let stats = null;
    try {
      stats = await collectOwnerWideStats(owner);
    } catch (e) {
      // ignore and fall back to public cards
    }
    const block = buildDynamicStatsBlock(owner, repo, stats);
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
