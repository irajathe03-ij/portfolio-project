import { useEffect, useState } from "react";
import api from "../services/api";

function Services() {
    const emptyForm = {
        title: "",
        description: "",
        icon: ""
    };

    const [services, setServices] = useState([]);
    const [formData, setFormData] = useState(emptyForm);

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Fetch services
    const fetchServices = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/services");

            setServices(response.data.data || []);
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to load services."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    // Handle input
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    // Add / Update service
    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);
        setMessage("");
        setError("");

        try {
            if (editingId) {
                const response = await api.put(
                    `/services/${editingId}`,
                    formData
                );

                setMessage(
                    response.data.message ||
                    "Service updated successfully."
                );
            } else {
                const response = await api.post(
                    "/services",
                    formData
                );

                setMessage(
                    response.data.message ||
                    "Service added successfully."
                );
            }

            setFormData(emptyForm);
            setEditingId(null);

            await fetchServices();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to save service."
            );
        } finally {
            setSaving(false);
        }
    };

    // Edit service
    const handleEdit = (service) => {
        setEditingId(service.id);

        setFormData({
            title: service.title || "",
            description: service.description || "",
            icon: service.icon || ""
        });

        setMessage("");
        setError("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // Delete service
    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this service?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setMessage("");

            const response = await api.delete(
                `/services/${id}`
            );

            setMessage(
                response.data.message ||
                "Service deleted successfully."
            );

            if (editingId === id) {
                setEditingId(null);
                setFormData(emptyForm);
            }

            await fetchServices();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to delete service."
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
                    Services
                </h2>

                <p className="mt-2 text-slate-600">
                    Manage the services displayed on your portfolio.
                </p>
            </div>

            {/* Success message */}
            {message && (
                <div className="mb-6 rounded-lg bg-green-100 px-4 py-3 text-sm text-green-700">
                    {message}
                </div>
            )}

            {/* Error message */}
            {error && (
                <div className="mb-6 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Form */}
            <div className="rounded-xl bg-white p-6 shadow-sm">

                <h3 className="mb-6 text-xl font-semibold text-slate-800">
                    {editingId
                        ? "Edit Service"
                        : "Add Service"}
                </h3>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* Title */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Service Title
                        </label>

                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Example: Web Development"
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
                            placeholder="Describe the service you provide..."
                            rows="6"
                            className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                        />
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
                            placeholder="Example: code"
                            maxLength="255"
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                        />

                        <p className="mt-1 text-xs text-slate-500">
                            Enter an icon name or icon identifier.
                        </p>
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
                                    ? "Update Service"
                                    : "Add Service"}
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

            {/* Services List */}
            <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">

                <div className="mb-6 flex items-center justify-between">

                    <h3 className="text-xl font-semibold text-slate-800">
                        Your Services
                    </h3>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                        {services.length} services
                    </span>

                </div>

                {loading ? (
                    <p className="text-slate-600">
                        Loading services...
                    </p>
                ) : services.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">

                        <p className="text-slate-500">
                            No services found.
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                            Add your first service using the form above.
                        </p>

                    </div>
                ) : (
                    <div className="grid gap-5 md:grid-cols-2">

                        {services.map((service) => (
                            <div
                                key={service.id}
                                className="rounded-xl border border-slate-200 p-5"
                            >

                                <div className="flex items-start justify-between gap-4">

                                    {/* Icon */}
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-lg font-bold text-slate-700">
                                        {service.icon || "★"}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">

                                        <button
                                            onClick={() =>
                                                handleEdit(service)
                                            }
                                            className="rounded-lg bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleDelete(service.id)
                                            }
                                            className="rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                                <h4 className="mt-5 text-xl font-semibold text-slate-800">
                                    {service.title}
                                </h4>

                                <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
                                    {service.description ||
                                        "No description available."}
                                </p>

                            </div>
                        ))}

                    </div>
                )}

            </div>

        </div>
    );
}

export default Services;