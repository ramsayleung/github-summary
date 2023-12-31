import { FirstContributionProps } from "@/src/model";
import { OutBoundSvgIcon } from "./OutboundSvgIcon";

export function FirstContribution(contributionProps: FirstContributionProps) {
    const firstIssueCreateDate = new Date(
      contributionProps.contributionOccurredAt
    )
      .toISOString()
      .slice(0, 10);
    return (
      <div className="flex justify-center text-center my-4">
        <div className="pr-3 sm:px-4">
          <p className=" text-gray-500 capitalize">First {contributionProps.contributionType}</p>
          <a
            href={contributionProps.contributionUrl}
            target="_blank"
            className="inline-flex items-center font-medium text-blue-600 dark:text-blue-500 hover:underline truncate max-w-96"
          >
            {contributionProps.contributionTitle}
            <OutBoundSvgIcon />
          </a>
        </div>
        <div className="px-3 sm:px-4">
          <p className=" text-gray-500">on </p>
          <p>{firstIssueCreateDate}</p>
        </div>
        {contributionProps.contributedRepositoryUrl &&
          contributionProps.contributedRepositoryName && (
            <div className="px-3 sm:px-4">
              <p className=" text-gray-500">for</p>
  
              <a
                href={contributionProps.contributedRepositoryUrl}
                target="_blank"
                className="inline-flex items-center font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >
                {contributionProps.contributedRepositoryName}
                <OutBoundSvgIcon />
              </a>
            </div>
          )}
      </div>
    );
  }