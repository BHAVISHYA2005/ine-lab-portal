export default function Input({ label, id, error, ...props }) {
  return <label className="field" htmlFor={id}>
    <span className="field-label">{label}</span>
    <input id={id} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} {...props} />
    {error && <span className="field-error" id={`${id}-error`}>{error}</span>}
  </label>;
}
