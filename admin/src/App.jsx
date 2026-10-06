import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Skills from "./pages/Skills";
import Projects from "./pages/Projects";
import Experience from "./pages/Experience";
import Blogs from "./pages/Blogs";
import Services from "./pages/Services";
import Testimonials from "./pages/Testimonials";
import Media from "./pages/Media";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";

import AdminLayout from "./layouts/AdminLayout";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Login */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* Admin Layout */}
                <Route element={<AdminLayout />}>

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/about"
                        element={<About />}
                    />

                    <Route
                        path="/skills"
                        element={<Skills />}
                    />

                    <Route
                        path="/projects"
                        element={<Projects />}
                    />

                    <Route
                        path="/experience"
                        element={<Experience />}
                    />

                    <Route
                        path="/blogs"
                        element={<Blogs />}
                    />

                    <Route
                        path="/services"
                        element={<Services />}
                    />

                    <Route
                        path="/testimonials"
                        element={<Testimonials />}
                    />

                    <Route
                        path="/media"
                        element={<Media />}
                    />

                    <Route
                        path="/messages"
                        element={<Messages />}
                    />

                    <Route
                        path="/settings"
                        element={<Settings />}
                    />

                </Route>

                {/* Unknown URL */}
                <Route
                    path="*"
                    element={<Navigate to="/login" replace />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;