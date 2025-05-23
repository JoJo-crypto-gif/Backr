"use client"

import { Menu, Mountain } from "lucide-react"
import { Link } from "react-router-dom"
import  { useEffect, useState } from 'react';
import { toast } from "sonner"


import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  interface User {
    name: string;
  }
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Corrected loading state
  
  useEffect(() => {
    // Fetch the current logged-in user
    fetch("http://localhost:5000/current_user", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user); // Set the user state with the fetched data
          toast("Signed in successfully 😁")
        } else {
          setUser(null); // Ensure user is null if no user is logged in
        }
        setLoading(false); // Set loading to false after session check is complete
      })
      .catch((err) => {
        console.error("Error fetching current user:", err);
        setLoading(false); // Make sure loading stops even if there's an error
      });
  }, []);

    const handleLogout = async () => {
      try {
        // Send request to logout on the backend
        await fetch("http://localhost:5000/logout", {
          method: "GET",
          credentials: "include",
        });
    
        // Reset user state in frontend (if you're managing it with useState)
        setUser(null); // Clear user state in frontend
    
        // Re-fetch current user state after logout
        fetch("http://localhost:5000/current_user", {
          method: "GET",
          credentials: "include", // Ensure cookies are sent with the request
        })
          .then((response) => response.json())
          .then((data) => setUser(data.user)); // Set the user state (will be null after logout)
        
        // Optionally, you can redirect the user to the login page
        toast("Signed out successfully 👋")
        
      } catch (error) {
        console.error("Error during logout:", error);
      }
    };
  if (loading) {
    return <div>Loading...</div>;
  }
    

  return (
    <header className="flex h-16 w-full max-w-full items-center justify-between border-0 px-4 md:px-6 bg-white/50 backdrop-blur-sm sticky top-0 z-50">
      {/* Left: Logo */}
      <div className="flex items-center">
        <Link to="/" className="flex items-center gap-2">
          <Mountain className="h-6 w-6" />
          <span className="hidden font-semibold sm:inline-block">BackR</span>
        </Link>
      </div>

      {/* Center: Navigation - Desktop */}
      <div className="hidden lg:flex lg:justify-center lg:flex-1">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Campaigns</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-full gap-3 md:w-[500px] md:grid-cols-2 bg-white/80 backdrop-blur-sm ">
                  <NavigationMenuLink asChild>
                    <Link to="/campaigns" className="flex flex-col gap-1 rounded-md p-3 hover:bg-accent w-full">
                      <div className="font-medium">Browse Campaings</div>
                      <div className="text-sm text-muted-foreground">Description for product one goes here</div>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link to="#" className="flex flex-col gap-1 rounded-md p-3 hover:bg-accent">
                      <div className="font-medium">Product Two</div>
                      <div className="text-sm text-muted-foreground">Description for product two goes here</div>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link to="#" className="flex flex-col gap-1 rounded-md p-3 hover:bg-accent">
                      <div className="font-medium">Product Three</div>
                      <div className="text-sm text-muted-foreground">Description for product three goes here</div>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link to="#" className="flex flex-col gap-1 rounded-md p-3 hover:bg-accent">
                      <div className="font-medium">Product Four</div>
                      <div className="text-sm text-muted-foreground">Description for product four goes here</div>
                    </Link>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Services</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[400px] gap-3 p-4 bg-white/80 backdrop-blur-sm">
                  <NavigationMenuLink asChild>
                    <Link to="#" className="flex flex-col gap-1 rounded-md p-3 hover:bg-accent">
                      <div className="font-medium">Consulting</div>
                      <div className="text-sm text-muted-foreground">Expert advice for your business needs</div>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link to="#" className="flex flex-col gap-1 rounded-md p-3 hover:bg-accent">
                      <div className="font-medium">Implementation</div>
                      <div className="text-sm text-muted-foreground">Full-service implementation of solutions</div>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link to="#" className="flex flex-col gap-1 rounded-md p-3 hover:bg-accent">
                      <div className="font-medium">Support</div>
                      <div className="text-sm text-muted-foreground">24/7 support for all your needs</div>
                    </Link>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="#">
                <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                  About
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="#">
                <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                  Contact
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Right: Auth Buttons */}
<div className="flex items-center gap-2">
      {/* Right: Auth Buttons or User Dropdown */}
      <div className="flex items-center gap-2">
        {user ? (
          <NavigationMenu>
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                {user.name}
              </NavigationMenuTrigger>

              <NavigationMenuContent>
                <div className="grid w-[auto] gap-3 p-4 bg-white/80 backdrop-blur-sm">
                  <NavigationMenuLink asChild>
                    <Link
                      to="/dashboard"
                      className="flex flex-col gap-1 rounded-md p-3 hover:bg-accent"
                    >
                      <div className="font-medium">Dashboard</div>
                    </Link>
                  </NavigationMenuLink>

                  <NavigationMenuLink asChild>
                    <button
                      onClick={handleLogout}
                      className="flex flex-col gap-1 rounded-md p-3 hover:bg-accent cursor-pointer"
                    >
                      <div className="font-medium">Logout</div>
                    </button>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenu>
        ) : (
          <>
            <Link to="/login">
              <Button variant="outline" size="sm" className="bg-black text-white cursor-pointer">
                Sign In
              </Button>
            </Link>
            <Link to="/login">
              <Button size="sm" className="bg-white text-black border border-black cursor-pointer">
                Sign Up
              </Button>
            </Link>
          </>
        )}
      </div>

  {/* Mobile Menu */}
  <Sheet open={isOpen} onOpenChange={setIsOpen}>
    <SheetTrigger asChild>
      <Button variant="outline" size="icon" className="lg:hidden">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>
    </SheetTrigger>
    <SheetContent side="right">
      <nav className="flex flex-col gap-4">
        <Link to="#" className="text-lg font-medium" onClick={() => setIsOpen(false)}>
          Products
        </Link>
        <Link to="#" className="text-lg font-medium" onClick={() => setIsOpen(false)}>
          Services
        </Link>
        <Link to="#" className="text-lg font-medium" onClick={() => setIsOpen(false)}>
          About
        </Link>
        <Link to="#" className="text-lg font-medium" onClick={() => setIsOpen(false)}>
          Contact
        </Link>
        <div className="mt-4 flex flex-col gap-2">
          <Link to="/login">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Sign In
            </Button>
          </Link>
          <Link to="/login">
            <Button onClick={() => setIsOpen(false)}>Sign Up</Button>
          </Link>
        </div>
      </nav>
    </SheetContent>
  </Sheet>
</div>
    </header>
  )
}

