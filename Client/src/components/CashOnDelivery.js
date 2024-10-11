import React, { useState } from 'react';
import { apiCreateOrder } from '../apis'; 
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { paymentStatuses } from '../ultils/contants';
import { useDispatch } from 'react-redux';
import { showModal } from '../store/app/appSlice';
import Loading from './Loading';

const CashOnDelivery = ({ amount, payload, setIsSuccess }) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleCashOnDelivery = async () => {
        setLoading(true);
        try {
            dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
            const response = await apiCreateOrder({ ...payload, status: 'Awaiting Confirmation',paymentStatus: 'Pending', paymentMethod: 'cod' });
            dispatch(showModal({ isShowModal: false, modalChildren: null }));
            if (response.success) {
                setIsSuccess(true);
                Swal.fire('Congratulation!', 'Order Successfully!', 'success').then(() => {
                    navigate('/');
                });
            } else {
                Swal.fire('Oops', 'Something went wrong!', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Oops', 'Something went wrong!', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='w-full'>
            <Button 
            name='Order Now'
            onClick={handleCashOnDelivery} 
            disabled={loading} 
            fw={true}
            style="bg-[#FC3C44] hover:bg-[#e64e53] w-full py-3 text-white rounded-sm"
            
            />
            
        </div>
    );
};

export default CashOnDelivery;

// const CashOnDelivery = ({ amount, payload, setIsSuccess }) => {
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();

//     const handleCashOnDelivery = async () => {
//         setLoading(true);
//         try {
//             // Create updated payload ensuring email is included
//             const email = payload.email || 'default@example.com';
//             const updatedPayload = {
//                 ...payload,
//                 status: 'Processing',
//                 paymentStatus: 'Pending',
//                 paymentMethod: 'cod',
//                 email
//             };

//             // Make the API call to create the order
//             const response = await apiCreateOrder(updatedPayload);
//             if (response.success) {
//                 setIsSuccess(true);
//                 Swal.fire('Congratulation!', 'Order Successfully!', 'success').then(() => {
//                     navigate('/');
//                 });
//             } else {
//                 Swal.fire('Oops', response.message || 'Something went wrong!', 'error');
//             }
//         } catch (error) {
//             console.error('Error:', error);
//             Swal.fire('Oops', error.message || 'Something went wrong!', 'error');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className='w-full'>
//             <Button 
//                 name='Order Now'
//                 onClick={handleCashOnDelivery} 
//                 disabled={loading} 
//                 fw={true}
//                 style="bg-[#FC3C44] w-full py-3 text-white rounded-sm"
//             />
//         </div>
//     );
// };

// export default CashOnDelivery;