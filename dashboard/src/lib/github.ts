interface GitHubRepo {
  stargazers_count: number;
}

export async function getGitHubStats(): Promise<number | null> {
  try {
    const response = await fetch('https://api.github.com/repos/betterlytics/betterlytics', {
      next: {
        revalidate: 3600,
      },
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'Betterlytics-Website',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch GitHub stats:', response.status);
      return null;
    }

    const data: GitHubRepo = await response.json();

    return data.stargazers_count;
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    return null;
  }
}
