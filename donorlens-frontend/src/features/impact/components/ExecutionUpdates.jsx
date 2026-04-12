import { useEffect, useState, useMemo } from "react";
import { FileText, X } from "lucide-react";
import axiosInstance from "../../../lib/axios";
import { formatCurrency, formatDate, calculateExecutionProgress } from "../utils/executionUtils";
import ExecutionTimelineItem from "./ExecutionTimelineItem";

export default function ExecutionUpdates({ campaignId, raisedAmount, totalPlannedCost }) {
  const [executions, setExecutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (campaignId) {
      fetchExecutions();
    }
  }, [campaignId]);

  const fetchExecutions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get(
        `/campaign-executions/${campaignId}/executions`
      );

      console.log("Executions API Response:", response.data);

      // Handle the API response structure: { data: { executions: [...] } }
      const data = response?.data?.data?.executions || [];
      console.log("Extracted executions:", data);
      setExecutions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching executions:", err);
      setError("");
      setExecutions([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate cumulative funds and progress using shared utility
  const executionsWithProgress = useMemo(() => {
    return calculateExecutionProgress(executions, totalPlannedCost);
  }, [executions, totalPlannedCost]);

  if (loading) {
    return (
      <div className="space-y-4 py-8">
        <p className="text-sm text-slate-500">Loading updates...</p>
      </div>
    );
  }

  if (executionsWithProgress.length === 0) {
    return (
      <div className="mt-10">
        <h3 className="text-md font-semibold text-slate-900 mb-6">
          Execution Updates
        </h3>
        <p className="text-sm text-slate-500">No updates available yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <h3 className="text-2xl font-bold text-slate-900 mb-8">
        Execution Updates
      </h3>

      <div className="space-y-6">
        {/* Timeline vertical line and items */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-12 bottom-0 w-1 bg-slate-200"></div>

          {executionsWithProgress.map((execution, index) => {
            console.log(`Execution ${index}:`, execution);
            return (
            <div key={execution._id} className="mb-8 relative">
              {/* Timeline dot */}
              <div className="absolute left-0 top-0 flex h-14 w-14 items-center justify-center rounded-full bg-teal-600 text-white font-bold text-sm shadow-lg z-20">
                <span className="text-center leading-tight">
                  {execution.progressPercentage}%
                </span>
              </div>

              {/* Content card */}
              <div className="ml-20 rounded-lg bg-slate-50 p-6 border border-slate-200">
                {/* Title and Date */}
                <div className="flex items-baseline justify-between gap-4 mb-2">
                  <h4 className="font-bold text-slate-900 text-lg">
                    {execution.title}
                  </h4>
                  <span className="text-xs text-slate-500 whitespace-nowrap">
                    {formatDate(execution.date)}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                  {execution.description}
                </p>

                {/* Funds Used Badge */}
                <p className="text-sm font-semibold text-teal-700 mb-4">
                  {formatCurrency(execution.fundsUsed)} used
                </p>

                {/* Photos and Documents Side by Side */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Evidence Photos */}
                  {execution.evidencePhotos && execution.evidencePhotos.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-700 mb-3 uppercase tracking-wide">
                        Photos ({execution.evidencePhotos.length})
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {execution.evidencePhotos.map((photo, index) => {
                          // Handle both object format { secure_url, public_id } and string format
                          let photoUrl = "";
                          
                          if (typeof photo === "string") {
                            photoUrl = photo;
                          } else if (photo && typeof photo === "object") {
                            photoUrl = photo.secure_url || photo.url || photo.path || "";
                          }
                          
                          console.log(`Photo ${index} original URL:`, photoUrl);
                          
                          return (
                            <div
                              key={index}
                              className="relative group cursor-pointer w-20 h-20 rounded-lg border-2 border-slate-200 hover:border-teal-600 transition overflow-hidden hover:shadow-md"
                              onClick={() => {
                                console.log("Opening image:", photoUrl);
                                setSelectedImage(photoUrl);
                              }}
                              style={{
                                backgroundImage: `url('${photoUrl}')`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundColor: '#e2e8f0'
                              }}
                              title="Click to view full size"
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Receipts/Documents */}
                  {execution.receipts && execution.receipts.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-700 mb-3 uppercase tracking-wide">
                        Documents ({execution.receipts.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {execution.receipts.map((receipt, index) => {
                          // Handle both object format { secure_url, public_id, fileName } and string format
                          let fileUrl = "";
                          let fileName = `Document ${index + 1}`;

                          if (typeof receipt === "string") {
                            fileUrl = receipt;
                            fileName = receipt.split("/").pop() || fileName;
                          } else if (receipt && typeof receipt === "object") {
                            fileUrl = receipt.secure_url || receipt.url || receipt.path || "";
                            fileName = receipt.fileName || receipt.filename || receipt.name || fileName;
                          }

                          if (!fileUrl) return null;

                          const isPdf = fileUrl.toLowerCase().endsWith(".pdf");

                          return (
                            <a
                              key={index}
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 rounded px-3 py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-medium transition hover:shadow-md"
                              title={fileName}
                            >
                              <FileText size={16} className="shrink-0" />
                              <span className="truncate max-w-40">{fileName}</span>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            );
          })}
        </div>

        {/* Campaign Launched Section - At Bottom */}
        <div className="relative">
          <div className="absolute left-6 top-12 bottom-0 w-1 bg-slate-200"></div>
          
          <div className="mb-8 relative">
            {/* Timeline dot */}
            <div className="absolute left-0 top-0 flex h-14 w-14 items-center justify-center rounded-full bg-teal-600 text-white font-bold text-sm shadow-lg z-20">
              <span className="text-center leading-tight">0%</span>
            </div>

            {/* Content card */}
            <div className="ml-20 rounded-lg bg-slate-50 p-6 border border-slate-200">
              {/* Title */}
              <h4 className="font-bold text-slate-900 text-lg">
                Campaign Launched
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-slate-100 z-10 border border-slate-200"
            >
              <X size={24} className="text-slate-700" />
            </button>

            {/* Image Container */}
            <img
              src={selectedImage}
              alt="Full view"
              className="max-w-full max-h-[80vh] w-auto h-auto"
              onLoad={() => console.log("Modal image loaded successfully")}
              onError={(e) => console.error("Failed to load modal image:", selectedImage, e)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
