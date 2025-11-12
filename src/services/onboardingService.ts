import { supabase } from "../utils/supabaseClient";
import { GlobalResponse } from "../models/globalResponseModel";
import { Onboarding } from "../types/supabase";
import { OnboardingInput } from "../validators/onboarding/onboardingValidator";

export const createOnboardingService = async (
  userId: string,
  data: OnboardingInput
): Promise<GlobalResponse> => {
  const { data: inserted, error } = await supabase
    .from("onboarding")
    .insert({
      user_id: userId,
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.log("error in createOnboardingService->", error);
    
    return {
      ok: false,
      message: "El usuario ya tiene un onboarding creado",
      data: null,
      dateTime: new Date().toISOString(),
      detail: error.message,
    };
  }

  return {
    ok: true,
    message: "Onboarding created successfully",
    data: inserted as Onboarding,
    dateTime: new Date().toISOString(),
    detail: "Onboarding record created successfully",
  };
};

export const getOnboardingByUserIdService = async (
  userId: string
): Promise<GlobalResponse> => {
  const { data, error } = await supabase
    .from("onboarding")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) {
    return {
      ok: false,
      message: "Onboarding not found",
      data: null,
      dateTime: new Date().toISOString(),
      detail: error?.message ?? "No onboarding record found",
    };
  }

  return {
    ok: true,
    message: "Onboarding fetched successfully",
    data: data as Onboarding,
    dateTime: new Date().toISOString(),
    detail: "Onboarding record returned successfully",
  };
};

export const updateOnboardingService = async (
  userId: string,
  data: OnboardingInput
): Promise<GlobalResponse> => {
  const { data: updated, error } = await supabase
    .from("onboarding")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    return {
      ok: false,
      message: "Error updating onboarding record",
      data: null,
      dateTime: new Date().toISOString(),
      detail: error.message,
    };
  }

  return {
    ok: true,
    message: "Onboarding updated successfully",
    data: updated as Onboarding,
    dateTime: new Date().toISOString(),
    detail: "Onboarding record updated successfully",
  };
};