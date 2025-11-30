import { Component, computed, effect, ElementRef, inject, OnInit, signal, ViewChild, viewChild } from '@angular/core';
import { Parking } from '../../../services/parking';
import { ParkingSlot } from '../../../models/parking.model';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables)
@Component({
  selector: 'app-parking-dashboard',
  imports: [],
  templateUrl: './parking-dashboard.html',
  styleUrl: './parking-dashboard.css',
})

export class ParkingDashboard implements OnInit {

  @ViewChild('Canvas') canvas!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;

  constructor(private parkingService: Parking) {
    // AUTO UPDATE CHART WHEN DATA CHANGES

  }

  slots = signal<ParkingSlot[]>([]);
  totalSlots = computed(() => this.slots().length);
  occupiedSlots = computed(() => this.slots().filter(s => s.occupied).length);
  freeSlots = computed(() => this.totalSlots() - this.occupiedSlots());

  pieLabels = computed(() => ['Occupied', 'Available']);
  pieData = computed(() => [this.occupiedSlots(), this.freeSlots()]);

  ngOnInit() {
    this.parkingService.loadSlots().subscribe(res => {
      this.slots.set(res);
      this.createChart();      // API DATA LOADED
    });

  }

  createChart() {
    if (this.chart) {
      this.chart.destroy();   // Destroy old chart to avoid duplicates
    }
    const devicePixelRatio = window.devicePixelRatio || 1;

    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'bar',
      data: {
        labels: this.pieLabels(),
        datasets: [
          {
            label: 'Slots',
            data: this.pieData(),
            backgroundColor: [
              'rgba(248, 67, 106, 0.8)', // Color for the first bar/point
              'rgba(27, 240, 98, 0.8)', // Color for the second
              'rgba(255, 206, 86, 0.5)'  // Color for the third
            ],
          },

        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        devicePixelRatio: devicePixelRatio,   // 👈 HIGH RESOLUTION
      }
    });
  }
}
