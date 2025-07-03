import React, { useContext } from 'react'
import { AuthContext } from '../context/MyContext'
import { Navigate, useNavigate } from 'react-router-dom';

const PrivateRoute = ({children}) => {
    const {user} = useContext(AuthContext);
    
return user? children:<Navigate to="/login"/>;
}

export default PrivateRoute