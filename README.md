# Add pull request to project

A javascript github action to add an pull request to the first project on the repository.

NOTE: If you have more than one project, this might not work.

# Usage

```yaml
name: 'Add new pull request to project board'

on:
  pull_request:
    types:
    - opened
 
jobs:
  add_to_project:
    runs-on: ubuntu-latest
    steps:
    - uses: AdityaGovardhan/ga-pull-requests-projects@master
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        repository: ${{ github.repository }}
        pull_request: ${{ github.event.pull_request.number }}

```
