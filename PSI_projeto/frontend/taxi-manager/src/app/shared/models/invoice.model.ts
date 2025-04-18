export interface Invoice {
    tripId: string;
    driverName: string;
    clientNIF: string;
    date: string;
    total: number;
    invoiceId?: string;
    invoiceNumber?: number;  // 后端生成
}
  