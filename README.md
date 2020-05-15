# Add pull request to project

A javascript github action to add a pull request to the first project on the repository.

NOTE: If you have more than one project, this might not work.

# Usage

```yaml
name: 'add new pull request to project board'

on:
  pull_request:
    branches:
    - master
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
References:

[github javascript action tutorial](https://help.github.com/en/actions/building-actions/creating-a-javascript-action)

[secrets github token](https://help.github.com/en/actions/configuring-and-managing-workflows/authenticating-with-the-github_token)
