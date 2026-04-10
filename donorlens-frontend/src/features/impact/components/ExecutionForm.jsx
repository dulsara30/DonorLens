const ExecutionForm = ({ isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <div className="bg-white p-6 rounded-xl border mt-4">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">New Execution Update</h2>
        <button onClick={onClose}>✖</button>
      </div>

      {/* Form */}
      <form className="mt-4 space-y-4">

        <input
          type="text"
          placeholder="Title"
          className="w-full border p-2 rounded"
        />

        <textarea
          placeholder="Description"
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Funds Used"
          className="w-full border p-2 rounded"
        />

        <input type="file" multiple />

        <button className="bg-[#1FA37A] text-white px-4 py-2 rounded">
          Save Update
        </button>
      </form>
    </div>
  );
};