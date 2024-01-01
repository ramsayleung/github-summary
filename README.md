# :octocat: GitHub Summary Generator [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/ramsayleung/github-summary/blob/master/LICENSE)

Takes the time machine back to the day since you have signed up, provides an detailed analysis summary for your contribution for every contribution year, so you can have an insight about your contribution on GitHub and share them in social media.

The API for this project replies

- mostly on [GitHub Official GraphQL API](https://docs.github.com/en/graphql)
- a few on [GitHub Contribution Chart Generator](https://github.com/sallar/github-contributions-chart) to access user contribution graph
- a few on [Github REST API](https://docs.github.com/en/rest)

## Getting Started

### Requirements

- A valid GitHub account

### Development

#### Prerequisite

- A valid GitHub App Token

Create a `.env.local` file in the root of the project, put your Github App Token

```js
GITHUB_TOKEN=your-github-app-token
```

#### How to run

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

1. This project is deployed on [Vercel](https://vercel.com/).

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Changelog

Every release, along with the migration instructions, is documented on the GitHub [Releases]() page.

## Acknowledge

This project is inspired by

- [GitHub Contribution Chart Generator](https://github.com/sallar/github-contributions-chart)
- [Github Worth](https://github-worth.vercel.app/)

[![Powered by Vercel](/public/powered-by-vercel.svg)](https://vercel.com/?utm_source=github-summary&utm_campaign=oss)