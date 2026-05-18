import { Linking, Platform } from 'react-native';

import { apiRequest } from '@/services/apiClient';
import { smokeRadarEndpoints } from '@/services/apiConfig';

const privacyPolicyUrl = 'https://smoke-radar-app.onrender.com/privacy';

export type FeedbackPayload = {
  source: string;
  message: string;
  contact?: string;
};

export async function submitFeedback(payload: FeedbackPayload) {
  return apiRequest<{ ok: boolean; id: string }>(smokeRadarEndpoints.feedback, {
    method: 'POST',
    body: {
      ...payload,
      platform: Platform.OS,
    },
  });
}

export function openPrivacyPolicy() {
  return Linking.openURL(privacyPolicyUrl);
}
