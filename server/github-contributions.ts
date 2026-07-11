const GRAPHQL = "https://api.github.com/graphql";

export interface ContributionDay {
  contributionCount: number;
  date: string;
}

export async function fetchContributions(token: string, username: string): Promise<ContributionDay[]> {
  const now = new Date();
  const oneYearAgo = new Date(now);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const query = `query {
    user(login: "${username}") {
      contributionsCollection(from: "${oneYearAgo.toISOString()}", to: "${now.toISOString()}") {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
      }
    }
  }`;

  const res = await fetch(GRAPHQL, {
    method: "POST",
    headers: {
      Authorization: `bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "nub-coders-portfolio",
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    throw new Error(`GitHub GraphQL API error: ${res.status}`);
  }

  interface ContributionsResponse {
    data?: {
      user: {
        contributionsCollection: {
          contributionCalendar: {
            weeks: { contributionDays: ContributionDay[] }[];
          };
        };
      };
    };
    errors?: { message: string }[];
  }

  const json = (await res.json()) as ContributionsResponse;
  if (json.errors) {
    throw new Error(`GraphQL error: ${json.errors[0]?.message}`);
  }

  const weeks = json.data!.user.contributionsCollection.contributionCalendar.weeks;
  const days: ContributionDay[] = [];
  for (const week of weeks) {
    for (const day of week.contributionDays) {
      days.push(day);
    }
  }
  return days;
}
