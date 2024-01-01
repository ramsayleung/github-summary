"use client";
import {
  fetchContributionGraphData,
  fetchContributionSummary,
  fetchFirstIssueContribution,
  fetchFirstPullRequestContribution,
  fetchFirstRepositoryContribution,
  fetchSummaryByYear,
  getStarsCount,
} from "@/src/github_api";
import CustomLineChart from "@/components/CustomLineChart";
import { Profile } from "@/components/Profile";
import { useEffect, useState } from "react";
import { ContributionType } from "@/src/model";
import { PopluarContribution } from "@/components/PopularContribution";
import { FirstContribution } from "@/components/FirstContribution";
import { LoadingPage } from "@/components/Loading";
import { UserNotExist } from "@/components/ErrorPage";
import { drawContributions } from "github-contributions-canvas";
import html2canvas from "html2canvas";
import { DownloadSvgIcon } from "@/components/DownloadSvgIcon";

export interface QueryProps {
  username: string;
}

interface SummaryLineChartProps {
  summaryByYear: any;
}

function SummaryLineChart({ summaryByYear }: SummaryLineChartProps) {
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
  starCount: number;
  selectedYear: string;
  contributionGraphData: any;
}

export function StatsPage({
  summary,
  starCount,
  summaryByYear,
  username,
  firstPullRequestContribution,
  firstIssueContribution,
  firstRepositoryContribution,
  selectedYear,
  contributionGraphData,
}: StatsPageProps) {
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
            You've contributed on Github for{" "}
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

export function download(canvas) {
  try {
    const dataUrl = canvas.toDataURL();
    const a = document.createElement("a");
    document.body.insertAdjacentElement("beforeend", a);
    a.download = "contributions.png";
    a.href = dataUrl;
    a.click();
    document.body.removeChild(a);
  } catch (err) {
    console.error(err);
  }
}

interface StateProps {
  summary: any;
  summaryByYear: any;
  firstPullRequestContribution: any;
  firstIssueContribution: any;
  firstRepositoryContribution: any;
  starCount: number;
  username: string;
  contributionGraphData: any;
}

export default function Home() {
  // let labels = await fetchContributionSummaryByYear();
  // const username = "ramsayleung"
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState<StateProps>(null);
  const [isLoading, setLoading] = useState(false);
  const [userNotExist, setUserNotExist] = useState(false);

  const [contributionYears, setContributionYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");

  const handleInputChange = (event) => {
    setUsername(event.target.value);
  };

  const handleSelectChange = async (event) => {
    setSelectedYear(event.target.value);
  };

  useEffect(() => {
    async function fetchData() {
      if (username !== "" && !userNotExist) {
        let props = await fetchRequiredData();
        setUserData(props);
      }
    }
    fetchData();
  }, [selectedYear]);

  const fetchRequiredData = async (): StateProps => {
    const fromDate =
      selectedYear === "" ? new Date() : new Date(parseInt(selectedYear), 0, 1);

    const summary = await fetchContributionSummary(username, fromDate);

    const starCount = await getStarsCount(username);

    const contributionGraphData = await fetchContributionGraphData(
      username,
      fromDate.getFullYear()
    );

    const contributionYears =
      summary.data.user.contributionsCollection.contributionYears;
    const summaryByYear = await fetchSummaryByYear(username, contributionYears);

    setContributionYears(contributionYears);
    if (selectedYear === "") {
      setSelectedYear(contributionYears.length > 0 ? contributionYears[0] : "");
    }

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

    return {
      summary: summary,
      starCount: starCount,
      summaryByYear: summaryByYear,
      firstPullRequestContribution: firstPullRequestContribution,
      firstIssueContribution: firstIssueContribution,
      firstRepositoryContribution: firstRepositoryContribution,
      username: username,
      contributionGraphData: contributionGraphData,
    };
  };

  const handleButtonClick = async () => {
    setUserNotExist(false);
    if (!userData) {
      setLoading(true);
    }
    try {
      const response = await fetch(`https://api.github.com/users/${username}`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else if (response.status === 404) {
            setUserNotExist(true);
            console.log("404 error");
            return Promise.reject("error 404");
          } else {
            return Promise.reject("some other error: " + response.status);
          }
        })
        .then((data) => {
          return data;
        })
        .catch((error) => {
          throw error;
        });

      let props = await fetchRequiredData();
      setUserData(props);
      setLoading(false);
      setUserNotExist(false);
    } catch (error) {
      console.error("Error fetching GitHub data:", error);
      setLoading(false);
      setUserData(null);
    }
  };

  return (
    <div>
      <Navbar/>

      <div className="flex flex-col p-24 items-center justify-center w-full h-full bg-white">
        <div>
          <p className="text-3xl font-semibold pb-4 text-center">
            Github Time Machine
          </p>
        </div>
        <div className="flex flex-row justify-center items-center">
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
              Travel
            </button>
          </div>
        </div>
        {!userNotExist &&
          userData?.summary &&
          contributionYears &&
          contributionYears.length > 0 && (
            <div className="flex flex-row justify-center pt-4">
              <h2 className="text-base">Travel back to: </h2>
              <label>
                <select
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 mx-2"
                  value={selectedYear}
                  onChange={handleSelectChange}
                >
                  <option value="">Select a year</option>
                  {contributionYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}
        {isLoading && <LoadingPage />}

        {userNotExist && <UserNotExist />}

        {userData?.summary && userData?.summaryByYear && (
          <div
            id="capture"
            className="flex flex-col p-4 items-center justify-center w-full bg-white"
          >
            <StatsPage
              username={userData.username}
              starCount={userData.starCount}
              summary={userData.summary}
              summaryByYear={userData.summaryByYear}
              firstPullRequestContribution={
                userData.firstPullRequestContribution
              }
              firstIssueContribution={userData.firstIssueContribution}
              firstRepositoryContribution={userData.firstRepositoryContribution}
              selectedYear={selectedYear}
              contributionGraphData={userData.contributionGraphData}
            />
          </div>
        )}

        {userData?.summary && (
          <div className="flex flex-row">
            <button
              className="flex text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              onClick={() => {
                html2canvas(document.querySelector("#capture")).then(
                  (canvas) => {
                    download(canvas);
                  }
                );
              }}
            >
              <DownloadSvgIcon />
              Download Image
            </button>
          </div>
        )}

        <div className="flex justify-center pt-5">
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
