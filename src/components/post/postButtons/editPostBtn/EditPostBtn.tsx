import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styles from './styles.module.css'

const EditPostBtn: React.FC = () => {
  const { slug } = useParams()
  const navigate = useNavigate()

  const goEdit = () => {
    navigate(`/articles/${slug}/edited`)
  }

  return (
    <button className={styles.btnEdit} onClick={goEdit}>
      Edit
    </button>
  )
}

export default EditPostBtn
