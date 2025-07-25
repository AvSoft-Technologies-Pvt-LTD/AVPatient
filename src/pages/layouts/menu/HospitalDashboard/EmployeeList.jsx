import React, { useState } from "react";
import { Plus, Edit, Trash2, User, Building, Award } from "lucide-react";
import { FaEdit, FaTrash } from "react-icons/fa";
import ReusableModal from "../../../../components/microcomponents/Modal";
import DynamicTable from "../../../../components/microcomponents/DynamicTable";
import cardiodoc from "../../../../assets/cardiodoc.jpg";
import meddoc from "../../../../assets/meddoc.jpg";
import doctorsign1 from "../../../../assets/doctorsign1.png";
import doctorsign2 from "../../../../assets/doctorsign2.jpg";

// Add combined filter options for EmployeeList
const employeeFilters = [
  {
    key: "combinedFilter",
    label: "Filter",
    options: [
      // ...["Active", "Inactive"].map(status => ({ value: status, label: `Status: ${status}` })),
      ...["Cardiology", "Medicine", "Surgery"].map(dep => ({ value: dep, label: ` ${dep}` })),
      // ...["Professor & Doctor", "Doctor", "Consultant"].map(des => ({ value: des, label: `Designation: ${des}` }))
    ]
  }
];

const EmployeeList = () => {
  const [employees, setEmployees] = useState([
    {
      id: 1,
      empId: "001",
      name: "Dr. Jamal Khan",
      phone: "01738888345",
      email: "jamal56@gmail.com",
      department: "Cardiology",
      designation: "Professor & Doctor",
      branch: "-",
      remarks: "MBBS, FRCS UK",
      status: "Active",
      dob: "1975-05-15",
      hireDate: "2020-01-10",
      nationalId: "1234567890",
      manager: "Dr. Smith",
      picture: cardiodoc,
      signature: doctorsign1
    },
    {
      id: 2,
      empId: "002",
      name: "Dr. Kamal Khan",
      phone: "01721535870",
      email: "kamal@gmail.com",
      department: "Medicine",
      designation: "Doctor",
      branch: "-",
      remarks: "-",
      status: "Active",
      dob: "1980-03-22",
      hireDate: "2021-06-15",
      nationalId: "0987654321",
      manager: "Dr. Ahmed",
      picture: meddoc,
      signature: doctorsign2
    }
  ]);

  const [departments, setDepartments] = useState([
    { id: 1, name: "Cardiology", code: "CARD", status: "Active" },
    { id: 2, name: "Medicine", code: "MED", status: "Active" },
    { id: 3, name: "Surgery", code: "SURG", status: "Active" }
  ]);

  const [designations, setDesignations] = useState([
    { id: 1, name: "Professor & Doctor", code: "PROF_DOC", status: "Active" },
    { id: 2, name: "Doctor", code: "DOC", status: "Active" },
    { id: 3, name: "Consultant", code: "CONS", status: "Active" }
  ]);

  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: "add",
    type: "employee",
    data: {},
    parentData: {}
  });

  const [previewImageUrl, setPreviewImageUrl] = useState(null);
  const [showImagePreview, setShowImagePreview] = useState(false);

  const openModal = (mode, type, data = {}, parentData = {}) => {
    setModalState({ isOpen: true, mode, type, data, parentData });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, mode: "add", type: "employee", data: {}, parentData: {} });
  };

