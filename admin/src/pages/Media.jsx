import { useEffect, useRef, useState } from "react";
import api from "../services/api";

function Media() {
    const [media, setMedia] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const fileInputRef = useRef(null);

    const fetchMedia = async () => {
        try {
            const response = await api.get("/media");

            console.log("Media:", response.data);

            const data = response.data?.data || response.data || [];

            setMedia(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Fetch media error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedia();
    }, []);

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        console.log("FILE SELECTED:", file);

        if (!file) {
            setSelectedFile(null);
            setPreviewUrl("");
            return;
        }

        // Maximum 5 MB
        if (file.size > 5 * 1024 * 1024) {
            alert("File must be smaller than 5 MB.");

            event.target.value = "";
            setSelectedFile(null);
            setPreviewUrl("");

            return;
        }

        // Allowed files
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
            "application/pdf"
        ];

        if (!allowedTypes.includes(file.type)) {
            alert("Only JPG, PNG, WEBP, GIF and PDF files are allowed.");

            event.target.value = "";
            setSelectedFile(null);
            setPreviewUrl("");

            return;
        }

        // Store file
        setSelectedFile(file);

        // Image preview
        if (file.type.startsWith("image/")) {
            const preview = URL.createObjectURL(file);
            setPreviewUrl(preview);
        } else {
            setPreviewUrl("");
        }
    };

    const handleUpload = async (event) => {
        event.preventDefault();

        if (!selectedFile) {
            alert("Please select a file first.");
            return;
        }

        console.log("UPLOADING:", selectedFile);

        const formData = new FormData();

        formData.append("file", selectedFile);

        try {
            setUploading(true);

            const response = await api.post(
                "/media/upload",
                formData
            );

            console.log("UPLOAD RESPONSE:", response.data);

            alert("File uploaded successfully.");

            setSelectedFile(null);
            setPreviewUrl("");

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            fetchMedia();

        } catch (error) {
            console.error("UPLOAD ERROR:", error);

            alert(
                error.response?.data?.message ||
                "File upload failed."
            );
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this file?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await api.delete(`/media/${id}`);

            alert("File deleted successfully.");

            fetchMedia();
        } catch (error) {
            console.error("Delete error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to delete file."
            );
        }
    };

    const formatFileSize = (bytes) => {
        const size = Number(bytes);

        if (!size) {
            return "Unknown";
        }

        if (size < 1024) {
            return `${size} B`;
        }

        if (size < 1024 * 1024) {
            return `${(size / 1024).toFixed(1)} KB`;
        }

        return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    };

    const getFileUrl = (path) => {
        if (!path) {
            return "";
        }

        if (
            path.startsWith("http://") ||
            path.startsWith("https://")
        ) {
            return path;
        }

        return `http://localhost:5000${
            path.startsWith("/") ? "" : "/"
        }${path}`;
    };

    const isImage = (type) => {
        return type?.startsWith("image/");
    };

    return (
        <div>

            {/* PAGE TITLE */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-800">
                    Media
                </h2>

                <p className="mt-2 text-slate-500">
                    Upload and manage images and files used by your portfolio.
                </p>
            </div>

            {/* UPLOAD BOX */}
            <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">

                <h3 className="mb-5 text-xl font-semibold text-slate-800">
                    Upload Media
                </h3>

                <form onSubmit={handleUpload}>

                    <div className="rounded-xl border-2 border-dashed border-slate-300 p-8 text-center">

                        {/* FILE INPUT */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            onChange={handleFileChange}
                            accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
                            className="mx-auto block w-full max-w-md cursor-pointer text-sm"
                        />

                        <p className="mt-4 text-sm text-slate-500">
                            Allowed: JPG, PNG, WEBP, GIF and PDF
                        </p>

                        <p className="text-sm text-slate-500">
                            Maximum file size: 5 MB
                        </p>

                        {/* SELECTED FILE */}
                        {selectedFile && (
                            <div className="mt-5 rounded-lg bg-slate-100 p-4">

                                <p className="font-semibold text-slate-800">
                                    Selected File:
                                </p>

                                <p className="mt-1 break-all text-slate-600">
                                    {selectedFile.name}
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    {formatFileSize(selectedFile.size)}
                                </p>
                            </div>
                        )}

                        {/* IMAGE PREVIEW */}
                        {previewUrl && (
                            <div className="mt-5">

                                <p className="mb-2 text-sm font-medium text-slate-600">
                                    Preview
                                </p>

                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="mx-auto h-40 w-40 rounded-lg object-cover"
                                />

                            </div>
                        )}

                        {/* UPLOAD BUTTON */}
                        <button
                            type="submit"
                            disabled={uploading}
                            className="mt-6 rounded-lg bg-slate-800 px-8 py-3 font-medium text-white hover:bg-slate-700 disabled:opacity-50"
                        >
                            {uploading
                                ? "Uploading..."
                                : "Upload File"}
                        </button>

                    </div>

                </form>
            </div>

            {/* MEDIA LIBRARY */}
            <div className="rounded-xl bg-white p-6 shadow-sm">

                <div className="mb-6 flex items-center justify-between">

                    <h3 className="text-xl font-semibold text-slate-800">
                        Media Library
                    </h3>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                        {media.length} files
                    </span>

                </div>

                {loading ? (
                    <p className="text-slate-500">
                        Loading media...
                    </p>
                ) : media.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-slate-300 p-10 text-center">

                        <div className="text-4xl">
                            📁
                        </div>

                        <p className="mt-3 text-slate-500">
                            No media files uploaded yet.
                        </p>

                    </div>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                        {media.map((item) => {

                            const fileUrl = getFileUrl(
                                item.file_path
                            );

                            return (
                                <div
                                    key={item.id}
                                    className="overflow-hidden rounded-xl border border-slate-200"
                                >

                                    {/* PREVIEW */}
                                    <div className="flex h-48 items-center justify-center bg-slate-100">

                                        {isImage(item.file_type) ? (
                                            <img
                                                src={fileUrl}
                                                alt={item.file_name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="text-center">
                                                <div className="text-5xl">
                                                    📄
                                                </div>

                                                <p className="mt-2 text-sm text-slate-500">
                                                    File
                                                </p>
                                            </div>
                                        )}

                                    </div>

                                    {/* DETAILS */}
                                    <div className="p-4">

                                        <h4 className="truncate font-semibold text-slate-800">
                                            {item.file_name}
                                        </h4>

                                        <p className="mt-2 text-sm text-slate-500">
                                            Type: {item.file_type || "Unknown"}
                                        </p>

                                        <p className="text-sm text-slate-500">
                                            Size: {formatFileSize(item.file_size)}
                                        </p>

                                        <div className="mt-4 flex gap-2">

                                            <a
                                                href={fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 rounded-lg bg-slate-100 px-3 py-2 text-center text-sm font-medium"
                                            >
                                                View
                                            </a>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(item.id)
                                                }
                                                className="flex-1 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600"
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </div>

                                </div>
                            );
                        })}

                    </div>
                )}

            </div>

        </div>
    );
}

export default Media;