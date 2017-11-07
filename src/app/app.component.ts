import { Component, ViewChild, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/concatAll';
import 'rxjs/add/operator/takeUntil';

const draggableHeight = 50;
const draggableWidth = 100;

@Component({
  selector: 'app-drag-drop',
  template: `
    <div>
      <div #container class="container">
        <div #draggable class="draggable"></div>
      </div>
    </div>`,
  styles: [`
    .container {
      width: 400px;
      height: 400px;
      background-color: lightgray;
    }
    .draggable {
      height: 50px;
      width: 100px;
      background-color: green;
      position: absolute;
      cursor: move;
    }
  `]
})
export class AppComponent implements AfterViewInit {

  @ViewChild('container') containerElement: ElementRef;
  @ViewChild('draggable') draggableElement: ElementRef;

  constructor(private renderer: Renderer2) {
  }

  ngAfterViewInit(): any {

    const container = this.containerElement.nativeElement;
    const draggable = this.draggableElement.nativeElement;

    const mouseDown$ = Observable.fromEvent(draggable, 'mousedown');
    const mouseMove$ = Observable.fromEvent(container, 'mousemove');
    const mouseUp$ = Observable.fromEvent(container, 'mouseup');

    const drag$ = mouseDown$
      .map(() => mouseMove$
        .filter(event => boundaryCheck(event))
        .takeUntil(mouseUp$))
      .concatAll();

    drag$.subscribe((event: MouseEvent) => {
        this.renderer.setStyle(draggable, 'left', event.clientX - (draggableWidth / 2) + 'px');
        this.renderer.setStyle(draggable, 'top', event.clientY - (draggableHeight / 2) + 'px');
      },
      error => console.log('error')
    );

    function boundaryCheck(event) {

      const leftBoundary = container.offsetLeft + (draggableWidth / 2);
      const rightBoundary = container.clientWidth + container.offsetLeft - (draggableWidth / 2);
      const topBoundary = container.offsetTop + (draggableHeight / 2);
      const bottomBoundary = container.clientWidth + container.offsetTop - (draggableHeight / 2);

      return event.clientX > leftBoundary &&
        event.clientX < rightBoundary &&
        event.clientY > topBoundary &&
        event.clientY < bottomBoundary;
    }
  }

}
