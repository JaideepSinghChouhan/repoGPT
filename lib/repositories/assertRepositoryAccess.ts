import { getRepository } from "./getRepository";

export async function assertRepositoryAccess(
  repositoryId: string,
  userId: string
) {
  const repository =
    await getRepository(
      repositoryId
    );

  if (!repository) {
    throw new Error(
      "Repository not found"
    );
  }

  if (
    repository.user_id !==
    userId
  ) {
    throw new Error(
      "Forbidden"
    );
  }

  return repository;
}