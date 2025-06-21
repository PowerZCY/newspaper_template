"use client";
import React, { useState } from "react";
import { AdsAlertDialog } from "@/components/ads-alert-dialog";

export default function TestDialogPage() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <button
        className="px-6 py-3 rounded-lg bg-purple-500 text-white font-bold text-lg shadow hover:bg-purple-600 transition mb-8"
        onClick={() => setOpen(true)}
      >
        Open Ads
      </button>
      <AdsAlertDialog
        open={open}
        onOpenChange={setOpen}
        title="Download message"
        description="Please refresh page or switch template and try again!"
        // imgSrc="/default.webp"
        // imgHref="https://github.com/PowerZCY/formato"
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirm={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      />
    </div>
  );
}
