"use client";

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import { zipSync } from "fflate";

import { AvifToGifToolCardIcon } from "@/components/tools/avif-to-gif/avif-to-gif-card-icon";
import { createRuntimeId } from "@/lib/runtime-id";

const avifToGifAcceptedMimeTypes = ["image/avif"] as const;
const avifToGifMaxUploadBytes = 50 * 1024 * 1024;
const avifToGifMaxUploadMegabytes = Math.floor(
  avifToGifMaxUploadBytes / (1024 * 1024),
);
const avifToGifMaxInputPixels = 60_000_000;
function isAvifToGifMimeType(value: string) {
  return avifToGifAcceptedMimeTypes.includes(
    value as (typeof avifToGifAcceptedMimeTypes)[number],
  );
}

function isAvifFileName(value: string) {
  return /\.avif$/i.test(value);
}

function getAvifToGifDownloadName(value: string) {
  const baseName = value.replace(/.[^.]+$/, "").trim() || "converted-image";
  const safeBaseName = baseName
    .replace(/[^a-z0-9-_]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return `${safeBaseName || "converted-image"}.gif`;
}

const batchLimit = 20;
const queueLimitMessage = `You can convert up to ${batchLimit} AVIF images at a time.`;

type QueueItemStatus = "pending" | "processing" | "done" | "error";

type QueueItem = {
  downloadFileName: string;
  error: string;
  file: File;
  id: string;
  previewUrl: string;
  resultBlob: Blob | null;
  resultUrl: string;
  status: QueueItemStatus;
};

function isValidAvifFile(file: File) {
  return isAvifToGifMimeType(file.type) || isAvifFileName(file.name);
}

function triggerDownload(downloadUrl: string, downloadFileName: string) {
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = downloadFileName;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function getZipDownloadName() {
  return "avif-to-gif-images.zip";
}

function waitForNextFrame() {
  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => resolve());
  });
}

async function readApiErrorMessage(response: Response, fallbackMessage: string) {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    return fallbackMessage;
  }

  try {
    const payload = (await response.json()) as { message?: unknown };

    if (typeof payload.message === "string" && payload.message.trim()) {
      return payload.message;
    }
  } catch {
    return fallbackMessage;
  }

  return fallbackMessage;
}

async function createUniqueZipEntries(items: QueueItem[]) {
  const usedNames = new Map<string, number>();
  const zipEntries: Record<string, Uint8Array> = {};

  for (const item of items) {
    if (!item.resultBlob) {
      continue;
    }

    const duplicateCount = usedNames.get(item.downloadFileName) ?? 0;
    usedNames.set(item.downloadFileName, duplicateCount + 1);

    const entryName =
      duplicateCount === 0
        ? item.downloadFileName
        : `${duplicateCount + 1}-${item.downloadFileName}`;

    zipEntries[entryName] = new Uint8Array(await item.resultBlob.arrayBuffer());
  }

  return zipEntries;
}

