import { useEffect, useState } from "react";
import api from "../services/api";

function Projects() {
    const emptyForm = {
        title: "",
        description: "",
        image: "",
        technologies: "",
        github_url: "",
        live_url: ""
    };

    const [projects, setProjects] = useState([]);
    const [formData, setFormData] = useState(emptyForm);

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const fetchProjects = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/projects");

            setProjects(response.data.data || []);
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to load projects."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);
        setMessage("");
        setError("");

        try {
            if (editingId) {
                const response = await api.put(
                    `/projects/${editingId}`,
                    formData
                );

                setMessage(
                    response.data.message ||
                    "Project updated successfully."
                );
            } else {
                const response = await api.post(
                    "/projects",
                    formData
                );

                setMessage(
                    response.data.message ||
                    "Project added successfully."
                );
            }

            setFormData(emptyForm);
            setEditingId(null);

            await fetchProjects();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to save project."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (project) => {
        setEditingId(project.id);

        setFormData({
            title: project.title || "",
            description: project.description || "",
            image: project.image || "",
            technologies: project.technologies || "",
            github_url: project.github_url || "",
            live_url: project.live_url || ""
        });

        setMessage("");
        setError("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this project?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setMessage("");

            const response = await api.delete(
                `/projects/${id}`
            );

            setMessage(
                response.data.message ||
                "Project deleted successfully."
            );

            if (editingId === id) {
                setEditingId(null);
                setFormData(emptyForm);
            }

            await fetchProjects();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to delete project."
            );
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setFormData(emptyForm);
        setMessage("");
        setError("");
    };

    return (
        <div>

            {/* Page Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-800">
                    Projects
                </h2>

                <p className="mt-2 text-slate-600">
                    Manage the projects displayed on your portfolio.
                </p>
            </div>

            {/* Success Message */}
            {message && (
                <div className="mb-6 rounded-lg bg-green-100 px-4 py-3 text-sm text-green-700">
                    {message}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mb-6 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Project Form */}
            <div className="rounded-xl bg-white p-6 shadow-sm">

                <h3 className="mb-6 text-xl font-semibold text-slate-800">
                    {editingId ? "Edit Project" : "Add Project"}
                </h3>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* Title */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Project Title
                        </label>

                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Example: KEYSTONE"
                            maxLength="200"
                            required
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe your project..."
                            rows="6"
                            className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Image */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Project Image URL
                        </label>

                        <input
                            type="text"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="https://example.com/project.jpg"
                            maxLength="500"
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Image Preview */}
                    {formData.image && (
                        <div>
                            <p className="mb-2 text-sm font-medium text-slate-700">
                                Image Preview
                            </p>

                            <img
                                src={formData.image}
                                alt="Project preview"
                                className="h-48 w-full max-w-md rounded-xl object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                }}
                            />
                        </div>
                    )}

                    {/* Technologies */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Technologies
                        </label>

                        <textarea
                            name="technologies"
                            value={formData.technologies}
                            onChange={handleChange}
                            placeholder="React.js, Node.js, Express.js, MySQL"
                            rows="3"
                            className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                        />

                        <p className="mt-1 text-xs text-slate-500">
                            Separate technologies with commas.
                        </p>
                    </div>

                    {/* GitHub URL */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            GitHub URL
                        </label>

                        <input
                            type="url"
                            name="github_url"
                            value={formData.github_url}
                            onChange={handleChange}
                            placeholder="https://github.com/username/project"
                            maxLength="500"
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Live URL */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Live Project URL
                        </label>

                        <input
                            type="url"
                            name="live_url"
                            value={formData.live_url}
                            onChange={handleChange}
                            placeholder="https://your-project.vercel.app"
                            maxLength="500"
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">

                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-lg bg-slate-800 px-6 py-3 font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving
                                ? "Saving..."
                                : editingId
                                    ? "Update Project"
                                    : "Add Project"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                        )}

                    </div>

                </form>
            </div>

            {/* Projects List */}
            <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">

                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-slate-800">
                        Your Projects
                    </h3>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                        {projects.length} projects
                    </span>
                </div>

                {loading ? (
                    <p className="text-slate-600">
                        Loading projects...
                    </p>
                ) : projects.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
                        <p className="text-slate-500">
                            No projects found.
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                            Add your first project using the form above.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2">

                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="overflow-hidden rounded-xl border border-slate-200"
                            >

                                {/* Image */}
                                {project.image ? (
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="h-48 w-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.style.display = "none";
                                        }}
                                    />
                                ) : (
                                    <div className="flex h-48 items-center justify-center bg-slate-100 text-slate-400">
                                        No image
                                    </div>
                                )}

                                {/* Content */}
                                <div className="p-5">

                                    <h4 className="text-xl font-semibold text-slate-800">
                                        {project.title}
                                    </h4>

                                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                                        {project.description || "No description"}
                                    </p>

                                    {/* Technologies */}
                                    {project.technologies && (
                                        <div className="mt-4">
                                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                Technologies
                                            </p>

                                            <div className="flex flex-wrap gap-2">
                                                {project.technologies
                                                    .split(",")
                                                    .map((technology, index) => (
                                                        <span
                                                            key={index}
                                                            className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
                                                        >
                                                            {technology.trim()}
                                                        </span>
                                                    ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Links */}
                                    <div className="mt-5 flex flex-wrap gap-3">

                                        {project.github_url && (
                                            <a
                                                href={project.github_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
                                            >
                                                GitHub
                                            </a>
                                        )}

                                        {project.live_url && (
                                            <a
                                                href={project.live_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                            >
                                                Live Demo
                                            </a>
                                        )}

                                        <button
                                            onClick={() =>
                                                handleEdit(project)
                                            }
                                            className="rounded-lg bg-yellow-100 px-3 py-2 text-sm font-medium text-yellow-700 hover:bg-yellow-200"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleDelete(project.id)
                                            }
                                            className="rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            </div>
                        ))}

                    </div>
                )}

            </div>

        </div>
    );
}

export default Projects;