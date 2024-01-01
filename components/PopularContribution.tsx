import { PopularContributionProps } from "@/src/graphql_type";
import { OutBoundSvgIcon } from "./OutboundSvgIcon";

export function PopluarContribution(popularContribution: PopularContributionProps){
    return ( <div className="flex justify-center text-center my-4">
    <div className="pr-3 sm:px-4">
      <p className=" text-gray-500 capitalize">
        Most popular {popularContribution.contributionType} contribution
      </p>
      <a
        href={popularContribution.contributionUrl}
        target="_blank"
        className="inline-flex items-center font-medium text-blue-600 dark:text-blue-500 hover:underline max-w-96 truncate"
      >
        {popularContribution.contributionTitle}
        <OutBoundSvgIcon />
      </a>
    </div>
    <div className="px-3 sm:px-4">
      <p className=" text-gray-500 capitalize">comments</p>
      <p>
        {popularContribution.commentsCount}
      </p>
    </div>
    <div className="px-3 sm:px-4">
      <p className=" text-gray-500 capitalize">participants</p>
      <p>
        {popularContribution.participantsCount }
      </p>
    </div>
  </div>
  
    )
  }