import { useEffect, useState } from "react";
import api from "../services/api";

function About() {
    const [about, setAbout] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        profile_image: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Load About information
    const fetchAbout = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/about");

            const data = response.data.data;

            if (Array.isArray(data) && data.length > 0) {
                setAbout(data[0]);

                setFormData({
                    title: data[0].title || "",
                    description: data[0].description || "",
                    profile_image: data[0].profile_image || ""
                });
            } else if (data && !Array.isArray(data)) {
                setAbout(data);

                setFormData({
                    title: data.title || "",
                    description: data.description || "",
                    profile_image: data.profile_image || ""
                });
            } else {
                setAbout(null);
            }
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to load About information."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAbout();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    // Save About information
    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);
        setMessage("");
        setError("");

        try {
            let response;

            if (about) {
                // Update existing record
                response = await api.put(
                    `/about/${about.id}`,
                    formData
                );
            } else {
                // Create new record
                response = await api.post(
                    "/about",
                    formData
                );
            }

            setMessage(
                response.data.message ||
                "About information saved successfully."
            );

            await fetchAbout();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to save About information."
            );
        } finally {
            setSaving(false);
        }
    };

    // Delete About information
    const handleDelete = async () => {
        if (!about) {
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to delete the About information?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setMessage("");

            await api.delete(`/about/${about.id}`);

            setAbout(null);

            setFormData({
                title: "",
                description: "",
                profile_image: ""
            });

            setMessage("About information deleted successfully.");
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to delete About information."
            );
        }
    };

    if (loading) {
        return (
            <div>
                <h2 className="text-3xl font-bold text-slate-800">
                    About
                </h2>

                <div className="mt-6 rounded-xl bg-white p-8 shadow-sm">
                    <p className="text-slate-600">
                        Loading About information...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div>

            {/* Page Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">
                        About
                    </h2>

                    <p className="mt-2 text-slate-600">
                        Manage the About section of your portfolio.
                    </p>
                </div>

                {about && (
                    <button
                        onClick={handleDelete}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >
                        Delete
                    </button>
                )}
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

            {/* Form */}
            <div className="rounded-xl bg-white p-6 shadow-sm">

                <h3 className="mb-6 text-xl font-semibold text-slate-800">
                    {about ? "Edit About Information" : "Add About Information"}
                </h3>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
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
                            onChange={handleChange}
                            placeholder="Enter About title"
                            maxLength="150"
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
                            placeholder="Write your About description..."
                            rows="8"
                            className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Profile Image */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Profile Image URL
                        </label>

                        <input
                            type="text"
                            name="profile_image"
                            value={formData.profile_image}
                            onChange={handleChange}
                            placeholder="https://example.com/profile.jpg"
                            maxLength="500"
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                        />

                        <p className="mt-2 text-xs text-slate-500">
                            Enter the URL of your profile image.
                        </p>
                    </div>

                    {/* Image Preview */}
                    {formData.profile_image && (
                        <div>
                            <p className="mb-2 text-sm font-medium text-slate-700">
                                Image Preview
                            </p>

                            <img
                                src={formData.profile_image}
                                alt="Profile preview"
                                className="h-40 w-40 rounded-xl object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                }}
                            />
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3">

                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-lg bg-slate-800 px-6 py-3 font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving
                                ? "Saving..."
                                : about
                                    ? "Update About"
                                    : "Save About"}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                if (about) {
                                    setFormData({
                                        title: about.title || "",
                                        description: about.description || "",
                                        profile_image: about.profile_image || ""
                                    });
                                } else {
                                    setFormData({
                                        title: "",
                                        description: "",
                                        profile_image: ""
                                    });
                                }

                                setMessage("");
                                setError("");
                            }}
                            className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Reset
                        </button>

                    </div>

                </form>
            </div>

            {/* Current Data */}
            {about && (
                <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">

                    <h3 className="mb-4 text-xl font-semibold text-slate-800">
                        Current About Information
                    </h3>

                    <div className="space-y-3 text-sm">

                        <p>
                            <span className="font-semibold">
                                ID:
                            </span>{" "}
                            {about.id}
                        </p>

                        <p>
                            <span className="font-semibold">
                                Title:
                            </span>{" "}
                            {about.title || "No title"}
                        </p>

                        <p>
                            <span className="font-semibold">
                                Description:
                            </span>{" "}
                            {about.description || "No description"}
                        </p>

                        <p>
                            <span className="font-semibold">
                                Updated:
                            </span>{" "}
                            {about.updated_at
                                ? new Date(about.updated_at).toLocaleString()
                                : "Not available"}
                        </p>

                    </div>

                </div>
            )}

        </div>
    );
}

export default About;