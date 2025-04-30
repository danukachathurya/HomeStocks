import { Button, TextInput, Alert, Label, Select } from "flowbite-react";
import { useState } from "react";
import ShowLocation from "../components/ShowLocation";
import { useNavigate } from "react-router-dom";

export default function DisposalItem() {
  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    itemCode: "",
    location: "", 
  });

  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!formData.itemName || !formData.category || !formData.itemCode || !formData.location) {
      return "All fields are required.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setSubmitError(error);
      setSubmitSuccess(null);
      return;
    }

    try {
      const res = await fetch("/api/disposal/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.message || "Server error.");
        setSubmitSuccess(null);
        return;
      }

      setSubmitSuccess("Disposal item added successfully.");
      setFormData({ itemName: "", category: "", itemCode: "", location: "" });
      setSelectedLocationId(null);
      setSubmitError(null);
    } catch (err) {
      setSubmitError("Error submitting form.");
      setSubmitSuccess(null);
    }
  };

  const handleLocationSelect = (locationObj) => {
    setFormData((prev) => ({ ...prev, location: locationObj.name }));
    setSelectedLocationId(locationObj.id);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-6 text-center">Add Disposal Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label value="Item Name" />
          <TextInput
            value={formData.itemName}
            onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
            required
          />
        </div>

        <div>
          <Label value="Category" />
          <Select
            value={formData.category}
            onChange={(e) => {
              setFormData({ ...formData, category: e.target.value });
              setSelectedLocationId(null);
            }}
          >
            <option value="">Select Category</option>
            <option>Pet Food</option>
            <option>Fertilizer</option>
            <option>Animal Farm</option>
          </Select>
        </div>

        <div>
          <Label value="Item Code" />
          <TextInput
            value={formData.itemCode}
            onChange={(e) => setFormData({ ...formData, itemCode: e.target.value })}
            required
          />
        </div>

        {formData.category && (
          <ShowLocation
            category={formData.category}
            onLocationSelect={handleLocationSelect}
            selectedLocationId={selectedLocationId}
          />
        )}

        {submitError && <Alert color="failure">{submitError}</Alert>}
        {submitSuccess && <Alert color="success">{submitSuccess}</Alert>}

        <Button type="submit" className="block mx-auto">Dispose</Button>
      </form>
      <Button
        className="block mx-auto mt-2"
        onClick={() => navigate("/show-dispose")}
      >
        Show Dispose Items
      </Button>
    </div>
  );
}
