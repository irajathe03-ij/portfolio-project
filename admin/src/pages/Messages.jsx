import { useEffect, useState } from "react";
import api from "../services/api";

function Messages() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);

    const fetchMessages = async () => {
        try {
            setLoading(true);

            const response = await api.get("/messages");

            console.log("Messages response:", response.data);

            const data =
                response.data?.data ||
                response.data ||
                [];

            setMessages(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching messages:", error);

            alert(
                error.response?.data?.message ||
                "Failed to load messages."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleStatusChange = async (id, status) => {
        try {
            await api.put(`/messages/${id}/status`, {
                status
            });

            alert("Message status updated.");

            fetchMessages();

            if (selectedMessage?.id === id) {
                setSelectedMessage({
                    ...selectedMessage,
                    status
                });
            }
        } catch (error) {
            console.error("Status update error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to update message status."
            );
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this message?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/messages/${id}`);

            alert("Message deleted successfully.");

            if (selectedMessage?.id === id) {
                setSelectedMessage(null);
            }

            fetchMessages();
        } catch (error) {
            console.error("Delete message error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to delete message."
            );
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return "Unknown date";
        }

        return new Date(date).toLocaleString();
    };

    const getStatusClass = (status) => {
        if (status === "new") {
            return "bg-blue-100 text-blue-700";
        }

        if (status === "read") {
            return "bg-yellow-100 text-yellow-700";
        }

        if (status === "replied") {
            return "bg-green-100 text-green-700";
        }

        return "bg-slate-100 text-slate-600";
    };

    const newCount = messages.filter(
        (message) => message.status === "new"
    ).length;

    const readCount = messages.filter(
        (message) => message.status === "read"
    ).length;

    const repliedCount = messages.filter(
        (message) => message.status === "replied"
    ).length;

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-800">
                    Messages
                </h2>

                <p className="mt-2 text-slate-500">
                    View and manage messages received from your portfolio.
                </p>
            </div>

            {/* Statistics */}
            <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">
                        Total Messages
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-800">
                        {messages.length}
                    </p>
                </div>

                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">
                        New
                    </p>

                    <p className="mt-2 text-3xl font-bold text-blue-600">
                        {newCount}
                    </p>
                </div>

                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">
                        Read
                    </p>

                    <p className="mt-2 text-3xl font-bold text-yellow-600">
                        {readCount}
                    </p>
                </div>

                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">
                        Replied
                    </p>

                    <p className="mt-2 text-3xl font-bold text-green-600">
                        {repliedCount}
                    </p>
                </div>

            </div>

            {/* Message List */}
            <div className="rounded-xl bg-white p-6 shadow-sm">

                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-slate-800">
                        Inbox
                    </h3>

                    <button
                        type="button"
                        onClick={fetchMessages}
                        className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
                    >
                        Refresh
                    </button>
                </div>

                {loading ? (
                    <div className="py-10 text-center">
                        <p className="text-slate-500">
                            Loading messages...
                        </p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-slate-300 p-10 text-center">

                        <div className="text-4xl">
                            📭
                        </div>

                        <p className="mt-3 text-slate-500">
                            No messages yet.
                        </p>

                    </div>
                ) : (
                    <div className="space-y-4">

                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className="rounded-xl border border-slate-200 p-5"
                            >

                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                                    {/* Message Information */}
                                    <div className="min-w-0 flex-1">

                                        <div className="flex flex-wrap items-center gap-3">

                                            <h4 className="font-semibold text-slate-800">
                                                {message.name}
                                            </h4>

                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                                                    message.status
                                                )}`}
                                            >
                                                {message.status || "new"}
                                            </span>

                                        </div>

                                        <a
                                            href={`mailto:${message.email}`}
                                            className="mt-1 block text-sm text-blue-600 hover:underline"
                                        >
                                            {message.email}
                                        </a>

                                        {message.subject && (
                                            <p className="mt-3 font-medium text-slate-700">
                                                {message.subject}
                                            </p>
                                        )}

                                        <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                                            {message.message}
                                        </p>

                                        <p className="mt-3 text-xs text-slate-400">
                                            {formatDate(message.created_at)}
                                        </p>

                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-wrap gap-2">

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedMessage(message);

                                                if (
                                                    message.status ===
                                                    "new"
                                                ) {
                                                    handleStatusChange(
                                                        message.id,
                                                        "read"
                                                    );
                                                }
                                            }}
                                            className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
                                        >
                                            View
                                        </button>

                                        <select
                                            value={
                                                message.status || "new"
                                            }
                                            onChange={(e) =>
                                                handleStatusChange(
                                                    message.id,
                                                    e.target.value
                                                )
                                            }
                                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none"
                                        >
                                            <option value="new">
                                                New
                                            </option>

                                            <option value="read">
                                                Read
                                            </option>

                                            <option value="replied">
                                                Replied
                                            </option>
                                        </select>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDelete(message.id)
                                            }
                                            className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
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

            {/* Message Details Modal */}
            {selectedMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">

                        <div className="flex items-center justify-between">

                            <h3 className="text-xl font-bold text-slate-800">
                                Message Details
                            </h3>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedMessage(null)
                                }
                                className="text-2xl text-slate-400 hover:text-slate-700"
                            >
                                ×
                            </button>

                        </div>

                        <div className="mt-6 space-y-5">

                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Name
                                </p>

                                <p className="mt-1 text-slate-800">
                                    {selectedMessage.name}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Email
                                </p>

                                <a
                                    href={`mailto:${selectedMessage.email}`}
                                    className="mt-1 block text-blue-600 hover:underline"
                                >
                                    {selectedMessage.email}
                                </a>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Subject
                                </p>

                                <p className="mt-1 text-slate-800">
                                    {selectedMessage.subject ||
                                        "No subject"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Message
                                </p>

                                <div className="mt-2 rounded-lg bg-slate-50 p-4">
                                    <p className="whitespace-pre-wrap leading-7 text-slate-700">
                                        {selectedMessage.message}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Received
                                </p>

                                <p className="mt-1 text-slate-800">
                                    {formatDate(
                                        selectedMessage.created_at
                                    )}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Status
                                </p>

                                <select
                                    value={
                                        selectedMessage.status ||
                                        "new"
                                    }
                                    onChange={(e) =>
                                        handleStatusChange(
                                            selectedMessage.id,
                                            e.target.value
                                        )
                                    }
                                    className="mt-2 rounded-lg border border-slate-300 px-4 py-2 outline-none"
                                >
                                    <option value="new">
                                        New
                                    </option>

                                    <option value="read">
                                        Read
                                    </option>

                                    <option value="replied">
                                        Replied
                                    </option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-3">

                                <a
                                    href={`mailto:${selectedMessage.email}?subject=Re: ${
                                        selectedMessage.subject ||
                                        "Your message"
                                    }`}
                                    className="rounded-lg bg-slate-800 px-5 py-3 text-sm font-medium text-white hover:bg-slate-700"
                                >
                                    Reply by Email
                                </a>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedMessage(null)
                                    }
                                    className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    Close
                                </button>

                            </div>

                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}

export default Messages;