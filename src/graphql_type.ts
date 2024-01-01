
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

export type SummaryByYear = Record<number, GraphQLResponse>

export interface GraphQLResponse{
    data: {
        user: User
    }
}

export interface User {
    followers: Followers,
    contributionsCollection: ContributionsCollection
}

export interface Followers{
    totalCount: number
}

export interface ContributionCalendar{
    totalContributions: number
}

export interface Comments{
    totalCount: number
}

export interface Participants{
    totalCount: number
}

export interface Commits{
    totalCount: number
}

export interface Issue {
    url: string
    title: string
    createdAt: Date,
    comments: Comments
    participants: Participants
}

export interface PullRequest{
    url: string
    title: string
    createdAt: Date
    comments: Comments
    commits: Commits
    participants: Participants
}

export interface PullRequestContribution{
    url: string
    pullRequest: PullRequest
}

export interface IssueContribution{
    url: string
    issue: Issue
}

export interface Repository{
    name: string
    url: string
}

export interface RepositoryContribution{
    url: string
    occurredAt: Date
    repository: Repository
}

export interface ContributionsCollection{
    contributionCalendar: ContributionCalendar,
    contributionYears: number[],
    popularIssueContribution: IssueContribution,
    popularPullRequestContribution: PullRequestContribution,
    totalCommitContributions: number,
    totalIssueContributions: number,
    totalPullRequestContributions: number,
    totalPullRequestReviewContributions: number
    totalRepositoryContributions: number
    firstRepositoryContribution: RepositoryContribution
    firstIssueContribution: IssueContribution
    firstPullRequestContribution: PullRequestContribution
}
