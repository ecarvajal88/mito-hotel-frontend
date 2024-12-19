import { Component, Inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReservationService } from '../../../services/reservation.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-reservation-delete-dialog',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './reservation-delete-dialog.component.html',
  styleUrl: './reservation-delete-dialog.component.css'
})
export class ReservationDeleteDialogComponent implements OnInit{
  id: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: number,
    private _dialogRef: MatDialogRef<ReservationDeleteDialogComponent>,
    private reservationService: ReservationService
  ){}

  ngOnInit(): void {
      this.id = this.data;
  }

  close(){
    this._dialogRef.close();
  }

  operate(){
    if(this.id != null && this.id > 0){
      this.reservationService.delete(this.id)
      .pipe(switchMap( () => this.reservationService.findAll()))
      .subscribe(data => {
        this.reservationService.setReservationChange(data);
        this.reservationService.setMessageChange('DELETED!');
      });
    }

    this.close();
  }
}
