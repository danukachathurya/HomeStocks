import { useEffect, useState } from "react";
import { Spinner, Alert } from "flowbite-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function DisposeDetails() {
  const [disposalItems, setDisposalItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchDisposals = async () => {
      try {
        const res = await fetch("/api/disposal/all");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch disposal items.");
        }

        setDisposalItems(data.disposalItems);
        setLoading(false);
      } catch (err) {
        setFetchError(err.message);
        setLoading(false);
      }
    };

    fetchDisposals();
  }, []);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Disposed Inventory Items", 14, 22);

    const tableData = disposalItems.map((item, index) => [
      index + 1,
      item.itemName,
      item.category,
      item.itemCode,
      item.location,
      new Date(item.createdAt).toLocaleDateString("en-US"),
    ]);

    autoTable(doc, {
      startY: 30,
      head: [["#", "Item Name", "Category", "Item Code", "Location", "Date"]],
      body: tableData,
    });

    doc.save("Disposed_Items_List.pdf");
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          📦 Disposed Inventory Items
        </h2>

        {loading ? (
          <div className="flex justify-center py-10">
            <Spinner size="xl" color="info" />
          </div>
        ) : fetchError ? (
          <Alert color="failure" className="text-center">
            {fetchError}
          </Alert>
        ) : disposalItems.length === 0 ? (
          <Alert color="warning" className="text-center">
            No disposed items found.
          </Alert>
        ) : (
          <>
            <div className="flex justify-end mb-4">
              <button
                onClick={handleDownloadPDF}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                ⬇️ Download List
              </button>
            </div>
            <div className="grid gap-6">
              {disposalItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-gray-50 border border-gray-200 rounded-xl shadow-sm p-5 hover:shadow-md transition-all"
                >
                  <div className="mb-2">
                    <span className="font-semibold text-gray-700">📄 Item Name:</span>{" "}
                    <span className="text-gray-900">{item.itemName}</span>
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold text-gray-700">📂 Category:</span>{" "}
                    <span className="text-gray-900">{item.category}</span>
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold text-gray-700">🔖 Item Code:</span>{" "}
                    <span className="text-gray-900">{item.itemCode}</span>
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold text-gray-700">📍 Location:</span>{" "}
                    <span className="text-gray-900">{item.location}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">📅 Date:</span>{" "}
                    <span className="text-gray-900">
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
