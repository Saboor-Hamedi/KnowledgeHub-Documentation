import { Link, useNavigate } from "react-router-dom";
import {
  Book,
  Menu,
  X,
  Github,
  LogIn,
  Search,
  Command,
  Plus,
  User,
  Settings,
  HelpCircle,
  CreditCard,
  LogOut,
  ChevronDown,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useState, useEffect, useRef } from "react";
import { supabase } from "../../lib/supabase";
import CommandMenu from "../CommandMenu";

export default function Navbar() {
  const [openCmd, setOpenCmd] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <>
      <CommandMenu open={openCmd} setOpen={setOpenCmd} />
      <nav className="sticky top-0 z-50 glass transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-12 sm:h-14 items-center justify-between gap-2 sm:gap-6">
            <div className="flex items-center flex-shrink-0">
              <Link to="/docs" className="flex items-center gap-1.5">
                <div className="rounded-md bg-indigo-500 p-0.5">
                  <Book className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-bold tracking-tight text-gray-900 transition-colors">
                  Knowledge<span className="text-indigo-500">Hub</span>
                </span>
              </Link>
            </div>

            <div className="flex-1 max-w-md hidden md:block">
              <button
                onClick={() => setOpenCmd(true)}
                className="w-full flex items-center gap-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-500 transition-all group"
              >
                <Search
                  size={14}
                  className="group-hover:text-gray-900 transition-colors"
                />
                <span>Search documentation...</span>
                <span className="ml-auto flex items-center gap-1 text-[10px] font-mono bg-gray-200 px-1.5 py-0.5 rounded border border-gray-300 text-gray-500">
                  <Command size={10} /> K
                </span>
              </button>
            </div>

            <div className="flex items-center gap-1 sm:gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-900 transition p-2 sm:p-1.5"
                title="View on GitHub"
              >
                <Github size={20} className="sm:size-4" />
              </a>
              
              <button
                onClick={() => setOpenCmd(true)}
                className="md:hidden text-gray-500 hover:text-gray-900 p-2"
                title="Search"
              >
                <Search size={22} className="text-indigo-600" />
              </button>

              <div className="flex items-center gap-1 sm:gap-4 border-l border-gray-100 pl-1 sm:pl-4">
                {user && (
                    <Link
                      to="/updates"
                      state={{ create: true }}
                      className="hidden xs:flex items-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-1.5 text-[11px] font-bold text-indigo-600 hover:bg-indigo-100 border border-indigo-200 transition"
                    >
                      <Plus size={14} /> New
                    </Link>
                )}

                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => user ? setIsDropdownOpen(!isDropdownOpen) : navigate('/login')}
                    className="flex items-center justify-center text-gray-500 hover:text-gray-900 transition p-1.5"
                    title={user ? "Account" : "Login"}
                  >
                    <User size={18} />
                  </button>

                  <AnimatePresence>
                    {user && isDropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 rounded-[2px] shadow-xl py-2 z-50 overflow-hidden"
                      >
                        {user ? (
                          <>
                            <div className="px-4 py-2 border-b border-gray-50 mb-1">
                              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Account</div>
                              <div className="text-xs text-gray-900 truncate font-medium">{user.email}</div>
                            </div>
                            
                            <div className="py-1">
                              <button className="w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                                  <User size={14} className="text-gray-400" /> Profile
                              </button>
                              <button className="w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                                  <Settings size={14} className="text-gray-400" /> Settings
                              </button>
                              <button className="w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                                  <HelpCircle size={14} className="text-gray-400" /> Help
                              </button>
                              <button className="w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                                  <CreditCard size={14} className="text-gray-400" /> Billing
                              </button>
                            </div>

                            <div className="border-t border-gray-50"></div>
                            
                            <button onClick={handleSignOut} className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors">
                                <LogOut size={14} /> Logout
                            </button>
                          </>
                        ) : (
                          <>
                            <div className="px-4 py-2 border-b border-gray-50 mb-1">
                              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Account</div>
                              <div className="text-xs text-gray-900 font-medium">Guest User</div>
                            </div>
                            <div className="py-1">
                              <Link to="/login" onClick={() => setIsDropdownOpen(false)} className="w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                                  <LogIn size={14} className="text-gray-400" /> Login
                              </Link>
                              <Link to="/signup" onClick={() => setIsDropdownOpen(false)} className="w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                                  <Plus size={14} className="text-gray-400" /> Sign Up
                              </Link>
                            </div>
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>

      </nav>
    </>
  );
}
