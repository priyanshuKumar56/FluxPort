# Contributing to FluxPort 2.0

First off, thanks for taking the time to contribute! FluxPort 2.0 is an open-source project, and we love getting help from the community.

## How Can I Contribute?

### Reporting Bugs
* Before creating a new issue, search the [issue tracker](https://github.com/yourusername/FluxPort_2.0/issues) to see if the problem has already been reported.
* If you find a bug, create a new issue and include as many details as possible:
    * Your operating system and version.
    * Your browser and version.
    * Steps to reproduce the bug.
    * Expected and actual behavior.
    * Screenshots if applicable.

### Suggesting Enhancements
* We're always looking for ways to make FluxPort better. If you have an idea for a new feature or an improvement, please open an issue.

### Pull Requests
1. Fork the repository and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code follows the existing coding style.
6. Submit a pull request!

## Project Structure

* `/app`: Frontend Next.js application.
* `/server`: Backend Express.js server.
* `/components/api-client`: Core logic for the API Client request builder.
* `/lib/proxy-engine-v2.ts`: The "Smart Relay" logic for request interception.

## Local Development

Check out the [README.md](README.md) for detailed setup instructions.

## Coding Standards

* We use TypeScript for both frontend and backend.
* Use functional components and hooks in the frontend.
* Follow the Prettier and ESLint configurations defined in the project.

## Code of Conduct

Please be respectful and helpful to all contributors. We follow the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/code_of_conduct.md).

Happy coding!
