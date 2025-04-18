export interface Trip {
    _id?: string;
    driverName: string;
    clientNIF: string;
    from: string;
    to: string;
    startTime: Date;
    endTime: Date;
    price: number;
    vehiclePlate?: string;
    createdAt?: Date;
  }
  