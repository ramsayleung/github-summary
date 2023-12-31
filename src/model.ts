
export enum ContributionType {
    Repository = "Repository",
    PullRequest = "Pull Request",
    Issue = "Issue",
}

export interface ContributionProps {
    contributionType: ContributionType;
    contributionUrl: string;
    contributionTitle: string;
}

export interface FirstContributionProps extends ContributionProps {
    contributionOccurredAt: Date;
    contributedRepositoryName?: string;
    contributedRepositoryUrl?: string;
}

export interface PopularContributionProps extends ContributionProps {
    commentsCount: number
    participantsCount: number
}