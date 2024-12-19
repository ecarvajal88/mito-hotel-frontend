import { Component, Inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { FormsModule } from '@angular/forms';
import { Reservation } from '../../../model/reservation';
import { Room } from '../../../model/room';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReservationService } from '../../../services/reservation.service';
import { RoomService } from '../../../services/room.service';
import { switchMap } from 'rxjs';
import { format } from 'date-fns';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reservation-dialog',
  standalone: true,
  imports: [MaterialModule, FormsModule, CommonModule],
  templateUrl: './reservation-dialog.component.html',
  styleUrl: './reservation-dialog.component.css'
})
export class ReservationDialogComponent implements OnInit{
  reservation: Reservation;
  rooms: Room[];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Reservation,
    private _dialogRef: MatDialogRef<ReservationDialogComponent>,
    private reservationService: ReservationService,
    private roomService: RoomService
  ){}

  ngOnInit(): void {
    this.reservation = {... this.data};
    this.roomService.findAll().subscribe(data => this.rooms = data);
  }

  close(){
    this._dialogRef.close();
  }

  operate(){
    if(this.reservation != null && this.reservation.idReservation > 0){
      //UPDATE
      this.reservationService.update(this.reservation.idReservation, this.reservation)
      .pipe(switchMap( () => this.reservationService.findAll()))
      .subscribe(data => {
        this.reservationService.setReservationChange(data);
        this.reservationService.setMessageChange('UPDATED!');
      })
    } else {
      //INSERT
      this.reservation.checkInDate = format(this.reservation.checkInDate, "yyy-MM-dd'T'15:00:00");
      this.reservation.checkOutDate = format(this.reservation.checkOutDate, "yyy-MM-dd'T'12:00:00");
      this.reservationService.save(this.reservation)
      .pipe(switchMap( () => this.reservationService.findAll()))
      .subscribe(data => {
        this.reservationService.setReservationChange(data);
        this.reservationService.setMessageChange('CREATED!');
      });
    }

    this.close();
  }
}
