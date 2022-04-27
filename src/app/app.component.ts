import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Subscription, fromEvent, interval } from 'rxjs';
import { buffer, filter, map } from "rxjs/operators";
import * as moment from "moment"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy, AfterViewInit {
  timer: any;
  seconds: number = 0;

  @ViewChild('wait', { static: true }) wait!: ElementRef;
  btnWait!: Subscription;
  isEnable: boolean = false;
  display: number = 0;
  
  ngAfterViewInit() {
    this.btnWait = fromEvent(this.wait.nativeElement, 'click').
    pipe(
      buffer(interval(300)),
      filter((clicks) => clicks.length === 2 )
    ).subscribe(()=> {
      this.timer.unsubscribe();
      this.isEnable = false
    })
  }

  ngOnDestroy() {
    this.btnWait.unsubscribe()
    this.timer.unsubscribe()
  }

  onStart() {
    this.isEnable = true;
    this.timer = interval(1000)
    .pipe(map(() => {
      this.seconds++
    })
    ).subscribe(() => this.display = this.seconds)
  }
  onStop() {
    if (this.timer) {
      this.timer.unsubscribe();
      this.resetCounter();
      this.isEnable = false;
    }
  }

  resetCounter() {
    this.seconds = 0;
  }

  onReset() {
    this.timer.unsubscribe();
    this.resetCounter();
    this.onStart();
  }

  formatTime(value: number): string {
    return moment().startOf("day").seconds(value).format("HH:mm:ss");
  }
}



