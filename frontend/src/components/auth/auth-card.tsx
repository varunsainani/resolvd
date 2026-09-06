import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui";

// Centered card frame shared by the login and signup pages.
export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="items-center text-center">
        <CardTitle className="text-xl">{title}</CardTitle>
        {subtitle && <CardDescription>{subtitle}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
      {footer && (
        <CardFooter className="justify-center pt-0 text-sm text-muted-foreground">{footer}</CardFooter>
      )}
    </Card>
  );
}
