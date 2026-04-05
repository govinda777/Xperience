import { TrailState, TrailSession } from '../types/trails';

const TRAILS_SESSION_KEY = 'xperience_trails_session';

export const TrailStorageService = {
  getTrailSession(): TrailSession {
    try {
      const data = sessionStorage.getItem(TRAILS_SESSION_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error('Failed to load trails from session storage', e);
      return {};
    }
  },

  getTrailState(trailId: string): TrailState {
    const session = this.getTrailSession();
    return session[trailId] || {
      currentStepIndex: 0,
      data: {},
      completed: false
    };
  },

  saveTrailState(trailId: string, state: TrailState): void {
    try {
      const session = this.getTrailSession();
      session[trailId] = state;
      sessionStorage.setItem(TRAILS_SESSION_KEY, JSON.stringify(session));
    } catch (e) {
      console.error('Failed to save trail state to session storage', e);
    }
  },

  updateTrailData(trailId: string, stepId: string, stepData: any): void {
    const state = this.getTrailState(trailId);
    state.data[stepId] = stepData;
    this.saveTrailState(trailId, state);
  },

  setCurrentStep(trailId: string, index: number): void {
    const state = this.getTrailState(trailId);
    state.currentStepIndex = index;
    this.saveTrailState(trailId, state);
  },

  markCompleted(trailId: string): void {
    const state = this.getTrailState(trailId);
    state.completed = true;
    this.saveTrailState(trailId, state);
  },

  clearTrail(trailId: string): void {
    try {
      const session = this.getTrailSession();
      delete session[trailId];
      sessionStorage.setItem(TRAILS_SESSION_KEY, JSON.stringify(session));
    } catch (e) {
      console.error('Failed to clear trail from session storage', e);
    }
  },

  clearAllTrails(): void {
    sessionStorage.removeItem(TRAILS_SESSION_KEY);
  }
};
