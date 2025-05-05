/**
 * 📄 Turn Model
 *
 * 本接口定义了 Turn(班次)的数据结构，
 * 用于描述司机、出租车、时间段等核心信息。
 */

export interface Turn {
  driverNIF: string;
  taxiPlate: string;
  startTime: Date | string;
  endTime: Date | string;
  createdAt?: Date;
}
