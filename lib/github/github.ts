const GITHUB_API = "https://api.github.com";

function getHeaders() {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

export async function githubFetch<T>(url: string): Promise<T> {
  const res = await fetch(`${GITHUB_API}${url}`, {
    headers: getHeaders(),
  });

  if (!res.ok) {
    throw new Error(
      `GitHub API Error: ${res.status} ${res.statusText}`
    );
  }

  return res.json();
}

export async function githubFetchAbsolute<T>(
  url: string
): Promise<T> {
  const res = await fetch(url, {
    headers: getHeaders(),
  });

  if (!res.ok) {
    throw new Error(
      `GitHub API Error: ${res.status}`
    );
  }

  return res.json();
}