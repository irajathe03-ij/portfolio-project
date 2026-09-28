import { NavLink, Outlet, useNavigate } from "react-router-dom";

function AdminLayout() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const menuItems = [
        { name: "Dashboard", path: "/dashboard" },
        { name: "About", path: "/about" },
        { name: "Skills", path: "/skills" },
        { name: "Projects", path: "/projects" },
        { name: "Experience", path: "/experience" },
        { name: "Blogs", path: "/blogs" },
        { name: "Services", path: "/services" },
        { name: "Testimonials", path: "/testimonials" },
        { name: "Media", path: "/media" },
        { name: "Messages", path: "/messages" }
    ];

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-slate-100">

            {/* Top Header */}
            <header className="fixed top-0 right-0 left-0 z-10 h-16 bg-white border-b border-slate-200">
                <div className="flex h-full items-center justify-between px-6">

                    <h1 className="text-xl font-bold text-slate-800">
                        Portfolio CMS
                    </h1>

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-600">
                            {user.name || "Admin"}
                        </span>

                        <button
                            onClick={handleLogout}
                            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                        >
                            Logout
                        </button>
                    </div>

                </div>
            </header>

            {/* Sidebar */}
            <aside className="fixed top-16 bottom-0 left-0 w-60 overflow-y-auto bg-slate-900 p-4">

                <nav className="space-y-1">

                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `block rounded-lg px-4 py-3 text-sm font-medium transition ${
                                    isActive
                                        ? "bg-white text-slate-900"
                                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                }`
                            }
                        >
                            {item.name}
                        </NavLink>
                    ))}

                </nav>

            </aside>

            {/* Main Content */}
            <main className="ml-60 pt-16">

                <div className="p-6">
                    <Outlet />
                </div>

            </main>

        </div>
    );
}

export default AdminLayout;