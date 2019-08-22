"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = core.getInput('repo-token', { required: true });
            const client = new github.GitHub(token);
            const assignee = getPrAssignee();
            if (!assignee) {
                console.log('PR is unassigned, assigning PR');
                const success = yield assignPull(client);
                if (!success) {
                    core.setFailed('Assigning PR failed');
                }
            }
        }
        catch (error) {
            core.error(error);
            core.setFailed(error.message);
        }
    });
}
function assignPull(client) {
    return __awaiter(this, void 0, void 0, function* () {
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
        yield client.issues.update({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            issue_number: prNumber,
            assignees: [
                author
            ]
        });
        return true;
    });
}
function getPrNumber() {
    console.log('getting PR number');
    const pullRequest = github.context.payload.pull_request;
    if (!pullRequest) {
        console.log('could not get PR object');
        return undefined;
    }
    return pullRequest.number;
}
function getPrAssignee() {
    console.log('getting PR assignees');
    const pullRequest = github.context.payload.pull_request;
    if (!pullRequest) {
        console.log('could not get PR object');
        return undefined;
    }
    return pullRequest.assignees;
}
function getPrAuthor() {
    console.log('getting PR author');
    const pullRequest = github.context.payload.pull_request;
    if (!pullRequest || !pullRequest.user) {
        console.log('could not get PR object or PR object did not have user object');
        return undefined;
    }
    return pullRequest.user.login;
}
run();
