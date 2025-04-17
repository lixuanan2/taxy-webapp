export interface PriceConfig {
    basic: number;         // 基础 €/min 
    luxury: number;        // 豪华 €/min
    nightBonus: number;    // e.g., 20 means 20%
    createdAt?: Date;
}
  