"use client";

import { useEffect, useState } from "react";

import {
  getHomepageSections,
  updateHomepageSection,
} from "@/app/admin/services/api/homepageSections";

export default function HomepageSectionEditor({
  sectionKey,
  title,
}) {
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    bannerImage: "",
    redirectUrl: "",
    isActive: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const sections =
      await getHomepageSections();

    const section = sections.find(
      (s) => s.key === sectionKey
    );

    if (section) {
      setForm(section);
    }
  };

  const handleSave = async () => {
    await updateHomepageSection(
      sectionKey,
      form
    );

    alert("Saved");
  };

  return (
    <div className="max-w-3xl">

      <h1 className="text-3xl font-bold mb-6">
        {title}
      </h1>

      <div className="space-y-4">

        <input
          className="border p-3 w-full"
          placeholder="Title"
          value={form.title || ""}
          onChange={(e) =>
            setForm({
              ...form,
              title: e.target.value,
            })
          }
        />

        <input
          className="border p-3 w-full"
          placeholder="Subtitle"
          value={form.subtitle || ""}
          onChange={(e) =>
            setForm({
              ...form,
              subtitle: e.target.value,
            })
          }
        />

        <input
          className="border p-3 w-full"
          placeholder="Banner Image URL"
          value={form.bannerImage || ""}
          onChange={(e) =>
            setForm({
              ...form,
              bannerImage:
                e.target.value,
            })
          }
        />

        <input
          className="border p-3 w-full"
          placeholder="Redirect URL"
          value={form.redirectUrl || ""}
          onChange={(e) =>
            setForm({
              ...form,
              redirectUrl:
                e.target.value,
            })
          }
        />

        <label className="flex gap-2">

          <input
            type="checkbox"
            checked={
              form.isActive ?? true
            }
            onChange={(e) =>
              setForm({
                ...form,
                isActive:
                  e.target.checked,
              })
            }
          />

          Active

        </label>

        <button
          onClick={handleSave}
          className="bg-orange-500 text-white px-6 py-3 rounded-lg"
        >
          Save Section
        </button>

      </div>

    </div>
  );
}