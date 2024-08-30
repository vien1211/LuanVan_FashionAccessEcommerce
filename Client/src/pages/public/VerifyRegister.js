import React, {useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import path from "../../ultils/path";
import Swal from "sweetalert2";

const VerifyRegister = () => {
  const { status } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if(status === 'failed') Swal.fire('Oop!', 'Failed Register', 'error').then(() => {
        navigate(`/${path.LOGIN}`)
    })
    if(status === 'success') Swal.fire('Congratulation!', 'Success Register. Please Log In', 'success').then(() => {
        navigate(`/${path.LOGIN}`)
    })
  })
  return (
    <div className='h-screen w-screen bg-slate-100'>

    </div>
  )
};

export default VerifyRegister;