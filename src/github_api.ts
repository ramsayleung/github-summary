import { GraphQLResponse, PullRequestContribution, RepositoryContribution } from "./graphql_type";
import { ContributionGraphData, RepositoryDetail } from "./restapi_type";

const TOKEN = process.env.GITHUB_TOKEN
export async function fetchCommitData(owner: String) {
}

function getFirstDayOfYear(date: Date) {
  const firstDay = new Date(date.getFullYear(), 0, 1);
  return firstDay;
}

export async function fetchContributionGraphData(username: string, targetYear: number): Promise<ContributionGraphData>{
  const data: ContributionGraphData = await fetch(`/api/v1/contributions?name=${username}`)
  .then(response => response.json())

  // Remove years that do not match the target year
  data.years = data.years.filter(year => year.year === String(targetYear));

  // Remove contributions that do not match the target year
  data.contributions = data.contributions.filter(contribution => {
    const contributionDate = new Date(contribution.date);
    return contributionDate.getFullYear() === targetYear;
  });
  return data
}

export async function fetchSummaryByYear(username: string, contributionYears: number[]): Promise<Record<number, GraphQLResponse>>{
  var summaryByYear = await Promise.all(
    contributionYears.map(async (year: number) => {
      let firstDayOfYear = new Date(`${year}-1-1`);
      const eachSummary = await fetchContributionSummary(
        username,
        firstDayOfYear
      );
      var obj: Record<number, GraphQLResponse> = {};
      obj[year] = eachSummary;
      return obj;
    })
  );
  // Convert an Array of Object into an Object
  return summaryByYear.reduce((acc, obj) => ({ ...acc, ...obj }), {});
}

export async function fetchContributionSummary(userName: String, from: Date = new Date()): Promise<GraphQLResponse> {
  const query = `
  query($userName: String!, $from: DateTime!){
    user(login: $userName) {
      avatarUrl,
      name,
      url,
      followers{
        totalCount
      },
      contributionsCollection(from: $from) {
        contributionCalendar {
          totalContributions
        }
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
        totalPullRequestReviewContributions
      },
    }
  }`

  const variables = {
    userName: userName,
    from: getFirstDayOfYear(from)
  }

  return callGithubGraphqlAPI(query, variables)
}

export async function fetchFirstIssueContribution(userName: string, contributionYears: number[]) {
  let firstIssues = await Promise.all(
    contributionYears.map(async (year: number) => {
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


export async function fetchFirstPullRequestContribution(userName: string, contributionYears: number[]): Promise<GraphQLResponse> {
  let firstPullRequestContribution = await Promise.all(
    contributionYears.map(async (year: number) => {
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

export async function fetchFirstRepositoryContribution(userName: string, contributionYears: number[]) : Promise<GraphQLResponse> {
  let firstRepositoryContribution = await Promise.all(
    contributionYears.map(async (year: number) => {
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
    (response: GraphQLResponse) =>
      response &&
      response.data &&
      response.data.user &&
      response.data.user.contributionsCollection &&
      response.data.user.contributionsCollection.firstRepositoryContribution
  );
  
  return firstRepository[0] 
}

async function callGithubGraphqlAPI(query: String, variables: any): Promise<GraphQLResponse> {
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

export async function getStarsCount(username: string){
  let page = 1;
  let allRepositories: RepositoryDetail[] = [];

  try {
    while (true) {
      const response = await fetch(`https://api.github.com/users/${username}/repos?page=${page}&per_page=100`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch user repositories. Status: ${response.status}`);
      }

      const repositories = await response.json();

      if (repositories.length === 0) {
        // No more repositories, break the loop
        break;
      }

      allRepositories = allRepositories.concat(repositories);
      page++;
    }

    // Calculate the total number of stars for user repositories
    return allRepositories.reduce((totalStars, repo) => totalStars + repo.stargazers_count, 0);
  } catch (error) {
    console.error('Error fetching user repositories:', error);
    return 0;
  }
}
