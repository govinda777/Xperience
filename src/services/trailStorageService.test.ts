import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TrailStorageService } from './trailStorageService';

describe('TrailStorageService', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it('should return empty session when nothing is stored', () => {
    const session = TrailStorageService.getTrailSession();
    expect(session).toEqual({});
  });

  it('should return default state for new trail', () => {
    const state = TrailStorageService.getTrailState('new-trail');
    expect(state).toEqual({
      currentStepIndex: 0,
      data: {},
      completed: false
    });
  });

  it('should save and retrieve trail state', () => {
    const testState = {
      currentStepIndex: 2,
      data: { step1: { field: 'value' } },
      completed: false
    };

    TrailStorageService.saveTrailState('test-trail', testState);
    const retrieved = TrailStorageService.getTrailState('test-trail');
    expect(retrieved).toEqual(testState);
  });

  it('should update trail data', () => {
    TrailStorageService.updateTrailData('test-trail', 'step1', { name: 'Jules' });
    const state = TrailStorageService.getTrailState('test-trail');
    expect(state.data.step1).toEqual({ name: 'Jules' });
  });

  it('should set current step', () => {
    TrailStorageService.setCurrentStep('test-trail', 5);
    const state = TrailStorageService.getTrailState('test-trail');
    expect(state.currentStepIndex).toBe(5);
  });

  it('should mark trail as completed', () => {
    TrailStorageService.markCompleted('test-trail');
    const state = TrailStorageService.getTrailState('test-trail');
    expect(state.completed).toBe(true);
  });

  it('should clear a specific trail', () => {
    TrailStorageService.saveTrailState('trail1', { currentStepIndex: 1, data: {}, completed: false });
    TrailStorageService.saveTrailState('trail2', { currentStepIndex: 2, data: {}, completed: false });

    TrailStorageService.clearTrail('trail1');

    expect(TrailStorageService.getTrailState('trail1').currentStepIndex).toBe(0);
    expect(TrailStorageService.getTrailState('trail2').currentStepIndex).toBe(2);
  });
});
