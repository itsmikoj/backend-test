type AppLogsStartsEntity = {
  app_version?: string;
  user?: string;
  device?: string;
  superwall?: string;
};

export function mapToAppLogDTO(appLogResponse: AppLogsStartsEntity) {
  return {
    app_version: appLogResponse.app_version || "Not provided",
    user: appLogResponse.user || "Not provided",
    device: appLogResponse.device || "Not provided",
    superwall: appLogResponse.superwall || "Not provided",
  };
}
