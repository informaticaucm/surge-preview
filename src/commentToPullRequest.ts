import * as core from '@actions/core';
import {
  Octokit,
  Repo,
  createComment,
  findPreviousComment,
  updateComment,
} from './comment';

interface CommentConfig {
  repo: Repo;
  number: number;
  message: string;
  octokit: Octokit;
  header: string;
}

export async function comment({
  repo,
  number,
  message,
  octokit,
  header,
}: CommentConfig) {
  if (isNaN(number) || number < 1) {
    core.info('no numbers given: skip step');
    return;
  }
  const prefixedHeader = `: Surge Preview ${header}'`;

  try {
    const previous = await findPreviousComment(
      octokit,
      repo,
      number,
      prefixedHeader,
    );
    const body = message;

    if (previous) {
      await updateComment(
        octokit,
        repo,
        previous.id,
        body,
        prefixedHeader,
        false,
      );
    } else {
      await createComment(octokit, repo, number, body, prefixedHeader);
    }
  } catch (err) {
    let errorMessage = 'Unexpected error';
    if (err instanceof Error) {
      errorMessage = err.message;
    }
    core.setFailed(errorMessage);
  }
}
