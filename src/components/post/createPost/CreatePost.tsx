import React, { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { postPost } from '../../../store/postsSlice'
import styles from './styles.module.css'
import NavigateButtons from '../../navigateButtons/NavigateButtons'
import { useAppDispatch } from '../../../hook'
import { useNavigate } from 'react-router-dom'

type FormValues = {
  title: string
  description: string
  text: string
  tagList: string[]
}

const CreatePost: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>()

  const [tagList, setTaglist] = useState<string[]>([])
  const [tagInput, setTagInput] = useState<string>('')

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    dispatch(
      postPost({
        title: data.title,
        description: data.description,
        body: data.text,
        tagList,
      }),
    )
      .then(() => {
        reset()
        setTaglist([])
        setTagInput('')
      })
      .catch((error: { message: string }) => {
        console.error(error.message)
      })

    navigate(-1)
  }

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim()
    if (trimmedTag && !tagList.includes(trimmedTag)) {
      setTaglist([...tagList, trimmedTag])
      setTagInput('')
    }
  }

  const handleDeleteTag = (tagToDelete: string) => {
    setTaglist(tagList.filter((tag) => tag !== tagToDelete))
  }

  const handleClearTagInput = () => {
    setTagInput('')
  }

  return (
    <div>
      <NavigateButtons />
      <div className={styles.wrapPostArticle}>
        <h1 className={styles.title}>Create new article</h1>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.formPost}>
          <div className={styles.titlePost}>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              placeholder="Title"
              {...register('title', { required: 'Заголовок обязателен' })}
            />
            {errors.title && <p className={styles.error}>{errors.title.message}</p>}
          </div>
          <div className={styles.shortDescription}>
            <label htmlFor="description">Short description</label>
            <input
              type="text"
              placeholder="Short description"
              {...register('description', { required: 'Краткое описание обязательно' })}
            />
            {errors.description && <p className={styles.error}>{errors.description.message}</p>}
          </div>
          <div className={styles.description}>
            <label htmlFor="text">Text</label>
            <textarea placeholder="Text" {...register('text', { required: 'Текст обязателен' })} />
            {errors.text && <p className={styles.error}>{errors.text.message}</p>}
          </div>
          <div className={styles.postTags}>
            <label className={styles.tagsTitle} htmlFor="tags">
              Tags
            </label>
            <div className={styles.wrapTagsInside}>
              <ul className={styles.tagsUl}>
                {tagList.map((tag, i) => (
                  <span key={i} className={styles.wrapLiTag}>
                    <li className={styles.tagItem}>{tag}</li>
                    <button
                      type="button"
                      onClick={() => handleDeleteTag(tag)}
                      className={styles.btnDelTagItem}
                    >
                      Delete
                    </button>
                  </span>
                ))}
                <div className={styles.inlineTags}>
                  <input
                    type="text"
                    placeholder="Tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleClearTagInput}
                    className={styles.btnDelTagItem}
                  >
                    Delete
                  </button>
                  <button type="button" onClick={handleAddTag} className={styles.btnAddTag}>
                    Add tag
                  </button>
                </div>
              </ul>
            </div>
          </div>
          <div className={styles.formSubmitBtnWrap}>
            <button type="submit" className={styles.btnSubmitFormPost}>
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePost
