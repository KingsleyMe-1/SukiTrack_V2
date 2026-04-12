"use client";

import { useState, useMemo } from "react";
import { CustomerCard } from "./CustomerCard";
import { CustomerSearchBar } from "./CustomerSearchBar";
import { CustomerStatsSummary } from "./CustomerStatsSummary";
import type { Customer, CustomerCreditStatus } from "@/app/types/customers";

interface CustomerCatalogProps {
  customers: Customer[];
  collectionRate: number;
}

export function CustomerCatalog({ customers, collectionRate }: CustomerCatalogProps) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<CustomerCreditStatus | "all">("all");

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      const matchesFilter = activeFilter === "all" || c.creditStatus === activeFilter;
      const q = query.toLowerCase();
      const matchesQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.creditStatus.includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [customers, query, activeFilter]);

  return (
    <div className="space-y-6">
      <CustomerStatsSummary customers={customers} collectionRate={collectionRate} />
      <CustomerSearchBar
        query={query}
        onQueryChange={setQuery}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />
      {filtered.length > 0 ? (
        <section
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          aria-label="Customer list"
        >
          {filtered.map((customer) => (
            <CustomerCard key={customer.id} customer={customer} />
          ))}
        </section>
      ) : (
        <div className="py-16 flex flex-col items-center gap-3 text-muted-foreground">
          <span className="material-symbols-outlined text-4xl opacity-40">person_search</span>
          <p className="text-sm font-medium">No customers match your search.</p>
        </div>
      )}
    </div>
  );
}
