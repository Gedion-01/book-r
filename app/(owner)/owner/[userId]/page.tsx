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
    return redirect("/owner");
  }
  
  const ability = defineAbilitiesFor(userPayload.role, { userId: userPayload.id });

  if (!ability.can("manage", "Book")) {
    return redirect("/owner");
  }
  return (
    <div>
      <h1>User ID: {params.userId}</h1>
      {/* Rest of your page content */}
    </div>
  );
}
