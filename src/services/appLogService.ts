import { mapToAppLogDTO } from "../mappers/appLogMapper";
import { AppLogStarts } from "../types/supabase";
import { supabase } from "../utils/supabaseClient";
import { AppLogInput } from "../validators/app_logs/appLogsValidator";

export const appLogService = async (
  body: AppLogInput
): Promise<AppLogStarts> => {
  const { app_version, user, device, superwall } = body;

  const { data, error } = await supabase
    .from("app_logs_starts")
    .insert({ app_version, user, device, superwall })
    .select("app_version, user, device, superwall")
    .single();

  if (error) {
    throw new Error("DB: " + error.message);
  }

  const appLog = mapToAppLogDTO(data);
  return appLog as AppLogStarts;
};
