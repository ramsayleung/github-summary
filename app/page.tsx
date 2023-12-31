"use client";
import {
  fetchContributionSummary,
  fetchFirstIssueContribution,
  fetchFirstPullRequestContribution,
  fetchFirstRepositoryContribution,
  fetchSummaryByYear,
} from "@/src/github_api";
import CustomLineChart from "@/components/CustomLineChart";
import { OutBoundSvgIcon } from "@/components/OutboundSvgIcon";
import { Profile } from "@/components/Profile";
import { useState } from "react";
import { ContributionType } from "@/src/model";
import { PopluarContribution } from "@/components/PopularContribution";
import { FirstContribution } from "@/components/FirstContribution";
import { LoadingPage } from "@/components/Loading";
import { UserNotExist } from "@/components/ErrorPage";

export interface QueryProps {
  username: string;
}

interface SummaryLineChartProps {
  summaryByYear: any;
}
function SummaryLineChart({ summaryByYear }: SummaryLineChartProps) {
  // var summaryByYear = await Promise.all(
  //   contributionYears.map(async (year: String) => {
  //     let firstDayOfYear = new Date(`${year}-1-1`);
  //     const eachSummary = await fetchContributionSummary(
  //       username,
  //       firstDayOfYear
  //     );
  //     var obj = {};
  //     obj[year] = eachSummary;
  //     return obj;
  //   })
  // );
  // // Convert an Array of Object into an Object
  // summaryByYear = summaryByYear.reduce((acc, obj) => ({ ...acc, ...obj }), {});
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

interface StatsPageProps extends SummaryLineChartProps {
  summary: any;
  username: string;
  firstRepositoryContribution: any;
  firstPullRequestContribution: any;
  firstIssueContribution: any;
}

export function StatsPage({
  summary,
  summaryByYear,
  username,
  firstPullRequestContribution,
  firstIssueContribution,
  firstRepositoryContribution,
}: StatsPageProps) {
  const avatarUrl = summary.data.user.avatarUrl;
  const profileUrl = summary.data.user.url;
  const githubUserName = summary.data.user.name;
  const contributionsCollection = summary.data.user.contributionsCollection;
  const contributionYears = contributionsCollection.contributionYears;
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
  const contributionGraphUrl = `https://ghchart.rshah.org/${username}`;
  console.log(`JSON: ${JSON.stringify(firstIssueContribution)}`);
  return (
    <div className="flex flex-col p-4 border mt-8 rounded">
      <Profile
        username={githubUserName}
        avatarUrl={avatarUrl}
        profileUrl={profileUrl}
      />
      <div className="flex flex-col p-4 border mt-8 rounded">
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
      <div className="flex flex-col p-4 border mt-8 rounded">
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
          src={contributionGraphUrl}
          alt="Name Your Github chart"
        />
      </div>
    </div>
  );
}

interface StateProps {
  summary: any;
  summaryByYear: any;
  firstPullRequestContribution: any;
  firstIssueContribution: any;
  firstRepositoryContribution: any;
}

export default function Home() {
  // let labels = await fetchContributionSummaryByYear();
  // const username = "ramsayleung"
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState<StateProps>(null);
  const [isLoading, setLoading] = useState(false)
  const [userNotExist, setUserNotExist] = useState(false)

  const handleInputChange = (event) => {
    setUsername(event.target.value);
  };

  const handleButtonClick = async () => {
    if(!userData){
      setLoading(true)
    }
    try {
      const response = await fetch(`https://api.github.com/users/${username}`)
      .then(response => {
        if(response.ok){
          return response.json()
        }else if(response.status === 404){
          setUserNotExist(true)
          console.log('404 error')
          return Promise.reject('error 404')
        }else{
          return Promise.reject('some other error: ' + response.status)
        }
      }).then(data => {return data})
      .catch(error => {throw error});

      const summary = await fetchContributionSummary(username);

      const contributionYears =
        summary.data.user.contributionsCollection.contributionYears;
      const summaryByYear = await fetchSummaryByYear(
        username,
        contributionYears
      );
      const firstPullRequest = await fetchFirstPullRequestContribution(
        username,
        contributionYears
      );
      const firstPullRequestContribution =
        firstPullRequest?.data?.user?.contributionsCollection
          ?.firstPullRequestContribution;
      const firstIssue = await fetchFirstIssueContribution(
        username,
        contributionYears
      );
      const firstIssueContribution =
        firstIssue?.data?.user?.contributionsCollection?.firstIssueContribution;

      const firstRepository = await fetchFirstRepositoryContribution(
        username,
        contributionYears
      );

      const firstRepositoryContribution =
        firstRepository?.data?.user?.contributionsCollection
          ?.firstRepositoryContribution;

      let props: StateProps = {
        summary: summary,
        summaryByYear: summaryByYear,
        firstPullRequestContribution: firstPullRequestContribution,
        firstIssueContribution: firstIssueContribution,
        firstRepositoryContribution: firstRepositoryContribution,
      };
      setUserData(props);
      setLoading(false);
      setUserNotExist(false);
      console.log(JSON.stringify(summary));
    } catch (error) {
      console.error("Error fetching GitHub data:", error);
      setLoading(false)
      setUserData(null);
    }
  };

  return (
    <div className="flex flex-col p-24 items-center justify-center w-full h-full bg-white">
      <div>
      <p className="text-3xl font-semibold pb-4 text-center">Github Summary Generator</p>
      </div>
      <div className="flex flex-col justify-center items-center">
        <div className="relative w-full py-2">
          <input
            type="text"
            id="floating_outlined"
            className="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border-1 border appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            value={username}
            onChange={handleInputChange}
          />
          <label
            htmlFor="floating_outlined"
            className="absolute text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
          >
            Github Username
          </label>
        </div>
        <div className="px-2">
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            onClick={handleButtonClick}
          >
            Generate
          </button>
        </div>
      </div>
      {isLoading &&(
        <LoadingPage/>
      )}

      {userNotExist && (
        <UserNotExist/>
      )}
      <div className="flex flex-col p-4 items-center justify-center w-full bg-white">
        {userData?.summary && userData?.summaryByYear && (
          <StatsPage
            username={username}
            summary={userData.summary}
            summaryByYear={userData.summaryByYear}
            firstPullRequestContribution={userData.firstPullRequestContribution}
            firstIssueContribution={userData.firstIssueContribution}
            firstRepositoryContribution={userData.firstRepositoryContribution}
          />
        )}
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
  );
}
