import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapPickerComponent } from './map-picker/map-picker.component';

@NgModule({
  declarations: [MapPickerComponent],
  imports: [CommonModule],
  exports: [MapPickerComponent]  // 导出map以供其他模块使用
})
export class SharedModule { }
