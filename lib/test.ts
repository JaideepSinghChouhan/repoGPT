import { chunkFiles } from "./ingestion/chunker";
import { cloneRepo } from "./github/cloneRepo";
import { createEmbedding} from "./embeddings/embeddings";
import { EmbeddedChunk } from "../types/embedding";
import { scanRepo } from "./github/scanRepo";
import { basename } from "path";
import { saveChunks } from "./vector/saveEmbeddings";
import { retrieveChunks } from "./vector/retrieval";
import { askRepo } from "./rag/chat";
import { indexRepository } from "./ingestion/indexRepository";

async function main() {
  const repoPath = await cloneRepo(
    "https://github.com/JaideepSinghChouhan/SocialNest",
  );
  console.log(`Repository cloned to: ${repoPath}`);
  const files = await scanRepo(repoPath);

//   const chunks = chunkFiles(files, 30, 5);
  //   const embeddedChunks: EmbeddedChunk[] = [];
  //   for (const chunk of chunks) {
  //    const embedding =
  //       await createEmbedding(
  //          chunk.content
  //       );

  //    embeddedChunks.push({
  //       ...chunk,
  //       embedding,
  //       repoName: basename(repoPath)
  //    });
  //    //  console.log(embedding.length);
  //    //  console.log(embedding.slice(0,5));
  //   }

  // console.log(files.length);
  //   console.log(chunks.length);
  //   console.log(chunks.slice(0, 5));
  // const embedding =
  // await createEmbedding(
  //   "How does JWT authentication work?"
  // );

  // console.log(
  // embedding.length
  // );
  try {
    //  await saveChunks(embeddedChunks);
   //  const result = await askRepo("How does follow/unfollow work?");

   //  console.log(result.answer);
   //  console.log("Sources:");
   //  result.sources.forEach((source: { file: string; startLine: number; endLine: number }) => {
   //    console.log(`  - ${source.file}:${source.startLine}-${source.endLine}`);
   //  });

   const result =
   await indexRepository(
    "https://github.com/JaideepSinghChouhan/SocialNest"
   );

   console.log(result);

  } catch (error) {
    console.error(error);
  }

  // console.log(files[0]);
}

main();
