import { githubFetch, githubFetchAbsolute } from "./github";
import { parseRepoUrl } from "./parseRepo";
import {
  ALLOWED_EXTENSIONS,
  IGNORED_DIRS,
  IGNORED_FILES,
} from "../ingestion/filters";

export interface RepoFile {
  filePath: string;
  content: string;
}
interface BlobResponse {
  content: string;
  encoding: string;
}

interface GitTreeItem {
  path: string;
  type: "blob" | "tree";
  url: string;
}

interface RepoInfo {
  default_branch: string;
}

interface GitTreeResponse {
  tree: GitTreeItem[];
}

interface FileResponse {
  content: string;
  encoding: string;
}


export async function getRepoFiles(
  repoUrl: string
): Promise<RepoFile[]> {

  const { owner, repo } =
    parseRepoUrl(repoUrl);

    const repository =
  await githubFetch<RepoInfo>(
    `/repos/${owner}/${repo}`
  );

const branch =
  repository.default_branch;

  const tree =
  await githubFetch<GitTreeResponse>(
    `/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
  );

  const files =
  tree.tree.filter((item) => {

    if (item.type !== "blob") {
      return false;
    }

    const extension =
      item.path.substring(
        item.path.lastIndexOf(".")
      );

    if (
      !ALLOWED_EXTENSIONS.includes(extension)
    ) {
      return false;
    }

    if (
      IGNORED_FILES.some(file =>
        item.path.endsWith(file)
      )
    ) {
      return false;
    }

    if (
      IGNORED_DIRS.some(dir =>
        item.path.includes(`/${dir}/`)
      )
    ) {
      return false;
    }

    return true;
  });
//   console.log(files.length);
//   console.log(files.slice(0,5));


const repoFiles: RepoFile[] = [];

const BATCH_SIZE = 10;

for (
  let i = 0;
  i < files.length;
  i += BATCH_SIZE
) {
  const batch =
    files.slice(i, i + BATCH_SIZE);

  const downloaded =
    await Promise.all(
      batch.map(async (file) => {
        try {
          const blob =
            await githubFetchAbsolute<BlobResponse>(
              file.url
            );

          if (
            blob.encoding !== "base64"
          ) {
            return null;
          }

          return {
            filePath: file.path,
            content: Buffer.from(
              blob.content,
              "base64"
            ).toString("utf8")
            .replace(/\0/g,""),
          };
        } catch {
          return null;
        }
      })
    );

  repoFiles.push(
    ...downloaded.filter(Boolean) as RepoFile[]
  );

  console.log(
    `Downloaded ${repoFiles.length}/${files.length}`
  );
}

return repoFiles;

}