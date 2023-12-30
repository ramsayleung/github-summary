import { Octokit } from "octokit";
const TOKEN = process.env.TOKEN
export async function fetchCommitData(owner: String) {
}

function getFirstDayOfYear(date: Date) {
  // Create a new Date object using the provided date
  const firstDay = new Date(date);

  // Set the month to January (0-indexed)
  firstDay.setMonth(0);

  // Set the day of the month to 1
  firstDay.setDate(1);

  firstDay.setHours(0);

  firstDay.setMinutes(0);

  firstDay.setSeconds(0);

  return firstDay;
}


export async function fetchContributionSummary(userName: String, from: Date = new Date()) {
  const query = `
  query($userName: String!, $from: DateTime!){
    user(login: $userName) {
      avatarUrl,
      name,
      url,
      contributionsCollection(from: $from) {
        contributionYears,
        popularIssueContribution {
          issue {
            url,
            title,
            comments {
              totalCount
            }
            participants {
              totalCount
            }
          }
        }
        popularPullRequestContribution {
          pullRequest {
            url,
            title,
            comments {
              totalCount
            }
            commits {
              totalCount
            }
            participants {
              totalCount
            }
          }
        }
        totalIssueContributions
        totalCommitContributions
        totalRepositoryContributions
        totalPullRequestContributions
      },
    }
  }`

  const variables = {
    userName: userName,
    from: getFirstDayOfYear(from)
  }

  return callGithubGraphqlAPI(query, variables)
}

export async function fetchFirstIssueContribution(userName: string, contributionYears: string[]) {
  let firstIssues = await Promise.all(
    contributionYears.map(async (year: string) => {
      const fromDate = new Date(`${year}-1-1`);
      const query = `
        query($userName: String!, $fromDate: DateTime!){
          user(login: $userName) {
            contributionsCollection(from: $fromDate) {
              firstIssueContribution {
                ... on CreatedIssueContribution {
                  issue {
                    title
                    url,
                    createdAt,
                    repository{
                      name,
                      url
                    }
                  }
                }
              }
            }
          }
        }
      `;

      const variables = {
        userName: userName,
        fromDate: fromDate.toISOString(),
      };

      return callGithubGraphqlAPI(query, variables)
    })
  );

  // If no non-null firstIssueContribution is found, return null or handle accordingly
  let firstIssue = firstIssues.filter(
    (response) =>
      response &&
      response.data &&
      response.data.user &&
      response.data.user.contributionsCollection &&
      response.data.user.contributionsCollection.firstIssueContribution
  );
  return firstIssue[0]
}


export async function fetchFirstPullRequestContribution(userName: string, contributionYears: string[]) {
  let firstPullRequestContribution = await Promise.all(
    contributionYears.map(async (year: string) => {
      const fromDate = new Date(`${year}-1-1`);
      const query = `
        query($userName: String!, $fromDate: DateTime!){
          user(login: $userName) {
            contributionsCollection(from: $fromDate) {
              firstPullRequestContribution {
                ... on CreatedPullRequestContribution {
                  url
                  pullRequest{
                    createdAt,
                    title,
                    url,
                    repository{
                      name,
                      url
                    }
                  }
                }
              }
            }
          }
        }
      `;

      const variables = {
        userName: userName,
        fromDate: fromDate.toISOString(),
      };

      return callGithubGraphqlAPI(query, variables)
    })
  );

  // If no non-null firstIssueContribution is found, return null or handle accordingly
  let firstPullRequest = firstPullRequestContribution.filter(
    (response) =>
      response &&
      response.data &&
      response.data.user &&
      response.data.user.contributionsCollection &&
      response.data.user.contributionsCollection.firstPullRequestContribution
  );
  return firstPullRequest[0]
}

export async function fetchFirstRepositoryContribution(userName: string, contributionYears: string[]) {
  let firstRepositoryContribution = await Promise.all(
    contributionYears.map(async (year: string) => {
      const fromDate = new Date(`${year}-1-1`);
      const query = `
        query($userName: String!, $fromDate: DateTime!){
          user(login: $userName) {
            contributionsCollection(from: $fromDate) {
              firstRepositoryContribution {
                ... on CreatedRepositoryContribution {
                  url,
                  occurredAt,
                  repository{
                    name,
                    url
                  }
                }
              }
            }
          }
        }
      `;

      const variables = {
        userName: userName,
        fromDate: fromDate.toISOString(),
      };

      return callGithubGraphqlAPI(query, variables)
    })
  );

  // If no non-null firstIssueContribution is found, return null or handle accordingly
  let firstRepository = firstRepositoryContribution.filter(
    (response) =>
      response &&
      response.data &&
      response.data.user &&
      response.data.user.contributionsCollection &&
      response.data.user.contributionsCollection.firstRepositoryContribution
  );
  
  return firstRepository[0] 
}

async function callGithubGraphqlAPI(query: String, variables: any) {
  const result = await fetch('https://api.github.com/graphql', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ query, variables })
  })
    .then(response => response.json())
    .then(data => {
      return data;
    })
    .catch((e) => {
      console.error(e)
    });
  return result;
}