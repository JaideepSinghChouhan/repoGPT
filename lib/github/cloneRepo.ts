import { simpleGit, SimpleGit, CleanOptions } from 'simple-git';
import path from 'path'
import fs from 'fs/promises'

const git: SimpleGit = simpleGit();

export async function cloneRepo(repoUrl: string): Promise<string> {
    const repoName = repoUrl.split('/').pop()?.replace('.git', '');
    const clonePath = path.join(
        process.cwd(),
        "repos",
        repoName!
    )
    try{
        await fs.rm(clonePath,{
            recursive: true,
            force: true
        })
        await git.clone(repoUrl, clonePath);

        return clonePath;
    }catch(err){
        console.error(`Failed to clone repository: ${err}`);
        throw err;
    }
}