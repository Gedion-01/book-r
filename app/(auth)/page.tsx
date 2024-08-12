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
      <AuthFormSignIn
        mode={formMode}
        role="USER"
        title="Login into Book Rent"
      />
    );
  } else {
    return (
      <AuthFormSignup
        mode={formMode}
        role="USER"
        title="Signup into Book Rent"
      />
    );
  }
}
