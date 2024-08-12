import { NextApiRequest } from "next";
import getUserId from "@/lib/auth";
import { defineAbilitiesFor } from "@/lib/casl-ability";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { role } = user;
    const ability = defineAbilitiesFor(role, { userId });

    if (!ability.can("read", "Book")) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    // console.log("searchParams", searchParams);

    const page = searchParams.get("page") || "0";
    const size = searchParams.get("size") || "10";
    const sort = searchParams.get("sort") || "title";
    const filter = searchParams.get("filter") || "";

    console.log("page", page, "size", size, "sort", sort, "filter", filter);

    const validSortFields = [
      "id",
      "email",
      "totalBooks",
      "location",
      "status",
      "isApproved",
    ];

    let orderBy = [];
    try {
      const sortArray = JSON.parse(sort);
      orderBy = sortArray
        .filter((sortItem: any) => validSortFields.includes(sortItem.id))
        .map((sortItem: any) => ({
          [sortItem.id]: sortItem.desc ? "desc" : "asc",
        }));
    } catch (error) {
      console.error("Error parsing sort parameter:", error);
      orderBy = [{ title: "asc" }];
    }

    console.log("orderBy", orderBy);

    const users = await prisma.user.findMany({
      where: {
        role: "OWNER",
        AND: [
          {
            OR: [
              { email: { contains: filter, mode: "insensitive" } },
              { location: { contains: filter, mode: "insensitive" } },
              {
                books: {
                  some: {
                    title: { contains: filter, mode: "insensitive" },
                  },
                },
              },
            ],
          },
        ],
      },
      orderBy,
      skip: Number(page) * Number(size),
      take: Number(size),
      include: {
        books: {
          select: {
            id: true,
          },
        },
      },
    });

    const owners = users.map((user) => ({
      id: user.id,
      email: user.email,
      totalBooks: user.books.length,
      location: user.location,
      phone: user.phone,
      status: user.status,
      isApproved: user.isApproved,
    }));

    console.log({ owners });

    return NextResponse.json({ owners }, { status: 200 });
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
