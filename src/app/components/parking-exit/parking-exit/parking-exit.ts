import { Component, computed, OnInit, signal } from '@angular/core';
import { Parking } from '../../../services/parking';
import { ParkingSlot } from '../../../models/parking.model';
import { switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-parking-exit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './parking-exit.html',
  styleUrl: './parking-exit.css',
})
export class ParkingExit implements OnInit {
  
  /** 🔔 Toast Message */
  toastMessage = signal<string>('');

  showToast(msg: string) {
    this.toastMessage.set(msg);
    setTimeout(() => this.toastMessage.set(''), 3000);
  }

  /** 🔎 Search & Pagination */
  searchTerm = signal<string>('');
  currentPage = signal<number>(1);
  readonly pageSize = 5;

  /** 💰 Parking Rate */
  readonly PARKING_RATE_PER_HOUR = 50;
  lastBillInfo = '';

  /** 🚗 Slots Data */
  slots = signal<ParkingSlot[]>([]);

  constructor(private parkingService: Parking) {}

  /** Load Slots on Init */
  ngOnInit() {
    this.loadSlots();
  }

  loadSlots() {
    this.parkingService.loadSlots().subscribe(res => {
      this.slots.set(res);
    });
  }

  /** 🟠 Only Show Occupied Slots */
  get occupiedSlots() {
    return this.slots().filter(s => s.occupied);
  }

  /** 🔍 Filtered Slots */
  filteredSlots = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) return this.occupiedSlots;
    
    return this.occupiedSlots.filter(slot =>
      slot.slotNumber?.toLowerCase().includes(term) ||
      slot.vehicleNumber?.toLowerCase().includes(term)
    );
  });

  /** 📄 Pagination Logic */
  totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredSlots().length / this.pageSize))
  );

  pagedSlots = computed(() => {
    const page = this.currentPage();
    const start = (page - 1) * this.pageSize;
    return this.filteredSlots().slice(start, start + this.pageSize);
  });

  nextPage() { this.goToPage(this.currentPage() + 1); }
  prevPage() { this.goToPage(this.currentPage() - 1); }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  /** 💵 Billing Calculation */
  calculateBill(entryTime?: string): number {
    if (!entryTime) return this.PARKING_RATE_PER_HOUR;   // Default 1 hour if no time found

    const start = new Date(entryTime).getTime();         // Entry Time
    const end = Date.now();                              // Current Time
    const diffMs = end - start;
    
    const hours = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60)));  // Convert ms → hours
    return hours * this.PARKING_RATE_PER_HOUR;
  }

  /** 🚗 Vehicle Exit + Billing */
  exit(slotId: number) {
    const slot = this.slots().find(s => s.id === slotId);
    if (!slot) return;

    const amount = this.calculateBill(slot.entryTime);

    this.parkingService
      .exitVehicle(slotId)
      .pipe(switchMap(() => this.parkingService.loadSlots()))
      .subscribe((res) => {
        this.slots.set(res); // 👈 UPDATE UI
        this.lastBillInfo = `Vehicle ${slot.vehicleNumber} exited from ${slot.slotNumber}. Bill: ₹${amount}`;
        this.showToast(this.lastBillInfo);
      });
  }
}