export function AvifToGifConverter() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const queueScrollerRef = useRef<HTMLDivElement | null>(null);
  const objectUrlsRef = useRef<Set<string>>(new Set());
  const queueRef = useRef<QueueItem[]>([]);
  const removedItemIdsRef = useRef<Set<string>>(new Set());
  const activeRequestRef = useRef<{
    controller: AbortController;
    itemId: string;
  } | null>(null);

  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [isSavingAll, setIsSavingAll] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const refreshScrollControls = () => {
    const scroller = queueScrollerRef.current;

    if (!scroller) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }

    const maxScrollLeft = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
    const nextScrollLeft = Math.max(0, scroller.scrollLeft);

    setCanScrollLeft(nextScrollLeft > 1);
    setCanScrollRight(maxScrollLeft - nextScrollLeft > 1);
  };

  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  useEffect(() => {
    return () => {
      if (activeRequestRef.current) {
        activeRequestRef.current.controller.abort();
        activeRequestRef.current = null;
      }

      for (const objectUrl of objectUrlsRef.current) {
        URL.revokeObjectURL(objectUrl);
      }

      objectUrlsRef.current.clear();
    };
  }, []);

  useEffect(() => {
    const scroller = queueScrollerRef.current;

    if (!scroller) {
      refreshScrollControls();
      return;
    }

    const animationFrameId = window.requestAnimationFrame(() => {
      refreshScrollControls();
    });

    scroller.addEventListener("scroll", refreshScrollControls, { passive: true });
    window.addEventListener("resize", refreshScrollControls);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      scroller.removeEventListener("scroll", refreshScrollControls);
      window.removeEventListener("resize", refreshScrollControls);
    };
  }, [queue]);

  const registerObjectUrl = (blob: Blob) => {
    const objectUrl = URL.createObjectURL(blob);
    objectUrlsRef.current.add(objectUrl);
    return objectUrl;
  };

  const revokeObjectUrl = (objectUrl: string) => {
    if (!objectUrl) {
      return;
    }

    URL.revokeObjectURL(objectUrl);
    objectUrlsRef.current.delete(objectUrl);
  };

  const resetActiveRequest = () => {
    if (activeRequestRef.current) {
      activeRequestRef.current.controller.abort();
      activeRequestRef.current = null;
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const scrollQueueBy = (direction: "left" | "right") => {
    const scroller = queueScrollerRef.current;

    if (!scroller) {
      return;
    }

    if (direction === "left" && !canScrollLeft) {
      return;
    }

    if (direction === "right" && !canScrollRight) {
      return;
    }

    const amount = Math.max(240, Math.round(scroller.clientWidth * 0.72));

    scroller.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });

    window.requestAnimationFrame(() => {
      refreshScrollControls();
    });
  };

  const clearQueue = () => {
    if (isConverting) {
      return;
    }

    setQueue((current) => {
      for (const item of current) {
        revokeObjectUrl(item.previewUrl);
        revokeObjectUrl(item.resultUrl);
      }

      return [];
    });
    setError("");
    setIsSavingAll(false);
    setCanScrollLeft(false);
    setCanScrollRight(false);
  };

  const appendFiles = (fileList: FileList | File[]) => {
    if (isConverting) {
      return;
    }

    const nextFiles = Array.from(fileList);

    if (nextFiles.length === 0) {
      return;
    }

    setError("");

    setQueue((current) => {
      const availableSlots = Math.max(0, batchLimit - current.length);
      const acceptedItems: QueueItem[] = [];
      const nextErrors: string[] = [];

      for (const file of nextFiles.slice(0, availableSlots)) {
        if (!isValidAvifFile(file)) {
          nextErrors.push(`"${file.name}" is not a valid AVIF image.`);
          continue;
        }

        if (file.size > avifToGifMaxUploadBytes) {
          nextErrors.push(`"${file.name}" is larger than ${avifToGifMaxUploadMegabytes} MB.`);
          continue;
        }

        acceptedItems.push({
          downloadFileName: getAvifToGifDownloadName(file.name),
          error: "",
          file,
          id: createRuntimeId(),
          previewUrl: registerObjectUrl(file),
          resultBlob: null,
          resultUrl: "",
          status: "pending",
        });
      }

      if (nextFiles.length > availableSlots) {
        nextErrors.unshift(queueLimitMessage);
      }

      if (nextErrors.length > 0) {
        setError(nextErrors[0]);
      }

      return [...current, ...acceptedItems];
    });
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      appendFiles(event.target.files);
    }

    event.target.value = "";
  };

  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
      return;
    }

    setIsDragging(false);
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    if (event.dataTransfer.files) {
      appendFiles(event.dataTransfer.files);
    }
  };

  const removeQueueItem = (itemId: string) => {
    if (activeRequestRef.current?.itemId === itemId) {
      resetActiveRequest();
    }

    setQueue((current) => {
      const target = current.find((item) => item.id === itemId);

      if (!target) {
        return current;
      }

      if (isConverting) {
        removedItemIdsRef.current.add(itemId);
      }

      revokeObjectUrl(target.previewUrl);
      revokeObjectUrl(target.resultUrl);

      return current.filter((item) => item.id !== itemId);
    });
    setError("");
  };

  const convertItem = async (item: QueueItem) => {
    const controller = new AbortController();
    activeRequestRef.current = {
      controller,
      itemId: item.id,
    };

    try {
      const formData = new FormData();
      formData.set("file", item.file);

      const response = await fetch("/api/avif-to-gif/", {
        body: formData,
        method: "POST",
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(
          await readApiErrorMessage(
            response,
            "Unable to convert this AVIF image right now.",
          ),
        );
      }

      const convertedBlob = await response.blob();

      if (convertedBlob.size <= 0) {
        throw new Error("The converted GIF file was empty.");
      }

      return convertedBlob;
    } catch (conversionError) {
      if (conversionError instanceof DOMException && conversionError.name === "AbortError") {
        throw new Error("Conversion cancelled.");
      }

      throw conversionError instanceof Error
        ? conversionError
        : new Error("Unable to convert this AVIF image right now.");
    } finally {
      if (activeRequestRef.current?.controller === controller) {
        activeRequestRef.current = null;
      }
    }
  };

  const convertQueue = async () => {
    const itemIdsToConvert = queueRef.current
      .filter((item) => item.status !== "done")
      .map((item) => item.id);

    if (itemIdsToConvert.length === 0) {
      setError("Select at least one AVIF image first.");
      return;
    }

    setError("");
    setIsConverting(true);
    removedItemIdsRef.current.clear();

    try {
      for (const itemId of itemIdsToConvert) {
        if (removedItemIdsRef.current.has(itemId)) {
          continue;
        }

        const item = queueRef.current.find((entry) => entry.id === itemId);

        if (!item || item.status === "done") {
          continue;
        }

        setQueue((current) =>
          current.map((entry) => {
            if (entry.id === itemId) {
              return {
                ...entry,
                error: "",
                status: "processing",
              };
            }

            if (entry.status === "processing") {
              return {
                ...entry,
                status: entry.resultUrl ? "done" : "pending",
              };
            }

            return entry;
          }),
        );

        await waitForNextFrame();

        try {
          const latestItem = queueRef.current.find((entry) => entry.id === itemId);

          if (!latestItem || removedItemIdsRef.current.has(itemId)) {
            continue;
          }

          const convertedBlob = await convertItem(latestItem);
          const nextResultUrl = registerObjectUrl(convertedBlob);

          if (
            removedItemIdsRef.current.has(itemId) ||
            !queueRef.current.some((entry) => entry.id === itemId)
          ) {
            revokeObjectUrl(nextResultUrl);
            continue;
          }

          setQueue((current) =>
            current.map((entry) => {
              if (entry.id !== itemId) {
                return entry;
              }

              if (entry.resultUrl) {
                revokeObjectUrl(entry.resultUrl);
              }

              return {
                ...entry,
                error: "",
                resultBlob: convertedBlob,
                resultUrl: nextResultUrl,
                status: "done",
              };
            }),
          );
        } catch (conversionError) {
          if (
            removedItemIdsRef.current.has(itemId) ||
            !queueRef.current.some((entry) => entry.id === itemId)
          ) {
            continue;
          }

          setQueue((current) =>
            current.map((entry) =>
              entry.id === itemId
                ? {
                    ...entry,
                    error:
                      conversionError instanceof Error
                        ? conversionError.message
                        : "Unable to convert this AVIF image right now.",
                    status: "error",
                  }
                : entry,
            ),
          );
        }
      }
    } catch {
      setError("Unable to finish this AVIF to GIF batch right now.");
    } finally {
      removedItemIdsRef.current.clear();
      setQueue((current) =>
        current.map((entry) =>
          entry.status === "processing"
            ? {
                ...entry,
                status: entry.resultUrl ? "done" : "pending",
              }
            : entry,
        ),
      );
      setIsConverting(false);
    }
  };

  const saveAll = async () => {
    const convertedItems = queue.filter((item) => item.resultUrl && item.resultBlob);

    if (convertedItems.length === 0 || isSavingAll) {
      return;
    }

    setIsSavingAll(true);

    try {
      const zipEntries = await createUniqueZipEntries(convertedItems);
      const zipBytes = zipSync(zipEntries, { level: 0 });
      const zipUrl = registerObjectUrl(new Blob([zipBytes], { type: "application/zip" }));

      try {
        triggerDownload(zipUrl, getZipDownloadName());
      } finally {
        revokeObjectUrl(zipUrl);
      }
    } finally {
      setIsSavingAll(false);
    }
  };

  const outstandingCount = queue.filter((item) => item.status !== "done").length;
  const convertedCount = queue.filter((item) => item.status === "done").length;
  const allItemsProcessed =
    queue.length > 0 &&
    queue.every((item) => item.status === "done" || item.status === "error");
  const hasQueue = queue.length > 0;
  const canConvert = outstandingCount > 0 && !isConverting;
  const canSaveAll =
    convertedCount > 0 && allItemsProcessed && !isConverting && !isSavingAll;
  const isUploadDisabled = isConverting || queue.length >= batchLimit;
  const isClearDisabled = !hasQueue || isConverting;

  return (
    <section className="rounded-ui border border-brand bg-white">
      <div className="space-y-4 px-3 py-3 sm:px-4 sm:py-4">
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={openFilePicker}
            disabled={isUploadDisabled}
            className="btn-primary h-9 min-w-44 gap-2 px-5"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
            >
              <rect width="24" height="24" fill="none" />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM11 16C11 16.5523 11.4477 17 12 17C12.5523 17 13 16.5523 13 16L13 10.4142L14.2929 11.7071C14.6834 12.0976 15.3166 12.0976 15.7071 11.7071C16.0976 11.3166 16.0976 10.6834 15.7071 10.2929L12.7941 7.37993C12.7791 7.36486 12.7637 7.35031 12.748 7.33627C12.5648 7.12998 12.2976 7 12 7C11.7024 7 11.4352 7.12998 11.252 7.33627C11.2363 7.3503 11.2209 7.36486 11.2059 7.37993L8.29289 10.2929C7.90237 10.6834 7.90237 11.3166 8.29289 11.7071C8.68342 12.0976 9.31658 12.0976 9.70711 11.7071L11 10.4142L11 16Z"
                fill="currentColor"
              />
            </svg>
            Upload Images
          </button>

          <button
            type="button"
            onClick={clearQueue}
            disabled={isClearDisabled}
            className="btn-primary h-9 min-w-44 gap-2 px-5"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
            >
              <path
                d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM15.36 14.3C15.65 14.59 15.65 15.07 15.36 15.36C15.21 15.51 15.02 15.58 14.83 15.58C14.64 15.58 14.45 15.51 14.3 15.36L12 13.06L9.7 15.36C9.55 15.51 9.36 15.58 9.17 15.58C8.98 15.58 8.79 15.51 8.64 15.36C8.35 15.07 8.35 14.59 8.64 14.3L10.94 12L8.64 9.7C8.35 9.41 8.35 8.93 8.64 8.64C8.93 8.35 9.41 8.35 9.7 8.64L12 10.94L14.3 8.64C14.59 8.35 15.07 8.35 15.36 8.64C15.65 8.93 15.65 9.41 15.36 9.7L13.06 12L15.36 14.3Z"
                fill="currentColor"
              />
            </svg>
            Clear
          </button>
        </div>

        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`group rounded-ui border-2 border-dashed transition-colors ${
            isDragging
              ? "border-[#57CC02] bg-[#57CC02]/10"
              : hasQueue
                ? "border-brand/55 bg-white"
                : "border-brand/55 bg-white hover:border-[#57CC02] hover:bg-[var(--upload-drop-hover-bg)]"
          }`}
        >
          {!hasQueue ? (
            <div className="flex min-h-[18rem] flex-col items-center justify-center gap-4 px-5 py-8 text-center sm:px-6 lg:px-8">
              <div className="text-brand">
                <AvifToGifToolCardIcon disableGroupHover />
              </div>

              <div className="max-w-2xl space-y-2">
                <h2 className="font-headline text-sm font-black uppercase tracking-[0.16em] text-black sm:text-base">
                  Drop Up To 20 AVIF Files
                </h2>

                <div className="space-y-1 font-body text-sm leading-6 text-black/65 sm:text-[14px]">
                  <p>Upload up to 20 AVIF files per batch.</p>
                  <p>We do not store your images on our servers.</p>
                  <p>AVIF is efficient for the web, but many apps still prefer more familiar formats.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 p-4 sm:p-5">
              <div className="grid grid-cols-[auto,minmax(0,1fr),auto] items-center gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => scrollQueueBy("left")}
                  disabled={!canScrollLeft}
                  className="search-close-button static !h-12 !w-12 !translate-y-0 shrink-0 !rounded-full !bg-[#272727] !text-white shadow-soft hover:!bg-[#57cc02] hover:!text-white disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:!bg-[#272727] disabled:hover:!text-white"
                  aria-label="Show previous images"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-8 w-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 19.5 8.25 12l7.5-7.5"
                    />
                  </svg>
                </button>

                <div
                  ref={queueScrollerRef}
                  className="flex min-w-0 flex-1 snap-x snap-mandatory gap-3 overflow-x-auto py-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  {queue.map((item, index) => {
                    const isProcessing = item.status === "processing";
                    const isDone = item.status === "done";
                    const isError = item.status === "error";

                    return (
                      <article
                        key={item.id}
                        className="w-[168px] min-w-[168px] flex-none snap-start overflow-hidden rounded-ui border border-black/10 bg-white"
                      >
                        <div
                          className="relative aspect-square overflow-hidden"
                          style={{
                            backgroundImage:
                              "linear-gradient(45deg, #d4d4d4 25%, transparent 25%, transparent 75%, #d4d4d4 75%, #d4d4d4 100%), linear-gradient(45deg, #d4d4d4 25%, #f1f1f1 25%, #f1f1f1 75%, #d4d4d4 75%, #d4d4d4 100%)",
                            backgroundPosition: "0 0, 12px 12px",
                            backgroundSize: "24px 24px",
                          }}
                        >
                          <div className="pointer-events-none absolute left-2 top-2 z-10 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#272727] font-headline text-xs font-black text-white transition-colors">
                            {index + 1}
                          </div>

                          <img
                            src={item.previewUrl}
                            alt={item.file.name}
                            className="h-full w-full object-contain"
                            onLoad={refreshScrollControls}
                          />

                          {!isProcessing ? (
                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                              <span className="ui-badge rounded-ui bg-brand/85 px-2 py-0.5 font-headline text-[0.78rem] font-black uppercase tracking-[0.08em] text-white shadow-soft transition-colors sm:text-[0.85rem]">
                                {isDone ? "GIF" : "AVIF"}
                              </span>
                            </div>
                          ) : null}

                          <button
                            type="button"
                            onClick={() => removeQueueItem(item.id)}
                            className="search-close-button !right-2 !top-2 !z-20 !h-7 !w-7 !translate-y-0 !rounded-full !bg-[#272727] !text-white hover:!bg-[#57cc02] hover:!text-white"
                            aria-label={`Remove ${item.file.name}`}
                          >
                            <svg
                              aria-hidden="true"
                              viewBox="0 0 24 24"
                              className="h-4 w-4"
                              fill="none"
                            >
                              <path
                                d="M6 6 18 18M18 6 6 18"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                              />
                            </svg>
                          </button>

                          {isProcessing ? (
                            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/45 p-4 text-center text-white">
                              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                              <span className="ui-badge rounded-ui bg-brand px-2 py-0.5 font-headline text-[0.78rem] font-black uppercase tracking-[0.08em] text-white shadow-soft sm:text-[0.85rem]">
                                Processing
                              </span>
                            </div>
                          ) : null}
                        </div>

                        <div className="space-y-2.5 p-2.5">
                          <div className="text-center font-body text-[11px] font-bold text-black sm:text-xs">
                            <span className="block truncate">{item.file.name}</span>
                          </div>

                          {isDone ? (
                            <button
                              type="button"
                              onClick={() => triggerDownload(item.resultUrl, item.downloadFileName)}
                              className="button-accent h-8 w-full px-3 text-xs"
                            >
                              Save GIF
                            </button>
                          ) : null}

                          {isError ? (
                            <div className="ui-alert ui-alert-error font-body text-sm">
                              {item.error}
                            </div>
                          ) : null}
                        </div>
                      </article>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => scrollQueueBy("right")}
                  disabled={!canScrollRight}
                  className="search-close-button static !h-12 !w-12 !translate-y-0 shrink-0 !rounded-full !bg-[#272727] !text-white shadow-soft hover:!bg-[#57cc02] hover:!text-white disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:!bg-[#272727] disabled:hover:!text-white"
                  aria-label="Show more images"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-8 w-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m8.25 4.5 7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/avif,.avif"
            multiple
            onChange={onInputChange}
            className="sr-only"
          />
        </div>

        {hasQueue ? (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
              <div className="group relative inline-flex">
                <button
                  type="button"
                  onClick={convertQueue}
                  disabled={!canConvert}
                  className="btn-primary h-9 min-w-44 gap-2 px-5"
                >
                  {isConverting ? "Converting..." : "Convert to GIF"}
                </button>

                {outstandingCount > 0 ? (
                  <span className="absolute -right-2 -top-2 inline-flex h-7 min-w-7 items-center justify-center rounded-full border-2 border-white bg-[#272727] px-2 font-headline text-xs font-black text-white shadow-soft transition-colors group-hover:bg-[#57cc02]">
                    {outstandingCount}
                  </span>
                ) : null}
              </div>

              <div className="group relative inline-flex">
                <button
                  type="button"
                  onClick={saveAll}
                  disabled={!canSaveAll}
                  className="button-accent h-9 min-w-44 gap-2 px-5"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                  >
                    <rect width="24" height="24" fill="none" />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM13 8C13 7.4477 12.5523 7 12 7C11.4477 7 11 7.4477 11 8V13.5858L9.70711 12.2929C9.31658 11.9024 8.68342 11.9024 8.29289 12.2929C7.90237 12.6834 7.90237 13.3166 8.29289 13.7071L11.2059 16.6201C11.2209 16.6351 11.2363 16.6497 11.252 16.6637C11.4352 16.87 11.7024 17 12 17C12.2976 17 12.5648 16.87 12.748 16.6637C12.7637 16.6497 12.7791 16.6351 12.7941 16.6201L15.7071 13.7071C16.0976 13.3166 16.0976 12.6834 15.7071 12.2929C15.3166 11.9024 14.6834 11.9024 14.2929 12.2929L13 13.5858V8Z"
                      fill="currentColor"
                    />
                  </svg>
                  {isSavingAll ? "Saving..." : "Save All"}
                </button>

                {convertedCount > 0 ? (
                  <span className="absolute -right-2 -top-2 inline-flex h-7 min-w-7 items-center justify-center rounded-full border-2 border-white bg-[var(--button-accent)] px-2 font-headline text-xs font-black text-[var(--button-accent-text)] shadow-soft transition-colors group-hover:bg-[var(--button-accent-hover)] group-hover:text-[var(--button-accent-hover-text)]">
                    {convertedCount}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        {error ? (
          error === queueLimitMessage ? (
            <div className="ui-alert ui-alert-error font-body text-sm">
              <p className="font-bold">{queueLimitMessage}</p>
              <div className="mt-2 border-t border-red-300/80 pt-2">
                <p>
                  <span className="font-semibold">Batch Processing:</span> If
                  you have more than 20 AVIF files, save this batch first, click
                  CLEAR, and start the next batch. You can run as many batches
                  as you need.
                </p>
              </div>
            </div>
          ) : (
            <div className="ui-alert ui-alert-error font-body text-sm">{error}</div>
          )
        ) : null}
      </div>
    </section>
  );
}
