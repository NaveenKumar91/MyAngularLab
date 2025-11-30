import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login/login';
import { authGuard } from './guards/auth-guard';
import { ParkingDashboard } from './components/parking-dashboard/parking-dashboard/parking-dashboard';
import { SlotStatus } from './components/slot-status/slot-status/slot-status';
import { ParkingEntry } from './components/parking-entry/parking-entry/parking-entry';
import { ParkingExit } from './components/parking-exit/parking-exit/parking-exit';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {
        path: '',
        canActivate: [authGuard],
        children: [
             { path: '', component: ParkingDashboard },
             { path: 'slots', component: SlotStatus },
             { path: 'entry', component: ParkingEntry },
             { path: 'exit', component: ParkingExit }
        ]
    },
    { path: '**', redirectTo: 'login' }
];
