/**
 * 🧾 Invoice Interface
 *
 * 前端发票 (Invoice) 模型，映射后端 Mongoose 的 Invoice Schema。
 *
 * 对应后端: /models/Invoice.js
 * 使用场景: 创建发票、发票列表、发票详情展示等。
 *
 * 说明：
 * - invoiceId (MongoDB _id) 和 invoiceNumber (自动生成的发票编号) 是后端返回的；
 * - 其余字段由表单输入或业务逻辑传递。
 */
export interface Invoice {
  tripId: string;           // 关联的旅程ID
  driverName: string;
  clientNIF: string;
  date: string;             // 发票生成时间(ISO字符串)
  total: number;            // 旅程费用总价
  invoiceId?: string;       // MongoDB中的发票ID (_id)
  sequenceNumber?: number;  // 发票序号 (后端自动生成)
}
