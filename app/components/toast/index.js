let subscribers = [];
let count = 0;

function dispatch(event) {
  subscribers.forEach((fn) => fn(event));
}

export function subscribe(fn) {
  subscribers.push(fn);
  return () => {
    subscribers = subscribers.filter((s) => s !== fn);
  };
}

function create(message, options = {}) {
  return {
    id: `toast-${++count}`,
    message,
    type: options.type ?? "default",
    duration: options.duration ?? 4000,
  };
}

export function toast(message, options) {
  const t = create(message, options);
  dispatch({ type: "ADD", toast: t });
  return t.id;
}

toast.success = (message, options) =>
  toast(message, { ...options, type: "success" });

toast.error = (message, options) =>
  toast(message, { ...options, type: "error" });

toast.dismiss = (id) => dispatch({ type: "DISMISS", id });
