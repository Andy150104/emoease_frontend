// src/stores/usePaymentStore.ts
import apiClient from "EmoEase/hooks/apiClient";
import { create } from "zustand";
import { GetCreatedPatientProfileDto, GetPatientProfilesCreatedEndpointResponse } from "EmoEase/api/api-profile-service";
import { useLoadingStore } from "../Loading/LoadingStore";

interface ProfileState {
  patientProfiles: GetCreatedPatientProfileDto[];
  isLoading: boolean;
  error: string | null;
  fetchProfiles: (
    startTime: string,
    endTime: string,
    pageIndex?: number,
    pageSize?: number
  ) => Promise<GetCreatedPatientProfileDto[] | undefined>;
  fetchProfile: (
    startTime: string,
    endTime: string,
    pageIndex?: number,
    pageSize?: number
  ) => Promise<GetPatientProfilesCreatedEndpointResponse | undefined>;
}

export const useProfilesStore = create<ProfileState>((set) => ({
  patientProfiles: [],
  isLoading: false,
  error: null,

  fetchProfiles: async (startTime, endTime, pageIndex = 1, pageSize = 10) => {
    set({ isLoading: true, error: null });
    try {
      useLoadingStore.getState().showLoading()
      const res = await apiClient.profileService.patients.getPatientProfilesCreated({
        PageIndex: pageIndex,
        PageSize: pageSize,
        StartDate: startTime,
        EndDate: endTime,
      });
      useLoadingStore.getState().hideLoading()
      const profiles = res.data.datapoints ?? [];
      set({ patientProfiles: profiles, isLoading: false });
      return profiles;
    } catch (err) {
      console.error("Error fetching patient profiles:", err);
      set({
        isLoading: false,
      });
      return undefined;
    }
  },
     fetchProfile: async (startTime, endTime, pageIndex = 1, pageSize = 10) => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiClient.profileService.patients.getPatientProfilesCreated({
        PageIndex: pageIndex,
        PageSize: pageSize,
        StartDate: startTime,
        EndDate: endTime,
      });
      set({ isLoading: false });
      return res.data;
    } catch (err) {
      set({ isLoading: false, error: String(err) });
      return undefined;
    }
  },
}));
