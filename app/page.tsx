import {
  fetchContributionSummary,
  fetchFirstIssueContribution,
  fetchFirstPullRequestContribution,
  fetchFirstRepositoryContribution,
} from "@/src/github_api";
import CustomLineChart from "@/components/CustomLineChart";
import { OutBoundSvgIcon } from "@/components/OutboundSvgIcon";

async function SummaryLineChart() {
  const summary = await fetchContributionSummary("ramsayleung");
  const contributionsCollection = summary.data.user.contributionsCollection;
  const contributionYears = contributionsCollection.contributionYears;
  var summaryByYear = await Promise.all(
    contributionYears.map(async (year: String) => {
      let firstDayOfYear = new Date(`${year}-1-1`);
      const eachSummary = await fetchContributionSummary(
        "ramsayleung",
        firstDayOfYear
      );
      var obj = {};
      obj[year] = eachSummary;
      return obj;
    })
  );
  // Convert an Array of Object into an Object
  summaryByYear = summaryByYear.reduce((acc, obj) => ({ ...acc, ...obj }), {});
  let labels = Object.keys(summaryByYear);
  let totalCommitContributions = Object.values(summaryByYear).map(
    (data) =>
      data?.data?.user?.contributionsCollection?.totalCommitContributions ?? 0
  );
  let totalIssueContributions = Object.values(summaryByYear).map(
    (data) =>
      data?.data?.user?.contributionsCollection?.totalIssueContributions ?? 0
  );
  let totalPullRequestContributions = Object.values(summaryByYear).map(
    (data) =>
      data?.data?.user?.contributionsCollection
        ?.totalPullRequestContributions ?? 0
  );
  let totalPullRequestReviewContributions = Object.values(summaryByYear).map(
    (data) =>
      data?.data?.user?.contributionsCollection
        ?.totalPullRequestReviewContributions ?? 0
  );
  return (
    <div className="flex justify-center">
      <div className="basic-1/2 w-96">
        <CustomLineChart
          labels={labels}
          commits={totalCommitContributions}
          issues={totalIssueContributions}
          pullRequests={totalPullRequestContributions}
          pullRequestReviews={totalPullRequestReviewContributions}
        />
      </div>
    </div>
  );
}

async function FirstRepository() {
  const summary = await fetchContributionSummary("ramsayleung");
  const contributionsCollection = summary.data.user.contributionsCollection;
  const contributionYears = contributionsCollection.contributionYears;
  const firstRepository = await fetchFirstRepositoryContribution(
    "ramsayleung",
    contributionYears
  );

  const firstRepositoryContribution =
    firstRepository?.data?.user?.contributionsCollection
      ?.firstRepositoryContribution;
  const firstIssueCreateDate = new Date(firstRepositoryContribution.occurredAt)
    .toISOString()
    .slice(0, 10);
  return (
    <div className="flex justify-center text-center my-4">
      <div className="pr-3 sm:px-4">
        <p className=" text-gray-500 capitalize">First Repository</p>
        <a
          href={firstRepositoryContribution.repository.url}
          target="_blank"
          className="inline-flex items-center font-medium text-blue-600 dark:text-blue-500 hover:underline"
        >
          {firstRepositoryContribution.repository.name}
          <OutBoundSvgIcon />
        </a>
      </div>
      <div className="px-3 sm:px-4">
        <p className="text-gray-500">on </p>
        <p>{firstIssueCreateDate}</p>
      </div>
    </div>
  );
}

async function FirstPullRequest() {
  const summary = await fetchContributionSummary("ramsayleung");
  const contributionsCollection = summary.data.user.contributionsCollection;
  const contributionYears = contributionsCollection.contributionYears;
  const firstPullRequest = await fetchFirstPullRequestContribution(
    "ramsayleung",
    contributionYears
  );
  const firstPullRequestContribution =
    firstPullRequest?.data?.user?.contributionsCollection
      ?.firstPullRequestContribution;
  const firstIssueCreateDate = new Date(
    firstPullRequestContribution.pullRequest.createdAt
  )
    .toISOString()
    .slice(0, 10);
  return (
    <div className="flex justify-center text-center my-4">
      <div className="pr-3 sm:px-4">
        <p className=" text-gray-500 capitalize">First Pull Request</p>
        <a
          href={firstPullRequestContribution.pullRequest.url}
          target="_blank"
          className="inline-flex items-center font-medium text-blue-600 dark:text-blue-500 hover:underline"
        >
          {firstPullRequestContribution.pullRequest.title}
          <OutBoundSvgIcon />
        </a>
      </div>
      <div className="px-3 sm:px-4">
        <p className=" text-gray-500">on </p>
        <p>{firstIssueCreateDate}</p>
      </div>
      <div className="px-3 sm:px-4">
        <p className=" text-gray-500">for</p>

        <a
          href={firstPullRequestContribution.pullRequest.repository.url}
          target="_blank"
          className="inline-flex items-center font-medium text-blue-600 dark:text-blue-500 hover:underline"
        >
          {firstPullRequestContribution.pullRequest.repository.name}
          <OutBoundSvgIcon />
        </a>
      </div>
    </div>
  );
}
async function FirstIssue() {
  const summary = await fetchContributionSummary("ramsayleung");
  const contributionsCollection = summary.data.user.contributionsCollection;
  const contributionYears = contributionsCollection.contributionYears;
  const firstIssue = await fetchFirstIssueContribution(
    "ramsayleung",
    contributionYears
  );
  const firstIssueContribution =
    firstIssue?.data?.user?.contributionsCollection?.firstIssueContribution;
  const firstIssueCreateDate = new Date(firstIssueContribution.issue.createdAt)
    .toISOString()
    .slice(0, 10);
  return (
    <div className="flex justify-center text-center my-4">
      <div className="pr-3 sm:px-4">
        <p className=" text-gray-500 capitalize">First issue</p>
        <a
          href={firstIssueContribution.issue.url}
          target="_blank"
          className="inline-flex items-center font-medium text-blue-600 dark:text-blue-500 hover:underline truncate"
        >
          {firstIssueContribution.issue.title}
          <OutBoundSvgIcon />
        </a>
      </div>
      <div className="px-3 sm:px-4">
        <p className=" text-gray-500">on </p>
        <p>{firstIssueCreateDate}</p>
      </div>
      <div className="px-3 sm:px-4">
        <p className=" text-gray-500">for</p>

        <a
          href={firstIssueContribution.issue.repository.url}
          target="_blank"
          className="inline-flex items-center font-medium text-blue-600 dark:text-blue-500 hover:underline truncate"
        >
          {firstIssueContribution.issue.repository.name}
          <OutBoundSvgIcon />
        </a>
      </div>
    </div>
  );
}
async function Profile() {
  const summary = await fetchContributionSummary("ramsayleung");
  const avatarUrl = summary.data.user.avatarUrl;
  const username = summary.data.user.name;
  const profileUrl = summary.data.user.url;
  return (
    <div className="flex  items-start">
      <div className="flex flex-row w-3/4">
        <div className="px-2">
          <img src={avatarUrl} className="h-10 w-10 sm:h-20 sm:w-20" />
        </div>
        <div className="flex flex-col">
          <p className="font-bold pb-1 text-xs sm:text-lg">{username}</p>
          <a
            href={profileUrl}
            target="_blank"
            className="inline-flex items-center font-medium text-gray-600 hover:underline"
          >
            {profileUrl}

            <OutBoundSvgIcon />
          </a>
        </div>
      </div>
      <div className="flex flex-col justify-end text-gray-500 text-xs">
        <div className="pb-1">
            Get your summary <br />
        </div>
        <span className="text-foreground">github-worth.vercel.app</span>
      </div>
    </div>
  );
}

