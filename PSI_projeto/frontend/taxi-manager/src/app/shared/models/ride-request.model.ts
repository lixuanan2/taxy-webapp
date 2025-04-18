export interface RideRequest {
    _id?: string;             
    nif: string;
    gender: string;
    currentLocation: string;
    destination: string;
    peopleCount: number;
    status?: string;          // 后端默认是 'pending'
    driverId?: string;
    createdAt?: string;
  }
  