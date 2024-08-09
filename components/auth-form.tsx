"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import Checkbox from "@mui/material/Checkbox";
import { z } from "zod";

import axios from "axios";
import toast from "react-hot-toast";
import { FormControlLabel, FormHelperText } from "@mui/material";
import { useRouter } from "next/navigation";
import AuthFormWrapper from "./auth-form-wrapper";

interface AuthFormProps {
  mode: "login" | "sign-up";
  role: "ADMIN" | "OWNER" | "USER";
  title: string;
}

export default function AuthForm({ mode, role, title }: AuthFormProps) {
  const pathname = usePathname();
  console.log(pathname, role, mode);

  if (mode === "sign-up") {
    const signUpformSchema = z
      .object({
        email: z.string().email("Invalid email").min(1, "Email is required"),
        password: z
          .string()
          .min(6, "Password must be at least 6 characters long"),
        confirmPassword: z
          .string()
          .min(6, "Password must be at least 6 characters long"),
        location: z.string().min(1, "Location is required"),
        phoneNumber: z.string().min(1, "Phone number is required"),
        terms_and_condition_accepted: z
          .boolean()
          .refine((value) => value === true, {
            message: "You must accept the terms and conditions",
          }),
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });

    const {
      register,
      handleSubmit,
      watch,
      reset,
      formState: { errors, touchedFields, isSubmitting },
    } = useForm<z.infer<typeof signUpformSchema>>({
      resolver: zodResolver(signUpformSchema),
      defaultValues: {
        email: "",
        password: "",
        confirmPassword: "",
        location: "",
        phoneNumber: "",
        terms_and_condition_accepted: false,
      },
    });

    useEffect(() => {
      reset();
    }, [mode]);

    const onSubmit = async (data: z.infer<typeof signUpformSchema>) => {
      try {
        const formData = { ...data, role };
        const res = await axios.post("/api/signup", formData);
        toast.success("Account created sucessfully");
        reset();
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 400) {
          toast.error("Invalid data is provided");
        } else {
          toast.error("Something went wrong");
        }
      }
    };
    return (
      <AuthFormWrapper>
        <div className="px-4 mx-auto lg:w-[530px]">
          <div className="flex flex-row gap-3 mb-6">
            <div>
              <svg
                width="60"
                height="33"
                viewBox="0 0 60 33"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 7.8114H4.61372L3.16345 3.80831H7.40401L6.23361 0.0172577C11.4834 0.364983 16.1565 2.23931 20.6515 4.65643C16.7502 3.61325 12.9167 2.34956 8.72706 1.82373C9.08327 2.94324 9.42251 3.88464 9.67695 4.85149C11.2488 10.9409 12.798 17.0388 14.3246 23.1452C14.5536 23.9934 14.4433 25.1807 14.9776 25.7405C15.5119 26.3002 16.6145 26.1052 17.4711 26.2239C20.9059 26.7073 24.256 27.4282 27.3092 29.2177C27.9042 29.582 28.4712 29.9902 29.0054 30.439C22.2364 29.9493 15.4377 30.8143 9.00694 32.9833C7.06476 24.2902 4.46954 15.8006 0 7.8114ZM5.59753 5.072C5.90285 5.80985 6.1488 6.39505 6.38627 6.98873C8.89541 13.6369 10.9359 20.4526 12.4927 27.3858C12.7047 28.2339 13.0524 28.412 13.8666 28.3866C16.0632 28.3187 18.2598 28.3102 20.4564 28.3866C21.754 28.3866 23.0517 28.6495 24.3493 28.7937C24.113 28.5674 23.82 28.4091 23.5012 28.3357C20.6704 27.6392 17.7541 27.3536 14.8419 27.4876C13.9938 27.4876 13.697 27.2416 13.4934 26.4529C11.6446 19.4644 9.77872 12.5015 7.93832 5.54694C7.84503 5.19922 7.70933 4.86845 7.59059 4.50377L5.59753 5.072ZM11.4071 30.2694L5.0293 8.47293L2.8751 9.15989C6.03229 16.2877 8.51399 23.6958 10.2876 31.2871L15.4356 29.9301L15.3847 29.6842L11.4071 30.2694Z"
                  fill="#00ABFF"
                />
                <path
                  d="M50.9206 1.60293L38.8265 4.66461C43.4996 2.25598 48.1557 0.38165 53.4395 0L52.2606 3.79954H56.5011L55.0169 7.77718H59.6307C55.2544 15.8003 52.5829 24.2475 50.6577 33C44.1902 30.8021 37.3389 29.9619 30.532 30.532C32.0639 29.1489 33.9093 28.1592 35.909 27.6484C38.4533 26.9869 41.1249 26.5459 43.7456 26.0964C44.5173 25.9607 44.8481 25.7656 45.0177 24.909C46.3837 17.278 48.3084 9.75762 50.7764 2.40864C50.8188 2.28142 50.8273 2.14572 50.9206 1.60293ZM52.1079 4.48651C51.9807 4.81727 51.8535 5.08867 51.7687 5.33462C51.2429 7.22591 50.6916 9.10871 50.1997 11.0085C48.871 16.148 47.5536 21.2904 46.2475 26.4356C46.0609 27.1565 45.7217 27.4025 44.9244 27.4279C42.5921 27.5042 40.2598 27.6739 37.936 27.9113C36.9598 28.072 35.9962 28.3015 35.0524 28.5983L46.9938 28.0555C48.8936 20.4225 50.8866 12.6029 54.0586 5.0293L52.1079 4.48651ZM49.4109 31.2953C51.1646 23.695 53.641 16.2799 56.8065 9.15112L54.6607 8.48111C52.5065 15.8173 50.4202 23.0517 48.2829 30.2436L44.424 29.6924V29.9468L49.4109 31.2953Z"
                  fill="#00ABFF"
                />
                <path
                  d="M5.59741 5.0716L7.59047 4.4864C7.70921 4.85109 7.84491 5.18185 7.9382 5.52958C9.7786 12.4841 11.6275 19.4471 13.434 26.4186C13.6375 27.2073 13.9004 27.4872 14.7825 27.4532C17.6946 27.3193 20.6109 27.6049 23.4417 28.3014C23.7605 28.3748 24.0535 28.533 24.2898 28.7593C22.9922 28.6152 21.6946 28.3862 20.3969 28.3522C18.2003 28.2759 16.0037 28.2844 13.8071 28.3522C12.959 28.3522 12.6452 28.2165 12.4332 27.3515C10.8923 20.4456 8.87175 13.6555 6.38616 7.03074C6.14868 6.39465 5.90273 5.80946 5.59741 5.0716Z"
                  fill="white"
                />
                <path
                  d="M11.407 30.2692L15.3846 29.667L15.4355 29.9129L10.2875 31.2869C8.5139 23.6956 6.0322 16.2874 2.875 9.15967L5.0292 8.4727L11.407 30.2692Z"
                  fill="white"
                />
                <path
                  d="M52.1078 4.4864L54.0584 5.06312C50.8865 12.6368 48.8934 20.4563 46.9936 28.0893L35.0522 28.6321C35.996 28.3354 36.9596 28.1058 37.9358 27.9452C40.2596 27.7077 42.592 27.5381 44.9243 27.4617C45.7215 27.4617 46.0607 27.1903 46.2473 26.4694C47.5534 21.3242 48.8708 16.1819 50.1995 11.0423C50.6914 9.14253 51.2427 7.25973 51.7685 5.36844C51.8533 5.10553 51.9805 4.83413 52.1078 4.4864Z"
                  fill="white"
                />
                <path
                  d="M49.411 31.2952L44.3901 29.9298V29.6753L48.249 30.2266C50.3524 23.0346 52.4896 15.8087 54.6268 8.46408L56.7726 9.13409C53.6177 16.2695 51.1526 23.6904 49.411 31.2952Z"
                  fill="white"
                />
              </svg>
            </div>
            <div className="mb-4">
              <h1 className="text-2xl">Book Rent</h1>
            </div>
          </div>
          <div className="border-b border-slate-300 mb-6">
            <h1 className="text-2xl py-2">{title}</h1>
          </div>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              width: { width: "100%" },
            }}
            noValidate
            autoComplete="off"
          >
            <div className="space-y-4">
              <TextField
                id="outlined-multiline-flexible"
                label="Email address"
                className="w-full"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              <TextField
                id="outlined-multiline-flexible"
                label="Password"
                type="password"
                className="w-full"
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
              <TextField
                id="outlined-multiline-flexible"
                label="Confirm password"
                type="password"
                className="w-full"
                {...register("confirmPassword")}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
              />
              <TextField
                id="outlined-multiline-flexible"
                label="Location"
                className="w-full"
                {...register("location")}
                error={!!errors.location}
                helperText={errors.location?.message}
              />
              <TextField
                id="outlined-multiline-flexible"
                label="Phone Number"
                className="w-full"
                {...register("phoneNumber")}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message}
              />

              <div className="">
                <FormControlLabel
                  control={
                    <Checkbox {...register("terms_and_condition_accepted")} />
                  }
                  label="I accept the terms and conditions"
                />
                {errors.terms_and_condition_accepted && (
                  <FormHelperText error>
                    <span className="px-4">
                      {errors.terms_and_condition_accepted.message}
                    </span>
                  </FormHelperText>
                )}
              </div>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                  backgroundColor: "#00ABFF",
                  "&:hover": {
                    backgroundColor: "#00ABFF",
                  },
                  width: "100%",
                  height: "42px",
                }}
                disabled={isSubmitting}
              >
                Sign up
              </Button>
              <div className="flex flex-row items-center justify-center w-full text-md pt-2">
                <p>
                  Already have an account?{" "}
                  <Link
                    className="text-[#00ABFF]"
                    href={`${pathname}?mode=login`}
                  >
                    Sign in
                  </Link>{" "}
                </p>
              </div>
            </div>
          </Box>
        </div>
      </AuthFormWrapper>
    );
  }

  if (mode === "login") {
    const router = useRouter();
    const signInformSchema = z.object({
      email: z.string().email("Invalid email").min(1, "Email is required"),
      password: z
        .string()
        .min(6, "Password must be at least 6 characters long"),
      remember_me: z.boolean(),
    });

    const {
      register,
      handleSubmit,
      watch,
      reset,
      formState: { errors, touchedFields, isSubmitting },
    } = useForm<z.infer<typeof signInformSchema>>({
      resolver: zodResolver(signInformSchema),
      defaultValues: {
        email: "",
        password: "",
        remember_me: false,
      },
    });

    useEffect(() => {
      reset();
    }, [mode]);

    const onSubmit = async (data: z.infer<typeof signInformSchema>) => {
      try {
        const formData = { ...data, role };
        const res = await axios.post("/api/login", formData);
        console.log(res.data);

        toast.success("Signed in sucessfully");

        if (role === "ADMIN") {
          router.push(`/admin/${res.data.id}`);
        }
        if (role === "OWNER") {
          router.push(`/owner/${res.data.id}`);
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 400) {
          toast.error("Invalid email or password");
        } else {
          toast.error("Something went wrong");
        }
      }
    };

    return (
      <AuthFormWrapper>
        {" "}
        <div className="px-4 mx-auto lg:w-[530px]">
          <div className="flex flex-row gap-3 mb-6">
            <div>
              <svg
                width="60"
                height="33"
                viewBox="0 0 60 33"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 7.8114H4.61372L3.16345 3.80831H7.40401L6.23361 0.0172577C11.4834 0.364983 16.1565 2.23931 20.6515 4.65643C16.7502 3.61325 12.9167 2.34956 8.72706 1.82373C9.08327 2.94324 9.42251 3.88464 9.67695 4.85149C11.2488 10.9409 12.798 17.0388 14.3246 23.1452C14.5536 23.9934 14.4433 25.1807 14.9776 25.7405C15.5119 26.3002 16.6145 26.1052 17.4711 26.2239C20.9059 26.7073 24.256 27.4282 27.3092 29.2177C27.9042 29.582 28.4712 29.9902 29.0054 30.439C22.2364 29.9493 15.4377 30.8143 9.00694 32.9833C7.06476 24.2902 4.46954 15.8006 0 7.8114ZM5.59753 5.072C5.90285 5.80985 6.1488 6.39505 6.38627 6.98873C8.89541 13.6369 10.9359 20.4526 12.4927 27.3858C12.7047 28.2339 13.0524 28.412 13.8666 28.3866C16.0632 28.3187 18.2598 28.3102 20.4564 28.3866C21.754 28.3866 23.0517 28.6495 24.3493 28.7937C24.113 28.5674 23.82 28.4091 23.5012 28.3357C20.6704 27.6392 17.7541 27.3536 14.8419 27.4876C13.9938 27.4876 13.697 27.2416 13.4934 26.4529C11.6446 19.4644 9.77872 12.5015 7.93832 5.54694C7.84503 5.19922 7.70933 4.86845 7.59059 4.50377L5.59753 5.072ZM11.4071 30.2694L5.0293 8.47293L2.8751 9.15989C6.03229 16.2877 8.51399 23.6958 10.2876 31.2871L15.4356 29.9301L15.3847 29.6842L11.4071 30.2694Z"
                  fill="#00ABFF"
                />
                <path
                  d="M50.9206 1.60293L38.8265 4.66461C43.4996 2.25598 48.1557 0.38165 53.4395 0L52.2606 3.79954H56.5011L55.0169 7.77718H59.6307C55.2544 15.8003 52.5829 24.2475 50.6577 33C44.1902 30.8021 37.3389 29.9619 30.532 30.532C32.0639 29.1489 33.9093 28.1592 35.909 27.6484C38.4533 26.9869 41.1249 26.5459 43.7456 26.0964C44.5173 25.9607 44.8481 25.7656 45.0177 24.909C46.3837 17.278 48.3084 9.75762 50.7764 2.40864C50.8188 2.28142 50.8273 2.14572 50.9206 1.60293ZM52.1079 4.48651C51.9807 4.81727 51.8535 5.08867 51.7687 5.33462C51.2429 7.22591 50.6916 9.10871 50.1997 11.0085C48.871 16.148 47.5536 21.2904 46.2475 26.4356C46.0609 27.1565 45.7217 27.4025 44.9244 27.4279C42.5921 27.5042 40.2598 27.6739 37.936 27.9113C36.9598 28.072 35.9962 28.3015 35.0524 28.5983L46.9938 28.0555C48.8936 20.4225 50.8866 12.6029 54.0586 5.0293L52.1079 4.48651ZM49.4109 31.2953C51.1646 23.695 53.641 16.2799 56.8065 9.15112L54.6607 8.48111C52.5065 15.8173 50.4202 23.0517 48.2829 30.2436L44.424 29.6924V29.9468L49.4109 31.2953Z"
                  fill="#00ABFF"
                />
                <path
                  d="M5.59741 5.0716L7.59047 4.4864C7.70921 4.85109 7.84491 5.18185 7.9382 5.52958C9.7786 12.4841 11.6275 19.4471 13.434 26.4186C13.6375 27.2073 13.9004 27.4872 14.7825 27.4532C17.6946 27.3193 20.6109 27.6049 23.4417 28.3014C23.7605 28.3748 24.0535 28.533 24.2898 28.7593C22.9922 28.6152 21.6946 28.3862 20.3969 28.3522C18.2003 28.2759 16.0037 28.2844 13.8071 28.3522C12.959 28.3522 12.6452 28.2165 12.4332 27.3515C10.8923 20.4456 8.87175 13.6555 6.38616 7.03074C6.14868 6.39465 5.90273 5.80946 5.59741 5.0716Z"
                  fill="white"
                />
                <path
                  d="M11.407 30.2692L15.3846 29.667L15.4355 29.9129L10.2875 31.2869C8.5139 23.6956 6.0322 16.2874 2.875 9.15967L5.0292 8.4727L11.407 30.2692Z"
                  fill="white"
                />
                <path
                  d="M52.1078 4.4864L54.0584 5.06312C50.8865 12.6368 48.8934 20.4563 46.9936 28.0893L35.0522 28.6321C35.996 28.3354 36.9596 28.1058 37.9358 27.9452C40.2596 27.7077 42.592 27.5381 44.9243 27.4617C45.7215 27.4617 46.0607 27.1903 46.2473 26.4694C47.5534 21.3242 48.8708 16.1819 50.1995 11.0423C50.6914 9.14253 51.2427 7.25973 51.7685 5.36844C51.8533 5.10553 51.9805 4.83413 52.1078 4.4864Z"
                  fill="white"
                />
                <path
                  d="M49.411 31.2952L44.3901 29.9298V29.6753L48.249 30.2266C50.3524 23.0346 52.4896 15.8087 54.6268 8.46408L56.7726 9.13409C53.6177 16.2695 51.1526 23.6904 49.411 31.2952Z"
                  fill="white"
                />
              </svg>
            </div>
            <div className="mb-4">
              <h1 className="text-2xl">Book Rent</h1>
            </div>
          </div>
          <div className="border-b border-slate-300 mb-6">
            <h1 className="text-2xl py-2">{title}</h1>
          </div>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              width: { width: "100%" },
            }}
            noValidate
            autoComplete="off"
          >
            <div className="space-y-4">
              <TextField
                id="outlined-multiline-flexible"
                label="Email address"
                className="w-full"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              <TextField
                id="outlined-multiline-flexible"
                label="Password"
                type="password"
                className="w-full"
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
              />

              <div className="flex flex-row gap-2 items-center">
                <Checkbox {...register("remember_me")} sx={{}} />
                <h1>Remember me</h1>
              </div>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                  backgroundColor: "#00ABFF",
                  "&:hover": {
                    backgroundColor: "#00ABFF",
                  },
                  width: "100%",
                  height: "42px",
                }}
                disabled={isSubmitting}
              >
                Login
              </Button>
              <div className="flex flex-row items-center justify-center w-full text-md pt-2">
                <p>
                  Don't have an account?{" "}
                  <Link
                    className="text-[#00ABFF]"
                    href={`${pathname}?mode=sign-up`}
                  >
                    Sign up
                  </Link>{" "}
                </p>
              </div>
            </div>
          </Box>
        </div>
      </AuthFormWrapper>
    );
  }
}
