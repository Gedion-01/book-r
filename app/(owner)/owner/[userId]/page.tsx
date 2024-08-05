import { verifyAuth } from "@/lib/auth";
import { defineAbilitiesFor } from "@/lib/casl-ability";
import { redirect } from "next/navigation";
import Sidebar from "./_components/sidebar";
import Navbar from "./_components/navbar";

export default async function OwnerPage({
  params,
}: {
  params: { userId: string };
}) {
  const userPayload = await verifyAuth(params.userId);

  if (!userPayload) {
    return redirect("/owner");
  }

  const ability = defineAbilitiesFor(userPayload.role, {
    userId: userPayload.id,
  });

  if (!ability.can("manage", "Book")) {
    return redirect("/owner");
  }
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* <!-- Stats Card --> */}
        <div className="bg-white p-4 rounded shadow-md">
          <h3 className="text-xl font-semibold">This Month Statistics</h3>
          <p className="text-2xl font-bold mt-4">
            ETB 9460.00 <span className="text-red-600 text-sm">↓1.5%</span>
          </p>
          <p className="text-gray-500 mt-1">Compared to ETB8940 last month</p>
        </div>

        {/* <!-- Live Book Status --> */}
        <div className="col-span-2 bg-white p-4 rounded shadow-md">
          <h3 className="text-xl font-semibold">Live Book Status</h3>
          <table className="w-full mt-4">
            <thead>
              <tr>
                <th className="text-left p-2">No.</th>
                <th className="text-left p-2">Book No.</th>
                <th className="text-left p-2">Book Name</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Price</th>
                <th className="text-left p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2">01</td>
                <td className="p-2">6465</td>
                <td className="p-2">Derto Gada</td>
                <td className="p-2 text-red-600">Rented</td>
                <td className="p-2">40 Birr</td>
                <td className="p-2">
                  <button className="text-blue-600 hover:text-blue-800">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-800 ml-2">
                    Delete
                  </button>
                </td>
              </tr>
              {/* <!-- Add more rows as needed --> */}
            </tbody>
          </table>
        </div>

        {/* <!-- Additional Content --> */}
        <div className="col-span-1 bg-white p-4 rounded shadow-md">
          <h3 className="text-xl font-semibold">Available Books</h3>
          <div className="flex justify-center items-center h-32">
            {/* <!-- Placeholder for chart --> */}
            <div className="text-center">[Chart]</div>
          </div>
        </div>

        <div className="col-span-2 bg-white p-4 rounded shadow-md">
          <h3 className="text-xl font-semibold">Earning Summary</h3>
          <div className="flex justify-center items-center h-32">
            {/* <!-- Placeholder for graph --> */}
            <div className="text-center">[Graph]</div>
          </div>
        </div>
      </div>
    </>
  );
}
