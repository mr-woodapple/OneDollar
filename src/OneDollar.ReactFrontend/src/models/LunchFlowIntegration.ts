export interface LunchFlowIntegration {
    providerId?: number;
    lunchFlowApiKey: string;
    lunchFlowApiUrl: string;
    lastSyncTimestamp?: Date;
}
