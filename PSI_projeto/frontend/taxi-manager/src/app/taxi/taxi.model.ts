export interface Taxi {
    id?: string;                   // 对应MongoDB的_id
    plate: string;                          // 车牌号
    brand: string;                          // 品牌
    model: string;                          // 型号
    year: number;                           // 购买年份
    comfortLevel: 'basic' | 'luxury';       // 舒适度
    createdAt?: Date;              // 该文档创建时间，用于展示
}
  