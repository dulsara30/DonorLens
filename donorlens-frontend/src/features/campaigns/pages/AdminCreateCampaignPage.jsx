import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../admin/layout/AdminLayout";
import CampaignStepper from "../components/CampaignStepper";
import CampaignBasicInfoStep from "../components/CampaignBasicInfoStep";
import CampaignMediaStep from "../components/CampaignMediaStep";
import CampaignFinancialStep from "../components/CampaignFinancialStep";
import CampaignReviewStep from "../components/CampaignReviewStep";
import {
  validateBasicInfo,
  validateMedia,
  validateFinancialBreakdown,
} from "../validation";
import { createCampaignApi } from "../api";

const initialForm = {
  title: "",
  sdgGoalNumber: "",
  description: "",
  endDate: "",
  location: {
    locationName: "",
    latitude: null,
    longitude: null,
  },
  coverImage: null,
  financialBreakdown: [
    {
      itemName: "",
      cost: "",
      description: "",
    },
  ],
};

export default function AdminCreateCampaignPage() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLocationSelect = (location) => {
    setForm((prev) => ({
      ...prev,
      location,
    }));
  };

  const handleItemChange = (index, field, value) => {
    setForm((prev) => {
      const updated = [...prev.financialBreakdown];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return {
        ...prev,
        financialBreakdown: updated,
      };
    });
  };

  const handleAddItem = () => {
    setForm((prev) => ({
      ...prev,
      financialBreakdown: [
        ...prev.financialBreakdown,
        {
          itemName: "",
          cost: "",
          description: "",
        },
      ],
    }));
  };

  const handleRemoveItem = (index) => {
    setForm((prev) => ({
      ...prev,
      financialBreakdown: prev.financialBreakdown.filter((_, i) => i !== index),
    }));
  };

  const nextFromStep1 = () => {
    const validationErrors = validateBasicInfo(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setCurrentStep(2);
    }
  };

  const nextFromStep2 = () => {
    const validationErrors = validateMedia(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setCurrentStep(3);
    }
  };

  const nextFromStep3 = () => {
    const validationErrors = validateFinancialBreakdown(form);

    const hasNestedErrors =
      validationErrors.itemErrors?.some((item) => Object.keys(item).length > 0) ||
      false;

    setErrors(validationErrors);

    if (!validationErrors.financialBreakdown && !hasNestedErrors) {
      setCurrentStep(4);
    }
  };

  const handleSubmit = async () => {
    setSubmitError("");

    const basicInfoErrors = validateBasicInfo(form);
    const mediaErrors = validateMedia(form);
    const financialErrors = validateFinancialBreakdown(form);

    const hasFinancialNestedErrors =
      financialErrors.itemErrors?.some((item) => Object.keys(item).length > 0) ||
      false;

    if (
      Object.keys(basicInfoErrors).length > 0 ||
      Object.keys(mediaErrors).length > 0 ||
      financialErrors.financialBreakdown ||
      hasFinancialNestedErrors
    ) {
      setErrors({
        ...basicInfoErrors,
        ...mediaErrors,
        ...financialErrors,
      });
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("sdgGoalNumber", String(form.sdgGoalNumber));
      formData.append("description", form.description);
      formData.append("endDate", form.endDate);
      formData.append("coverImage", form.coverImage);
      formData.append(
        "financialBreakdown",
        JSON.stringify(
          form.financialBreakdown.map((item) => ({
            itemName: item.itemName.trim(),
            cost: Number(item.cost),
            description: item.description.trim(),
          }))
        )
      );
      formData.append(
        "location",
        JSON.stringify({
          locationName: form.location.locationName,
          latitude: Number(form.location.latitude),
          longitude: Number(form.location.longitude),
        })
      );

      await createCampaignApi(formData);
      navigate("/admin/campaigns");
    } catch (error) {
      console.error(error);
      setSubmitError(
        error?.response?.data?.message || "Failed to create campaign"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout title="Create Campaign">
      <CampaignStepper currentStep={currentStep} />

      {currentStep === 1 && (
        <CampaignBasicInfoStep
          form={form}
          errors={errors}
          onChange={updateField}
          onLocationSelect={handleLocationSelect}
          onNext={nextFromStep1}
        />
      )}

      {currentStep === 2 && (
        <CampaignMediaStep
          form={form}
          errors={errors}
          onFileChange={(file) => updateField("coverImage", file)}
          onPrev={() => setCurrentStep(1)}
          onNext={nextFromStep2}
        />
      )}

      {currentStep === 3 && (
        <CampaignFinancialStep
          form={form}
          errors={errors}
          onItemChange={handleItemChange}
          onAddItem={handleAddItem}
          onRemoveItem={handleRemoveItem}
          onPrev={() => setCurrentStep(2)}
          onNext={nextFromStep3}
        />
      )}

      {currentStep === 4 && (
        <CampaignReviewStep
          form={form}
          submitting={submitting}
          submitError={submitError}
          onPrev={() => setCurrentStep(3)}
          onSubmit={handleSubmit}
        />
      )}
    </AdminLayout>
  );
}