import React from 'react'
import { useAppDispatch } from '../../../../hook'
import { deletePost } from '../../../../store/postsSlice'
import { useNavigate, useParams } from 'react-router-dom'
import { Modal } from 'antd'
import styles from './styles.module.css'

const DelPostBtn: React.FC = () => {
  const { slug } = useParams<{ slug: any }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleDelete = async () => {
    const resultAction = await dispatch(deletePost(slug))
    if (deletePost.rejected.match(resultAction)) {
      Modal.error({
        title: 'Ошибка',
        content: 'Можно удалить только свой пост.',
      })
    } else {
      navigate('/')
    }
  }

  const showConfirmation = () => {
    Modal.confirm({
      title: 'Вы уверены, что хотите удалить пост?',
      content: 'Это действие нельзя будет отменить!',
      okText: 'Yes',
      cancelText: 'No',
      onOk: handleDelete,
    })
  }

  return (
    <>
      <button className={styles.btnDelete} onClick={showConfirmation}>
        Delete
      </button>
    </>
  )
}

export default DelPostBtn
