import { Component, signal } from '@angular/core';
import { Parking } from '../../../services/parking';
import { ParkingSlot } from '../../../models/parking.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-parking-entry',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './parking-entry.html',
  styleUrl: './parking-entry.css',
})
export class ParkingEntry {

  // Signals for toast + slots
  toastMessage = signal<string>('');
  slots = signal<ParkingSlot[]>([]);

  entryForm = new FormGroup({
    vehicleNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(/[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}/)
    ])
  });

  constructor(public parkingService: Parking) {}

  ngOnInit() {
    this.loadSlots();  // 👈 Use reusable method
  }

  loadSlots() {
    this.parkingService.loadSlots().subscribe(res => {
      this.slots.set(res);   // UI UPDATES HERE
    });
  }

  get freeSlots() {
    return this.slots().filter(s => !s.occupied);
  }

  assignVehicle(slotId: number) {
    if (this.entryForm.invalid) return;
    const vehicle = this.entryForm.value.vehicleNumber as string;

    this.parkingService.addVehicle(slotId, vehicle).subscribe(() => {
      this.loadSlots();             // 🔥 FIX — Reload slots correctly
      this.entryForm.reset();
      this.showToast(`Vehicle ${vehicle} parked in slot ${slotId}`);
    });
  }

  showToast(msg: string) {
    this.toastMessage.set(msg);
    setTimeout(() => this.toastMessage.set(''), 3000);
  }
}
