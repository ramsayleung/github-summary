import {
  fetchContributionSummary,
  fetchFirstIssueContribution,
  fetchFirstPullRequestContribution,
  fetchFirstRepositoryContribution,
} from "@/src/github_api";
import CustomLineChart from "@/components/CustomLineChart";

async function SummaryLineChart() {
  const summary = await fetchContributionSummary("ramsayleung");
  const contributionsCollection = summary.data.user.contributionsCollection;
  const contributionYears = contributionsCollection.contributionYears;
  var summaryByYear = await Promise.all(
    contributionYears.map(async (year: String) => {
      let firstDayOfYear = new Date(`${year}-1-1`);
      const eachSummary = await fetchContributionSummary("ramsayleung", firstDayOfYear);
      var obj = {}
      obj[year] = eachSummary
      return obj
    })
  );
  summaryByYear = summaryByYear.reduce((acc, obj) => ({ ...acc, ...obj }), {});
  let labels = Object.keys(summaryByYear)
  let totalCommitContributions = Object.values(summaryByYear).map(data => data.data.user.contributionsCollection.totalCommitContributions)
  let totalIssueContributions = Object.values(summaryByYear).map(data => data.data.user.contributionsCollection.totalIssueContributions)
  let totalPullRequestContributions = Object.values(summaryByYear).map(data => data.data.user.contributionsCollection.totalPullRequestContributions)
  let totalPullRequestReviewContributions = Object.values(summaryByYear).map(data => data.data.user.contributionsCollection.totalPullRequestReviewContributions)
  console.log(`summaryByYear labels: ${JSON.stringify(labels)}`)
  console.log(`summaryByYear totalCommitContributions: ${JSON.stringify(totalCommitContributions)}`)
  console.log(`summaryByYear totalIssueContributions: ${JSON.stringify(totalIssueContributions)}`)
  console.log(`summaryByYear totalPullRequestContributions: ${JSON.stringify(totalPullRequestContributions)}`)
  console.log(`summaryByYear: ${JSON.stringify(totalPullRequestReviewContributions)}`)
  return <CustomLineChart labels = {labels} commits={totalCommitContributions} issues={totalIssueContributions} pullRequests={totalPullRequestContributions} pullRequestReviews={totalPullRequestReviewContributions} />
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
      <div className="text-xs sm:text-base pr-3 sm:px-4 border-r">
        <p className="text-[10px] sm:text-xs text-gray-500">
          First Repository on Github
        </p>
        <a
          href={firstRepositoryContribution.repository.url}
          className="text-blue-600 visited:text-green-600"
        >
          {firstRepositoryContribution.repository.name}
        </a>
      </div>
      <div className="text-xs sm:text-base px-3 sm:px-4 border-l">
        <p className="text-[10px] sm:text-xs text-gray-500">on </p>
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
      <div className="text-xs sm:text-base pr-3 sm:px-4 border-r">
        <p className="text-[10px] sm:text-xs text-gray-500">
          First Pull Request on Github
        </p>
        <a
          href={firstPullRequestContribution.pullRequest.url}
          className="text-blue-600 visited:text-green-600"
        >
          {firstPullRequestContribution.pullRequest.title}
        </a>
      </div>
      <div className="text-xs sm:text-base px-3 sm:px-4 border-r">
        <p className="text-[10px] sm:text-xs text-gray-500">on </p>
        <p>{firstIssueCreateDate}</p>
      </div>
      <div className="text-xs sm:text-base px-3 sm:px-4 border-l">
        <p className="text-[10px] sm:text-xs text-gray-500">for</p>

        <a
          href={firstPullRequestContribution.pullRequest.repository.url}
          className="text-blue-600 visited:text-green-600"
        >
          {firstPullRequestContribution.pullRequest.repository.name}
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
      <div className="text-xs sm:text-base pr-3 sm:px-4 border-r">
        <p className="text-[10px] sm:text-xs text-gray-500">
          First issue on Github
        </p>
        <a
          href={firstIssueContribution.issue.url}
          className="text-blue-600 visited:text-green-600"
        >
          {firstIssueContribution.issue.title}
        </a>
      </div>
      <div className="text-xs sm:text-base px-3 sm:px-4 border-r">
        <p className="text-[10px] sm:text-xs text-gray-500">on </p>
        <p>{firstIssueCreateDate}</p>
      </div>
      <div className="text-xs sm:text-base px-3 sm:px-4 border-l">
        <p className="text-[10px] sm:text-xs text-gray-500">for</p>

        <a
          href={firstIssueContribution.issue.repository.url}
          className="text-blue-600 visited:text-green-600"
        >
          {firstIssueContribution.issue.repository.name}
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
    <div className="flex flex-row">
      <div className="">
        <div>
          <img
            src={avatarUrl}
            className="rounded-full h-10 w-10 sm:h-20 sm:w-20"
          />
        </div>
        <div>
          <p className="font-bold mt-2 text-xs sm:text-lg">{username}</p>
          <p className="text-xs sm:text-sm">{profileUrl}</p>
        </div>
      </div>
      <div className="mt-4 text-gray-500 text-right text-[7px] sm:text-[10px]">
        Get yours <br />
        <span className="text-foreground">github-worth.vercel.app</span>
      </div>
    </div>
  );
}

