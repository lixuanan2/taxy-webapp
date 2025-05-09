/**
 * 🛠️ RideRequest Interface
 *
 * 前端叫车请求模型，映射后端 Mongoose 的 RideRequest Schema。
 *
 * 对应后端: /models/RideRequest.js
 * 使用场景: 客户叫车、等待司机、司机接单、请求历史查看等。
 *
 * 说明：
 * - _id、createdAt 为后端 MongoDB 自动生成字段；
 * - confirmedByClient 用于记录客户是否接受司机提议。
 */

export interface RideRequest {
  _id?: string;
  nif: string;                 // 客户 NIF
  name: string;
  gender: string;
  currentLocation: string;     // 当前地址 (可通过 reverse geocoding 获取)
  destination: string;         // 目的地地址
  peopleCount: number;
  comfortLevel?: string;

  status?: string;             // 请求状态 (pending/accepted/rejected/done)，默认 pending
  driverNIF?: string;           // 接单司机的 ID(或 NIF)

  createdAt?: string;          // 创建时间

  currentLat: number;          // 当前地址纬度
  currentLon: number;          // 当前地址经度
  destLat: number;             // 目的地纬度
  destLon: number;             // 目的地经度

  confirmedByClient?: boolean; // 客户是否确认接受司机
}
