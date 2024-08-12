import AuthFormSignIn from "@/components/auth-form-signin";
import AuthFormSignup from "@/components/auth-form-signup";

interface PageProps {
  searchParams: {
    mode: "login" | "sign-up";
  };
}

export default function Page({ searchParams }: PageProps) {
  const formMode = searchParams.mode || "login";

  if (formMode === "login") {
    return (
      <AuthFormSignIn mode={formMode} role="ADMIN" title="Login as Admin" />
    );
  } else {
    return (
      <AuthFormSignup mode={formMode} role="ADMIN" title="Signup as Admin" />
    );
  }
}
