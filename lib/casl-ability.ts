import { AbilityBuilder, Ability } from "@casl/ability";
import { Role } from "@prisma/client";

export type AppAbility = Ability<
  [string, "User" | "Book" | "Transaction" | "all"]
>;

// Define the Book type with ownerId
type Book = {
  ownerId: string;
  // other properties...
};
type Transaction = {
  ownerId: string;
};

export function defineAbilitiesFor(role: Role, user: { userId: string }) {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(Ability);

  switch (role) {
    case "ADMIN":
      can("manage", "all");
      break;
    case "OWNER":
      // Use 'ownerId' for Book and 'userId' for Transaction
      can("manage", "Book", { ownerId: user.userId } as Partial<Book>);
      can("read", "Transaction", { userId: user.userId } as Partial<Book>);
      break;
    case "USER":
      can("read", "Book");
      can("create", "Transaction", { userId: user.userId } as Partial<Book>);
      break;
  }

  return build();
}
