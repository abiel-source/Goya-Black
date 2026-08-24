"use client";

import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

import { useState } from "react";
import addEmptyCrystal from "@/app/actions/addEmptyCrystal";

const CreateCrystalForm = () => {
  const { data: session, status } = useSession();
  const myId = session?.user?.id;

  const [isPrivate, setIsPrivate] = useState(false);

  return (
    <form action={addEmptyCrystal} className="max-w-md mx-auto">
      <h1 className="text-center text-3xl font-bold mt-10 mb-10">
        Create Crystal
      </h1>

      {/* Metadata */}
      <div className="flex flex-col gap-4">
        {/* Name */}
        <div>
          <label className="block text-[#111111] font-bold mb-2">
            Crystal Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="
              border border-gray-300
              rounded-xl
              w-full
              py-2 px-3
              outline-none
              focus:border-[#2D6A4F]
              focus:ring-1 focus:ring-[#2D6A4F]
              transition
            "
            placeholder="eg. Neon Nights in Vancouver"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-[#111111] font-bold mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="4"
            className="
              border border-gray-300
              rounded-xl
              w-full
              py-2 px-3
              outline-none
              focus:border-[#2D6A4F]
              focus:ring-1 focus:ring-[#2D6A4F]
              transition
              resize-none
            "
            placeholder="album description"
          />
        </div>

        {/* Private Toggle */}
        <div className="flex items-center justify-between border border-gray-300 rounded-xl px-4 py-3">
          <div>
            <div className="font-semibold text-gray-800">Private Crystal</div>
            <div className="text-xs text-gray-500">
              Only you can see this crystal
            </div>
          </div>

          {/* Toggle */}
          <button
            type="button"
            onClick={() => setIsPrivate(!isPrivate)}
            className={`
              relative inline-flex h-6 w-11 items-center rounded-full
              transition-colors duration-200
              ${isPrivate ? "bg-[#2D6A4F]" : "bg-gray-300"}
            `}
          >
            <span
              className={`
                inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200
                ${isPrivate ? "translate-x-6" : "translate-x-1"}
              `}
            />
          </button>

          {/* Hidden input so form submission includes value */}
          <input
            type="hidden"
            name="isPrivate"
            value={isPrivate ? "true" : "false"}
          />
        </div>
      </div>

      {/* Submit */}
      {/* A semi-hacky way to prevent unauthorized crystal creation, but still works */}
      <div className="mt-6">
        {myId ? (
          <button
            type="submit"
            className="
              bg-[#2D6A4F]
              hover:bg-[#235C43]
              text-white
              font-bold
              py-3 px-4
              rounded-full
              w-full
              transition
            "
          >
            Create Crystal
          </button>
        ) : (
          <button
            type="button"
            onClick={() =>
              toast.error("You must be signed in to create a crystal")
            }
            className="
        bg-[#2D6A4F]/50
        text-white
        font-bold
        py-3 px-4
        rounded-full
        w-full
        cursor-not-allowed
      "
          >
            Sign in to create a crystal
          </button>
        )}
      </div>
    </form>
  );
};

export default CreateCrystalForm;
