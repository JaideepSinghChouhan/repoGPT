import { createEmbeddings }
from "../embeddings/embeddings";

import { supabaseAdmin }
from "../admin";

export async function retrieveChunks(
  query: string,
  repositoryId: string,
  k = 5
) {
//   console.log("QUERY:", query);
// console.log("TYPE:", typeof query);
  const queryEmbeddings =
    await createEmbeddings([query]);

    const queryEmbedding =
    queryEmbeddings[0];

    const { data, error } =
    await supabaseAdmin.rpc(
      "match_repo_chunks",
      {
        query_embedding:
          queryEmbedding,

        repository_id_param:
          repositoryId,

        match_count: k,
      }
    );
    
  if (error) {
    throw error;
  }

  return data;
}