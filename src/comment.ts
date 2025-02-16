import type { GitHub } from '@actions/github/lib/utils';

export type Octokit = InstanceType<typeof GitHub>;

export type Repo = {
  owner: string;
  repo: string;
};

function headerComment(header?: string) {
  return `<!-- Sticky Pull Request Comment${header || ''} -->`;
}

export async function findPreviousComment(
  octokit: Octokit,
  repo: Repo,
  issue_number: number,
  header?: string,
) {
  const { data: comments } = await octokit.rest.issues.listComments({
    ...repo,
    issue_number,
  });
  const h = headerComment(header);
  return comments.find((comment) => comment.body?.includes(h));
}

export async function updateComment(
  octokit: Octokit,
  repo: Repo,
  comment_id: number,
  body: string,
  header?: string,
  previousBody?: string | false,
) {
  await octokit.rest.issues.updateComment({
    ...repo,
    comment_id,
    body: previousBody
      ? `${previousBody}\n${body}`
      : `${body}\n${headerComment(header)}`,
  });
}

export async function createComment(
  octokit: Octokit,
  repo: Repo,
  issue_number: number,
  body: string,
  header?: string,
  previousBody?: string | false,
) {
  await octokit.rest.issues.createComment({
    ...repo,
    issue_number,
    body: previousBody
      ? `${previousBody}\n${body}`
      : `${body}\n${headerComment(header)}`,
  });
}

export async function deleteComment(
  octokit: Octokit,
  repo: Repo,
  comment_id: number,
) {
  await octokit.rest.issues.deleteComment({
    ...repo,
    comment_id,
  });
}
