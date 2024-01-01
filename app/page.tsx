"use client";
import {
  fetchContributionGraphData,
  fetchContributionSummary,
  fetchSummaryByYear,
  getStarsCount,
} from "@/src/github_api";

import { DownloadSvgIcon } from "@/components/DownloadSvgIcon";
import { UserNotExist } from "@/components/ErrorPage";
import { LoadingPage } from "@/components/Loading";
import { Navbar } from "@/components/Navbar";
import { SocialNetworkIcon } from "@/components/SocialNetwork";
import { StatisticsPage } from "@/components/StatisticsPage";
import html2canvas from "html2canvas";
import { useEffect, useState } from "react";
import {
  IssueContribution,
  PullRequestContribution,
  RepositoryContribution,
  SummaryByYear,
} from "@/src/graphql_type";

interface QueryProps {
  username: string;
}

function download(canvas: HTMLCanvasElement) {
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

function findFirstIssueContribution(
  userData: SummaryByYear
): IssueContribution | null {
  const issues = Object.values(userData)
    .filter(
      (response) =>
        response &&
        response.data &&
        response.data.user &&
        response.data.user.contributionsCollection &&
        response.data.user.contributionsCollection.firstIssueContribution
    )
    .map(
      (response) =>
        response.data.user.contributionsCollection.firstIssueContribution
    );

  return issues.length > 0 ? issues[0] : null;
}

function findFirstPullRequestContribution(
  summaryByYear: SummaryByYear
): PullRequestContribution | null {
  const pullRequests = Object.values(summaryByYear)
    .filter(
      (response) =>
        response &&
        response.data &&
        response.data.user &&
        response.data.user.contributionsCollection &&
        response.data.user.contributionsCollection.firstPullRequestContribution
    )
    .map(
      (response) =>
        response.data.user.contributionsCollection.firstPullRequestContribution
    );
  return pullRequests.length > 0 ? pullRequests[0] : null;
}

function findFirstRepositoryContribution(summaryByYear: SummaryByYear): RepositoryContribution | null {
  const repositories = Object.values(summaryByYear)
  .filter(
    (response) =>
      response &&
      response.data &&
      response.data.user &&
      response.data.user.contributionsCollection &&
      response.data.user.contributionsCollection.firstRepositoryContribution
  )
  .map(
    (response) =>
      response.data.user.contributionsCollection.firstRepositoryContribution
  );
return repositories.length > 0 ? repositories[0] : null;
}

export default function Home() {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState<StateProps | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [userNotExist, setUserNotExist] = useState(false);

  const [contributionYears, setContributionYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleSelectChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedYear(event.target.value);
  };

  const fetchRequiredData = async (): Promise<StateProps> => {
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
      setSelectedYear(
        contributionYears.length > 0 ? contributionYears[0].toString() : ""
      );
    }

    const firstPullRequestContribution = findFirstPullRequestContribution(summaryByYear)
    const firstIssueContribution = findFirstIssueContribution(summaryByYear);
    const firstRepositoryContribution = findFirstRepositoryContribution(summaryByYear);

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
  useEffect(() => {
    async function fetchData() {
      if (username !== "" && !userNotExist) {
        let props = await fetchRequiredData();
        setUserData(props);
      }
    }
    fetchData();
  }, [selectedYear]);

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
      <Navbar />

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
              className="text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
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
              <h2 className="text-base underline decoration-wavy decoration-sky-500 decoration-2 underline-offset-1">
                Travel back to:{" "}
              </h2>
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
            <StatisticsPage
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
                html2canvas(document.getElementById("capture")!).then(
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

        <div className="flex flex-col  pt-5">
          <div className="flex justify-center font-medium text-gray-900">
            Created by &nbsp;
            <a
              href="https://twitter.com/foobar_ramsay"
              target="_blank"
              className="inline-flex items-center  dark:text-blue-500 hover:underline"
            >
              @ramsayleung&nbsp;
            </a>
            with ❤️
          </div>

          <SocialNetworkIcon />
        </div>
      </div>
    </div>
  );
}
