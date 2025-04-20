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
    lat?: number;   // 为地图服务
    lon?: number; 
    createdAt?: Date;              // 该文档创建时间，用于展示
    updatedAt?: Date;
}