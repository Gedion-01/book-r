import { verifyAuth } from "@/lib/auth";
import { defineAbilitiesFor } from "@/lib/casl-ability";
import { redirect } from "next/navigation";

export default async function OwnerPage({
  params,
}: {
  params: { userId: string };
}) {
  const userPayload = await verifyAuth(params.userId);
  if (!userPayload) {
    return redirect("/admin");
  }
  
  const ability = defineAbilitiesFor(userPayload.role, { userId: userPayload.id });

  if (!ability.can("manage", "all")) {
    return redirect("/admin");
  }
  return (
    <div>
      <h1>User ID: {params.userId}</h1>
      {/* Rest of your page content */}
    </div>
  );
}
