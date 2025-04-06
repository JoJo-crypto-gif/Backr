import React from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu"; // Adjust the import path accordingly
import { Link } from "react-router-dom";

const Navbar = () => {
  const user = { name: "John Doe", isAuthenticated: true };

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-white text-2xl font-semibold">
          <Link to="/">Crowdfunding</Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link to="/campaigns" className="text-white hover:text-gray-300">
            Campaigns
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" className="text-white hover:text-gray-300">
                Categories
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link to="/category/technology" className="block px-4 py-2 text-sm text-gray-700">
                  Technology
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/category/health" className="block px-4 py-2 text-sm text-gray-700">
                  Health
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/category/environment" className="block px-4 py-2 text-sm text-gray-700">
                  Environment
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {user.isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" className="text-white hover:text-gray-300">
                  {user.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700">
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/logout" className="block px-4 py-2 text-sm text-gray-700">
                    Logout
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/signin">
              <Button variant="outline" className="text-white hover:text-gray-300">
                Sign In / Sign Up
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
