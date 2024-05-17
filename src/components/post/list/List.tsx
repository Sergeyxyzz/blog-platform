import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import Post from './post/Post'
import { v4 as uuidv4 } from 'uuid'
import { useAppDispatch } from '../../../hook'
import { Pagination, Spin } from 'antd'
import { setCurrentPage } from '../../../store/postsSlice'
import { fetchPost } from '../../../store/postsSlice'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useCurrentPage, useIsLoading, usePosts, useTotalPages } from '../../../store/seletors'

interface Author {
  username: string
  image: string
  following: boolean
}

interface PostType {
  slug: string
  title: string
  description: string
  body: string
  createdAt: string
  updatedAt: string
  favorited: boolean
  favoritesCount: number
  tagList: string[]
  author: Author
}

const List: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const posts: any = usePosts()
  const totalPages = useTotalPages()
  const currentPage = useCurrentPage()
  const isLoading = useIsLoading()
  const [pageParam, setPageParam] = useState(1)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const page = Number(searchParams.get('page')) || 1
    setPageParam(page)
    dispatch(setCurrentPage(page))
  }, [searchParams, dispatch])

  const handlePageChange = (page: number) => {
    navigate(`?page=${page}`)
    setPageParam(page)
    dispatch(setCurrentPage(page))
  }

  useEffect(() => {
    if (currentPage !== pageParam) {
      dispatch(setCurrentPage(pageParam))
    }
  }, [pageParam, currentPage, dispatch])

  useEffect(() => {
    dispatch(fetchPost(currentPage))
  }, [currentPage, dispatch])

  return (
    <div className={styles.wrap}>
      {isLoading && <Spin />}
      {posts?.map((post: PostType) => (
        <Post
          key={uuidv4()}
          favorited={post.favorited}
          title={post.title}
          slug={post.slug}
          username={post.author.username}
          image={post.author.image}
          body={post.body}
          description={post.description}
          tagList={post.tagList}
          following={post.author.following}
          favoritesCount={post.favoritesCount}
          createdAt={post.createdAt}
          updatedAt={post.updatedAt}
        />
      ))}
      <div className={styles.pagination}>
        <Pagination
          current={currentPage}
          total={totalPages}
          pageSize={5}
          onChange={handlePageChange}
          defaultCurrent={1}
          showSizeChanger={false}
        />
      </div>
    </div>
  )
}

export default List
