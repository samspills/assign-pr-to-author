import * as core from '@actions/core';
import * as github from '@actions/github';
import { BooleanTypeAnnotation } from '@babel/types';

async function run() {
    try {
        const token = core.getInput('repo-token', { required: true });
        const client = new github.GitHub(token);
        const assignee = getPrAssignee();
        if (!assignee) {
            console.debug('PR is unassigned');
            const success = await assignPull(client);
            if (!success) {
                core.setFailed('Assigning PR failed')
            }
        }
    } catch (error) {
        core.error(error);
        core.setFailed(error.message);
    }
}

async function assignPull(client: github.GitHub): Promise<Boolean> {
    const author = getPrAuthor();
    const prNumber = getPrNumber();
    if (!author) {
        console.log('Could not get PR author, exiting');
        return false;
    }
    if (!prNumber) {
        console.log('Could not get PR number, exiting');
        return false;
    }
    await client.issues.update({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: prNumber,
        assignees: [
            author
        ]
    })

    return true;
}

function getPrNumber(): number | undefined {
    const pullRequest = github.context.payload.pull_request;
    if (!pullRequest) {
        return undefined;
    }

    return pullRequest.number;
}

function getPrAssignee(): string[] | undefined {
    const pullRequest = github.context.payload.pull_request;
    if (!pullRequest) {
        return undefined;
    }

    return pullRequest.assignees
}

function getPrAuthor(): string | undefined {
    const pullRequest = github.context.payload.pull_request;
    if (!pullRequest || !pullRequest.user) {
        return undefined;
    }

    return pullRequest.user.login
}
run();
