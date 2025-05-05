/**
 * 🕓 UtcToLocalPipe
 *
 * 本管道 (Pipe) 用于将 UTC 时间调整为本地时间，
 * 在前端展示时更符合用户的本地时区习惯。
 *
 * 当前简单处理为：统一减去 1 小时 (适配葡萄牙夏令时)。
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'UtcToLocal'
})
export class UtcToLocalPipe implements PipeTransform {

  /**
   * 🚀 转换方法
   *
   * @param value - 输入的 UTC 时间(Date 或 ISO 字符串)
   * @returns 调整后的本地时间(Date 类型)
   */
  transform(value: Date | string): Date {
    const date = new Date(value);
    date.setHours(date.getHours() - 1); // ❗ 简单减去 1 小时修正
    return date;
  }
}
