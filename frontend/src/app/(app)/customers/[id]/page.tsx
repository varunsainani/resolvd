import { CustomerDetail } from "@/components/customers";

// Dynamic params are Promises in Next 16; await them in this server entry.
export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CustomerDetail id={id} />;
}
