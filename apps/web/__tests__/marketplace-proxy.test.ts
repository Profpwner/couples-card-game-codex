import handler from '../pages/api/marketplace/[...path]';
import axios from 'axios';

jest.mock('axios');

function createMockRes() {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.setHeader = jest.fn();
  return res;
}

describe('Next.js API proxy to marketplace (GET)', () => {
  it('proxies GET /packs', async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios> as any;
    const mockRequest = jest.fn().mockResolvedValue({ status: 200, data: [{ pack_id: 'p1' }] });
    mockedAxios.create = jest.fn().mockReturnValue({ request: mockRequest });

    const req: any = {
      method: 'GET',
      query: { path: ['packs'] },
    };
    const res: any = createMockRes();

    await handler(req, res);

    expect(mockRequest).toHaveBeenCalledWith(expect.objectContaining({ method: 'GET' }));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ pack_id: 'p1' }]);
  });

  it('rejects non-GET methods', async () => {
    const req: any = { method: 'POST', query: { path: ['packs'] } };
    const res: any = createMockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });
});

