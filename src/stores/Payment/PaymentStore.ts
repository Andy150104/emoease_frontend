// src/stores/usePaymentStore.ts
import apiClient from "EmoEase/hooks/apiClient";
import {
  GetAllPaymentsResponse,
  PaymentStatus,
  type DailyRevenue,
} from "EmoEase/api/api-payment-service";
import { create } from "zustand";
import { useLoadingStore } from "../Loading/LoadingStore";

interface PaymentState {
  revenues: DailyRevenue[];
  isLoading: boolean;
  error: string | null;
  fetchDailyRevenue: (startTime: string, endTime: string) => Promise<void>;
  getAllPaymentPatient: (
    pageIndex: number,
    pageSize: number,
    createAt: string | undefined,
    patientProfileId: string,
    status?: PaymentStatus,
  ) => Promise<GetAllPaymentsResponse>;
}

export const usePaymentStore = create<PaymentState>((set) => ({
  revenues: [],
  isLoading: false,
  error: null,

  fetchDailyRevenue: async (startTime, endTime) => {
    set({ isLoading: true, error: null });
    try {
      useLoadingStore.getState().showLoading();
      const res = await apiClient.paymentService.payments.getDailyRevenue({
        startTime,
        endTime,
      });
      set({ revenues: res.data.revenues ?? [], isLoading: false });
      useLoadingStore.getState().hideLoading();
    } catch (err: unknown) {
      console.error("Error fetching daily revenue", err);
      set({
        isLoading: false,
      });
    }
  },
  getAllPaymentPatient: async (
    pageIndex,
    pageSize,
    createAt,
    patientProfileId,
    status,
  ) => {
    try {
      useLoadingStore.getState().showLoading();
      const res = await apiClient.paymentService.payments.getAllPayments({
        CreatedAt: createAt ?? undefined,
        PageIndex: pageIndex,
        PageSize: 100,
        PatientProfileId: patientProfileId ?? "",
        PaymentType: undefined,
        SortOrder: undefined,
        Status: status ?? PaymentStatus.Pending,
      });
      useLoadingStore.getState().hideLoading();
      return res.data;
    } catch (err: unknown) {
      console.error("Error fetching daily revenue", err);
      set({
        isLoading: false,
      });
      return { payments: undefined };
    }
  },
}));
