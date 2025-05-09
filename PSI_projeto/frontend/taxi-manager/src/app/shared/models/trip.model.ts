/**
 * 📄 Trip Model
 *
 * 本接口定义了 Trip(旅程)的数据结构，
 * 包括司机、客户、起止地点、时间、价格、车辆信息等核心字段。
 *
 * 用途: 统一旅程数据的前后端交互结构。
 */

export interface Trip {
    _id?: string;
    driverName: string;
    driverNIF: string;
    clientName?: string;
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

    fromLat?: number;
    fromLon?: number;
    toLat?: number;
    toLon?: number;
    kmTraveled?: number;
  }
