import { useState } from "react";
import API from "@/api/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";

const fields = [
  { name: "companyName", label: "Company Name", max: 150, required: true },
  { name: "category", label: "Category", max: 100, required: true },
  { name: "contactEmail", label: "Public Contact Email", max: 254, type: "email" },
  { name: "phone", label: "Public Phone Number", max: 30, type: "tel" },
  { name: "website", label: "Website", max: 300, type: "url" },
];

export default function ExhibitorProfileForm({
  profile,
  onSaved,
  onCancel,
}) {
  const [form, setForm] = useState({
    companyName: profile.companyName || "",
    category: profile.category || "",
    description: profile.description || "",
    products: profile.products || "",
    contactEmail: profile.contactEmail || "",
    phone: profile.phone || "",
    website: profile.website || "",
  });

  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (saving) return;

    if (
      !form.companyName.trim() ||
      !form.category.trim() ||
      !form.description.trim()
    ) {
      toast.error("Fill in company name, category and description.");
      return;
    }

    setSaving(true);

    try {
      const response = await API.put(
        `/exhibitors/profile/${profile._id}`,
        form
      );

      toast.success(response.data.msg);
      await onSaved();
    } catch (error) {
      toast.error(
        error.response?.data?.msg || "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t pt-4">
      <fieldset disabled={saving} className="space-y-4">
        <h3 className="font-semibold">Edit Company Profile</h3>

        {fields.map((field) => (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={`profile-${profile._id}-${field.name}`}>
              {field.label}
            </Label>
            <Input
              id={`profile-${profile._id}-${field.name}`}
              name={field.name}
              type={field.type || "text"}
              value={form[field.name]}
              onChange={handleChange}
              maxLength={field.max}
              required={field.required}
              placeholder={
                field.name === "website" ? "https://example.com" : ""
              }
            />
          </div>
        ))}

        <div className="space-y-2">
          <Label htmlFor={`description-${profile._id}`}>
            Company Description
          </Label>
          <textarea
            id={`description-${profile._id}`}
            name="description"
            value={form.description}
            onChange={handleChange}
            maxLength={2000}
            rows={4}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`products-${profile._id}`}>
            Products / Services
          </Label>
          <textarea
            id={`products-${profile._id}`}
            name="products"
            value={form.products}
            onChange={handleChange}
            maxLength={2000}
            rows={3}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>

        <p className="text-sm text-muted-foreground">
          Contact fields are optional. Any contact details you enter
          will be visible on your approved public profile.
        </p>

        <div className="flex gap-3">
          <Button type="submit">
            {saving ? "Saving..." : "Save Profile"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </fieldset>
    </form>
  );
}