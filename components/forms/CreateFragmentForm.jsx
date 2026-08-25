"use client";

import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

import { useEffect, useState } from "react";
import addFragment from "@/app/actions/addFragment";

const CreateFragmentForm = () => {
  const { data: session, status } = useSession();
  const myId = session?.user?.id;

  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState("");

  // Clean up object URL to avoid memory leaks
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <form action={addFragment} className="w-full max-w-5xl mx-auto px-4">
      <h1 className="text-center text-3xl font-bold mt-10 mb-10">
        Create Fragment
      </h1>

      {/* Responsive layout wrapper */}
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
        {/* LEFT: Image picker */}
        <div className="w-full lg:w-5/12">
          {/* cap picker size on mobile, center it horizontally */}
          <div className="w-full max-w-85 mx-auto lg:max-w-none">
            <label className="block font-bold mb-2">Image</label>

            <input
              type="file"
              id="imageFile"
              name="imageFile"
              accept="image/*"
              className="hidden"
              required
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                if (preview) URL.revokeObjectURL(preview);
                setPreview(URL.createObjectURL(file));
                setFileName(file.name);
              }}
            />

            <label
              htmlFor="imageFile"
              className="group relative cursor-pointer flex items-center justify-center aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-[#722F37] transition overflow-hidden bg-[#F9F9F7]"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Selected preview"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="px-4 text-center">
                  <div className=" font-semibold">Click to upload</div>
                  <div className="text-xs  mt-1">PNG, JPG, WEBP, etc.</div>
                </div>
              )}

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />

              <div className="pointer-events-none absolute bottom-3 left-3 right-3 text-white text-xs opacity-0 group-hover:opacity-100 transition">
                {preview ? "Change image" : "Choose an image"}
              </div>
            </label>

            {fileName ? (
              <p className="mt-2 text-xs text-gray-500 wrap-break-words">
                Selected: {fileName}
              </p>
            ) : null}
          </div>
        </div>

        {/* RIGHT: Rest of form */}
        <div className="w-full lg:w-7/12">
          {/* name */}
          <div className="mb-4">
            <label htmlFor="name" className="block font-bold mb-2">
              Name
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
              focus:border-[#722F37]
              focus:ring-1 focus:ring-[#722F37]
              transition
            "
              placeholder="eg. Sunset Over Burrard Inlet"
              required
            />
          </div>

          {/* tags */}
          <div className="mb-4">
            <label htmlFor="tags" className="block font-bold mb-2">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              className="
              border border-gray-300
              rounded-xl
              w-full
              py-2 px-3
              outline-none
              focus:border-[#722F37]
              focus:ring-1 focus:ring-[#722F37]
              transition
            "
              placeholder="eg. street, neon, night, film"
            />
            <p className="text-xs mt-1">Use commas to separate tags.</p>
          </div>

          {/* description */}
          <div className="mb-4">
            <label htmlFor="description" className="block font-bold mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="
              border border-gray-300
              rounded-xl
              w-full
              py-2 px-3
              outline-none
              focus:border-[#722F37]
              focus:ring-1 focus:ring-[#722F37]
              transition
            "
              rows="4"
              placeholder="Optional description"
            />
          </div>

          {/* Submit button */}
          {/* A semi-hacky way to prevent unauthorized fragment creation, but still works */}
          <div className="mt-6">
            {myId ? (
              <button
                className="
              bg-[#722F37]
              hover:bg-[#5E2530]
              text-white
                font-bold
                py-3 px-4
                rounded-full
                w-full
                transition"
                type="submit"
              >
                Create Fragment
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  toast.error("You must be signed in to create a fragment")
                }
                className="
            bg-[#722F37]/50
            text-white
            font-bold
            py-3 px-4
            rounded-full
            w-full
            cursor-not-allowed
          "
              >
                Sign in to create a fragment
              </button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreateFragmentForm;
