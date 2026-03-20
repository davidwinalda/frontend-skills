"use client";

import { toast } from "./toast/index";

export default function ToastDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        className="toast-demo-btn"
        onClick={() => toast("Your changes have been saved.")}
      >
        Default
      </button>
      <button
        className="toast-demo-btn toast-demo-btn--success"
        onClick={() => toast.success("Deployment successful.")}
      >
        Success
      </button>
      <button
        className="toast-demo-btn toast-demo-btn--error"
        onClick={() => toast.error("Something went wrong.")}
      >
        Error
      </button>
    </div>
  );
}
