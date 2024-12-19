import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { Reservation } from '../../model/reservation';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ReservationService } from '../../services/reservation.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReservationDeleteDialogComponent } from './reservation-delete-dialog/reservation-delete-dialog.component';
import { ReservationDialogComponent } from './reservation-dialog/reservation-dialog.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [MaterialModule, DatePipe],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css'
})
export class ReservationComponent implements OnInit{
  dataSource: MatTableDataSource<Reservation>;
  columnsDefinitions = [
    { def: 'idReservation', label: 'idReservation', hide: true},
    { def: 'customerName', label: 'customerName', hide: false},
    { def: 'checkInDate', label: 'checkInDate', hide: false},
    { def: 'checkOutDate', label: 'checkOutDate', hide: false},
    { def: 'room', label: 'room', hide: false},
    { def: 'actions', label: 'actions', hide: false}
  ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private reservationService: ReservationService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar
  ){

  }

  ngOnInit(): void {
    this.reservationService.findAll().subscribe(data => this.createTable(data));

    this.reservationService.getReservationChange().subscribe(data => this.createTable(data));
    this.reservationService.getMessageChange().subscribe(data => this._snackBar.open(data, 'INFO', {duration: 2000}));
  }

  createTable(data: Reservation[]){
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

  openDialog(reservation?: Reservation){
    this._dialog.open(ReservationDialogComponent, {
      width: '750px',
      data: reservation,
      disableClose: true
    });
  }

  delete(id: number){
    this._dialog.open(ReservationDeleteDialogComponent, {
      width: '200px',
      data: id
    });
  }
}
