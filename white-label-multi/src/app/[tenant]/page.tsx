import { getTenantConfig } from '@/lib/tenants';
import FoodAdapter from '@/components/adapters/FoodAdapter';
import FashionAdapter from '@/components/adapters/FashionAdapter';
import PharmacyAdapter from '@/components/adapters/PharmacyAdapter';
import PetshopAdapter from '@/components/adapters/PetshopAdapter'; // NOVO

export default async function Home({ params }: { params: Promise<{ tenant: string }> }) {
  const resolvedParams = await params;
  const config = getTenantConfig(resolvedParams.tenant);

  return (
    <main>
      {config.type === 'food' && <FoodAdapter tenantName={config.name} />}
      {config.type === 'fashion' && <FashionAdapter tenantName={config.name} />}
      {config.type === 'pharmacy' && <PharmacyAdapter tenantName={config.name} />}
      {config.type === 'petshop' && <PetshopAdapter tenantName={config.name} />} {/* NOVO */}
    </main>
  );
}