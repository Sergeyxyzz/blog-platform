import React, { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import styles from './styles.module.css'
import NavigateButtons from '../../navigateButtons/NavigateButtons'
import { useAppDispatch } from '../../../hook'
import { useNavigate } from 'react-router-dom'
import { editPost } from '../../../store/postsSlice'
import { useParams } from 'react-router-dom'
import { fetchPostBySlug } from '../../../store/postsSlice'
import { Modal } from 'antd'
import { useCoincidenceAuthors, useCurrentPost } from '../../../store/selectors'

type FormValues = {
  slug: string
  title: string
  description: string
  text: string
  tagList: string[]
}

const EditPost: React.FC = () => {
  const currentPost = useCurrentPost()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { slug } = useParams()
  const access = useCoincidenceAuthors()
  const [stateTitle, setStateTitle] = useState<string>()
  const [stateDescription, setStateDescription] = useState<string>()
  const [stateBody, setStateBody] = useState<string>()

  const {
    title: initialTitle,
    description: initialDescription,
    body: initialBody,
    tagList: initialTaglis,
  } = currentPost ?? {}

  const [tagList, setTaglist] = useState<string[]>(initialTaglis || [])
  const [tagInput, setTagInput] = useState<string>('')

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStateTitle(e.target.value)
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStateDescription(e.target.value)
  }

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setStateBody(e.target.value)
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormValues>()

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const articleData = {
      title: data.title,
      description: data.description,
      body: data.text,
      tagList,
    }

    dispatch(editPost({ slug: slug!, payload: articleData }))
      .unwrap()
      .then(() => {
        reset()
        setTaglist([])
        setTagInput('')
        navigate(-1)
      })
  }

  useEffect(() => {
    if (!access) {
      Modal.info({ title: <h4>Вы не можете редактировать посты других пользователей</h4> })
      navigate('/')
    }
  }, [])

  useEffect(() => {
    if (slug) {
      dispatch(fetchPostBySlug(slug))
    }

    setStateTitle(initialTitle)
    setStateDescription(initialDescription)
    setStateBody(initialBody)
  }, [slug, dispatch, initialBody, initialDescription, initialTitle])

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

  useEffect(() => {
    if (currentPost) {
      setValue('title', initialTitle || '')
      setValue('description', initialDescription || '')
      setValue('text', initialBody || '')
    }
  }, [currentPost, initialTitle, initialDescription, initialBody, setValue])

  return (
    <div>
      <NavigateButtons />
      <div className={styles.wrapPostArticle}>
        <h1 className={styles.title}>Edit article</h1>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.formPost}>
          <div className={styles.titlePost}>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              placeholder="Title"
              {...register('title', { required: 'Заголовок обязателен' })}
              value={stateTitle}
              onChange={handleTitleChange}
            />
            {errors.title && <p className={styles.error}>{errors.title.message}</p>}
          </div>
          <div className={styles.shortDescription}>
            <label htmlFor="description">Short description</label>
            <input
              type="text"
              placeholder="Short description"
              {...register('description', { required: 'Краткое описание обязательно' })}
              value={stateDescription}
              onChange={handleDescriptionChange}
            />
            {errors.description && <p className={styles.error}>{errors.description.message}</p>}
          </div>
          <div className={styles.description}>
            <label htmlFor="text">Text</label>
            <textarea
              placeholder="Text"
              {...register('text', { required: 'Текст обязателен' })}
              value={stateBody}
              onChange={handleBodyChange}
            />
            {errors.text && <p className={styles.error}>{errors.text.message}</p>}
          </div>
          <div className={styles.postTags}>
            <label htmlFor="tags" className={styles.tagsTitle}>
              Tags
            </label>
            <div className={styles.wrapTagsInside}>
              <ul className={styles.tagsUl}>
                {tagList?.map((tag, i) => (
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
                    id="tags"
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

export default EditPost