export default async function Home() {
  // let labels = await fetchContributionSummaryByYear();
  const summary = await fetchContributionSummary("ramsayleung");
  const contributionsCollection = summary.data.user.contributionsCollection;
  const avatarUrl = summary.data.user.avatarUrl;
  const username = summary.data.user.name;
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

  // const labels = [
  //   "January",
  //   "February",
  //   "March",
  //   "April",
  //   "May",
  //   "June",
  //   "July",
  // ];
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-white">
      <div className="p-4 border mt-8 rounded w-full flex flex-col dark:bg-background">
        <Profile />
        <div className="flex flex-col p-4 border mt-8 rounded">
          <FirstRepository />
          <FirstIssue />
          <FirstPullRequest />
          <SummaryLineChart/>
        </div>
      </div>
      <div className="flex flex-col p-4 border mt-8 rounded">
        <div className="flex justify-center text-center my-4">
          <div className=" flex-none text-xs sm:text-base pr-3 sm:px-4 border-r">
            <p className="text-[10px] sm:text-xs text-gray-500">
              Most popular issue contribution
            </p>
            <a
              href={popularIssueContribution.issue.url}
              className="text-blue-600 visited:text-green-600"
            >
              {popularIssueContribution.issue.title}
            </a>
          </div>
          <div className="text-xs sm:text-base px-3 sm:px-4 border-r">
            <p className="text-[10px] sm:text-xs text-gray-500">comments</p>
            <p>{popularIssueContribution.issue.comments.totalCount}</p>
          </div>
          <div className="text-xs sm:text-base px-3 sm:px-4 border-l">
            <p className="text-[10px] sm:text-xs text-gray-500">participants</p>
            <p>{popularIssueContribution.issue.participants.totalCount}</p>
          </div>
        </div>

        <div className="flex justify-center text-center my-4">
          <div className="text-xs sm:text-base pr-3 sm:px-4 border-r">
            <p className="text-[10px] sm:text-xs text-gray-500">
              Most popular pull request contribution
            </p>
            <a
              href={popularPullRequestContribution.pullRequest.url}
              className="text-blue-600 visited:text-green-600"
            >
              {popularPullRequestContribution.pullRequest.title}
            </a>
          </div>
          <div className="text-xs sm:text-base px-3 sm:px-4 border-r">
            <p className="text-[10px] sm:text-xs text-gray-500">comments</p>
            <p>
              {popularPullRequestContribution.pullRequest.comments.totalCount}
            </p>
          </div>
          <div className="text-xs sm:text-base px-3 sm:px-4 border-l">
            <p className="text-[10px] sm:text-xs text-gray-500">participants</p>
            <p>
              {
                popularPullRequestContribution.pullRequest.participants
                  .totalCount
              }
            </p>
          </div>
        </div>

        <div className="flex justify-center text-center my-4">
          <div className="text-xs sm:text-base pr-3 sm:px-4 border-r">
            <p className="text-[10px] sm:text-xs text-gray-500">Total issues</p>
            <p>{totalIssueContributions}</p>
          </div>
          <div className="text-xs sm:text-base px-3 sm:px-4 border-r">
            <p className="text-[10px] sm:text-xs text-gray-500">
              Total Pull Requests
            </p>
            <p>{totalPullRequestContributions}</p>
          </div>
          <div className="text-xs sm:text-base pl-3 sm:px-4 border-l">
            <p className="text-[10px] sm:text-xs text-gray-500">
              Total contributed repositories
            </p>
            <p>{totalRepositoryContributions}</p>
          </div>
        </div>

        <img
          src="https://ghchart.rshah.org/ramsayleung"
          alt="Name Your Github chart"
        />
      </div>
      <div>
        Created By{" "}
        <a href="https://twitter.com/foobar_ramsay" className="text-gray-500">
          @ramsayleung{" "}
        </a>
        with love
      </div>
    </main>
  );
}
