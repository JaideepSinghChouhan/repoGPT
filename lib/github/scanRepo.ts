import fs from "fs/promises";
import path from "path";

import { ALLOWED_EXTENSIONS, IGNORED_DIRS, IGNORED_FILES } from "../ingestion/filters";
import { Repofile } from "../../types/repo";


export async function scanRepo(rootDir: string): Promise<Repofile[]> {
  const files: Repofile[] = [];

  async function walk(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    // console.log(`Scanning directory: ${dir}`);
    for (const entry of entries) {
    //   console.log({
    //     name: entry.name,
    //     isDir: entry.isDirectory(),
    //   });
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory() && IGNORED_DIRS.includes(entry.name)) {
        continue;
      }
      if(entry.isFile() && IGNORED_FILES.includes(entry.name)) {
        continue;
      }
      if (entry.isDirectory()) {
        await walk(fullPath);
        continue;
      }
      const extension = path.extname(entry.name);

      if (!ALLOWED_EXTENSIONS.includes(extension)) {
        continue;
      }
      try {
        const content = await fs.readFile(fullPath, "utf-8");
        files.push({
          filePath: path.relative(rootDir, fullPath),
          content,
        });
      } catch {
        console.log("Error reading file");
        continue;
      }
    }
  }
  await walk(rootDir);
  return files;
}
