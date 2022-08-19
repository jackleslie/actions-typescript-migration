import * as github from '@actions/github';

import type { Octokit } from './types';

export async function createOrReplaceIssue({
  octokit,
  body,
  title,
}: {
  octokit: Octokit;
  body: string;
  title: string;
}): Promise<void> {
  const { data: issues } = await octokit.rest.issues.listForRepo(github.context.repo);

  const existing = issues.find((issue) => issue.title === title);

  if (existing) {
    const issue_number = existing.number;
    console.log(`Updating issue ${issue_number} with latest migration status`);

    const response = await octokit.rest.issues.update({
      ...github.context.repo,
      body,
      issue_number,
    });

    console.log(`Issue update response status ${response.status}`);
  } else {
    console.log(`Creating issue ${title} to show latest migration status`);

    const response = await octokit.rest.issues.create({
      ...github.context.repo,
      body,
      title,
    });

    console.log(`Issue creation response status ${response.status}`);
  }
}