const handleSave = (formData) => {
  const { type, mode, data, parentData } = modalState;

  if (type === "employee") {
    let updatedFormData = { ...formData };

    if (formData.pictureFile instanceof File) {
      updatedFormData.picture = URL.createObjectURL(formData.pictureFile);
    }
    if (formData.signatureFile instanceof File) {
      updatedFormData.signature = URL.createObjectURL(formData.signatureFile);
    }

    if (mode === "add") {
      const newEmployee = {
        ...updatedFormData,
        id: employees.length + 1,
        empId: formData.empId || (employees.length + 1).toString().padStart(3, "0"),
      };
      setEmployees([...employees, newEmployee]);
    } else if (mode === "edit") {
      setEmployees(
        employees.map((emp) =>
          emp.id === data.id ? { ...emp, ...updatedFormData } : emp
        )
      );
    }

    closeModal(); // ✅ Close after saving employee
  }

  else if (type === "department") {
    const newDept = { ...formData, id: departments.length + 1 };
    setDepartments([...departments, newDept]);

    if (parentData.empId) {
      // Switch to employee modal with updated department
      setModalState((prev) => ({
        ...prev,
        data: { ...prev.parentData, department: formData.name },
        type: "employee",
      }));
    } else {
      closeModal(); // ✅ Only close if not switching to employee modal
    }
  }

  else if (type === "designation") {
    const newDesig = { ...formData, id: designations.length + 1 };
    setDesignations([...designations, newDesig]);

    if (parentData.empId) {
      // Switch to employee modal with updated designation
      setModalState((prev) => ({
        ...prev,
        data: { ...prev.parentData, designation: formData.name },
        type: "employee",
      }));
    } else {
      closeModal(); // ✅ Only close if not switching to employee modal
    }
  }
};

  const handleDelete = (id) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  // Status color mapping (same as ProductPage)
  const statusColors = {
    active: "text-green-600 bg-green-100",
    inactive: "text-red-600 bg-red-100"
  };

  const employeeColumns = [
    { header: "EID", accessor: "empId" },
    {
  header: "Employee Name",
  accessor: "name",
  clickable: true,
  cell: (row) => (
    <button
      type="button"
      className="text-[var(--primary-color)] hover:text-[var(--accent-color)] underline cursor-pointer"
      style={{ textDecorationThickness: 2 }}
      onClick={() => openModal("viewProfile", "employee", row)}
      title="View Employee"
    >
      {row.name}
    </button>
  ),
},

    { header: "Department", accessor: "department" },
    { header: "Designation", accessor: "designation" },
    { 
      header: "Status", 
      accessor: "status",
      cell: (row) => {
        const key = row.status ? row.status.toLowerCase() : "";
        return (
          <span className={`px-2 py-1 rounded-full text-xs  ${statusColors[key] || "text-gray-600 bg-gray-100"}`}>
            {key.toUpperCase()}
          </span>
        );
      }
    },
    { 
      header: "Picture", 
      accessor: "picture",
      cell: (row) => (
        row.picture ? (
          <img
            src={row.picture}
            alt="Employee"
            className="w-8 h-8 rounded-full object-cover cursor-pointer"
            onClick={() => {
              setPreviewImageUrl(row.picture);
              setShowImagePreview(true);
            }}
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <User size={16} className="text-gray-500" />
          </div>
        )
      )
    },
    { 
      header: "Signature", 
      accessor: "signature",
      cell: (row) => (
        row.signature ? (
          <img src={row.signature} alt="Signature" className="w-16 h-8 object-contain" />
        ) : (
          <span className="text-blue-500 cursor-pointer">ADD</span>
        )
      )
    },
    {
      header: "Actions",
      accessor: "actions",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => openModal("edit", "employee", row)}
            className="edit-btn flex items-center justify-center hover:bg-blue-100 rounded p-1 transition hover:animate-bounce"
            title="Edit"
          >
            <FaEdit size={16} />
          </button>
          <button
            onClick={() => { setDeleteModalOpen(true); setDeleteId(row.id); }}
            className="delete-btn flex items-center justify-center hover:bg-red-100 rounded p-1 transition hover:animate-bounce"
            title="Delete"
          >
            <FaTrash size={16} />
          </button>
        </div>
      )
    }
  ];

  const getFields = () => {
    const { type } = modalState;
    if (type === "employee") {
      return [
        { name: "empId", label: "Employee ID", type: "text", required: true },
        { name: "name", label: "Employee Name", type: "text", required: true },
        { 
          name: "designation", 
          label: "Designation", 
          type: "select",
          options: designations.map(d => ({ value: d.name, label: d.name })),
          required: true,
          onAdd: () => openModal("add", "designation", {}, modalState.data)
        },
        { 
          name: "department", 
          label: "Department", 
          type: "select",
          options: departments.map(d => ({ value: d.name, label: d.name })),
          required: true,
          onAdd: () => openModal("add", "department", {}, modalState.data)
        },
        { name: "phone", label: "Phone", type: "tel" },
        { name: "email", label: "Email", type: "email" },
        { name: "dob", label: "Date of Birth", type: "date" },
        { name: "hireDate", label: "Hire Date", type: "date" },
        { name: "nationalId", label: "National ID", type: "text" },
        { name: "manager", label: "Manager", type: "text" },
        { name: "remarks", label: "Remarks", type: "textarea" },
        { 
          name: "status", 
          label: "Status", 
          type: "select",
          options: [
            { value: "Active", label: "Active" },
            { value: "Inactive", label: "Inactive" }
          ],
          required: true
        },
        { name: "pictureFile", label: "Photo", type: "file" },
        { name: "signatureFile", label: "Signature", type: "file" }
      ];
    } else if (type === "department") {
      return [
        { name: "name", label: "Department Name", type: "text", required: true },
        { name: "code", label: "Department Code", type: "text", required: true },
        { 
          name: "status", 
          label: "Status", 
          type: "select",
          options: [
            { value: "Active", label: "Active" },
            { value: "Inactive", label: "Inactive" }
          ],
          required: true
        }
      ];
    } else if (type === "designation") {
      return [
        { name: "name", label: "Designation Name", type: "text", required: true },
        { name: "code", label: "Designation Code", type: "text", required: true },
        { 
          name: "status", 
          label: "Status", 
          type: "select",
          options: [
            { value: "Active", label: "Active" },
            { value: "Inactive", label: "Inactive" }
          ],
          required: true
        }
      ];
    }
    return [];
  };

  const getTitle = () => {
    const { type, mode } = modalState;
    const action = mode === "add" ? "Create" : "Edit";
    return `${action} ${type.charAt(0).toUpperCase() + type.slice(1)}`;
  };

  // Filtered employees based on status
  const filteredEmployees = employees;

  return (
    <div className="space-y-6">
 
      <div className="flex justify-between items-center mb-6">
      <h1 className="h4-heading">Employee List</h1>
        <button
          onClick={() => openModal("add", "employee")}
          className="btn btn-primary"
        >
          <Plus size={20} />
          Create Employee
        </button>
      </div>

      {/* Employee Table */}
      <div>
        <DynamicTable
          columns={employeeColumns}
          data={filteredEmployees}
          filters={employeeFilters}
          onCellClick={(row, col) => {
            if (col.accessor === "name") {
              openModal("viewProfile", "employee", row);
            }
          }}
        />
      </div>

      {/* Modal */}
      <ReusableModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        mode={modalState.mode}
        title={getTitle()}
        fields={getFields()}
        data={modalState.data}
        size={modalState.type === "employee" ? "lg" : "md"}
        onSave={handleSave}
        saveLabel={modalState.mode === "add" ? "Create" : "Update"}
        // Add viewFields for viewProfile mode
        viewFields={[
          { key: "empId", label: "Employee ID" },
          { key: "name", label: "Employee Name", titleKey: true, initialsKey: true },
          { key: "designation", label: "Designation" },
          { key: "department", label: "Department" },
          { key: "phone", label: "Phone" },
          { key: "email", label: "Email" },
          { key: "dob", label: "Date of Birth" },
          { key: "hireDate", label: "Hire Date" },
          { key: "nationalId", label: "National ID" },
          { key: "manager", label: "Manager" },
          { key: "remarks", label: "Remarks" },
          { key: "status", label: "Status" },
        ]}
      />

      {showImagePreview && previewImageUrl && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-bold">Image Preview</h3>
              <button onClick={() => setShowImagePreview(false)} className="text-gray-700 hover:text-red-500">X</button>
            </div>
            <img src={previewImageUrl} alt="Preview" className="w-full max-h-[70vh] object-contain" />
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;