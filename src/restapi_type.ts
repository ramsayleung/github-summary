export interface ContributionYear{
    year: string
    total: number
    range: {
        start: Date
        end: Date
    }
}

export interface DailyContribution{
    date: Date
    count: number
    color: string
    intensity: string
}

export interface ContributionGraphData{
    years: ContributionYear[]
    contributions: DailyContribution[]
}


// the response type of api:
// https://api.github.com/users/ramsayleung/repos?page=1&per_page=100
export interface RepositoryDetail{
    id: number,
    name: string,
    full_name: string,
    stargazers_count: number
}