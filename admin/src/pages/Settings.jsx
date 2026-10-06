import { useState } from "react";
import api from "../services/api";

function Settings() {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

    const [formData, setFormData] = useState({
        currentPassword: "",
        newEmail: storedUser.email || "",
        newPassword: "",
        confirmPassword: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (formData.newPassword !== formData.confirmPassword) {
            setError("New password and confirm password do not match.");
            return;
        }

        if (formData.newPassword.length < 8) {
            setError("New password must be at least 8 characters long.");
            return;
        }

        setLoading(true);

        try {
            const response = await api.put("/auth/update-credentials", {
                currentPassword: formData.currentPassword,
                newEmail: formData.newEmail,
                newPassword: formData.newPassword
            });

            if (response.data.success) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem(
                    "user",
                    JSON.stringify(response.data.user)
                );

                setMessage(
                    "Admin email and password updated successfully."
                );

                setFormData({
                    currentPassword: "",
                    newEmail: response.data.user.email,
                    newPassword: "",
                    confirmPassword: ""
                });
            }
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Failed to update admin credentials."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-800">
                    Admin Settings
                </h2>

                <p className="mt-2 text-slate-600">
                    Change your admin email and password securely.
                </p>
            </div>

            <div className="max-w-2xl rounded-2xl bg-white p-8 shadow-sm">
                {message && (
                    <div className="mb-6 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Current Password
                        </label>

                        <input
                            type="password"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                            placeholder="Enter current password"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            New Admin Email
                        </label>

                        <input
                            type="email"
                            name="newEmail"
                            value={formData.newEmail}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                            placeholder="Enter new email"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            New Password
                        </label>

                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                            minLength={8}
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                            placeholder="Minimum 8 characters"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Confirm New Password
                        </label>

                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            minLength={8}
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                            placeholder="Re-enter new password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-lg bg-slate-900 px-6 py-3 font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading
                            ? "Updating..."
                            : "Update Admin Credentials"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Settings;