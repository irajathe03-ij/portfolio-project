import { useEffect, useState } from "react";
import api from "../services/api";

function Blogs() {
    const emptyForm = {
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        image: "",
        published: false
    };

    const [blogs, setBlogs] = useState([]);
    const [formData, setFormData] = useState(emptyForm);

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Fetch blogs
    const fetchBlogs = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/blogs");

            setBlogs(response.data.data || []);
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to load blogs."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    // Handle input
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    // Automatically create slug from title
    const createSlug = (title) => {
        return title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");
    };

    // Handle title change
    const handleTitleChange = (e) => {
        const title = e.target.value;

        setFormData((previous) => ({
            ...previous,
            title,
            slug: editingId
                ? previous.slug
                : createSlug(title)
        }));
    };

    // Add / Update blog
    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);
        setMessage("");
        setError("");

        try {
            const payload = {
                ...formData,
                published: formData.published ? 1 : 0
            };

            if (editingId) {
                const response = await api.put(
                    `/blogs/${editingId}`,
                    payload
                );

                setMessage(
                    response.data.message ||
                    "Blog updated successfully."
                );
            } else {
                const response = await api.post(
                    "/blogs",
                    payload
                );

                setMessage(
                    response.data.message ||
                    "Blog added successfully."
                );
            }

            setFormData(emptyForm);
            setEditingId(null);

            await fetchBlogs();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to save blog."
            );
        } finally {
            setSaving(false);
        }
    };

    // Edit blog
    const handleEdit = (blog) => {
        setEditingId(blog.id);

        setFormData({
            title: blog.title || "",
            slug: blog.slug || "",
            excerpt: blog.excerpt || "",
            content: blog.content || "",
            image: blog.image || "",
            published: Boolean(blog.published)
        });

        setMessage("");
        setError("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // Delete blog
    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this blog?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setMessage("");

            const response = await api.delete(
                `/blogs/${id}`
            );

            setMessage(
                response.data.message ||
                "Blog deleted successfully."
            );

            if (editingId === id) {
                setEditingId(null);
                setFormData(emptyForm);
            }

            await fetchBlogs();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to delete blog."
            );
        }
    };

    // Toggle published status
    const handleTogglePublished = async (blog) => {
        try {
            setError("");
            setMessage("");

            const payload = {
                title: blog.title,
                slug: blog.slug,
                excerpt: blog.excerpt || "",
                content: blog.content || "",
                image: blog.image || "",
                published: blog.published ? 0 : 1
            };

            const response = await api.put(
                `/blogs/${blog.id}`,
                payload
            );

            setMessage(
                response.data.message ||
                "Blog status updated successfully."
            );

            await fetchBlogs();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to update blog status."
            );
        }
    };

    // Cancel editing
    const handleCancel = () => {
        setEditingId(null);
        setFormData(emptyForm);
        setMessage("");
        setError("");
    };

    return (
        <div>

            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-800">
                    Blogs
                </h2>

                <p className="mt-2 text-slate-600">
                    Create and manage blog posts for your portfolio.
                </p>
            </div>

            {/* Messages */}
            {message && (
                <div className="mb-6 rounded-lg bg-green-100 px-4 py-3 text-sm text-green-700">
                    {message}
                </div>
            )}

            {error && (
                <div className="mb-6 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Form */}
            <div className="rounded-xl bg-white p-6 shadow-sm">

                <h3 className="mb-6 text-xl font-semibold text-slate-800">
                    {editingId ? "Edit Blog" : "Create Blog"}
                </h3>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* Title */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Title
                        </label>

                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleTitleChange}
                            placeholder="Example: Getting Started with React"
                            maxLength="255"
                            required
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Slug
                        </label>

                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            placeholder="getting-started-with-react"
                            maxLength="255"
                            required
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                        />

                        <p className="mt-1 text-xs text-slate-500">
                            Slug must be unique and is used in the blog URL.
                        </p>
                    </div>

                    {/* Excerpt */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Excerpt
                        </label>

                        <textarea
                            name="excerpt"
                            value={formData.excerpt}
                            onChange={handleChange}
                            placeholder="Short summary of the blog post..."
                            rows="3"
                            className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Content
                        </label>

                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="Write your complete blog content..."
                            rows="12"
                            className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Image */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Blog Image URL
                        </label>

                        <input
                            type="text"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="https://example.com/blog.jpg"
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
                                alt="Blog preview"
                                className="h-48 w-full max-w-md rounded-xl object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                }}
                            />
                        </div>
                    )}

                    {/* Published */}
                    <div className="flex items-center gap-3">

                        <input
                            type="checkbox"
                            id="published"
                            name="published"
                            checked={formData.published}
                            onChange={handleChange}
                            className="h-4 w-4"
                        />

                        <label
                            htmlFor="published"
                            className="text-sm font-medium text-slate-700"
                        >
                            Publish this blog
                        </label>

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
                                    ? "Update Blog"
                                    : "Create Blog"}
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

            {/* Blog List */}
            <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">

                <div className="mb-6 flex items-center justify-between">

                    <h3 className="text-xl font-semibold text-slate-800">
                        Your Blogs
                    </h3>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                        {blogs.length} posts
                    </span>

                </div>

                {loading ? (
                    <p className="text-slate-600">
                        Loading blogs...
                    </p>
                ) : blogs.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">

                        <p className="text-slate-500">
                            No blogs found.
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                            Create your first blog post above.
                        </p>

                    </div>
                ) : (
                    <div className="space-y-5">

                        {blogs.map((blog) => (
                            <div
                                key={blog.id}
                                className="overflow-hidden rounded-xl border border-slate-200"
                            >

                                {/* Image */}
                                {blog.image ? (
                                    <img
                                        src={blog.image}
                                        alt={blog.title}
                                        className="h-48 w-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.style.display = "none";
                                        }}
                                    />
                                ) : null}

                                <div className="p-5">

                                    {/* Title and status */}
                                    <div className="flex flex-col justify-between gap-3 md:flex-row">

                                        <div>
                                            <h4 className="text-xl font-semibold text-slate-800">
                                                {blog.title}
                                            </h4>

                                            <p className="mt-1 text-sm text-slate-500">
                                                /{blog.slug}
                                            </p>
                                        </div>

                                        <span
                                            className={`h-fit rounded-full px-3 py-1 text-xs font-medium ${
                                                blog.published
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                            }`}
                                        >
                                            {blog.published
                                                ? "Published"
                                                : "Draft"}
                                        </span>

                                    </div>

                                    {/* Excerpt */}
                                    {blog.excerpt && (
                                        <p className="mt-4 text-sm leading-6 text-slate-600">
                                            {blog.excerpt}
                                        </p>
                                    )}

                                    {/* Date */}
                                    {blog.created_at && (
                                        <p className="mt-3 text-xs text-slate-400">
                                            Created:{" "}
                                            {new Date(
                                                blog.created_at
                                            ).toLocaleString()}
                                        </p>
                                    )}

                                    {/* Actions */}
                                    <div className="mt-5 flex flex-wrap gap-2">

                                        <button
                                            onClick={() =>
                                                handleEdit(blog)
                                            }
                                            className="rounded-lg bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleTogglePublished(blog)
                                            }
                                            className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
                                        >
                                            {blog.published
                                                ? "Unpublish"
                                                : "Publish"}
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleDelete(blog.id)
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

export default Blogs;