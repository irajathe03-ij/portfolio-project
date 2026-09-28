import { useEffect, useState } from "react";
import api from "../services/api";

function Experience() {
    const emptyForm = {
        title: "",
        company: "",
        start_date: "",
        end_date: "",
        description: ""
    };

    const [experiences, setExperiences] = useState([]);
    const [formData, setFormData] = useState(emptyForm);

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Fetch experience
    const fetchExperiences = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/experience");

            setExperiences(response.data.data || []);
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to load experience."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExperiences();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    // Add / Update experience
    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);
        setMessage("");
        setError("");

        try {
            if (editingId) {
                const response = await api.put(
                    `/experience/${editingId}`,
                    formData
                );

                setMessage(
                    response.data.message ||
                    "Experience updated successfully."
                );
            } else {
                const response = await api.post(
                    "/experience",
                    formData
                );

                setMessage(
                    response.data.message ||
                    "Experience added successfully."
                );
            }

            setFormData(emptyForm);
            setEditingId(null);

            await fetchExperiences();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to save experience."
            );
        } finally {
            setSaving(false);
        }
    };

    // Edit
    const handleEdit = (experience) => {
        setEditingId(experience.id);

        setFormData({
            title: experience.title || "",
            company: experience.company || "",
            start_date: experience.start_date
                ? String(experience.start_date).substring(0, 10)
                : "",
            end_date: experience.end_date
                ? String(experience.end_date).substring(0, 10)
                : "",
            description: experience.description || ""
        });

        setMessage("");
        setError("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // Delete
    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this experience?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setMessage("");

            const response = await api.delete(
                `/experience/${id}`
            );

            setMessage(
                response.data.message ||
                "Experience deleted successfully."
            );

            if (editingId === id) {
                setEditingId(null);
                setFormData(emptyForm);
            }

            await fetchExperiences();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to delete experience."
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

    // Format date
    const formatDate = (date) => {
        if (!date) {
            return "Present";
        }

        const value = String(date).substring(0, 10);

        const [year, month, day] = value.split("-");

        return `${day}-${month}-${year}`;
    };

    return (
        <div>

            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-800">
                    Experience
                </h2>

                <p className="mt-2 text-slate-600">
                    Manage your education, internships, jobs, and other experience.
                </p>
            </div>

            {/* Success */}
            {message && (
                <div className="mb-6 rounded-lg bg-green-100 px-4 py-3 text-sm text-green-700">
                    {message}
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="mb-6 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Form */}
            <div className="rounded-xl bg-white p-6 shadow-sm">

                <h3 className="mb-6 text-xl font-semibold text-slate-800">
                    {editingId
                        ? "Edit Experience"
                        : "Add Experience"}
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
                            onChange={handleChange}
                            placeholder="Example: Software Developer Intern"
                            maxLength="200"
                            required
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Company */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Company / Organization
                        </label>

                        <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            placeholder="Example: ClickInnovate Pvt. Ltd."
                            maxLength="200"
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Dates */}
                    <div className="grid gap-5 md:grid-cols-2">

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Start Date
                            </label>

                            <input
                                type="date"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                End Date
                            </label>

                            <input
                                type="date"
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                            />

                            <p className="mt-1 text-xs text-slate-500">
                                Leave empty if this experience is ongoing.
                            </p>
                        </div>

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
                            placeholder="Describe your responsibilities, work, achievements, and technologies..."
                            rows="7"
                            className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
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
                                    ? "Update Experience"
                                    : "Add Experience"}
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

            {/* Experience List */}
            <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">

                <div className="mb-6 flex items-center justify-between">

                    <h3 className="text-xl font-semibold text-slate-800">
                        Your Experience
                    </h3>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                        {experiences.length} entries
                    </span>

                </div>

                {loading ? (
                    <p className="text-slate-600">
                        Loading experience...
                    </p>
                ) : experiences.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">

                        <p className="text-slate-500">
                            No experience found.
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                            Add your first experience using the form above.
                        </p>

                    </div>
                ) : (
                    <div className="space-y-5">

                        {experiences.map((experience) => (
                            <div
                                key={experience.id}
                                className="rounded-xl border border-slate-200 p-5"
                            >

                                <div className="flex flex-col justify-between gap-4 md:flex-row">

                                    <div className="flex-1">

                                        <h4 className="text-xl font-semibold text-slate-800">
                                            {experience.title}
                                        </h4>

                                        {experience.company && (
                                            <p className="mt-1 font-medium text-blue-600">
                                                {experience.company}
                                            </p>
                                        )}

                                        <p className="mt-2 text-sm text-slate-500">
                                            {formatDate(experience.start_date)}
                                            {" — "}
                                            {formatDate(experience.end_date)}
                                        </p>

                                        {experience.description && (
                                            <p className="mt-4 whitespace-pre-line text-sm leading-6 text-slate-600">
                                                {experience.description}
                                            </p>
                                        )}

                                    </div>

                                    <div className="flex h-fit gap-2">

                                        <button
                                            onClick={() =>
                                                handleEdit(experience)
                                            }
                                            className="rounded-lg bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleDelete(experience.id)
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

export default Experience;