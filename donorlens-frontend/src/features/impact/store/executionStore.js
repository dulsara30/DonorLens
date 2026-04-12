import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import * as executionApi from "../api";

/**
 * Execution Store using Zustand
 * Manages campaign executions state and API calls
 */
export const useExecutionStore = create(
  devtools(
    persist(
      (set, get) => ({
        // State
        campaigns: [],
        executions: [],
        selectedCampaignId: null,
        campaign: null, // Currently selected campaign info
        summary: null, // Campaign summary stats
        loading: false,
        error: null,

        // Actions - Campaign Management
        setCampaigns: (campaigns) => set({ campaigns }),
        setSelectedCampaignId: (campaignId) =>
          set({ selectedCampaignId: campaignId }),
        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),

        // Actions - Fetch Campaigns
        fetchCampaigns: async (campaigns) => {
          set({ loading: true, error: null });
          try {
            // campaigns are passed from parent, store them
            set({ campaigns });
          } catch (error) {
            set({ error: error.message });
          } finally {
            set({ loading: false });
          }
        },

        // Actions - Execution Management
        setExecutions: (executions) => set({ executions }),

        fetchExecutions: async (campaignId) => {
          set({ loading: true, error: null });
          try {
            const response = await executionApi.getExecutions(campaignId);
            console.log("🔍 Full axios response:", response);
            console.log("📊 response.data:", response?.data);
            console.log("📊 response.data.data:", response?.data?.data);

            // Axios wraps response in .data, then backend wraps again
            // So: response.data.data = { campaign, summary, executions }
            const backendData = response?.data?.data || response?.data || {};
            const executionsData = backendData?.executions || [];
            const campaignData = backendData?.campaign || null;
            const summaryData = backendData?.summary || null;

            console.log("✅ Executions extracted:", executionsData);
            console.log("📊 Campaign data:", campaignData);
            console.log("📊 Summary data:", summaryData);
            console.log("📊 Total executions:", executionsData.length);

            set({
              executions: executionsData,
              campaign: campaignData,
              summary: summaryData,
              selectedCampaignId: campaignId,
            });
          } catch (error) {
            console.error("❌ Error fetching executions:", error);
            set({
              error:
                error?.response?.data?.message || "Failed to fetch executions",
            });
          } finally {
            set({ loading: false });
          }
        },

        createExecution: async (executionData) => {
          set({ loading: true, error: null });
          try {
            const campaignId = get().selectedCampaignId;
            const formData = new FormData();
            formData.append("title", executionData.title);
            formData.append("date", executionData.date);
            formData.append("description", executionData.description);
            formData.append("fundsUsed", executionData.fundsUsed);

            // Add evidence photos
            if (executionData.evidencePhotos) {
              executionData.evidencePhotos.forEach((photo) => {
                formData.append("evidencePhotos", photo);
              });
            }

            // Add receipts
            if (executionData.receipts) {
              executionData.receipts.forEach((receipt) => {
                formData.append("receipts", receipt);
              });
            }

            const response = await executionApi.createExecution(
              campaignId,
              formData,
            );
            const newExecution = response?.data;

            set((state) => ({
              executions: [...state.executions, newExecution],
            }));

            return newExecution;
          } catch (error) {
            const errorMsg =
              error?.response?.data?.message || "Failed to create execution";
            set({ error: errorMsg });
            throw error;
          } finally {
            set({ loading: false });
          }
        },

        deleteExecution: async (executionId) => {
          set({ loading: true, error: null });
          try {
            const campaignId = get().selectedCampaignId;
            await executionApi.deleteExecution(campaignId, executionId);
            set((state) => ({
              executions: state.executions.filter(
                (exe) => exe._id !== executionId,
              ),
            }));
          } catch (error) {
            const errorMsg =
              error?.response?.data?.message || "Failed to delete execution";
            set({ error: errorMsg });
            throw error;
          } finally {
            set({ loading: false });
          }
        },

        updateExecution: async (campaignId, executionId, updateData) => {
          set({ loading: true, error: null });
          try {
            const response = await executionApi.updateExecution(
              campaignId,
              executionId,
              updateData,
            );
            const updatedExecution = response?.data;

            set((state) => ({
              executions: state.executions.map((exe) =>
                exe._id === executionId ? updatedExecution : exe,
              ),
            }));

            return updatedExecution;
          } catch (error) {
            const errorMsg =
              error?.response?.data?.message || "Failed to update execution";
            set({ error: errorMsg });
            throw error;
          } finally {
            set({ loading: false });
          }
        },

        // Clear state
        clearExecutionStore: () =>
          set({
            campaigns: [],
            executions: [],
            selectedCampaignId: null,
            loading: false,
            error: null,
          }),
      }),
      {
        name: "execution-store", // persist to localStorage
      },
    ),
  ),
);
