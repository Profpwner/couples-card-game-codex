import dynamic from 'next/dynamic';
import Layout from '../components/Layout';
import { RequireAuth } from '../components/AuthContext';

const PackBuilder = dynamic(() => import('../components/PackBuilder'), { ssr: false });

export default function Dashboard() {
  return (
    <RequireAuth>
      <Layout>
        <h1>Creator Dashboard</h1>
        <PackBuilder />
      </Layout>
    </RequireAuth>
  );
}