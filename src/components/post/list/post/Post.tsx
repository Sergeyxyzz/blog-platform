import React, { useState } from 'react'
import styles from './styles.module.css'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import avaImageStatic from '../../../../assets/ava.jpg'
import likeImg from '../../../../assets/like.png'
import onlikeImg from '../../../../assets/onLike.svg'
import { useProfileImage } from '../../../../functions'
import { useAppDispatch } from '../../../../hook'
import { postLike } from '../../../../store/postsSlice'
import { useClientAuthorName } from '../../../../store/selectors'
import { Spin } from 'antd'

type PostProps = {
  title: string
  slug: string
  username: string
  image: string
  body: string
  tagList: string[]
  following: boolean
  favoritesCount: number
  description: string
  createdAt: string
  updatedAt: string
  favorited: boolean
}

const Post: React.FC<PostProps> = ({
  title,
  slug,
  username,
  image,
  tagList,
  favoritesCount,
  createdAt,
  updatedAt,
  description,
  favorited,
}) => {
  const [profileImage, setProfileImage] = useState<string>(avaImageStatic)
  const loginName = useClientAuthorName()
  const dispatch = useAppDispatch()
  const [isLoadingLikeForThisPost, setIsLoadingLikeForThisPost] = useState(false)

  useProfileImage(image, avaImageStatic, setProfileImage)

  const formattedDate = format(new Date(createdAt), 'MMMM d, yyyy')
  const updatedDate = format(new Date(updatedAt), 'MMMM d, yyyy')

  const handleLikeClick = async () => {
    setIsLoadingLikeForThisPost(true)
    try {
      await dispatch(postLike({ slug, isLiked: favorited })).unwrap()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoadingLikeForThisPost(false)
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.titleNLikes}>
        <div className={styles.inlineLikeImg}>
          <h5 className={styles.title}>
            <Link
              to={`/articles/${slug}`}
              state={{
                post: {
                  slug,
                },
              }}
              className={styles.link}
            >
              {title?.trim() ? (
                <span className={styles.headTitle}>{title}</span>
              ) : (
                <span className={styles.headTitleError}>Тайтл отсутствует</span>
              )}
            </Link>

            <button className={styles.btnLike} onClick={handleLikeClick}>
              {isLoadingLikeForThisPost ? (
                <Spin />
              ) : (
                <img
                  src={favorited && loginName ? onlikeImg : likeImg}
                  alt="like"
                  className={styles.like}
                />
              )}
            </button>

            <span className={styles.totalLikes}>{favoritesCount}</span>
          </h5>
        </div>
        <div className={styles.author}>
          <span className={styles.authorName}>{username}</span>
          <img src={profileImage} alt="ava" className={styles.ava} />
        </div>
      </div>

      <div className={styles.underHeaderPost}>
        {tagList?.length > 0 ? (
          tagList?.map((tag, index) => (
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
        <div className={styles.date}>{updatedAt ? updatedDate : formattedDate}</div>
      </div>
      <div className={styles.description}>
        <div className={styles.text}>
          {description?.trim() ? (
            description
          ) : (
            <span style={{ color: 'red' }}>Тело поста отсутствует</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default Post
