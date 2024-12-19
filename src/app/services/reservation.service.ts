import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { GenericService } from './generic.service';
import { Subject } from 'rxjs';
import { Reservation } from '../model/reservation';

@Injectable({
  providedIn: 'root'
})
export class ReservationService extends GenericService<Reservation>{
  private reservationChange: Subject<Reservation[]> = new Subject<Reservation[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/reservations`);
  }

  setReservationChange(data: Reservation[]){
    this.reservationChange.next(data);
  }

  getReservationChange(){
    return this.reservationChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
