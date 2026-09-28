import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
    const [counts, setCounts] = useState({
        projects: 0,
        skills: 0,
        blogs: 0,
        messages: 0,
        experience: 0,
        services: 0,
        testimonials: 0,
        media: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const [
                    projects,
                    skills,
                    blogs,
                    messages,
                    experience,
                    services,
                    testimonials,
                    media
                ] = await Promise.all([
                    api.get("/projects"),
                    api.get("/skills"),
                    api.get("/blogs"),
                    api.get("/messages"),
                    api.get("/experience"),
                    api.get("/services"),
                    api.get("/testimonials"),
                    api.get("/media")
                ]);

                setCounts({
                    projects: projects.data.data?.length || 0,
                    skills: skills.data.data?.length || 0,
                    blogs: blogs.data.data?.length || 0,
                    messages: messages.data.data?.length || 0,
                    experience: experience.data.data?.length || 0,
                    services: services.data.data?.length || 0,
                    testimonials: testimonials.data.data?.length || 0,
                    media: media.data.data?.length || 0
                });
            } catch (error) {
                console.error(error);
                setError("Unable to load dashboard data.");
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    const cards = [
        {
            title: "Projects",
            value: counts.projects
        },
        {
            title: "Skills",
            value: counts.skills
        },
        {
            title: "Blogs",
            value: counts.blogs
        },
        {
            title: "Messages",
            value: counts.messages
        },
        {
            title: "Experience",
            value: counts.experience
        },
        {
            title: "Services",
            value: counts.services
        },
        {
            title: "Testimonials",
            value: counts.testimonials
        },
        {
            title: "Media",
            value: counts.media
        }
    ];

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-800">
                    Dashboard
                </h2>

                <p className="mt-2 text-slate-600">
                    Manage your portfolio content from one place.
                </p>
            </div>

            {error && (
                <div className="mb-6 rounded-lg bg-red-100 px-4 py-3 text-red-700">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="rounded-xl bg-white p-8 shadow-sm">
                    <p className="text-slate-600">
                        Loading dashboard...
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {cards.map((card) => (
                        <div
                            key={card.title}
                            className="rounded-xl bg-white p-6 shadow-sm"
                        >
                            <p className="text-sm font-medium text-slate-500">
                                {card.title}
                            </p>

                            <p className="mt-3 text-3xl font-bold text-slate-800">
                                {card.value}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Dashboard;