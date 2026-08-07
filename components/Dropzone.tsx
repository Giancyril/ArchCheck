/**
 * components/Dropzone.tsx
 * Drag-and-drop file upload area with preview, error states, and file validation.
 */
"use client";

import React, { useState, useCallback } from "react";
import { useDropzone, FileRejection } from "react-dropzone";

interface DropzoneProps {
  onImageSelected: (base64Image: string) => void;
  onClear: () => void;
  disabled?: boolean;
  maxSizeBytes?: number;
}

const MAX_BYTES_DEFAULT = 10 * 1024 * 1024; // 10MB

export default function Dropzone({
  onImageSelected,
  onClear,
  disabled = false,
  maxSizeBytes = MAX_BYTES_DEFAULT,
}: DropzoneProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const processFile = useCallback(
    (file: File) => {
      setErrorMessage(null);

      if (file.size > maxSizeBytes) {
        setErrorMessage(
          `File size exceeds ${(maxSizeBytes / (1024 * 1024)).toFixed(0)}MB limit.`
        );
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        setFileName(file.name);
        setFileSize(file.size);
        onImageSelected(base64);
      };
      reader.onerror = () => {
        setErrorMessage("Failed to read image file.");
      };
      reader.readAsDataURL(file);
    },
    [maxSizeBytes, onImageSelected]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        const rej = fileRejections[0];
        if (rej.errors[0]?.code === "file-too-large") {
          setErrorMessage(
            `File is too large. Max size is ${(maxSizeBytes / (1024 * 1024)).toFixed(0)}MB.`
          );
        } else if (rej.errors[0]?.code === "file-invalid-type") {
          setErrorMessage("Invalid file type. Please upload PNG, JPG, WebP, or GIF.");
        } else {
          setErrorMessage(rej.errors[0]?.message || "File upload error.");
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        processFile(acceptedFiles[0]);
      }
    },
    [maxSizeBytes, processFile]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "image/png": [".png"],
        "image/jpeg": [".jpg", ".jpeg"],
        "image/webp": [".webp"],
        "image/gif": [".gif"],
      },
      maxSize: maxSizeBytes,
      multiple: false,
      disabled,
    });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setFileName(null);
    setFileSize(null);
    setErrorMessage(null);
    onClear();
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="w-full">
      {!preview ? (
        <div
          {...getRootProps()}
          className={`
            relative group cursor-pointer rounded-xl border-2 border-dashed p-8 text-center
            transition-all duration-200 ease-in-out
            ${
              isDragActive
                ? "border-[var(--accent)] bg-[var(--accent-dim)]/30 scale-[1.01]"
                : isDragReject
                ? "border-[var(--critical)] bg-[var(--critical-bg)]/30"
                : "border-[var(--border)] hover:border-[var(--accent)] bg-[var(--surface)] hover:bg-[var(--surface-2)]"
            }
            ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}
          `}
        >
          <input {...getInputProps()} />

          <div className="flex flex-col items-center justify-center gap-3">
            {/* Upload Icon */}
            <div className="w-14 h-14 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-200">
              {isDragActive ? "📥" : "📐"}
            </div>

            <div className="space-y-1">
              <p className="text-sm font-semibold text-[var(--text-1)]">
                {isDragActive ? (
                  <span className="text-[var(--accent-hi)]">Drop your architecture diagram here</span>
                ) : (
                  <>
                    Drag & drop diagram image, or{" "}
                    <span className="text-[var(--accent)] underline underline-offset-2">browse files</span>
                  </>
                )}
              </p>
              <p className="text-xs text-[var(--text-2)]">
                Supports clean exports (draw.io, Lucidchart) & hand-drawn sketches (PNG, JPG, WebP up to 10MB)
              </p>
            </div>

            {/* Supported format badges */}
            <div className="flex gap-2 pt-2">
              {["PNG", "JPG", "WebP", "Hand-drawn"].map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[var(--surface-2)] text-[var(--text-2)] border border-[var(--border)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Image Preview Box */
        <div className="relative rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <div className="flex items-center gap-4">
            {/* Thumbnail */}
            <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-[var(--border)] bg-black/40 flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Architecture Diagram Preview"
                className="w-full h-full object-contain p-1"
              />
            </div>

            {/* File Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded bg-[var(--accent-dim)] text-[var(--accent-hi)] font-mono font-semibold">
                  Diagram Ready
                </span>
                {fileSize && (
                  <span className="text-xs text-[var(--text-3)] font-mono">
                    {formatSize(fileSize)}
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-[var(--text-1)] truncate mt-1">
                {fileName}
              </p>
              <p className="text-xs text-[var(--text-2)] mt-0.5">
                Ready for AI System Design Analysis
              </p>
            </div>

            {/* Change File Button */}
            {!disabled && (
              <button
                type="button"
                onClick={handleRemove}
                className="px-3 py-1.5 rounded-lg border border-[var(--border)] hover:border-[var(--critical)] text-xs text-[var(--text-2)] hover:text-[var(--critical)] transition-colors"
              >
                Change Image
              </button>
            )}
          </div>
        </div>
      )}

      {/* Error message */}
      {errorMessage && (
        <div className="mt-2 text-xs text-[var(--critical)] flex items-center gap-1.5 px-1 animate-fade-in">
          <span>⚠️</span>
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
