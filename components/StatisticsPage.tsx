import { ContributionType } from "@/src/graphql_type";
import { PopluarContribution } from "./PopularContribution";
import { SummaryLineChart, SummaryLineChartProps } from "./SummaryLineChart";
import { FirstContribution } from "./FirstContribution";
import { Profile } from "./Profile";
import { drawContributions } from "github-contributions-canvas";

export interface StatisticsPageProps extends SummaryLineChartProps {
  summary: any;
  username: string;
  firstRepositoryContribution: any;
  firstPullRequestContribution: any;
  firstIssueContribution: any;
  starCount: number;
  selectedYear: string;
  contributionGraphData: any;
}

export  function StatisticsPage({
  summary,
  starCount,
  summaryByYear,
  username,
  firstPullRequestContribution,
  firstIssueContribution,
  firstRepositoryContribution,
  selectedYear,
  contributionGraphData,
}: StatisticsPageProps) {
  const avatarUrl = summary.data.user.avatarUrl;
  const profileUrl = summary.data.user.url;
  const githubUserName = summary.data.user.name;
  const contributionsCollection = summary.data.user.contributionsCollection;
  const totalFollowersCount = summary.data.user.followers.totalCount;

  const totalContributionsCount = Object.values(summaryByYear)
    .map(
      (data) =>
        data?.data?.user?.contributionsCollection?.contributionCalendar
          ?.totalContributions ?? 0
    )
    .reduce(
      (totalCount, totalContributionsPerYear) =>
        totalCount + totalContributionsPerYear,
      0
    );

  const contributionYears = contributionsCollection.contributionYears;
  const popularPullRequestContribution =
    contributionsCollection.popularPullRequestContribution;
  const popularIssueContribution =
    contributionsCollection.popularIssueContribution;

  const totalContributions =
    contributionsCollection.contributionCalendar.totalContributions;
  const totalIssueContributions =
    contributionsCollection.totalIssueContributions;
  const totalCommitContributions =
    contributionsCollection.totalCommitContributions;
  const totalRepositoryContributions =
    contributionsCollection.totalRepositoryContributions;
  const totalPullRequestContributions =
    contributionsCollection.totalPullRequestContributions;

  let canvasEl = document.createElement("canvas");
  drawContributions(canvasEl, {
    data: contributionGraphData,
    username: username,
    themeName: "standard",
    skipHeader: true,
    skipAxisLabel: false,
  });
  canvasEl.scrollIntoView({
    behavior: "smooth",
  });

  return (
    <div className="flex flex-col p-4 border mt-8 rounded">
      <Profile
        username={githubUserName}
        avatarUrl={avatarUrl}
        profileUrl={profileUrl}
      />

      <div className="flex flex-col p-4 border mt-8 rounded">
        <div className="flex justify-center">
          <p className="text-2xl font-semibold text-gray-600	capitalize">
            Rewind your
          </p>
          <p className="text-2xl font-semibold text-emerald-600	">
            &nbsp; {selectedYear} &nbsp;
          </p>
          <p className="text-2xl font-semibold text-gray-600 capitalize">
            in review
          </p>
        </div>
        <div className="flex justify-center text-center my-4">
          <div className="pr-3 sm:px-4">
            <p className=" text-gray-500 capitalize">Contributions</p>
            <p>{totalContributions}</p>
          </div>
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

        {popularIssueContribution && (
          <PopluarContribution
            contributionTitle={popularIssueContribution.issue.title}
            contributionUrl={popularIssueContribution.issue.url}
            contributionType={ContributionType.Issue}
            commentsCount={popularIssueContribution.issue.comments.totalCount}
            participantsCount={
              popularIssueContribution.issue.participants.totalCount
            }
          />
        )}
        {popularPullRequestContribution && (
          <PopluarContribution
            contributionTitle={popularPullRequestContribution.pullRequest.title}
            contributionType={ContributionType.PullRequest}
            contributionUrl={popularPullRequestContribution.pullRequest.url}
            commentsCount={
              popularPullRequestContribution.pullRequest.comments.totalCount
            }
            participantsCount={
              popularPullRequestContribution.pullRequest.participants.totalCount
            }
          />
        )}

        <img src={canvasEl.toDataURL()} alt="Name Your Github chart" />
      </div>

      <div className="flex flex-col p-4 border mt-8 rounded">
        <div className="flex justify-center">
          <p className="text-2xl font-semibold text-black-500">
            {" "}
            You&apos;ve contributed on Github for{" "}
          </p>
          <p className="text-2xl font-semibold text-emerald-600	">
            {" "}
            &nbsp;{contributionYears?.length ?? 0}&nbsp;
          </p>
          <p className="text-2xl font-semibold text-black-500"> years 🎉</p>
        </div>

        <div className="flex justify-center text-center my-4">
          <div className="pr-3 sm:px-4">
            <p className=" text-gray-500 capitalize">Total stars</p>
            <p>{starCount ?? 0}</p>
          </div>

          <div className="pr-3 sm:px-4">
            <p className=" text-gray-500 capitalize">Total followers</p>
            <p>{totalFollowersCount ?? 0}</p>
          </div>
          <div className="pr-3 sm:px-4">
            <p className=" text-gray-500 capitalize">Total Contributions</p>
            <p>{totalContributionsCount ?? 0}</p>
          </div>
        </div>
        {firstRepositoryContribution &&
          firstRepositoryContribution?.repository && (
            <FirstContribution
              contributionOccurredAt={firstRepositoryContribution.occurredAt}
              contributionTitle={firstRepositoryContribution.repository.name}
              contributionUrl={firstRepositoryContribution.repository.url}
              contributionType={ContributionType.Repository}
            />
          )}
        {firstIssueContribution && firstIssueContribution?.issue && (
          <FirstContribution
            contributionOccurredAt={firstIssueContribution.issue.createdAt}
            contributionTitle={firstIssueContribution.issue.title}
            contributionUrl={firstIssueContribution.issue.url}
            contributedRepositoryUrl={
              firstIssueContribution.issue.repository.url
            }
            contributedRepositoryName={
              firstIssueContribution.issue.repository.name
            }
            contributionType={ContributionType.Issue}
          />
        )}

        {firstPullRequestContribution &&
          firstPullRequestContribution?.pullRequest && (
            <FirstContribution
              contributionOccurredAt={
                firstPullRequestContribution.pullRequest.createdAt
              }
              contributionTitle={firstPullRequestContribution.pullRequest.title}
              contributionUrl={firstPullRequestContribution.pullRequest.url}
              contributedRepositoryUrl={
                firstPullRequestContribution.pullRequest.repository.url
              }
              contributedRepositoryName={
                firstPullRequestContribution.pullRequest.repository.name
              }
              contributionType={ContributionType.PullRequest}
            />
          )}
        <SummaryLineChart summaryByYear={summaryByYear} />
      </div>
    </div>
  );
}
