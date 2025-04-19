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
}