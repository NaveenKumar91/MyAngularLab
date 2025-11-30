import { Component, computed, Signal, signal } from '@angular/core';
import { Parking } from '../../../services/parking';
import { ParkingSlot } from '../../../models/parking.model';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-slot-status',
  imports: [CommonModule],
  templateUrl: './slot-status.html',
  styleUrl: './slot-status.css',
})
export class SlotStatus {
  // search + pagination signals
  slots = signal<ParkingSlot[]>([])
  searchTerm = signal<string>('');
  currentPage = signal<number>(1);
  readonly pageSize = 7;

  constructor(public parkingService: Parking) { }

  ngOnInit() {
    this.parkingService.loadSlots().subscribe(
      (res)=>this.slots.set(res)
    );
  }

  filteredSlots = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.slots();

    return this.slots().filter(slot =>
    (slot.slotNumber?.toLowerCase().includes(term) ||
      slot.vehicleNumber?.toLowerCase().includes(term))
    );
  });

  totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredSlots().length / this.pageSize))
  );

  pagedSlots = computed(() => {
    const page = this.currentPage();
    const start = (page - 1) * this.pageSize;
    return this.filteredSlots().slice(start, start + this.pageSize);
  });

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  nextPage() {
    this.goToPage(this.currentPage() + 1);
  }

  prevPage() {
    this.goToPage(this.currentPage() - 1);
  }

  refresh() {
    this.parkingService.loadSlots().subscribe();
  }
}
