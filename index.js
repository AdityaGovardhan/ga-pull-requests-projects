const core = require('@actions/core');
const fetch = require('node-fetch');

async function github_query(github_token, query, variables) {
  return fetch('https://api.github.com/graphql', {
    method: 'POST',
    body: JSON.stringify({query, variables}),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `bearer ${github_token}`,
    }
  }).then(function(response) {
    return response.json();
  });
}

// most @actions toolkit packages have async methods
async function run() {
  try { 
    const pull_request = core.getInput('pull_request');
    const repository = core.getInput('repository');
    const github_token = core.getInput('github_token');

    let query = `
    query($owner:String!, $name:String!){
      repository(owner: $owner, name: $name) {
        projects(first:1) {
          nodes {
            id
            name
          }
        }
      }
    }`;
    let variables = { owner: repository.split("/")[0], name: repository.split("/")[1] };

    let response = await github_query(github_token, query, variables);
    console.log(response);
    const project = response['data']['repository']['projects']['nodes'][0];

    query = `
    query($owner:String!, $name:String!, $number:Int!){
      repository(owner: $owner, name: $name) {
        pullRequest(number:$number) {
          id
        }
      }
    }`;
    variables = { owner: repository.split("/")[0], name: repository.split("/")[1], number: parseInt(pull_request) };

    response = await github_query(github_token, query, variables);
    console.log(response);
    const pullRequestId = response['data']['repository']['pullRequest']['id'];

    console.log(`Adding Pull Request ${pull_request} to ${project['name']}`);
    console.log("");

    query = `
    mutation($pullRequestId:ID!, $projectId:ID!) {
      updatePullRequest(input:{pullRequestId:$pullRequestId, projectIds:[$projectId]}) {
        pullRequest {
          id
        }
      }
    }`;
    variables = { pullRequestId, projectId: project['id'] };

    response = await github_query(github_token, query, variables);
    console.log(response);
    console.log(`Done!`)
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
