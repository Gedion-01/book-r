import AuthForm from "@/components/auth-form";

interface PageProps {
  searchParams: {
    mode: "login" | "sign-up";
  };
}

export default function Page({ searchParams }: PageProps) {
  const formMode = searchParams.mode || "login";
  return <AuthForm mode={formMode} role="ADMIN" title={formMode === "login" ? "Login as Admin" : "Signup as Admin"} />;
}
