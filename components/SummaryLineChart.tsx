import { SummaryByYear } from "@/src/graphql_type";
import CustomLineChart from "./CustomLineChart";

export interface SummaryLineChartProps {
    summaryByYear: SummaryByYear;
  }
  
  export function SummaryLineChart({ summaryByYear }: SummaryLineChartProps) {
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
  