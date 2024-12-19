import { Component, Inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Room } from '../../../model/room';
import { RoomService } from '../../../services/room.service';
import { switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-room-dialog',
  standalone: true,
  imports: [MaterialModule, FormsModule, CommonModule],
  templateUrl: './room-dialog.component.html',
  styleUrl: './room-dialog.component.css'
})
export class RoomDialogComponent implements OnInit{
  room: Room;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Room,
    private _dialogRef: MatDialogRef<RoomDialogComponent>,
    private roomService: RoomService
  ){}

  ngOnInit(): void {
    this.room = {... this.data};
  }

  close(){
    this._dialogRef.close();
  }

  operate(){
    if(this.room != null && this.room.idRoom > 0){
      //UPDATE
      this.roomService.update(this.room.idRoom, this.room)
      .pipe(switchMap( () => this.roomService.findAll()))
      .subscribe(data => {
        this.roomService.setRoomChange(data);
        this.roomService.setMessageChange('UPDATED!');
      })
    } else {
      //INSERT
      this.room.available = true;
      this.roomService.save(this.room)
      .pipe(switchMap( () => this.roomService.findAll()))
      .subscribe(data => {
        this.roomService.setRoomChange(data);
        this.roomService.setMessageChange('CREATED!');
      });
    }

    this.close();
  }

}
