import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import googleIcon from "@/assets/svg/google.svg";


export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
    const handleSignIn = () => {
        window.location.href = "http://localhost:5000/auth/google";
      };
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input id="password" type="password" required />
        </div>
        <Button type="submit" className="w-full bg-gray-900 hover:bg-black text-white">
          Login
        </Button>
        <div className="relative text-center text-sm">
  <span className="relative z-20 bg-background px-2 text-muted-foreground before:absolute before:inset-x-0 before:top-1/2 before:-translate-y-1/2 before:h-[1px] before:bg-border before:z-10">
    Or continue with
  </span>
</div>
<Button variant="outline" className="w-full flex items-center gap-2 cursor-pointer" onClick={handleSignIn}>
      <img src={googleIcon} alt="Google logo" className="w-5 h-5" />
      Login or Signup with Google
    </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="#" className="underline underline-offset-4">
          Sign up
        </a>
      </div>
    </form>
  )
}
