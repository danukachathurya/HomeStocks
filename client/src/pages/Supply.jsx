import { useState, useEffect } from "react";
import { Button, Table, TextInput } from "flowbite-react";
import AddSupply from "../pages/AddSupply"; 
import { useSelector } from 'react-redux';
import EditSupply from "../pages/EditSupply";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ Required for PDF table generation

export default function Supply() {
  const [supplys, setSupplys] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [search, setSearch] = useState("");
  const [openAddModal, setOpenAddModal] = useState(false);  
  const [openEditModal, setOpenEditModal] = useState(false);
  const [supplyToEdit, setSupplyToEdit] = useState(null);

  useEffect(() => {
    fetchSupplys();
  }, []);

  const fetchSupplys = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/supply/all`);
      const data = await res.json();
      setSupplys(data.supplys);
    } catch (error) {
      console.error("Error fetching supplys:", error);
    } 
  };

  const handleDelete = async (supplyId) => {
    try {
      const res = await fetch(`/api/supply/delete/${supplyId}/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setSupplys((prev) =>
        prev.filter((supply) => supply._id !== supplyId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEdit = (supply) => {
    setSupplyToEdit(supply); 
    setOpenEditModal(true); 
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF();

    const dateStr = new Date().toLocaleDateString();
    doc.setFontSize(18);
    doc.text("Supplies Report", 14, 20);

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${dateStr}`, 14, 28);

    const filteredSupplys = supplys.filter((supply) => {
      const itemName = supply.itemName?.toLowerCase() || '';
      const supplierName = supply.supplierName?.toLowerCase() || '';
      const query = search.trim().toLowerCase();
      return itemName.includes(query) || supplierName.includes(query);
    });

    const tableData = filteredSupplys.map(supply => [
      supply.itemName,
      supply.supplierName,
      `$${supply.price}`,
      supply.quantity,
      new Date(supply.expiryDate).toISOString().split('T')[0]
    ]);

    autoTable(doc, {
      startY: 35,
      head: [["Item Name", "Supplier", "Price", "Quantity", "Expiry Date"]],
      body: tableData,
      theme: "striped",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 123, 189] }
    });

    doc.save(`supplies-report-${Date.now()}.pdf`);
  };

  return (
    <div className="p-5 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-5 gap-3 flex-wrap">
        <h1 className="text-3xl font-bold">Supplies</h1>
        <div className="flex gap-2">
          <Button onClick={handleDownloadPdf} color="gray">Download List</Button>
          <Button onClick={() => setOpenAddModal(true)}>Add Supplies</Button>
        </div>
      </div>

      <TextInput
        placeholder="Search by item or supplier name..."
        className="mb-5"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="overflow-x-auto">
        <Table hoverable striped>
          <Table.Head>
            <Table.HeadCell className="text-lg font-semibold">Name</Table.HeadCell>
            <Table.HeadCell className="text-lg font-semibold">Supplier</Table.HeadCell>
            <Table.HeadCell className="text-lg font-semibold">Price</Table.HeadCell>
            <Table.HeadCell className="text-lg font-semibold">Quantity</Table.HeadCell>
            <Table.HeadCell className="text-lg font-semibold">Exp Date</Table.HeadCell>
            <Table.HeadCell className="text-lg font-semibold">Action</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {supplys && supplys.length > 0 ? (
              supplys
                .filter((supply) => {
                  const itemName = supply.itemName?.toLowerCase() || '';
                  const supplierName = supply.supplierName?.toLowerCase() || '';
                  const query = search.trim().toLowerCase();
                  return itemName.includes(query) || supplierName.includes(query);
                })
                .map((supply) => (
                  <Table.Row key={supply._id}>
                    <Table.Cell>{supply.itemName}</Table.Cell>
                    <Table.Cell>{supply.supplierName}</Table.Cell>
                    <Table.Cell>${supply.price}</Table.Cell>
                    <Table.Cell>{supply.quantity}</Table.Cell>
                    <Table.Cell>{new Date(supply.expiryDate).toISOString().split('T')[0]}</Table.Cell>
                    <Table.Cell className="flex gap-2">
                      <Button
                        color="failure"
                        size="xs"
                        onClick={() => handleDelete(supply._id)}
                      >
                        Delete
                      </Button>
                      <Button
                        color="blue"
                        size="xs"
                        onClick={() => handleEdit(supply)}
                      >
                        Edit
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan="6" className="text-center py-4">
                  No supplies found.
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>

      <AddSupply
        openModal={openAddModal}
        setOpenModal={setOpenAddModal}
        onSupplyAdded={fetchSupplys}
      />

      {openEditModal && (
        <EditSupply
          openModal={openEditModal}
          setOpenModal={setOpenEditModal}
          supply={supplyToEdit}
          onSupplyUpdated={fetchSupplys}
        />
      )}
    </div>
  );
}
