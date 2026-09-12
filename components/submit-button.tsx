"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  idle,
  pending,
  className = "button button-primary",
}: {
  idle: string;
  pending: string;
  className?: string;
}) {
  const { pending: isPending } = useFormStatus();
  return (
    <button className={className} type="submit" disabled={isPending}>
      {isPending ? pending : idle}
    </button>
  );
}
