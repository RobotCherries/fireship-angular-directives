import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
import { interval, Observable, Subject } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';

@Directive({
  selector: '[appHoldable]'
})
export class HoldableDirective {

  @Output() holdTime: EventEmitter<number> = new EventEmitter();

  state: Subject<string> = new Subject();
  cancel: Observable<string>;

  constructor() {

    this.cancel = this.state.pipe(
      filter((stateValue: string) => stateValue === 'cancel'),
      tap(() => {
        console.log('%c stopped hold', 'color: #ec6969; font-weight: bold;');
        console.log(0);
        this.holdTime.emit(0);
      })
    );

  }

  @HostListener('mouseup', ['$event'])
  @HostListener('mouseleave', ['$event'])
  onExit(): void {
    this.state.next('cancel');
  }

  @HostListener('mousedown', ['$event'])
  onHold(): void {
    const miliseconds = 100;

    interval(miliseconds).pipe(
      takeUntil(this.cancel),
      tap((iteration: number) => {
        console.log('%c started hold', 'color: #5fba7d; font-weight: bold;');
        console.log(iteration * miliseconds);
        this.holdTime.emit(iteration * miliseconds);
      }),

    ).subscribe();
  }
}
