import AuthForm from "@/components/auth-form";

interface PageProps {
  searchParams: {
    mode: "login" | "sign-up";
  };
}

export default function Page({ searchParams }: PageProps) {
  const formMode = searchParams.mode || "login";
  return <AuthForm mode={formMode} role="user" title={formMode === "login" ? "Login into Book Rent" : "Signup into Book Rent"} />;
}
