import { useState, useEffect, useRef } from 'react';
import { Button, TextInput, Modal, Alert, FileInput, Datepicker, Label } from 'flowbite-react';
import 'react-quill/dist/quill.snow.css';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';  

const EditSupply = ({ openModal, setOpenModal, supply, onSupplyUpdated }) => {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    category: '',
    itemName: '',
    supplierName: '',
    price: '',
    quantity: '', 
    purchaseDate: '',
    expiryDate: '',
    itemImage: '',
  });

  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const quillRef = useRef(null);

  const validateForm = () => {
    const requiredFields = [
      "category",
      "supplierName",
      "itemName",
      "price",
      "itemImage",
      "quantity",
      "purchaseDate",
      "expiryDate",
    ];

    for (let field of requiredFields) {
      if (!formData[field] || formData[field].toString().trim() === "") {
        return `All fields are required.`;
      }
    }

    if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      return "Price must be a valid number greater than 0.";
    }

    if (!Number.isInteger(Number(formData.quantity)) || formData.quantity <= 0) {
      return "Quantity must be a valid integer greater than 0.";
    }

    return null;
  };

  useEffect(() => {
    if (supply) {
      setFormData({
        category: supply.category || '',
        itemName: supply.itemName || '',
        supplierName: supply.supplierName || '',
        price: supply.price || '',
        quantity: supply.quantity || '',
        purchaseDate: supply.purchaseDate ? supply.purchaseDate.split('T')[0] : '',
        expiryDate: supply.expiryDate ? supply.expiryDate.split('T')[0] : '',
        itemImage: supply.itemImage || '',
      });
    }
  }, [supply]);

  const handleImageUpload = async () => {
    if (!file) return;
    try {
      setUploadProgress(0);
      setUploadError('');

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
      console.error('Image upload failed:', error);
      setUploadError('Image upload failed. Please try again.');
    }
  };

  const handleEdit = async (e) => {
  e.preventDefault();  // This is essential!
  const validationError = validateForm();
  if (validationError) {
    setSubmitError(validationError);
    return;
  }

  try {
    const userId = JSON.parse(localStorage.getItem('user'))?._id;

    const res = await fetch(`/api/supply/update/${supply._id}/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      onSupplyUpdated();
      setOpenModal(false);
      navigate('/supplier-dashboard');
    } else {
      setSubmitError(data.error || "Failed to update supply.");
    }
  } catch (error) {
    console.error('Error editing supply:', error);
    setSubmitError('Something went wrong while updating the supply.');
  }
};

  
  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header>Edit Supply</Modal.Header>
      <Modal.Body>
        <form className="flex flex-col gap-3" onSubmit={handleEdit}>
          <Label htmlFor="category" value="Category" />
          <TextInput
            placeholder="Category"
            id="category"
            value={formData.category}
            required
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, category: e.target.value }))
            }
          />
          <Label htmlFor="Supplier Name" value="Supplier Name" />
          <TextInput
            placeholder="Supplier Name"
            id="supplierName"
            value={formData.supplierName}
            required
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, supplierName: e.target.value }))
            }
          />
          <Label htmlFor="Item Name" value="Item Name" />
          <TextInput
            placeholder="Item Name"
            id="itemName"
            value={formData.itemName}
            required
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, itemName: e.target.value }))
            }
          />
          <Label htmlFor="Price" value="Price" />
          <TextInput
            placeholder="Price"
            id="price"
            type="number"
            value={formData.price}
            required
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, price: e.target.value }))
            }
          />
          <Label htmlFor="Add Image" value="Add Image" />
          <div className="flex gap-2 items-center">
            <FileInput
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              id="itemImage"
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
                  <CircularProgressbar value={uploadProgress} text={`${uploadProgress}%`} />
                </div>
              ) : (
                'Upload'
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
          <Label htmlFor="Quantity" value="Quantity" />
          <TextInput
            placeholder="Quantity"
            id="quantity"
            type="number"
            value={formData.quantity}
            required
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, quantity: e.target.value }))
            }
          />

          <div className="flex gap-2">
            <Label htmlFor="Purchase Date" value="Purchase Date" />
            <Datepicker
              placeholder="Purchase Date"
              id="purchaseDate"
              value={formData.purchaseDate}
              onSelectedDateChanged={(date) =>
                setFormData((prev) => ({ ...prev, purchaseDate: date }))
              }
            />
            <Label htmlFor="Expiry Date" value="Expiry Date" />
            <Datepicker
              placeholder="Expiry Date"
              id="expiryDate"
              value={formData.expiryDate}
              onSelectedDateChanged={(date) =>
                setFormData((prev) => ({ ...prev, expiryDate: date }))
              }
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" color="gray" onClick={() => setOpenModal(false)}>
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

export default EditSupply;
