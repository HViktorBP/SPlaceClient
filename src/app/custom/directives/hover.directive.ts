import {Directive, ElementRef, HostListener, Renderer2} from '@angular/core';

@Directive({
  selector: '[appHover]',
  standalone: true
})
export class HoverDirective {

  constructor(private element : ElementRef,
              private renderer : Renderer2) { }

  @HostListener('mouseenter') onMouseEnter() {
    if (!this.element.nativeElement.disabled) {
      this.renderer.setStyle(
        this.element.nativeElement,
        'boxShadow',
        '14px 15px 26px -9px rgba(0,0,0,0.32)'
      )
      this.renderer.setStyle(
        this.element.nativeElement,
        'transition',
        '0.3s'
      )
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.renderer.setStyle(
      this.element.nativeElement,
      'boxShadow',
      'none'
    )
  }
}
