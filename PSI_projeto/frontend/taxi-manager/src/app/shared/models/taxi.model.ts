/**
 * 🛠️ Taxi Interface
 * 
 * 前端出租车模型，映射后端 Mongoose 的 Taxi Schema。
 * 
 * 对应后端: /models/Taxi.js
 * 使用场景: 注册出租车表单、出租车列表、编辑出租车功能等。
 * 
 * 说明：
 * - id、createdAt、updatedAt 为后端 MongoDB 自动生成字段；
 * - 其余字段由表单用户输入，或通过 API 请求传输。
 */
export interface Taxi {
    id?: string; // MongoDB _id
    plate: string;
    brand: string;
    model: string;
    year: number;
    comfortLevel: 'basic' | 'luxury';
    createdAt?: Date;
    updatedAt?: Date;
  }
  