import Link from "next/link";

// 404 page.
export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="font-display text-5xl font-extrabold text-primary">404</p>
      <div>
        <h1 className="font-display text-xl font-bold text-foreground">Page not found</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          The page you are looking for does not exist.
        </p>
      </div>
      <Link
        href="/dashboard"
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
