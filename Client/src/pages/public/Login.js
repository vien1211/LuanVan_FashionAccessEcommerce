import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import path from "../../ultils/path";
import { InputField, Button, Loading } from "../../components";
import { apiRegister, apiLogin, apiForgotPassword, apiGoogleLogin } from "../../apis/user";
import Swal from "sweetalert2";
import { login } from "../../store/user/userSlice";
import { useDispatch } from "react-redux";
import { validate } from "../../ultils/helper";
import { showModal } from "../../store/app/appSlice";
import icons from "../../ultils/icons";

import salebag from "../../assets/salebag.png";
import gc from "../../assets/girl with shopping cart.png";
import star from "../../assets/star.png";
import gift3 from "../../assets/gift3.png";
import gift4 from "../../assets/gif4.png";
import shadow from "../../assets/Shadow.png";
import balloon from "../../assets/balloons.png";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

const { IoHome, IoEye, IoEyeOff } = icons;

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [payload, setPayLoad] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    mobile: "",
  });

  const [invalidFields, setInvalidFields] = useState([]);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [searchParams] = useSearchParams();
  

  const resetPayload = () => {
    setPayLoad({
      email: "",
      password: "",
      firstname: "",
      lastname: "",
      mobile: "",
    });
  };
  const handleChange = useCallback((nameKey, value) => {
    setPayLoad((prev) => ({
      ...prev,
      [nameKey]: value,
    }));
  }, []);

  const [email, setEmail] = useState("");

  // const handleForgotPassWord = async() => {
  //   const response = await apiForgotPassword({email})
  //   console.log(response)
  // };
  const handleForgotPassWord = async () => {
    try {
      const response = await apiForgotPassword({ email });
      console.log(response);
      Swal.fire({
        title: "Check your email!",
        text: "A link to reset your password has been sent to your email.",
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          title: "custom-title",
          text: "custom-text",
          confirmButton: "custom-confirm-button",
          cancelButton: "custom-cancel-button",
        },
      }).then(() => {
        setIsForgotPassword(false);
        resetPayload();
      });
    } catch (error) {
      console.error("Error during forgot password request:", error);
      Swal.fire({
        title: "Oops!",
        text:
          error.response?.data?.mes ||
          "Failed to send reset email. User not found!",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          title: "custom-title",
          text: "custom-text",
          confirmButton: "custom-confirm-button",
          cancelButton: "custom-cancel-button",
        },
      });
    }
  };

  useEffect(() => {
    resetPayload();
  }, [isSignUp]);

  const handleSubmit = useCallback(async () => {
    const { firstname, lastname, mobile, ...data } = payload;

    const invalids = isSignUp
      ? validate(payload, setInvalidFields)
      : validate(data, setInvalidFields);
    if (invalids === 0) {
      try {
        if (isSignUp) {
          dispatch(
            showModal({ isShowModal: true, modalChildren: <Loading /> })
          );

          const response = await apiRegister(payload);
          dispatch(showModal({ isShowModal: false, modalChildren: null }));
          console.log("Sign-Up response:", response);
          Swal.fire({
            title: "Congratulations!",
            text: response.mes || "Registration successful!",
            icon: "success",
            confirmButtonText: "OK",
            customClass: {
              title: "custom-title",
              text: "custom-text",
              confirmButton: "custom-confirm-button",
              cancelButton: "custom-cancel-button",
            },
          }).then(() => {
            setIsSignUp(false);
            resetPayload();
          });
        } else {
          const rs = await apiLogin(data);
          console.log("Login response:", rs);
          // If login is successful
          if (rs.success) {
            dispatch(
              login({
                isLoggedIn: true,
                token: rs.accessToken,
                userData: rs.userData,
              })
            );
            searchParams.get("redirect")
              ? navigate(searchParams.get("redirect"))
              : navigate(`/${path.HOME}`);
          } else {
            Swal.fire({
              title: "Wrong Password!",
              text: "Your account will be block after 3 failed attempts.",
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        }
      } catch (error) {
        console.error("Error during API call:", error);
        const errorMessage =
          error?.mes || error.message || "An error occurred.";
        Swal.fire({
          title: "Oops!",
          text: errorMessage,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  }, [payload, isSignUp, navigate, dispatch]);

  const handleGoogleLoginSuccess = async (response) => {
    try {
      const token = response.credential;
      const rs = await apiGoogleLogin({ token });

      if (rs.success) {
        dispatch(
          login({
            isLoggedIn: true,
            token: rs.accessToken,
            userData: rs.userData,
          })
        );
        searchParams.get("redirect")
          ? navigate(searchParams.get("redirect"))
          : navigate(`/${path.HOME}`);
      } else {
        Swal.fire({
          title: "Oops!",
          text: rs.mes || "Google login failed!",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error during Google login:", error);
      Swal.fire({
        title: "Oops!",
        text: error.message || "An error occurred during Google login.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleGoogleLoginError = () => {
    Swal.fire({
      title: "Oops!",
      text: "Google login failed!",
      icon: "error",
      confirmButtonText: "OK",
    });
  };

  return (
    <div className="bg-main w-screen h-screen flex overflow-hidden">
      <Link
        to={`/${path.HOME}`}
        className="absolute text-white p-4 top-8 left-8 bg-[#273526] hover:bg-white hover:text-main rounded-full flex items-center group transition-all ease-in-out duration-300 w-14 hover:w-auto overflow-hidden"
      >
        <div className="flex items-center justify-center transition-transform duration-300 ease-in-out group-hover:scale-125 w-14">
          <IoHome size={25} />
        </div>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out whitespace-nowrap">
          Back to Home
        </span>
      </Link>

      {isForgotPassword && (
        <div className="absolute top-0 left-0 bottom-0 right-0 bg-white py-8 z-50 flex flex-col items-center">
          <div className="flex flex-col gap-4 w-full max-w-lg">
            <h3 className="art-word-shadow">Forgot</h3>
            <h3 className="gradient-text -mt-8">Password?</h3>
            <label htmlFor="email" className="text-lg font-semibold">
              Enter your email:
            </label>
            <input
              type="email"
              id="email"
              className="w-full pb-2 border-b-2 border-gray-300 outline-none placeholder:text-sm"
              placeholder="Exp: email@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
            />
          </div>
          <div className="flex items-center justify-end w-full max-w-md mt-4 gap-2">
            <Button name="Submit" handleOnClick={handleForgotPassWord} />
            <Button
              name="Cancel"
              handleOnClick={() => setIsForgotPassword(false)}
              style="px-4 py-2 bg-black rounded-md text-white items-center justify-center my-2"
            />
          </div>
        </div>
      )}

      <div className="w-[50%] flex flex-col items-center justify-center mt-[-95px] right-1/2">
        <div className="font-bold uppercase text-white mb-4 text-center animate-fadeIn">
          <span className="block text-[35px]">Welcome to</span>
          <span className="block text-[80px]">Vieen's Store</span>
        </div>
        <div className="p-8 flex flex-col items-center bg-white min-w-[450px] rounded-md shadow-2xl animate-slideInUp">
          <h1 className="text-[28px] font-semibold text-main mb-2">
            {isSignUp ? "SIGN UP" : "LOG IN"}
          </h1>

          {isSignUp && (
            <div className="flex items-center gap-2">
              <InputField
                value={payload.firstname}
                setValue={(value) => handleChange("firstname", value)}
                nameKey="firstname"
                placeholder="First Name"
                invalidFields={invalidFields}
                setInvalidFields={setInvalidFields}
              />
              <InputField
                value={payload.lastname}
                setValue={(value) => handleChange("lastname", value)}
                nameKey="lastname"
                placeholder="Last Name"
                invalidFields={invalidFields}
                setInvalidFields={setInvalidFields}
              />
            </div>
          )}

          <InputField
            value={payload.email}
            setValue={(value) => handleChange("email", value)}
            nameKey="email"
            placeholder="Email"
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
            fullWidth
          />

          {isSignUp && (
            <InputField
              value={payload.mobile}
              setValue={(value) => handleChange("mobile", value)}
              nameKey="mobile"
              placeholder="Phone Number"
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
              fullWidth
            />
          )}

          <div className="w-full relative">
            <InputField
              type={passwordVisible ? "text" : "password"}
              value={payload.password}
              setValue={(value) => handleChange("password", value)}
              nameKey="password"
              placeholder="Password"
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
              fullWidth
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 text-main" // Adjust color as needed
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? <IoEye size={24} /> : <IoEyeOff size={24} />}
            </button>
          </div>

          <Button
            name={isSignUp ? "Sign Up" : "Login"}
            handleOnClick={handleSubmit}
            fw
          />
          <GoogleOAuthProvider clientId={process.env.REACT_APP_GG_CLIENT_ID}>
          <div className="w-full text-main bg-[#daecd8] rounded-lg py-1 justify-center flex items-center gap-3 mt-2">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginError}
              width={400}
              text="continue_with"
              locale="en"
              type="icon"
              shape="circle"
              logo_alignment="left"
              size="medium"
            /> Continue With Google
           </div> 
          </GoogleOAuthProvider>




          <div className="w-full text-sm flex items-center justify-between mt-4">
            {!isSignUp ? (
              <>
                <span
                  onClick={() => setIsForgotPassword(true)}
                  className="text-[#45624E] hover:text-[#45624E] hover:underline cursor-pointer"
                >
                  Forgot your password?
                </span>
                <span
                  className="text-[#45624E] hover:text-[#45624E] hover:underline cursor-pointer"
                  onClick={() => setIsSignUp(true)}
                >
                  Create Account
                </span>
              </>
            ) : (
              <span
                className="text-[#45624E] hover:text-[#45624E] hover:underline cursor-pointer"
                onClick={() => setIsSignUp(false)}
              >
                Go to Log In
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="w-[680px] top-[3em] mb-[6em] flex flex-col relative bg-white p-4 rounded-[35px] shadow-2xl left-6 animate-slideInUp">
        <div className=" flex relative">
          <img
            src={star}
            alt="star"
            className="object-contain opacity-55 h-[200px] w-[200px] absolute top-[-1em] right-[-20px] animate-spin-slow"
          />

          <div className="uppercase flex items-center justify-center gap-4 ml-[20px] animate-slideInLeft">
            <span className="art-word-shadow text-left">
              {isSignUp ? "sign up" : "log in"}
            </span>
            <span className="gradient-text relative flex items-center">
              now
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-end relative">
          <img
            src={salebag}
            alt="salebag"
            className="animate-rotateIn object-contain h-[400px] w-[350px] mb-[-20em]  rotate-[-13deg]"
          />

          <img
            src={balloon}
            alt="balloon"
            className="animate-rotateIn object-contain h-[250px] w-[230px] absolute left-[-4.75em] top-46 mb-[5.5em] rotate-[-8deg]"
          />

          <img
            src={shadow}
            alt="shadow"
            className="animate-rotateIn object-contain h-[200px] w-[295px] absolute -left-12 -bottom-16"
          />
          <img
            src={gift3}
            alt="gift3"
            className="animate-slideInLeft object-contain h-[280px] w-[250px] absolute -left-20 -bottom-2 rotate-[-20deg]"
          />

          <img
            src={gift4}
            alt="gift4"
            className="animate-slideInLeft object-contain h-[200px] w-[200px] absolute left-3 -bottom-6"
          />

          <img
            src={gc}
            alt="gc"
            className="animate-slideInRight object-contain h-[570px] w-[560px] mr-[-15em] mb-[-20px]"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
