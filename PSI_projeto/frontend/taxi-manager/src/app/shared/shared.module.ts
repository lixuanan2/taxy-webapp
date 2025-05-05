import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapPickerComponent } from './map-picker/map-picker.component';
import { UtcToLocalPipe } from './pipes/UtcToLocal.pipe';

@NgModule({
  declarations: [
    MapPickerComponent,
    UtcToLocalPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MapPickerComponent,       // 导出map以供其他模块使用
    UtcToLocalPipe
  ]
})
export class SharedModule { }
