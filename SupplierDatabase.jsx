const { useMemo, useState, useEffect } = React;

function SupplierDatabase() {
  const [search, setSearch] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    location: "",
    description: "",
    contact: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("suppliers");
    if (saved) {
      try {
        setSuppliers(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to parse saved suppliers:", error);
        setSuppliers([]);
      }
    } else {
      setSuppliers([
        {
          name: "Cape Town Packaging Co",
          category: "Packaging",
          location: "Western Cape",
          description: "Food and product packaging solutions for small businesses.",
          contact: "WhatsApp 071 000 0000",
        },
        {
          name: "Joburg Metal Works",
          category: "Manufacturing",
          location: "Gauteng",
          description: "Steel fabrication and custom metal parts.",
          contact: "WhatsApp 072 000 0000",
        },
      ]);
    }
  }, []);

  useEffect(() => {
    if (suppliers.length > 0) {
      localStorage.setItem("suppliers", JSON.stringify(suppliers));
    }
  }, [suppliers]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return suppliers.filter((supplier) => {
      return (
        supplier.name.toLowerCase().includes(q) ||
        supplier.category.toLowerCase().includes(q) ||
        supplier.location.toLowerCase().includes(q) ||
        supplier.description.toLowerCase().includes(q) ||
        supplier.contact.toLowerCase().includes(q)
      );
    });
  }, [search, suppliers]);

  function addSupplier() {
    if (!form.name.trim() || !form.category.trim()) return;

    const newSupplier = {
      name: form.name.trim(),
      category: form.category.trim(),
      location: form.location.trim(),
      description: form.description.trim(),
      contact: form.contact.trim(),
    };

    setSuppliers((prev) => [newSupplier, ...prev]);
    setForm({ name: "", category: "", location: "", description: "", contact: "" });
  }

  function exportJSON() {
    const dataStr = JSON.stringify(suppliers, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "suppliers.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Supplier Database South Africa</h1>
        <p className="text-gray-600 mb-6">Search suppliers and add new businesses.</p>

        <div className="bg-white p-4 rounded-2xl shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Add Supplier</h2>

          <div className="grid md:grid-cols-2 gap-3">
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="p-2 border rounded-xl"
            />
            <input
              placeholder="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="p-2 border rounded-xl"
            />
            <input
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="p-2 border rounded-xl"
            />
            <input
              placeholder="Contact (WhatsApp)"
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
              className="p-2 border rounded-xl"
            />
          </div>

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full mt-3 p-2 border rounded-xl"
          />

          <div className="flex gap-3 mt-3">
            <button type="button" onClick={addSupplier} className="bg-black text-white px-4 py-2 rounded-xl">
              Add Supplier
            </button>
            <button type="button" onClick={exportJSON} className="bg-red-600 text-white px-4 py-2 rounded-xl">
              Export JSON (GitHub Upload)
            </button>
          </div>
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search suppliers..."
          className="w-full p-4 rounded-2xl shadow mb-6"
        />

        <div className="space-y-4">
          {filtered.map((supplier, index) => (
            <div key={`${supplier.name}-${index}`} className="bg-white p-5 rounded-2xl shadow">
              <div className="flex justify-between mb-1">
                <h2 className="text-xl font-semibold">{supplier.name}</h2>
                <span className="text-sm text-gray-500">{supplier.location}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{supplier.category}</p>
              <p className="text-gray-700 mb-3">{supplier.description}</p>
              <p className="text-sm font-medium">{supplier.contact}</p>
            </div>
          ))}

          {filtered.length === 0 && <p className="text-gray-500">No suppliers found.</p>}
        </div>
      </div>
    </div>
  );
}
