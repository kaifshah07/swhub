"use client";

import { useState } from "react";

export default function ProductTabs() {
  const [active, setActive] =
    useState("description");

  return (
    <section className="mt-16">

      <div className="flex gap-4 border-b">

        <button
          onClick={() =>
            setActive("description")
          }
          className={`pb-3 font-medium ${
            active === "description"
              ? "border-b-2 border-red-200 text-red-600"
              : ""
          }`}
        >
          Description
        </button>

        <button
          onClick={() => setActive("details")}
          className={`pb-3 font-medium ${
            active === "details"
              ? "border-b-2 border-red-200 text-red-600"
              : ""
          }`}
        >
          Details
        </button>

      </div>

      <div className="mt-6 rounded-2xl bg-white p-6">

        {active === "description" && (
          <p>
            Premium quality groceries and essentials made
            with soft cotton fabric for maximum
            comfort and style.
          </p>
        )}

        {active === "details" && (
          <ul className="space-y-2">
            <li>Material: Cotton</li>
            <li>Age: 2-6 Years</li>
            <li>Color: Multi</li>
            <li>Wash Care: Machine Wash</li>
          </ul>
        )}

      </div>
    </section>
  );
}