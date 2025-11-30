import { Component, OnInit, signal } from '@angular/core';
import { Parking } from '../../../services/parking';
import { switchMap } from 'rxjs';
import { ParkingSlot } from '../../../models/parking.model';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-parking-exit',
  imports: [CommonModule],
  templateUrl: './parking-exit.html',
  styleUrl: './parking-exit.css',
})
export class ParkingExit implements OnInit {
  toastMessage = signal<string>('');

// Show toast for 3 seconds
showToast(msg: string) {
  this.toastMessage.set(msg);
  setTimeout(() => this.toastMessage.set(''), 9000);
}
  lastBillInfo = '';
  PARKING_RATE_PER_HOUR = 50
  slots = signal<ParkingSlot[]>([])
  constructor(public parkingService: Parking) { }

  get occupiedSlots() {
    return this.slots().filter(s => s.occupied);
  }
  ngOnInit() {
    this.parkingService.loadSlots().subscribe(
      (res) => this.slots.set(res)
    )
  }
  calculateBill(entryTime?: string): number {
    if (!entryTime) return this.PARKING_RATE_PER_HOUR; // default 1 hour

    const start = new Date(entryTime).getTime();
    const end = Date.now();
    const diffMs = end - start;

    const hours = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60)));
    return hours * this.PARKING_RATE_PER_HOUR;
  }

  exit(slotId: number) {
    const slot = this.slots().find(s => s.id === slotId);
    if (!slot) return;

    const amount = this.calculateBill(slot.entryTime);

    this.parkingService
      .exitVehicle(slotId)
      .pipe(switchMap(() => this.parkingService.loadSlots()))
      .subscribe(() => {
        this.showToast(
        this.lastBillInfo = `Vehicle ${slot.vehicleNumber
          } exited from ${slot.slotNumber}. Bill Amount: ₹${amount}`)
      });
  }
}
