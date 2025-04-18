export interface RideRequest {
    _id?: string;             
    nif: string;
    currentLocation: string;
    destination: string;
    peopleCount: number;
    status?: string;          // 后端默认是 'pending'
    createdAt?: string;
  }
  