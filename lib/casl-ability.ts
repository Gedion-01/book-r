import { AbilityBuilder, Ability } from "@casl/ability";
import { Role } from "@prisma/client";

export type AppAbility = Ability<
  [string, "User" | "Book" | "Transaction" | "all"]
>;

// Define the Book type with ownerId
type Book = {
  id: string;
  title: string;
  author: string;
  quantity: number;
  status: string;
  ownerId: string;
  rentPrice: number;
  bookImageUrl: string;
  isApproved: boolean;
  createdAt: Date;
  categoryId: string | null;
  updatedAt: Date;
};
type Transaction = {
  ownerId: string;
};

export function defineAbilitiesFor(role: Role, user: { userId: string }) {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(Ability);

  switch (role) {
    case "ADMIN":
      can("manage", "all");
      can("approve", "Book")
      break;
    case "OWNER":
      // Use 'ownerId' for Book and 'userId' for Transaction
      can("update", "Book", { ownerId: user.userId } as Partial<Book>);
      can("manage", "Book", { ownerId: user.userId } as Partial<Book>);
      can("delete", "Book", { ownerId: user.userId } as Partial<Book>);
      can("read", "Transaction", { ownerId: user.userId } as Partial<Book>);
      break;
    case "USER":
      can("read", "Book");
      can("create", "Transaction", { userId: user.userId } as Partial<Book>);
      break;
  }

  return build();
}
