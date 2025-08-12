import handler from '../pages/api/creator/[...path]';
import axios from 'axios';

jest.mock('axios');

function createMockRes() {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('Next.js API proxy to creator-service', () => {
  it('forwards Authorization from access_token cookie', async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios> as any;
    const mockRequest = jest.fn().mockResolvedValue({ status: 200, data: { ok: true } });
    mockedAxios.create = jest.fn().mockReturnValue({ request: mockRequest });

    const req: any = {
      method: 'POST',
      query: { path: ['packs', 'p1', 'reviews'] },
      body: { rating: 5 },
      cookies: { access_token: 'abc.def' },
    };
    const res: any = createMockRes();

    await handler(req, res);

    expect(mockRequest).toHaveBeenCalled();
    const args = mockRequest.mock.calls[0][0];
    expect(args.headers.Authorization).toBe('Bearer abc.def');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ ok: true });
  });
});
