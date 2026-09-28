import { useEffect, useState } from "react";
import api from "../services/api";

function Testimonials() {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        name: "",
        role: "",
        message: "",
        image: ""
    });

    const fetchTestimonials = async () => {
        try {
            const response = await api.get("/testimonials");
            setTestimonials(response.data.data || response.data || []);
        } catch (error) {
            console.error("Error fetching testimonials:", error);
            alert("Failed to load testimonials.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const resetForm = () => {
        setForm({
            name: "",
            role: "",
            message: "",
            image: ""
        });

        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name.trim() || !form.message.trim()) {
            alert("Name and message are required.");
            return;
        }

        try {
            if (editingId) {
                await api.put(`/testimonials/${editingId}`, form);
                alert("Testimonial updated successfully.");
            } else {
                await api.post("/testimonials", form);
                alert("Testimonial added successfully.");
            }

            resetForm();
            fetchTestimonials();
        } catch (error) {
            console.error("Error saving testimonial:", error);

            alert(
                error.response?.data?.message ||
                "Failed to save testimonial."
            );
        }
    };

    const handleEdit = (testimonial) => {
        setEditingId(testimonial.id);

        setForm({
            name: testimonial.name || "",
            role: testimonial.role || "",
            message: testimonial.message || "",
            image: testimonial.image || ""
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this testimonial?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/testimonials/${id}`);

            alert("Testimonial deleted successfully.");

            if (editingId === id) {
                resetForm();
            }

            fetchTestimonials();
        } catch (error) {
            console.error("Error deleting testimonial:", error);

            alert(
                error.response?.data?.message ||
                "Failed to delete testimonial."
            );
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-800">
                    Testimonials
                </h2>

                <p className="mt-2 text-slate-500">
                    Manage client and user testimonials.
                </p>
            </div>

            {/* Form */}
            <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-slate-800">
                        {editingId
                            ? "Edit Testimonial"
                            : "Add Testimonial"}
                    </h3>

                    {editingId && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Name *
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Client name"
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                            required
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Role
                        </label>

                        <input
                            type="text"
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            placeholder="e.g. Client, Student, Manager"
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                        />
                    </div>

                    {/* Message */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Message *
                        </label>

                        <textarea
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            placeholder="Write testimonial..."
                            rows="5"
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                            required
                        />
                    </div>

                    {/* Image */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Image URL
                        </label>

                        <input
                            type="text"
                            name="image"
                            value={form.image}
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg"
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                        />

                        {form.image && (
                            <div className="mt-4">
                                <img
                                    src={form.image}
                                    alt="Preview"
                                    className="h-20 w-20 rounded-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.style.display =
                                            "none";
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="rounded-lg bg-slate-800 px-6 py-3 font-medium text-white hover:bg-slate-700"
                    >
                        {editingId
                            ? "Update Testimonial"
                            : "Add Testimonial"}
                    </button>
                </form>
            </div>

            {/* Testimonials List */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-slate-800">
                        All Testimonials
                    </h3>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                        {testimonials.length} total
                    </span>
                </div>

                {loading ? (
                    <p className="text-slate-500">
                        Loading testimonials...
                    </p>
                ) : testimonials.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
                        <p className="text-slate-500">
                            No testimonials available.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-5 md:grid-cols-2">
                        {testimonials.map((testimonial) => (
                            <div
                                key={testimonial.id}
                                className="rounded-xl border border-slate-200 p-5"
                            >
                                <div className="flex items-start gap-4">
                                    {testimonial.image ? (
                                        <img
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            className="h-14 w-14 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-200 text-lg font-bold text-slate-600">
                                            {testimonial.name
                                                ?.charAt(0)
                                                ?.toUpperCase() || "?"}
                                        </div>
                                    )}

                                    <div className="min-w-0 flex-1">
                                        <h4 className="font-semibold text-slate-800">
                                            {testimonial.name}
                                        </h4>

                                        {testimonial.role && (
                                            <p className="text-sm text-slate-500">
                                                {testimonial.role}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <p className="mt-4 text-sm leading-6 text-slate-600">
                                    "{testimonial.message}"
                                </p>

                                <div className="mt-5 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleEdit(testimonial)
                                        }
                                        className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDelete(testimonial.id)
                                        }
                                        className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Testimonials;