import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../admin/layout/AdminLayout";
import CampaignStepper from "../components/CampaignStepper";
import CampaignBasicInfoStep from "../components/CampaignBasicInfoStep";
import CampaignFinancialStep from "../components/CampaignFinancialStep";
import CampaignReviewStep from "../components/CampaignReviewStep";
import CampaignMediaReadOnlyStep from "../components/CampaignMediaReadOnlyStep";
import {
  validateBasicInfo,
  validateFinancialBreakdown,
} from "../validation";
import {
  addCampaignUpdateFinancialItem,
  removeCampaignUpdateFinancialItem,
  resetCampaignUpdateForm,
  setCampaignUpdateForm,
  updateCampaignUpdateField,
  updateCampaignUpdateFinancialItem,
  updateCampaignUpdateLocation,
} from "../../../store/slices/campaignUpdateSlice";
import { getSingleCampaignApi, updateCampaignApi } from "../api";

export default function UpdateCampaignPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const form = useSelector((state) => state.campaignUpdate);

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    fetchCampaign();

    return () => {
      dispatch(resetCampaignUpdateForm());
    };
  }, [id]);

  const fetchCampaign = async () => {
    try {
      setLoading(true);
      setSubmitError("");

      const response = await getSingleCampaignApi(id);
      const campaign = response?.data;

      dispatch(
        setCampaignUpdateForm({
          title: campaign.title || "",
          sdgGoalNumber: String(campaign.sdgGoalNumber || ""),
          description: campaign.description || "",
          endDate: campaign.endDate ? campaign.endDate.split("T")[0] : "",
          location: {
            locationName: campaign.location?.locationName || "",
            latitude: campaign.location?.latitude ?? null,
            longitude: campaign.location?.longitude ?? null,
          },
          coverImage: campaign.coverImage || {
            secure_url: "",
            public_id: "",
          },
          financialBreakdown:
            campaign.financialBreakdown?.length > 0
              ? campaign.financialBreakdown.map((item) => ({
                  itemName: item.itemName || "",
                  cost: item.cost || "",
                  description: item.description || "",
                }))
              : [
                  {
                    itemName: "",
                    cost: "",
                    description: "",
                  },
                ],
        })
      );
    } catch (error) {
      console.error(error);
      setSubmitError(
        error?.response?.data?.message || "Failed to load campaign details"
      );
    } finally {
      setLoading(false);
    }
  };

  const nextFromStep1 = () => {
    const validationErrors = validateBasicInfo(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setCurrentStep(2);
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
    const financialErrors = validateFinancialBreakdown(form);

    const hasFinancialNestedErrors =
      financialErrors.itemErrors?.some((item) => Object.keys(item).length > 0) ||
      false;

    if (
      Object.keys(basicInfoErrors).length > 0 ||
      financialErrors.financialBreakdown ||
      hasFinancialNestedErrors
    ) {
      setErrors({
        ...basicInfoErrors,
        ...financialErrors,
      });
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        title: form.title,
        sdgGoalNumber: Number(form.sdgGoalNumber),
        description: form.description,
        endDate: form.endDate,
        location: {
          locationName: form.location.locationName,
          latitude: Number(form.location.latitude),
          longitude: Number(form.location.longitude),
        },
        financialBreakdown: form.financialBreakdown.map((item) => ({
          itemName: item.itemName.trim(),
          cost: Number(item.cost),
          description: item.description.trim(),
        })),
      };

      await updateCampaignApi(id, payload);

      navigate(`/admin/campaigns/${id}`);
    } catch (error) {
      console.error(error);
      setSubmitError(
        error?.response?.data?.message || "Failed to update campaign"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Update Campaign">
        <div className="rounded-[24px] border border-slate-200 bg-white px-6 py-8 text-sm text-slate-500 shadow-sm">
          Loading campaign details...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Update Campaign">
      <CampaignStepper currentStep={currentStep} />

      {currentStep === 1 && (
        <CampaignBasicInfoStep
          form={form}
          errors={errors}
          onChange={(field, value) =>
            dispatch(updateCampaignUpdateField({ field, value }))
          }
          onLocationSelect={(location) =>
            dispatch(updateCampaignUpdateLocation(location))
          }
          onNext={nextFromStep1}
        />
      )}

      {currentStep === 2 && (
        <CampaignMediaReadOnlyStep
          coverImageUrl={form.coverImage?.secure_url}
          onPrev={() => setCurrentStep(1)}
          onNext={() => setCurrentStep(3)}
        />
      )}

      {currentStep === 3 && (
        <CampaignFinancialStep
          form={form}
          errors={errors}
          onItemChange={(index, field, value) =>
            dispatch(updateCampaignUpdateFinancialItem({ index, field, value }))
          }
          onAddItem={() => dispatch(addCampaignUpdateFinancialItem())}
          onRemoveItem={(index) =>
            dispatch(removeCampaignUpdateFinancialItem(index))
          }
          onPrev={() => setCurrentStep(2)}
          onNext={nextFromStep3}
        />
      )}

      {currentStep === 4 && (
        <CampaignReviewStep
          form={{
            ...form,
            coverImage: form.coverImage?.secure_url ? { name: "Existing image" } : null,
          }}
          submitting={submitting}
          submitError={submitError}
          onPrev={() => setCurrentStep(3)}
          onSubmit={handleSubmit}
          submitButtonText="Update Campaign"
        />
      )}
    </AdminLayout>
  );
}