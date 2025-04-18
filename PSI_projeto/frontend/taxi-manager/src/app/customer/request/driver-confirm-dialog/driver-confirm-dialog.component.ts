import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-driver-confirm-dialog',
  templateUrl: './driver-confirm-dialog.component.html',
  styleUrls: ['./driver-confirm-dialog.component.css']
})
export class DriverConfirmDialogComponent {
  @Input() driverName: string = '';
  @Input() distance: string | null = null;
  @Input() eta: string | null = null;
  @Input() estimatedPrice: string | null = null;
  @Input() taxiInfo: string | null = null;

  @Output() accept = new EventEmitter<void>();
  @Output() reject = new EventEmitter<void>();
}
