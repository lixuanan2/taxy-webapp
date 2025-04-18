export interface Trip {
    _id?: string;
    driverName: string;
    driverNIF: string;
    clientNIF: string;
    from: string;
    to: string;
    startTime: Date;
    endTime: Date;
    price: number;
    vehiclePlate?: string;
    peopleCount: number;
    sequenceNumber: number;
    createdAt?: Date;

    invoiceId?: string;
  }
  