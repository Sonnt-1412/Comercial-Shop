"use client";

import { useState } from "react";

export function ProductSpecFields({
  specs,
}: {
  specs: { label: string; value: string }[];
}) {
  const [rows, setRows] = useState(() =>
    specs.map((spec, index) => ({ ...spec, id: String(index) })),
  );
  return (
    <div className="admin-specs">
      <h3>Thông số kỹ thuật</h3>
      {rows.map((row, index) => (
        <div className="admin-spec-row" key={row.id}>
          <label>
            Tên thông số {index + 1}
            <input
              name="specLabel"
              value={row.label}
              maxLength={80}
              onChange={(event) =>
                setRows(
                  rows.map((item) =>
                    item.id === row.id
                      ? { ...item, label: event.target.value }
                      : item,
                  ),
                )
              }
            />
          </label>
          <label>
            Giá trị {index + 1}
            <input
              name="specValue"
              value={row.value}
              maxLength={200}
              onChange={(event) =>
                setRows(
                  rows.map((item) =>
                    item.id === row.id
                      ? { ...item, value: event.target.value }
                      : item,
                  ),
                )
              }
            />
          </label>
          <button
            className="danger-link"
            type="button"
            aria-label={`Xóa thông số ${index + 1}`}
            onClick={() => setRows(rows.filter((item) => item.id !== row.id))}
          >
            Xóa
          </button>
        </div>
      ))}
      <button
        className="text-link"
        type="button"
        disabled={rows.length >= 30}
        onClick={() =>
          setRows([...rows, { id: crypto.randomUUID(), label: "", value: "" }])
        }
      >
        + Thêm thông số
      </button>
    </div>
  );
}
