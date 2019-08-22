# Auto Assign Author to a PR

This action will set the author of a PR as one of the assignees if the PR is otherwise unassigned.

## Run as a github action

Here is a sample `.yml` file to add this action

```yaml
name: AutoAssigner
on: [pull_request]

jobs:
  assignAuthor:
    runs-on: ubuntu-latest
    steps:
      - uses: samspills/assign-pr-to-author@v1.0
        if: github.event_name == 'pull_request' && github.event.action == 'opened'
        with:
          repo-token: '${{ secrets.GITHUB_TOKEN }}'
```
