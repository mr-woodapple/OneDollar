export interface LunchFlowIntegration {
    providerId?: number;
    lunchFlowApiKey: string;
    lunchFlowApiUrl: string;
    lastRunTimestamp?: Date;
}
