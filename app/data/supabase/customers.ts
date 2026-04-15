import { eq, and } from "drizzle-orm";
import { db } from "@/app/db";
import { customers } from "@/app/db/schema";
import type { Customer } from "@/app/types/customers";

// ── Types ──────────────────────────────────────────────────────────────────

type NewCustomer = Omit<Customer, "avatarUrl"> & { ownerId: string };
type CustomerUpdate = Partial<Omit<Customer, "id" | "ownerId">>;

// ── Queries ────────────────────────────────────────────────────────────────

/** Fetch all customers belonging to this store owner. */
export async function getCustomers(ownerId: string): Promise<Customer[]> {
  const rows = await db.select().from(customers).where(eq(customers.ownerId, ownerId));
  return rows as unknown as Customer[];
}

/** Fetch a single customer by their ID, verifying ownership. */
export async function getCustomerById(id: string, ownerId: string): Promise<Customer | null> {
  const [customer] = await db
    .select()
    .from(customers)
    .where(and(eq(customers.id, id), eq(customers.ownerId, ownerId)));
  return (customer as unknown as Customer) ?? null;
}

// ── Mutations ──────────────────────────────────────────────────────────────

/** Register a new customer (suki) account. */
export async function createCustomer(data: NewCustomer): Promise<Customer> {
  const [created] = await db.insert(customers).values(data).returning();
  return created as unknown as Customer;
}

/** Update a customer's details or credit status. */
export async function updateCustomer(
  id: string,
  ownerId: string,
  data: CustomerUpdate
): Promise<Customer> {
  const [updated] = await db
    .update(customers)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .set(data as any)
    .where(and(eq(customers.id, id), eq(customers.ownerId, ownerId)))
    .returning();
  return updated as unknown as Customer;
}

/** Remove a customer account permanently. */
export async function deleteCustomer(id: string, ownerId: string): Promise<void> {
  await db.delete(customers).where(and(eq(customers.id, id), eq(customers.ownerId, ownerId)));
}
