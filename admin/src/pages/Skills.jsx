import { useEffect, useState } from "react";
import api from "../services/api";

function Skills() {
    const emptyForm = {
        name: "",
        category: "",
        level: 0,
        icon: ""
    };

    const [skills, setSkills] = useState([]);
    const [formData, setFormData] = useState(emptyForm);

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Fetch skills
    const fetchSkills = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/skills");

            setSkills(response.data.data || []);
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to load skills."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSkills();
    }, []);

    // Handle input
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: name === "level" ? Number(value) : value
        }));
    };

    // Add / Update skill
    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);
        setMessage("");
        setError("");

        try {
            if (editingId) {
                const response = await api.put(
                    `/skills/${editingId}`,
                    formData
                );

                setMessage(
                    response.data.message ||
                    "Skill updated successfully."
                );
            } else {
                const response = await api.post(
                    "/skills",
                    formData
                );

                setMessage(
                    response.data.message ||
                    "Skill added successfully."
                );
            }

            setFormData(emptyForm);
            setEditingId(null);

            await fetchSkills();

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to save skill."
            );
        } finally {
            setSaving(false);
        }
    };

    // Edit skill
    const handleEdit = (skill) => {
        setEditingId(skill.id);

        setFormData({
            name: skill.name || "",
            category: skill.category || "",
            level: skill.level || 0,
            icon: skill.icon || ""
        });

        setMessage("");
        setError("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // Delete skill
    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this skill?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setMessage("");

            const response = await api.delete(
                `/skills/${id}`
            );

            setMessage(
                response.data.message ||
                "Skill deleted successfully."
            );

            if (editingId === id) {
                setEditingId(null);
                setFormData(emptyForm);
            }

            await fetchSkills();

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to delete skill."
            );
        }
    };

    // Cancel edit
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
                    Skills
                </h2>

                <p className="mt-2 text-slate-600">
                    Add and manage your technical skills.
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

            {/* Add/Edit Form */}
            <div className="rounded-xl bg-white p-6 shadow-sm">

                <h3 className="mb-6 text-xl font-semibold text-slate-800">
                    {editingId ? "Edit Skill" : "Add Skill"}
                </h3>

                <form
                    onSubmit={handleSubmit}
                    className="grid gap-5 md:grid-cols-2"
                >

                    {/* Name */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Skill Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Example: React.js"
                            maxLength="100"
                            required
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Category
                        </label>

                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            placeholder="Example: Frontend"
                            maxLength="100"
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Level */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Skill Level
                        </label>

                        <input
                            type="number"
                            name="level"
                            value={formData.level}
                            onChange={handleChange}
                            min="0"
                            max="100"
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                        />

                        <p className="mt-1 text-xs text-slate-500">
                            Enter a value from 0 to 100.
                        </p>
                    </div>

                    {/* Icon */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Icon
                        </label>

                        <input
                            type="text"
                            name="icon"
                            value={formData.icon}
                            onChange={handleChange}
                            placeholder="Example: react"
                            maxLength="255"
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 md:col-span-2">

                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-lg bg-slate-800 px-6 py-3 font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving
                                ? "Saving..."
                                : editingId
                                    ? "Update Skill"
                                    : "Add Skill"}
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

            {/* Skills List */}
            <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">

                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-slate-800">
                        Your Skills
                    </h3>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                        {skills.length} skills
                    </span>
                </div>

                {loading ? (
                    <p className="text-slate-600">
                        Loading skills...
                    </p>
                ) : skills.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
                        <p className="text-slate-500">
                            No skills found.
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                            Add your first skill using the form above.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">

                        <table className="w-full text-left">

                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                                        Name
                                    </th>

                                    <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                                        Category
                                    </th>

                                    <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                                        Level
                                    </th>

                                    <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                                        Icon
                                    </th>

                                    <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>

                                {skills.map((skill) => (
                                    <tr
                                        key={skill.id}
                                        className="border-b border-slate-100 last:border-0"
                                    >

                                        <td className="px-4 py-4 font-medium text-slate-800">
                                            {skill.name}
                                        </td>

                                        <td className="px-4 py-4 text-slate-600">
                                            {skill.category || "-"}
                                        </td>

                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">

                                                <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-200">
                                                    <div
                                                        className="h-full rounded-full bg-slate-800"
                                                        style={{
                                                            width: `${Math.min(
                                                                Math.max(
                                                                    Number(skill.level) || 0,
                                                                    0
                                                                ),
                                                                100
                                                            )}%`
                                                        }}
                                                    />
                                                </div>

                                                <span className="text-sm text-slate-600">
                                                    {skill.level || 0}%
                                                </span>

                                            </div>
                                        </td>

                                        <td className="px-4 py-4 text-slate-600">
                                            {skill.icon || "-"}
                                        </td>

                                        <td className="px-4 py-4">

                                            <div className="flex gap-2">

                                                <button
                                                    onClick={() =>
                                                        handleEdit(skill)
                                                    }
                                                    className="rounded-lg bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(skill.id)
                                                    }
                                                    className="rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </td>

                                    </tr>
                                ))}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

        </div>
    );
}

export default Skills;