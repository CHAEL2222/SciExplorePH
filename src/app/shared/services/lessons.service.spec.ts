import { LessonsService } from './lessons.service';

describe('LessonsService progress', () => {
  beforeEach(() => localStorage.clear());
  it('awards progress once per valid lesson and restores it', () => {
    const service = new LessonsService();
    service.complete('weather');
    service.complete('weather');
    service.complete('unknown');
    expect(service.completed()).toEqual(['weather']);
    expect(new LessonsService().completed()).toEqual(['weather']);
  });
  it('recovers from corrupt stored progress and rejects unknown IDs', () => {
    localStorage.setItem('sciexplore-completed', '{broken');
    expect(new LessonsService().completed()).toEqual([]);
    localStorage.setItem(
      'sciexplore-completed',
      '["weather","weather","unknown",42]',
    );
    expect(new LessonsService().completed()).toEqual(['weather']);
  });
});
