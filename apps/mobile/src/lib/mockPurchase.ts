export type PurchaseStatus = 'pending' | 'success' | 'failed';

export async function startPurchase(packId: string): Promise<{ purchaseId: string; status: PurchaseStatus; amountCents: number }> {
  return { purchaseId: `pc_${Date.now()}`, status: 'pending', amountCents: 499 };
}

export function simulateStatus(onUpdate: (status: PurchaseStatus) => void) {
  setTimeout(() => onUpdate('success'), 1200);
}
