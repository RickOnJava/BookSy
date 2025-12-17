import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white shadow-md px-8 py-4 flex justify-between items-center"
    >
      {/* Logo */}
      <h1
        onClick={() => navigate("/")}
        className="text-2xl font-bold cursor-pointer text-indigo-600"
      >
        📘 BookSy
      </h1>
      {user?.role === "admin" && <span className=" border px-2.5 py-0.5 font-bold rounded-2xl">Admin</span>}

      {/* Actions */}
      <div className="flex gap-4 items-center">
        {/* ADMIN ONLY */}
        {user?.role === "admin" && (
          <button
            onClick={() => navigate("/admin/create-ebook")}
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
          >
            + Create Book
          </button>
        )}
        {user?.role === "admin" && (
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Dashboard
          </button>
        )}

        {/* USER */}
        <button
          onClick={() => navigate("/inventory")}
          className="px-4 py-2 rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
        >
          My Inventory
        </button>

        {/* LOGOUT */}
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </motion.nav>
  );
}
