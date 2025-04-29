/**
 * 🛠️ Driver Interface
 * 
 * 前端司机模型，映射后端 Mongoose 的 Driver Schema。
 * 
 * 对应后端: /models/Driver.js
 * 使用场景: 注册司机表单、司机列表、编辑司机功能等。
 * 
 * 说明：
 * - id、createdAt、updatedAt 为后端 MongoDB 自动生成字段；
 * - lat 和 lon 为地图位置选取时生成，地址 (address) 由表单填写；
 * - 其他字段由表单输入或 API 返回。
 */
export interface Driver {
  id?: string;
  name: string;
  gender: 'male' | 'female';
  birthYear: number;
  nif: string;
  licenseNumber: string;
  address: {
    street: string;
    number: string;
    postalCode: string;
    city: string;
  };
  lat?: number;
  lon?: number;
  createdAt?: Date;
  updatedAt?: Date;
}