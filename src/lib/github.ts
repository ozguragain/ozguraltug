const GITHUB_API_BASE = "https://api.github.com";
const CONTENT_PATH = "src/content/writing";

export type GitHubConfig = {
  owner: string;
  repo: string;
  branch: string;
  token: string;
};

export type FileContent = {
  path: string;
  content: string;
  sha?: string;
};

async function githubFetch<T>(
  endpoint: string,
  config: GitHubConfig,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${config.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`GitHub API error: ${response.status} - ${error}`);
  }

  return response.json();
}

export async function getFileSha(
  config: GitHubConfig,
  path: string
): Promise<string | null> {
  try {
    const data = await githubFetch<{ sha: string }>(
      `/repos/${config.owner}/${config.repo}/contents/${path}?ref=${config.branch}`,
      config
    );
    return data.sha;
  } catch {
    return null;
  }
}

export async function getFileContent(
  config: GitHubConfig,
  path: string
): Promise<string | null> {
  try {
    const data = await githubFetch<{ content: string; encoding: string }>(
      `/repos/${config.owner}/${config.repo}/contents/${path}?ref=${config.branch}`,
      config
    );
    if (data.encoding === "base64") {
      return atob(data.content);
    }
    return data.content;
  } catch {
    return null;
  }
}

export async function createOrUpdateFile(
  config: GitHubConfig,
  file: FileContent,
  message: string
): Promise<void> {
  const path = `${CONTENT_PATH}/${file.path}`;
  const sha = file.sha || (await getFileSha(config, path));

  const body: Record<string, unknown> = {
    message,
    content: btoa(file.content),
    branch: config.branch,
  };

  if (sha) {
    body.sha = sha;
  }

  await githubFetch(
    `/repos/${config.owner}/${config.repo}/contents/${path}`,
    config,
    {
      method: "PUT",
      body: JSON.stringify(body),
    }
  );
}

export async function deleteFile(
  config: GitHubConfig,
  path: string,
  message: string
): Promise<void> {
  const sha = await getFileSha(config, `${CONTENT_PATH}/${path}`);
  if (!sha) return;

  await githubFetch(
    `/repos/${config.owner}/${config.repo}/contents/${CONTENT_PATH}/${path}`,
    config,
    {
      method: "DELETE",
      body: JSON.stringify({
        message,
        sha,
        branch: config.branch,
      }),
    }
  );
}

export function createGitHubConfig(): GitHubConfig {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";
  const token = process.env.GITHUB_TOKEN;

  if (!owner || !repo || !token) {
    throw new Error(
      "Missing required GitHub environment variables: GITHUB_OWNER, GITHUB_REPO, GITHUB_TOKEN"
    );
  }

  return { owner, repo, branch, token };
}
