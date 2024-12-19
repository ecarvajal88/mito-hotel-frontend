import { Component, OnInit, ViewChild } from '@angular/core';
import { RoomService } from '../../services/room.service';
import { Room } from '../../model/room';
import { MaterialModule } from '../../material/material.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RoomDialogComponent } from './room-dialog/room-dialog.component';
import { RoomDeleteDialogComponent } from './room-delete-dialog/room-delete-dialog.component';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './room.component.html',
  styleUrl: './room.component.css'
})
export class RoomComponent implements OnInit{

  dataSource: MatTableDataSource<Room>;
  columnsDefinitions = [
    { def: 'idRoom', label: 'idRoom', hide: true},
    { def: 'number', label: 'number', hide: false},
    { def: 'type', label: 'type', hide: false},
    { def: 'price', label: 'price', hide: false},
    { def: 'actions', label: 'actions', hide: false}
  ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private roomService: RoomService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar
  ){

  }

  ngOnInit(): void {
    this.roomService.findAll().subscribe(data => this.createTable(data));

    this.roomService.getRoomChange().subscribe(data => this.createTable(data));
    this.roomService.getMessageChange().subscribe(data => this._snackBar.open(data, 'INFO', {duration: 2000}));
  }

  createTable(data: Room[]){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getDisplayedColumns(){
    return this.columnsDefinitions.filter(cd => !cd.hide).map(cd => cd.def);
  }

  applyFilter(e: any){
    this.dataSource.filter = e.target.value.trim();
  }

  openDialog(room?: Room){
    this._dialog.open(RoomDialogComponent, {
      width: '750px',
      data: room,
      disableClose: true
    });
  }

  delete(id: number){
    this._dialog.open(RoomDeleteDialogComponent, {
      width: '200px',
      data: id
    });
  }
}
