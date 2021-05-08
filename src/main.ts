import * as core from '@actions/core';
import * as github from '@actions/github';

async function run() {
    try {
        const token = core.getInput('repo-token', { required: true });
        const client = new github.GitHub(token);
        const assignees = getPrAssignees();
        if (!assignees || !Array.isArray(assignees) || !assignees.length) {
            console.log('PR is unassigned, assigning PR');
            const success = await assignPull(client);
            if (!success) {
                core.setFailed('Assigning PR failed');
            }
        }
    } catch (error) {
        console.error(error.message)
        core.error(error);
        core.setFailed(error.message);
    }
}

async function assignPull(client: github.GitHub): Promise<Boolean> {
    const author = getPrAuthor();
    const prNumber = getPrNumber();
    if (!author) {
        console.log('Could not get PR author, aborting');
        return false;
    }
    if (!prNumber) {
        console.log('Could not get PR number, aborting');
        return false;
    }

    if (author.type != 'User') {
        console.log('author not a "User", exiting')
        return true;
    }
    await client.issues.update({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: prNumber,
        assignees: [
            author.login
        ]
    })

    return true;
}

function getPrNumber(): number | undefined {
    console.log('getting PR number')
    const pullRequest = github.context.payload.pull_request;
    if (!pullRequest) {
        console.log('could not get PR object')
        return undefined;
    }
    return pullRequest.number;
}

function getPrAssignees(): string[] | undefined {
    console.log('getting PR assignees');
    const pullRequest = github.context.payload.pull_request;
    if (!pullRequest) {
        console.log('could not get PR object')
        return undefined;
    }

    return pullRequest.assignees
}

interface User {
    login: string;
    type: string;
}

function getPrAuthor(): User | undefined {
    console.log('getting PR author')
    const pullRequest = github.context.payload.pull_request;
    if (!pullRequest || !pullRequest.user) {
        console.log('could not get PR object or PR object did not have user object')
        return undefined;
    }


    return pullRequest.user
}
run();
