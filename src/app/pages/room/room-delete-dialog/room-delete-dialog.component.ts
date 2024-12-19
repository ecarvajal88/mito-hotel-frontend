import { Component, Inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RoomService } from '../../../services/room.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-room-delete-dialog',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './room-delete-dialog.component.html',
  styleUrl: './room-delete-dialog.component.css'
})
export class RoomDeleteDialogComponent implements OnInit{
  id: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: number,
    private _dialogRef: MatDialogRef<RoomDeleteDialogComponent>,
    private roomService: RoomService
  ){}

  ngOnInit(): void {
      this.id = this.data;
  }

  close(){
    this._dialogRef.close();
  }

  operate(){
    if(this.id != null && this.id > 0){
      this.roomService.delete(this.id)
      .pipe(switchMap( () => this.roomService.findAll()))
      .subscribe(data => {
        this.roomService.setRoomChange(data);
        this.roomService.setMessageChange('DELETED!');
      });
    }

    this.close();
  }

}
