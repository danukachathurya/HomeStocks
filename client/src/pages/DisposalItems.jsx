import { Button, TextInput, Alert, Label, Select } from "flowbite-react";
import { useState, useEffect, useRef } from "react";
import ShowLocation from "../components/ShowLocation";
import { useNavigate } from "react-router-dom";

export default function DisposalItem() {
  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    itemCode: "",
    location: "",
  });
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const suggestionsRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Enhanced search function with better error handling
  const searchProducts = async (query) => {
    try {
      const res = await fetch(
        `/api/product/search?query=${encodeURIComponent(query)}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) throw new Error("Search failed");
      return await res.json();
    } catch (error) {
      console.error("Search error:", error);
      setSubmitError("Failed to load suggestions");
      return [];
    }
  };

  // Debounced search with proper cleanup
  useEffect(() => {
    const timer = setTimeout(async () => {
      const query = formData.itemName.trim();
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      setSubmitError(null); // Clear previous errors
      const results = await searchProducts(query);
      setSuggestions(results);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [formData.itemName]);

  const handleSuggestionClick = (product) => {
    setFormData({
      itemName: product.itemName,
      itemCode: product.itemCode,
      category: product.category,
      location: "",
    });
    setShowSuggestions(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, itemName: value }));
    setShowSuggestions(value.length > 1);
  };

  const validateForm = () => {
    if (
      !formData.itemName ||
      !formData.category ||
      !formData.itemCode ||
      !formData.location
    ) {
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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to add disposal item");
      }

      setSubmitSuccess("Disposal item added successfully!");
      setFormData({ itemName: "", category: "", itemCode: "", location: "" });
      setSelectedLocationId(null);
      setSubmitError(null);
    } catch (err) {
      setSubmitError(err.message || "Error submitting form");
      setSubmitSuccess(null);
    }
  };

  const handleLocationSelect = (locationObj) => {
    setFormData((prev) => ({ ...prev, location: locationObj.name }));
    setSelectedLocationId(locationObj.id);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow relative">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Add Disposal Item
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Label value="Item Name" />
          <TextInput
            ref={inputRef}
            value={formData.itemName}
            onChange={handleInputChange}
            onFocus={() =>
              formData.itemName.length > 1 && setShowSuggestions(true)
            }
            required
            placeholder="Type 'mal' to find 'maliban'"
            autoComplete="off"
          />

          {showSuggestions && (
            <div
              ref={suggestionsRef}
              className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
            >
              {isLoading ? (
                <div className="p-3 text-center text-blue-600">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500 inline-block"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Searching...
                </div>
              ) : suggestions.length === 0 ? (
                <div className="p-3 text-center text-gray-500">
                  {submitError
                    ? submitError
                    : formData.itemName.length > 1
                    ? "No matching products found"
                    : "Type at least 2 characters"}
                </div>
              ) : (
                suggestions.map((product) => (
                  <div
                    key={product._id}
                    className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => handleSuggestionClick(product)}
                  >
                    <div className="font-semibold text-gray-800">
                      {product.itemName}
                    </div>
                    <div className="flex gap-2 mt-1">
                      {product.category && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {product.category}
                        </span>
                      )}
                      {product.itemCode && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          {product.itemCode}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Rest of your form fields */}
        <div>
          <Label value="Category" />
          <Select
            value={formData.category}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                category: e.target.value,
                location: "",
              }));
              setSelectedLocationId(null);
            }}
            required
          >
            <option value="">Select Category</option>
            <option value="Pet Food">Pet Food</option>
            <option value="Fertilizer">Fertilizer</option>
            <option value="Animal Farm">Animal Farm</option>
          </Select>
        </div>

        <div>
          <Label value="Item Code(s)" />
          <TextInput
            value={
              Array.isArray(formData.itemCode)
                ? formData.itemCode.join(", ")
                : formData.itemCode
            }
            onChange={(e) => {
              // Allow comma-separated values or single value
              const value = e.target.value.includes(",")
                ? e.target.value.split(",").map((code) => code.trim())
                : e.target.value;
              setFormData((prev) => ({ ...prev, itemCode: value }));
            }}
            required
            placeholder="Enter one or more codes, separated by commas"
          />
        </div>

        {formData.category && (
          <ShowLocation
            category={formData.category}
            onLocationSelect={handleLocationSelect}
            selectedLocationId={selectedLocationId}
          />
        )}

        {submitError && (
          <Alert
            color="failure"
            onDismiss={() => setSubmitError(null)}
            className="mt-4"
          >
            <span className="font-medium">Error!</span> {submitError}
          </Alert>
        )}

        {submitSuccess && (
          <Alert
            color="success"
            onDismiss={() => setSubmitSuccess(null)}
            className="mt-4"
          >
            <span className="font-medium">Success!</span> {submitSuccess}
          </Alert>
        )}

        <Button
          type="submit"
          className="w-full mt-6"
          gradientDuoTone="purpleToBlue"
        >
          Dispose Item
        </Button>
      </form>
    </div>
  );
}
