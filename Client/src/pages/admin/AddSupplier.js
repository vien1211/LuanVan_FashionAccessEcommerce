import React from 'react'
import { apiAddSupplier } from '../../apis';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { showModal } from '../../store/app/appSlice';
import { Button, InputForm, Loading } from '../../components';
import Swal from 'sweetalert2';

const AddSupplier = () => {
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm();
  const dispatch = useDispatch();

  const handleAddSupplier = async (data) => {
    dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
    const response = await apiAddSupplier(data);
    dispatch(showModal({ isShowModal: false, modalChildren: null }));
  
    if (response.success) {
      Swal.fire({
        title: "Created",
        text: "Add New Supplier Successfully!",
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          title: "custom-title",
          text: "custom-text",
          confirmButton: "custom-confirm-button",
        },
      });
      reset();
    } else {
      Swal.fire({
        title: "Oops!",
        text: response.mes || "Failed to Add New Supplier!",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          title: "custom-title",
          text: "custom-text",
          confirmButton: "custom-confirm-button",
        },
      });
    }
  };

  return (
    <div className="w-full p-6">
        <h1 className="flex justify-between items-center text-3xl font-bold px-8">
          <span>Add Supplier</span>
        </h1>

        <div className="py-4">
        <form onSubmit={handleSubmit(handleAddSupplier)}>
          <InputForm
            label="Supplier Name"
            register={register}
            errors={errors}
            id="name"
            validate={{
              required: "Require",
            }}
            fullWidth
            placeholder="Name of Supplier"
            style="rounded-md py-2"
          />

          <InputForm
            label="Contact"
            register={register}
            errors={errors}
            id="contact"
            validate={{
              required: "Require",
            }}
            fullWidth
            placeholder="Contact"
            style="rounded-md py-2"
          />

          <InputForm
            label="Address"
            register={register}
            errors={errors}
            id="address"
            validate={{
              required: "Require",
            }}
            fullWidth
            placeholder="Supplier Address"
            style="rounded-md py-2"
          />

          <div className="mt-8">
            <Button type="submit" name="Add Supplier" />
          </div>
        </form>
        </div>
    </div>
  )
}

export default AddSupplier