export default async function Home() {
  // let labels = await fetchContributionSummaryByYear();
  const summary = await fetchContributionSummary("ramsayleung");
  const contributionsCollection = summary.data.user.contributionsCollection;
  const popularPullRequestContribution =
    contributionsCollection.popularPullRequestContribution;
  const popularIssueContribution =
    contributionsCollection.popularIssueContribution;
  const totalIssueContributions =
    contributionsCollection.totalIssueContributions;
  const totalCommitContributions =
    contributionsCollection.totalCommitContributions;
  const totalRepositoryContributions =
    contributionsCollection.totalRepositoryContributions;
  const totalPullRequestContributions =
    contributionsCollection.totalPullRequestContributions;

  return (
    <div className="flex flex-col p-24 items-center justify-center w-full bg-white">
      <div className="flex flex-col p-4 border mt-8 rounded">
        <Profile />
        <div className="flex flex-col p-4 border mt-8 rounded">
          <FirstRepository />
          <FirstIssue />
          <FirstPullRequest />
          <SummaryLineChart />
        </div>
      <div className="flex flex-col p-4 border mt-8 rounded">
        <div className="flex justify-center text-center my-4">
          <div className="flex-none pr-3 sm:px-4">
            <p className=" text-gray-500 capitalize">
              Most popular issue contribution
            </p>
            <a
              href={popularIssueContribution.issue.url}
              target="_blank"
              className="inline-flex items-center font-medium text-blue-600 dark:text-blue-500 hover:underline"
            >
              {popularIssueContribution.issue.title}

              <OutBoundSvgIcon />
            </a>
          </div>
          <div className="px-3 sm:px-4">
            <p className=" text-gray-500 capitalize">comments</p>
            <p>{popularIssueContribution.issue.comments.totalCount}</p>
          </div>
          <div className="px-3 sm:px-4">
            <p className=" text-gray-500 capitalize">participants</p>
            <p>{popularIssueContribution.issue.participants.totalCount}</p>
          </div>
        </div>

        <div className="flex justify-center text-center my-4">
          <div className="pr-3 sm:px-4">
            <p className=" text-gray-500 capitalize">
              Most popular pull request contribution
            </p>
            <a
              href={popularPullRequestContribution.pullRequest.url}
              target="_blank"
              className="inline-flex items-center font-medium text-blue-600 dark:text-blue-500 hover:underline"
            >
              {popularPullRequestContribution.pullRequest.title}
              <OutBoundSvgIcon />
            </a>
          </div>
          <div className="px-3 sm:px-4">
            <p className=" text-gray-500 capitalize">comments</p>
            <p>
              {popularPullRequestContribution.pullRequest.comments.totalCount}
            </p>
          </div>
          <div className="px-3 sm:px-4">
            <p className=" text-gray-500 capitalize">participants</p>
            <p>
              {
                popularPullRequestContribution.pullRequest.participants
                  .totalCount
              }
            </p>
          </div>
        </div>

        <div className="flex justify-center text-center my-4">
          <div className="pr-3 sm:px-4">
            <p className=" text-gray-500 capitalize">Commits</p>
            <p>{totalCommitContributions}</p>
          </div>
          <div className="pr-3 sm:px-4">
            <p className=" text-gray-500 capitalize">issues</p>
            <p>{totalIssueContributions}</p>
          </div>
          <div className="px-3 sm:px-4">
            <p className=" text-gray-500 capitalize">Pull Requests</p>
            <p>{totalPullRequestContributions}</p>
          </div>
          <div className="pl-3 sm:px-4">
            <p className=" text-gray-500 capitalize">
              contributed repositories
            </p>
            <p>{totalRepositoryContributions}</p>
          </div>
        </div>

        <img
          src="https://ghchart.rshah.org/ramsayleung"
          alt="Name Your Github chart"
        />
      </div>
      <div className="flex justify-center pt-2">
        Created by &nbsp;
        <a
          href="https://twitter.com/foobar_ramsay"
          target="_blank"
          className="inline-flex items-center font-medium text-gray-600 dark:text-blue-500 hover:underline"
        >
          @ramsayleung&nbsp;
        </a>
        with ❤️
      </div>
    </div>
      </div>
  );
}
