// Silence noisy console errors from react-beautiful-dnd in tests
const originalError = console.error;
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation((...args: any[]) => {
    const msg = args[0];
    if (
      typeof msg === 'string' &&
      (
        msg.includes('react-beautiful-dnd') ||
        msg.includes('Invariant failed') ||
        msg.includes('not wrapped in act') ||
        msg.includes('Invalid hook call')
      )
    ) {
      return;
    }
    // @ts-ignore - forward to original
    originalError(...args);
  });
});

afterAll(() => {
  (console.error as jest.Mock | any).mockRestore?.();
});
