import { Component, signal } from '@angular/core';
import { Parking } from '../../../services/parking';
import { ParkingSlot } from '../../../models/parking.model';
import { switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
@Component({
  selector: 'app-parking-entry',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './parking-entry.html',
  styleUrl: './parking-entry.css',
})
export class ParkingEntry {
  // 👇 Add this at top of the class
toastMessage = signal<string>('');

// Show toast for 3 seconds
showToast(msg: string) {
  this.toastMessage.set(msg);
  setTimeout(() => this.toastMessage.set(''), 9000);
}
slots = signal<ParkingSlot[]>([]);
 message = '';
  entryForm = new FormGroup({
    vehicleNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(/[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}/)  // Format: TN09AB1234
    ])
  });

  constructor(public parkingService: Parking) {}

  get freeSlots() {
    return this.slots().filter(s => !s.occupied);
  }

  ngOnInit() {
    this.parkingService.loadSlots().subscribe(res => {
      this.slots.set(res);    // API DATA LOADED
    });
  }

  assignVehicle(slotId: number) {
    if (this.entryForm.invalid) return;
    const vehicle = this.entryForm.value.vehicleNumber as string;

    this.parkingService.addVehicle(slotId, vehicle).subscribe(() => {
      this.parkingService.loadSlots().subscribe();
      this.entryForm.reset();
      this.showToast(`Vehicle ${vehicle} parked in slot ${slotId}`);
    });
  }
}
