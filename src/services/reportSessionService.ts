export interface Report {
  id: string;
  agentId: string;
  agentName: string;
  title: string;
  content: string;
  timestamp: number;
}

const REPORTS_SESSION_KEY = 'xperience_session_reports_v1';

export const ReportSessionService = {
  getReports: (): Report[] => {
    try {
      const stored = sessionStorage.getItem(REPORTS_SESSION_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Error loading reports from sessionStorage', e);
      return [];
    }
  },

  addReport: (report: Report): void => {
    try {
      const reports = ReportSessionService.getReports();
      const updated = [report, ...reports];
      sessionStorage.setItem(REPORTS_SESSION_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving report to sessionStorage', e);
    }
  },

  clearReports: (): void => {
    sessionStorage.removeItem(REPORTS_SESSION_KEY);
  }
};
