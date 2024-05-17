import { useAppSelector } from '../hook'
import { RootState } from '.'

export const useServerAuthorName = (): string | undefined | null => {
  return useAppSelector((state: RootState) => state.posts?.currentPost?.article?.author?.username)
}

export const useClientAuthorName = (): string | undefined | null => {
  return useAppSelector((state: RootState) => state.user.name)
}

export const useCoincidenceAuthors = (): boolean => {
  const serverAuthorName = useServerAuthorName()
  const clientAuthorName = useClientAuthorName()
  return serverAuthorName === clientAuthorName
}

export const useCurrentPost = () => {
  return useAppSelector((state: RootState) => state.posts?.currentPost?.article)
}

export const useUserEmail = (): string | undefined | null => {
  return useAppSelector((state: RootState) => state.user.email)
}

export const useUserAva = (): string | undefined | null => {
  return useAppSelector((state: RootState) => state.user.image)
}

export const usePosts = (): any => {
  return useAppSelector((state: RootState) => state.posts.posts)
}

export const useTotalPages = (): number | undefined => {
  return useAppSelector((state: RootState) => state.posts.articlesCount)
}

export const useCurrentPage = (): number => {
  return useAppSelector((state: RootState) => state.posts.currentPage)
}

export const useIsLoading = (): boolean => {
  return useAppSelector((state: RootState) => state.posts.isLoading)
}

export const useUserAvaHost = (): string | undefined | null => {
  return useAppSelector((state: RootState) => state.posts?.currentPost?.article?.author?.image)
}
