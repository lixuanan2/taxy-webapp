/**
 * 🛠️ PriceConfig Interface
 * 
 * 前端价格配置模型，映射后端 Mongoose 的 Price Schema。
 * 
 * 对应后端: /models/Price.js
 * 使用场景: 设置出租车服务单价 (Price Form)、查看历史价格记录 (Price List)。
 * 
 * 说明：
 * - createdAt 为后端 MongoDB 自动生成字段；
 * - basic 和 luxury 表示不同舒适等级的每分钟价格 (€);
 * - nightBonus 表示夜间附加费百分比，如 20 表示增加 20%。
 */
export interface PriceConfig {
    basic: number;
    luxury: number;
    nightBonus: number;
    createdAt?: Date;
  }
  