import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, InputForm, EnterVerificationCode } from "../components";
import { apiSendVerificationCode } from "../apis"; // Assuming an API function for sending the code
import Swal from "sweetalert2";

const UpdateEmail = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isCodeSent, setIsCodeSent] = useState(false);

  const handleSendCode = async (data) => {
    try {
      const response = await apiSendVerificationCode(data.email);
      if (response.success) {
        setIsCodeSent(true);
        Swal.fire("Success", "Verification code sent to your new email.", "success");
      } else {
        Swal.fire("Error", "Failed to send verification code.", "error");
      }
    } catch (error) {
      console.error("Error sending code:", error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl mb-4">Update Email</h2>
      {!isCodeSent ? (
        <form onSubmit={handleSubmit(handleSendCode)}>
          <InputForm
            label="New Email"
            register={register}
            errors={errors}
            id="email"
            validate={{
              required: "Require",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            }}
            fullWidth
          />
          <Button type="submit" name="Send Verification Code" />
        </form>
      ) : (
        <EnterVerificationCode />
      )}
    </div>
  );
};

export default UpdateEmail;
