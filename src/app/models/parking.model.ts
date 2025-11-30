export interface ParkingSlot {
  id: number;
  slotNumber: string;
  occupied: boolean;
  vehicleNumber?: string;
  entryTime?: string; // ISO string
}