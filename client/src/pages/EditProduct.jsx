import { useState, useEffect, useRef } from "react";
import {
  Button,
  TextInput,
  Modal,
  Alert,
  FileInput,
  Datepicker,
} from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";

const EditProduct = ({
  openModal,
  setOpenModal,
  product,
  onProductUpdated,
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: "",
    itemName: "",
    supplierName: "",
    price: "",
    quantity: "",
    itemCode: "",
    purchaseDate: "",
    expiryDate: "",
    description: "",
    itemImage: "",
  });

  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const quillRef = useRef(null);

  useEffect(() => {
    if (product) {
      setFormData({
        category: product.category || "",
        itemName: product.itemName || "",
        supplierName: product.supplierName || "",
        price: product.price || "",
        quantity: product.quantity || "",
        itemCode: product.itemCode || "",
        purchaseDate: product.purchaseDate
          ? product.purchaseDate.split("T")[0]
          : "",
        expiryDate: product.expiryDate ? product.expiryDate.split("T")[0] : "",
        description: product.description || "",
        itemImage: product.itemImage || "",
      });
    }
  }, [product]);

  const handleImageUpload = async () => {
    if (!file) return;
    try {
      setUploadProgress(0);
      setUploadError("");

      const fakeUpload = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(fakeUpload);
            setFormData((prevData) => ({
              ...prevData,
              itemImage: URL.createObjectURL(file),
            }));
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    } catch (error) {
      console.error("Image upload failed:", error);
      setUploadError("Image upload failed. Please try again.");
    }
  };

  const handleEdit = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem("user"))?._id;

      const res = await fetch(`/api/product/update/${product._id}/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        onProductUpdated();
        setOpenModal(false);

        navigate("/dashboard?tab=products");
      } else {
        setSubmitError(data.error || "Failed to update product.");
      }
    } catch (error) {
      console.error("Error editing product:", error);
      setSubmitError("Something went wrong while updating the product.");
    }
  };

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header>Edit Product</Modal.Header>
      <Modal.Body>
        <form className="flex flex-col gap-3" onSubmit={handleEdit}>
          <div>
            <label htmlFor="category">Category</label>
            <TextInput
              id="category"
              placeholder="Category"
              value={formData.category}
              required
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
            />
          </div>

          <div>
            <label htmlFor="supplierName">Supplier Name</label>
            <TextInput
              id="supplierName"
              placeholder="Supplier Name"
              value={formData.supplierName}
              required
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  supplierName: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <label htmlFor="itemName">Item Name</label>
            <TextInput
              id="itemName"
              placeholder="Item Name"
              value={formData.itemName}
              required
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, itemName: e.target.value }))
              }
            />
          </div>

          <div>
            <label htmlFor="price">Price</label>
            <TextInput
              id="price"
              placeholder="Price"
              type="number"
              value={formData.price}
              required
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, price: e.target.value }))
              }
            />
          </div>

          <div>
            <label htmlFor="itemImage">Item Image</label>
            <div className="flex gap-2 items-center">
              <FileInput
                accept="image/*"
                id="itemImage"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <Button
                type="button"
                size="xs"
                outline
                gradientDuoTone="cyanToBlue"
                onClick={handleImageUpload}
              >
                {uploadProgress > 0 && uploadProgress < 100 ? (
                  <div className="w-12 h-12">
                    <CircularProgressbar
                      value={uploadProgress}
                      text={`${uploadProgress}%`}
                    />
                  </div>
                ) : (
                  "Upload"
                )}
              </Button>
            </div>
            {uploadError && <Alert color="failure">{uploadError}</Alert>}
            {formData.itemImage && (
              <img
                src={formData.itemImage}
                alt="Uploaded"
                className="h-32 object-cover rounded"
              />
            )}
          </div>

          <div>
            <label htmlFor="quantity">Quantity</label>
            <TextInput
              id="quantity"
              placeholder="Quantity"
              type="number"
              value={formData.quantity}
              required
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, quantity: e.target.value }))
              }
            />
          </div>

          <div>
            <label htmlFor="itemCode">Item Code</label>
            <TextInput
              id="itemCode"
              placeholder="Item Code"
              value={formData.itemCode}
              required
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, itemCode: e.target.value }))
              }
            />
          </div>

          <div className="flex gap-2">
            <div>
              <label htmlFor="purchaseDate">Purchase Date</label>
              <Datepicker
                id="purchaseDate"
                placeholder="Purchase Date"
                value={formData.purchaseDate}
                onSelectedDateChanged={(date) =>
                  setFormData((prev) => ({ ...prev, purchaseDate: date }))
                }
              />
            </div>
            <div>
              <label htmlFor="expiryDate">Expiry Date</label>
              <Datepicker
                id="expiryDate"
                placeholder="Expiry Date"
                value={formData.expiryDate}
                onSelectedDateChanged={(date) =>
                  setFormData((prev) => ({ ...prev, expiryDate: date }))
                }
              />
            </div>
          </div>

          <div>
            <label htmlFor="description">Description</label>
            <ReactQuill
              ref={quillRef}
              id="description"
              theme="snow"
              value={formData.description}
              placeholder="Product Description"
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, description: value }))
              }
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              color="gray"
              onClick={() => setOpenModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" gradientDuoTone="greenToBlue">
              Save Changes
            </Button>
          </div>

          {submitError && <Alert color="failure">{submitError}</Alert>}
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default EditProduct;
