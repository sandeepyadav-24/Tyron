"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "@/lib/supabase";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaTshirt,
  FaCalendarAlt,
  FaRobot,
  FaChartLine,
  FaLeaf,
  FaSignOutAlt,
} from "react-icons/fa";

interface SidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive: boolean;
  onClick?: () => void;
}

const SidebarLink = ({
  icon,
  label,
  href,
  isActive,
  onClick,
}: SidebarLinkProps) => (
  <Link href={href} onClick={onClick}>
    <motion.div
      whileHover={{ x: 5 }}
      className={`flex items-center space-x-3 px-6 py-3 rounded-lg 
                 ${
                   isActive
                     ? "bg-green-500 text-white"
                     : "text-gray-600 hover:bg-gray-50"
                 }`}
    >
      {icon}
      <span>{label}</span>
    </motion.div>
  </Link>
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      router.push("/");
    }
  };

  const links = [
    { href: "/dashboard", icon: <FaHome />, label: "Dashboard" },
    { href: "/dashboard/closet", icon: <FaTshirt />, label: "Smart Closet" },
    {
      href: "/dashboard/planner",
      icon: <FaCalendarAlt />,
      label: "Outfit Planner",
    },
    { href: "/dashboard/stylist", icon: <FaRobot />, label: "AI Stylist" },
    { href: "/dashboard/analytics", icon: <FaChartLine />, label: "Analytics" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 bg-[radial-gradient(#E1E8FF_1px,transparent_1px)] 
                  [background-size:20px_20px] opacity-30"
      />

      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 bg-white shadow-sm">
          <div className="fixed w-64 h-screen flex flex-col">
            {/* Sidebar Header */}
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-8">
                <FaLeaf className="text-green-500 text-2xl" />
                <span className="text-xl font-bold">tryon</span>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-2">
                {links.map((link) => (
                  <SidebarLink
                    key={link.href}
                    {...link}
                    isActive={pathname === link.href}
                  />
                ))}
              </nav>
            </div>

            {/* User Profile & Logout - Bottom of Sidebar */}
            <div className="mt-auto p-6 border-t">
              <div className="flex flex-col space-y-4">
                <div className="text-sm text-gray-600 truncate">
                  {user?.email}
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors"
                >
                  <FaSignOutAlt />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Header and Sidebar */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <FaLeaf className="text-green-500 text-xl" />
              <span className="text-lg font-bold">tryon</span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              {isSidebarOpen ? (
                <FaTimes className="w-6 h-6 text-gray-600" />
              ) : (
                <FaBars className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="md:hidden fixed inset-0 bg-black/50 z-40"
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                className="fixed top-0 left-0 bottom-0 w-64 bg-white z-50 md:hidden"
              >
                <div className="flex flex-col h-full">
                  <div className="p-6">
                    <nav className="space-y-2">
                      {links.map((link) => (
                        <SidebarLink
                          key={link.href}
                          {...link}
                          isActive={pathname === link.href}
                          onClick={() => setIsSidebarOpen(false)}
                        />
                      ))}
                    </nav>
                  </div>

                  {/* Mobile User Profile & Logout */}
                  <div className="mt-auto p-6 border-t">
                    <div className="flex flex-col space-y-4">
                      <div className="text-sm text-gray-600 truncate">
                        {user?.email}
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors"
                      >
                        <FaSignOutAlt />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 pt-16 md:pt-0">
          <div className="p-4 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
