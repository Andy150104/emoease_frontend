import { create } from "zustand";
import apiClient from "EmoEase/hooks/apiClient";
import {
  UpdateServicePackageDto,
  SubscriptionStatus,
  ServicePackageDto,
  ServicePackageWithTotal,
} from "EmoEase/api/api-subscription-service";
import { useLoadingStore } from "../Loading/LoadingStore";

// --- Types ---
export interface UserSubscriptionsTotalResponse {
  totalCount: number;
}

export interface ServicePackage {
  id: string;
  name: string;
  totalSubscriptions: number;
  isActive?: boolean;
}

export interface ServicePackageTotal {
  id: string;
  name: string;
  totalSubscriptions: number;
}

export interface UpdateServicePackageResponse {
  isSuccess: boolean;
}

interface SubscriptionState {
  totalUserSubscriptions: number;
  servicePackages: ServicePackage[];
  servicePackagesTotal: ServicePackageTotal[];
  isLoading: boolean;
  error: string | null;
  fetchTotalUserSubscriptions: (params: {
    startDate: string;
    endDate: string;
    patientId?: string;
    status?: SubscriptionStatus;
  }) => Promise<void>;
  fetchServicePackages: (params: {
    PageIndex?: number;
    PageSize?: number;
    Search?: string;
    Status?: boolean;
    PatientId?: string;
  }) => Promise<void>;
  fetchServicePackagesTotal: (params: {
    startDate: string;
    endDate: string;
  }) => Promise<void>;
  updateServicePackage: (
    id: string,
    data: UpdateServicePackageDto,
  ) => Promise<boolean>;
}

// --- Store ---
export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  totalUserSubscriptions: 0,
  servicePackages: [],
  servicePackagesTotal: [],
  isLoading: false,
  error: null,

  fetchTotalUserSubscriptions: async (params) => {
    set({ isLoading: true, error: null });
    try {
      useLoadingStore.getState().showLoading();
      const res =
        await apiClient.subscriptionService.userSubscriptions.getTotalUserSubscriptions(
          params,
        );
      set({
        totalUserSubscriptions: res.data.totalCount ?? 0,
        isLoading: false,
      });
      useLoadingStore.getState().hideLoading();
    } catch (err) {
      set({ isLoading: false, error: String(err) });
      useLoadingStore.getState().hideLoading();
    }
  },

  fetchServicePackages: async (params) => {
    set({ isLoading: true, error: null });
    try {
      useLoadingStore.getState().showLoading();
      const res =
        await apiClient.subscriptionService.servicePackages.getServicePackages({
          PageIndex: 1,
          PageSize: 100,
          ...params,
        });
      let packages: ServicePackage[] = [];
      if (
        res.data &&
        res.data.servicePackages &&
        Array.isArray(res.data.servicePackages.data)
      ) {
        packages = res.data.servicePackages.data.map(
          (pkg: ServicePackageDto) => ({
            id: pkg.id ?? "",
            name: pkg.name ?? "",
            totalSubscriptions: 0, // Not available in this endpoint
            isActive: pkg.isActive,
          }),
        );
      }
      set({
        servicePackages: packages,
        isLoading: false,
      });
      useLoadingStore.getState().hideLoading();
    } catch (err) {
      set({ isLoading: false, error: String(err) });
      useLoadingStore.getState().hideLoading();
    }
  },

  fetchServicePackagesTotal: async (params: {
    startDate: string;
    endDate: string;
  }) => {
    set({ isLoading: true, error: null });
    try {
      useLoadingStore.getState().showLoading();
      const res =
        await apiClient.subscriptionService.servicePackages.getTotalServicePackages(
          params,
        );
      let packages: ServicePackageTotal[] = [];
      if (Array.isArray(res.data)) {
        packages = res.data.map((pkg: ServicePackageWithTotal) => ({
          id: pkg.id ?? "",
          name: pkg.name ?? "",
          totalSubscriptions: pkg.totalSubscriptions ?? 0,
        }));
      }
      set({
        servicePackagesTotal: packages,
        isLoading: false,
      });
      useLoadingStore.getState().hideLoading();
    } catch (err) {
      set({ isLoading: false, error: String(err) });
      useLoadingStore.getState().hideLoading();
    }
  },

  updateServicePackage: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      useLoadingStore.getState().showLoading();
      const res =
        await apiClient.subscriptionService.servicePackages.updateServicePackage(
          id,
          data,
        );
      set({ isLoading: false });
      useLoadingStore.getState().hideLoading();
      return res.data.isSuccess ?? false;
    } catch (err) {
      set({ isLoading: false, error: String(err) });
      useLoadingStore.getState().hideLoading();
      return false;
    }
  },
}));
