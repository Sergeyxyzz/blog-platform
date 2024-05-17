import React from 'react'
import { Navigate } from 'react-router-dom'

interface PrivateRouteProps {
  isAuthenticated: boolean
  children: JSX.Element
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />
  }
  return children
}

export default PrivateRoute
