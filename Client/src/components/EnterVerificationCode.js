import React from "react";
import { useForm } from "react-hook-form";
import { Button, InputForm } from "../components";
import { apiVerifyCodeAndUpdateEmail } from "../apis"; // Assuming an API for code verification and email update
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const EnterVerificationCode = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const handleVerifyCode = async (data) => {
    try {
      const response = await apiVerifyCodeAndUpdateEmail(data.code);
      if (response.success) {
        Swal.fire("Updated", "Your email has been updated successfully.", "success");
        navigate("/personal");  // Redirect back to Personal Info page
      } else {
        Swal.fire("Error", "Invalid code. Please try again.", "error");
      }
    } catch (error) {
      console.error("Error verifying code:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleVerifyCode)} className="flex flex-col items-center">
      <InputForm
        label="Verification Code"
        register={register}
        errors={errors}
        id="code"
        validate={{
          required: "Require",
        }}
        fullWidth
      />
      <Button type="submit" name="Verify and Update Email" />
    </form>
  );
};

export default EnterVerificationCode;
