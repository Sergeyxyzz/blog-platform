import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import styles from './styles.module.css'
import likeImg from '../../../assets/like.png'
import avaImageStatic from '../../../assets/ava.jpg'
import onlikeImg from '../../../assets/onLike.svg'
import { useProfileImage } from '../../../functions'
import { useAppDispatch } from '../../../hook'
import { format } from 'date-fns'
import { fetchPostBySlug } from '../../../store/postsSlice'
import ReactMarkdown from 'react-markdown'
import NavigateButtons from '../../navigateButtons/NavigateButtons'
import DelPostBtn from '../postButtons/delPostBtn/DelPostBtn'
import EditPostBtn from '../postButtons/editPostBtn/EditPostBtn'
import { postLike } from '../../../store/postsSlice'
import { useCoincidenceAuthors, useCurrentPost } from '../../../store/selectors'
import remarkGfm from 'remark-gfm'

const SinglePost: React.FC = () => {
  const dispatch = useAppDispatch()
  const { slug } = useParams()
  const post = useCurrentPost()
  const access = useCoincidenceAuthors()
  const [profileImage, setProfileImage] = useState<string>(avaImageStatic)
  const formattedDate = post?.createdAt ? format(new Date(post.createdAt), 'MMMM d, yyyy') : ''
  const updatedDate = post?.updatedAt ? format(new Date(post.updatedAt), 'MMMM d, yyyy') : ''

  const image = post?.author?.image
  useProfileImage(image, avaImageStatic, setProfileImage)

  const handleLikeClick = () => {
    if (post) {
      dispatch(postLike({ slug: post.slug, isLiked: post.favorited }))
    }
  }

  useEffect(() => {
    if (slug) {
      dispatch(fetchPostBySlug(slug))
    }
  }, [slug, dispatch])

  if (!post) {
    return (
      <>
        <NavigateButtons />
        <div className={styles.wrap}>
          <h3 style={{ textAlign: 'center' }}>Пост не найден!</h3>
        </div>
      </>
    )
  }

  return (
    <>
      <NavigateButtons />
      {post && (
        <div className={styles.wrap}>
          <div className={styles.titleNLikes}>
            <div className={styles.inlineLikeImg}>
              <h5 className={styles.title}>
                {post?.title?.trim() ? (
                  <span className={styles.inTitle}>{post.title}</span>
                ) : (
                  <span style={{ color: 'red' }}>Тайтл отсутствует</span>
                )}
                <button className={styles.btnLike} onClick={handleLikeClick}>
                  <img
                    src={post.favorited ? onlikeImg : likeImg}
                    alt="like"
                    className={styles.like}
                  />
                </button>
                <span className={styles.totalLikes}>{post?.favoritesCount}</span>
              </h5>
            </div>
            <div className={styles.author}>
              <div className={styles.columnFlex}>
                <div className={styles.spanColumns}>
                  <span className={styles.authorName}>{post?.author?.username}</span>
                  <span className={styles.updateDate}>
                    {updatedDate ? updatedDate : formattedDate}
                  </span>
                </div>
                <div>
                  <img src={profileImage} alt="ava" className={styles.ava} />
                </div>
              </div>
            </div>
          </div>

          {access ? (
            <div className={styles.postButtons}>
              <DelPostBtn />
              <EditPostBtn />
            </div>
          ) : null}

          <div className={styles.underHeaderPost}>
            {post?.tagList?.length > 0 ? (
              post.tagList.map((tag: string, index: number) => (
                <div key={index} className={styles.tagItem}>
                  {tag?.trim() !== '' ? (
                    <div className={styles.tag}>{tag}</div>
                  ) : (
                    <span className={styles.errorTag}>Пустой тэг</span>
                  )}
                </div>
              ))
            ) : (
              <div className={styles.tagItem}>
                <div className={styles.noTag}>Тэги не добавлены</div>
              </div>
            )}
          </div>
          <span className={styles.descr}>{post?.description}</span>
          <div className={styles.description}>
            <div className={styles.text}>
              {post?.body?.trim() ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
              ) : (
                <span style={{ color: 'red' }}>Тело поста отсутствует</span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SinglePost
